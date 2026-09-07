// ==================== STATE MANAGEMENT ====================
const supabaseClient = initSupabaseClient();
const pmsSupabaseClient = initPmsSupabaseClient();

let menuCart = {};
let cachedGuestData = null;
let isGuestVerified = false;
let currentOrderId = localStorage.getItem('remal_current_order_id') || null;
let favoritesList = JSON.parse(localStorage.getItem('remal_favorites') || '{"dishes":{},"services":{},"offers":{}}');
let currentService = null;
let currentTab = 'services';
let currentOffers = [];
let currentLanguage = localStorage.getItem('remal_language') || 'en';
let trackingTimeout = null;
let guestChatManager = null;

window.activeServiceRequests = window.activeServiceRequests || [];

window.supabaseClient = supabaseClient;
window.pmsSupabaseClient = pmsSupabaseClient;
window.menuCart = menuCart;
window.cachedGuestData = cachedGuestData;
window.isGuestVerified = isGuestVerified;
window.currentOrderId = currentOrderId;
window.favoritesList = favoritesList;
window.currentService = currentService;
window.currentTab = currentTab;
window.currentOffers = currentOffers;
window.currentLanguage = currentLanguage;

console.log('✅ State initialized');
console.log('🔌 supabaseClient:', supabaseClient ? 'OK' : 'MISSING');
