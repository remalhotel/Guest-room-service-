// ==================== REALTIME STATUS ====================
// Mise à jour instantanée des statuts de commande
// Le client voit le changement dès que le staff le modifie

(function() {
    'use strict';
    
    console.log('🔄 Realtime Status activé');
    
    class RealtimeStatus {
        constructor() {
            this.channel = null;
            this.init();
        }
        
        init() {
            this.setupSubscription();
            this.listenForLocalChanges();
        }
        
        setupSubscription() {
            const room = this.getRoomNumber();
            if (!room || !window.supabaseClient) return;
            
            // Fermer l'ancien canal
            if (this.channel) {
                window.supabaseClient.removeChannel(this.channel);
            }
            
            console.log(`📡 Écoute des changements pour la chambre ${room}`);
            
            // Écouter les changements sur food_orders
            this.channel = window.supabaseClient
                .channel(`realtime-orders-${room}`)
                .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'food_orders',
                    filter: `room_number=eq.${room}`
                }, (payload) => {
                    console.log('🔄 Statut mis à jour:', payload.new?.status);
                    this.handleStatusUpdate(payload.new);
                })
                .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'guest_laundry_requests',
                    filter: `room_number=eq.${room}`
                }, (payload) => {
                    console.log('🧺 Laundry mis à jour:', payload.new?.status);
                    this.handleLaundryUpdate(payload.new);
                })
                .subscribe();
        }
        
        getRoomNumber() {
            return localStorage.getItem('remal_guest_room') || 
                   localStorage.getItem('roomNumber') ||
                   document.getElementById('displayRoomNumber')?.textContent;
        }
        
        handleStatusUpdate(order) {
            if (!order) return;
            
            // Mettre à jour le tracking si visible
            if (typeof updateOrderTracking === 'function') {
                updateOrderTracking(order.status);
            }
            
            // Afficher une notification élégante
            this.showStatusNotification(order.status);
            
            // Jouer un son si activé
            this.playNotificationSound();
            
            // Mettre à jour l'historique si visible
            const historySection = document.getElementById('orderHistorySection');
            if (historySection && !historySection.classList.contains('hidden')) {
                if (typeof fetchOrderHistory === 'function') {
                    fetchOrderHistory();
                }
            }
        }
        
        handleLaundryUpdate(laundry) {
            if (!laundry) return;
            
            // Notification pour le laundry
            const statusMessages = {
                'Collected': '🧺 Laundry collected by staff',
                'Washing': '🧼 Laundry is being washed',
                'Ready': '✨ Laundry is ready',
                'Delivered': '🚚 Laundry delivered to your room'
            };
            
            const message = statusMessages[laundry.status] || `Laundry: ${laundry.status}`;
            
            this.showToast(message, 'info');
        }
        
        showStatusNotification(status) {
            const statusConfig = {
                'Pending': { icon: '🕐', message: 'Order received and pending', color: '#f59e0b' },
                'Preparing': { icon: '👨‍🍳', message: 'Your order is being prepared', color: '#3b82f6' },
                'Ready': { icon: '✅', message: 'Your order is ready for delivery', color: '#10b981' },
                'Delivered': { icon: '🚚', message: 'Your order has been delivered', color: '#8b5cf6' },
                'Completed': { icon: '✔️', message: 'Order completed. Enjoy!', color: '#10b981' }
            };
            
            const config = statusConfig[status] || { icon: '🔄', message: `Status: ${status}`, color: '#DCA773' };
            
            this.showToast(`${config.icon} ${config.message}`, 'success', config.color);
        }
        
        showToast(message, type = 'info', borderColor = '#DCA773') {
            const existingToast = document.querySelector('.toast-notification');
            if (existingToast) existingToast.remove();
            
            const toast = document.createElement('div');
            toast.className = 'toast-notification toast-in';
            toast.style.borderColor = borderColor;
            toast.innerHTML = `
                <div class="flex items-center gap-3">
                    <span class="text-xl">${message.split(' ')[0]}</span>
                    <div>
                        <p class="text-xs font-bold text-stone-100">${message}</p>
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
        
        playNotificationSound() {
            try {
                // Vibration si mobile
                if ('vibrate' in navigator) {
                    navigator.vibrate(200);
                }
                
                // Son via Web Audio
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.1);
                
                gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
                
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.3);
            } catch (e) {
                // Silencieux
            }
        }
        
        listenForLocalChanges() {
            // Fallback : vérifier périodiquement (si Realtime ne fonctionne pas)
            setInterval(() => {
                if (!window.supabaseClient) return;
                
                const savedOrderId = localStorage.getItem('remal_current_order_id');
                if (!savedOrderId) return;
                
                window.supabaseClient
                    .from('food_orders')
                    .select('status')
                    .eq('id', savedOrderId)
                    .maybeSingle()
                    .then(({ data, error }) => {
                        if (!error && data) {
                            const lastStatus = localStorage.getItem('remal_last_status');
                            if (lastStatus !== data.status) {
                                localStorage.setItem('remal_last_status', data.status);
                                this.handleStatusUpdate({ status: data.status });
                            }
                        }
                    });
            }, 30000); // Vérifier toutes les 30 secondes
        }
    }
    
    // Initialisation
    document.addEventListener('DOMContentLoaded', () => {
        window.realtimeStatus = new RealtimeStatus();
    });
    
})();
