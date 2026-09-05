// ==================== MODE HORS-LIGNE ====================
let offlineCache = {
    menu: null,
    offers: null,
    lastSync: null
};

// Initialiser le cache depuis localStorage
function initOfflineCache() {
    try {
        const saved = localStorage.getItem('remal_offline_cache');
        if (saved) {
            offlineCache = JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Erreur cache offline:', e);
    }
}

// Sauvegarder le menu en cache
function cacheMenuData() {
    if (typeof MENU_DATA !== 'undefined') {
        offlineCache.menu = MENU_DATA;
        offlineCache.lastSync = new Date().toISOString();
        saveOfflineCache();
    }
}

// Sauvegarder les offres en cache
function cacheOffersData(offers) {
    if (offers && offers.length > 0) {
        offlineCache.offers = offers;
        offlineCache.lastSync = new Date().toISOString();
        saveOfflineCache();
    }
}

// Sauvegarder le cache dans localStorage
function saveOfflineCache() {
    try {
        localStorage.setItem('remal_offline_cache', JSON.stringify(offlineCache));
    } catch (e) {
        console.warn('Erreur sauvegarde cache:', e);
    }
}

// Vérifier si on est en ligne
function isOnline() {
    return navigator.onLine;
}

// Vérifier si le menu est disponible (en ligne ou en cache)
function isMenuAvailable() {
    return typeof MENU_DATA !== 'undefined' || (offlineCache.menu !== null);
}

// Récupérer le menu (en ligne ou depuis le cache)
function getMenuData() {
    if (typeof MENU_DATA !== 'undefined') {
        // Mettre à jour le cache
        cacheMenuData();
        return MENU_DATA;
    } else if (offlineCache.menu) {
        return offlineCache.menu;
    }
    return null;
}

// Récupérer les offres (en ligne ou depuis le cache)
function getOfflineOffers() {
    return offlineCache.offers || [];
}

// Mettre à jour l'indicateur de connexion
function updateOnlineStatus() {
    const indicator = document.getElementById('onlineStatusIndicator');
    if (!indicator) return;
    
    if (isOnline()) {
        indicator.innerHTML = `
            <span class="inline-flex items-center gap-1.5 text-[9px] font-bold text-emerald-400">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Online
            </span>
        `;
    } else {
        indicator.innerHTML = `
            <span class="inline-flex items-center gap-1.5 text-[9px] font-bold text-amber-400">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                Offline Mode
            </span>
        `;
    }
}

// Afficher un toast pour signaler le mode hors-ligne
function showOfflineToast() {
    showToast('📴 Mode hors-ligne activé - Données en cache', 'info');
}

// Écouter les changements de connexion
function setupOfflineListeners() {
    window.addEventListener('online', () => {
        updateOnlineStatus();
        showToast('✅ Connexion rétablie', 'success');
        // Rafraîchir les données
        if (typeof fetchOffers === 'function') {
            fetchOffers();
        }
    });
    
    window.addEventListener('offline', () => {
        updateOnlineStatus();
        showOfflineToast();
    });
}

// Initialiser le mode hors-ligne
function initOfflineMode() {
    initOfflineCache();
    updateOnlineStatus();
    setupOfflineListeners();
    
    // Mettre en cache le menu au chargement
    if (typeof MENU_DATA !== 'undefined') {
        cacheMenuData();
    }
}

// Récupérer la date de dernière synchronisation
function getLastSyncTime() {
    if (!offlineCache.lastSync) return 'Never';
    const date = new Date(offlineCache.lastSync);
    return date.toLocaleString();
}

// Effacer le cache hors-ligne
function clearOfflineCache() {
    offlineCache = {
        menu: null,
        offers: null,
        lastSync: null
    };
    localStorage.removeItem('remal_offline_cache');
    showToast('Cache cleared', 'info');
}
