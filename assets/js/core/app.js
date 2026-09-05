// ==================== APPLICATION INITIALIZATION ====================
function initializeApp() {
    initTheme();
    setLanguage(currentLanguage);
    renderMenuItems();
    renderFaqList();
    
    // Restaurer la session APRÈS l'initialisation du DOM
    restaurerSession();
    
    // Charger les offres
    fetchOffers();
}

// Attendre que le DOM soit complètement chargé avant d'initialiser
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // Le DOM est déjà chargé
    initializeApp();
}

// Exposer les fonctions globalement pour les onclick dans le HTML
window.setLanguage = setLanguage;
window.toggleTheme = toggleTheme;
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
