// ==================== STAFF APPLICATION INITIALIZATION ====================
function initStaffApp() {
    console.log('🚀 Initializing Staff Dashboard...');
    
    initTheme();
    updateDateTimeDisplay();
    
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
            console.log('📩 Realtime food_orders event:', payload.eventType);
            if (payload.eventType === 'INSERT') {
                playNotificationSound();
                showNotificationPopup('🔔 New food order received!');
            }
            fetchAllData();
        })
        .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'guest_requests' 
        }, (payload) => {
            console.log('📩 Realtime guest_requests event:', payload.eventType);
            if (payload.eventType === 'INSERT') {
                playNotificationSound();
                showNotificationPopup('🔔 New service request received!');
            }
            fetchAllData();
        })
        .subscribe((status) => {
            console.log('📡 Realtime status:', status);
        });
    
    console.log('✅ Realtime configured');
}

// Vérification de session au chargement
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded, checking session...');
    
    const isAuthorized = checkStaffSession();
    console.log('🔐 Session authorized:', isAuthorized);
    
    if (isAuthorized) {
        initStaffApp();
    }
});

// Aussi écouter load pour être sûr
window.addEventListener('load', () => {
    console.log('📄 Page fully loaded');
    const isAuthorized = sessionStorage.getItem('staff_authorized');
    if (isAuthorized && !document.querySelector('.staff-tab-btn.active')) {
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
window.renderStaffQuickReplies = renderStaffQuickReplies;
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
