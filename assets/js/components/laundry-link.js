// Lien Laundry avec transition fluide
class LaundryLink {
    constructor() {
        this.laundryURL = 'https://laundry-requirements.vercel.app/';
        this.init();
    }
    
    init() {
        this.checkReturn();
    }
    
    // Aller vers Laundry
    goToLaundry() {
        const room = document.getElementById('displayRoomNumber')?.textContent || 
                     localStorage.getItem('roomNumber');
        const name = document.getElementById('welcomeGuestName')?.textContent || 
                     localStorage.getItem('guestName');
        
        if (!room || room === '---') {
            this.toast('Veuillez vérifier votre chambre', 'error');
            return;
        }
        
        // Créer session
        const session = laundrySession.create(room, name);
        
        // Transition
        this.transition('going', name, room);
        
        // Redirection
        setTimeout(() => {
            const params = new URLSearchParams({
                room: room,
                name: name,
                token: session.token,
                return_url: window.location.origin + window.location.pathname
            });
            window.location.href = `${this.laundryURL}?${params.toString()}`;
        }, 2000);
    }
    
    // Vérifier retour
    checkReturn() {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const room = params.get('room');
        const name = params.get('name');
        
        if (token && room && name) {
            if (laundrySession.validate(token, room, name)) {
                // Session valide - retour auto
                this.autoLogin(room, name);
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }
    
    // Auto-login au retour
    autoLogin(room, name) {
        this.transition('returning', name, room);
        
        setTimeout(() => {
            // Remplir et connecter
            document.getElementById('lockRoomInput').value = room;
            document.getElementById('lockNameInput').value = name;
            
            if (typeof verifierIdentiteClient === 'function') {
                verifierIdentiteClient();
            }
            
            // Nettoyer
            const overlay = document.getElementById('laundryOverlay');
            if (overlay) overlay.remove();
            
            this.toast(`Bienvenue ${name} !`, 'success');
            laundrySession.clear();
        }, 2000);
    }
    
    // Transition animée
    transition(direction, name, room) {
        const overlay = document.createElement('div');
        overlay.id = 'laundryOverlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            z-index: 9999; display: flex; align-items: center; justify-content: center;
            background: rgba(0,0,0,0.95); animation: fadeIn 0.3s ease;
        `;
        
        const going = direction === 'going';
        
        overlay.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 60px; animation: bounce 1s infinite;">
                    ${going ? '🧺' : '🏨'}
                </div>
                <h2 style="color: #DCA773; font-size: 22px; margin-top: 20px; font-weight: bold;">
                    ${going ? 'Laundry Service' : 'Guest Hub'}
                </h2>
                <p style="color: #a8a29e; font-size: 11px; margin-top: 10px;">
                    ${going ? 'Ouverture...' : 'Retour...'}
                </p>
                <div style="margin-top: 20px;">
                    <span style="display: inline-block; width: 8px; height: 8px; background: #DCA773; border-radius: 50%; animation: pulse 0.6s infinite; margin: 0 3px;"></span>
                    <span style="display: inline-block; width: 8px; height: 8px; background: #DCA773; border-radius: 50%; animation: pulse 0.6s 0.2s infinite; margin: 0 3px;"></span>
                    <span style="display: inline-block; width: 8px; height: 8px; background: #DCA773; border-radius: 50%; animation: pulse 0.6s 0.4s infinite; margin: 0 3px;"></span>
                </div>
                <p style="color: #57534e; font-size: 10px; margin-top: 20px;">
                    ${name} • Chambre ${room}
                </p>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }
    
    // Toast
    toast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            background: ${type === 'error' ? '#ef4444' : '#1c1917'};
            color: white; padding: 12px 20px; border-radius: 12px;
            font-size: 12px; font-weight: bold;
            border: 1px solid ${type === 'error' ? '#ef4444' : '#DCA773'};
            animation: toastIn 0.4s ease;
        `;
        toast.textContent = `${type === 'error' ? '❌' : '✅'} ${message}`;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    window.laundryLink = new LaundryLink();
    window.openLaundryApp = () => window.laundryLink.goToLaundry();
});
