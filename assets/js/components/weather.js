// ==================== WEATHER MODULE ====================
// Météo avec cache, fallback, multilingue et rafraîchissement auto

(function () {
    'use strict';

    // ==================== CONFIGURATION ====================
    const CONFIG = {
        latitude: 24.1556,
        longitude: 52.6833,
        timezone: 'Asia/Dubai',
        cityName: 'Al Dhannah City',
        cacheKey: 'remal_weather_cache',
        cacheDurationMs: 30 * 60 * 1000,   // 30 minutes
        refreshIntervalMs: 30 * 60 * 1000,  // 30 minutes
        apiUrl: 'https://api.open-meteo.com/v1/forecast',
        timeoutMs: 8000
    };

    // ==================== ICÔNES MÉTÉO (WMO codes) ====================
    const WEATHER_ICONS = {
        0: '☀️',   // Ciel dégagé
        1: '🌤️',  // Principalement dégagé
        2: '⛅',   // Partiellement nuageux
        3: '☁️',   // Couvert
        45: '🌫️',  // Brouillard
        48: '🌫️',  // Brouillard givrant
        51: '🌦️',  // Bruine légère
        53: '🌦️',  // Bruine modérée
        55: '🌦️',  // Bruine dense
        56: '🌧️',  // Bruine verglaçante légère
        57: '🌧️',  // Bruine verglaçante dense
        61: '🌧️',  // Pluie légère
        63: '🌧️',  // Pluie modérée
        65: '🌧️',  // Pluie forte
        66: '🌧️',  // Pluie verglaçante légère
        67: '🌧️',  // Pluie verglaçante forte
        71: '🌨️',  // Neige légère
        73: '🌨️',  // Neige modérée
        75: '❄️',  // Neige forte
        77: '🌨️',  // Grains de neige
        80: '🌦️',  // Averses légères
        81: '🌧️',  // Averses modérées
        82: '⛈️',  // Averses violentes
        85: '🌨️',  // Averses de neige légères
        86: '❄️',  // Averses de neige fortes
        95: '⛈️',  // Orage
        96: '⛈️',  // Orage avec grêle légère
        99: '⛈️'   // Orage avec grêle forte
    };

    // ==================== TRADUCTIONS ====================
    const TRANSLATIONS = {
        en: {
            city: 'Al Dhannah City',
            wind: 'Wind',
            humidity: 'Humidity',
            loading: 'Loading weather...',
            unavailable: 'Weather unavailable',
            offline: 'Offline - last update'
        },
        fr: {
            city: 'Al Dhannah City',
            wind: 'Vent',
            humidity: 'Humidité',
            loading: 'Chargement météo...',
            unavailable: 'Météo indisponible',
            offline: 'Hors ligne - dernière mise à jour'
        },
        ar: {
            city: 'مدينة الظنة',
            wind: 'الرياح',
            humidity: 'الرطوبة',
            loading: 'جارٍ تحميل الطقس...',
            unavailable: 'الطقس غير متوفر',
            offline: 'غير متصل - آخر تحديث'
        },
        hi: {
            city: 'अल धन्ना शहर',
            wind: 'हवा',
            humidity: 'नमी',
            loading: 'मौसम लोड हो रहा है...',
            unavailable: 'मौसम उपलब्ध नहीं',
            offline: 'ऑफ़लाइन - अंतिम अपडेट'
        }
    };

    function t(key) {
        const lang = (typeof window.currentLanguage === 'string' && window.currentLanguage) ||
                     localStorage.getItem('remal_lang') ||
                     'en';
        return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS.en[key] || key;
    }

    // ==================== CACHE ====================
    function getCache() {
        try {
            const raw = localStorage.getItem(CONFIG.cacheKey);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || !parsed.timestamp || !parsed.data) return null;
            return parsed;
        } catch (e) {
            return null;
        }
    }

    function setCache(data) {
        try {
            localStorage.setItem(CONFIG.cacheKey, JSON.stringify({
                timestamp: Date.now(),
                data: data
            }));
        } catch (e) {
            // Silencieux (mode privé)
        }
    }

    function isCacheFresh(cache) {
        if (!cache) return false;
        return (Date.now() - cache.timestamp) < CONFIG.cacheDurationMs;
    }

    // ==================== RENDU ====================
    function renderWeather(container, data, isStale = false) {
        if (!container || !data) return;

        const temp = Math.round(data.temperature);
        const wind = Math.round(data.windSpeed);
        const icon = WEATHER_ICONS[data.weatherCode] || '🌡️';

        const staleBadge = isStale
            ? `<p style="font-size:8px; color:#f59e0b; margin-top:4px;">⏱️ ${t('offline')}</p>`
            : '';

        container.innerHTML = `
            <div class="p-3 rounded-2xl border weather-card" 
                 style="background: rgba(14,165,233,0.1); border-color: rgba(14,165,233,0.3);">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <p style="font-size:9px; font-weight:bold; color:#38bdf8;">${t('city')}</p>
                        <p style="font-size:24px; font-weight:bold; color:white; margin-top:4px;">${temp}°C</p>
                    </div>
                    <span style="font-size:30px;" aria-label="weather">${icon}</span>
                </div>
                <p style="font-size:8px; color:#a8a29e; margin-top:8px;">
                    💨 ${t('wind')}: ${wind} km/h
                </p>
                ${staleBadge}
            </div>
        `;
    }

    function renderLoading(container) {
        if (!container) return;
        container.innerHTML = `
            <div class="p-3 rounded-2xl border" 
                 style="background: rgba(14,165,233,0.05); border-color: rgba(14,165,233,0.2);">
                <p style="font-size:9px; color:#38bdf8;">${t('loading')}</p>
            </div>
        `;
    }

    function renderError(container) {
        if (!container) return;
        container.innerHTML = `
            <div class="p-3 rounded-2xl border" 
                 style="background: rgba(107,114,128,0.1); border-color: rgba(107,114,128,0.3);">
                <p style="font-size:9px; color:#a8a29e;">🌡️ ${t('unavailable')}</p>
            </div>
        `;
    }

    // ==================== FETCH AVEC TIMEOUT ====================
    async function fetchWithTimeout(url, timeoutMs) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timer);
            return response;
        } catch (err) {
            clearTimeout(timer);
            throw err;
        }
    }

    // ==================== FETCH MÉTÉO ====================
    async function fetchWeather(options = {}) {
        const { force = false } = options;
        const container = document.getElementById('weatherContainer');
        if (!container) return;

        // 1. Vérifier le cache
        const cache = getCache();
        if (!force && isCacheFresh(cache)) {
            renderWeather(container, cache.data, false);
            return cache.data;
        }

        // 2. Afficher l'ancien cache pendant le chargement (si existant)
        if (cache && cache.data) {
            renderWeather(container, cache.data, true);
        } else {
            renderLoading(container);
        }

        // 3. Construire l'URL
        const params = new URLSearchParams({
            latitude: CONFIG.latitude,
            longitude: CONFIG.longitude,
            current: 'temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m',
            timezone: CONFIG.timezone
        });

        try {
            const response = await fetchWithTimeout(
                `${CONFIG.apiUrl}?${params.toString()}`,
                CONFIG.timeoutMs
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const json = await response.json();

            // Validation stricte
            if (!json || !json.current || typeof json.current.temperature_2m !== 'number') {
                throw new Error('Invalid weather data');
            }

            const data = {
                temperature: json.current.temperature_2m,
                weatherCode: json.current.weather_code,
                windSpeed: json.current.wind_speed_10m,
                humidity: json.current.relative_humidity_2m
            };

            // Sauvegarder + afficher
            setCache(data);
            renderWeather(container, data, false);

            return data;

        } catch (err) {
            console.warn('⚠️ Météo indisponible:', err.message);

            // Fallback : afficher le cache même expiré
            if (cache && cache.data) {
                renderWeather(container, cache.data, true);
                return cache.data;
            }

            renderError(container);
            return null;
        }
    }

    // ==================== RAFRAÎCHISSEMENT AUTO ====================
    let refreshTimer = null;

    function startAutoRefresh() {
        if (refreshTimer) clearInterval(refreshTimer);
        refreshTimer = setInterval(() => {
            if (!document.hidden) {
                fetchWeather({ force: true });
            }
        }, CONFIG.refreshIntervalMs);
    }

    // Rafraîchir quand on revient sur l'onglet
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            const cache = getCache();
            if (!isCacheFresh(cache)) {
                fetchWeather();
            }
        }
    });

    // ==================== INITIALISATION ====================
    function init() {
        fetchWeather();
        startAutoRefresh();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }

    // ==================== API PUBLIQUE ====================
    window.fetchWeather = fetchWeather;
    window.weatherModule = {
        refresh: () => fetchWeather({ force: true }),
        getCache,
        clearCache: () => {
            try { localStorage.removeItem(CONFIG.cacheKey); } catch (e) {}
        },
        config: CONFIG
    };

})();
