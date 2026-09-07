// ==================== STAFF NOTIFICATIONS ====================
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') showToast('✅ Notifications activated!', 'success');
        });
    }
}

function sendBrowserNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body: body, icon: 'logo.png' });
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
}

function enableSoundAlerts() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.resume().then(() => {
            soundEnabled = true;
            playNotificationSound();
            showNotificationPopup('🔊 Sound alerts enabled!');
            const btn = document.getElementById('btnSoundToggle');
            if (btn) {
                btn.className = 'sound-toggle-btn active text-[10px] px-3 py-2 rounded-xl font-bold transition';
                btn.innerText = '🔊 Sound ON';
            }
        });
    } catch (e) {}
}

function playNotificationSound() {
    if (!soundEnabled || !audioContext) return;
    try {
        const osc1 = audioContext.createOscillator();
        const gain1 = audioContext.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, audioContext.currentTime);
        gain1.gain.setValueAtTime(0.4, audioContext.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
        osc1.connect(gain1);
        gain1.connect(audioContext.destination);
        osc1.start();
        osc1.stop(audioContext.currentTime + 0.6);
    } catch (e) {}
}

function showNotificationPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'notification-popup';
    popup.innerHTML = `<div class="icon"><i class="fas fa-bell"></i></div><div><p class="text-xs font-bold text-stone-100">${message}</p><p class="text-[9px] text-stone-400">${new Date().toLocaleTimeString()}</p></div>`;
    document.body.appendChild(popup);
    popup.classList.add('shake-alert');
    setTimeout(() => { popup.style.opacity = '0'; popup.style.transition = 'opacity 0.5s ease'; setTimeout(() => popup.remove(), 500); }, 5000);
}

function updateTabTitle(count) {
    const title = document.getElementById('tabTitleNotification');
    if (title) title.innerText = count > 0 ? `🔴 (${count}) Guest Hub Dashboard` : 'Guest Hub Dashboard';
}

function updateTabBadges() {
    const tabs = ['front_desk', 'food_beverage', 'housekeeping', 'maintenance'];
    let totalPending = 0;
    tabs.forEach(tab => {
        const pendingCount = allRequests.filter(r => r.tabCategory === tab && (r.status === 'Pending' || !r.status)).length;
        totalPending += pendingCount;
        const badge = document.getElementById(`badge${tab.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`);
        if (badge) {
            if (pendingCount > 0) { badge.innerText = pendingCount; badge.classList.remove('hidden'); }
            else badge.classList.add('hidden');
        }
    });
    updateTabTitle(totalPending);
}

window.requestNotificationPermission = requestNotificationPermission;
window.sendBrowserNotification = sendBrowserNotification;
window.enableSoundAlerts = enableSoundAlerts;
window.playNotificationSound = playNotificationSound;
window.showNotificationPopup = showNotificationPopup;
window.updateTabBadges = updateTabBadges;
