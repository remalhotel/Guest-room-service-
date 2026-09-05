// ==================== SYSTÈME DE RAPPELS ====================
let reminderInterval = null;
let activeReminders = [];

function initReminders() {
    loadReminders();
    startReminderCheck();
}

function loadReminders() {
    try {
        activeReminders = JSON.parse(localStorage.getItem('remal_reminders') || '[]');
    } catch (e) {
        activeReminders = [];
    }
}

function saveReminders() {
    localStorage.setItem('remal_reminders', JSON.stringify(activeReminders));
}

function addReminder(type, title, time, notes = '') {
    const reminder = {
        id: `reminder_${Date.now()}`,
        type: type, // 'wakeup', 'reservation', 'checkout', 'custom'
        title: title,
        time: time,
        notes: notes,
        created_at: new Date().toISOString(),
        notified: false
    };
    
    activeReminders.push(reminder);
    saveReminders();
    renderReminders();
    
    showToast(`⏰ Reminder set for ${formatReminderTime(time)}`, 'success');
}

function removeReminder(reminderId) {
    activeReminders = activeReminders.filter(r => r.id !== reminderId);
    saveReminders();
    renderReminders();
}

function startReminderCheck() {
    if (reminderInterval) clearInterval(reminderInterval);
    
    // Vérifier toutes les minutes
    reminderInterval = setInterval(() => {
        checkReminders();
    }, 60 * 1000);
}

function checkReminders() {
    const now = new Date();
    const nowTime = now.getTime();
    
    activeReminders.forEach(reminder => {
        if (reminder.notified) return;
        
        const reminderTime = new Date(reminder.time).getTime();
        const timeDiff = reminderTime - nowTime;
        
        // Notifier 15 minutes avant
        if (timeDiff <= 15 * 60 * 1000 && timeDiff > 0) {
            showReminderNotification(reminder);
            reminder.notified = true;
            saveReminders();
        }
        
        // Supprimer les rappels passés
        if (timeDiff < 0) {
            removeReminder(reminder.id);
        }
    });
}

function showReminderNotification(reminder) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 z-[700] flex items-center justify-center p-4 backdrop-blur-sm';
    modal.id = 'reminderModal';
    
    const icons = {
        'wakeup': '⏰',
        'reservation': '🍽️',
        'checkout': '🏨',
        'custom': '📌'
    };
    
    modal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl animate-fade-in-up">
            <div class="text-center">
                <div class="text-5xl mb-3">${icons[reminder.type] || '⏰'}</div>
                <h3 class="text-sm font-serif-luxury font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-widest">
                    Reminder
                </h3>
                <p class="text-xs font-bold text-stone-100 mt-2">${reminder.title}</p>
                <p class="text-[10px] text-stone-400 mt-1">${formatReminderTime(reminder.time)}</p>
                ${reminder.notes ? `<p class="text-[10px] text-stone-400 mt-2">📝 ${reminder.notes}</p>` : ''}
            </div>
            
            <div class="flex gap-2">
                <button onclick="closeReminder()" class="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold py-3 rounded-2xl text-xs uppercase tracking-widest transition">
                    Dismiss
                </button>
                <button onclick="snoozeReminder('${reminder.id}')" class="flex-1 bg-[#DCA773] hover:bg-[#ebd0b3] text-stone-950 font-black py-3 rounded-2xl text-xs uppercase tracking-widest transition">
                    Snooze 5 min
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    playReminderSound();
}

function closeReminder() {
    const modal = document.getElementById('reminderModal');
    if (modal) modal.remove();
}

function snoozeReminder(reminderId) {
    const reminder = activeReminders.find(r => r.id === reminderId);
    if (reminder) {
        const newTime = new Date(Date.now() + 5 * 60 * 1000).toISOString();
        reminder.time = newTime;
        reminder.notified = false;
        saveReminders();
    }
    closeReminder();
    showToast('Reminder snoozed for 5 minutes', 'info');
}

function playReminderSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [660, 880, 990];
        
        notes.forEach((frequency, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + index * 0.15);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + index * 0.15);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.15 + 0.4);
            
            oscillator.start(audioContext.currentTime + index * 0.15);
            oscillator.stop(audioContext.currentTime + index * 0.15 + 0.4);
        });
    } catch (error) {
        console.warn('Sound not available:', error);
    }
}

