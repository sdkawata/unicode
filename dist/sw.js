const CACHE_NAME='unicode'

self.addEventListener('install', (e) => {
    e.waitUntil(
      caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(['/ucd.json']))
    )
})

self.addEventListener('fetch', (e) => {
  e.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      const response = await cache.match(e.request)
      console.log(e.request)
      if (response) {
        console.log('found')
        return response
      }
      return await fetch(e.request)
    })()
  )
})