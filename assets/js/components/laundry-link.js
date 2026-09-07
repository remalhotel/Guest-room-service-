// ==================== LAUNDRY LINK ÉLÉGANT ====================
function openLaundryApp() {
    const room = localStorage.getItem('remal_guest_room');
    const guestName = cachedGuestData?.guest_name || 'Guest';
    
    if (!room) {
        showToast('Please verify your room first', 'error');
        return;
    }
    
    // Créer l'écran de transition
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; z-index:9999; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.95); transition: opacity 0.5s ease;';
    overlay.id = 'laundryTransition';
    
    overlay.innerHTML = `
        <div style="text-align:center; padding:20px;">
            <div style="font-size:50px; margin-bottom:20px; animation: bounce 1s infinite;">🧺</div>
            
            <h2 style="font-size:22px; color:#DCA773; font-weight:bold; margin-bottom:10px;">
                Laundry Service
            </h2>
            
            <p style="font-size:11px; color:#a8a29e; margin-bottom:20px;">
                Opening your laundry space...
            </p>
            
            <div style="display:flex; justify-content:center; gap:6px;">
                <span style="width:8px; height:8px; background:#DCA773; border-radius:50%; animation: pulse 0.6s ease infinite;"></span>
                <span style="width:8px; height:8px; background:#DCA773; border-radius:50%; animation: pulse 0.6s ease 0.2s infinite;"></span>
                <span style="width:8px; height:8px; background:#DCA773; border-radius:50%; animation: pulse 0.6s ease 0.4s infinite;"></span>
            </div>
            
            <p style="font-size:9px; color:#57534e; margin-top:16px;">
                ${guestName} • Room ${room}
            </p>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Animation de fondu
    setTimeout(() => {
        overlay.style.opacity = '0';
    }, 2000);
    
    // Rediriger après 2.5 secondes
    setTimeout(() => {
        window.location.href = `https://laundry-requirements.vercel.app/?room=${encodeURIComponent(room)}&name=${encodeURIComponent(guestName)}`;
    }, 2500);
}

// Ajouter les animations nécessaires
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
    }
    @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(1.3); }
    }
`;
document.head.appendChild(styleSheet);

window.openLaundryApp = openLaundryApp;
