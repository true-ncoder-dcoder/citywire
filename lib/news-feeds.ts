export type Story={title:string;url:string;source:string;date:string};
export type FeedSource={name:string;url:string;host:string;aggregated?:boolean};
export const publisherFeeds:FeedSource[]=[
 {name:'The Hindu',url:'https://www.thehindu.com/news/cities/feeder/default.rss',host:'thehindu.com'},
 {name:'Hindustan Times',url:'https://www.hindustantimes.com/feeds/rss/cities/rssfeed.xml',host:'hindustantimes.com'},
 {name:'The Times of India',url:'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms',host:'timesofindia.indiatimes.com'},
];
function decode(s:string){return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&#(x[\da-f]+|\d+);/gi,(_,v)=>{const n=v[0].toLowerCase()==='x'?parseInt(v.slice(1),16):Number(v);return n>0&&n<=0x10ffff?String.fromCodePoint(n):''}).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,'&')}
function tag(s:string,t:string){return decode(s.match(new RegExp('<'+t+'(?:\\s[^>]*)?>([\\s\\S]*?)</'+t+'>','i'))?.[1]||'')}
function plain(s:string){return s.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()}
const aliases:Record<string,string[]>={bengaluru:['Bangalore'],chennai:['Madras'],kolkata:['Calcutta'],mumbai:['Bombay'],kochi:['Cochin'],mysuru:['Mysore'],visakhapatnam:['Vizag'],alappuzha:['Alleppey']};
export function cityMatches(text:string,city:string){
 const words=[city,...(aliases[city.toLowerCase()]||[])];
 return words.some(word=>new RegExp('(?:^|[^\\p{L}\\p{N}])'+word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=$|[^\\p{L}\\p{N}])','iu').test(text));
}
export function parseFeed(xml:string,feed:FeedSource,city:string):Story[]{
 if(!/<rss\b/i.test(xml))throw Error('Invalid RSS feed');
 return [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].flatMap(([,item])=>{
  const source=feed.aggregated?plain(tag(item,'source')):feed.name;
  const raw=plain(tag(item,'title'));
  const title=source&&raw.endsWith(' - '+source)?raw.slice(0,-source.length-3):raw;
  const url=tag(item,'link').trim();
  try{const parsed=new URL(url);if(parsed.protocol!=='https:'||parsed.username||parsed.password||!(parsed.hostname===feed.host||parsed.hostname.endsWith('.'+feed.host)))return [];}catch{return [];}
  // Google is already queried by city; broad publisher feeds must match it locally.
  if(!feed.aggregated&&!cityMatches(title+' '+plain(tag(item,'description'))+' '+new URL(url).pathname.replace(/%20/g,' '),city))return [];
  return title&&source?[{title,url,source,date:tag(item,'pubDate')}]:[];
 });
}
export function mergeStories(stories:Story[],category:string,now=Date.now()):Story[]{
 const oldest=now-(category==='events'?7:2)*86400000;
 const seenTitles=new Set<string>(),seenUrls=new Set<string>();
 return stories.filter(s=>{
  const d=Date.parse(s.date);
  return Number.isFinite(d)&&d>=oldest&&d<=now&&(category!=='traffic'||/traffic|road|highway|commut|congestion|diversion|flyover|expressway|metro|rail|bridge/i.test(s.title))&&(category!=='events'||/festival|concert|exhibition|theatre|theater|event|things to do/i.test(s.title));
 }).sort((a,b)=>Date.parse(b.date)-Date.parse(a.date)||Number(a.url.includes('news.google.com'))-Number(b.url.includes('news.google.com'))).filter(s=>{
  const title=s.title.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
  const url=new URL(s.url);url.hash='';for(const key of [...url.searchParams.keys()])if(key.startsWith('utm_'))url.searchParams.delete(key);
  if(seenTitles.has(title)||seenUrls.has(url.href))return false;
  seenTitles.add(title);seenUrls.add(url.href);return true;
 }).slice(0,40).map(s=>({...s,date:new Date(s.date).toISOString()}));
}
const publisherCache=new Map<string,{expires:number;value:Promise<string>}>();
export async function readFeed(feed:FeedSource):Promise<string>{
 const cached=publisherCache.get(feed.url);
 if(!feed.aggregated&&cached&&cached.expires>Date.now())return cached.value;
 const value=(async()=>{
  const response=await fetch(feed.url,{signal:AbortSignal.timeout(12000)});
  if(!response.ok)throw Error('Feed unavailable: '+response.status);
  const xml=await response.text();if(!/<rss\b/i.test(xml))throw Error('Invalid feed');return xml;
 })();
 if(!feed.aggregated){publisherCache.set(feed.url,{expires:Date.now()+300000,value});void value.catch(()=>{if(publisherCache.get(feed.url)?.value===value)publisherCache.delete(feed.url);});}
 return value;
}
