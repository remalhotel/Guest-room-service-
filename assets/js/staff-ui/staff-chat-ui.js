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
