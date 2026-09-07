// ==================== STAFF APP INITIALIZATION ====================
function initStaffApp() {
    initTheme();
    updateDateTimeDisplay();
    setInterval(updateDateTimeDisplay, 1000);
    fetchAllData();
    fetchOffers();
    setupRealtime();
}

function setupRealtime() {
    if (realtimeChannel && supabaseClient) supabaseClient.removeChannel(realtimeChannel);
    
    realtimeChannel = supabaseClient
        .channel('staff-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'food_orders' }, (payload) => {
            if (payload.eventType === 'INSERT') {
                playNotificationSound();
                showNotificationPopup('🔔 New food order!');
            }
            fetchAllData();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'guest_requests' }, (payload) => {
            if (payload.eventType === 'INSERT') {
                playNotificationSound();
                showNotificationPopup('🔔 New service request!');
            }
            fetchAllData();
        })
        .subscribe();
}

function logoutStaff() {
    sessionStorage.removeItem('staff_authorized');
    sessionStorage.removeItem('staff_login_time');
    window.location.href = 'staff-login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const isAuthorized = sessionStorage.getItem('staff_authorized');
    if (!isAuthorized) { window.location.href = 'staff-login.html'; return; }
    initStaffApp();
});

window.logoutStaff = logoutStaff;
