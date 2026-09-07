// ==================== RÉSUMÉ QUOTIDIEN AUTOMATIQUE ====================
function initDailySummary() {
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem('remal_daily_summary_date');
    
    if (lastShown === today) return; // Déjà montré aujourd'hui
    
    const hour = new Date().getHours();
    
    // Afficher le résumé entre 8h et 10h du matin
    if (hour >= 8 && hour <= 10) {
        setTimeout(() => showDailySummary(), 3000);
    }
}

async function showDailySummary() {
    const room = localStorage.getItem('remal_guest_room');
    if (!room || !window.supabaseClient) return;
    
    let pendingCount = 0;
    let activeOrders = 0;
    
    try {
        const { data: requests } = await window.supabaseClient.from('guest_requests').select('id').eq('room_number', String(room)).eq('status', 'Pending');
        pendingCount = requests?.length || 0;
        
        const { data: orders } = await window.supabaseClient.from('food_orders').select('id').eq('room_number', String(room)).in('status', ['Pending', 'Preparing']);
        activeOrders = orders?.length || 0;
    } catch(e) {}
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 z-[500] flex items-center justify-center p-4';
    modal.id = 'dailySummaryModal';
    
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    
    modal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl">
            <div class="text-center">
                <div class="text-5xl mb-3">🌅</div>
                <h3 class="text-sm font-bold text-[var(--text-gold,#DCA773)]">${greeting}</h3>
                <p class="text-[10px] text-stone-400">Your daily summary</p>
            </div>
            
            <div class="bg-stone-950/60 border border-stone-800 rounded-2xl p-4 space-y-3">
                <div class="flex justify-between">
                    <span class="text-[10px] text-stone-400">📋 Pending Requests</span>
                    <span class="text-sm font-bold ${pendingCount > 0 ? 'text-amber-400' : 'text-emerald-400'}">${pendingCount}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-[10px] text-stone-400">🛎️ Active Orders</span>
                    <span class="text-sm font-bold ${activeOrders > 0 ? 'text-amber-400' : 'text-emerald-400'}">${activeOrders}</span>
                </div>
            </div>
            
            <button onclick="closeDailySummary()" class="w-full bg-[#DCA773] text-stone-950 font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest">
                Got it
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Marquer comme montré aujourd'hui
    localStorage.setItem('remal_daily_summary_date', new Date().toDateString());
}

function closeDailySummary() {
    document.getElementById('dailySummaryModal')?.remove();
}

window.initDailySummary = initDailySummary;
window.showDailySummary = showDailySummary;
window.closeDailySummary = closeDailySummary;
