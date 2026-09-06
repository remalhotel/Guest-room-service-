// ==================== STAFF AUTHENTICATION ====================
const STAFF_CREDENTIALS = {
    'admin': { password: 'remal2024', name: 'Administrator', role: 'admin' },
    'frontdesk': { password: 'front2024', name: 'Front Desk Staff', role: 'front_desk' },
    'fnb': { password: 'fnb2024', name: 'F&B Staff', role: 'food_beverage' },
    'housekeeping': { password: 'house2024', name: 'Housekeeping Staff', role: 'housekeeping' },
    'maintenance': { password: 'maint2024', name: 'Maintenance Staff', role: 'maintenance' }
};

let currentStaffUser = null;

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
    
    // Récupérer les infos du staff
    const staffData = sessionStorage.getItem('staff_user');
    if (staffData) {
        try {
            currentStaffUser = JSON.parse(staffData);
        } catch (e) {
            currentStaffUser = null;
        }
    }
    
    return true;
}

function staffLogin(username, password) {
    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();
    
    const staff = STAFF_CREDENTIALS[cleanUsername];
    
    if (!staff || staff.password !== cleanPassword) {
        return { success: false, message: 'Invalid username or password' };
    }
    
    // Sauvegarder la session
    sessionStorage.setItem('staff_authorized', 'true');
    sessionStorage.setItem('staff_login_time', new Date().toISOString());
    sessionStorage.setItem('staff_user', JSON.stringify({
        username: cleanUsername,
        name: staff.name,
        role: staff.role
    }));
    
    currentStaffUser = {
        username: cleanUsername,
        name: staff.name,
        role: staff.role
    };
    
    return { success: true, message: 'Login successful', staff: currentStaffUser };
}

function logoutStaff() {
    sessionStorage.removeItem('staff_authorized');
    sessionStorage.removeItem('staff_login_time');
    sessionStorage.removeItem('staff_user');
    
    if (realtimeChannel) {
        supabaseClient.removeChannel(realtimeChannel);
        realtimeChannel = null;
    }
    
    window.location.href = 'staff-login.html';
}

function getCurrentStaffName() {
    return currentStaffUser?.name || 'Staff Member';
}

function getCurrentStaffRole() {
    return currentStaffUser?.role || 'admin';
}

function hasPermission(requiredRole) {
    if (!currentStaffUser) return false;
    if (currentStaffUser.role === 'admin') return true;
    return currentStaffUser.role === requiredRole;
}
