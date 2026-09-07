// ==================== STAFF APP INITIALIZATION ====================
let currentStaffRole = 'admin';
let currentStaffName = 'Administrator';

function getStaffRole() {
    const staffData = sessionStorage.getItem('staff_user');
    if (staffData) {
        try {
            const parsed = JSON.parse(staffData);
            return parsed.role || 'admin';
        } catch(e) {}
    }
    return 'admin';
}

function initStaffApp() {
    currentStaffRole = getStaffRole();
    
    initTheme();
    updateDateTimeDisplay();
    setInterval(updateDateTimeDisplay, 1000);
    
    // Appliquer les restrictions de rôle
    applyRoleRestrictions();
    
    // Définir l'onglet par défaut selon le rôle
    if (currentStaffRole === 'food_beverage') currentStaffTab = 'food_beverage';
    else if (currentStaffRole === 'housekeeping') currentStaffTab = 'housekeeping';
    else if (currentStaffRole === 'maintenance') currentStaffTab = 'maintenance';
    else if (currentStaffRole === 'front_desk') currentStaffTab = 'front_desk';
    else currentStaffTab = 'front_desk';
    
    fetchAllData();
    fetchOffers();
    setupRealtime();
    
    // Afficher le nom du staff
    updateStaffHeader();
}

function updateStaffHeader() {
    const staffData = sessionStorage.getItem('staff_user');
    if (staffData) {
        try {
            const parsed = JSON.parse(staffData);
            currentStaffName = parsed.name || 'Staff';
            const headerEl = document.querySelector('h1');
            if (headerEl && currentStaffRole !== 'admin') {
                headerEl.innerText = parsed.name.toUpperCase() + ' DASHBOARD';
            }
        } catch(e) {}
    }
}

function applyRoleRestrictions() {
    const role = currentStaffRole;
    
    if (role === 'admin') return; // Admin voit tout
    
    // Masquer TOUS les onglets
    const allTabs = [
        'staffTabFrontDesk',
        'staffTabFoodBeverage',
        'staffTabHousekeeping',
        'staffTabMaintenance',
        'staffTabOffers',
        'staffTabAnalytics'
    ];
    
    allTabs.forEach(tabId => {
        const btn = document.getElementById(tabId);
        if (btn) btn.classList.add('hidden');
    });
    
    // Afficher UNIQUEMENT l'onglet du rôle
    const roleTabMap = {
        'front_desk': 'staffTabFrontDesk',
        'food_beverage': 'staffTabFoodBeverage',
        'housekeeping': 'staffTabHousekeeping',
        'maintenance': 'staffTabMaintenance'
    };
    
    const tabToShow = roleTabMap[role];
    if (tabToShow) {
        const btn = document.getElementById(tabToShow);
        if (btn) {
            btn.classList.remove('hidden');
            btn.classList.add('active');
        }
    }
    
    // Masquer les sections non autorisées
    document.getElementById('offersManagementSection')?.classList.add('hidden');
    document.getElementById('analyticsSection')?.classList.add('hidden');
}

function setupRealtime() {
    if (realtimeChannel && supabaseClient) supabaseClient.removeChannel(realtimeChannel);
    
    realtimeChannel = supabaseClient
        .channel('staff-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'food_orders' }, (payload) => {
            // Seul admin et F&B voient les commandes nourriture
            if (currentStaffRole === 'admin' || currentStaffRole === 'food_beverage') {
                if (payload.eventType === 'INSERT') {
                    playNotificationSound();
                    showNotificationPopup('🔔 New food order!');
                }
                fetchAllData();
            }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'guest_requests' }, (payload) => {
            const newRequest = payload.new;
            const tabCategory = SERVICE_TAB_MAPPING[newRequest?.service_type] || 'front_desk';
            
            // Ne notifier que si la demande appartient au rôle du staff
            if (currentStaffRole === 'admin' || currentStaffRole === tabCategory) {
                if (payload.eventType === 'INSERT') {
                    playNotificationSound();
                    showNotificationPopup('🔔 New ' + tabCategory + ' request!');
                }
                fetchAllData();
            }
        })
        .subscribe();
}

function logoutStaff() {
    sessionStorage.removeItem('staff_authorized');
    sessionStorage.removeItem('staff_login_time');
    sessionStorage.removeItem('staff_user');
    window.location.href = 'staff-login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const isAuthorized = sessionStorage.getItem('staff_authorized');
    if (!isAuthorized) { window.location.href = 'staff-login.html'; return; }
    initStaffApp();
});

window.logoutStaff = logoutStaff;
