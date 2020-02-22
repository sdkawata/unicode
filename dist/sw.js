const CACHE_NAME='hoge'

self.addEventListener('install', (e) => {
    e.waitUntil(
      caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(['/ucd.all.grouped.xml']))
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