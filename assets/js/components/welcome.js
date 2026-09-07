// ==================== WELCOME ANIMATION ====================
function showWelcomeMessage() {
    const guestName = cachedGuestData?.guest_name || 'Guest';
    const room = localStorage.getItem('remal_guest_room');
    
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
    overlay.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; z-index:9999; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.95);';
    overlay.id = 'welcomeOverlay';
    
    overlay.innerHTML = `
        <div style="text-align:center; padding:20px;">
            <div style="font-size:60px; margin-bottom:20px;">${emoji}</div>
            
            <div style="margin-bottom:20px;">
                <p style="font-size:14px; color:#a8a29e; text-transform:uppercase; letter-spacing:3px; font-weight:bold;">${greeting}</p>
                <h1 style="font-size:28px; color:#DCA773; font-weight:bold; text-transform:uppercase; margin-top:8px;">
                    ${guestName}
                </h1>
                <p style="font-size:10px; color:#a8a29e; margin-top:4px;">Room ${room}</p>
            </div>
            
            <div style="display:flex; justify-content:center; gap:6px; margin-bottom:16px;">
                <span style="width:8px; height:8px; background:#DCA773; border-radius:50%;"></span>
                <span style="width:8px; height:8px; background:#DCA773; border-radius:50%;"></span>
                <span style="width:8px; height:8px; background:#DCA773; border-radius:50%;"></span>
            </div>
            
            <p style="font-size:9px; color:#57534e; text-transform:uppercase; letter-spacing:2px;">Welcome to Guest Hub</p>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.style.transition = 'opacity 0.5s ease';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 500);
    }, 2500);
    
    localStorage.setItem('remal_welcome_date', today);
    
    // Jouer un son simple
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(660, audioContext.currentTime);
        gain.gain.setValueAtTime(0.2, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        osc.start();
        osc.stop(audioContext.currentTime + 0.5);
    } catch(e) {}
}

window.showWelcomeMessage = showWelcomeMessage;
