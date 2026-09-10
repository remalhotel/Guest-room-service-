// Service Worker - Remal Hotel Guest Hub
const CACHE_NAME = 'remal-guest-hub-v1';

const urlsToCache = [
    '/',
    '/index.html',
    '/assets/css/style.css',
    '/assets/js/config.js',
    '/assets/js/menu.js',
    '/assets/js/utils/translations.js',
    '/assets/images/remal-hotel-night.jpg',
    '/assets/images/remal-hotel-day.jpg'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('✅ Cache ouvert');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activation
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Ancien cache supprimé:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch - Stratégie cache d'abord
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
