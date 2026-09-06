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
let currentOffersList = [];

// Mapping des services vers les onglets
const SERVICE_TAB_MAPPING = {
    'Front Desk Inquiry': 'front_desk',
    'Luggage Assistance': 'front_desk',
    'Wake-up Call / Alarm Service': 'front_desk',
    'Late Check-out / Extension': 'front_desk',
    'Room Service / Order Food': 'food_beverage',
    'Table Reservation': 'food_beverage',
    'Housekeeping / Room Cleaning': 'housekeeping',
    'Maintenance / Technical Support': 'maintenance'
};

// Initialiser l'état
function initStaffState() {
    console.log('📊 Staff state initialized');
    console.log('🔌 Supabase client:', supabaseClient ? 'OK' : 'MISSING');
}
