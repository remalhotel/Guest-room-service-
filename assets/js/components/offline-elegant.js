// ==================== OFFLINE ELEGANT ====================
// Mode hors ligne élégant
// N'affecte AUCUNE fonctionnalité existante

(function() {
    'use strict';
    
    console.log('📡 Offline Elegant activé');
    
    function showOfflineBanner() {
        if (document.getElementById('offlineBanner')) return;
        
        const banner = document.createElement('div');
        banner.id = 'offlineBanner';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 99999;
            background: #f59e0b;
            color: #000;
            padding: 10px;
            text-align: center;
            font-weight: bold;
            font-size: 11px;
            animation: offlineIn 0.5s ease;
        `;
        banner.textContent = '📡 Vous êtes hors ligne - Données en cache affichées';
        document.body.prepend(banner);
    }
    
    function showOnlineBanner() {
        const banner = document.getElementById('offlineBanner');
        if (banner) {
            banner.textContent = '✅ De retour en ligne !';
            banner.style.background = '#10b981';
            
            setTimeout(() => {
                banner.style.transition = 'all 0.5s ease';
                banner.style.transform = 'translateY(-100%)';
                setTimeout(() => banner.remove(), 500);
            }, 2000);
        }
    }
    
    function injectStyles() {
        if (document.getElementById('offlineStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'offlineStyles';
        style.textContent = `
            @keyframes offlineIn {
                from { opacity: 0; transform: translateY(-100%); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        injectStyles();
        
        if (!navigator.onLine) {
            showOfflineBanner();
        }
        
        window.addEventListener('offline', showOfflineBanner);
        window.addEventListener('online', showOnlineBanner);
    });
    
})();
