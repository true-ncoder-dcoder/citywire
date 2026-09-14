// Run while npm.cmd run dev is serving localhost:5173.
import assert from 'node:assert/strict';
const cases=[
  ['current Tamil stream','/api/tv-source?channel=puthiya',200,d=>/^https:\/\/www\.youtube\.com\/embed\/[A-Za-z0-9_-]{11}\?/.test(d.embed)],
  ['unknown TV channel','/api/tv-source?channel=unknown',400,d=>!!d.error],
  ['news','/api/feed?city=Kolkata&region=West%20Bengal&category=news',200,d=>Array.isArray(d.items)],
  ['weather','/api/weather?lat=22.56263&lon=88.36304',200,d=>typeof d.current?.temperature_2m==='number'&&d.daily?.time.length===3],
  ['search','/api/cities?q=Siliguri',200,d=>d.some(c=>c.name==='Siliguri'&&c.admin1==='West Bengal')],
  ['events','/api/events?city=Kolkata&state=West%20Bengal&lat=22.56263&lon=88.36304&radius=20',200,d=>Array.isArray(d.items)&&d.items.every(e=>Date.parse(e.start)>Date.now()-600000&&e.url.startsWith('https://allevents.in/'))],
  ['traffic','/api/feed?city=Kolkata&region=West%20Bengal&category=traffic',200,d=>Array.isArray(d.items)],
  ['invalid coordinates','/api/weather?lat=hello&lon=88',400,d=>!!d.error],
  ['invalid radius','/api/events?city=Kolkata&lat=22&lon=88&radius=999',400,d=>!!d.error],
  ['invalid category','/api/feed?city=Kolkata&category=script',400,d=>!!d.error],
];
await Promise.all(cases.map(async([name,path,status,validate])=>{
  const response=await fetch('http://localhost:5173'+path,{signal:AbortSignal.timeout(20000)});
  assert.equal(response.status,status,name+' HTTP status');
  assert.ok(validate(await response.json()),name+' response');
  console.log('PASS '+name);
}));
