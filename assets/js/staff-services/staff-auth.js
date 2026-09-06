// ==================== STAFF AUTHENTICATION ====================
function checkStaffSession() {
    const isAuthorized = sessionStorage.getItem('staff_authorized');
    if (!isAuthorized) {
        window.location.href = 'staff-login.html';
        return false;
    }
    
    const loginTime = sessionStorage.getItem('staff_login_time');
    if (loginTime) {
        const elapsed = Date.now() - new Date(loginTime).getTime();
        const maxDuration = 8 * 60 * 60 * 1000; // 8 heures
        if (elapsed > maxDuration) {
            logoutStaff();
            return false;
        }
    }
    
    return true;
}

function logoutStaff() {
    sessionStorage.removeItem('staff_authorized');
    sessionStorage.removeItem('staff_login_time');
    sessionStorage.removeItem('staff_user');
    
    if (realtimeChannel && supabaseClient) {
        supabaseClient.removeChannel(realtimeChannel);
        realtimeChannel = null;
    }
    
    window.location.href = 'staff-login.html';
}
