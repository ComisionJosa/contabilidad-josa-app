/* App del móvil de Contabilidad Josa: abre rápido y se puede instalar.
   Primero intenta la red (para tener siempre la última versión del programa); si no hay conexión, usa la copia guardada.
   Las llamadas a GitHub (datos) no pasan por aquí. */
const CACHE='contabilidad-josa-v2';
const BASE=['./','index.html','guia.html','manifest.webmanifest','icon-192.png','icon-512.png','icono.ico'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET' || u.origin!==self.location.origin) return;
  e.respondWith(fetch(e.request).then(r=>{ const copia=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,copia)); return r; })
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
});
