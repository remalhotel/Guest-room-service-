// =====================================================
// Service Worker - Remal Hotel Guest Hub
// Version améliorée et sécurisée
// =====================================================

const CACHE_NAME = 'remal-guest-hub-v2';
const RUNTIME_CACHE = 'remal-runtime-v2';

// Fichiers essentiels à mettre en cache lors de l'installation
const urlsToCache = [
    './',
    './index.html',
    './assets/css/style.css',
    './assets/js/config.js',
    './assets/js/menu.js',
    './assets/js/utils/translations.js'
];

// Fichiers optionnels (mis en cache mais ne bloquent pas l'installation)
const optionalUrls = [
    './assets/images/remal-hotel-night.jpg',
    './assets/images/remal-hotel-day.jpg',
    './assets/images/icon-192.png',
    './manifest.json'
];

// Domaines à NE JAMAIS mettre en cache (API, CDN dynamiques)
const NO_CACHE_DOMAINS = [
    'supabase.co',
    'supabase.in',
    'googleapis.com',
    'openweathermap.org',
    'api.openweathermap.org'
];

// =====================================================
// INSTALLATION
// =====================================================
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installation...');

    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            // 1. Mettre en cache les fichiers essentiels (bloquant)
            try {
                await cache.addAll(urlsToCache);
                console.log('✅ Fichiers essentiels en cache');
            } catch (err) {
                console.error('❌ Erreur cache essentiels:', err);
            }

            // 2. Mettre en cache les fichiers optionnels (non bloquant)
            await Promise.allSettled(
                optionalUrls.map(async (url) => {
                    try {
                        await cache.add(url);
                    } catch (err) {
                        console.warn('⚠️ Fichier optionnel ignoré:', url);
                    }
                })
            );
        })
    );

    // Activer immédiatement le nouveau SW
    self.skipWaiting();
});

// =====================================================
// ACTIVATION
// =====================================================
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Activation...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Supprimer les anciens caches
                    if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                        console.log('🗑️ Ancien cache supprimé:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Prendre le contrôle de tous les onglets ouverts
            return self.clients.claim();
        })
    );
});

// =====================================================
// FETCH - Stratégie intelligente
// =====================================================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // 1. Ne gérer que les requêtes GET (les POST/PUT/DELETE vont directement au réseau)
    if (request.method !== 'GET') {
        return;
    }

    // 2. Ne pas intercepter les API (Supabase, météo, etc.)
    if (NO_CACHE_DOMAINS.some(domain => url.hostname.includes(domain))) {
        return;
    }

    // 3. Ne pas intercepter les requêtes non-HTTP (chrome-extension, etc.)
    if (!url.protocol.startsWith('http')) {
        return;
    }

    // 4. Stratégie selon le type de ressource
    if (isStaticAsset(url)) {
        // Ressources statiques : Cache-first
        event.respondWith(cacheFirst(request));
    } else if (isHtmlPage(url)) {
        // Pages HTML : Network-first (pour avoir les mises à jour)
        event.respondWith(networkFirst(request));
    } else {
        // Autres : Stale-while-revalidate
        event.respondWith(staleWhileRevalidate(request));
    }
});

// =====================================================
// STRATÉGIES DE CACHE
// =====================================================

// Cache d'abord, réseau en fallback
async function cacheFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(request);
        if (response && response.status === 200) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (err) {
        console.warn('⚠️ Ressource non disponible:', request.url);
        return new Response('Ressource indisponible hors ligne', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Réseau d'abord, cache en fallback (pour HTML)
async function networkFirst(request) {
    const cache = await caches.open(CACHE_NAME);

    try {
        const response = await fetch(request);
        if (response && response.status === 200) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (err) {
        const cached = await cache.match(request);
        if (cached) {
            return cached;
        }
        // Page de secours hors ligne
        return caches.match('./index.html');
    }
}

// Afficher le cache, mettre à jour en arrière-plan
async function staleWhileRevalidate(request) {
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(request);

    const fetchPromise = fetch(request).then((response) => {
        if (response && response.status === 200) {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(() => cached);

    return cached || fetchPromise;
}

// =====================================================
// UTILITAIRES
// =====================================================

function isStaticAsset(url) {
    return /\.(css|js|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|webp|ico)$/i.test(url.pathname);
}

function isHtmlPage(url) {
    return url.pathname === '/' ||
           url.pathname.endsWith('.html') ||
           url.pathname.endsWith('/');
}

// =====================================================
// MESSAGES depuis la page principale
// =====================================================
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.keys().then((names) => {
            names.forEach((name) => caches.delete(name));
        });
    }
});

console.log('✅ Service Worker Remal Hotel chargé');
