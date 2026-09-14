// Refresh the broadcaster's published YouTube embed; live video IDs can change.
export async function GET(request:Request){
  if(new URL(request.url).searchParams.get('channel')!=='puthiya')return Response.json({error:'Unknown channel'},{status:400});
  try{
    const r=await fetch('https://www.puthiyathalaimurai.com/live-tv',{signal:AbortSignal.timeout(12000)});
    if(!r.ok)throw Error('Source unavailable');
    const html=(await r.text()).replaceAll('\\u002F','/');
    const id=html.match(/<iframe[^>]+src=["']https:\/\/www\.youtube\.com\/embed\/([A-Za-z0-9_-]{11})(?:[?"'])/i)?.[1];
    if(!id)throw Error('Player not found');
    return Response.json({embed:'https://www.youtube.com/embed/'+id+'?autoplay=1&mute=1&playsinline=1'},{headers:{'Cache-Control':'public, max-age=300'}});
  }catch{return Response.json({error:'Regional source unavailable'},{status:502})}
}
