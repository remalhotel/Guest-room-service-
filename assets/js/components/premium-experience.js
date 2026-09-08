// ==================== PREMIUM EXPERIENCE REMAL HOTEL ====================
// Transforme Guest Hub en expérience luxueuse

class PremiumExperience {
    constructor() {
        this.particlesEnabled = true;
        this.particleInterval = null;
        this.init();
    }
    
    init() {
        this.addWelcomeEffect();
        this.addGoldParticles();
        this.enhanceCards();
        this.enhanceButtons();
        this.addSmoothTransitions();
        this.personalizeGreeting();
    }
    
    // ---------- 1. EFFET DE BIENVENUE ----------
    addWelcomeEffect() {
        const banner = document.querySelector('.remal-banner');
        if (!banner) return;
        
        // Ajouter la classe d'animation
        banner.classList.add('cinematic-entrance');
        
        // Ajouter un effet de brillance au titre
        const title = banner.querySelector('h1');
        if (title) {
            title.classList.add('gold-shimmer');
        }
        
        // Ajouter l'effet de verre
        banner.classList.add('glass-effect');
    }
    
    // ---------- 2. PARTICULES D'OR FLOTTANTES ----------
    addGoldParticles() {
        if (!this.particlesEnabled) return;
        
        // Créer des particules d'or subtiles
        this.particleInterval = setInterval(() => {
            if (document.hidden) return; // Ne pas créer si onglet inactif
            
            const particle = document.createElement('div');
            particle.className = 'gold-particle';
            particle.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}%;
                bottom: -10px;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: radial-gradient(circle, #EAD0B3, #DCA773);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                opacity: 0;
                animation: floatUp ${Math.random() * 3 + 2}s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            // Nettoyer après l'animation
            setTimeout(() => particle.remove(), 5000);
        }, 3000); // Une particule toutes les 3 secondes
    }
    
    // ---------- 3. AMÉLIORER LES CARTES ----------
    enhanceCards() {
        document.querySelectorAll('.service-card, .offer-card').forEach(card => {
            card.classList.add('premium-card', 'elegant-hover');
            
            // Ajouter un effet de profondeur au survol
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
                card.style.boxShadow = '0 15px 40px rgba(220, 167, 115, 0.2)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = 'none';
            });
        });
    }
    
    // ---------- 4. AMÉLIORER LES BOUTONS ----------
    enhanceButtons() {
        document.querySelectorAll('button:not(.lang-btn):not(.tab-btn)').forEach(button => {
            if (!button.classList.contains('premium-button')) {
                button.classList.add('premium-button');
            }
        });
    }
    
    // ---------- 5. TRANSITIONS FLUIDES ENTRE ÉCRANS ----------
    addSmoothTransitions() {
        // Observer les changements d'écran
        const lockScreen = document.getElementById('lockScreen');
        const mainScreen = document.getElementById('mainScreen');
        
        if (lockScreen && mainScreen) {
            const observer = new MutationObserver(() => {
                if (!lockScreen.classList.contains('hidden') && 
                    !lockScreen.classList.contains('cinematic-entrance')) {
                    lockScreen.classList.add('cinematic-entrance');
                }
                
                if (!mainScreen.classList.contains('hidden') && 
                    !mainScreen.classList.contains('screen-transition-in')) {
                    mainScreen.classList.add('screen-transition-in');
                }
            });
            
            observer.observe(lockScreen, { attributes: true, attributeFilter: ['class'] });
            observer.observe(mainScreen, { attributes: true, attributeFilter: ['class'] });
        }
    }
    
    // ---------- 6. SALUTATION PERSONNALISÉE ----------
    personalizeGreeting() {
        const greetingElement = document.getElementById('greetingTime');
        if (!greetingElement) return;
        
        const hour = new Date().getHours();
        let greeting;
        let icon;
        
        if (hour >= 5 && hour < 12) {
            greeting = 'Good Morning';
            icon = '🌅';
        } else if (hour >= 12 && hour < 17) {
            greeting = 'Good Afternoon';
            icon = '☀️';
        } else if (hour >= 17 && hour < 22) {
            greeting = 'Good Evening';
            icon = '🌆';
        } else {
            greeting = 'Good Night';
            icon = '🌙';
        }
        
        // Animation du texte
        greetingElement.style.opacity = '0';
        greetingElement.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            greetingElement.innerHTML = `${icon} ${greeting}`;
            greetingElement.style.opacity = '1';
        }, 300);
    }
    
    // ---------- 7. NOTIFICATION ÉLÉGANTE ----------
    showElegantNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'elegant-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: ${type === 'success' ? '#1c1917' : type === 'error' ? '#ef4444' : '#1c1917'};
            color: white;
            padding: 16px 24px;
            border-radius: 16px;
            font-weight: bold;
            font-size: 13px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            border: 1px solid ${type === 'error' ? '#ef4444' : '#DCA773'};
            display: flex;
            align-items: center;
            gap: 12px;
            backdrop-filter: blur(20px);
        `;
        
        const icon = type === 'success' ? '✨' : type === 'error' ? '⚠️' : '💫';
        notification.innerHTML = `
            <span style="font-size: 20px;">${icon}</span>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transition = 'all 0.5s ease';
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
    
    // ---------- 8. ACTIVER LE MODE VIP ----------
    activateVIPMode() {
        const isVIP = localStorage.getItem('isVIP') === 'true';
        if (!isVIP) return;
        
        // Ajouter un badge VIP animé
        const vipBadge = document.createElement('div');
        vipBadge.className = 'vip-badge-animated';
        vipBadge.style.cssText = `
            position: fixed;
            top: 20px;
            right: 80px;
            z-index: 9999;
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: #000;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 11px;
            letter-spacing: 1px;
        `;
        vipBadge.innerHTML = '👑 VIP';
        document.body.appendChild(vipBadge);
        
        // Augmenter la fréquence des particules
        clearInterval(this.particleInterval);
        this.particleInterval = setInterval(() => {
            for (let i = 0; i < 2; i++) {
                this.addGoldParticles();
            }
        }, 2000);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.premiumExperience = new PremiumExperience();
    window.premiumExperience.activateVIPMode();
});
