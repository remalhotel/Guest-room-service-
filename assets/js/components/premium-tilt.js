// ==================== PREMIUM TILT EFFECT ====================
// Effet 3D sur les cartes au survol

class PremiumTilt {
    constructor() {
        this.maxTilt = 5; // Degrés maximum d'inclinaison
        this.init();
    }
    
    init() {
        this.applyTiltToCards();
    }
    
    applyTiltToCards() {
        // Observer les cartes ajoutées dynamiquement
        const observer = new MutationObserver(() => {
            this.attachTiltListeners();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Attacher aux cartes existantes
        this.attachTiltListeners();
    }
    
    attachTiltListeners() {
        document.querySelectorAll('.service-card, .offer-card').forEach(card => {
            // Éviter les doublons
            if (card.dataset.tiltAttached) return;
            card.dataset.tiltAttached = 'true';
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -this.maxTilt;
                const rotateY = ((x - centerX) / centerX) * this.maxTilt;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
                card.style.transition = 'transform 0.1s ease';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
                card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            });
            
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform 0.1s ease';
            });
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.premiumTilt = new PremiumTilt();
});
