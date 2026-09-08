// ==================== LAUNDRY LINK (AJUSTÉ) ====================
function openLaundryApp() {
    // Récupération des données avec les bons noms de variables
    const room = document.getElementById('displayRoomNumber')?.textContent || 
                 localStorage.getItem('roomNumber') || 
                 localStorage.getItem('remal_guest_room');
    const guestName = document.getElementById('welcomeGuestName')?.textContent || 
                     localStorage.getItem('guestName') || 
                     'Guest';
    
    if (!room || room === '---') {
        showToast('⚠️ Please verify your room first', 'error');
        return;
    }
    
    // Vérification VIP
    const isVIP = localStorage.getItem('isVIP') === 'true';
    
    // Création de l'overlay de transition
    const overlay = document.createElement('div');
    overlay.id = 'laundryOverlay';
    overlay.style.cssText = `
        position: fixed; 
        top: 0; 
        left: 0; 
        right: 0; 
        bottom: 0; 
        z-index: 9999; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(10px);
        animation: fadeIn 0.3s ease;
    `;
    
    overlay.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 60px; margin-bottom: 20px; animation: bounce 1s infinite;">🧺</div>
            <h2 style="font-size: 22px; color: #DCA773; font-weight: bold; margin-bottom: 10px; font-family: 'Cinzel', serif;">
                Laundry Service
            </h2>
            <p style="font-size: 11px; color: #a8a29e; margin-bottom: 20px;">
                Opening your laundry space...
            </p>
            <div style="display: flex; justify-content: center; gap: 6px; margin-bottom: 20px;">
                <span style="width: 8px; height: 8px; background: #DCA773; border-radius: 50%; animation: pulse 0.6s infinite;"></span>
                <span style="width: 8px; height: 8px; background: #DCA773; border-radius: 50%; animation: pulse 0.6s 0.2s infinite;"></span>
                <span style="width: 8px; height: 8px; background: #DCA773; border-radius: 50%; animation: pulse 0.6s 0.4s infinite;"></span>
            </div>
            <p style="font-size: 10px; color: #DCA773; font-weight: bold;">
                ${isVIP ? '👑 VIP Priority Service' : ''}
            </p>
            <p style="font-size: 9px; color: #57534e; margin-top: 16px;">
                ${guestName} • Room ${room}
            </p>
            ${isVIP ? '<p style="font-size: 8px; color: #DCA773; margin-top: 8px;">⚡ Express Laundry Service Activé</p>' : ''}
        </div>
    `;
    
    // Ajout des animations si elles n'existent pas déjà
    if (!document.getElementById('laundryAnimations')) {
        const style = document.createElement('style');
        style.id = 'laundryAnimations';
        style.textContent = `
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-15px); }
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.3); }
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(overlay);
    
    // Construction de l'URL avec les paramètres
    const laundryBaseURL = 'https://laundry-requirements.vercel.app/';
    const params = new URLSearchParams({
        room: room,
        name: guestName
    });
    
    // Ajout des paramètres VIP si nécessaire
    if (isVIP) {
        params.append('vip', 'true');
        params.append('priority', 'express');
    }
    
    const laundryURL = `${laundryBaseURL}?${params.toString()}`;
    
    // Redirection après l'animation
    setTimeout(() => {
        window.location.href = laundryURL;
    }, 2500);
}

// Fonction toast si elle n'existe pas déjà
function showToast(message, type = 'info') {
    // Vérifier si un toast existe déjà
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification toast-in';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: ${type === 'error' ? '#ef4444' : '#1c1917'};
        color: white;
        padding: 12px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 12px;
        font-weight: bold;
        border: 1px solid ${type === 'error' ? '#ef4444' : '#DCA773'};
    `;
    
    const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    toast.innerHTML = `${icon} ${message}`;
    
    document.body.appendChild(toast);
    
    // Animation d'entrée
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    });
    
    // Suppression après 3 secondes
    setTimeout(() => {
        toast.style.transform = 'translateX(100px)';
        toast.style.opacity = '0';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Exposer la fonction globalement
window.openLaundryApp = openLaundryApp;
window.showToast = showToast;
