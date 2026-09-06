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
    console.log('📡 Setting up realtime...');
    
    if (!supabaseClient) {
        console.error('❌ No supabaseClient for realtime');
        return;
    }
    
    // Fermer l'ancien canal
    if (realtimeChannel) {
        supabaseClient.removeChannel(realtimeChannel);
        realtimeChannel = null;
    }
    
    // Créer le nouveau canal
    realtimeChannel = supabaseClient
        .channel('guest-hub-realtime-staff')
        .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'food_orders' 
        }, (payload) => {
            console.log('🔔 NEW FOOD ORDER:', payload.new);
            playNotificationSound();
            showNotificationPopup('🔔 New food order received!');
            sendBrowserNotification('New Order!', 'A new food order has been placed');
            fetchAllData();
        })
        .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'guest_requests' 
        }, (payload) => {
            console.log('🔔 NEW GUEST REQUEST:', payload.new);
            playNotificationSound();
            showNotificationPopup('🔔 New service request received!');
            sendBrowserNotification('New Request!', 'A new service request has been placed');
            fetchAllData();
        })
        .on('postgres_changes', { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'food_orders' 
        }, (payload) => {
            console.log('📝 Food order updated:', payload.new.status);
            fetchAllData();
        })
        .on('postgres_changes', { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'guest_requests' 
        }, (payload) => {
            console.log('📝 Guest request updated:', payload.new.status);
            fetchAllData();
        })
        .subscribe((status) => {
            console.log('📡 Realtime status:', status);
            if (status === 'SUBSCRIBED') {
                console.log('✅ Realtime subscribed successfully');
            }
        });
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

// Aussi écouter load
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
window.setupRealtime = setupRealtime;

console.log('✅ All staff functions exposed');
