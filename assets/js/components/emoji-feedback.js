// ==================== EMOJI FEEDBACK ====================
const EMOJI_RATINGS = [
    { value: 1, emoji: '😡', label: 'Terrible' },
    { value: 2, emoji: '😕', label: 'Poor' },
    { value: 3, emoji: '😐', label: 'Okay' },
    { value: 4, emoji: '😊', label: 'Good' },
    { value: 5, emoji: '🤩', label: 'Excellent' }
];

function showEmojiFeedback() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 z-[450] flex items-center justify-center p-4';
    modal.id = 'emojiFeedbackModal';
    
    modal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl">
            <div class="flex justify-between border-b border-stone-800 pb-3">
                <h3 class="text-xs font-bold text-[var(--text-gold,#DCA773)]">⭐ Quick Feedback</h3>
                <button onclick="closeEmojiFeedback()" class="text-stone-400">✕</button>
            </div>
            
            <p class="text-center text-xs text-stone-200">How is your stay?</p>
            
            <div class="flex justify-center gap-3">
                ${EMOJI_RATINGS.map(r => `
                    <button onclick="submitEmojiFeedback(${r.value})" class="text-3xl hover:scale-125 transition transform">
                        ${r.emoji}
                    </button>
                `).join('')}
            </div>
            
            <p class="text-center text-[9px] text-stone-400">Tap an emoji to rate</p>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeEmojiFeedback() {
    document.getElementById('emojiFeedbackModal')?.remove();
}

async function submitEmojiFeedback(rating) {
    const room = localStorage.getItem('remal_guest_room');
    
    if (window.supabaseClient && room) {
        try {
            await window.supabaseClient.from('emoji_feedback').insert([{
                room_number: String(room),
                rating: rating,
                created_at: new Date().toISOString()
            }]);
        } catch(e) {}
    }
    
    closeEmojiFeedback();
    const emoji = EMOJI_RATINGS.find(r => r.value === rating);
    showToast(`${emoji.emoji} Thank you for your feedback!`, 'success');
}

window.showEmojiFeedback = showEmojiFeedback;
window.closeEmojiFeedback = closeEmojiFeedback;
window.submitEmojiFeedback = submitEmojiFeedback;
