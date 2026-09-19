import {extractLiveVideoId} from '../../../lib/tv-source';
// Refresh the broadcaster's published YouTube embed; live video IDs can change.
export async function GET(request:Request){
  const channel=new URL(request.url).searchParams.get('channel');
  if(channel!=='puthiya'&&channel!=='india-today')return Response.json({error:'Unknown channel'},{status:400});
  try{
    const r=await fetch(channel==='india-today'?'https://www.indiatoday.in/youtube':'https://www.puthiyathalaimurai.com/live-tv',{signal:AbortSignal.timeout(12000),cache:'no-store'});
    if(!r.ok)throw Error('Source unavailable');
    const id=extractLiveVideoId(await r.text());
    if(!id)throw Error('Player not found');
    return Response.json({embed:'https://www.youtube.com/embed/'+id+'?autoplay=1&mute=1&playsinline=1'},{headers:{'Cache-Control':'no-store'}});
  }catch{return Response.json({error:'Broadcast source unavailable'},{status:502,headers:{'Cache-Control':'no-store'}})}
}
