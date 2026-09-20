import {useEffect,useRef,useState} from 'react';
import {getState} from '../services/api';
export function useFacilityStream(){
 const [state,setState]=useState(null); const [error,setError]=useState(''); const alive=useRef(true);
 useEffect(()=>{alive.current=true;getState().then(s=>alive.current&&setState(s)).catch(e=>alive.current&&setError(e.message));
  const es=new EventSource('/api/stream'); es.onmessage=e=>{try{const d=JSON.parse(e.data);if(d.type==='state'&&alive.current)setState(d.state)}catch{}}; es.onerror=()=>{};
  return()=>{alive.current=false;es.close()};
 },[]); return {state,error};
}
