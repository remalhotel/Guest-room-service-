// ==================== APPLICATION INITIALIZATION ====================
function initializeApp() {
    console.log('🚀 Initialisation de Guest Hub...');
    
    initTheme();
    setLanguage(currentLanguage);
    
    // Initialiser le mode hors-ligne
    if (typeof initOfflineMode === 'function') {
        initOfflineMode();
    }
    
    // Vérifier si le menu est disponible
    if (typeof isMenuAvailable === 'function' && isMenuAvailable()) {
        renderMenuItems();
    } else {
        console.warn('Menu non disponible');
    }
    
    renderFaqList();
    
    // Restaurer la session APRÈS l'initialisation
    restaurerSession();
    
    // Charger les offres (en ligne ou depuis le cache)
    if (navigator.onLine) {
        fetchOffers();
    } else {
        const cachedOffers = typeof getOfflineOffers === 'function' ? getOfflineOffers() : [];
        renderOffers(cachedOffers);
    }
    
    console.log('✅ Application initialisée');
}

// Attendre que tout le DOM soit chargé
window.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM chargé, initialisation...');
    initializeApp();
});

// Aussi écouter load pour être sûr
window.addEventListener('load', function() {
    console.log('📄 Page complètement chargée');
    const savedRoom = localStorage.getItem('remal_guest_room');
    if (savedRoom) {
        restaurerSession();
    }
});

// Exposer les fonctions globalement pour les onclick dans le HTML
window.setLanguage = setLanguage;
window.toggleTheme = toggleTheme;
window.toggleAutoTheme = toggleAutoTheme;
window.verifierIdentiteClient = verifierIdentiteClient;
window.changerDeChambre = changerDeChambre;
window.switchTab = switchTab;
window.showService = showService;
window.backToServices = backToServices;
window.openMenuModal = openMenuModal;
window.closeMenuModal = closeMenuModal;
window.confirmMenuSelection = confirmMenuSelection;
window.updateCart = updateCart;
window.toggleFavorite = toggleFavorite;
window.renderMenuItems = renderMenuItems;
window.submitRoomServiceOrder = submitRoomServiceOrder;
window.submitOtherService = submitOtherService;
window.openGuestChatModal = openGuestChatModal;
window.closeGuestChatModal = closeGuestChatModal;
window.sendGuestChatMessage = sendGuestChatMessage;
window.toggleChatSound = toggleChatSound;

// Nouvelles fonctions pour les favoris
window.showFavorites = showFavorites;
window.isFavorite = isFavorite;
window.getFavoritesCount = getFavoritesCount;
window.renderFavoritesView = renderFavoritesView;
window.toggleFavoritesView = toggleFavoritesView;

// Fonctions pour le dashboard des demandes
window.createDashboardView = createDashboardView;
window.refreshDashboard = refreshDashboard;
window.cancelRequest = cancelRequest;
window.viewRequestDetails = viewRequestDetails;
window.closeRequestDetails = closeRequestDetails;
window.getRequestStatusConfig = getRequestStatusConfig;

// Fonctions pour les notifications de commande
window.submitFeedback = submitFeedback;
window.startOrderNotifications = startOrderNotifications;
window.stopOrderNotifications = stopOrderNotifications;

// Fonctions pour l'historique
window.fetchOrderHistory = fetchOrderHistory;
window.renderOrderHistory = renderOrderHistory;
window.trackOrder = trackOrder;
window.showOrderHistory = showOrderHistory;

// Fonctions pour les suggestions
window.fetchPersonalizedSuggestions = fetchPersonalizedSuggestions;
window.renderSuggestions = renderSuggestions;
window.addSuggestionToCart = addSuggestionToCart;
window.refreshSuggestions = refreshSuggestions;

// Fonctions pour le mode hors-ligne
window.initOfflineMode = initOfflineMode;
window.updateOnlineStatus = updateOnlineStatus;
window.clearOfflineCache = clearOfflineCache;
window.getLastSyncTime = getLastSyncTime;
