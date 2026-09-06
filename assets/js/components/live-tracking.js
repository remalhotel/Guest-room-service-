// ==================== SUIVI DE COMMANDE EN TEMPS RÉEL ====================
let liveTrackingChannel = null;
let liveTrackingOrderId = null;

function startLiveTracking(orderId) {
    if (!supabaseClient || !orderId) return;
    
    liveTrackingOrderId = orderId;
    
    if (liveTrackingChannel) {
        supabaseClient.removeChannel(liveTrackingChannel);
    }
    
    liveTrackingChannel = supabaseClient
        .channel(`live-order-${orderId}`)
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'food_orders',
            filter: `id=eq.${orderId}`
        }, (payload) => {
            updateLiveTracking(payload.new);
        })
        .subscribe();
    
    // Afficher le suivi en direct
    showLiveTrackingModal(orderId);
}

function showLiveTrackingModal(orderId) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 z-[800] flex items-center justify-center p-4 backdrop-blur-sm';
    modal.id = 'liveTrackingModal';
    
    modal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-sm rounded-3xl p-6 space-y-5 shadow-2xl">
            <div class="flex justify-between items-center border-b border-stone-800 pb-3">
                <h3 class="text-xs font-serif-luxury font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-widest">
                    🛎️ Live Order Tracking
                </h3>
                <button onclick="closeLiveTracking()" class="text-stone-400 hover:text-stone-100 text-xl font-bold">✕</button>
            </div>
            
            <div class="text-center space-y-4">
                <!-- Animation de progression -->
                <div class="relative w-24 h-24 mx-auto">
                    <svg class="w-24 h-24" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#262626" stroke-width="6"/>
                        <circle id="liveProgressCircle" cx="50" cy="50" r="45" fill="none" stroke="#DCA773" stroke-width="6" stroke-dasharray="283" stroke-dashoffset="283" stroke-linecap="round" transform="rotate(-90 50 50)" style="transition: stroke-dashoffset 0.5s ease"/>
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <span id="liveProgressPercent" class="text-lg font-bold text-[var(--text-gold,#DCA773)]">0%</span>
                    </div>
                </div>
                
                <!-- Statut actuel -->
                <div>
                    <p id="liveStatusIcon" class="text-4xl mb-2">📝</p>
                    <p id="liveStatusText" class="text-sm font-bold text-stone-100">Order Received</p>
                    <p id="liveStatusDetail" class="text-[10px] text-stone-400 mt-1">Your order has been registered</p>
                </div>
                
                <!-- Étapes -->
                <div class="space-y-2 text-left">
                    ${renderLiveSteps(0)}
                </div>
                
                <!-- Temps estimé -->
                <div class="bg-stone-950/60 border border-amber-500/20 rounded-xl p-3">
                    <p class="text-[10px] text-stone-400">Estimated Delivery Time</p>
                    <p id="liveEta" class="text-lg font-bold text-[var(--text-gold,#DCA773)] mt-1">~30 minutes</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function renderLiveSteps(currentStep) {
    const steps = [
        { id: 0, icon: '📝', label: 'Received' },
        { id: 1, icon: '👨‍🍳', label: 'Preparing' },
        { id: 2, icon: '🔔', label: 'Ready' },
        { id: 3, icon: '✅', label: 'Delivered' }
    ];
    
    return steps.map(step => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        
        return `
            <div class="flex items-center gap-3 p-2 rounded-xl ${isActive ? 'bg-amber-500/10 border border-amber-500/30' : isCompleted ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-stone-950/60 border border-stone-800'}">
                <span class="text-xl">${step.icon}</span>
                <span class="text-[10px] font-bold ${isActive ? 'text-amber-400' : isCompleted ? 'text-emerald-400' : 'text-stone-400'}">${step.label}</span>
                ${isCompleted ? '<i class="fas fa-check ml-auto text-emerald-400 text-xs"></i>' : isActive ? '<i class="fas fa-spinner fa-spin ml-auto text-amber-400 text-xs"></i>' : ''}
            </div>
        `;
    }).join('');
}

function updateLiveTracking(orderData) {
    const status = orderData.status;
    
    const statusMap = {
        'Pending': { step: 0, percent: 10, icon: '📝', text: 'Order Received', detail: 'Your order has been registered', eta: '~30 minutes' },
        'Preparing': { step: 1, percent: 35, icon: '👨‍🍳', text: 'Being Prepared', detail: 'The chef is cooking your food', eta: '~20 minutes' },
        'Ready': { step: 2, percent: 70, icon: '🔔', text: 'Ready for Delivery', detail: 'Your order is ready!', eta: '~5 minutes' },
        'Delivered': { step: 3, percent: 100, icon: '✅', text: 'Delivered', detail: 'Enjoy your meal!', eta: 'Delivered' },
        'Completed': { step: 3, percent: 100, icon: '🌟', text: 'Completed', detail: 'Order completed. Thank you!', eta: 'Completed' }
    };
    
    const config = statusMap[status] || statusMap['Pending'];
    
    // Mettre à jour le cercle
    const circle = document.getElementById('liveProgressCircle');
    if (circle) {
        const circumference = 283;
        const offset = circumference - (config.percent / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }
    
    // Mettre à jour le pourcentage
    const percentEl = document.getElementById('liveProgressPercent');
    if (percentEl) percentEl.innerText = `${config.percent}%`;
    
    // Mettre à jour le statut
    const iconEl = document.getElementById('liveStatusIcon');
    if (iconEl) iconEl.innerText = config.icon;
    
    const textEl = document.getElementById('liveStatusText');
    if (textEl) textEl.innerText = config.text;
    
    const detailEl = document.getElementById('liveStatusDetail');
    if (detailEl) detailEl.innerText = config.detail;
    
    // Mettre à jour l'ETA
    const etaEl = document.getElementById('liveEta');
    if (etaEl) etaEl.innerText = config.eta;
    
    // Mettre à jour les étapes
    const modal = document.getElementById('liveTrackingModal');
    if (modal) {
        const stepsContainer = modal.querySelector('.space-y-2.text-left');
        if (stepsContainer) {
            stepsContainer.innerHTML = renderLiveSteps(config.step);
        }
    }
    
    // Jouer un son si le statut a changé
    playTrackingSound();
}

function playTrackingSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
        console.warn('Sound not available:', error);
    }
}

function closeLiveTracking() {
    const modal = document.getElementById('liveTrackingModal');
    if (modal) modal.remove();
    
    if (liveTrackingChannel && supabaseClient) {
        supabaseClient.removeChannel(liveTrackingChannel);
        liveTrackingChannel = null;
    }
    liveTrackingOrderId = null;
}
