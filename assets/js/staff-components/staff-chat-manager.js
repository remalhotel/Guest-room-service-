// ==================== STAFF CHAT MANAGER CLASS ====================
class StaffChatManager {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
        this.currentRoom = null;
        this.currentGuest = null;
        this.messages = [];
        this.channel = null;
        this.typingTimeout = null;
    }

    async openChat(roomNumber, guestName) {
        this.currentRoom = String(roomNumber);
        this.currentGuest = guestName || 'Guest';
        
        const titleEl = document.getElementById('chatGuestName');
        if (titleEl) titleEl.textContent = `${this.currentGuest} (Room ${this.currentRoom})`;
        
        const modalEl = document.getElementById('chatModal');
        if (modalEl) modalEl.classList.remove('hidden');
        
        await this.loadMessages();
        await this.markMessagesAsRead();
        this.subscribeToRealtime();
        this.setupTypingIndicator();
    }

    closeChat() {
        const modalEl = document.getElementById('chatModal');
        if (modalEl) modalEl.classList.add('hidden');
        
        this.currentRoom = null;
        this.currentGuest = null;
        
        if (this.channel) {
            this.supabase.removeChannel(this.channel);
            this.channel = null;
        }
        
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
            this.typingTimeout = null;
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
                
            if (error) {
                // Essayer avec guest_room
                const fallback = await this.supabase
                    .from('chat_messages')
                    .select('*')
                    .eq('guest_room', this.currentRoom)
                    .order('created_at', { ascending: true })
                    .limit(200);
                this.messages = fallback.data || [];
            } else {
                this.messages = data || [];
            }
            
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
        } catch (e) {
            console.warn('Error marking messages:', e);
        }
    }

    subscribeToRealtime() {
        if (!this.currentRoom || !this.supabase) return;
        
        if (this.channel) {
            this.supabase.removeChannel(this.channel);
        }
        
        this.channel = this.supabase
            .channel(`staff-chat-room-${this.currentRoom}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages'
            }, (payload) => {
                const newMsg = payload.new;
                if (newMsg && (String(newMsg.room_number) === this.currentRoom || String(newMsg.guest_room) === this.currentRoom)) {
                    if (!this.messages.some(m => m.id === newMsg.id)) {
                        this.messages.push(newMsg);
                        this.renderMessages();
                        
                        if (newMsg.sender === 'guest') {
                            playNotificationSound();
                        }
                    }
                }
            })
            .on('broadcast', { event: 'typing' }, (payload) => {
                if (payload.payload.room_number === this.currentRoom && payload.payload.sender === 'guest') {
                    this.showTypingIndicator(payload.payload.is_typing);
                }
            })
            .subscribe();
    }

    async sendMessage(messageText) {
        if (!messageText || !messageText.trim() || !this.currentRoom) return null;
        
        const cleanText = messageText.trim();
        
        const payload = {
            room_number: this.currentRoom,
            guest_room: this.currentRoom,
            sender: 'staff',
            staff_name: 'Staff Member',
            message: cleanText,
            is_read: false,
            created_at: new Date().toISOString()
        };
        
        try {
            const { data, error } = await this.supabase
                .from('chat_messages')
                .insert([payload])
                .select();
                
            if (error) {
                delete payload.guest_room;
                const fallback = await this.supabase
                    .from('chat_messages')
                    .insert([payload])
                    .select();
                data = fallback.data;
            }
            
            const insertedMessage = data ? data[0] : payload;
            this.messages.push(insertedMessage);
            this.renderMessages();
            
            // Envoyer l'indicateur de frappe arrêté
            this.sendTypingIndicator(false);
            
            return insertedMessage;
        } catch (error) {
            console.error('Error sending message:', error);
            showToast('Error sending message: ' + error.message, 'error');
            return null;
        }
    }

    async sendTypingIndicator(isTyping) {
        if (!this.channel) return;
        
        await this.channel.send({
            type: 'broadcast',
            event: 'typing',
            payload: {
                room_number: this.currentRoom,
                sender: 'staff',
                is_typing: isTyping,
                timestamp: new Date().toISOString()
            }
        });
    }

    setupTypingIndicator() {
        const input = document.getElementById('chatInput');
        if (!input) return;
        
        input.addEventListener('input', () => {
            if (input.value.length > 0) {
                this.sendTypingIndicator(true);
                clearTimeout(this.typingTimeout);
                this.typingTimeout = setTimeout(() => {
                    this.sendTypingIndicator(false);
                }, 2000);
            } else {
                this.sendTypingIndicator(false);
            }
        });
    }

    showTypingIndicator(isTyping) {
        const typingElement = document.getElementById('chatTypingIndicator');
        if (typingElement) {
            if (isTyping) {
                typingElement.textContent = 'Guest is typing...';
                typingElement.classList.remove('hidden');
            } else {
                typingElement.classList.add('hidden');
            }
        }
    }

    renderMessages() {
        const container = document.getElementById('chatMessagesContainer');
        if (!container) return;
        
        container.innerHTML = this.messages.map(msg => {
            const isStaff = msg.sender === 'staff';
            const time = msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            }) : '';
            
            return `
                <div class="chat-message ${isStaff ? 'staff' : 'guest'}">
                    <div class="flex items-start gap-2">
                        <div class="flex-1">
                            <p class="text-[10px]">${msg.message || ''}</p>
                            ${msg.image_url ? `<img src="${msg.image_url}" class="mt-2 rounded-xl max-w-full h-auto" />` : ''}
                            <div class="flex items-center gap-2 mt-1">
                                <p class="text-[8px] opacity-60">${time}</p>
                                ${isStaff && msg.is_read ? '<span class="text-[8px] text-blue-400">✓✓ Read</span>' : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        container.scrollTop = container.scrollHeight;
    }
}
