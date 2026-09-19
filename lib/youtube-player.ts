export type YouTubePlayer = {destroy():void; mute():void; playVideo():void;getIframe():HTMLIFrameElement};
type PlayerEvent = {data:number;target:YouTubePlayer};
type YouTubeAPI = {Player:new(element:HTMLElement,options:{videoId:string;playerVars:Record<string,string|number>;events:Record<string,(event:PlayerEvent)=>void>})=>YouTubePlayer};
declare global {interface Window {YT?:YouTubeAPI;onYouTubeIframeAPIReady?:()=>void}}
let pending:Promise<YouTubeAPI>|undefined;
export function loadYouTubePlayer():Promise<YouTubeAPI>{
  if(window.YT?.Player)return Promise.resolve(window.YT);
  if(pending)return pending;
  pending=new Promise<YouTubeAPI>((resolve,reject)=>{
    const script=document.createElement('script');
    const timer=setTimeout(fail,15000);
    function fail(){clearTimeout(timer);script.remove();pending=undefined;reject(new Error('YouTube player could not load. Please retry.'));}
    window.onYouTubeIframeAPIReady=()=>{clearTimeout(timer);if(window.YT?.Player)resolve(window.YT);else fail()};
    script.src='https://www.youtube.com/iframe_api';
    script.onerror=fail;
    document.head.appendChild(script);
  });
  return pending;
}
