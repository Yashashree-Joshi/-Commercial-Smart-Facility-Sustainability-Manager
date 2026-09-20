import http from 'node:http';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');
const dbFile = path.join(dataDir, 'state.json');
fs.mkdirSync(dataDir, { recursive: true });

const baseFixtures = [
  ['M-W202-T01','Toilet',"Men's • W202",18,24,.03,0,28,100,'West wall · Bay 01'],['M-W202-T02','Toilet',"Men's • W202",18,50,.02,0,31,100,'West wall · Bay 02'],['M-W202-T03','Toilet',"Men's • W202",18,76,.02,0,19,100,'West wall · Bay 03'],
  ['M-W202-U01','Urinal',"Men's • W202",52,22,.03,0,42,100,'North wall · Bay 01'],['M-W202-U02','Urinal',"Men's • W202",52,40,.06,0,37,100,'North wall · Bay 02'],['M-W202-U03','Urinal',"Men's • W202",52,58,.04,0,34,99,'North wall · Bay 03'],
  ['M-W202-S01','Sink',"Men's • W202",78,83,.02,0,0,100,'East wall · Sink 01'],['M-W202-S02','Sink',"Men's • W202",91,83,.02,0,0,100,'East wall · Sink 02'],
  ['F-W203-T01','Toilet',"Women's • W203",18,24,.03,0,35,100,'West wall · Bay 01'],['F-W203-T02','Toilet',"Women's • W203",18,50,.02,0,29,100,'West wall · Bay 02'],['F-W203-T03','Toilet',"Women's • W203",18,76,.03,0,33,100,'West wall · Bay 03'],['F-W203-T04','Toilet',"Women's • W203",42,24,.03,0,40,100,'North wall · Bay 04'],['F-W203-T05','Toilet',"Women's • W203",42,50,.02,0,32,100,'North wall · Bay 05'],
  ['F-W203-S01','Sink',"Women's • W203",78,83,.02,0,0,100,'East wall · Sink 01'],['F-W203-S02','Sink',"Women's • W203",91,83,.02,0,0,100,'East wall · Sink 02'],
  ['A-W204-01','Accessible','Accessible • W204',15,50,.02,0,12,100,'Lobby · Accessible bay'],['B-W205-01','Baby Care','Baby Care • W205',85,50,.01,0,0,100,"Women's adjacent · Baby care"],['M-W202-D01','Dryer',"Men's • W202",84,64,0,0,0,100,'East wall · Dryer 01']
].map(([id,type,room,x,y,flow,occ,flushes,health,position])=>({id,type,room,x,y,flow,occ,flushes,health,position}));

const initial = {
  ctx: { terminal:'Terminal 1', zone:'Public Restrooms', floor:'Floor 2', mode:'Normal operation' },
  running: false,
  paused: false,
  fixtures: baseFixtures,
  incidents: [],
  tickets: [
    {id:'KT-1042',fixtureId:'M-W202-U03',issue:'Preventive check',priority:'Medium',status:'Open',source:'manual',createdAt:new Date().toISOString()},
    {id:'KT-1038',fixtureId:'F-W203-T04',issue:'Sensor calibration',priority:'Low',status:'Scheduled',source:'manual',createdAt:new Date().toISOString()},
    {id:'KT-1031',fixtureId:'M-W202-D01',issue:'Dryer inspection',priority:'Medium',status:'In progress',source:'manual',createdAt:new Date().toISOString()}
  ],
  events: []
};

function normalizeFixtures(fixtures){ return (Array.isArray(fixtures)?fixtures:baseFixtures).map(f=>({...f,status:f.status || 'normal'})); }

function load(){
  try {
    const loaded = JSON.parse(fs.readFileSync(dbFile,'utf8'));
    loaded.running = Boolean(loaded.running);
    loaded.paused = Boolean(loaded.paused);
    loaded.tickets = Array.isArray(loaded.tickets) ? loaded.tickets.map(t=>({...t,source:t.source||'manual'})) : [];
    return {...structuredClone(initial), ...loaded, fixtures:normalizeFixtures(loaded.fixtures), incidents:Array.isArray(loaded.incidents)?loaded.incidents:[], events:Array.isArray(loaded.events)?loaded.events:[]};
  } catch {
    fs.writeFileSync(dbFile, JSON.stringify(initial,null,2));
    return structuredClone(initial);
  }
}
let state = load();
const clients = new Set();
const save = () => fs.writeFileSync(dbFile, JSON.stringify(state,null,2));
const send = (res, code, payload) => { res.writeHead(code, {'Content-Type':'application/json','Cache-Control':'no-store','Access-Control-Allow-Origin':'*'}); res.end(JSON.stringify(payload)); };
const broadcast = () => { const payload = `data: ${JSON.stringify({type:'state',state})}\n\n`; for(const res of clients){ try{res.write(payload);}catch{} } };
const addEvent = (message, level='info') => { state.events.unshift({id:randomUUID(),at:new Date().toISOString(),message,level}); state.events=state.events.slice(0,40); };
const nextTicketId = () => {
  const nums = state.tickets.map(t=>Number(String(t.id).replace(/\D/g,''))).filter(Number.isFinite);
  return `KT-${Math.max(1042,...nums)+1}`;
};

