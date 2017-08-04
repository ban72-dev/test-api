
var staticCacheName = 'youtubesearch-v1';
var contentImgsCache = 'youtubesearch-imgs';
var allCaches = [staticCacheName, contentImgsCache];


self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(staticCacheName).then(function (cache) {
    return cache.addAll([
	'/',
	'https://unpkg.com/vue@2.1.6/dist/vue.js',
	'https://unpkg.com/axios@0.12.0/dist/axios.min.js',
	'https://unpkg.com/lodash@4.13.1/lodash.min.js',
	'https://apis.google.com/js/api.js',
	'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
	'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js',
	'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'
	]);
  }));
});

self.addEventListener('activate', function (event) {         ///   Deletes the old caches - caches that are not contained in allCache array
  event.waitUntil(caches.keys().then(function (cacheNames) {
    return Promise.all(cacheNames.filter(function (cacheName) {
      return cacheName.startsWith('youtubesearch') && !allCaches.includes(cacheName);
    }).map(function (cacheName) {
      return caches['delete'](cacheName);
    }));
  }));
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});
