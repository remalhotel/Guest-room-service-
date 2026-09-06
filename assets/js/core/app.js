// ==================== APPLICATION INITIALIZATION ====================
function initializeApp() {
    console.log('🚀 Initialisation de Guest Hub...');
    
    initTheme();
    setLanguage(currentLanguage);
    
    // Initialiser le mode hors-ligne
    if (typeof initOfflineMode === 'function') {
        initOfflineMode();
    }
    
    // Initialiser les rappels
    if (typeof initReminders === 'function') {
        initReminders();
    }
    
    // Initialiser le check-out reminder
    if (typeof initCheckoutReminder === 'function') {
        initCheckoutReminder();
    }
    
    // Initialiser la météo
    if (typeof initWeather === 'function') {
        initWeather();
    }
    
    // Initialiser le système d'avis
    if (typeof initReviewSystem === 'function') {
        initReviewSystem();
    }
    
    // Initialiser le profil client
    if (typeof initProfile === 'function') {
        initProfile();
    }
    
    // Initialiser les raccourcis et one-tap
    if (typeof initQuickAccess === 'function') {
        initQuickAccess();
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

// Fonctions pour le feedback de service
window.showServiceFeedbackPrompt = showServiceFeedbackPrompt;
window.selectStar = selectStar;
window.closeServiceFeedback = closeServiceFeedback;
window.submitServiceFeedback = submitServiceFeedback;
window.checkForCompletedRequests = checkForCompletedRequests;

// Fonctions pour les notifications de demandes
window.startRequestNotifications = startRequestNotifications;
window.stopRequestNotifications = stopRequestNotifications;

// Fonctions pour les raccourcis rapides
window.trackServiceUsage = trackServiceUsage;
window.getFrequentServices = getFrequentServices;
window.renderQuickAccess = renderQuickAccess;
window.quickAccessService = quickAccessService;
window.initQuickAccess = initQuickAccess;

// Fonctions pour les one-tap services
window.oneTapService = oneTapService;
window.renderOneTapServices = renderOneTapServices;

// Fonctions pour les rappels
window.initReminders = initReminders;
window.addReminder = addReminder;
window.removeReminder = removeReminder;
window.showRemindersModal = showRemindersModal;
window.closeRemindersModal = closeRemindersModal;
window.showAddReminderForm = showAddReminderForm;
window.saveNewReminder = saveNewReminder;
window.closeReminder = closeReminder;
window.snoozeReminder = snoozeReminder;

// Fonctions pour les offres
window.viewOfferDetails = viewOfferDetails;
window.closeOfferDetails = closeOfferDetails;
window.bookOffer = bookOffer;
window.startOfferNotifications = startOfferNotifications;

// Fonctions pour les réponses rapides du chat
window.sendQuickReply = sendQuickReply;
window.renderQuickReplies = renderQuickReplies;
window.hideQuickReplies = hideQuickReplies;
window.showQuickReplies = showQuickReplies;

// Fonctions pour le check-out
window.initCheckoutReminder = initCheckoutReminder;
window.updateCheckoutCountdown = updateCheckoutCountdown;
window.showCheckoutOptions = showCheckoutOptions;
window.closeCheckoutOptions = closeCheckoutOptions;
window.requestLateCheckout = requestLateCheckout;
window.requestExpressCheckout = requestExpressCheckout;
window.requestBillReview = requestBillReview;

// Fonctions pour les pièces jointes
window.triggerImageUpload = triggerImageUpload;
window.showImagePreview = showImagePreview;
window.clearImagePreview = clearImagePreview;
window.sendImageMessage = sendImageMessage;
window.compressImage = compressImage;

// Fonctions pour les notifications de menu
window.startMenuNotifications = startMenuNotifications;
window.stopMenuNotifications = stopMenuNotifications;
window.filterMenuByCategory = filterMenuByCategory;
window.sortMenuByPrice = sortMenuByPrice;

// Fonctions pour les filtres du menu
window.setMenuCategory = setMenuCategory;
window.toggleMenuBadge = toggleMenuBadge;
window.setMenuSort = setMenuSort;
window.resetMenuFilters = resetMenuFilters;
window.renderMenuFilters = renderMenuFilters;

// Fonctions pour la notation du personnel
window.showStaffRatingModal = showStaffRatingModal;
window.selectStaffStar = selectStaffStar;
window.closeStaffRating = closeStaffRating;
window.submitStaffRating = submitStaffRating;

// Fonctions pour la météo
window.fetchWeather = fetchWeather;
window.renderWeather = renderWeather;
window.initWeather = initWeather;

// Fonctions pour les avis de séjour
window.showReviewModal = showReviewModal;
window.closeReviewModal = closeReviewModal;
window.selectReviewStar = selectReviewStar;
window.selectCategoryStar = selectCategoryStar;
window.setRecommendation = setRecommendation;
window.submitReview = submitReview;
window.initReviewSystem = initReviewSystem;

// Fonctions pour le profil client
window.initProfile = initProfile;
window.showProfileModal = showProfileModal;
window.closeProfileModal = closeProfileModal;
window.toggleDietary = toggleDietary;
window.toggleAllergy = toggleAllergy;
window.toggleRoomPref = toggleRoomPref;
window.toggleNotifications = toggleNotifications;
window.saveProfile = saveProfile;
