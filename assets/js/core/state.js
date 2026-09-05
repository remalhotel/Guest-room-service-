// ==================== STATE MANAGEMENT ====================
const supabaseClient = typeof initSupabaseClient === 'function' ? initSupabaseClient() : null;
const pmsSupabaseClient = typeof initPmsSupabaseClient === 'function' ? initPmsSupabaseClient() : null;

let menuCart = {};
let cachedGuestData = null;
let isGuestVerified = false;
let currentOrderId = localStorage.getItem('remal_current_order_id') || null;
let favoritesList = JSON.parse(localStorage.getItem('remal_favorites') || '{}');
let currentService = null;
let currentTab = 'services';
let currentOffers = [];
let currentLanguage = localStorage.getItem('remal_language') || 'en';
let trackingTimeout = null;
let serviceRequestsTimeout = null;
let guestChatManager = null;

// Initialize window.activeServiceRequests
window.activeServiceRequests = window.activeServiceRequests || [];
