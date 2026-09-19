import test from 'node:test';
import assert from 'node:assert/strict';
import {loadYouTubePlayer} from '../lib/youtube-player.ts';
test('YouTube API load is shared, failure can retry, and ready API is reused',async()=>{
 const originalWindow=globalThis.window;
 const originalDocument=globalThis.document;
 const scripts=[];
 globalThis.window={};
 globalThis.document={createElement:()=>({remove(){this.removed=true;}}),head:{appendChild(script){scripts.push(script);}}};
 try {
  const first=loadYouTubePlayer();
  assert.equal(loadYouTubePlayer(),first);
  assert.equal(scripts.length,1);
  scripts[0].onerror();
  await assert.rejects(first,/could not load/);
  assert.equal(scripts[0].removed,true);
  const retry=loadYouTubePlayer();
  assert.equal(scripts.length,2);
  const api={Player:class{}};
  window.YT=api;
  window.onYouTubeIframeAPIReady();
  assert.equal(await retry,api);
  assert.equal(await loadYouTubePlayer(),api);
 } finally {
  if(originalWindow===undefined)delete globalThis.window;else globalThis.window=originalWindow;
  if(originalDocument===undefined)delete globalThis.document;else globalThis.document=originalDocument;
 }
});
