import {parseEvents} from "../../../lib/event-listings";
export async function GET(request:Request){
 const p=new URL(request.url).searchParams,city=p.get("city")||"",state=p.get("state")||"",lat=Number(p.get("lat")),lon=Number(p.get("lon")),radius=Number(p.get("radius")||20);
 if(!/^[\p{L}\p{M}\s.'-]{2,80}$/u.test(city)||state.length>80||!Number.isFinite(lat)||!Number.isFinite(lon)||lat<6||lat>38||lon<68||lon>98||![10,20,50].includes(radius))return Response.json({error:"Invalid city or search radius"},{status:400});
 const source="https://allevents.in/plugin/city-events-plugin-new.php?"+new URLSearchParams({city,state,latitude:String(lat),longitude:String(lon),radius:String(radius),popular:"0",keywords:"All",count:"40",heading:"0"});
 try{
  const r=await fetch(source,{signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error();
  const html=await r.text();if(!html.includes("event-item")&&!/no events|no upcoming|no event/i.test(html))throw Error("Provider format unavailable");
  return Response.json({items:parseEvents(html),source,updated:new Date().toISOString()},{headers:{"Cache-Control":"public, max-age=600"}});
 }catch{return Response.json({error:"Upcoming events are temporarily unavailable. Open AllEvents to check listings directly."},{status:502})}
}
