import test from 'node:test';
import assert from 'node:assert/strict';
import {extractLiveVideoId} from '../lib/tv-source.ts';
const id='hw7Fjh6mncQ';
test('finds a current official iframe with whitespace and query parameters',()=>assert.equal(extractLiveVideoId(`<iframe src = "https://www.youtube.com/embed/${id}?autoplay=1"></iframe>`),id));
test('reads serialized escaped iframe markup',()=>assert.equal(extractLiveVideoId(String.raw`<iframe src=\"https:\u002F\u002Fwww.youtube.com\u002Fembed\u002Fhw7Fjh6mncQ\"></iframe>`),id));
test('supports privacy-enhanced official embeds',()=>assert.equal(extractLiveVideoId(`<iframe src='https://www.youtube-nocookie.com/embed/${id}'></iframe>`),id));
test('does not mistake article watch links or unrelated hosts for the live player',()=>{
 assert.equal(extractLiveVideoId(`<a href="https://www.youtube.com/watch?v=${id}">video</a>`),undefined);
 assert.equal(extractLiveVideoId(`<iframe src="https://youtube.com.evil.test/embed/${id}"></iframe>`),undefined);
 assert.equal(extractLiveVideoId('<iframe src="https://www.youtube.com/embed/toolong1234567"></iframe>'),undefined);
});
