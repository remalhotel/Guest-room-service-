// ==================== SYSTÈME DE CHECK-OUT ====================
let checkoutInterval = null;

function initCheckoutReminder() {
    const departure = cachedGuestData?.departure || localStorage.getItem('remal_departure');
    
    if (!departure) return;
    
    updateCheckoutCountdown();
    startCheckoutCountdown();
}

function startCheckoutCountdown() {
    if (checkoutInterval) clearInterval(checkoutInterval);
    
    // Mettre à jour toutes les heures
    checkoutInterval = setInterval(() => {
        updateCheckoutCountdown();
    }, 60 * 60 * 1000);
}

function updateCheckoutCountdown() {
    const container = document.getElementById('checkoutCountdown');
    if (!container) return;
    
    const departure = cachedGuestData?.departure || localStorage.getItem('remal_departure');
    if (!departure) return;
    
    const departureDate = new Date(departure);
    const now = new Date();
    const timeDiff = departureDate.getTime() - now.getTime();
    
    if (timeDiff <= 0) {
        container.innerHTML = `
            <div class="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl">
                <p class="text-[10px] font-bold text-red-400">
                    <i class="fas fa-exclamation-triangle mr-1"></i> Check-out time passed
                </p>
            </div>
        `;
        return;
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    let message = '';
    let urgency = 'normal';
    
    if (days > 3) {
        message = `${days} days until check-out`;
        urgency = 'normal';
    } else if (days > 1) {
        message = `${days} days and ${hours} hours until check-out`;
        urgency = 'normal';
    } else if (days === 1) {
        message = `1 day and ${hours} hours until check-out`;
        urgency = 'soon';
    } else if (hours > 6) {
        message = `${hours} hours until check-out`;
        urgency = 'soon';
    } else if (hours > 2) {
        message = `Only ${hours} hours until check-out`;
        urgency = 'urgent';
    } else {
        message = `Check-out in less than ${hours} hours!`;
        urgency = 'urgent';
    }
    
    const bgColors = {
        'normal': 'bg-stone-950/60 border-amber-500/20',
        'soon': 'bg-amber-500/10 border-amber-500/30',
        'urgent': 'bg-red-500/10 border-red-500/30'
    };
    
    const textColors = {
        'normal': 'text-[var(--text-gold,#DCA773)]',
        'soon': 'text-amber-400',
        'urgent': 'text-red-400'
    };
    
    container.innerHTML = `
        <div class="p-3 ${bgColors[urgency]} border ${urgency === 'normal' ? 'border-amber-500/20' : urgency === 'soon' ? 'border-amber-500/30' : 'border-red-500/30'} rounded-2xl">
            <div class="flex items-center justify-between">
                <p class="text-[10px] font-bold ${textColors[urgency]}">
                    <i class="fas fa-clock mr-1"></i> ${message}
                </p>
                <button onclick="showCheckoutOptions()" class="text-[9px] text-stone-400 hover:text-[var(--text-gold,#DCA773)]">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
            </div>
        </div>
    `;
}

function showCheckoutOptions() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 z-[700] flex items-center justify-center p-4 backdrop-blur-sm';
    modal.id = 'checkoutOptionsModal';
    
    const departure = cachedGuestData?.departure || localStorage.getItem('remal_departure');
    
    modal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl">
            <div class="flex justify-between items-center border-b border-stone-800 pb-3">
                <h3 class="text-xs font-serif-luxury font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-widest">
                    🏨 Check-out Options
                </h3>
                <button onclick="closeCheckoutOptions()" class="text-stone-400 hover:text-stone-100 text-xl font-bold">✕</button>
            </div>
            
            <div class="space-y-3">
                <div class="bg-stone-950/60 border border-stone-800 rounded-xl p-3">
                    <p class="text-[10px] text-stone-400">Current departure</p>
                    <p class="text-sm font-bold text-stone-100">${departure ? new Date(departure).toLocaleString() : 'Not set'}</p>
                </div>
                
                <button onclick="requestLateCheckout()" class="w-full bg-[#DCA773] hover:bg-[#ebd0b3] text-stone-950 font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest transition">
                    <i class="fas fa-hourglass-half mr-1"></i> Request Late Check-out
                </button>
                
                <button onclick="requestExpressCheckout()" class="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold py-3.5 rounded-2xl text-xs uppercase tracking-widest transition">
                    <i class="fas fa-bolt mr-1"></i> Express Check-out
                </button>
                
                <button onclick="requestBillReview()" class="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold py-3.5 rounded-2xl text-xs uppercase tracking-widest transition">
                    <i class="fas fa-receipt mr-1"></i> Review My Bill
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeCheckoutOptions() {
    const modal = document.getElementById('checkoutOptionsModal');
    if (modal) modal.remove();
}

function requestLateCheckout() {
    closeCheckoutOptions();
    showService('late_checkout');
}

function requestExpressCheckout() {
    closeCheckoutOptions();
    
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    
    const requestData = {
        room_number: String(room),
        guest_name: cachedGuestData?.guest_name || 'Guest',
        service_type: 'Express Check-out',
        details: 'Guest requests express check-out service',
        status: 'Pending',
        created_at: new Date().toISOString()
    };
    
    try {
        if (supabaseClient) {
            supabaseClient.from('guest_requests').insert([requestData]).then(({ error }) => {
                if (error) {
                    showToast('Error: ' + error.message, 'error');
                    return;
                }
            });
        }
        showToast('✅ Express check-out requested!', 'success');
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
}

function requestBillReview() {
    closeCheckoutOptions();
    
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    
    const requestData = {
        room_number: String(room),
        guest_name: cachedGuestData?.guest_name || 'Guest',
        service_type: 'Bill Review',
        details: 'Guest requests bill review before check-out',
        status: 'Pending',
        created_at: new Date().toISOString()
    };
    
    try {
        if (supabaseClient) {
            supabaseClient.from('guest_requests').insert([requestData]).then(({ error }) => {
                if (error) {
                    showToast('Error: ' + error.message, 'error');
                    return;
                }
            });
        }
        showToast('✅ Bill review requested!', 'success');
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
}
