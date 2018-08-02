self.addEventListener('install',function(event){
  event.waitUntil(
    caches.open('static-v1')
      .then(function(cache){
        cache.add('offline.html')
      })
  )
});

self.addEventListener('fetch',function(event){
  event.respondWith(
    fetch(event.request)
    .catch(function(error){
      return caches.match('offline.html')
    }))
  //   caches.match(event.request)
  //     .then(function(response){
  //       return response || fetch(event.request);
  //     })
  //     .catch(function(){
  //       if(event.request.mode == 'navigate'){
  //         return caches.match('offline.html');
  //       }
  //     })
  // );
});