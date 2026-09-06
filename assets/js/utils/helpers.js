// ==================== UTILITY FUNCTIONS ====================
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', emoji: '🌅' };
    if (hour < 18) return { text: 'Good Afternoon', emoji: '☀️' };
    return { text: 'Good Evening', emoji: '🌙' };
}

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

function getBadgeHTML(badges) {
    if (!badges || !Array.isArray(badges)) return '';
    return badges.map(b => `<span class="inline-block text-[8px] bg-stone-800 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider mr-1">${b}</span>`).join('');
}
