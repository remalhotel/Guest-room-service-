// ==================== CHAT UI FUNCTIONS ====================
function openGuestChatModal() {
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    const guestName = cachedGuestData?.guest_name || 'Guest';
    
    if (!room) {
        const noRoomTexts = {
            en: 'Please verify your room first',
            fr: 'Veuillez d\'abord vérifier votre chambre',
            ar: 'يرجى التحقق من غرفتك أولاً',
            hi: 'कृपया पहले अपना कमरा सत्यापित करें'
        };
        const lang = typeof currentLanguage !== 'undefined' ? currentLanguage : 'en';
        showToast(noRoomTexts[lang] || noRoomTexts.en, 'error');
        return;
    }
    
    document.getElementById('guestChatModal').classList.remove('hidden');
    
    if (!guestChatManager) {
        guestChatManager = new GuestChatManager(supabaseClient, room, guestName);
        guestChatManager.init();
    } else {
        guestChatManager.render();
    }
    
    // Mettre à jour les textes selon la langue
    updateChatLanguage();
    
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function closeGuestChatModal() {
    document.getElementById('guestChatModal').classList.add('hidden');
}

function toggleChatSound() {
    if (guestChatManager) {
        guestChatManager.soundEnabled = !guestChatManager.soundEnabled;
        localStorage.setItem('remal_chat_sound', guestChatManager.soundEnabled ? 'on' : 'off');
        const soundToggle = document.getElementById('chatSoundToggle');
        if (soundToggle) {
            soundToggle.textContent = guestChatManager.soundEnabled ? '🔊' : '🔇';
        }
    }
}

async function sendGuestChatMessage() {
    const input = document.getElementById('guestChatInput');
    const message = input.value.trim();
    
    if (!message || !guestChatManager) return;
    
    const sent = await guestChatManager.sendMessage(message);
    if (sent) {
        input.value = '';
        input.focus();
    }
}
