import assert from 'node:assert/strict';
import {cities} from '../lib/cities.ts';
let count=0,direct=0;
for(let i=0;i<cities.length;i+=5){
 await Promise.all(cities.slice(i,i+5).map(async city=>{
  const response=await fetch('http://localhost:5173/api/feed?'+new URLSearchParams({city:city.name,region:city.admin1,category:'news'}),{signal:AbortSignal.timeout(25000)});
  assert.equal(response.status,200,city.name);
  const data=await response.json();assert.ok(Array.isArray(data.items));
  for(let j=1;j<data.items.length;j++)assert.ok(Date.parse(data.items[j-1].date)>=Date.parse(data.items[j].date),city.name+' ordering');
  const extras=data.items.filter(s=>!new URL(s.url).hostname.endsWith('google.com')).length;
  direct+=extras;count++;
  console.log(`${city.name}: ${data.items.length} items, ${extras} direct publisher links, unavailable: ${data.unavailableSources.join(',')||'none'}`);
 }));
}
console.log(`PASS ${count} cities; ${direct} direct publisher articles; newest-first ordering verified.`);
