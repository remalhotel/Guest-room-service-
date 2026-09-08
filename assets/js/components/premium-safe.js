// ==================== PREMIUM EFFECTS SAFE ====================
// Tous les effets premium SANS toucher aux photos
// N'affecte PAS : body, background, .remal-banner, .lock-screen

(function() {
    'use strict';
    
    console.log('✨ Premium Safe Effects activés');
    
    // ==================== 1. PARTICULES D'OR ====================
    class GoldParticles {
        constructor() {
            this.interval = null;
            this.start();
        }
        
        start() {
            this.interval = setInterval(() => {
                if (document.hidden) return;
                this.createParticle();
            }, 4000); // Une particule toutes les 4 secondes
        }
        
        createParticle() {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}%;
                bottom: -10px;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: radial-gradient(circle, #EAD0B3, #DCA773);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9997;
                opacity: 0;
                animation: goldFloat ${Math.random() * 3 + 2}s ease-out forwards;
            `;
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 5000);
        }
    }
    
    // ==================== 2. EFFET 3D SUR LES CARTES ====================
    class TiltEffect {
        constructor() {
            this.attach();
        }
        
        attach() {
            document.addEventListener('mouseover', (e) => {
                const card = e.target.closest('.service-card, .offer-card');
                if (card && !card.dataset.tilt) {
                    card.dataset.tilt = 'true';
                    
                    card.addEventListener('mousemove', (ev) => {
                        const rect = card.getBoundingClientRect();
                        const x = ev.clientX - rect.left;
                        const y = ev.clientY - rect.top;
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;
                        const rotateX = ((y - centerY) / centerY) * -3;
                        const rotateY = ((x - centerX) / centerX) * 3;
                        
                        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
                        card.style.transition = 'transform 0.1s ease';
                    });
                    
                    card.addEventListener('mouseleave', () => {
                        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
                        card.style.transition = 'transform 0.5s ease';
                    });
                }
            });
        }
    }
    
    // ==================== 3. BOUTONS AVEC EFFET DE VAGUE ====================
    class ButtonRipple {
        constructor() {
            this.attach();
        }
        
        attach() {
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('button:not(.lang-btn):not(.tab-btn)');
                if (!btn) return;
                
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: rippleEffect 0.6s ease-out;
                    pointer-events: none;
                `;
                
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
                ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
                
                btn.style.position = 'relative';
                btn.style.overflow = 'hidden';
                btn.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        }
    }
    
    // ==================== 4. TRANSITIONS ENTRE SECTIONS ====================
    class SmoothTransitions {
        constructor() {
            this.attach();
        }
        
        attach() {
            // Observer les changements de sections
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const el = mutation.target;
                        
                        // Section devenue visible
                        if (!el.classList.contains('hidden') && 
                            (el.id === 'servicesSection' || 
                             el.id === 'offersSection' || 
                             el.id === 'faqSection' ||
                             el.id === 'roomServiceSection' ||
                             el.id === 'otherServiceSection')) {
                            el.style.animation = 'sectionFadeIn 0.4s ease forwards';
                        }
                    }
                });
            });
            
            // Observer les sections
            ['servicesSection', 'offersSection', 'faqSection', 'roomServiceSection', 'otherServiceSection']
                .forEach(id => {
                    const el = document.getElementById(id);
                    if (el) observer.observe(el, { attributes: true, attributeFilter: ['class'] });
                });
        }
    }
    
    // ==================== 5. ANIMATION DU CHAT ====================
    class ChatAnimation {
        constructor() {
            this.attach();
        }
        
        attach() {
            const observer = new MutationObserver(() => {
                const messages = document.querySelectorAll('.chat-message');
                if (messages.length > 0) {
                    const last = messages[messages.length - 1];
                    last.style.animation = 'messageIn 0.3s ease forwards';
                }
                
                const container = document.getElementById('guestChatContainer');
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            });
            
            const container = document.getElementById('guestChatContainer');
            if (container) {
                observer.observe(container, { childList: true, subtree: true });
            }
        }
    }
    
    // ==================== 6. NOTIFICATIONS TOAST PREMIUM ====================
    class PremiumToast {
        constructor() {
            this.container = null;
            this.createContainer();
        }
        
        createContainer() {
            this.container = document.createElement('div');
            this.container.id = 'premiumToastContainer';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 99999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            `;
            document.body.appendChild(this.container);
        }
        
        show(message, type = 'info', duration = 3000) {
            if (!this.container) return;
            
            const icons = { success: '✨', error: '❌', info: '💫', warning: '⚠️' };
            const colors = { success: '#10b981', error: '#ef4444', info: '#DCA773', warning: '#f59e0b' };
            
            const toast = document.createElement('div');
            toast.style.cssText = `
                pointer-events: auto;
                min-width: 280px;
                max-width: 350px;
                background: rgba(28, 25, 23, 0.95);
                border: 1px solid ${colors[type] || '#DCA773'};
                border-radius: 16px;
                padding: 16px 20px;
                backdrop-filter: blur(20px);
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                animation: toastSlideIn 0.5s ease forwards;
                position: relative;
                overflow: hidden;
            `;
            
            toast.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 20px;">${icons[type] || '💫'}</span>
                    <p style="color: #f5f5f4; font-size: 12px; font-weight: bold; margin: 0;">${message}</p>
                </div>
                <div style="
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    background: ${colors[type] || '#DCA773'};
                    animation: toastProgress ${duration}ms linear forwards;
                "></div>
            `;
            
            this.container.appendChild(toast);
            
            setTimeout(() => {
                toast.style.transition = 'all 0.4s ease';
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100px)';
                setTimeout(() => toast.remove(), 400);
            }, duration);
        }
    }
    
    // ==================== INITIALISATION ====================
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes goldFloat {
                0% { opacity: 0; transform: translateY(0) rotate(0deg); }
                50% { opacity: 1; }
                100% { opacity: 0; transform: translateY(-100px) rotate(360deg); }
            }
            
            @keyframes rippleEffect {
                to { transform: scale(4); opacity: 0; }
            }
            
            @keyframes sectionFadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes messageIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes toastSlideIn {
                from { opacity: 0; transform: translateX(100px) scale(0.9); }
                to { opacity: 1; transform: translateX(0) scale(1); }
            }
            
            @keyframes toastProgress {
                from { width: 100%; }
                to { width: 0%; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        injectStyles();
        window.goldParticles = new GoldParticles();
        window.tiltEffect = new TiltEffect();
        window.buttonRipple = new ButtonRipple();
        window.smoothTransitions = new SmoothTransitions();
        window.chatAnimation = new ChatAnimation();
        window.premiumToast = new PremiumToast();
        
        console.log('✅ Tous les effets premium activés sans toucher aux photos');
    });
    
})();