function formatReminderTime(time) {
    const date = new Date(time);
    return date.toLocaleString([], { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function renderReminders() {
    const container = document.getElementById('remindersContainer');
    if (!container) return;
    
    if (activeReminders.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-bell-slash text-2xl text-stone-600 mb-2"></i>
                <p class="text-[10px] text-stone-400">No active reminders</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = activeReminders.map(reminder => {
        const icons = {
            'wakeup': '⏰',
            'reservation': '🍽️',
            'checkout': '🏨',
            'custom': '📌'
        };
        
        return `
            <div class="flex justify-between items-center p-3 bg-stone-950/60 border border-stone-800 rounded-xl">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">${icons[reminder.type] || '⏰'}</span>
                    <div>
                        <p class="font-bold text-stone-100 text-xs">${reminder.title}</p>
                        <p class="text-[9px] text-stone-400">${formatReminderTime(reminder.time)}</p>
                    </div>
                </div>
                <button onclick="removeReminder('${reminder.id}')" class="text-red-400 hover:text-red-300">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');
}

function showRemindersModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 z-[650] flex items-center justify-center p-4 backdrop-blur-sm';
    modal.id = 'remindersListModal';
    
    modal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl">
            <div class="flex justify-between items-center border-b border-stone-800 pb-3">
                <h3 class="text-xs font-serif-luxury font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-widest">
                    ⏰ My Reminders
                </h3>
                <button onclick="closeRemindersModal()" class="text-stone-400 hover:text-stone-100 text-xl font-bold">✕</button>
            </div>
            
            <div id="remindersContainer" class="space-y-2 max-h-60 overflow-y-auto"></div>
            
            <button onclick="showAddReminderForm()" class="w-full bg-[#DCA773] hover:bg-[#ebd0b3] text-stone-950 font-black py-3 rounded-2xl text-xs uppercase tracking-widest transition">
                <i class="fas fa-plus mr-1"></i> Add Reminder
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    renderReminders();
}

function closeRemindersModal() {
    const modal = document.getElementById('remindersListModal');
    if (modal) modal.remove();
}

function showAddReminderForm() {
    const container = document.getElementById('remindersContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="space-y-3">
            <div>
                <label class="block font-bold text-[var(--text-gold,#DCA773)] mb-1 text-[10px] uppercase">Title</label>
                <input type="text" id="reminderTitle" placeholder="e.g., Dinner reservation" class="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200">
            </div>
            <div>
                <label class="block font-bold text-[var(--text-gold,#DCA773)] mb-1 text-[10px] uppercase">Type</label>
                <select id="reminderType" class="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200">
                    <option value="wakeup">⏰ Wake-up</option>
                    <option value="reservation">🍽️ Reservation</option>
                    <option value="checkout">🏨 Check-out</option>
                    <option value="custom">📌 Custom</option>
                </select>
            </div>
            <div>
                <label class="block font-bold text-[var(--text-gold,#DCA773)] mb-1 text-[10px] uppercase">Date & Time</label>
                <input type="datetime-local" id="reminderTime" class="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200">
            </div>
            <div>
                <label class="block font-bold text-[var(--text-gold,#DCA773)] mb-1 text-[10px] uppercase">Notes</label>
                <input type="text" id="reminderNotes" placeholder="Optional notes..." class="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200">
            </div>
            <button onclick="saveNewReminder()" class="w-full bg-[#DCA773] hover:bg-[#ebd0b3] text-stone-950 font-black py-3 rounded-xl text-xs uppercase tracking-widest transition">
                Save Reminder
            </button>
        </div>
    `;
}

function saveNewReminder() {
    const title = document.getElementById('reminderTitle')?.value?.trim();
    const type = document.getElementById('reminderType')?.value;
    const time = document.getElementById('reminderTime')?.value;
    const notes = document.getElementById('reminderNotes')?.value?.trim();
    
    if (!title || !time) {
        showToast('Please fill in title and time', 'error');
        return;
    }
    
    addReminder(type, title, new Date(time).toISOString(), notes);
    closeRemindersModal();
}
