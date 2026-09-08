// ==================== LAUNDRY SESSION MANAGER ====================
// Gère la session partagée entre Guest Hub et Laundry OS

class LaundrySession {
    constructor() {
        this.sessionKey = 'laundry_session';
        this.tokenKey = 'laundry_return_token';
        this.maxSessionAge = 30 * 60 * 1000; // 30 minutes
        this.returnURL = window.location.origin + window.location.pathname;
    }
    
    // Créer une session quand le guest va vers Laundry
    createSession(room, name) {
        const session = {
            room: room,
            name: name,
            token: this.generateToken(),
            createdAt: Date.now(),
            returnURL: this.returnURL
        };
        
        localStorage.setItem(this.sessionKey, JSON.stringify(session));
        sessionStorage.setItem(this.tokenKey, session.token);
        
        return session;
    }
    
    // Valider la session au retour
    validateSession(token, room, name) {
        const sessionData = localStorage.getItem(this.sessionKey);
        const savedToken = sessionStorage.getItem(this.tokenKey);
        
        if (!sessionData || !savedToken) return false;
        
        const session = JSON.parse(sessionData);
        
        // Vérifier le token
        if (token !== savedToken || token !== session.token) return false;
        
        // Vérifier les données
        if (session.room !== room || session.name !== name) return false;
        
        // Vérifier l'expiration (30 minutes)
        if (Date.now() - session.createdAt > this.maxSessionAge) {
            this.clearSession();
            return false;
        }
        
        return true;
    }
    
    // Générer un token unique
    generateToken() {
        return btoa(`${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    }
    
    // Nettoyer la session
    clearSession() {
        localStorage.removeItem(this.sessionKey);
        sessionStorage.removeItem(this.tokenKey);
    }
    
    // Récupérer la session active
    getActiveSession() {
        const sessionData = localStorage.getItem(this.sessionKey);
        return sessionData ? JSON.parse(sessionData) : null;
    }
}

// Instance globale
const laundrySession = new LaundrySession();
