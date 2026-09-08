// ==================== PREMIUM THEME ====================
// Thème amélioré avec dégradés et effets

class PremiumTheme {
    constructor() {
        this.init();
    }
    
    init() {
        this.enhanceThemeToggle();
        this.addPremiumStyles();
        this.detectColorScheme();
    }
    
    enhanceThemeToggle() {
        const themeToggle = document.getElementById('themeToggleMain') || 
                           document.getElementById('themeToggleLock');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                // Ajouter une animation de transition
                document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
                
                setTimeout(() => {
                    document.body.style.transition = '';
                }, 500);
            });
        }
    }
    
    addPremiumStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Amélioration du mode sombre */
            body:not(.light-mode) {
                background: linear-gradient(135deg, #0c0a09 0%, #1c1917 50%, #0c0a09 100%);
            }
            
            /* Amélioration du mode clair */
            body.light-mode {
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%);
            }
            
            /* Dégradé pour les cartes */
            .remal-card {
                background: linear-gradient(135deg, rgba(28, 25, 23, 0.95) 0%, rgba(28, 25, 23, 0.9) 100%);
            }
            
            body.light-mode .remal-card {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 246, 242, 0.95) 100%);
            }
            
            /* Effet de bordure dégradée */
            .remal-banner {
                position: relative;
                overflow: hidden;
            }
            
            .remal-banner::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, transparent, #DCA773, #EAD0B3, #DCA773, transparent);
                animation: borderShimmer 3s linear infinite;
            }
            
            @keyframes borderShimmer {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
            }
        `;
        document.head.appendChild(style);
    }
    
    detectColorScheme() {
        // Détecter la préférence système
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('remal_theme');
        
        if (!savedTheme) {
            if (prefersDark) {
                document.body.classList.remove('light-mode');
            } else {
                document.body.classList.add('light-mode');
            }
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.premiumTheme = new PremiumTheme();
});
