// ==================== BANNER THEME SYNC ====================
// Synchronise le thème clair/sombre avec la photo de la bannière
// Jour = Mode clair + Photo jour
// Nuit = Mode sombre + Photo nuit

(function() {
    'use strict';
    
    console.log('🔄 Banner Theme Sync activé');
    
    function getCurrentMode() {
        const hour = new Date().getHours();
        return (hour >= 6 && hour < 18) ? 'day' : 'night';
    }
    
    function syncThemeAndBanner() {
        const mode = getCurrentMode();
        
        // Vérifier si l'utilisateur a choisi manuellement
        const savedTheme = localStorage.getItem('remal_theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
            return; // Respecter le choix manuel
        }
        
        // Mode auto
        if (mode === 'day') {
            // Mode clair
            document.body.classList.add('light-mode');
            
            // Icône soleil
            const iconLock = document.getElementById('themeIconLock');
            const iconMain = document.getElementById('themeIconMain');
            if (iconLock) iconLock.className = 'fas fa-sun text-sm';
            if (iconMain) iconMain.className = 'fas fa-sun text-sm';
            
            // Photo jour dans la bannière
            document.querySelectorAll('.remal-banner').forEach(banner => {
                banner.style.backgroundImage = "url('assets/images/remal-hotel-day.jpg')";
                banner.style.backgroundSize = 'cover';
                banner.style.backgroundPosition = 'center';
            });
        } else {
            // Mode sombre
            document.body.classList.remove('light-mode');
            
            // Icône lune
            const iconLock = document.getElementById('themeIconLock');
            const iconMain = document.getElementById('themeIconMain');
            if (iconLock) iconLock.className = 'fas fa-moon text-sm';
            if (iconMain) iconMain.className = 'fas fa-moon text-sm';
            
            // Photo nuit dans la bannière
            document.querySelectorAll('.remal-banner').forEach(banner => {
                banner.style.backgroundImage = "url('assets/images/remal-hotel-night.jpg')";
                banner.style.backgroundSize = 'cover';
                banner.style.backgroundPosition = 'center';
            });
        }
        
        localStorage.setItem('remal_theme', 'auto');
        localStorage.setItem('remal_auto_mode', mode);
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        syncThemeAndBanner();
        
        // Vérifier toutes les minutes
        setInterval(syncThemeAndBanner, 60000);
    });
    
})();
