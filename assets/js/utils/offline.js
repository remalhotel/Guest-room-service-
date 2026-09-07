// ==================== MODE HORS-LIGNE ====================
let offlineCache = {
    offers: null,
    lastSync: null
};

function initOfflineMode() {
    // Charger le cache
    try {
        const saved = localStorage.getItem('remal_offline_cache');
        if (saved) offlineCache = JSON.parse(saved);
    } catch(e) {}
    
    updateOnlineStatus();
    
    // Écouter les changements de connexion
    window.addEventListener('online', () => {
        updateOnlineStatus();
        showToast('✅ Connection restored!', 'success');
        fetchOffers();
    });
    
    window.addEventListener('offline', () => {
        updateOnlineStatus();
        showToast('📴 Offline mode - using cached data', 'info');
    });
}

function updateOnlineStatus() {
    const indicator = document.getElementById('onlineStatusIndicator');
    if (!indicator) return;
    
    if (navigator.onLine) {
        indicator.innerHTML = '<span style="color:#10b981; font-size:9px; font-weight:bold;">● Online</span>';
    } else {
        indicator.innerHTML = '<span style="color:#f59e0b; font-size:9px; font-weight:bold;">● Offline Mode</span>';
    }
}

function cacheOffersData(offers) {
    if (offers && offers.length > 0) {
        offlineCache.offers = offers;
        offlineCache.lastSync = new Date().toISOString();
        try {
            localStorage.setItem('remal_offline_cache', JSON.stringify(offlineCache));
        } catch(e) {}
    }
}

function getOfflineOffers() {
    return offlineCache.offers || [];
}

function isOnline() {
    return navigator.onLine;
}

window.initOfflineMode = initOfflineMode;
window.updateOnlineStatus = updateOnlineStatus;
window.cacheOffersData = cacheOffersData;
window.getOfflineOffers = getOfflineOffers;
window.isOnline = isOnline;
