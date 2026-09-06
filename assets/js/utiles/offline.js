// ==================== MODE HORS-LIGNE AVEC RECONNEXION AUTO ====================
let offlineCache = {
    menu: null,
    offers: null,
    lastSync: null
};

let reconnectAttempts = 0;
let maxReconnectAttempts = 5;
let reconnectDelay = 3000; // 3 secondes
let connectionMonitorInterval = null;

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

// Vérifier si le menu est disponible
function isMenuAvailable() {
    return typeof MENU_DATA !== 'undefined' || (offlineCache.menu !== null);
}

// Récupérer le menu
function getMenuData() {
    if (typeof MENU_DATA !== 'undefined') {
        cacheMenuData();
        return MENU_DATA;
    } else if (offlineCache.menu) {
        return offlineCache.menu;
    }
    return null;
}

// Récupérer les offres en cache
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

// Afficher un toast pour la reconnexion
function showReconnectToast() {
    showToast('🔄 Reconnexion...', 'info');
}

// Afficher un toast quand la connexion est rétablie
function showReconnectedToast() {
    showToast('✅ Connexion rétablie !', 'success');
}

// Écouter les changements de connexion
function setupOfflineListeners() {
    window.addEventListener('online', () => {
        reconnectAttempts = 0;
        updateOnlineStatus();
        showReconnectedToast();
        refreshDataAfterReconnect();
    });
    
    window.addEventListener('offline', () => {
        updateOnlineStatus();
        showOfflineToast();
    });
}

// Rafraîchir les données après reconnexion
function refreshDataAfterReconnect() {
    // Rafraîchir les offres
    if (typeof fetchOffers === 'function') {
        fetchOffers();
    }
    
    // Rafraîchir les demandes
    if (typeof fetchServiceRequestsTracking === 'function') {
        fetchServiceRequestsTracking();
    }
    
    // Rafraîchir l'historique
    if (typeof fetchOrderHistory === 'function') {
        fetchOrderHistory();
    }
    
    // Rafraîchir la facturation si disponible
    if (typeof fetchBillingData === 'function') {
        fetchBillingData();
    }
    
    // Rafraîchir la météo
    if (typeof fetchWeather === 'function') {
        fetchWeather();
    }
}

// Surveiller la connexion en continu
function startConnectionMonitor() {
    if (connectionMonitorInterval) clearInterval(connectionMonitorInterval);
    
    connectionMonitorInterval = setInterval(() => {
        if (!isOnline() && reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            showReconnectToast();
            
            // Essayer de se reconnecter après un délai
            setTimeout(() => {
                if (isOnline()) {
                    reconnectAttempts = 0;
                    updateOnlineStatus();
                    showReconnectedToast();
                    refreshDataAfterReconnect();
                }
            }, reconnectDelay);
        }
    }, 10 * 1000); // Vérifier toutes les 10 secondes
}

// Initialiser le mode hors-ligne
function initOfflineMode() {
    initOfflineCache();
    updateOnlineStatus();
    setupOfflineListeners();
    startConnectionMonitor();
    
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

// Vérifier la qualité de la connexion
function checkConnectionQuality() {
    if ('connection' in navigator) {
        const connection = navigator.connection;
        const types = ['slow-2g', '2g', '3g', '4g'];
        const type = connection.effectiveType || 'unknown';
        
        if (type === 'slow-2g' || type === '2g') {
            showToast('⚠️ Connexion lente détectée', 'info');
        }
        
        return {
            type: type,
            downlink: connection.downlink || 0,
            rtt: connection.rtt || 0
        };
    }
    return null;
}
