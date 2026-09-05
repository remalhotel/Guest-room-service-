// ==================== CHAT UI FUNCTIONS ====================
function openGuestChatModal() {
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    const guestName = cachedGuestData?.guest_name || 'Guest';
    
    if (!room) {
        showToast("Veuillez d'abord vérifier votre chambre", "error");
        return;
    }
    
    document.getElementById('guestChatModal').classList.remove('hidden');
    
    if (!guestChatManager) {
        guestChatManager = new GuestChatManager(supabaseClient, room, guestName);
        guestChatManager.init();
    } else {
        guestChatManager.render();
    }
    
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
