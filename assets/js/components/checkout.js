// ==================== SYSTÈME DE CHECK-OUT COMPLET ====================
let checkoutInterval = null;
let checkoutNotificationsSent = {
    day24: false,
    day12: false,
    day6: false,
    day2: false
};

function initCheckoutReminder() {
    const departure = cachedGuestData?.departure || localStorage.getItem('remal_departure');
    
    if (!departure) return;
    
    updateCheckoutCountdown();
    startCheckoutCountdown();
    checkCheckoutNotifications();
}

function startCheckoutCountdown() {
    if (checkoutInterval) clearInterval(checkoutInterval);
    
    checkoutInterval = setInterval(() => {
        updateCheckoutCountdown();
        checkCheckoutNotifications();
    }, 5 * 60 * 1000);
}

function checkCheckoutNotifications() {
    const departure = cachedGuestData?.departure || localStorage.getItem('remal_departure');
    if (!departure) return;
    
    const departureDate = new Date(departure);
    const now = new Date();
    const hoursDiff = (departureDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff <= 24 && hoursDiff > 12 && !checkoutNotificationsSent.day24) {
        sendCheckoutNotification(24, hoursDiff);
        checkoutNotificationsSent.day24 = true;
    } else if (hoursDiff <= 12 && hoursDiff > 6 && !checkoutNotificationsSent.day12) {
        sendCheckoutNotification(12, hoursDiff);
        checkoutNotificationsSent.day12 = true;
    } else if (hoursDiff <= 6 && hoursDiff > 2 && !checkoutNotificationsSent.day6) {
        sendCheckoutNotification(6, hoursDiff);
        checkoutNotificationsSent.day6 = true;
    } else if (hoursDiff <= 2 && hoursDiff > 0 && !checkoutNotificationsSent.day2) {
        sendCheckoutNotification(2, hoursDiff);
        checkoutNotificationsSent.day2 = true;
    }
}

function sendCheckoutNotification(hoursMark, actualHours) {
    const messages = {
        24: { icon: '📅', title: 'Check-out Reminder', message: '24 hours until check-out' },
        12: { icon: '⏰', title: 'Check-out Reminder', message: '12 hours until check-out' },
        6: { icon: '⚠️', title: 'Check-out Soon', message: 'Only 6 hours left!' },
        2: { icon: '🚨', title: 'Check-out Very Soon', message: 'Less than 2 hours remaining!' }
    };
    
    const config = messages[hoursMark];
    showCheckoutToast(config.icon, config.title, config.message);
    
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`${config.icon} ${config.title}`, {
            body: config.message,
            icon: '/assets/images/logo.png'
        });
    }
    
    playCheckoutSound();
}

function showCheckoutToast(icon, title, message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification toast-in';
    toast.style.borderColor = '#DCA773';
    
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <span class="text-2xl">${icon}</span>
            <div>
                <p class="text-xs font-bold text-stone-100">${title}</p>
                <p class="text-[10px] text-stone-300">${message}</p>
            </div>
            <button onclick="showCheckoutWizard()" class="text-[9px] text-amber-400 font-bold ml-2">
                Check-out
            </button>
        </div>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => { 
        toast.style.opacity = '0'; 
        toast.style.transition = 'opacity 0.3s ease'; 
        setTimeout(() => toast.remove(), 300); 
    }, 8000);
}

function playCheckoutSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [440, 554, 659];
        
        notes.forEach((frequency, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + index * 0.15);
            
            gainNode.gain.setValueAtTime(0.25, audioContext.currentTime + index * 0.15);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.15 + 0.35);
            
            oscillator.start(audioContext.currentTime + index * 0.15);
            oscillator.stop(audioContext.currentTime + index * 0.15 + 0.35);
        });
    } catch (error) {
        console.warn('Sound not available:', error);
    }
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
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    let message = '';
    let urgency = 'normal';
    
    if (days > 3) {
        message = `${days} days until check-out`;
    } else if (days > 1) {
        message = `${days} days and ${hours} hours until check-out`;
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
        message = `Check-out in ${hours}h ${minutes}m!`;
        urgency = 'urgent';
    }
    
    const bgColors = {
        'normal': 'bg-stone-950/60',
        'soon': 'bg-amber-500/10',
        'urgent': 'bg-red-500/10'
    };
    
    const borderColors = {
        'normal': 'border-amber-500/20',
        'soon': 'border-amber-500/30',
        'urgent': 'border-red-500/30'
    };
    
    const textColors = {
        'normal': 'text-[var(--text-gold,#DCA773)]',
        'soon': 'text-amber-400',
        'urgent': 'text-red-400'
    };
    
    container.innerHTML = `
        <div class="p-3 ${bgColors[urgency]} border ${borderColors[urgency]} rounded-2xl">
            <div class="flex items-center justify-between">
                <p class="text-[10px] font-bold ${textColors[urgency]}">
                    <i class="fas fa-clock mr-1"></i> ${message}
                </p>
                <button onclick="showCheckoutWizard()" class="text-[9px] text-amber-400 hover:text-amber-300 font-bold">
                    Check-out →
                </button>
            </div>
        </div>
    `;
}

// ==================== ASSISTANT DE CHECK-OUT ====================
let checkoutStep = 0;

function showCheckoutWizard() {
    checkoutStep = 0;
    document.querySelectorAll('.toast-notification').forEach(t => t.remove());
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 z-[850] flex items-center justify-center p-4 backdrop-blur-sm';
    modal.id = 'checkoutWizardModal';
    
    renderCheckoutStep(modal);
}