function simulate(){
  if(!state.running || state.paused) return;
  const mode=state.ctx.mode;
  let leakFixture=null;
  state.fixtures=state.fixtures.map((f,i)=>{
    let flow=f.flow+(Math.random()-.5)*.012;
    let occ=Math.random()>(mode==='High traffic'?.72:.91)?1:0;
    let health=f.health;
    let status='normal';
    let flushes=f.flushes;
    if(occ && (f.type==='Toilet'||f.type==='Urinal')) flushes+=Math.random()>.86?1:0;
    if(mode==='High traffic') flow+=f.type==='Dryer'?.01:.008;
    if(mode==='Leak injection' && i===4){flow=.38+Math.random()*.06;occ=0;health=68;status='critical';leakFixture=f;}
    else if(mode==='Sensor fault' && i===4){health=45;status='attention';}
    else if(mode==='High traffic' && (i===1||i===10)){health=Math.max(82,f.health-1);status='attention';}
    else {health=mode==='Sensor fault'?Math.min(100,health+1):Math.min(100,health+2);}
    return {...f,flow:Number(Math.max(.01,flow).toFixed(2)),occ,flushes,health,status};
  });

  if(mode==='Leak injection'){
    const exists=state.incidents.some(x=>x.type==='Continuous leak'&&x.status==='Open');
    if(!exists){const inc={id:`INC-${Date.now().toString().slice(-6)}`,type:'Continuous leak',severity:'Critical',fixtureId:leakFixture?.id||'M-W202-U02',status:'Open',createdAt:new Date().toISOString()};state.incidents.unshift(inc);addEvent(`CRITICAL: continuous leak detected on ${inc.fixtureId}`,'critical');}
    const incident=state.incidents.find(x=>x.type==='Continuous leak'&&x.status==='Open');
    if(incident && Date.now()-new Date(incident.createdAt).getTime()>4500 && !state.tickets.some(t=>t.fixtureId===incident.fixtureId&&t.issue.includes('Leak')&&t.status!=='Resolved')){const ticket={id:nextTicketId(),fixtureId:incident.fixtureId,issue:'Continuous leak investigation',priority:'Critical',status:'Open',source:'simulated',createdAt:new Date().toISOString()};state.tickets.unshift(ticket);addEvent(`CRITICAL: maintenance ticket ${ticket.id} created for ${ticket.fixtureId}`,'critical');}
  } else if(mode==='Sensor fault'){
    const existing=state.incidents.some(x=>x.type==='Sensor fault'&&x.status==='Open');
    if(!existing){const inc={id:`INC-${Date.now().toString().slice(-6)}`,type:'Sensor fault',severity:'Attention',fixtureId:state.fixtures[4]?.id||'M-W202-U02',status:'Open',createdAt:new Date().toISOString()};state.incidents.unshift(inc);addEvent(`ATTENTION: sensor degradation detected on ${inc.fixtureId}`,'warning');}
    if(!state.tickets.some(t=>t.fixtureId===state.fixtures[4]?.id&&t.issue.includes('Sensor')&&t.status!=='Resolved')){const ticket={id:nextTicketId(),fixtureId:state.fixtures[4]?.id||'M-W202-U02',issue:'Sensor fault investigation',priority:'High',status:'Open',source:'simulated',createdAt:new Date().toISOString()};state.tickets.unshift(ticket);addEvent(`ATTENTION: maintenance ticket ${ticket.id} created for sensor fault`,'warning');}
  } else if(mode==='High traffic'){
    const existing=state.incidents.some(x=>x.type==='High traffic demand'&&x.status==='Open');
    if(!existing){state.incidents.unshift({id:`INC-${Date.now().toString().slice(-6)}`,type:'High traffic demand',severity:'Attention',fixtureId:'FACILITY',status:'Open',createdAt:new Date().toISOString()});addEvent('ATTENTION: high traffic demand detected','warning');}
  } else {
    state.incidents=state.incidents.filter(x=>x.type!=='Continuous leak'&&x.type!=='Sensor fault'&&x.type!=='High traffic demand');
  }

  state.tickets=state.tickets.map(t=>t.source==='simulated'&&t.status==='Open'&&mode==='Normal operation'&&Date.now()-new Date(t.createdAt).getTime()>9000?{...t,status:'Resolved',resolvedAt:new Date().toISOString()}:t);
  addEvent(`${mode} telemetry cycle completed`,mode==='Leak injection'?'critical':(mode==='Sensor fault'||mode==='High traffic')?'warning':'info');
  save();broadcast();
}
setInterval(simulate, 1200);

async function readBody(req){ let body=''; for await(const chunk of req) body+=chunk; try{return JSON.parse(body||'{}')}catch{return null;} }

