// ==================== BANNER AUTO PHOTO ====================
// Change la photo de la bannière REMAL selon l'heure
// Jour = remal-hotel-day.jpg
// Nuit = remal-hotel-night.jpg

(function() {
    'use strict';
    
    console.log('🌅 Banner Auto Photo activé');
    
    function getCurrentMode() {
        const hour = new Date().getHours();
        return (hour >= 6 && hour < 18) ? 'day' : 'night';
    }
    
    function updateBannerPhoto(mode) {
        const banners = document.querySelectorAll('.remal-banner');
        
        banners.forEach(banner => {
            if (mode === 'day') {
                banner.style.backgroundImage = "url('assets/images/remal-hotel-day.jpg')";
                banner.style.backgroundSize = 'cover';
                banner.style.backgroundPosition = 'center';
                banner.style.backgroundRepeat = 'no-repeat';
            } else {
                banner.style.backgroundImage = "url('assets/images/remal-hotel-night.jpg')";
                banner.style.backgroundSize = 'cover';
                banner.style.backgroundPosition = 'center';
                banner.style.backgroundRepeat = 'no-repeat';
            }
            
            // Transition douce
            banner.style.transition = 'background-image 1.5s ease';
        });
    }
    
    function checkAndUpdate() {
        const mode = getCurrentMode();
        const lastMode = localStorage.getItem('banner_photo_mode');
        
        if (lastMode !== mode) {
            updateBannerPhoto(mode);
            localStorage.setItem('banner_photo_mode', mode);
            console.log(`🖼️ Bannière changée vers : ${mode}`);
        }
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        checkAndUpdate();
        
        // Vérifier toutes les minutes
        setInterval(checkAndUpdate, 60000);
    });
    
})();
