// ==================== CHAT UI FUNCTIONS ====================
const QUICK_REPLIES = [
    { icon: '🧹', text: 'Please clean my room', type: 'housekeeping' },
    { icon: '🧴', text: 'Need more toiletries', type: 'amenities' },
    { icon: '🍽️', text: 'Restaurant recommendations', type: 'dining' },
    { icon: '🚕', text: 'Book a taxi', type: 'transport' },
    { icon: '🧊', text: 'Need ice bucket', type: 'amenities' },
    { icon: '💧', text: 'Need extra water bottles', type: 'amenities' },
    { icon: '🔑', text: 'Lost my room key', type: 'help' },
    { icon: '📶', text: 'Wi-Fi not working', type: 'technical' },
    { icon: '🅿️', text: 'Parking information', type: 'info' },
    { icon: '⏰', text: 'Wake-up call request', type: 'service' },
    { icon: '🧳', text: 'Luggage storage', type: 'service' },
    { icon: '🏊', text: 'Pool hours', type: 'info' }
];

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
    
    // Afficher les réponses rapides
    renderQuickReplies();
    
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
        hideQuickReplies();
    }
}

async function sendQuickReply(text) {
    if (!guestChatManager) return;
    
    const sent = await guestChatManager.sendMessage(text);
    if (sent) {
        hideQuickReplies();
        showToast('Message sent ✅', 'success');
    }
}

function renderQuickReplies() {
    const container = document.getElementById('quickRepliesContainer');
    if (!container) return;
    
    container.classList.remove('hidden');
    
    container.innerHTML = `
        <div class="border-t border-stone-800 pt-2">
            <p class="text-[8px] text-stone-500 uppercase font-bold mb-1.5">Quick Replies</p>
            <div class="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                ${QUICK_REPLIES.map(qr => `
                    <button onclick="sendQuickReply('${qr.text.replace(/'/g, "\\'")}')" class="flex-shrink-0 bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1.5 rounded-full text-[9px] font-bold transition whitespace-nowrap">
                        ${qr.icon} ${qr.text}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function hideQuickReplies() {
    const container = document.getElementById('quickRepliesContainer');
    if (container) {
        container.classList.add('hidden');
        container.innerHTML = '';
    }
}

function showQuickReplies() {
    renderQuickReplies();
}
