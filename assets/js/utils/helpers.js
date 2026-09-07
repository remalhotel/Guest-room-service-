// ==================== UTILITY FUNCTIONS ====================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast-notification toast-in';
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span><span class="text-xs font-bold text-stone-100">${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => { 
        toast.style.opacity = '0'; 
        toast.style.transition = 'opacity 0.3s ease'; 
        setTimeout(() => toast.remove(), 300); 
    }, 3000);
}

function getGreeting() {
    // Utiliser l'heure de Dubaï (UTC+4)
    const dubaiTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' }));
    const hour = dubaiTime.getHours();
    if (hour < 12) return { text: 'Good Morning', emoji: '🌅' };
    if (hour < 18) return { text: 'Good Afternoon', emoji: '☀️' };
    return { text: 'Good Evening', emoji: '🌙' };
}

function getTimeAgo(timestamp) {
    if (!timestamp) return 'Just now';
    const now = new Date();
    const then = new Date(timestamp);
    const diffMins = Math.floor((now - then) / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

function getBadgeHTML(badges) {
    if (!badges || !Array.isArray(badges)) return '';
    return badges.map(b => `<span class="inline-block text-[8px] bg-stone-800 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider mr-1">${b}</span>`).join('');
}

// ==================== HEURE DE DUBAÏ ====================
function getDubaiTime() {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' }));
}

function formatDubaiTime(date) {
    return date.toLocaleTimeString('en-US', { 
        timeZone: 'Asia/Dubai', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
}

function formatDubaiDate(date) {
    return date.toLocaleDateString('en-US', { 
        timeZone: 'Asia/Dubai',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}