const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,`http://${req.headers.host}`);
  if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,PATCH,DELETE,OPTIONS','Access-Control-Allow-Headers':'Content-Type'});return res.end();}
  if(req.method==='GET' && url.pathname==='/api/health') return send(res,200,{ok:true,service:'kohler-facility-intelligence',time:new Date().toISOString(),running:state.running});
  if(req.method==='POST' && url.pathname==='/api/auth/login'){
    const data=await readBody(req); if(!data)return send(res,400,{error:'Invalid JSON'});
    if(data.username==='admin' && data.password==='Kohler@123') return send(res,200,{token:'kohler-local-demo-token',user:{name:'Facility Admin',role:'Administrator'}});
    return send(res,401,{error:'Invalid credentials'});
  }
  if(req.method==='GET' && url.pathname==='/api/state') return send(res,200,state);
  if(req.method==='GET' && url.pathname==='/api/tickets') return send(res,200,state.tickets);
  if(req.method==='GET' && url.pathname==='/api/stream'){
    res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive','Access-Control-Allow-Origin':'*'});
    res.write(`data: ${JSON.stringify({type:'state',state})}\n\n`); clients.add(res); req.on('close',()=>clients.delete(res)); return;
  }

  if(req.method==='POST' && url.pathname==='/api/simulation/start'){
    state.running=true; state.paused=false; addEvent('Simulation started: restroom telemetry and ticket simulation are running','info'); save(); broadcast(); return send(res,200,state);
  }
  if(req.method==='POST' && url.pathname==='/api/simulation/stop'){
    state.running=false; state.paused=false; addEvent('Simulation stopped: telemetry and ticket simulation are halted','warning'); save(); broadcast(); return send(res,200,state);
  }
  if(req.method==='POST' && url.pathname==='/api/pause'){
    const data=await readBody(req); if(!data)return send(res,400,{error:'Invalid JSON'});
    state.paused=Boolean(data.paused); addEvent(state.paused?'Simulation paused':'Simulation resumed'); save(); broadcast(); return send(res,200,state);
  }
  if(req.method==='POST' && url.pathname==='/api/context'){
    const data=await readBody(req); if(!data)return send(res,400,{error:'Invalid JSON'});
    state.ctx={...state.ctx,...(data.terminal?{terminal:data.terminal}:{}),...(data.floor?{floor:data.floor}:{}),...(data.zone?{zone:data.zone}:{})};
    addEvent(`Facility context changed to ${state.ctx.terminal} · ${state.ctx.floor} · ${state.ctx.zone}`,'info'); save(); broadcast(); return send(res,200,state);
  }
  if(req.method==='POST' && url.pathname==='/api/scenario'){
    const data=await readBody(req); if(!data)return send(res,400,{error:'Invalid JSON'});
    const allowed=['Normal operation','High traffic','Leak injection','Sensor fault'];
    if(!allowed.includes(data.mode)) return send(res,400,{error:'Unsupported scenario'});
    state.ctx={...state.ctx,mode:data.mode};
    if(data.mode==='Normal operation') state.incidents=[];
    addEvent(`Scenario changed to ${data.mode}`, data.mode==='Normal operation'?'info':'warning'); save(); broadcast(); return send(res,200,state);
  }
  if(req.method==='POST' && url.pathname==='/api/tickets'){
    const data=await readBody(req); if(!data)return send(res,400,{error:'Invalid JSON'});
    const ticket={id:nextTicketId(),fixtureId:data.fixtureId||'M-W202-T01',issue:data.issue||'Maintenance requested',priority:data.priority||'Medium',status:data.status||'Open',source:'manual',createdAt:new Date().toISOString()};
    state.tickets.unshift(ticket); addEvent(`Ticket ${ticket.id} opened for ${ticket.fixtureId}`,'warning'); save(); broadcast(); return send(res,201,ticket);
  }

  const ticketMatch=url.pathname.match(/^\/api\/tickets\/([^/]+)$/);
  if(ticketMatch && (req.method==='PATCH' || req.method==='DELETE')){
    const id=decodeURIComponent(ticketMatch[1]);
    const idx=state.tickets.findIndex(t=>t.id===id); if(idx<0)return send(res,404,{error:'Ticket not found'});
    if(req.method==='DELETE'){
      state.tickets.splice(idx,1); addEvent(`Ticket ${id} removed manually`,'warning'); save(); broadcast(); return send(res,200,{ok:true});
    }
    const data=await readBody(req); if(!data)return send(res,400,{error:'Invalid JSON'});
    const allowed=['Open','In progress','Scheduled','Resolved'];
    if(data.status && !allowed.includes(data.status))return send(res,400,{error:'Unsupported ticket status'});
    state.tickets[idx]={...state.tickets[idx],...data,...(data.status==='Resolved'?{resolvedAt:new Date().toISOString()}:{})};
    addEvent(`Ticket ${id} updated${data.status?` to ${data.status}`:''}`,'info'); save(); broadcast(); return send(res,200,state.tickets[idx]);
  }
  send(res,404,{error:'Not found'});
});
server.listen(process.env.PORT||8787,'127.0.0.1',()=>console.log(`KOHLER backend listening on http://127.0.0.1:${process.env.PORT||8787}`));