function renderCheckoutStep(modal) {
    const steps = [
        { icon: '📋', title: 'Review Your Stay', description: 'Check your stay details' },
        { icon: '💳', title: 'Review Your Bill', description: 'Verify your charges' },
        { icon: '⭐', title: 'Rate Your Experience', description: 'Share your feedback' },
        { icon: '✅', title: 'Confirm Check-out', description: 'Final confirmation' }
    ];
    
    modal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <div class="flex justify-between items-center border-b border-stone-800 pb-3">
                <h3 class="text-xs font-serif-luxury font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-widest">
                    🏨 Check-out
                </h3>
                <button onclick="closeCheckoutWizard()" class="text-stone-400 hover:text-stone-100 text-xl font-bold">✕</button>
            </div>
            
            <!-- Progress bar -->
            <div class="flex items-center gap-1">
                ${steps.map((step, index) => `
                    <div class="flex-1">
                        <div class="h-1.5 rounded-full ${index <= checkoutStep ? 'bg-amber-400' : 'bg-stone-700'}"></div>
                        <p class="text-[7px] ${index <= checkoutStep ? 'text-amber-400' : 'text-stone-500'} mt-1 text-center">${step.title}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="text-center py-4">
                <div class="text-5xl mb-3">${steps[checkoutStep].icon}</div>
                <p class="text-sm font-bold text-stone-100">${steps[checkoutStep].title}</p>
                <p class="text-[10px] text-stone-400 mt-1">${steps[checkoutStep].description}</p>
            </div>
            
            <div id="checkoutStepContent">
                ${getCheckoutStepContent()}
            </div>
            
            <div class="flex gap-2">
                ${checkoutStep > 0 ? `
                    <button onclick="prevCheckoutStep()" class="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold py-3.5 rounded-2xl text-xs uppercase tracking-widest transition">
                        Back
                    </button>
                ` : ''}
                ${checkoutStep < 3 ? `
                    <button onclick="nextCheckoutStep()" class="flex-1 bg-[#DCA773] hover:bg-[#ebd0b3] text-stone-950 font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest transition">
                        Next
                    </button>
                ` : `
                    <button onclick="completeCheckout()" class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest transition">
                        Confirm Check-out
                    </button>
                `}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function getCheckoutStepContent() {
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    const departure = cachedGuestData?.departure || '---';
    
    switch(checkoutStep) {
        case 0:
            return `
                <div class="bg-stone-950/60 border border-stone-800 rounded-2xl p-3 space-y-2">
                    <div class="flex justify-between">
                        <span class="text-[10px] text-stone-400">Room</span>
                        <span class="text-[10px] font-bold text-stone-100">${room}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-[10px] text-stone-400">Guest</span>
                        <span class="text-[10px] font-bold text-stone-100">${cachedGuestData?.guest_name || 'Guest'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-[10px] text-stone-400">Departure</span>
                        <span class="text-[10px] font-bold text-stone-100">${departure}</span>
                    </div>
                </div>
            `;
        case 1:
            return `
                <div class="bg-stone-950/60 border border-stone-800 rounded-2xl p-3 text-center">
                    <p class="text-[10px] text-stone-400">Your bill will be ready at the front desk</p>
                    <button onclick="requestBillReview()" class="text-[10px] text-amber-400 font-bold mt-2">
                        Request Bill Review
                    </button>
                </div>
            `;
        case 2:
            return `
                <div class="bg-stone-950/60 border border-stone-800 rounded-2xl p-3 text-center">
                    <p class="text-[10px] text-stone-400">How was your stay?</p>
                    <div class="flex justify-center gap-2 mt-2">
                        ${[1, 2, 3, 4, 5].map(star => `
                            <button onclick="quickRateStay(${star})" class="text-2xl hover:scale-125 transition text-stone-600" id="quickStar${star}">
                                ★
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        case 3:
            return `
                <div class="bg-stone-950/60 border border-stone-800 rounded-2xl p-3 text-center">
                    <p class="text-[10px] text-stone-400">Ready to check-out?</p>
                    <p class="text-sm font-bold text-stone-100 mt-2">Thank you for staying with us!</p>
                </div>
            `;
        default:
            return '';
    }
}

function nextCheckoutStep() {
    checkoutStep++;
    const modal = document.getElementById('checkoutWizardModal');
    if (modal) {
        modal.remove();
        showCheckoutWizard();
    }
}

function prevCheckoutStep() {
    checkoutStep--;
    const modal = document.getElementById('checkoutWizardModal');
    if (modal) {
        modal.remove();
        showCheckoutWizard();
    }
}

function closeCheckoutWizard() {
    const modal = document.getElementById('checkoutWizardModal');
    if (modal) modal.remove();
}

let quickRating = 0;

function quickRateStay(star) {
    quickRating = star;
    for (let i = 1; i <= 5; i++) {
        const starEl = document.getElementById(`quickStar${i}`);
        if (starEl) {
            starEl.className = i <= star ? 'text-2xl hover:scale-125 transition text-amber-400' : 'text-2xl hover:scale-125 transition text-stone-600';
        }
    }
}

async function completeCheckout() {
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    
    // Soumettre le feedback si noté
    if (quickRating > 0 && supabaseClient) {
        try {
            await supabaseClient.from('stay_reviews').insert([{
                room_number: String(room),
                guest_name: cachedGuestData?.guest_name || 'Guest',
                overall_rating: quickRating,
                review_text: 'Check-out rating',
                created_at: new Date().toISOString()
            }]);
        } catch (e) {}
    }
    
    closeCheckoutWizard();
    showToast('✅ Check-out completed! Have a safe journey!', 'success');
    
    // Nettoyer la session
    setTimeout(() => {
        changerDeChambre();
    }, 2000);
}
