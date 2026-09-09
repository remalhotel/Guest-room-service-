// ==================== BANNER ZOOM EFFECT ====================
// Zoom lent et subtil sur la photo de la bannière
// N'affecte PAS le reste de l'application

(function() {
    'use strict';
    
    console.log('✨ Banner Zoom Effect activé');
    
    function injectStyles() {
        if (document.getElementById('bannerZoomStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'bannerZoomStyles';
        style.textContent = `
            /* Zoom lent sur la bannière */
            .remal-banner::before {
                animation: slowZoom 20s ease-in-out infinite !important;
            }
            
            @keyframes slowZoom {
                0%, 100% { 
                    transform: scale(1);
                }
                50% { 
                    transform: scale(1.1);
                }
            }
            
            /* Légère parallaxe sur la bannière */
            .remal-banner {
                transform-style: preserve-3d;
                perspective: 1000px;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        injectStyles();
    });
    
})();
