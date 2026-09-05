// ==================== APPLICATION INITIALIZATION ====================
function initializeApp() {
    initTheme();
    setLanguage(currentLanguage);
    renderMenuItems();
    renderFaqList();
    restaurerSession();
    fetchOffers();
    
    // Écouteurs d'événements globaux
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Guest Hub Application Initialized');
    });
}

// Initialisation immédiate
initializeApp();

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
