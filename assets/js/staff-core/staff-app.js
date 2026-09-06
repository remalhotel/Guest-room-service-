// ==================== STAFF APPLICATION INITIALIZATION ====================
function initStaffApp() {
    console.log('🚀 Initializing Staff Dashboard...');
    
    initStaffState();
    initTheme();
    updateDateTimeDisplay();
    requestNotificationPermission();
    
    // Démarrer l'horloge
    setInterval(updateDateTimeDisplay, 1000);
    
    // Charger les données
    fetchAllData();
    fetchOffers();
    
    // Configurer le temps réel
    setupRealtime();
    
    console.log('✅ Staff Dashboard initialized');
}

function setupRealtime() {
    if (realtimeChannel) {
        supabaseClient.removeChannel(realtimeChannel);
    }
    
    realtimeChannel = supabaseClient
        .channel('guest-hub-realtime-staff')
        .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'food_orders' 
        }, (payload) => {
            if (payload.eventType === 'INSERT') {
                playNotificationSound();
                showNotificationPopup('🔔 New food order received!');
                sendBrowserNotification('New Order!', 'A new food order has been placed');
            }
            fetchAllData();
        })
        .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'guest_requests' 
        }, (payload) => {
            if (payload.eventType === 'INSERT') {
                playNotificationSound();
                showNotificationPopup('🔔 New service request received!');
                sendBrowserNotification('New Request!', 'A new service request has been placed');
            }
            fetchAllData();
        })
        .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'offers' 
        }, () => {
            fetchOffers();
        })
        .subscribe();
    
    console.log('✅ Realtime configured');
}

// Vérification de session au chargement
document.addEventListener('DOMContentLoaded', () => {
    const isAuthorized = checkStaffSession();
    if (isAuthorized) {
        initStaffApp();
    }
});

// Exposer les fonctions globalement
window.switchStaffTab = switchStaffTab;
window.filterStaffOrders = filterStaffOrders;
window.handleSearch = handleSearch;
window.updateFoodOrderStatus = updateFoodOrderStatus;
window.updateGuestRequestStatus = updateGuestRequestStatus;
window.deleteFoodOrder = deleteFoodOrder;
window.deleteGuestRequest = deleteGuestRequest;
window.openChatModal = openChatModal;
window.closeChatModal = closeChatModal;
window.sendChatMessage = sendChatMessage;
window.sendStaffQuickReply = sendStaffQuickReply;
window.toggleTheme = toggleTheme;
window.enableSoundAlerts = enableSoundAlerts;
window.toggleSoundAlerts = toggleSoundAlerts;
window.publishOffer = publishOffer;
window.handleOfferImageSelect = handleOfferImageSelect;
window.toggleOfferActive = toggleOfferActive;
window.deleteOffer = deleteOffer;
window.setAnalyticsPeriod = setAnalyticsPeriod;
window.exportAnalyticsCSV = exportAnalyticsCSV;
window.exportAnalyticsPDF = exportAnalyticsPDF;
window.generateFoodOrderPDF = generateFoodOrderPDF;
window.printFoodOrderPDF = printFoodOrderPDF;
window.logoutStaff = logoutStaff;
window.renderStaffQuickReplies = renderStaffQuickReplies;
