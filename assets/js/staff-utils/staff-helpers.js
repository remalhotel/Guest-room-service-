// ==================== STAFF UTILITY FUNCTIONS ====================
function getTimeAgo(timestamp) {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const then = new Date(timestamp);
    
    // Vérifier si la date est valide
    if (isNaN(then.getTime())) return 'Just now';
    
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    const diffWeeks = Math.floor(diffDays / 7);
    return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
}

function showToast(msg, type = 'info') {
    const t = document.createElement('div');
    t.className = 'toast-notification toast-in';
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    t.innerHTML = `<span>${icon}</span><span class="text-xs font-bold text-stone-100">${msg}</span>`;
    document.body.appendChild(t);
    setTimeout(() => {
        t.style.opacity = '0';
        t.style.transition = 'opacity 0.3s ease';
        setTimeout(() => t.remove(), 300);
    }, 3000);
}

function updateDateTimeDisplay() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
    };
    const dateTimeStr = now.toLocaleString(undefined, options);
    const displayEl = document.getElementById('currentDateTimeDisplay');
    if (displayEl) displayEl.innerText = '🕒 ' + dateTimeStr;
}

function getStatusColor(status) {
    const statusColors = {
        'Pending': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        'Preparing': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'In Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'Ready': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        'Delivered': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        'Completed': 'bg-green-500/20 text-green-400 border-green-500/30',
        'Cancelled': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return statusColors[status] || statusColors['Pending'];
}

function formatCurrency(amount) {
    return 'AED ' + parseFloat(amount || 0).toFixed(2);
}

function truncateString(str, maxLength = 20) {
    if (!str) return '';
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}

function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function debounce(func, wait) {
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

function generateUniqueId() {
    return 'staff_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
