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
            console.error('Erreur lors du chargement des messages:', error);
            return [];
        }
    }

    async markMessagesAsRead() {
        if (!this.supabase) return;
        
        try {
            const { error } = await this.supabase
                .from('chat_messages')
                .update({ is_read: true })
                .eq('room_number', this.roomNumber)
                .eq('sender', 'staff')
                .eq('is_read', false);
                
            if (error) console.warn('Erreur lors du marquage des messages:', error);
        } catch (error) {
            console.warn('Erreur lors du marquage des messages:', error);
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
                        this.showDesktopNotification(newMessage);
                    }
                    
                    if (newMessage.sender === 'staff') {
                        this.markMessagesAsRead();
                    }
                }
            })
            .on('broadcast', { event: 'typing' }, (payload) => {
                if (payload.payload.room_number === this.roomNumber && payload.payload.sender === 'staff') {
                    this.showTypingIndicator(payload.payload.is_typing);
                }
            })
            .on('presence', { event: 'sync' }, () => {
                this.updateStaffPresence();
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await this.trackPresence();
                }
            });
    }

    async trackPresence() {
        if (!this.channel) return;
        
        await this.channel.track({
            user_type: 'guest',
            room_number: this.roomNumber,
            guest_name: this.guestName,
            online_at: new Date().toISOString()
        });
    }

    updateStaffPresence() {
        if (!this.channel) return;
        
        const state = this.channel.presenceState();
        const staffOnline = Object.values(state).some(
            presence => presence[0]?.user_type === 'staff'
        );
        
        this.updateStaffStatus(staffOnline);
    }

    updateStaffStatus(isOnline) {
        const statusElement = document.getElementById('staffPresenceStatus');
        if (statusElement) {
            if (isOnline) {
                statusElement.innerHTML = '<span class="text-emerald-400 text-[10px]">● Staff en ligne</span>';
            } else {
                statusElement.innerHTML = '<span class="text-gray-400 text-[10px]">● Staff hors ligne</span>';
            }
        }
    }

    showTypingIndicator(isTyping) {
        const typingElement = document.getElementById('chatTypingIndicator');
        if (typingElement) {
            if (isTyping) {
                typingElement.textContent = 'Le staff est en train d\'écrire...';
                typingElement.classList.remove('hidden');
            } else {
                typingElement.classList.add('hidden');
            }
        }
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
        const optimisticMessage = { ...message, id: tempId };
        this.messages.push(optimisticMessage);
        this.render();
        this.scrollToBottom();
        
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
            
            this.sendTypingIndicator(false);
            return data;
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            this.messages = this.messages.filter(m => m.id !== tempId);
            this.render();
            return null;
        }
    }

    async sendTypingIndicator(isTyping) {
        if (!this.channel) return;
        
        await this.channel.send({
            type: 'broadcast',
            event: 'typing',
            payload: {
                room_number: this.roomNumber,
                sender: 'guest',
                is_typing: isTyping,
                timestamp: new Date().toISOString()
            }
        });
    }

    setupTypingIndicator() {
        const input = document.getElementById('guestChatInput');
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
            oscillator.frequency.setValueAtTime(1100, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.warn('Son non disponible:', error);
        }
    }

    showDesktopNotification(message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Message du staff', {
                body: message.message,
                icon: '/assets/images/logo.png'
            });
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
                    <div class="flex items-start gap-2">
                        <div class="flex-1">
                            <p class="text-[10px]">${msg.message}</p>
                            <div class="flex items-center gap-2 mt-1">
                                <p class="text-[8px] opacity-60">${time}</p>
                                ${isGuest && msg.is_read ? '<span class="text-[8px] text-blue-400">✓✓ Lu</span>' : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        this.scrollToBottom();
    }

    scrollToBottom() {
        const container = document.getElementById('guestChatContainer');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    destroy() {
        if (this.channel && this.supabase) {
            this.supabase.removeChannel(this.channel);
        }
        clearTimeout(this.typingTimeout);
    }
}
