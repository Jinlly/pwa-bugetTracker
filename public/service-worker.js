const FILES_TO_CACHE = [
    './index.html',
    './css/styles.css',
    './js/index.js',
    './js/idb.js',
    './manifest.json',
    './icons/icon-512x512.png',
    './icons/icon-384x384.png',
    './icons/icon-192x192.png',
    './icons/icon-152x152.png',
    './icons/icon-144x144.png',
    './icons/icon-128x128.png',
    './icons/icon-96x96.png',
    './icons/icon-72x72.png'
];

const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

//event install
self.addEventListener('install', function(evt) {
    evt.waitUtil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log(CACHE_NAME + 'installing');
            return cache.addAll(FILES_TO_CACHE)
        })
    )
});

//event active
self.addEventListener('activate', function(evt) {
    evt.waitUtil(
        caches.keys().then(function(keyList) {
            let cacheKeeplist = keyList.filter(function(key) {
                return key.indexOf(APP_PREFIX);
            });
            cacheKeeplist.push(CACHE_NAME)
                //after push
            return Promise.all(keyList.map(function(key, i) {
                if (cacheKeeplist.indexOf(key) === -1) {
                    console.log(keyList[i] + 'deleting');
                    return caches.delete(keyList[i]);
                }
            }));
        })
    )
});

//event fetch
self.addEventListener('fetch', function(evt) {
    console.log('fetch request:' + evt.request.url);
    evt.respondWith(
        catche.match(evt.request).then(function(req) {
            if (req) {
                console.log(evt.request.url + 'responding');
                return req
            } else {
                console.log('cache failed, fetching :' + evt.request.url);
                return fetch(evt.request)
            }
        })
    )
});