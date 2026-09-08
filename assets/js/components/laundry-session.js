// ==================== LAUNDRY SESSION ====================
// Shared session between Guest Hub and Laundry OS

class LaundrySession {
    constructor() {
        this.key = 'shared_guest_session';
    }
    
    // Create session before going to Laundry
    create(room, name) {
        const session = {
            room: room,
            name: name,
            token: btoa(`${room}_${name}_${Date.now()}`),
            createdAt: Date.now()
        };
        localStorage.setItem(this.key, JSON.stringify(session));
        return session;
    }
    
    // Validate session on return
    validate(token, room, name) {
        const data = localStorage.getItem(this.key);
        if (!data) return false;
        
        const session = JSON.parse(data);
        return session.token === token && 
               session.room === room && 
               session.name === name;
    }
    
    // Get active session
    get() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : null;
    }
    
    // Clear session
    clear() {
        localStorage.removeItem(this.key);
    }
}

const laundrySession = new LaundrySession();
