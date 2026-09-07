// ==================== STAFF HELPERS ====================
function showToast(msg, type = 'info') {
    const t = document.createElement('div');
    t.className = 'toast-notification toast-in';
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    t.innerHTML = `<span>${icon}</span><span class="text-xs font-bold text-stone-100">${msg}</span>`;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3000);
}

function getTimeAgo(timestamp) {
    if (!timestamp) return 'Just now';
    const diffMins = Math.floor((new Date() - new Date(timestamp)) / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) > 1 ? 's' : ''} ago`;
}

function updateDateTimeDisplay() {
    const now = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Dubai' };
    const el = document.getElementById('currentDateTimeDisplay');
    if (el) el.innerText = '🕒 ' + now.toLocaleString('en-US', options);
}

window.showToast = showToast;
window.getTimeAgo = getTimeAgo;
window.updateDateTimeDisplay = updateDateTimeDisplay;
