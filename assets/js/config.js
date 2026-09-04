// ==================== CONFIGURATION SUPABASE ====================
// Configuration partagée pour toutes les interfaces
const SUPABASE_CONFIG = {
    url: 'https://jbcewxdvhvusfmlpjldk.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiY2V3eGR2aHZ1c2ZtbHBqbGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0OTA3NTcsImV4cCI6MjEwNDA2Njc1N30.-AlYlsf5pAOaxNu_hKMUO6sZISM_l5jafcET9CqfLJc',
    whatsappNumber: '971526966865',
    staffPassword: 'remal2024'
};

// Fonction d'initialisation Supabase
function initSupabaseClient() {
    return supabase.createClient(
        SUPABASE_CONFIG.url, 
        SUPABASE_CONFIG.anonKey
    );
}

// Vérifier si Supabase est chargé
if (typeof supabase === 'undefined') {
    console.error('Supabase library not loaded. Check your internet connection.');
}
