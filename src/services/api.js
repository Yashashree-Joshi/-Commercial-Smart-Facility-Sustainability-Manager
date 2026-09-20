export async function api(path, options={}){const r=await fetch(path,{headers:{'Content-Type':'application/json',...(options.headers||{})},...options});let data=null;try{data=await r.json()}catch{}if(!r.ok)throw new Error(data?.error||`Request failed: ${r.status}`);return data;}
export const getState=()=>api('/api/state');
export const createTicket=body=>api('/api/tickets',{method:'POST',body:JSON.stringify(body)});
export const updateTicket=(id,body)=>api(`/api/tickets/${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify(body)});
export const deleteTicket=id=>api(`/api/tickets/${encodeURIComponent(id)}`,{method:'DELETE'});
export const startSimulation=()=>api('/api/simulation/start',{method:'POST',body:'{}'});
export const stopSimulation=()=>api('/api/simulation/stop',{method:'POST',body:'{}'});
export const pauseSimulation=paused=>api('/api/pause',{method:'POST',body:JSON.stringify({paused})});
export const setScenario=mode=>api('/api/scenario',{method:'POST',body:JSON.stringify({mode})});
