// ==================== STAFF CHAT UI ====================
function openChatModal(roomNumber, guestName) {
    if (!staffChatManager) {
        staffChatManager = new StaffChatManager(supabaseClient);
    }
    staffChatManager.openChat(roomNumber, guestName);
}

function closeChatModal() {
    if (staffChatManager) {
        staffChatManager.closeChat();
    }
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;
    
    const message = input.value.trim();
    if (!message || !staffChatManager) return;
    
    input.value = '';
    
    const sent = await staffChatManager.sendMessage(message);
    if (!sent) {
        input.value = message;
    }
}

function toggleChatSound() {
    if (soundEnabled) {
        disableSoundAlerts();
    } else {
        enableSoundAlerts();
    }
}

// ==================== RÉPONSES RAPIDES POUR LE STAFF ====================
const STAFF_QUICK_REPLIES = [
    { icon: '✅', text: 'Your request has been received', type: 'confirmation' },
    { icon: '👨‍🍳', text: 'We are preparing your order now', type: 'preparing' },
    { icon: '🚚', text: 'Your order is on the way', type: 'delivery' },
    { icon: '🧹', text: 'Housekeeping will be there shortly', type: 'housekeeping' },
    { icon: '🔧', text: 'Maintenance is on the way', type: 'maintenance' },
    { icon: '⏰', text: 'Your wake-up call is confirmed', type: 'wakeup' },
    { icon: '🏨', text: 'Your late check-out is approved', type: 'checkout' },
    { icon: '🍽️', text: 'Your table is reserved', type: 'reservation' },
    { icon: '🧳', text: 'Luggage assistance is coming', type: 'luggage' },
    { icon: '💬', text: 'Is there anything else I can help with?', type: 'help' }
];

function renderStaffQuickReplies() {
    const container = document.getElementById('staffQuickRepliesContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="border-t border-stone-700 pt-2">
            <p class="text-[8px] text-stone-500 uppercase font-bold mb-1.5">Quick Replies</p>
            <div class="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                ${STAFF_QUICK_REPLIES.map(qr => `
                    <button onclick="sendStaffQuickReply('${qr.text.replace(/'/g, "\\'")}')" class="flex-shrink-0 bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1.5 rounded-full text-[9px] font-bold transition whitespace-nowrap">
                        ${qr.icon} ${qr.text}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

async function sendStaffQuickReply(text) {
    if (!staffChatManager) return;
    
    const input = document.getElementById('chatInput');
    if (input) {
        input.value = text;
        await sendChatMessage();
    }
}
