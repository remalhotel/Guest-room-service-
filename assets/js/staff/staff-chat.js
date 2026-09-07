// ==================== STAFF CHAT MANAGER ====================
class StaffChatManager {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
        this.currentRoom = null;
        this.currentGuest = null;
        this.messages = [];
        this.channel = null;
    }

    async openChat(roomNumber, guestName) {
        this.currentRoom = String(roomNumber);
        this.currentGuest = guestName || 'Guest';
        
        const titleEl = document.getElementById('chatGuestName');
        if (titleEl) titleEl.textContent = `${this.currentGuest} (Room ${this.currentRoom})`;
        
        document.getElementById('chatModal').classList.remove('hidden');
        
        await this.loadMessages();
        await this.markMessagesAsRead();
        this.subscribeToRealtime();
    }

    closeChat() {
        document.getElementById('chatModal').classList.add('hidden');
        this.currentRoom = null;
        this.currentGuest = null;
        if (this.channel) {
            this.supabase.removeChannel(this.channel);
            this.channel = null;
        }
    }

    async loadMessages() {
        if (!this.currentRoom) return [];
        try {
            const { data, error } = await this.supabase
                .from('chat_messages')
                .select('*')
                .eq('room_number', this.currentRoom)
                .order('created_at', { ascending: true })
                .limit(200);
            if (error) throw error;
            this.messages = data || [];
            this.renderMessages();
            return this.messages;
        } catch (error) {
            console.error('Error loading messages:', error);
            return [];
        }
    }

    async markMessagesAsRead() {
        if (!this.currentRoom) return;
        try {
            await this.supabase
                .from('chat_messages')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq('room_number', this.currentRoom)
                .eq('sender', 'guest')
                .eq('is_read', false);
        } catch (e) {}
    }

    subscribeToRealtime() {
        if (!this.currentRoom || !this.supabase) return;
        if (this.channel) this.supabase.removeChannel(this.channel);
        
        this.channel = this.supabase
            .channel(`staff-chat-${this.currentRoom}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
                const newMsg = payload.new;
                if (newMsg && String(newMsg.room_number) === this.currentRoom) {
                    if (!this.messages.some(m => m.id === newMsg.id)) {
                        this.messages.push(newMsg);
                        this.renderMessages();
                        if (newMsg.sender === 'guest') playNotificationSound();
                    }
                }
            })
            .subscribe();
    }

    async sendMessage(messageText) {
        if (!messageText || !messageText.trim() || !this.currentRoom) return null;
        
        const payload = {
            room_number: this.currentRoom,
            sender: 'staff',
            staff_name: 'Staff Member',
            message: messageText.trim(),
            is_read: false,
            created_at: new Date().toISOString()
        };
        
        try {
            const { data, error } = await this.supabase.from('chat_messages').insert([payload]).select();
            if (error) throw error;
            const inserted = data ? data[0] : payload;
            this.messages.push(inserted);
            this.renderMessages();
            return inserted;
        } catch (error) {
            console.error('Error sending message:', error);
            showToast('Error: ' + error.message, 'error');
            return null;
        }
    }

    renderMessages() {
        const container = document.getElementById('chatMessagesContainer');
        if (!container) return;
        container.innerHTML = this.messages.map(msg => {
            const isStaff = msg.sender === 'staff';
            const time = msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
            return `
                <div class="chat-message ${isStaff ? 'staff' : 'guest'}">
                    <p class="text-[10px]">${msg.message || ''}</p>
                    <p class="text-[8px] opacity-60 mt-1">${time} ${isStaff && msg.is_read ? '✓✓ Read' : ''}</p>
                </div>
            `;
        }).join('');
        container.scrollTop = container.scrollHeight;
    }
}

// ==================== CHAT FUNCTIONS ====================
function openChatModal(roomNumber, guestName) {
    if (!staffChatManager) staffChatManager = new StaffChatManager(supabaseClient);
    staffChatManager.openChat(roomNumber, guestName);
}

function closeChatModal() {
    if (staffChatManager) staffChatManager.closeChat();
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;
    const message = input.value.trim();
    if (!message || !staffChatManager) return;
    input.value = '';
    const sent = await staffChatManager.sendMessage(message);
    if (!sent) input.value = message;
}

window.StaffChatManager = StaffChatManager;
window.openChatModal = openChatModal;
window.closeChatModal = closeChatModal;
window.sendChatMessage = sendChatMessage;
