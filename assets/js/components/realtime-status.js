// ==================== REALTIME STATUS ====================
// Mise à jour instantanée des statuts pour le client

(function() {
    'use strict';
    
    console.log('🔄 Realtime Status activé');
    
    class RealtimeStatus {
        constructor() {
            this.channel = null;
            this.roomNumber = null;
            this.init();
        }
        
        init() {
            this.roomNumber = this.getRoomNumber();
            if (this.roomNumber) {
                this.setupSubscriptions();
            }
            
            // Réessayer après connexion
            setTimeout(() => {
                if (!this.roomNumber) {
                    this.roomNumber = this.getRoomNumber();
                    if (this.roomNumber) this.setupSubscriptions();
                }
            }, 3000);
        }
        
        getRoomNumber() {
            return localStorage.getItem('remal_guest_room') || 
                   localStorage.getItem('roomNumber') ||
                   (cachedGuestData && cachedGuestData.room) ||
                   document.getElementById('displayRoomNumber')?.textContent?.trim();
        }
        
        setupSubscriptions() {
            if (!window.supabaseClient || !this.roomNumber) return;
            
            const room = String(this.roomNumber).trim();
            
            // Fermer l'ancien canal
            if (this.channel) {
                window.supabaseClient.removeChannel(this.channel);
            }
            
            console.log(`📡 Écoute temps réel pour chambre ${room}`);
            
            this.channel = window.supabaseClient
                .channel(`guest-realtime-${room}`)
                
                // Écouter les changements de statut food_orders
                .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'food_orders',
                    filter: `room_number=eq.${room}`
                }, (payload) => {
                    console.log('🍽️ Food order update:', payload.new?.status);
                    this.handleFoodStatusUpdate(payload.new);
                })
                
                // Écouter les changements de statut guest_requests
                .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'guest_requests',
                    filter: `room_number=eq.${room}`
                }, (payload) => {
                    console.log('📋 Request update:', payload.new?.status);
                    this.handleRequestStatusUpdate(payload.new);
                })
                
                // Écouter les changements laundry
                .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'guest_laundry_requests',
                    filter: `room_number=eq.${room}`
                }, (payload) => {
                    console.log('🧺 Laundry update:', payload.new?.status);
                    this.handleLaundryUpdate(payload.new);
                })
                
                .subscribe((status) => {
                    console.log('📡 Realtime channel status:', status);
                });
        }
        
        handleFoodStatusUpdate(order) {
            if (!order) return;
            
            const statusMessages = {
                'Pending': { icon: '🕐', message: 'Your order has been received', color: '#f59e0b' },
                'Preparing': { icon: '👨‍🍳', message: 'Your food is being prepared', color: '#3b82f6' },
                'Ready': { icon: '✅', message: 'Your order is ready!', color: '#10b981' },
                'Delivered': { icon: '🚚', message: 'Your order has been delivered. Enjoy!', color: '#8b5cf6' },
                'Completed': { icon: '✔️', message: 'Order completed. Bon appétit!', color: '#10b981' }
            };
            
            const config = statusMessages[order.status] || { icon: '🔄', message: `Status: ${order.status}`, color: '#DCA773' };
            
            // Mettre à jour le tracking
            if (typeof updateOrderTracking === 'function') {
                updateOrderTracking(order.status);
            }
            
            // Afficher notification
            this.showNotification(config.icon, config.message, config.color);
            
            // Vibration
            if ('vibrate' in navigator) navigator.vibrate(200);
        }
        
        handleRequestStatusUpdate(request) {
            if (!request) return;
            
            const statusMessages = {
                'Pending': { icon: '🕐', message: 'Your request has been received', color: '#f59e0b' },
                'In Progress': { icon: '👨‍💼', message: 'Your request is being handled', color: '#3b82f6' },
                'Completed': { icon: '✅', message: 'Your request has been completed', color: '#10b981' }
            };
            
            const config = statusMessages[request.status] || { icon: '🔄', message: `Request status: ${request.status}`, color: '#DCA773' };
            
            this.showNotification(config.icon, config.message, config.color);
            
            if ('vibrate' in navigator) navigator.vibrate(200);
        }
        
        handleLaundryUpdate(laundry) {
            if (!laundry) return;
            
            const statusMessages = {
                'Collected': { icon: '🧺', message: 'Laundry collected by staff', color: '#DCA773' },
                'Washing': { icon: '🧼', message: 'Laundry is being washed', color: '#3b82f6' },
                'Ready': { icon: '✨', message: 'Laundry is ready and pressed', color: '#10b981' },
                'Delivered': { icon: '🚚', message: 'Laundry delivered to your room', color: '#8b5cf6' }
            };
            
            const config = statusMessages[laundry.status] || { icon: '🧺', message: `Laundry: ${laundry.status}`, color: '#DCA773' };
            
            this.showNotification(config.icon, config.message, config.color);
        }
        
        showNotification(icon, message, borderColor) {
            // Supprimer les anciennes notifications
            const existing = document.querySelector('.toast-notification');
            if (existing) existing.remove();
            
            const toast = document.createElement('div');
            toast.className = 'toast-notification toast-in';
            toast.style.borderColor = borderColor;
            toast.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 24px;">${icon}</span>
                    <div>
                        <p style="font-size: 11px; font-weight: bold; color: #fff; margin: 0;">${message}</p>
                    </div>
                </div>
            `;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transition = 'opacity 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 4000);
        }
    }
    
    // Initialisation
    document.addEventListener('DOMContentLoaded', () => {
        window.realtimeStatus = new RealtimeStatus();
    });
    
})();
