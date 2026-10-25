/* Character Ledger: keeps the app working offline. Bump CACHE when the files change. */
var CACHE='ledger-b17';
var SHELL=["./", "index.html", "manifest.webmanifest", "icon.svg", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png", "fonts/alegreya-sans-latin-ext-400-normal.woff2", "fonts/alegreya-sans-latin-400-normal.woff2", "fonts/alegreya-sans-latin-ext-500-normal.woff2", "fonts/alegreya-sans-latin-500-normal.woff2", "fonts/alegreya-sans-latin-ext-700-normal.woff2", "fonts/alegreya-sans-latin-700-normal.woff2", "fonts/cinzel-latin-ext-500-normal.woff2", "fonts/cinzel-latin-500-normal.woff2", "fonts/cinzel-latin-ext-700-normal.woff2", "fonts/cinzel-latin-700-normal.woff2", "fonts/ibm-plex-mono-latin-ext-400-normal.woff2", "fonts/ibm-plex-mono-latin-400-normal.woff2", "fonts/ibm-plex-mono-latin-ext-500-normal.woff2", "fonts/ibm-plex-mono-latin-500-normal.woff2", "fonts/ibm-plex-mono-latin-ext-600-normal.woff2", "fonts/ibm-plex-mono-latin-600-normal.woff2", "fonts/fonts.css"];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  var req=e.request;
  if(req.method!=='GET')return;
  var url=new URL(req.url);
  if(url.origin!==location.origin)return;
  if(req.mode==='navigate'){
    /* open from the saved copy at once, and fetch a fresh one for next time */
    e.respondWith(caches.match('index.html').then(function(hit){
      var net=fetch('index.html',{cache:'no-cache'}).then(function(r){
        if(r&&r.ok){var copy=r.clone();caches.open(CACHE).then(function(c){c.put('index.html',copy)})}
        return r;
      }).catch(function(){return null});
      if(hit){e.waitUntil(net);return hit}
      return net.then(function(r){return r||Response.error()});
    }));
    return;
  }
  e.respondWith(caches.match(req).then(function(hit){
    return hit||fetch(req).then(function(r){
      if(r&&r.ok){var copy=r.clone();caches.open(CACHE).then(function(c){c.put(req,copy)})}
      return r;
    });
  }));
});
