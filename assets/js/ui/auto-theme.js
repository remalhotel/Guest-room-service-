// ==================== AUTO THEME JOUR/NUIT ====================
let autoThemeInterval = null;

function initAutoTheme() {
    // Vérifier si le mode auto est activé
    const autoEnabled = localStorage.getItem('remal_auto_theme') === 'on';
    if (!autoEnabled) return;
    
    applyAutoTheme();
    
    // Vérifier toutes les 5 minutes
    autoThemeInterval = setInterval(applyAutoTheme, 5 * 60 * 1000);
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
    renderAutoThemeIndicator();
}

function updateThemeIcons(isLight) {
    const iconLock = document.getElementById('themeIconLock');
    const iconMain = document.getElementById('themeIconMain');
    if (iconLock) iconLock.className = isLight ? 'fas fa-moon text-sm' : 'fas fa-sun text-sm';
    if (iconMain) iconMain.className = isLight ? 'fas fa-moon text-sm' : 'fas fa-sun text-sm';
}

function toggleAutoTheme() {
    const autoEnabled = localStorage.getItem('remal_auto_theme') === 'on';
    
    if (autoEnabled) {
        localStorage.setItem('remal_auto_theme', 'off');
        if (autoThemeInterval) { clearInterval(autoThemeInterval); autoThemeInterval = null; }
        showToast('Auto theme disabled', 'info');
    } else {
        localStorage.setItem('remal_auto_theme', 'on');
        applyAutoTheme();
        autoThemeInterval = setInterval(applyAutoTheme, 5 * 60 * 1000);
        showToast('🌓 Auto theme enabled!', 'success');
    }
}

function renderAutoThemeIndicator() {
    const container = document.getElementById('themeIndicatorContainer');
    if (!container) return;
    
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;
    const isLight = document.body.classList.contains('light-mode');
    
    container.innerHTML = `
        <span style="font-size:9px; font-weight:bold; color:${isLight ? '#f59e0b' : '#8b5cf6'};">
            ${isDaytime ? '☀️ Day Mode' : '🌙 Night Mode'} ${localStorage.getItem('remal_auto_theme') === 'on' ? '(Auto)' : ''}
        </span>
    `;
}

window.initAutoTheme = initAutoTheme;
window.applyAutoTheme = applyAutoTheme;
window.toggleAutoTheme = toggleAutoTheme;
window.renderAutoThemeIndicator = renderAutoThemeIndicator;
