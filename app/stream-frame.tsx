"use client";
import {useEffect,useRef,useState} from 'react';
import type {NewsChannel} from '../lib/tv-channels';
import {loadYouTubePlayer,type YouTubePlayer} from '../lib/youtube-player';

export function StreamFrame({channel,onUnavailable,onStatus}:{channel:NewsChannel;onUnavailable:()=>void;onStatus:(message:string)=>void}){
  const dynamic=['puthiya','india-today'].includes(channel.id);
  const host=useRef<HTMLDivElement>(null);
  const [failure,setFailure]=useState('');
  const [attempt,setAttempt]=useState(0);
  useEffect(()=>{
    if(!dynamic){onStatus('Use the official player controls to start playback or turn on sound. An advertisement may play first.');return;}
    const controller=new AbortController();
    let player:YouTubePlayer|undefined;
    let readyTimer:ReturnType<typeof setTimeout>|undefined;
    let cancelled=false;
    setFailure('');
    onStatus('Finding the current broadcast…');
    const timeout=setTimeout(()=>controller.abort(),16000);
    const fail=(message:string)=>{clearTimeout(readyTimer);if(!cancelled){setFailure(message);onStatus(message)}};
    async function start(){
      try{
        const response=await fetch('/api/tv-source?channel='+encodeURIComponent(channel.id),{signal:controller.signal,cache:'no-store'});
        if(!response.ok)throw Error('The broadcaster’s current stream could not be found. Please retry.');
        const data=await response.json() as {embed:string};
        const id=data.embed.match(/^https:\/\/www\.youtube\.com\/embed\/([A-Za-z0-9_-]{11})\?/)?.[1];
        if(!id)throw Error('The broadcaster returned an invalid player. Please retry.');
        clearTimeout(timeout);
        const api=await loadYouTubePlayer();
        if(cancelled||!host.current)return;
        const target=document.createElement('div');
        host.current.replaceChildren(target);
        onStatus('Loading the official player…');
        readyTimer=setTimeout(()=>{if(!cancelled)onStatus('The player is taking longer than expected. Press Play in the video, or reload the player.');},20000);
        player=new api.Player(target,{videoId:id,playerVars:{autoplay:1,mute:1,playsinline:1,origin:window.location.origin},events:{
          onReady:({target})=>{if(cancelled)return;clearTimeout(readyTimer);target.getIframe().title=channel.name+' live TV in '+channel.language;target.mute();target.playVideo();onStatus('Player ready. If playback does not start, press Play in the video.');},
          onStateChange:({data})=>{if(cancelled)return;onStatus(data===1?'Playing live news. Use the player controls to turn on sound.':data===2?'Paused. Press Play in the video to resume.':data===3?'Buffering… If this continues, reload the player.':data===0?'This broadcast has ended. Reload to check for the latest stream.':'Press Play in the video to start playback.');},
          onAutoplayBlocked:()=>{if(!cancelled)onStatus('Your browser blocked autoplay. Press Play in the video to start.');},
          onError:({data})=>fail(data===101||data===150?'The broadcaster has disabled embedded playback for this stream. Try again later or choose another channel.':data===100?'This broadcast is no longer available. Retry to find the latest stream.':`The video could not play (error ${data}). Retry or choose another channel.`),
        }});
      }catch(error){fail(controller.signal.aborted?'Connecting to the broadcaster timed out. Please retry.':error instanceof Error?error.message:'Unable to load this broadcast. Please retry.');}
      finally{clearTimeout(timeout);}
    }
    void start();
    return()=>{cancelled=true;clearTimeout(timeout);clearTimeout(readyTimer);controller.abort();player?.destroy();};
  },[channel.id,channel.name,channel.language,dynamic,attempt,onStatus]);
  if(!dynamic)return <iframe title={channel.name+' live TV in '+channel.language} src={channel.embed} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>;
  return <div className="stream-host"><div className="youtube-host" ref={host}/>{failure&&<div className="tv-start stream-error" role="alert"><p>{failure}</p><button className="primary-button" onClick={()=>setAttempt(n=>n+1)}>Retry broadcast</button><button className="outline-button" onClick={onUnavailable}>Play Hindi live news</button></div>}</div>;
}
