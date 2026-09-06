// ==================== STAFF STATE MANAGEMENT ====================
const supabaseClient = typeof initSupabaseClient === 'function' ? initSupabaseClient() : null;

let foodOrders = [];
let guestRequests = [];
let allRequests = [];
let currentFilter = 'all';
let currentStaffTab = 'front_desk';
let realtimeChannel = null;
let audioContext = null;
let soundEnabled = false;
let analyticsPeriod = 'today';
let searchQuery = '';
let analyticsCharts = {};
let staffChatManager = null;
let selectedOfferImage = null;

// Mapping des services vers les onglets
const SERVICE_TAB_MAPPING = {
    'Front Desk Inquiry': 'front_desk',
    'Luggage Assistance': 'front_desk',
    'Wake-up Call / Alarm Service': 'front_desk',
    'Late Check-out / Extension': 'front_desk',
    'Room Service / Order Food': 'food_beverage',
    'Table Reservation': 'food_beverage',
    'Housekeeping / Room Cleaning': 'housekeeping',
    'Maintenance / Technical Support': 'maintenance',
    'Express Check-out': 'front_desk',
    'Bill Review': 'front_desk',
    'Profile Update': 'front_desk'
};

// Exposer globalement
window.supabaseClient = supabaseClient;

console.log('✅ Staff state initialized');
console.log('🔌 supabaseClient:', supabaseClient ? 'OK' : 'MISSING');
