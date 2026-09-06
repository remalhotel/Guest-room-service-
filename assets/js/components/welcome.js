// ==================== MESSAGE DE BIENVENUE PERSONNALISÉ ====================
let welcomeShown = false;

function showWelcomeMessage() {
    if (welcomeShown) return;
    
    const guestName = cachedGuestData?.guest_name || 'Guest';
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    
    const welcomeKey = `welcome_shown_${room}_${new Date().toDateString()}`;
    if (localStorage.getItem(welcomeKey)) return;
    
    welcomeShown = true;
    
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[1200] flex items-center justify-center bg-black/95';
    overlay.id = 'welcomeOverlay';
    
    const hour = new Date().getHours();
    let greetingText = 'Welcome';
    let emoji = '👋';
    
    if (hour < 12) {
        greetingText = 'Good Morning';
        emoji = '🌅';
    } else if (hour < 18) {
        greetingText = 'Good Afternoon';
        emoji = '☀️';
    } else {
        greetingText = 'Good Evening';
        emoji = '🌙';
    }
    
    overlay.innerHTML = `
        <div class="text-center space-y-6 p-8">
            <div class="text-6xl animate-bounce">${emoji}</div>
            
            <div class="space-y-2">
                <p class="text-sm text-stone-400 uppercase tracking-[0.3em] font-bold">${greetingText}</p>
                <h1 class="text-3xl font-serif-luxury font-bold text-[var(--text-gold,#DCA773)] tracking-wide uppercase">
                    ${guestName}
                </h1>
                <p class="text-[10px] text-stone-400">Room ${room}</p>
            </div>
            
            <div class="flex justify-center gap-1">
                ${[1, 2, 3].map(i => `
                    <span class="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style="animation-delay: ${i * 0.2}s"></span>
                `).join('')}
            </div>
            
            <p class="text-[9px] text-stone-500 uppercase tracking-wider">Welcome to Guest Hub</p>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Animer la sortie
    setTimeout(() => {
        overlay.style.transition = 'opacity 0.5s ease';
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
            localStorage.setItem(welcomeKey, 'true');
        }, 500);
    }, 2500);
    
    // Jouer un son de bienvenue
    playWelcomeSound();
}

function playWelcomeSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // Do, Mi, Sol, Do
        
        notes.forEach((frequency, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + index * 0.15);
            
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime + index * 0.15);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.15 + 0.5);
            
            oscillator.start(audioContext.currentTime + index * 0.15);
            oscillator.stop(audioContext.currentTime + index * 0.15 + 0.5);
        });
    } catch (error) {
        console.warn('Sound not available:', error);
    }
}

function initWelcomeSystem() {
    // Écouter quand le client se connecte
    const observer = new MutationObserver(() => {
        const mainScreen = document.getElementById('mainScreen');
        if (mainScreen && !mainScreen.classList.contains('hidden')) {
            showWelcomeMessage();
        }
    });
    
    const mainScreen = document.getElementById('mainScreen');
    if (mainScreen) {
        observer.observe(mainScreen, { attributes: true, attributeFilter: ['class'] });
    }
}
