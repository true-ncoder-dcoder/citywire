import {publisherFeeds,readFeed,parseFeed,mergeStories,type FeedSource} from '../../../lib/news-feeds';
export async function GET(request:Request){
 const p=new URL(request.url).searchParams,city=p.get('city')?.trim()||'',category=p.get('category')||'news',region=p.get('region')?.trim()||'';
 if(region.length>80||/[^\p{L}\p{M}\s.'-]/u.test(region)||!/^[\p{L}\p{M}\s.'-]{2,80}$/u.test(city)||!['news','events','traffic'].includes(category))return Response.json({error:'Invalid city or category'},{status:400});
 const extra=category==='events'?'(festival OR concert OR exhibition OR theatre OR "things to do") when:7d':category==='traffic'?'(traffic OR diversion OR "road closure" OR "traffic advisory") when:2d':'when:2d';
 const google:FeedSource={name:'Google News',host:'news.google.com',aggregated:true,url:'https://news.google.com/rss/search?'+new URLSearchParams({q:'"'+city+'" '+region+' India '+extra,hl:'en-IN',gl:'IN',ceid:'IN:en'})};
 const feeds=[google,...publisherFeeds];
 const results=await Promise.allSettled(feeds.map(async feed=>parseFeed(await readFeed(feed),feed,city)));
 if(results.every(r=>r.status==='rejected'))return Response.json({error:'News sources unavailable'},{status:502});
 const unavailableSources=feeds.filter((_,i)=>results[i].status==='rejected').map(f=>f.name);
 const items=mergeStories(results.flatMap(r=>r.status==='fulfilled'?r.value:[]),category);
 return Response.json({items,updated:new Date().toISOString(),unavailableSources},{headers:{'Cache-Control':'public, max-age=300'}});
}
