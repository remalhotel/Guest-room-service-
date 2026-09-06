// ==================== RACCOURCIS CLAVIER ====================
let keyboardShortcutsEnabled = true;

const KEYBOARD_SHORTCUTS = {
    '1': { action: 'services', description: 'Go to Services' },
    '2': { action: 'offers', description: 'Go to Offers' },
    '3': { action: 'favorites', description: 'Go to Favorites' },
    '4': { action: 'history', description: 'Go to History' },
    '5': { action: 'faq', description: 'Go to FAQ' },
    'c': { action: 'chat', description: 'Open Chat' },
    'm': { action: 'menu', description: 'Open Menu' },
    'r': { action: 'reminders', description: 'Open Reminders' },
    't': { action: 'theme', description: 'Toggle Theme' },
    'l': { action: 'language', description: 'Change Language' },
    '?': { action: 'help', description: 'Show Shortcuts' }
};

function initKeyboardShortcuts() {
    document.addEventListener('keydown', handleKeyPress);
    showKeyboardHint();
}

function handleKeyPress(event) {
    // Ignorer si on tape dans un champ
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
        return;
    }
    
    if (!keyboardShortcutsEnabled) return;
    
    // Ne pas intercepter les combinaisons avec Ctrl/Cmd/Alt
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    
    const key = event.key.toLowerCase();
    const shortcut = KEYBOARD_SHORTCUTS[key];
    
    if (shortcut) {
        event.preventDefault();
        executeShortcut(shortcut.action);
    }
}

function executeShortcut(action) {
    switch(action) {
        case 'services':
            switchTab('services');
            showToast('📋 Services', 'info');
            break;
        case 'offers':
            switchTab('offers');
            showToast('🎁 Offers', 'info');
            break;
        case 'favorites':
            showFavorites();
            showToast('❤️ Favorites', 'info');
            break;
        case 'history':
            showOrderHistory();
            showToast('📜 History', 'info');
            break;
        case 'faq':
            switchTab('faq');
            showToast('❓ FAQ', 'info');
            break;
        case 'chat':
            openGuestChatModal();
            break;
        case 'menu':
            openMenuModal();
            break;
        case 'reminders':
            showRemindersModal();
            break;
        case 'theme':
            toggleTheme();
            break;
        case 'language':
            cycleLanguage();
            break;
        case 'help':
            showShortcutsModal();
            break;
    }
}

function cycleLanguage() {
    const languages = ['en', 'fr', 'ar', 'hi'];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
    showToast(`🌐 Language: ${languages[nextIndex].toUpperCase()}`, 'info');
}

function showKeyboardHint() {
    const hint = document.createElement('div');
    hint.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 bg-stone-900/80 border border-stone-700 px-3 py-1.5 rounded-full text-[8px] text-stone-400 backdrop-blur-md';
    hint.id = 'keyboardHint';
    hint.innerHTML = 'Press <span class="text-amber-400 font-bold">?</span> for shortcuts';
    
    document.body.appendChild(hint);
    
    setTimeout(() => {
        hint.style.opacity = '0';
        hint.style.transition = 'opacity 1s ease';
        setTimeout(() => hint.remove(), 1000);
    }, 5000);
}

function showShortcutsModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm';
    modal.id = 'shortcutsModal';
    
    modal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl">
            <div class="flex justify-between items-center border-b border-stone-800 pb-3">
                <h3 class="text-xs font-serif-luxury font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-widest">
                    ⌨️ Keyboard Shortcuts
                </h3>
                <button onclick="closeShortcutsModal()" class="text-stone-400 hover:text-stone-100 text-xl font-bold">✕</button>
            </div>
            
            <div class="space-y-2">
                ${Object.entries(KEYBOARD_SHORTCUTS).map(([key, shortcut]) => `
                    <div class="flex justify-between items-center p-2 bg-stone-950/60 border border-stone-800 rounded-xl">
                        <span class="text-[10px] text-stone-400">${shortcut.description}</span>
                        <span class="bg-stone-800 text-amber-400 font-bold px-2.5 py-1 rounded-lg text-[10px]">${key.toUpperCase()}</span>
                    </div>
                `).join('')}
            </div>
            
            <button onclick="toggleKeyboardShortcuts()" class="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold py-3 rounded-2xl text-xs uppercase tracking-widest transition">
                ${keyboardShortcutsEnabled ? 'Disable Shortcuts' : 'Enable Shortcuts'}
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeShortcutsModal() {
    const modal = document.getElementById('shortcutsModal');
    if (modal) modal.remove();
}

function toggleKeyboardShortcuts() {
    keyboardShortcutsEnabled = !keyboardShortcutsEnabled;
    showToast(keyboardShortcutsEnabled ? '⌨️ Shortcuts enabled' : 'Shortcuts disabled', 'info');
    closeShortcutsModal();
}
