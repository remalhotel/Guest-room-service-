// ==================== PUSH NOTIFICATIONS ====================
// Notifications push pour Guest Hub
// N'affecte AUCUNE fonctionnalité existante

(function() {
    'use strict';
    
    console.log('🔔 Push Notifications activé');
    
    class PushNotifications {
        constructor() {
            this.permission = 'default';
            this.init();
        }
        
        async init() {
            await this.checkPermission();
            this.setupNotificationRequest();
        }
        
        async checkPermission() {
            if ('Notification' in window) {
                this.permission = Notification.permission;
                console.log('Permission notification:', this.permission);
            }
        }
        
        async requestPermission() {
            if ('Notification' in window) {
                const result = await Notification.requestPermission();
                this.permission = result;
                console.log('Nouvelle permission:', result);
                
                if (result === 'granted') {
                    this.showWelcomeNotification();
                }
            }
        }
        
        setupNotificationRequest() {
            // Demander la permission après la connexion du client
            const checkLogin = setInterval(() => {
                const room = localStorage.getItem('remal_guest_room');
                if (room && this.permission === 'default') {
                    clearInterval(checkLogin);
                    
                    // Demander après 2 secondes
                    setTimeout(() => {
                        this.showPermissionPrompt();
                    }, 2000);
                }
            }, 1000);
        }
        
        showPermissionPrompt() {
            const prompt = document.createElement('div');
            prompt.style.cssText = `
                position: fixed;
                bottom: 160px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(28, 25, 23, 0.95);
                border: 1px solid #DCA773;
                border-radius: 16px;
                padding: 15px 20px;
                color: #DCA773;
                font-weight: bold;
                font-size: 11px;
                z-index: 9999;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                text-align: center;
                max-width: 300px;
                animation: fadeInUp 0.5s ease;
            `;
            prompt.innerHTML = `
                <p style="margin: 0 0 10px;">🔔 Activer les notifications ?</p>
                <button onclick="this.closest('div').remove(); pushNotifications.requestPermission();" style="
                    background: #DCA773;
                    color: #000;
                    border: none;
                    padding: 8px 20px;
                    border-radius: 20px;
                    font-weight: bold;
                    font-size: 10px;
                    cursor: pointer;
                    margin-right: 8px;
                ">Oui</button>
                <button onclick="this.closest('div').remove();" style="
                    background: rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                    border: 1px solid #ef4444;
                    padding: 8px 20px;
                    border-radius: 20px;
                    font-size: 10px;
                    cursor: pointer;
                ">Plus tard</button>
            `;
            document.body.appendChild(prompt);
        }
        
        showWelcomeNotification() {
            this.send('🎉 Bienvenue au Remal Hotel !', 'Vous recevrez des notifications pour vos commandes et offres.');
        }
        
        send(title, body) {
            if ('Notification' in window && this.permission === 'granted') {
                new Notification(title, {
                    body: body,
                    icon: 'assets/images/icon-192.png'
                });
            }
        }
        
        // Notifications pour les statuts de commande
        notifyOrderStatus(status) {
            const messages = {
                'Pending': { title: '🕐 Commande reçue', body: 'Votre commande a bien été enregistrée.' },
                'Preparing': { title: '👨‍🍳 En préparation', body: 'Votre commande est en cours de préparation.' },
                'Ready': { title: '✅ Commande prête', body: 'Votre commande est prête pour la livraison.' },
                'Delivered': { title: '🚚 Livrée !', body: 'Votre commande a été livrée. Bon appétit !' }
            };
            
            const config = messages[status];
            if (config) {
                this.send(config.title, config.body);
            }
        }
        
        // Notification pour nouvelle offre
        notifyNewOffer(offer) {
            this.send('🎁 Nouvelle offre !', `${offer.title} - ${offer.price}`);
        }
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        window.pushNotifications = new PushNotifications();
    });
    
})();
