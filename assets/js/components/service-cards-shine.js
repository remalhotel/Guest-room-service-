// ==================== SERVICE CARDS SHINE ====================
// Effet de brillance élégant sur les cartes services
// N'affecte PAS le reste de l'application

(function() {
    'use strict';
    
    console.log('✨ Service Cards Shine activé');
    
    function injectStyles() {
        if (document.getElementById('serviceCardsShineStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'serviceCardsShineStyles';
        style.textContent = `
            /* Effet de brillance au survol des cartes */
            .service-card {
                position: relative;
                overflow: hidden;
            }
            
            .service-card::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(
                    45deg,
                    transparent 40%,
                    rgba(220, 167, 115, 0.1) 45%,
                    rgba(220, 167, 115, 0.2) 50%,
                    rgba(220, 167, 115, 0.1) 55%,
                    transparent 60%
                );
                transform: translateX(-100%) rotate(0deg);
                transition: transform 0.8s ease;
                pointer-events: none;
                z-index: 1;
            }
            
            .service-card:hover::before {
                transform: translateX(100%) rotate(0deg);
            }
            
            .service-card > * {
                position: relative;
                z-index: 2;
            }
            
            /* Effet de lueur sur l'icône */
            .service-card .w-10.h-10 {
                transition: box-shadow 0.5s ease, transform 0.5s ease;
            }
            
            .service-card:hover .w-10.h-10 {
                box-shadow: 0 0 20px rgba(220, 167, 115, 0.5);
                transform: scale(1.1);
            }
            
            /* Mode clair */
            body.light-mode .service-card::before {
                background: linear-gradient(
                    45deg,
                    transparent 40%,
                    rgba(180, 122, 62, 0.1) 45%,
                    rgba(180, 122, 62, 0.15) 50%,
                    rgba(180, 122, 62, 0.1) 55%,
                    transparent 60%
                );
            }
        `;
        document.head.appendChild(style);
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        injectStyles();
    });
    
})();
