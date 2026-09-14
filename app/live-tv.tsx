"use client";

import {useEffect,useState} from 'react';
import {StreamFrame} from './stream-frame';

import {ArrowUpRight,MapPin,Play,Radio,RefreshCw} from 'lucide-react';

import type {City} from '../lib/cities';

import {channelsFor,regionalChannels,defaultChannel} from '../lib/tv-channels';



export function LiveTV({city,onLocalNews,refreshToken=0}:{city:City;onLocalNews:()=>void;refreshToken?:number}) {

  const regional=regionalChannels(city);

  const [scope,setScope]=useState<'regional'|'national'>(regional.length?'regional':'national');

  const [language,setLanguage]=useState(regional.length?'all':'Hindi');

  const [selectedId,setSelectedId]=useState(defaultChannel(city).id);

  const [playing,setPlaying]=useState(false);

  const [revision,setRevision]=useState(0);

  const [slow,setSlow]=useState(false);

  const available=channelsFor(city,scope,language);

  const selected=available.find(c=>c.id===selectedId)||available[0];

  const languages=[...new Set(channelsFor(city,scope).map(c=>c.language))];



  useEffect(()=>{

    setSlow(false);

    if(!playing)return;

    const timer=setTimeout(()=>setSlow(true),20000);

    return()=>clearTimeout(timer);

  },[playing,selected?.id,revision,refreshToken]);



  function switchScope(next:'regional'|'national') {

    setScope(next);setLanguage(next==='national'?'Hindi':'all');setSelectedId(next==='national'?'abp-news':'');setPlaying(false);

  }



  return <section className="live-section">

    <div className="panel-intro">

      <span className="eyebrow">LIVE TV • REGIONAL & NATIONAL</span>

      <h2>Live news for {city.name}.</h2>

      <p>Regional channels cover your state, including your city. Each broadcaster controls its programme; city selection does not filter individual stories.</p>

    </div>

    <div className="tv-scope" role="group" aria-label="Live TV coverage">

      <button aria-pressed={scope==='regional'} onClick={()=>switchScope('regional')}>{city.admin1} regional ({regional.length})</button>

      <button aria-pressed={scope==='national'} onClick={()=>switchScope('national')}>National channels ({channelsFor(city,'national').length})</button>

      <label className="tv-language">Language<select value={language} onChange={e=>{setLanguage(e.target.value);setPlaying(false);setSelectedId('')}}><option value="all">All languages</option>{languages.map(l=><option key={l}>{l}</option>)}</select></label>

    </div>

    {!regional.length&&scope==='national'&&<p className="provider-note">No regional channel is currently listed for {city.admin1}. Showing Hindi live news.</p>}

    {!selected?<div className="empty" role="status">

      <MapPin size={28}/><h3>No matching regional stream in our catalogue</h3>

      <p>Coverage for {city.name} is still being expanded.</p>

      <div className="tv-empty-actions"><button className="outline-button" onClick={()=>switchScope('national')}>Watch national channels</button><button className="outline-button" onClick={onLocalNews}>Read {city.name} news</button></div>

    </div>:<>

      <p className="provider-note"><strong>{selected.language}</strong> · {selected.coverage} · {scope==='regional'?'Statewide coverage':'National coverage'}</p>

      <div className="tv-player">{playing?<StreamFrame key={selected.id+"-"+revision+"-"+refreshToken} channel={selected} onUnavailable={()=>{setScope('national');setLanguage('Hindi');setSelectedId('abp-news');setPlaying(true)}}/>:<div className="tv-start"><Radio size={34}/><span>{selected.language.toUpperCase()} LIVE TV</span><h3>{selected.name}</h3><button className="primary-button" onClick={()=>setPlaying(true)}><Play size={18}/>Watch live</button></div>}</div>

      <div className="player-controls"><span>{selected.name} <small>· {selected.language}</small></span>{playing&&<><button className="text-button" onClick={()=>setPlaying(false)}>Stop player</button><button className="text-button" onClick={()=>setRevision(n=>n+1)}><RefreshCw size={14}/>Reload player</button></>}</div>

      {playing&&<p className="provider-note" role="status">{slow?'If the player is still blank or buffering, reload it or switch to Hindi below.':'Opening the official player. Playback may start muted or with an advertisement.'} Use the player controls to turn on sound.</p>}

      {selected.language!=="Hindi"&&<button className="outline-button" onClick={()=>{setScope("national");setLanguage("Hindi");setSelectedId("abp-news");setPlaying(true)}}>Switch to Hindi live news</button>}

      <div className="channel-grid">{available.map(c=><button key={c.id} className={'channel-card '+(selected.id===c.id?'chosen':'')} aria-pressed={selected.id===c.id} onClick={()=>{setSelectedId(c.id);setPlaying(true)}}><span className="channel-initial">{c.name.split(' ').map(w=>w[0]).join('').slice(0,3)}</span><span><strong>{c.name}</strong><small>{c.language} · {c.coverage}</small></span><Play size={19}/></button>)}</div>

    </>}

  </section>;

}

