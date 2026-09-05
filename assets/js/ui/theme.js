// ==================== THEME MANAGEMENT ====================
let autoThemeEnabled = localStorage.getItem('remal_auto_theme') === 'on';
let autoThemeInterval = null;

function toggleTheme() {
    // Si le mode auto est activé, le désactiver
    if (autoThemeEnabled) {
        autoThemeEnabled = false;
        localStorage.setItem('remal_auto_theme', 'off');
        stopAutoTheme();
    }
    
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    updateThemeIcons(isLight);
    localStorage.setItem('remal_theme', isLight ? 'light' : 'dark');
    showAutoThemeToast();
}

function initTheme() {
    const savedTheme = localStorage.getItem('remal_theme');
    const savedAutoTheme = localStorage.getItem('remal_auto_theme');
    
    autoThemeEnabled = savedAutoTheme === 'on';
    
    if (autoThemeEnabled) {
        applyAutoTheme();
        startAutoTheme();
    } else if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
    
    const isLight = document.body.classList.contains('light-mode');
    updateThemeIcons(isLight);
}

function updateThemeIcons(isLight) {
    const iconLock = document.getElementById('themeIconLock');
    const iconMain = document.getElementById('themeIconMain');
    if (iconLock) iconLock.className = isLight ? 'fas fa-moon text-sm' : 'fas fa-sun text-sm';
    if (iconMain) iconMain.className = isLight ? 'fas fa-moon text-sm' : 'fas fa-sun text-sm';
}

function applyAutoTheme() {
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18; // 6h à 18h = jour
    
    if (isDaytime) {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
    
    updateThemeIcons(isDaytime);
}

function startAutoTheme() {
    stopAutoTheme();
    
    // Vérifier toutes les 5 minutes
    autoThemeInterval = setInterval(() => {
        applyAutoTheme();
    }, 5 * 60 * 1000);
}

function stopAutoTheme() {
    if (autoThemeInterval) {
        clearInterval(autoThemeInterval);
        autoThemeInterval = null;
    }
}

function toggleAutoTheme() {
    autoThemeEnabled = !autoThemeEnabled;
    localStorage.setItem('remal_auto_theme', autoThemeEnabled ? 'on' : 'off');
    
    if (autoThemeEnabled) {
        applyAutoTheme();
        startAutoTheme();
        showToast('🌓 Thème automatique activé', 'success');
    } else {
        stopAutoTheme();
        showToast('Thème automatique désactivé', 'info');
    }
}

function showAutoThemeToast() {
    const isLight = document.body.classList.contains('light-mode');
    const themeName = isLight ? 'clair ☀️' : 'sombre 🌙';
    showToast(`Thème ${themeName} activé`, 'success');
}

// Vérifier le thème à chaque chargement de page
document.addEventListener('DOMContentLoaded', () => {
    if (autoThemeEnabled) {
        applyAutoTheme();
    }
});
