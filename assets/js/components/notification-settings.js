// ==================== PRÉFÉRENCES DE NOTIFICATION ====================
let notificationPreferences = null;

function initNotificationSettings() {
    loadNotificationPreferences();
    renderNotificationSettingsButton();
}

function loadNotificationPreferences() {
    try {
        notificationPreferences = JSON.parse(localStorage.getItem('remal_notification_prefs') || 'null');
    } catch (e) {
        notificationPreferences = null;
    }
    
    if (!notificationPreferences) {
        notificationPreferences = {
            order_updates: true,
            request_updates: true,
            chat_messages: true,
            offers: true,
            check_out_reminders: true,
            billing: true,
            feedback_prompts: true,
            sound_enabled: true,
            desktop_notifications: true
        };
    }
}

function saveNotificationPreferences() {
    localStorage.setItem('remal_notification_prefs', JSON.stringify(notificationPreferences));
}

function renderNotificationSettingsButton() {
    const container = document.getElementById('notificationSettingsButtonContainer');
    if (!container) return;
    
    container.innerHTML = `
        <button onclick="showNotificationSettingsModal()" class="w-full p-3 bg-stone-950/60 border border-amber-500/20 rounded-2xl hover:border-amber-500/50 transition">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-stone-800 text-amber-400 flex items-center justify-center">
                    <i class="fas fa-bell"></i>
                </div>
                <div class="text-left flex-1">
                    <p class="font-bold text-stone-100 text-xs">Notification Settings</p>
                    <p class="text-[9px] text-stone-400">Manage your notifications</p>
                </div>
                <i class="fas fa-chevron-right text-stone-400 text-xs"></i>
            </div>
        </button>
    `;
}

function showNotificationSettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 z-[850] flex items-center justify-center p-4 backdrop-blur-sm';
    modal.id = 'notificationSettingsModal';
    
    const prefs = notificationPreferences;
    
    modal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center border-b border-stone-800 pb-3">
                <h3 class="text-xs font-serif-luxury font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-widest">
                    🔔 Notification Settings
                </h3>
                <button onclick="closeNotificationSettings()" class="text-stone-400 hover:text-stone-100 text-xl font-bold">✕</button>
            </div>
            
            <div class="space-y-3">
                ${renderNotificationToggle('order_updates', '🛎️ Order Updates', 'Get notified when your order status changes', prefs.order_updates)}
                ${renderNotificationToggle('request_updates', '📋 Request Updates', 'Get notified when your service requests are updated', prefs.request_updates)}
                ${renderNotificationToggle('chat_messages', '💬 Chat Messages', 'Get notified when staff sends you a message', prefs.chat_messages)}
                ${renderNotificationToggle('offers', '🎁 Special Offers', 'Get notified about new offers', prefs.offers)}
                ${renderNotificationToggle('check_out_reminders', '🏨 Check-out Reminders', 'Get reminders before your check-out', prefs.check_out_reminders)}
                ${renderNotificationToggle('billing', '💳 Billing Updates', 'Get notified about new bill items', prefs.billing)}
                ${renderNotificationToggle('feedback_prompts', '⭐ Feedback Prompts', 'Get asked to rate your experience', prefs.feedback_prompts)}
                
                <div class="border-t border-stone-800 pt-3">
                    <p class="text-[10px] font-bold text-[var(--text-gold,#DCA773)] uppercase mb-2">General Settings</p>
                    ${renderNotificationToggle('sound_enabled', '🔊 Sound', 'Play sounds for notifications', prefs.sound_enabled)}
                    ${renderNotificationToggle('desktop_notifications', '🖥️ Desktop Notifications', 'Show browser notifications', prefs.desktop_notifications)}
                </div>
                
                <button onclick="saveNotificationSettingsAndClose()" class="w-full bg-[#DCA773] hover:bg-[#ebd0b3] text-stone-950 font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition">
                    Save Settings
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function renderNotificationToggle(key, label, description, isEnabled) {
    return `
        <div class="p-3 bg-stone-950/60 border border-stone-800 rounded-2xl">
            <div class="flex items-center justify-between">
                <div class="flex-1">
                    <p class="font-bold text-stone-100 text-xs">${label}</p>
                    <p class="text-[9px] text-stone-400 mt-0.5">${description}</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer ml-3">
                    <input type="checkbox" id="notif_${key}" ${isEnabled ? 'checked' : ''} onchange="toggleNotificationPref('${key}')" class="sr-only peer">
                    <div class="w-9 h-5 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
                </label>
            </div>
        </div>
    `;
}

function toggleNotificationPref(key) {
    notificationPreferences[key] = !notificationPreferences[key];
    saveNotificationPreferences();
}

function closeNotificationSettings() {
    const modal = document.getElementById('notificationSettingsModal');
    if (modal) modal.remove();
}

function saveNotificationSettingsAndClose() {
    saveNotificationPreferences();
    closeNotificationSettings();
    showToast('✅ Notification settings saved!', 'success');
}

function shouldNotify(type) {
    return notificationPreferences && notificationPreferences[type] !== false;
}
