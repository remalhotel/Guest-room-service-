
// ==================== FEEDBACK AVEC ÉMOJIS ANIMÉS ====================
const EMOJI_RATINGS = [
    { value: 1, emoji: '😡', label: 'Terrible', color: '#ef4444' },
    { value: 2, emoji: '😕', label: 'Poor', color: '#f97316' },
    { value: 3, emoji: '😐', label: 'Okay', color: '#eab308' },
    { value: 4, emoji: '😊', label: 'Good', color: '#84cc16' },
    { value: 5, emoji: '🤩', label: 'Excellent', color: '#10b981' }
];

let selectedEmojiRating = 0;

function showEmojiFeedbackModal(title = 'How was your experience?', context = 'general') {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 z-[950] flex items-center justify-center p-4 backdrop-blur-sm';
    modal.id = 'emojiFeedbackModal';
    
    modal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-sm rounded-3xl p-6 space-y-5 shadow-2xl">
            <div class="flex justify-between items-center border-b border-stone-800 pb-3">
                <h3 class="text-xs font-serif-luxury font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-widest">
                    ⭐ Feedback
                </h3>
                <button onclick="closeEmojiFeedback()" class="text-stone-400 hover:text-stone-100 text-xl font-bold">✕</button>
            </div>
            
            <div class="text-center">
                <p class="text-sm font-bold text-stone-100">${title}</p>
                
                <div class="flex justify-center gap-3 mt-5" id="emojiContainer">
                    ${EMOJI_RATINGS.map(rating => `
                        <button onclick="selectEmojiRating(${rating.value})" class="emoji-btn text-4xl hover:scale-125 transition transform ${selectedEmojiRating === rating.value ? 'scale-125' : 'opacity-50'}" data-value="${rating.value}" style="transition: all 0.3s ease">
                            ${rating.emoji}
                        </button>
                    `).join('')}
                </div>
                
                <p id="emojiLabel" class="text-lg font-bold mt-3 ${selectedEmojiRating ? '' : 'hidden'}" style="color: ${EMOJI_RATINGS.find(r => r.value === selectedEmojiRating)?.color || '#DCA773'}">
                    ${selectedEmojiRating ? EMOJI_RATINGS.find(r => r.value === selectedEmojiRating)?.label : ''}
                </p>
                
                <div class="mt-4">
                    <textarea id="emojiFeedbackComment" placeholder="Tell us more... (optional)" class="w-full h-16 bg-stone-950 border border-stone-800 rounded-2xl p-3 outline-none resize-none text-xs text-stone-200"></textarea>
                </div>
                
                <button onclick="submitEmojiFeedback('${context}')" class="w-full bg-[#DCA773] hover:bg-[#ebd0b3] text-stone-950 font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest transition mt-3" ${selectedEmojiRating ? '' : 'disabled style="opacity: 0.5"'} id="emojiSubmitBtn">
                    Submit Feedback
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function selectEmojiRating(value) {
    selectedEmojiRating = value;
    
    // Mettre à jour les émojis
    document.querySelectorAll('.emoji-btn').forEach(btn => {
        const btnValue = parseInt(btn.getAttribute('data-value'));
        if (btnValue === value) {
            btn.className = 'emoji-btn text-4xl transition transform scale-125';
            btn.style.opacity = '1';
        } else {
            btn.className = 'emoji-btn text-4xl hover:scale-125 transition transform opacity-50';
            btn.style.opacity = '0.5';
        }
    });
    
    // Mettre à jour le label
    const label = document.getElementById('emojiLabel');
    const rating = EMOJI_RATINGS.find(r => r.value === value);
    if (label && rating) {
        label.classList.remove('hidden');
        label.textContent = rating.label;
        label.style.color = rating.color;
    }
    
    // Activer le bouton
    const submitBtn = document.getElementById('emojiSubmitBtn');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }
    
    // Animation de l'émoji sélectionné
    playEmojiAnimation(value);
}

function playEmojiAnimation(value) {
    const emoji = EMOJI_RATINGS.find(r => r.value === value);
    if (!emoji) return;
    
    // Petit son selon l'émoji
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        
        if (value >= 4) {
            // Son positif
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1100, audioContext.currentTime + 0.1);
        } else if (value <= 2) {
            // Son négatif
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.1);
        } else {
            // Son neutre
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        }
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
        console.warn('Sound not available:', error);
    }
}

function closeEmojiFeedback() {
    const modal = document.getElementById('emojiFeedbackModal');
    if (modal) modal.remove();
    selectedEmojiRating = 0;
}

async function submitEmojiFeedback(context) {
    if (!selectedEmojiRating) {
        showToast('Please select an emoji', 'error');
        return;
    }
    
    const comment = document.getElementById('emojiFeedbackComment')?.value?.trim() || '';
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    
    const feedbackData = {
        room_number: String(room),
        guest_name: cachedGuestData?.guest_name || 'Guest',
        rating: selectedEmojiRating,
        feedback_text: comment,
        context: context,
        created_at: new Date().toISOString()
    };
    
    try {
        if (supabaseClient) {
            const { error } = await supabaseClient
                .from('emoji_feedback')
                .insert([feedbackData]);
                
            if (error) {
                console.warn('Error saving emoji feedback:', error);
            }
        }
        
        closeEmojiFeedback();
        
        const rating = EMOJI_RATINGS.find(r => r.value === selectedEmojiRating);
        showToast(`${rating.emoji} Thank you for your feedback!`, 'success');
        
        selectedEmojiRating = 0;
        
    } catch (err) {
        console.warn('Error saving feedback:', err);
        showToast('Error saving feedback', 'error');
    }
}

function initEmojiFeedback() {
    // Créer le bouton de feedback rapide
    renderEmojiFeedbackButton();
}

function renderEmojiFeedbackButton() {
    const container = document.getElementById('emojiFeedbackButtonContainer');
    if (!container) return;
    
    container.innerHTML = `
        <button onclick="showEmojiFeedbackModal('How is your stay so far?', 'quick_feedback')" class="w-full p-3 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl hover:border-amber-500/50 transition">
            <div class="flex items-center justify-center gap-3">
                <span class="text-2xl">${EMOJI_RATINGS[4].emoji}</span>
                <div class="text-left">
                    <p class="text-[10px] font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-wider">Quick Feedback</p>
                    <p class="text-[8px] text-stone-400">Tap to rate your experience</p>
                </div>
            </div>
        </button>
    `;
}
