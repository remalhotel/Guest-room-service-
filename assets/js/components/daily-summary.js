// ==================== RÉSUMÉ QUOTIDIEN ====================
let dailySummaryShown = false;
let dailySummaryInterval = null;

function initDailySummary() {
    // Vérifier si le résumé a déjà été montré aujourd'hui
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem('remal_daily_summary_date');
    
    if (lastShown === today) {
        dailySummaryShown = true;
    }
    
    // Vérifier toutes les heures
    dailySummaryInterval = setInterval(() => {
        checkDailySummary();
    }, 60 * 60 * 1000);
}

async function checkDailySummary() {
    if (dailySummaryShown) return;
    
    const hour = new Date().getHours();
    // Afficher le résumé à 9h du matin
    if (hour >= 9 && hour < 10) {
        await generateDailySummary();
    }
}

async function generateDailySummary() {
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    if (!room || !supabaseClient) return;
    
    let summary = {
        pendingRequests: 0,
        activeOrders: 0,
        unreadMessages: 0,
        checkOutDate: null,
        offersCount: 0,
        weather: null
    };
    
    // Récupérer les demandes en attente
    try {
        const { data: requests, error: reqError } = await supabaseClient
            .from('guest_requests')
            .select('id, status')
            .eq('room_number', String(room))
            .eq('status', 'Pending');
            
        if (!reqError) {
            summary.pendingRequests = requests?.length || 0;
        }
    } catch (e) {}
    
    // Récupérer les commandes actives
    try {
        const { data: orders, error: orderError } = await supabaseClient
            .from('food_orders')
            .select('id, status')
            .eq('room_number', String(room))
            .in('status', ['Pending', 'Preparing']);
            
        if (!orderError) {
            summary.activeOrders = orders?.length || 0;
        }
    } catch (e) {}
    
    // Récupérer les messages non lus
    try {
        const { data: messages, error: msgError } = await supabaseClient
            .from('chat_messages')
            .select('id')
            .eq('room_number', String(room))
            .eq('sender', 'staff')
            .eq('is_read', false);
            
        if (!msgError) {
            summary.unreadMessages = messages?.length || 0;
        }
    } catch (e) {}
    
    // Date de départ
    summary.checkOutDate = cachedGuestData?.departure || null;
    
    // Afficher le résumé
    showDailySummaryModal(summary);
    
    // Marquer comme montré aujourd'hui
    const today = new Date().toDateString();
    localStorage.setItem('remal_daily_summary_date', today);
    dailySummaryShown = true;
}

function showDailySummaryModal(summary) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm';
    modal.id = 'dailySummaryModal';
    
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    
    const checkOutInfo = summary.checkOutDate ? 
        `<div class="flex justify-between items-center">
            <span class="text-[10px] text-stone-400">🏨 Check-out</span>
            <span class="text-[10px] font-bold text-stone-100">${new Date(summary.checkOutDate).toLocaleDateString()}</span>
        </div>` : '';
    
    modal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl">
            <div class="text-center space-y-3">
                <div class="text-5xl">🌅</div>
                <h3 class="text-xs font-serif-luxury font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-widest">
                    ${greeting}
                </h3>
                <p class="text-[10px] text-stone-400">Here's your daily summary</p>
            </div>
            
            <div class="bg-stone-950/60 border border-stone-800 rounded-2xl p-4 space-y-3">
                <div class="flex justify-between items-center">
                    <span class="text-[10px] text-stone-400">📋 Pending Requests</span>
                    <span class="text-sm font-bold ${summary.pendingRequests > 0 ? 'text-amber-400' : 'text-emerald-400'}">${summary.pendingRequests}</span>
                </div>
                
                <div class="flex justify-between items-center">
                    <span class="text-[10px] text-stone-400">🛎️ Active Orders</span>
                    <span class="text-sm font-bold ${summary.activeOrders > 0 ? 'text-amber-400' : 'text-emerald-400'}">${summary.activeOrders}</span>
                </div>
                
                <div class="flex justify-between items-center">
                    <span class="text-[10px] text-stone-400">💬 Unread Messages</span>
                    <span class="text-sm font-bold ${summary.unreadMessages > 0 ? 'text-blue-400' : 'text-emerald-400'}">${summary.unreadMessages}</span>
                </div>
                
                ${checkOutInfo}
            </div>
            
            <div class="text-center">
                <p class="text-[9px] text-stone-500">Have a wonderful day at Remal Hotel & Villas</p>
            </div>
            
            <button onclick="closeDailySummary()" class="w-full bg-[#DCA773] hover:bg-[#ebd0b3] text-stone-950 font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest transition">
                Got it
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Jouer un son doux
    playDailySummarySound();
}

function playDailySummarySound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99];
        
        notes.forEach((frequency, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + index * 0.12);
            
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime + index * 0.12);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.12 + 0.4);
            
            oscillator.start(audioContext.currentTime + index * 0.12);
            oscillator.stop(audioContext.currentTime + index * 0.12 + 0.4);
        });
    } catch (error) {
        console.warn('Sound not available:', error);
    }
}

function closeDailySummary() {
    const modal = document.getElementById('dailySummaryModal');
    if (modal) modal.remove();
}

function stopDailySummary() {
    if (dailySummaryInterval) {
        clearInterval(dailySummaryInterval);
        dailySummaryInterval = null;
    }
}
