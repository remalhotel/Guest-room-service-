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
let serviceRequestsTimeout = null;
let guestChatManager = null;

window.activeServiceRequests = window.activeServiceRequests || [];

// ==================== EXPOSER GLOBALEMENT ====================
window.supabaseClient = supabaseClient;
window.pmsSupabaseClient = pmsSupabaseClient;

console.log('✅ Guest Hub state initialized');
console.log('🔌 supabaseClient:', supabaseClient ? 'OK - CONNECTED' : 'MISSING');
console.log('🔌 pmsSupabaseClient:', pmsSupabaseClient ? 'OK - CONNECTED' : 'MISSING');
