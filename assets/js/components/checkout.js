// ==================== CHECKOUT COUNTDOWN ====================
function initCheckoutCountdown() {
    const departure = cachedGuestData?.departure || localStorage.getItem('remal_departure');
    if (!departure) return;
    updateCheckoutCountdown();
    setInterval(updateCheckoutCountdown, 60 * 60 * 1000); // Toutes les heures
}

function updateCheckoutCountdown() {
    const container = document.getElementById('checkoutCountdown');
    if (!container) return;
    
    const departure = cachedGuestData?.departure || localStorage.getItem('remal_departure');
    if (!departure) return;
    
    const departureDate = new Date(departure);
    const now = new Date();
    const diffMs = departureDate.getTime() - now.getTime();
    
    if (diffMs <= 0) {
        container.innerHTML = `
            <div class="p-3 rounded-2xl border" style="background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3);">
                <p style="font-size:10px; color:#ef4444; font-weight:bold;">⚠️ Check-out time passed</p>
            </div>
        `;
        return;
    }
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    let message = '';
    let bgColor = 'rgba(220,167,115,0.1)';
    let borderColor = 'rgba(220,167,115,0.3)';
    let textColor = '#DCA773';
    
    if (days > 1) {
        message = `${days} days until check-out`;
    } else if (days === 1) {
        message = `1 day and ${hours}h until check-out`;
    } else if (hours > 6) {
        message = `${hours} hours until check-out`;
        bgColor = 'rgba(245,158,11,0.1)';
        borderColor = 'rgba(245,158,11,0.3)';
        textColor = '#f59e0b';
    } else {
        message = `Only ${hours}h until check-out!`;
        bgColor = 'rgba(239,68,68,0.1)';
        borderColor = 'rgba(239,68,68,0.3)';
        textColor = '#ef4444';
    }
    
    container.innerHTML = `
        <div class="p-3 rounded-2xl border" style="background: ${bgColor}; border-color: ${borderColor};">
            <p style="font-size:10px; color:${textColor}; font-weight:bold;">
                ⏰ ${message}
            </p>
        </div>
    `;
}

// Exposer
window.initCheckoutCountdown = initCheckoutCountdown;
window.updateCheckoutCountdown = updateCheckoutCountdown;
