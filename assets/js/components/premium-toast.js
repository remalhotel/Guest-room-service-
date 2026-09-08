// ==================== PREMIUM TOAST NOTIFICATIONS ====================
// Messages élégants et animés

class PremiumToast {
    constructor() {
        this.toasts = [];
        this.maxToasts = 3;
        this.init();
    }
    
    init() {
        this.injectStyles();
    }
    
    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes toastSlideIn {
                from {
                    opacity: 0;
                    transform: translateX(100px) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: translateX(0) scale(1);
                }
            }
            
            @keyframes toastSlideOut {
                from {
                    opacity: 1;
                    transform: translateX(0) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translateX(100px) scale(0.8);
                }
            }
            
            @keyframes toastProgress {
                from { width: 100%; }
                to { width: 0%; }
            }
            
            .premium-toast-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 99999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            }
            
            .premium-toast {
                pointer-events: auto;
                min-width: 280px;
                max-width: 350px;
                background: rgba(28, 25, 23, 0.95);
                border: 1px solid #DCA773;
                border-radius: 16px;
                padding: 16px 20px;
                backdrop-filter: blur(20px);
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                animation: toastSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                position: relative;
                overflow: hidden;
            }
            
            .premium-toast.removing {
                animation: toastSlideOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            
            .premium-toast-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(90deg, #DCA773, #EAD0B3);
                border-radius: 0 3px 3px 0;
                animation: toastProgress 3s linear forwards;
            }
            
            .premium-toast-icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                flex-shrink: 0;
            }
            
            .premium-toast.success .premium-toast-icon {
                background: rgba(16, 185, 129, 0.2);
                border: 1px solid #10b981;
            }
            
            .premium-toast.error .premium-toast-icon {
                background: rgba(239, 68, 68, 0.2);
                border: 1px solid #ef4444;
            }
            
            .premium-toast.info .premium-toast-icon {
                background: rgba(220, 167, 115, 0.2);
                border: 1px solid #DCA773;
            }
            
            .premium-toast.warning .premium-toast-icon {
                background: rgba(245, 158, 11, 0.2);
                border: 1px solid #f59e0b;
            }
        `;
        document.head.appendChild(style);
        
        // Créer le conteneur
        const container = document.createElement('div');
        container.className = 'premium-toast-container';
        container.id = 'premiumToastContainer';
        document.body.appendChild(container);
    }
    
    show(message, type = 'info', duration = 3000) {
        const container = document.getElementById('premiumToastContainer');
        if (!container) return;
        
        // Limiter le nombre de toasts
        if (this.toasts.length >= this.maxToasts) {
            const oldestToast = this.toasts.shift();
            if (oldestToast) oldestToast.remove();
        }
        
        // Icônes selon le type
        const icons = {
            success: '✨',
            error: '❌',
            info: '💫',
            warning: '⚠️'
        };
        
        // Couleurs selon le type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#DCA773',
            warning: '#f59e0b'
        };
        
        const toast = document.createElement('div');
        toast.className = `premium-toast ${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div class="premium-toast-icon" style="color: ${colors[type]};">
                    ${icons[type] || '💫'}
                </div>
                <div style="flex: 1;">
                    <p style="color: #f5f5f4; font-size: 12px; font-weight: bold; margin: 0;">
                        ${message}
                    </p>
                </div>
            </div>
            <div class="premium-toast-progress"></div>
        `;
        
        container.appendChild(toast);
        this.toasts.push(toast);
        
        // Supprimer après la durée
        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => {
                toast.remove();
                this.toasts = this.toasts.filter(t => t !== toast);
            }, 400);
        }, duration);
        
        return toast;
    }
    
    success(message, duration) {
        return this.show(message, 'success', duration);
    }
    
    error(message, duration) {
        return this.show(message, 'error', duration);
    }
    
    info(message, duration) {
        return this.show(message, 'info', duration);
    }
    
    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.premiumToast = new PremiumToast();
});
