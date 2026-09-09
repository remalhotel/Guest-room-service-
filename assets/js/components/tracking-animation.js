// ==================== TRACKING ANIMATION ====================
// Animation élégante du suivi de commande
// N'affecte PAS le reste de l'application

(function() {
    'use strict';
    
    console.log('✨ Tracking Animation activé');
    
    function injectStyles() {
        if (document.getElementById('trackingAnimationStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'trackingAnimationStyles';
        style.textContent = `
            /* Animation de pulsation sur l'étape active */
            .order-progress-dot.active {
                animation: activeStepPulse 2s ease-in-out infinite;
            }
            
            @keyframes activeStepPulse {
                0%, 100% { 
                    box-shadow: 0 0 10px rgba(220, 167, 115, 0.4);
                    transform: scale(1);
                }
                50% { 
                    box-shadow: 0 0 25px rgba(220, 167, 115, 0.8);
                    transform: scale(1.1);
                }
            }
            
            /* Transition fluide sur les lignes de progression */
            .order-progress-line {
                transition: background 0.8s ease, box-shadow 0.8s ease !important;
            }
            
            .order-progress-line.completed {
                background: #10b981 !important;
                box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
            }
            
            /* Effet de brillance sur l'étape complétée */
            .order-progress-dot.completed {
                animation: completedStepGlow 1.5s ease-in-out infinite;
            }
            
            @keyframes completedStepGlow {
                0%, 100% { 
                    box-shadow: 0 0 5px rgba(16, 185, 129, 0.4);
                }
                50% { 
                    box-shadow: 0 0 20px rgba(16, 185, 129, 0.7);
                }
            }
            
            /* Animation du label actif */
            .order-progress-label.active {
                animation: labelFade 2s ease-in-out infinite;
            }
            
            @keyframes labelFade {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.6; }
            }
            
            /* Transition de l'icône */
            .order-progress-dot i {
                transition: transform 0.5s ease;
            }
            
            .order-progress-dot.active i {
                transform: scale(1.2);
            }
            
            /* Mode clair */
            body.light-mode .order-progress-dot.active {
                box-shadow: 0 0 10px rgba(180, 122, 62, 0.4);
            }
            
            body.light-mode .order-progress-line.completed {
                box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
            }
        `;
        document.head.appendChild(style);
    }
    
    function observeTrackingChanges() {
        const trackingSection = document.getElementById('orderTrackingSection');
        if (!trackingSection) return;
        
        const observer = new MutationObserver(() => {
            // Ajouter une animation de transition quand le statut change
            const statusText = document.getElementById('orderStatusText');
            if (statusText && !statusText.dataset.animated) {
                statusText.dataset.animated = 'true';
                statusText.style.animation = 'statusChangeIn 0.5s ease';
                setTimeout(() => {
                    statusText.style.animation = '';
                    statusText.dataset.animated = '';
                }, 500);
            }
        });
        
        observer.observe(trackingSection, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
        
        // Ajouter l'animation du texte de statut
        const style = document.createElement('style');
        style.textContent = `
            @keyframes statusChangeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        injectStyles();
        observeTrackingChanges();
    });
    
})();
