import test from 'node:test';
import assert from 'node:assert/strict';
import {cities} from '../lib/cities.ts';
import {channels,channelsFor,defaultChannel,regionalChannels} from '../lib/tv-channels.ts';
const languages={'West Bengal':'Bengali',Maharashtra:'Marathi',Karnataka:'Kannada',Telangana:'Telugu','Andhra Pradesh':'Telugu',Gujarat:'Gujarati',Kerala:'Malayalam',Odisha:'Odia',Assam:'Assamese','Tamil Nadu':'Tamil'};
for(const city of cities) test(`${city.name}: regional language or Hindi fallback`,()=>{
 const selected=defaultChannel(city);
 assert.equal(selected.language,languages[city.admin1]||'Hindi');
 assert.equal(new URL(selected.embed).protocol,'https:');
 assert.ok(!selected.externalOnly);
});
test('unknown state has an embedded Hindi fallback',()=>assert.equal(defaultChannel({admin1:'Unlisted state'}).id,'abp-news'));
test('case and whitespace do not prevent regional matching',()=>assert.equal(regionalChannels({admin1:' karnataka '})[0].id,'tv9-kannada'));
test('national filter never returns regional channels',()=>assert.ok(channelsFor({admin1:'Karnataka'},'national').every(c=>c.states.length===0)));
test('unavailable language never selects an unrelated regional channel',()=>assert.deepEqual(channelsFor({admin1:'West Bengal'},'regional','Marathi'),[]));
test('all channel configurations use embeds instead of website-only links',()=>assert.ok(channels.every(c=>!c.externalOnly&&c.embed.startsWith('https://'))));
