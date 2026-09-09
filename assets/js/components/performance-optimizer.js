// ==================== PERFORMANCE OPTIMIZER ====================
// Optimisation des performances sans casser l'existant
// Lazy loading, debounce, throttle

(function() {
    'use strict';
    
    console.log('⚡ Performance Optimizer activé');
    
    // ==================== 1. DEBOUNCE ====================
    function debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // ==================== 2. THROTTLE ====================
    function throttle(func, limit = 300) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // ==================== 3. LAZY LOADING IMAGES ====================
    function setupLazyLoading() {
        document.querySelectorAll('img').forEach(img => {
            if (!img.dataset.loadingSet) {
                img.dataset.loadingSet = 'true';
                img.loading = 'lazy';
                img.decoding = 'async';
            }
        });
        
        // Observer les nouvelles images
        const observer = new MutationObserver(() => {
            document.querySelectorAll('img:not([loading])').forEach(img => {
                img.loading = 'lazy';
                img.decoding = 'async';
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    // ==================== 4. OPTIMISATION DU SCROLL ====================
    function optimizeScroll() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Rien à faire ici, juste pour fluidifier
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
    
    // ==================== 5. NETTOYAGE DU CACHE LOCALSTORAGE ====================
    function cleanupStorage() {
        const now = Date.now();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 jours
        
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            
            // Nettoyer les vieux caches
            if (key.startsWith('cache_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data.timestamp && now - data.timestamp > maxAge) {
                        localStorage.removeItem(key);
                    }
                } catch (e) {
                    localStorage.removeItem(key);
                }
            }
        }
    }
    
    // ==================== 6. PRÉCHARGEMENT DES POLICES ====================
    function preloadFonts() {
        const fonts = [
            'https://fonts.gstatic.com/s/cinzel/v19/8vIJ7ww63mVu7gt7-GT7PkRXM8Xx.woff2',
            'https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_qU79TRX9EYs.woff2'
        ];
        
        fonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/woff2';
            link.href = font;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }
    
    // ==================== 7. COMPRESSION DES DONNÉES LOCALSTORAGE ====================
    function compressStorageData() {
        // Vérifier la taille du localStorage
        let totalSize = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            totalSize += (key.length + localStorage.getItem(key).length) * 2;
        }
        
        const maxSize = 5 * 1024 * 1024; // 5 MB
        
        if (totalSize > maxSize * 0.8) {
            console.warn('⚠️ localStorage à 80% de sa capacité');
            cleanupStorage();
        }
    }
    
    // ==================== INITIALISATION ====================
    document.addEventListener('DOMContentLoaded', () => {
        setupLazyLoading();
        optimizeScroll();
        preloadFonts();
        cleanupStorage();
        compressStorageData();
        
        // Nettoyage périodique
        setInterval(cleanupStorage, 60 * 60 * 1000); // Toutes les heures
    });
    
    // Exposer
    window.debounce = debounce;
    window.throttle = throttle;
    
})();
