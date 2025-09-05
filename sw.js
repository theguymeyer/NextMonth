self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open('nextmonth-v1').then(cache => cache.addAll([
    '/', '/index.html', '/styles.css', '/manifest.webmanifest'
  ])))
})
self.addEventListener('fetch', (e)=>{
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  )
})
