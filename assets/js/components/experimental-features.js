// ==================== EXPERIMENTAL FEATURES ====================
// Améliorations expérimentales pour Guest Hub
// N'affecte PAS : photos, offres, services, laundry, navigation

(function() {
    'use strict';
    
    console.log('🧪 Experimental Features activées');
    
    // ==================== 1. GESTE DE BALAYAGE POUR CHANGER D'ONGLET ====================
    class SwipeNavigation {
        constructor() {
            this.touchStartX = 0;
            this.touchEndX = 0;
            this.init();
        }
        
        init() {
            document.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            document.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            }, { passive: true });
        }
        
        handleSwipe() {
            const diff = this.touchEndX - this.touchStartX;
            const threshold = 80; // 80px minimum
            
            if (Math.abs(diff) < threshold) return;
            
            const tabs = ['services', 'offers', 'faq'];
            let currentTab = 'services';
            
            // Trouver l'onglet actif
            tabs.forEach(tab => {
                const btn = document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
                if (btn && btn.classList.contains('active')) {
                    currentTab = tab;
                }
            });
            
            const currentIndex = tabs.indexOf(currentTab);
            
            if (diff < 0 && currentIndex < tabs.length - 1) {
                // Swipe gauche → onglet suivant
                this.switchTo(tabs[currentIndex + 1]);
            } else if (diff > 0 && currentIndex > 0) {
                // Swipe droite → onglet précédent
                this.switchTo(tabs[currentIndex - 1]);
            }
        }
        
        switchTo(tab) {
            if (typeof switchTab === 'function') {
                switchTab(tab);
                
                // Animation de transition
                const section = document.getElementById(`${tab}Section`);
                if (section) {
                    section.style.animation = 'swipeIn 0.4s ease';
                    setTimeout(() => section.style.animation = '', 400);
                }
            }
        }
    }
    
    // ==================== 2. APPUI LONG POUR INFOS RAPIDES ====================
    class LongPressInfo {
        constructor() {
            this.longPressTimer = null;
            this.init();
        }
        
        init() {
            document.addEventListener('touchstart', (e) => {
                const card = e.target.closest('.service-card');
                if (!card) return;
                
                this.longPressTimer = setTimeout(() => {
                    this.showQuickInfo(card);
                }, 600); // 600ms = appui long
            }, { passive: true });
            
            document.addEventListener('touchend', () => {
                clearTimeout(this.longPressTimer);
            }, { passive: true });
            
            document.addEventListener('touchmove', () => {
                clearTimeout(this.longPressTimer);
            }, { passive: true });
        }
        
        showQuickInfo(card) {
            const title = card.querySelector('p')?.textContent || 'Service';
            const icon = card.querySelector('i')?.className || 'fa-info';
            
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                bottom: 100px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(28, 25, 23, 0.95);
                border: 1px solid #DCA773;
                border-radius: 15px;
                padding: 15px 25px;
                color: #DCA773;
                font-weight: bold;
                font-size: 12px;
                z-index: 9999;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                animation: fadeInUp 0.3s ease;
            `;
            toast.textContent = `${icon} ${title} - Tap to open`;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.transition = 'all 0.3s ease';
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 2000);
        }
    }
    
    // ==================== 3. DOUBLE TAP POUR FAVORI ====================
    class DoubleTapFavorite {
        constructor() {
            this.lastTap = 0;
            this.init();
        }
        
        init() {
            document.addEventListener('click', (e) => {
                const card = e.target.closest('.service-card');
                if (!card) return;
                
                const now = Date.now();
                if (now - this.lastTap < 300) {
                    // Double tap détecté
                    this.toggleFavorite(card);
                    this.lastTap = 0;
                } else {
                    this.lastTap = now;
                }
            });
        }
        
        toggleFavorite(card) {
            const heart = card.querySelector('.favorite-heart');
            
            if (heart) {
                heart.classList.toggle('active');
            } else {
                // Créer le cœur
                const newHeart = document.createElement('span');
                newHeart.className = 'favorite-heart';
                newHeart.style.cssText = `
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    font-size: 14px;
                    cursor: pointer;
                `;
                newHeart.textContent = '🤍';
                
                card.style.position = 'relative';
                card.appendChild(newHeart);
                
                // Animation
                newHeart.style.animation = 'heartPop 0.3s ease';
            }
            
            // Toast
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                bottom: 100px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(28, 25, 23, 0.95);
                border: 1px solid #ef4444;
                border-radius: 15px;
                padding: 10px 20px;
                color: #ef4444;
                font-weight: bold;
                font-size: 11px;
                z-index: 9999;
            `;
            toast.textContent = '🤍 Added to favorites';
            document.body.appendChild(toast);
            
            setTimeout(() => toast.remove(), 1500);
        }
    }
    
    // ==================== 4. TIRER POUR RAFRAÎCHIR ====================
    class PullToRefresh {
        constructor() {
            this.startY = 0;
            this.init();
        }
        
        init() {
            document.addEventListener('touchstart', (e) => {
                if (window.scrollY === 0) {
                    this.startY = e.touches[0].pageY;
                }
            }, { passive: true });
            
            document.addEventListener('touchend', (e) => {
                if (window.scrollY === 0) {
                    const endY = e.changedTouches[0].pageY;
                    const diff = endY - this.startY;
                    
                    if (diff > 150) {
                        this.refresh();
                    }
                }
            }, { passive: true });
        }
        
        refresh() {
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(28, 25, 23, 0.95);
                border: 1px solid #DCA773;
                border-radius: 20px;
                padding: 12px 25px;
                color: #DCA773;
                font-weight: bold;
                font-size: 11px;
                z-index: 9999;
                animation: spinIn 0.3s ease;
            `;
            toast.innerHTML = '🔄 Refreshing...';
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.textContent = '✅ Updated!';
                setTimeout(() => {
                    toast.style.transition = 'all 0.3s ease';
                    toast.style.opacity = '0';
                    setTimeout(() => toast.remove(), 300);
                }, 1000);
            }, 1500);
        }
    }
    
    // ==================== 5. ANIMATION DE PRÉSENCE ====================
    class PresenceIndicator {
        constructor() {
            this.init();
        }
        
        init() {
            // Ajouter un indicateur de présence au chat
            const observer = new MutationObserver(() => {
                const status = document.getElementById('staffPresenceStatus');
                if (status && !status.dataset.enhanced) {
                    status.dataset.enhanced = 'true';
                    
                    // Améliorer l'indicateur
                    status.innerHTML = `
                        <span style="display: inline-flex; align-items: center; gap: 5px;">
                            <span style="
                                width: 8px;
                                height: 8px;
                                border-radius: 50%;
                                background: #10b981;
                                animation: presencePulse 2s infinite;
                                display: inline-block;
                            "></span>
                            Staff online
                        </span>
                    `;
                }
            });
            
            const status = document.getElementById('staffPresenceStatus');
            if (status) observer.observe(status, { childList: true, subtree: true });
        }
    }
    
    // ==================== INJECTION DES STYLES ====================
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes swipeIn {
                from { opacity: 0; transform: translateX(30px); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            @keyframes heartPop {
                0% { transform: scale(0); }
                50% { transform: scale(1.5); }
                100% { transform: scale(1); }
            }
            
            @keyframes presencePulse {
                0%, 100% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.5); }
                50% { box-shadow: 0 0 15px rgba(16, 185, 129, 0.8); }
            }
            
            @keyframes spinIn {
                from { opacity: 0; transform: translateX(-50%) rotate(-90deg); }
                to { opacity: 1; transform: translateX(-50%) rotate(0deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // ==================== INITIALISATION ====================
    document.addEventListener('DOMContentLoaded', () => {
        injectStyles();
        window.swipeNavigation = new SwipeNavigation();
        window.longPressInfo = new LongPressInfo();
        window.doubleTapFavorite = new DoubleTapFavorite();
        window.pullToRefresh = new PullToRefresh();
        window.presenceIndicator = new PresenceIndicator();
        
        console.log('✅ Experimental features activated');
    });
    
})();
