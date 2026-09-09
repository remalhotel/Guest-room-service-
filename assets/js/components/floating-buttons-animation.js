// ==================== FLOATING BUTTONS ANIMATION ====================
// Animation élégante des boutons flottants
// N'affecte PAS le reste de l'application

(function() {
    'use strict';
    
    console.log('✨ Floating Buttons Animation activé');
    
    function injectStyles() {
        if (document.getElementById('floatingButtonsStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'floatingButtonsStyles';
        style.textContent = `
            /* Animation des boutons flottants */
            .fixed.bottom-4 {
                transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease !important;
            }
            
            .fixed.bottom-4:hover {
                transform: translateY(-3px) scale(1.05) !important;
                box-shadow: 0 10px 30px rgba(0,0,0,0.4) !important;
            }
            
            .fixed.bottom-4:active {
                transform: scale(0.95) !important;
            }
            
            /* Animation du bouton chat */
            .fa-comments {
                animation: chatIconFloat 3s ease-in-out infinite;
            }
            
            @keyframes chatIconFloat {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-2px); }
            }
            
            /* Animation du bouton téléphone */
            .fa-phone-alt {
                animation: phoneIconPulse 2s ease-in-out infinite;
            }
            
            @keyframes phoneIconPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            /* Animation du bouton cloche */
            .fa-bell {
                animation: bellSwing 3s ease-in-out infinite;
            }
            
            @keyframes bellSwing {
                0%, 100% { transform: rotate(0deg); }
                5% { transform: rotate(15deg); }
                10% { transform: rotate(-15deg); }
                15% { transform: rotate(0deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        injectStyles();
    });
    
})();
