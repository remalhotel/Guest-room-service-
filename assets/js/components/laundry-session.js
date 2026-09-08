// ==================== LAUNDRY SESSION ====================
class LaundrySession {
    constructor() {
        this.key = 'shared_guest_session';
    }
    
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
    
    validate(token, room, name) {
        const data = localStorage.getItem(this.key);
        if (!data) return false;
        
        const session = JSON.parse(data);
        return session.token === token && 
               session.room === room && 
               session.name === name;
    }
    
    get() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : null;
    }
    
    clear() {
        localStorage.removeItem(this.key);
    }
}

const laundrySession = new LaundrySession();
