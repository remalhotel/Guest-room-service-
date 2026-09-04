// ==================== CONFIGURATION SUPABASE ====================

const SUPABASE_CONFIG = {
    // Supabase principal (commandes de nourriture)
    url: 'https://jbcewxdvhvusfmlpjldk.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiY2V3eGR2aHZ1c2ZtbHBqbGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0OTA3NTcsImV4cCI6MjEwNDA2Njc1N30.-AlYlsf5pAOaxNu_hKMUO6sZISM_l5jafcET9CqfLJc',
    
    // Supabase PMS (données clients) - CE SONT LES BONNES COORDONNÉES
    pmsUrl: 'https://kmtnkjhjbmsietrlebhs.supabase.co',
    pmsAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttdG5ramhqYm1zaWV0cmxlYmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzMjQ1MTMsImV4cCI6MjEwMTkwMDUxM30.fOMotE-gsxKkTtrgzbrk5qsC22qWdQmF__k89Xt-ErA',
    
    // WhatsApp
    whatsappNumber: '971526966865',
    
    // Staff
    staffPassword: 'remal2024'
};

// Fonction d'initialisation Supabase (commandes)
function initSupabaseClient() {
    return supabase.createClient(
        SUPABASE_CONFIG.url, 
        SUPABASE_CONFIG.anonKey
    );
}

// Fonction d'initialisation Supabase PMS (données clients)
function initPmsSupabaseClient() {
    return supabase.createClient(
        SUPABASE_CONFIG.pmsUrl, 
        SUPABASE_CONFIG.pmsAnonKey
    );
}

// Fonction de test de connexion PMS
async function testPmsConnection() {
    const client = initPmsSupabaseClient();
    
    try {
        const { data, error, count } = await client
            .from('pms_guests')
            .select('*', { count: 'exact' })
            .limit(5);
        
        if (error) {
            console.error('❌ PMS Connection Error:', error.message);
            console.error('Error details:', error);
            return { success: false, error: error.message, data: null };
        }
        
        console.log('✅ PMS Connection successful!');
        console.log('📊 Total records:', count);
        console.log('📋 Sample data:', data);
        
        return { success: true, error: null, data: data, count: count };
        
    } catch (err) {
        console.error('❌ PMS Connection failed:', err);
        return { success: false, error: err.message, data: null };
    }
}

// Vérifier si Supabase est chargé
if (typeof supabase === 'undefined') {
    console.error('❌ Supabase library not loaded!');
} else {
    console.log('✅ Supabase library loaded');
}
