// ==================== THEME MANAGEMENT ====================
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    const iconLock = document.getElementById('themeIconLock');
    const iconMain = document.getElementById('themeIconMain');
    if (iconLock) iconLock.className = isLight ? 'fas fa-moon text-sm' : 'fas fa-sun text-sm';
    if (iconMain) iconMain.className = isLight ? 'fas fa-moon text-sm' : 'fas fa-sun text-sm';
    localStorage.setItem('remal_theme', isLight ? 'light' : 'dark');
}

function initTheme() {
    const savedTheme = localStorage.getItem('remal_theme');
    if (savedTheme === 'light') document.body.classList.add('light-mode');
    else document.body.classList.remove('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    const iconLock = document.getElementById('themeIconLock');
    const iconMain = document.getElementById('themeIconMain');
    if (iconLock) iconLock.className = isLight ? 'fas fa-moon text-sm' : 'fas fa-sun text-sm';
    if (iconMain) iconMain.className = isLight ? 'fas fa-moon text-sm' : 'fas fa-sun text-sm';
}
