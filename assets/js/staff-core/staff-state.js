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

// ==================== EXPOSER GLOBALEMENT ====================
window.supabaseClient = supabaseClient;
window.foodOrders = foodOrders;
window.guestRequests = guestRequests;
window.allRequests = allRequests;
window.currentFilter = currentFilter;
window.currentStaffTab = currentStaffTab;
window.realtimeChannel = realtimeChannel;
window.audioContext = audioContext;
window.soundEnabled = soundEnabled;
window.analyticsPeriod = analyticsPeriod;
window.searchQuery = searchQuery;
window.analyticsCharts = analyticsCharts;
window.staffChatManager = staffChatManager;
window.selectedOfferImage = selectedOfferImage;
window.SERVICE_TAB_MAPPING = SERVICE_TAB_MAPPING;

console.log('✅ Staff state initialized');
console.log('🔌 supabaseClient:', supabaseClient ? 'OK - CONNECTED' : 'MISSING');
