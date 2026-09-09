// ==================== CARD BREATHE ====================
// Effet de respiration subtil sur la carte principale
// N'affecte PAS le reste de l'application

(function() {
    'use strict';
    
    console.log('✨ Card Breathe activé');
    
    function injectStyles() {
        if (document.getElementById('cardBreatheStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'cardBreatheStyles';
        style.textContent = `
            /* Respiration sur la carte principale */
            .remal-card:first-of-type {
                animation: cardBreathe 4s ease-in-out infinite;
            }
            
            @keyframes cardBreathe {
                0%, 100% { 
                    box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.8);
                }
                50% { 
                    box-shadow: 0 30px 60px -8px rgba(220, 167, 115, 0.3);
                }
            }
            
            /* Mode clair */
            body.light-mode .remal-card:first-of-type {
                animation: cardBreatheLight 4s ease-in-out infinite;
            }
            
            @keyframes cardBreatheLight {
                0%, 100% { 
                    box-shadow: 0 15px 35px -5px rgba(180, 122, 62, 0.12);
                }
                50% { 
                    box-shadow: 0 15px 35px -2px rgba(180, 122, 62, 0.3);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        injectStyles();
    });
    
})();
