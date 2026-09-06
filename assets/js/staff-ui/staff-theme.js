// ==================== STAFF THEME MANAGEMENT ====================
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    
    const icon = document.getElementById('themeIconStaff');
    if (icon) {
        icon.className = isLight ? 'fas fa-moon text-sm' : 'fas fa-sun text-sm';
    }
    
    localStorage.setItem('remal_theme', isLight ? 'light' : 'dark');
}

function initTheme() {
    const saved = localStorage.getItem('remal_theme');
    if (saved === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
    
    const isLight = document.body.classList.contains('light-mode');
    const icon = document.getElementById('themeIconStaff');
    if (icon) {
        icon.className = isLight ? 'fas fa-moon text-sm' : 'fas fa-sun text-sm';
    }
}
