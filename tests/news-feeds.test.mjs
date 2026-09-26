import test from 'node:test';
import assert from 'node:assert/strict';
import {parseFeed,mergeStories,cityMatches,publisherFeeds,readFeed} from '../lib/news-feeds.ts';
import {cities} from '../lib/cities.ts';
const now=Date.parse('2026-09-26T12:00:00Z');
const story=(title,date,url='https://thehindu.com/'+encodeURIComponent(title))=>({title,date,url,source:'The Hindu'});
test('sorts by absolute publication time, not city mention or timezone text',()=>{
 const result=mergeStories([story('Chennai old','2026-09-26T15:00:00+05:30'),story('Latest local report','2026-09-26T10:30:00Z'),story('Middle','2026-09-26T16:00:00+05:30')],'news',now);
 assert.equal(result[0].title,'Latest local report');assert.equal(result.at(-1).title,'Chennai old');
 assert.ok(result.every((s,i)=>!i||Date.parse(result[i-1].date)>=Date.parse(s.date)));
});
test('filters invalid, future and stale timestamps and deduplicates before limiting',()=>{
 const result=mergeStories([story('News!','2026-09-26T11:00:00Z'),story('news','2026-09-26T10:00:00Z'),story('Future','2026-09-27'),story('Bad','no date'),story('Stale','2026-09-20')],'news',now);
 assert.deepEqual(result.map(s=>s.title),['News!']);
});
test('matches aliases and whole city names, not substrings',()=>{
 assert.ok(cityMatches('Bangalore road news','Bengaluru'));assert.ok(cityMatches('COCHIN news','Kochi'));
 assert.ok(!cityMatches('Bodhgaya report','Gaya'));
});
test('all cities can use every added publisher feed, with local filtering',()=>{
 for(const city of [...cities,{name:'Darjeeling'}])for(const feed of publisherFeeds){
  const item=title=>`<item><title><![CDATA[${title}]]></title><link>https://${feed.host}/news/local</link><pubDate>Sat, 26 Sep 2026 10:00:00 GMT</pubDate></item>`;
  const result=parseFeed('<rss>'+item(city.name+' civic update')+item('Unrelated town update')+'</rss>',feed,city.name);
  assert.equal(result.length,1);assert.equal(result[0].source,feed.name);
 }
});
test('rejects unsafe article links and non-RSS responses',()=>{
 assert.throws(()=>parseFeed('<html>Unavailable</html>',publisherFeeds[0],'Chennai'));
 assert.deepEqual(parseFeed('<rss><item><title>Chennai</title><link>https://thehindu.com.evil.test/article</link></item></rss>',publisherFeeds[0],'Chennai'),[]);
});
test('one failed feed does not contaminate cached feeds and failures retry',async()=>{
 const original=globalThis.fetch;let calls=0;
 const feed={name:'Test',url:'https://test.invalid/rss',host:'test.invalid'};
 globalThis.fetch=async()=>{calls++;if(calls===1)throw Error('offline');return new Response('<rss></rss>')};
 try{await assert.rejects(readFeed(feed));assert.equal(await readFeed(feed),'<rss></rss>');await readFeed(feed);assert.equal(calls,2);}finally{globalThis.fetch=original;}
});
