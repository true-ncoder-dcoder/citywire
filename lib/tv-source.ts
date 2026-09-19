// Read only YouTube iframe URLs published in the broadcaster's live page.
export function extractLiveVideoId(html:string):string|undefined {
  const decoded=html.replace(/\\u002[fF]/g,'/').replace(/\\\//g,'/').replace(/&quot;/g,'"').replace(/\\"/g,'"');
  return decoded.match(/<iframe\b[^>]*\bsrc\s*=\s*["']https:\/\/(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{11})(?=[?"'])/i)?.[1];
}
