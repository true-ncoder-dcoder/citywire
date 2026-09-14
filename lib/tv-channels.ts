import type {City} from './cities';

export type NewsChannel = {
  id: string;
  name: string;
  language: string;
  coverage: string;
  states: string[];
  url: string;
  embed: string;
  externalOnly?: boolean;
};

// Official live-player URLs checked against each broadcaster's live-TV page.
// Empty states means national coverage, not a claim of city-specific programming.
export const channels: NewsChannel[] = [
  {id:'abp-ananda',name:'ABP Ananda',language:'Bengali',coverage:'West Bengal, including Kolkata',states:['West Bengal'],url:'https://bengali.abplive.com/live-tv',embed:'https://cdn.abplive.com/LiveStreams/260118/abpananda/streaming_bengali_vidgyor-new-nov2022.html'},
  {id:'abp-majha',name:'ABP Majha',language:'Marathi',coverage:'Maharashtra, including Mumbai and Pune',states:['Maharashtra'],url:'https://marathi.abplive.com/live-tv',embed:'https://cdn.abplive.com/LiveStreams/260118/abpmajha/streaming-new-nov2022.html'},
  {id:'tv9-kannada',name:'TV9 Kannada',language:'Kannada',coverage:'Karnataka',states:['Karnataka'],url:'https://tv9kannada.com/live-tv',embed:'https://static.vidgyor.com/player/account/tv9/html/tv9_v12.html?videoId=737fca26646a1_live&accountId=62c5847bd07d8600094f761f&piv=0&pip=0'},
  {id:'tv9-telugu',name:'TV9 Telugu',language:'Telugu',coverage:'Telangana and Andhra Pradesh',states:['Telangana','Andhra Pradesh'],url:'https://tv9telugu.com/live-tv',embed:'https://static.vidgyor.com/player/account/tv9/html/tv9_v12.html?videoId=19af7df5359cf_live&accountId=62bc5a258b13e80009aaf135&piv=0&pip=0'},
  {id:'abp-asmita',name:'ABP Asmita',language:'Gujarati',coverage:'Gujarat',states:['Gujarat'],url:'https://gujarati.abplive.com/live-tv',embed:'https://cdn.abplive.com/iframes/gujarati-live-tv-2026.html'},
  {id:'asianet',name:'Asianet News',language:'Malayalam',coverage:'Kerala',states:['Kerala'],url:'https://www.asianetnews.com/live-tv',embed:'https://dashboard.videograph.ai/d2737514-6c26-401d-8ead-0a9008aaf3c5/videos/embed?streamId=1c19363c-e4a0-4e4d-ba28-771d5615b88e'},
  {id:'otv',name:'OTV',language:'Odia',coverage:'Odisha',states:['Odisha'],url:'https://odishatv.in/live-tv',embed:'https://content.vidgyor.com/live/midroll/html/odishatv.html'},
  {id:'news-live',name:'News Live',language:'Assamese',coverage:'Assam',states:['Assam'],url:'https://newslivetv.com/live-tv/',embed:'https://prideeast.thelegitpro.in/newslive/newslive/embed.html'},
  {id:'puthiya',name:'Puthiya Thalaimurai',language:'Tamil',coverage:'Tamil Nadu and Puducherry',states:['Tamil Nadu','Puducherry'],url:'https://www.puthiyathalaimurai.com/live-tv',embed:'https://www.youtube.com/embed/hw7Fjh6mncQ?autoplay=1&mute=1&playsinline=1'},
  {id:'abp-news',name:'ABP News',language:'Hindi',coverage:'India and world',states:[],url:'https://www.abplive.com/live-tv',embed:'https://cdn.abplive.com/LiveStreams/abp_live_tv/hindi/live-tv.html'},
];

export function regionalChannels(city: Pick<City,'admin1'>) {
  const state=city.admin1.trim().toLowerCase();
  return channels.filter(c=>c.states.some(s=>s.toLowerCase()===state));
}
export function channelsFor(city: Pick<City,'admin1'>, scope:'regional'|'national', language='all') {
  return (scope==='regional'?regionalChannels(city):channels.filter(c=>!c.states.length))
    .filter(c=>language==='all'||c.language===language);
}

export function defaultChannel(city: Pick<City,"admin1">) {
  return regionalChannels(city).find(c=>!c.externalOnly)||channels.find(c=>c.id==="abp-news")!;
}
