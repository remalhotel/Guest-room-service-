// ==================== APPLICATION INITIALIZATION ====================
function initializeApp() {
    console.log('🚀 Initialisation de Guest Hub...');
    
    initTheme();
    
    // Détecter et appliquer la langue préférée
    const detectedLang = typeof detectPreferredLanguage === 'function' ? detectPreferredLanguage() : currentLanguage;
    setLanguage(detectedLang);
    
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
    
    // Initialiser le résumé quotidien
    if (typeof initDailySummary === 'function') {
        initDailySummary();
    }
    
    // Initialiser la météo
    if (typeof initWeather === 'function') {
        initWeather();
    }
    
    // Initialiser les suggestions intelligentes
    if (typeof initSmartSuggestions === 'function') {
        initSmartSuggestions();
    }
    
    // Initialiser le système d'avis
    if (typeof initReviewSystem === 'function') {
        initReviewSystem();
    }
    
    // Initialiser le profil client
    if (typeof initProfile === 'function') {
        initProfile();
    }
    
    // Initialiser les préférences de notification
    if (typeof initNotificationSettings === 'function') {
        initNotificationSettings();
    }
    
    // Initialiser le feedback avec émojis
    if (typeof initEmojiFeedback === 'function') {
        initEmojiFeedback();
    }
    
    // Initialiser les raccourcis clavier
    if (typeof initKeyboardShortcuts === 'function') {
        initKeyboardShortcuts();
    }
    
    // Initialiser le centre de notifications
    if (typeof initNotificationCenter === 'function') {
        initNotificationCenter();
    }
    
    // Initialiser les raccourcis et one-tap
    if (typeof initQuickAccess === 'function') {
        initQuickAccess();
    }
    
    // Initialiser le message de bienvenue
    if (typeof initWelcomeSystem === 'function') {
        initWelcomeSystem();
    }
    
    // Afficher le bouton de partage
    if (typeof showShareButton === 'function') {
        showShareButton();
    }
    
    // Afficher le bouton des sons d'ambiance
    if (typeof showAmbientSoundsButton === 'function') {
        showAmbientSoundsButton();
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
window.toggleNightMode = toggleNightMode;
window.renderThemeIndicator = renderThemeIndicator;
window.getThemeStatus = getThemeStatus;
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

// Fonctions pour le récapitulatif de commande
window.showOrderSummary = showOrderSummary;
window.closeOrderSummary = closeOrderSummary;
window.confirmOrder = confirmOrder;

// Fonctions pour l'historique
window.fetchOrderHistory = fetchOrderHistory;
window.renderOrderHistory = renderOrderHistory;
window.trackOrder = trackOrder;
window.showOrderHistory = showOrderHistory;
window.reorderFromHistory = reorderFromHistory;

// Fonctions pour les suggestions
window.fetchPersonalizedSuggestions = fetchPersonalizedSuggestions;
window.renderSuggestions = renderSuggestions;
window.addSuggestionToCart = addSuggestionToCart;
window.refreshSuggestions = refreshSuggestions;

// Fonctions pour les suggestions intelligentes
window.initSmartSuggestions = initSmartSuggestions;
window.renderSmartSuggestions = renderSmartSuggestions;
window.handleSmartSuggestion = handleSmartSuggestion;
window.stopSmartSuggestions = stopSmartSuggestions;

// Fonctions pour la commande famille
window.showFamilyOrderModal = showFamilyOrderModal;
window.closeFamilyOrder = closeFamilyOrder;
window.adjustFamilyCount = adjustFamilyCount;
window.submitFamilyOrder = submitFamilyOrder;
window.updateFamilySelectedItems = updateFamilySelectedItems;

// Fonctions pour les sons d'ambiance
window.showAmbientSoundsModal = showAmbientSoundsModal;
window.closeAmbientSounds = closeAmbientSounds;
window.toggleAmbientSound = toggleAmbientSound;
window.stopAmbientSound = stopAmbientSound;
window.adjustAmbientVolume = adjustAmbientVolume;
window.showAmbientSoundsButton = showAmbientSoundsButton;

// Fonctions pour le résumé quotidien
window.initDailySummary = initDailySummary;
window.generateDailySummary = generateDailySummary;
window.showDailySummaryModal = showDailySummaryModal;
window.closeDailySummary = closeDailySummary;
window.stopDailySummary = stopDailySummary;

// Fonctions pour l'assistant de check-out
window.showCheckoutWizard = showCheckoutWizard;
window.closeCheckoutWizard = closeCheckoutWizard;
window.nextCheckoutStep = nextCheckoutStep;
window.prevCheckoutStep = prevCheckoutStep;
window.completeCheckout = completeCheckout;
window.quickRateStay = quickRateStay;

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

// Fonctions pour les rappels de demandes
window.startPendingReminders = startPendingReminders;
window.stopPendingReminders = stopPendingReminders;
window.contactStaffAboutRequest = contactStaffAboutRequest;

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
window.renderPreferencesSummary = renderPreferencesSummary;

// Fonctions pour les préférences de notification
window.initNotificationSettings = initNotificationSettings;
window.showNotificationSettingsModal = showNotificationSettingsModal;
window.closeNotificationSettings = closeNotificationSettings;
window.toggleNotificationPref = toggleNotificationPref;
window.saveNotificationSettingsAndClose = saveNotificationSettingsAndClose;
window.shouldNotify = shouldNotify;

// Fonctions pour le feedback avec émojis
window.showEmojiFeedbackModal = showEmojiFeedbackModal;
window.selectEmojiRating = selectEmojiRating;
window.closeEmojiFeedback = closeEmojiFeedback;
window.submitEmojiFeedback = submitEmojiFeedback;
window.initEmojiFeedback = initEmojiFeedback;

// Fonctions pour les raccourcis clavier
window.initKeyboardShortcuts = initKeyboardShortcuts;
window.showShortcutsModal = showShortcutsModal;
window.closeShortcutsModal = closeShortcutsModal;
window.toggleKeyboardShortcuts = toggleKeyboardShortcuts;
window.cycleLanguage = cycleLanguage;

// Fonctions pour le centre de notifications
window.initNotificationCenter = initNotificationCenter;
window.addNotification = addNotification;
window.markNotificationAsRead = markNotificationAsRead;
window.markAllNotificationsAsRead = markAllNotificationsAsRead;
window.clearAllNotifications = clearAllNotifications;
window.toggleNotificationPanel = toggleNotificationPanel;
window.openNotificationPanel = openNotificationPanel;
window.closeNotificationPanel = closeNotificationPanel;

// Fonctions pour le suivi en temps réel
window.startLiveTracking = startLiveTracking;
window.showLiveTrackingModal = showLiveTrackingModal;
window.updateLiveTracking = updateLiveTracking;
window.closeLiveTracking = closeLiveTracking;

// Fonctions pour le badge de messages non lus
window.startUnreadBadgeCheck = startUnreadBadgeCheck;
window.checkUnreadMessages = checkUnreadMessages;
window.clearUnreadBadge = clearUnreadBadge;

// Fonctions pour le sélecteur de langue
window.applyPreferredLanguage = applyPreferredLanguage;
window.detectPreferredLanguage = detectPreferredLanguage;
window.renderLanguageSelector = renderLanguageSelector;
window.toggleLanguageDropdown = toggleLanguageDropdown;
window.selectLanguage = selectLanguage;
window.closeLanguageDropdown = closeLanguageDropdown;
window.showLanguageSettings = showLanguageSettings;
window.closeLanguageSettings = closeLanguageSettings;

// Fonctions pour le partage
window.showShareModal = showShareModal;
window.closeShareModal = closeShareModal;
window.shareViaWhatsApp = shareViaWhatsApp;
window.shareViaSMS = shareViaSMS;
window.shareViaEmail = shareViaEmail;
window.copyShareLink = copyShareLink;
window.shareNative = shareNative;
window.showShareButton = showShareButton;

// Fonctions pour le message de bienvenue
window.showWelcomeMessage = showWelcomeMessage;
window.initWelcomeSystem = initWelcomeSystem;
