// ==================== GOLD BUTTON WAVE ====================
// Effet de vague dorée sur les boutons principaux
// N'affecte PAS le reste de l'application

(function() {
    'use strict';
    
    console.log('✨ Gold Button Wave activé');
    
    function setupRipple() {
        document.addEventListener('click', function(e) {
            const btn = e.target.closest('button.bg-\\[\\#DCA773\\], button.bg-\\[\\#DCA773\\]:not(.lang-btn):not(.tab-btn)');
            if (!btn) return;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.4);
                transform: scale(0);
                animation: goldRipple 0.6s ease-out;
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
    
    function injectStyles() {
        if (document.getElementById('goldButtonWaveStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'goldButtonWaveStyles';
        style.textContent = `
            @keyframes goldRipple {
                to { transform: scale(4); opacity: 0; }
            }
            
            /* Transition des boutons */
            button.bg-\\[\\#DCA773\\] {
                transition: transform 0.3s ease, box-shadow 0.3s ease !important;
            }
            
            button.bg-\\[\\#DCA773\\]:hover {
                transform: scale(1.02);
                box-shadow: 0 10px 30px rgba(220, 167, 115, 0.4);
            }
            
            button.bg-\\[\\#DCA773\\]:active {
                transform: scale(0.98);
            }
        `;
        document.head.appendChild(style);
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        injectStyles();
        setupRipple();
    });
    
})();
