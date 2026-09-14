"use client";
import {useEffect,useState} from 'react';
import {Moon,Sun} from 'lucide-react';

export function ThemeToggle(){
  const [dark,setDark]=useState(false);
  useEffect(()=>{
    let saved:string|null=null;
    try{saved=localStorage.getItem('citywire-theme')}catch{}
    const enabled=saved==='dark'||(!saved&&window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme=enabled?'dark':'light';setDark(enabled);
  },[]);
  function toggle(){
    const next=!dark;setDark(next);
    document.documentElement.dataset.theme=next?'dark':'light';
    try{localStorage.setItem('citywire-theme',next?'dark':'light')}catch{}
  }
  return <button className="theme-toggle" role="switch" aria-checked={dark} aria-label="Dark mode" onClick={toggle}>{dark?<Sun size={17}/>:<Moon size={17}/>}<span>{dark?'Light mode':'Dark mode'}</span></button>;
}
