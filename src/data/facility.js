export const TERMINALS = {
  'Terminal 1': {
    'Floor 1':['Public Restrooms','Food Court','Arrivals','Departures','Staff Areas'],
    'Floor 2':['Public Restrooms','Food Court','Departures','Staff Areas'],
    'Floor 3':['Public Restrooms','Staff Areas','Administration']
  },
  'Terminal 2': {
    'Ground Floor':['Arrivals','Baggage Claim','International Arrivals','Restrooms','Arrivals Public Concourse','Lounge Access'],
    'First Floor':['Check-in Hall','Security Checkpoint','Security Hold Area','Restrooms','Gates 1–5','Gates 6–10','Elysian Lounge'],
    'Second Floor':['Staff Areas','Airside Operations','Service Concourse']
  },
  'Terminal 3': {
    'Floor 1':['Public Restrooms','Gate Lounge','Administration'],
    'Floor 2':['Public Restrooms','Gate Lounge','Staff Areas'],
    'Floor 3':['Administration','Staff Areas']
  }
};
export const FILTERS=['All','Toilets','Urinals','Sinks','Dryers','Accessible','Baby Care'];
export const floorsFor=t=>Object.keys(TERMINALS[t]||{});
export const zonesFor=(t,f)=>TERMINALS[t]?.[f]||[];
export const TERMINAL2_ZONE_INFO={
  'Ground Floor':{title:'Arrivals & Ground Exit',description:'Incoming passenger flow, baggage retrieval and ground transport.',zones:[
    ['Baggage Claim','5 baggage carousel belts positioned horizontally across the arrival hall.'],['International Arrivals','Customs and immigration booths before the baggage belts.'],['Restrooms','Facilities behind Carousel 2 and Carousel 4, plus the public concourse after the secure baggage area.'],['Arrivals Public Concourse','Public restroom access immediately after the secure baggage area, beside exit gates and car-rental counters.'],['Lounge Access','Ground-floor lounge entrance near Gate 5A / Gate 6.']]},
  'First Floor':{title:'Departures, Security & Gates',description:'Departure processing from check-in through security hold and boarding gates.',zones:[
    ['Security Checkpoint','Central zone after check-in counters with security screening and frisking booths.'],['Security Hold Area','Main passenger lounge after security.'],['Gates 1–5','Left and center wings of the security hold area.'],['Gates 6–10','Right wing providing access to remaining aerobridges.'],['Restrooms','Pre-security restrooms at both ends; post-security sets in retail and near Gate 2 and Gate 6.'],['Elysian Lounge','Located behind Gate 2, near KFC.']]},
  'Second Floor':{title:'Staff & Airside Operations',description:'Operational support areas for terminal staff and service teams.',zones:[
    ['Staff Areas','Controlled-access staff work zones.'],['Airside Operations','Operational support space for terminal teams.'],['Service Concourse','Service circulation and facility support route.']]}
};
export const initialFixtures=[
['M-W202-T01','Toilet',"Men's • W202",18,24,.03,0,28,100,'West wall · Bay 01'],['M-W202-T02','Toilet',"Men's • W202",18,50,.02,0,31,100,'West wall · Bay 02'],['M-W202-T03','Toilet',"Men's • W202",18,76,.02,0,19,100,'West wall · Bay 03'],
['M-W202-U01','Urinal',"Men's • W202",52,22,.03,0,42,100,'North wall · Bay 01'],['M-W202-U02','Urinal',"Men's • W202",52,40,.06,0,37,100,'North wall · Bay 02'],['M-W202-U03','Urinal',"Men's • W202",52,58,.04,0,34,99,'North wall · Bay 03'],
['M-W202-S01','Sink',"Men's • W202",78,83,.02,0,0,100,'East wall · Sink 01'],['M-W202-S02','Sink',"Men's • W202",91,83,.02,0,0,100,'East wall · Sink 02'],
['F-W203-T01','Toilet',"Women's • W203",18,24,.03,0,35,100,'West wall · Bay 01'],['F-W203-T02','Toilet',"Women's • W203",18,50,.02,0,29,100,'West wall · Bay 02'],['F-W203-T03','Toilet',"Women's • W203",18,76,.03,0,33,100,'West wall · Bay 03'],['F-W203-T04','Toilet',"Women's • W203",42,24,.03,0,40,100,'North wall · Bay 04'],['F-W203-T05','Toilet',"Women's • W203",42,50,.02,0,32,100,'North wall · Bay 05'],
['F-W203-S01','Sink',"Women's • W203",78,83,.02,0,0,100,'East wall · Sink 01'],['F-W203-S02','Sink',"Women's • W203",91,83,.02,0,0,100,'East wall · Sink 02'],
['A-W204-01','Accessible','Accessible • W204',15,50,.02,0,12,100,'Lobby · Accessible bay'],['B-W205-01','Baby Care','Baby Care • W205',85,50,.01,0,0,100,"Women's adjacent · Baby care"],['M-W202-D01','Dryer',"Men's • W202",84,64,0,0,0,100,'East wall · Dryer 01']
].map(([id,type,room,x,y,flow,occ,flushes,health,position])=>({id,type,room,x,y,flow,occ,flushes,health,position,status:'normal'}));
export const iconForType={};
