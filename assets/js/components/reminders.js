// ==================== REMINDERS ====================
let activeReminders = JSON.parse(localStorage.getItem('remal_reminders') || '[]');

function showRemindersModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 z-[400] flex items-center justify-center p-4';
    modal.id = 'remindersModal';
    
    modal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-sm rounded-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div class="flex justify-between border-b border-stone-800 pb-3">
                <h3 class="text-xs font-bold text-[var(--text-gold,#DCA773)]">⏰ My Reminders</h3>
                <button onclick="closeRemindersModal()" class="text-stone-400">✕</button>
            </div>
            
            <div id="remindersList" class="space-y-2"></div>
            
            <div class="space-y-2 border-t border-stone-800 pt-3">
                <input type="text" id="reminderTitle" placeholder="Reminder title..." class="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100">
                <input type="datetime-local" id="reminderTime" class="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100">
                <button onclick="addReminder()" class="w-full bg-[#DCA773] text-stone-950 font-bold py-3 rounded-xl text-xs">Add Reminder</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    renderReminders();
}

function closeRemindersModal() {
    document.getElementById('remindersModal')?.remove();
}

function addReminder() {
    const title = document.getElementById('reminderTitle').value.trim();
    const time = document.getElementById('reminderTime').value;
    
    if (!title || !time) { showToast('Fill all fields', 'error'); return; }
    
    activeReminders.push({
        id: Date.now(),
        title: title,
        time: time,
        created_at: new Date().toISOString()
    });
    
    localStorage.setItem('remal_reminders', JSON.stringify(activeReminders));
    closeRemindersModal();
    showToast('⏰ Reminder set!', 'success');
}

function renderReminders() {
    const container = document.getElementById('remindersList');
    if (!container) return;
    
    if (activeReminders.length === 0) {
        container.innerHTML = '<p class="text-center text-stone-400 text-xs py-4">No reminders</p>';
        return;
    }
    
    container.innerHTML = activeReminders.map(r => `
        <div class="flex justify-between items-center p-2.5 bg-stone-950/60 border border-stone-800 rounded-xl">
            <div>
                <p class="text-xs font-bold text-stone-100">${r.title}</p>
                <p class="text-[9px] text-stone-400">${new Date(r.time).toLocaleString()}</p>
            </div>
            <button onclick="deleteReminder('${r.id}')" class="text-red-400 text-xs">🗑️</button>
        </div>
    `).join('');
}

function deleteReminder(id) {
    activeReminders = activeReminders.filter(r => r.id != id);
    localStorage.setItem('remal_reminders', JSON.stringify(activeReminders));
    renderReminders();
}

// Exposer
window.showRemindersModal = showRemindersModal;
window.closeRemindersModal = closeRemindersModal;
window.addReminder = addReminder;
window.deleteReminder = deleteReminder;
window.renderReminders = renderReminders;
