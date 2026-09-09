// ==================== THEME MANAGEMENT ====================
function toggleTheme() {
    const isLight = document.body.classList.contains('light-mode');
    
    if (isLight) {
        document.body.classList.remove('light-mode');
        document.body.style.background = 'linear-gradient(135deg, #0a0908 0%, #1a1714 50%, #0a0908 100%)';
        localStorage.setItem('remal_theme', 'dark');
    } else {
        document.body.classList.add('light-mode');
        document.body.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)';
        localStorage.setItem('remal_theme', 'light');
    }
    
    const newIsLight = document.body.classList.contains('light-mode');
    const iconLock = document.getElementById('themeIconLock');
    const iconMain = document.getElementById('themeIconMain');
    
    if (iconLock) iconLock.className = newIsLight ? 'fas fa-sun text-sm' : 'fas fa-moon text-sm';
    if (iconMain) iconMain.className = newIsLight ? 'fas fa-sun text-sm' : 'fas fa-moon text-sm';
    
    // Désactiver l'auto pendant 1 heure (respecter le choix manuel)
    localStorage.setItem('theme_manual_override', Date.now() + 3600000);
}

function initTheme() {
    const savedTheme = localStorage.getItem('remal_theme');
    
    // Si pas de thème sauvegardé, activer le mode auto
    if (!savedTheme) {
        localStorage.setItem('remal_theme', 'auto');
    }
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        document.body.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)';
    } else if (savedTheme === 'dark') {
        document.body.classList.remove('light-mode');
        document.body.style.background = 'linear-gradient(135deg, #0a0908 0%, #1a1714 50%, #0a0908 100%)';
    } else {
        // Mode auto : laisser auto-theme-premium.js gérer
        // Icône magique pour indiquer le mode auto
        const iconLock = document.getElementById('themeIconLock');
        const iconMain = document.getElementById('themeIconMain');
        if (iconLock) iconLock.className = 'fas fa-magic text-sm';
        if (iconMain) iconMain.className = 'fas fa-magic text-sm';
    }
    
    const isLight = document.body.classList.contains('light-mode');
    const iconLock = document.getElementById('themeIconLock');
    const iconMain = document.getElementById('themeIconMain');
    
    if (savedTheme !== 'auto') {
        if (iconLock) iconLock.className = isLight ? 'fas fa-sun text-sm' : 'fas fa-moon text-sm';
        if (iconMain) iconMain.className = isLight ? 'fas fa-sun text-sm' : 'fas fa-moon text-sm';
    }
}

// Exposer
window.toggleTheme = toggleTheme;
window.initTheme = initTheme;
