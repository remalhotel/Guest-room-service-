// ==================== THEME MANAGEMENT AVEC DÉTECTION AUTO ====================
let autoThemeEnabled = localStorage.getItem('remal_auto_theme') === 'on';
let autoThemeInterval = null;
let nightModeEnabled = false;
let sunsetHour = 18;
let sunriseHour = 6;

function toggleTheme() {
    if (autoThemeEnabled) {
        autoThemeEnabled = false;
        localStorage.setItem('remal_auto_theme', 'off');
        stopAutoTheme();
    }
    
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    updateThemeIcons(isLight);
    localStorage.setItem('remal_theme', isLight ? 'light' : 'dark');
    
    showThemeToast(isLight ? 'Light mode activated ☀️' : 'Dark mode activated 🌙');
}

function initTheme() {
    const savedTheme = localStorage.getItem('remal_theme');
    const savedAutoTheme = localStorage.getItem('remal_auto_theme');
    const savedNightMode = localStorage.getItem('remal_night_mode');
    
    autoThemeEnabled = savedAutoTheme === 'on';
    nightModeEnabled = savedNightMode === 'on';
    
    if (autoThemeEnabled) {
        applyAutoTheme();
        startAutoTheme();
    } else if (nightModeEnabled) {
        // Mode nuit forcé
        document.body.classList.remove('light-mode');
    } else if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
    
    const isLight = document.body.classList.contains('light-mode');
    updateThemeIcons(isLight);
    renderThemeIndicator();
}

function updateThemeIcons(isLight) {
    const iconLock = document.getElementById('themeIconLock');
    const iconMain = document.getElementById('themeIconMain');
    if (iconLock) iconLock.className = isLight ? 'fas fa-moon text-sm' : 'fas fa-sun text-sm';
    if (iconMain) iconMain.className = isLight ? 'fas fa-moon text-sm' : 'fas fa-sun text-sm';
}

function applyAutoTheme() {
    const hour = new Date().getHours();
    const isDaytime = hour >= sunriseHour && hour < sunsetHour;
    
    if (isDaytime) {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
    
    updateThemeIcons(isDaytime);
    renderThemeIndicator();
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
        showToast('🌓 Auto theme activated', 'success');
    } else {
        stopAutoTheme();
        showToast('Auto theme deactivated', 'info');
    }
}

function toggleNightMode() {
    nightModeEnabled = !nightModeEnabled;
    localStorage.setItem('remal_night_mode', nightModeEnabled ? 'on' : 'off');
    
    if (nightModeEnabled) {
        autoThemeEnabled = false;
        localStorage.setItem('remal_auto_theme', 'off');
        stopAutoTheme();
        document.body.classList.remove('light-mode');
        updateThemeIcons(false);
        showToast('🌙 Night mode activated', 'success');
    } else {
        if (autoThemeEnabled) {
            applyAutoTheme();
        } else {
            document.body.classList.add('light-mode');
            updateThemeIcons(true);
        }
        showToast('Night mode deactivated', 'info');
    }
    
    renderThemeIndicator();
}

function renderThemeIndicator() {
    const container = document.getElementById('themeIndicatorContainer');
    if (!container) return;
    
    const hour = new Date().getHours();
    const isDaytime = hour >= sunriseHour && hour < sunsetHour;
    const isLight = document.body.classList.contains('light-mode');
    
    container.innerHTML = `
        <span class="inline-flex items-center gap-1.5 text-[9px] font-bold ${isLight ? 'text-amber-400' : 'text-purple-400'}">
            <i class="fas ${isLight ? 'fa-sun' : 'fa-moon'}"></i>
            ${autoThemeEnabled ? 'Auto Theme' : nightModeEnabled ? 'Night Mode' : isLight ? 'Light Mode' : 'Dark Mode'}
        </span>
    `;
}

function showThemeToast(message) {
    showToast(message, 'info');
}

function getThemeStatus() {
    const isLight = document.body.classList.contains('light-mode');
    return {
        mode: isLight ? 'light' : 'dark',
        autoEnabled: autoThemeEnabled,
        nightModeEnabled: nightModeEnabled,
        currentHour: new Date().getHours(),
        isDaytime: new Date().getHours() >= sunriseHour && new Date().getHours() < sunsetHour
    };
}

// Vérifier le thème à chaque chargement
document.addEventListener('DOMContentLoaded', () => {
    if (autoThemeEnabled) {
        applyAutoTheme();
    }
    renderThemeIndicator();
});
