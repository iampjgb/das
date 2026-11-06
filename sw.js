const V='theo-offline-v1';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  /* app page: try the network for updates, fall back to the saved copy */
  if(r.mode==='navigate'||(u.origin===location.origin&&/\/(index\.html)?$/.test(u.pathname))){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put('./index.html',c));return res}).catch(()=>caches.match('./index.html')));return}
  /* fonts: keep a copy */
  if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(r,c));return res})));return}
  /* icons and manifest */
  if(u.origin===location.origin&&/\.(png|webmanifest)$/.test(u.pathname)){e.respondWith(caches.match(r).then(m=>m||fetch(r)));return}
  /* Bible text is saved by the app itself (IndexedDB), so pass it through */
});
