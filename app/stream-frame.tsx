"use client";
import {useEffect,useState} from 'react';
import type {NewsChannel} from '../lib/tv-channels';

export function StreamFrame({channel,onUnavailable}:{channel:NewsChannel;onUnavailable:()=>void}){
  const [url,setUrl]=useState(channel.id==='puthiya'?'':channel.embed);
  const [failed,setFailed]=useState(false);
  useEffect(()=>{
    if(channel.id!=='puthiya')return;
    const controller=new AbortController();
    fetch('/api/tv-source?channel=puthiya',{signal:controller.signal})
      .then(async r=>{if(!r.ok)throw Error();return r.json() as Promise<{embed:string}>})
      .then(d=>{
        if(!/^https:\/\/www\.youtube\.com\/embed\/[A-Za-z0-9_-]{11}\?/.test(d.embed))throw Error();
        if(!controller.signal.aborted)setUrl(d.embed);
      }).catch(()=>{if(!controller.signal.aborted)setFailed(true)});
    return()=>controller.abort();
  },[channel.id]);
  useEffect(()=>{if(failed)onUnavailable()},[failed,onUnavailable]);
  if(failed)return <div className="tv-start" role="alert"><p>This regional broadcast is unavailable.</p><button className="primary-button" onClick={onUnavailable}>Play Hindi live news</button></div>;
  if(!url)return <div className="tv-start" role="status">Connecting to the regional broadcaster…</div>;
  return <iframe title={channel.name+' live TV in '+channel.language} src={url} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>;
}
