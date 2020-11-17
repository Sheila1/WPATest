'use strict';
//cache de archivos offline
const cacheArchivos = 'cacheEstatico';

const archivos = [
    '/',
    '/index.html',
    '/utiles/script.js',
    '/utiles/style.css',
    '/utiles/img/Icon256.png',
    '/utiles/instalacion.js',
    //error sw.js:1 Uncaught (in promise) TypeError: Request failed - hay alguna pagina aqui que no existe
];

self.addEventListener('install', (evt) => {
    console.log('[ServiceWorker] Install');
    //Precache los archivos estaticos.
    evt.waitUntil(
        caches.open(cacheArchivos).then((cache) => {
            console.log('[ServiceWorker] Almacenando archivos offline');
            return cache.addAll(archivos);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');
    // Limpiando anterior cache
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheArchivos) {
                    console.log('[ServiceWorker] Limpiando cache anterior', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  
    console.log('[ServiceWorker] Fetch', evt.request.url);
    evt.respondWith(
        caches.open(cacheArchivos).then((cache) => {
            return cache.match(evt.request)
                .then((response) => {
                    console.log("RESP", response);
                    return response || fetch(evt.request);
                });
        })
    );
});
