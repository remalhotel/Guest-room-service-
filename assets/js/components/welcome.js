// ==================== WELCOME ANIMATION ====================
function showWelcomeMessage() {
    const guestName = cachedGuestData?.guest_name || 'Guest';
    const room = localStorage.getItem('remal_guest_room');
    
    // Ne montrer qu'une fois par jour
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem('remal_welcome_date');
    if (lastShown === today) return;
    
    const hour = new Date().getHours();
    let greeting = 'Welcome';
    let emoji = '👋';
    
    if (hour < 12) { greeting = 'Good Morning'; emoji = '🌅'; }
    else if (hour < 18) { greeting = 'Good Afternoon'; emoji = '☀️'; }
    else { greeting = 'Good Evening'; emoji = '🌙'; }
    
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[600] flex items-center justify-center bg-black/95';
    overlay.id = 'welcomeOverlay';
    overlay.style.animation = 'fadeInUp 0.5s ease forwards';
    
    overlay.innerHTML = `
        <div class="text-center space-y-6 p-8">
            <div class="text-6xl" style="animation: fadeInUp 0.8s ease forwards;">${emoji}</div>
            
            <div class="space-y-2" style="animation: fadeInUp 1s ease forwards;">
                <p class="text-sm text-stone-400 uppercase tracking-[0.3em] font-bold">${greeting}</p>
                <h1 class="text-3xl font-serif-luxury font-bold text-[var(--text-gold,#DCA773)] tracking-wide uppercase">
                    ${guestName}
                </h1>
                <p class="text-[10px] text-stone-400">Room ${room}</p>
            </div>
            
            <div class="flex justify-center gap-1" style="animation: fadeInUp 1.2s ease forwards;">
                <span class="w-2 h-2 bg-amber-400 rounded-full" style="animation: pulse 0.5s ease infinite;"></span>
                <span class="w-2 h-2 bg-amber-400 rounded-full" style="animation: pulse 0.5s ease 0.2s infinite;"></span>
                <span class="w-2 h-2 bg-amber-400 rounded-full" style="animation: pulse 0.5s ease 0.4s infinite;"></span>
            </div>
            
            <p class="text-[9px] text-stone-500 uppercase tracking-wider">Welcome to Guest Hub</p>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Fermer après 3 secondes
    setTimeout(() => {
        overlay.style.transition = 'opacity 0.5s ease';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 500);
    }, 3000);
    
    // Marquer comme montré
    localStorage.setItem('remal_welcome_date', today);
    
    // Jouer un son
    playWelcomeSound();
}

function playWelcomeSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99];
        
        notes.forEach((frequency, index) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency, audioContext.currentTime + index * 0.15);
            gain.gain.setValueAtTime(0.15, audioContext.currentTime + index * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.15 + 0.5);
            osc.start(audioContext.currentTime + index * 0.15);
            osc.stop(audioContext.currentTime + index * 0.15 + 0.5);
        });
    } catch(e) {}
}

// Ajouter l'animation pulse au CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(1.5); }
    }
`;
document.head.appendChild(styleSheet);

window.showWelcomeMessage = showWelcomeMessage;
