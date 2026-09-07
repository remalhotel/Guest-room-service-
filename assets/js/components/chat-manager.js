// ==================== CHAT MANAGER CLASS ====================
class GuestChatManager {
    constructor(supabaseClient, roomNumber, guestName) {
        this.supabase = supabaseClient;
        this.roomNumber = String(roomNumber);
        this.guestName = guestName;
        this.messages = [];
        this.channel = null;
        this.unreadCount = 0;
        this.isTyping = false;
        this.typingTimeout = null;
        this.soundEnabled = localStorage.getItem('remal_chat_sound') !== 'off';
    }

    async init() {
        await this.loadMessages();
        this.subscribeToRealtime();
        this.setupTypingIndicator();
        this.setupSoundToggle();
        this.render();
    }

    async loadMessages() {
        if (!this.supabase) return [];
        
        try {
            const { data, error } = await this.supabase
                .from('chat_messages')
                .select('*')
                .eq('room_number', this.roomNumber)
                .order('created_at', { ascending: true })
                .limit(200);

            if (error) throw error;
            
            this.messages = data || [];
            await this.markMessagesAsRead();
            return this.messages;
        } catch (error) {
            console.error('Error loading messages:', error);
            return [];
        }
    }

    async markMessagesAsRead() {
        if (!this.supabase) return;
        
        try {
            await this.supabase
                .from('chat_messages')
                .update({ is_read: true })
                .eq('room_number', this.roomNumber)
                .eq('sender', 'staff')
                .eq('is_read', false);
        } catch (error) {
            console.warn('Error marking messages:', error);
        }
    }

    subscribeToRealtime() {
        if (!this.supabase) return;
        
        if (this.channel) {
            this.supabase.removeChannel(this.channel);
        }
        
        this.channel = this.supabase
            .channel(`guest-chat-${this.roomNumber}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages',
                filter: `room_number=eq.${this.roomNumber}`
            }, (payload) => {
                const newMessage = payload.new;
                if (newMessage && !this.messages.some(m => m.id === newMessage.id)) {
                    this.messages.push(newMessage);
                    this.render();
                    
                    if (newMessage.sender === 'staff' && this.soundEnabled) {
                        this.playNotificationSound();
                    }
                    
                    if (newMessage.sender === 'staff') {
                        this.markMessagesAsRead();
                    }
                }
            })
            .subscribe();
    }

    async sendMessage(messageText) {
        if (!messageText || !messageText.trim()) return null;
        
        const message = {
            room_number: this.roomNumber,
            sender: 'guest',
            guest_name: this.guestName,
            message: messageText.trim(),
            is_read: false,
            created_at: new Date().toISOString()
        };
        
        const tempId = `temp-${Date.now()}`;
        this.messages.push({ ...message, id: tempId });
        this.render();
        
        try {
            const { data, error } = await this.supabase
                .from('chat_messages')
                .insert([message])
                .select()
                .single();
                
            if (error) throw error;
            
            const index = this.messages.findIndex(m => m.id === tempId);
            if (index !== -1) {
                this.messages[index] = data;
                this.render();
            }
            
            return data;
        } catch (error) {
            console.error('Error sending message:', error);
            this.messages = this.messages.filter(m => m.id !== tempId);
            this.render();
            return null;
        }
    }

    setupTypingIndicator() {
        const input = document.getElementById('guestChatInput');
        if (!input) return;
        
        input.addEventListener('input', () => {
            clearTimeout(this.typingTimeout);
            this.typingTimeout = setTimeout(() => {}, 2000);
        });
    }

    setupSoundToggle() {
        const soundToggle = document.getElementById('chatSoundToggle');
        if (!soundToggle) return;
        soundToggle.textContent = this.soundEnabled ? '🔊' : '🔇';
    }

    playNotificationSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.warn('Sound not available:', error);
        }
    }

    render() {
        const container = document.getElementById('guestChatContainer');
        if (!container) return;
        
        container.innerHTML = this.messages.map(msg => {
            const isGuest = msg.sender === 'guest';
            const time = new Date(msg.created_at).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            return `
                <div class="chat-message ${isGuest ? 'guest' : 'staff'}">
                    <p class="text-[10px]">${msg.message}</p>
                    <p class="text-[8px] opacity-60 mt-1">${time}</p>
                </div>
            `;
        }).join('');
        
        container.scrollTop = container.scrollHeight;
    }

    destroy() {
        if (this.channel && this.supabase) {
            this.supabase.removeChannel(this.channel);
        }
        clearTimeout(this.typingTimeout);
    }
}

// Exposer
window.GuestChatManager = GuestChatManager;
