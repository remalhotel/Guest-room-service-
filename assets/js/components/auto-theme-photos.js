// ==================== AUTO THEME WITH PHOTOS ====================
// Mode automatique qui change le thème ET les photos selon l'heure
// Jour (6h-18h) = Photo jour + Mode clair
// Nuit (18h-6h) = Photo nuit + Mode sombre

(function() {
    'use strict';
    
    console.log('🌅 Auto Theme Photos activé');
    
    class AutoThemePhotos {
        constructor() {
            this.currentMode = null;
            this.init();
        }
        
        init() {
            this.injectStyles();
            this.detectMode();
            this.startMonitoring();
            this.setupToggle();
        }
        
        injectStyles() {
            if (document.getElementById('autoThemePhotosStyles')) return;
            
            const style = document.createElement('style');
            style.id = 'autoThemePhotosStyles';
            style.textContent = `
                /* Transition fluide du body */
                body {
                    transition: background-image 1.5s ease, background-color 1.5s ease !important;
                }
                
                /* Transition des cartes */
                .remal-card, .lock-card, .service-card {
                    transition: background-color 1.5s ease, border-color 1.5s ease, box-shadow 1.5s ease !important;
                }
                
                /* Transition de la bannière */
                .remal-banner::before {
                    transition: background-image 1.5s ease, opacity 1.5s ease !important;
                }
                
                /* Animation de notification de changement */
                @keyframes modeChangeIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .mode-change-notification {
                    animation: modeChangeIn 0.5s ease forwards;
                }
            `;
            document.head.appendChild(style);
        }
        
        detectMode() {
            const hour = new Date().getHours();
            
            if (hour >= 6 && hour < 18) {
                this.applyDayMode();
            } else {
                this.applyNightMode();
            }
        }
        
        applyDayMode() {
            if (this.currentMode === 'day') return;
            this.currentMode = 'day';
            
            console.log('☀️ Mode jour activé');
            
            // Appliquer le mode clair
            document.body.classList.add('light-mode');
            
            // Changer la photo de fond pour le jour
            document.body.style.backgroundImage = "url('assets/images/remal-hotel-day.jpg')";
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';
            
            // Changer l'image de la bannière
            this.updateBannerImage('day');
            
            // Mettre à jour les icônes
            this.updateIcons('sun');
            
            // Notification
            this.showModeNotification('☀️', 'Day mode activated');
            
            // Sauvegarder
            localStorage.setItem('remal_theme', 'auto');
            localStorage.setItem('remal_auto_mode', 'day');
        }
        
        applyNightMode() {
            if (this.currentMode === 'night') return;
            this.currentMode = 'night';
            
            console.log('🌙 Mode nuit activé');
            
            // Appliquer le mode sombre
            document.body.classList.remove('light-mode');
            
            // Changer la photo de fond pour la nuit
            document.body.style.backgroundImage = "url('assets/images/remal-hotel-night.jpg')";
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';
            
            // Changer l'image de la bannière
            this.updateBannerImage('night');
            
            // Mettre à jour les icônes
            this.updateIcons('moon');
            
            // Notification
            this.showModeNotification('🌙', 'Night mode activated');
            
            // Sauvegarder
            localStorage.setItem('remal_theme', 'auto');
            localStorage.setItem('remal_auto_mode', 'night');
        }
        
        updateBannerImage(mode) {
            const banners = document.querySelectorAll('.remal-banner');
            banners.forEach(banner => {
                if (mode === 'day') {
                    banner.style.backgroundImage = "url('assets/images/remal-hotel-day.jpg')";
                } else {
                    banner.style.backgroundImage = "url('assets/images/remal-hotel-night.jpg')";
                }
                banner.style.backgroundSize = 'cover';
                banner.style.backgroundPosition = 'center';
            });
        }
        
        updateIcons(mode) {
            const iconLock = document.getElementById('themeIconLock');
            const iconMain = document.getElementById('themeIconMain');
            
            if (iconLock) iconLock.className = mode === 'sun' ? 'fas fa-sun text-sm' : 'fas fa-moon text-sm';
            if (iconMain) iconMain.className = mode === 'sun' ? 'fas fa-sun text-sm' : 'fas fa-moon text-sm';
        }
        
        showModeNotification(icon, message) {
            const toast = document.createElement('div');
            toast.className = 'mode-change-notification';
            toast.style.cssText = `
                position: fixed;
                bottom: 100px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(28, 25, 23, 0.95);
                border: 1px solid #DCA773;
                border-radius: 20px;
                padding: 12px 25px;
                color: #DCA773;
                font-weight: bold;
                font-size: 12px;
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            `;
            toast.innerHTML = `${icon} ${message}`;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.transition = 'all 0.5s ease';
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(-50%) translateY(20px)';
                setTimeout(() => toast.remove(), 500);
            }, 3000);
        }
        
        startMonitoring() {
            // Vérifier toutes les 5 minutes
            setInterval(() => {
                this.detectMode();
            }, 5 * 60 * 1000);
            
            // Vérifier à chaque minute pour être précis
            setInterval(() => {
                const savedMode = localStorage.getItem('remal_auto_mode');
                const hour = new Date().getHours();
                const expectedMode = (hour >= 6 && hour < 18) ? 'day' : 'night';
                
                if (savedMode !== expectedMode) {
                    this.detectMode();
                }
            }, 60000);
        }
        
        setupToggle() {
            // Si l'utilisateur clique sur le bouton thème, désactiver l'auto
            const originalToggle = window.toggleTheme;
            
            window.toggleTheme = function() {
                const isLight = document.body.classList.contains('light-mode');
                
                if (isLight) {
                    // Passer en sombre manuellement
                    document.body.classList.remove('light-mode');
                    document.body.style.backgroundImage = "url('assets/images/remal-hotel-night.jpg')";
                    document.body.style.backgroundSize = 'cover';
                    document.body.style.backgroundPosition = 'center';
                    document.body.style.backgroundAttachment = 'fixed';
                    localStorage.setItem('remal_theme', 'dark');
                } else {
                    // Passer en clair manuellement
                    document.body.classList.add('light-mode');
                    document.body.style.backgroundImage = "url('assets/images/remal-hotel-day.jpg')";
                    document.body.style.backgroundSize = 'cover';
                    document.body.style.backgroundPosition = 'center';
                    document.body.style.backgroundAttachment = 'fixed';
                    localStorage.setItem('remal_theme', 'light');
                }
                
                // Désactiver l'auto pendant 2 heures
                localStorage.setItem('theme_manual_override', Date.now() + 7200000);
                
                const iconLock = document.getElementById('themeIconLock');
                const iconMain = document.getElementById('themeIconMain');
                const newIsLight = document.body.classList.contains('light-mode');
                
                if (iconLock) iconLock.className = newIsLight ? 'fas fa-sun text-sm' : 'fas fa-moon text-sm';
                if (iconMain) iconMain.className = newIsLight ? 'fas fa-sun text-sm' : 'fas fa-moon text-sm';
            };
        }
    }
    
    // Initialisation
    document.addEventListener('DOMContentLoaded', () => {
        window.autoThemePhotos = new AutoThemePhotos();
    });
    
})();
