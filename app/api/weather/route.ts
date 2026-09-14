export async function GET(request:Request){
 const p=new URL(request.url).searchParams,lat=Number(p.get('lat')),lon=Number(p.get('lon'));
 if(!p.has('lat')||!p.has('lon')||!Number.isFinite(lat)||!Number.isFinite(lon)||lat<6||lat>38||lon<68||lon>98)return Response.json({error:'Invalid Indian coordinates'},{status:400});
 try{const u='https://api.open-meteo.com/v1/forecast?'+new URLSearchParams({latitude:String(lat),longitude:String(lon),current:'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m',daily:'temperature_2m_max,temperature_2m_min,precipitation_probability_max',timezone:'Asia/Kolkata',forecast_days:'3'});const r=await fetch(u,{signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error();return Response.json(await r.json(),{headers:{'Cache-Control':'public, max-age=300'}})}catch{return Response.json({error:'Weather unavailable'},{status:502})}
}
