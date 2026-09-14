export async function GET(request:Request){
 const q=new URL(request.url).searchParams.get('q')?.trim()||'';
 if(q.length<2||q.length>80)return Response.json({error:'Enter 2–80 characters'},{status:400});
 try{const r=await fetch('https://geocoding-api.open-meteo.com/v1/search?'+new URLSearchParams({name:q,count:'15',language:'en',countryCode:'IN'}),{signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error();const d=await r.json() as {results?:any[]};return Response.json((d.results||[]).filter((c:any)=>c.country_code==='IN'&&c.feature_code?.startsWith('PPL')).map((c:any)=>({id:c.id,name:c.name,admin1:c.admin1||'India',latitude:c.latitude,longitude:c.longitude})),{headers:{'Cache-Control':'public, max-age=3600'}})}catch{return Response.json({error:'City search unavailable'},{status:502})}
}
