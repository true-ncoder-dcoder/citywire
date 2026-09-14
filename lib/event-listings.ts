export type CityEvent={id:string;title:string;url:string;venue:string;start:string;image:string|null;price:string|null};
function text(s:string){return s.replace(/<[^>]*>/g,"").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#039;|&apos;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&#(\d+);/g,(_,n)=>{const code=Number(n);return code>0&&code<=0x10ffff?String.fromCodePoint(code):""}).replace(/\s+/g," ").trim()}
function span(s:string,name:string){return text(s.match(new RegExp('<span[^>]*class=["\\\'][^"\\\']*\\b'+name+'\\b[^"\\\']*["\\\'][^>]*>([\\s\\S]*?)</span>'))?.[1]||"")}
export function parseEvents(html:string,now=Date.now()):CityEvent[]{
 const seen=new Set<string>(),events:CityEvent[]=[];
 for(const m of html.matchAll(/<li\b([^>]*\bdata-eid=["'](\d+)["'][^>]*)>([\s\S]*?)<\/li>/gi)){
  const id=m[2],s=m[3],title=text(s.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)?.[1]||""),venue=span(s,"venue");
  const rawDate=span(s,"up-time-display").replace(/\bat\b/,"").trim();
  // The provider's Indian city embed supplies English local dates, e.g. Sun Sep 20 2026 at 04:00 pm.
  const d=rawDate.match(/(?:[A-Za-z]{3}\s+)?([A-Za-z]{3})\s+(\d{1,2})\s+(\d{4})\s+(\d{1,2}):(\d{2})\s*(am|pm)/i);
  if(!d)continue;
  const month=["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"].indexOf(d[1].toLowerCase())+1;
  const hour=(Number(d[4])%12)+(d[6].toLowerCase()==="pm"?12:0);
  const start=d[3]+"-"+String(month).padStart(2,"0")+"-"+d[2].padStart(2,"0")+"T"+String(hour).padStart(2,"0")+":"+d[5]+":00+05:30";
  const date=Date.parse(start);if(!month||!Number.isFinite(date)||date<now||seen.has(id))continue;
  let url:URL;try{url=new URL(text(m[1].match(/\bdata-link=["']([^"']+)/)?.[1]||""))}catch{continue}
  if(url.protocol!=="https:"||url.hostname!=="allevents.in"||!title||!venue)continue;
  url.search=""; // Link directly to the event; no inherited affiliate attribution.
  let image=s.match(/background-image:\s*url\((https:\/\/[^)]+)\)/)?.[1]||null;
  if(image){try{const u=new URL(image);if(u.protocol!=="https:"||!u.hostname.endsWith(".allevents.in"))image=null}catch{image=null}}
  const price=span(s,"price")||span(s,"ticket-price")||null;
  seen.add(id);events.push({id,title,url:url.href,venue,start,image,price});
 }
 return events.sort((a,b)=>Date.parse(a.start)-Date.parse(b.start)).slice(0,24);
}
