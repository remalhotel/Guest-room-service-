// ==================== AMBIENT SOUNDS ====================
let ambientAudioContext = null;
let ambientOscillator = null;
let ambientGainNode = null;
let ambientInterval = null;
let currentAmbientSound = null;

const AMBIENT_SOUNDS = [
    { id: 'rain', icon: '🌧️', label: 'Rain' },
    { id: 'waves', icon: '🌊', label: 'Waves' },
    { id: 'forest', icon: '🌲', label: 'Forest' },
    { id: 'white_noise', icon: '📻', label: 'White Noise' },
    { id: 'night', icon: '🌙', label: 'Night' }
];

function showAmbientSoundsModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 z-[400] flex items-center justify-center p-4';
    modal.id = 'ambientModal';
    
    modal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-sm rounded-3xl p-6 space-y-4">
            <div class="flex justify-between border-b border-stone-800 pb-3">
                <h3 class="text-xs font-bold text-[var(--text-gold,#DCA773)]">🎵 Ambient Sounds</h3>
                <button onclick="closeAmbientSounds()" class="text-stone-400">✕</button>
            </div>
            <div class="grid grid-cols-2 gap-2">
                ${AMBIENT_SOUNDS.map(sound => `
                    <button onclick="toggleAmbientSound('${sound.id}')" class="p-4 bg-stone-950/60 border border-stone-800 rounded-2xl text-center ${currentAmbientSound === sound.id ? 'border-amber-500/50 bg-amber-500/10' : ''}">
                        <span class="text-3xl block mb-2">${sound.icon}</span>
                        <span class="text-[10px] text-stone-200 font-bold">${sound.label}</span>
                        ${currentAmbientSound === sound.id ? '<span class="text-[8px] text-amber-400 block mt-1">▶ Playing</span>' : ''}
                    </button>
                `).join('')}
            </div>
            ${currentAmbientSound ? `<button onclick="stopAmbientSound()" class="w-full bg-red-500/20 text-red-400 font-bold py-3 rounded-xl text-xs">⏹ Stop</button>` : ''}
        </div>
    `;
    document.body.appendChild(modal);
}

function closeAmbientSounds() {
    document.getElementById('ambientModal')?.remove();
}

function toggleAmbientSound(soundId) {
    if (currentAmbientSound === soundId) {
        stopAmbientSound();
    } else {
        playAmbientSound(soundId);
    }
}

function playAmbientSound(soundId) {
    stopAmbientSound();
    currentAmbientSound = soundId;
    
    try {
        ambientAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        ambientGainNode = ambientAudioContext.createGain();
        ambientGainNode.connect(ambientAudioContext.destination);
        ambientGainNode.gain.setValueAtTime(0.05, ambientAudioContext.currentTime);
        
        if (soundId === 'rain') {
            ambientInterval = setInterval(() => {
                if (!ambientAudioContext) return;
                const osc = ambientAudioContext.createOscillator();
                const gain = ambientAudioContext.createGain();
                osc.connect(gain);
                gain.connect(ambientGainNode);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300 + Math.random() * 500, ambientAudioContext.currentTime);
                gain.gain.setValueAtTime(Math.random() * 0.1, ambientAudioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ambientAudioContext.currentTime + 0.3);
                osc.start();
                osc.stop(ambientAudioContext.currentTime + 0.3);
            }, 50);
        } else if (soundId === 'white_noise') {
            const bufferSize = 2 * ambientAudioContext.sampleRate;
            const buffer = ambientAudioContext.createBuffer(1, bufferSize, ambientAudioContext.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const source = ambientAudioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(ambientGainNode);
            source.loop = true;
            source.start();
        } else if (soundId === 'night') {
            ambientOscillator = ambientAudioContext.createOscillator();
            ambientOscillator.connect(ambientGainNode);
            ambientOscillator.type = 'sine';
            ambientOscillator.frequency.setValueAtTime(220, ambientAudioContext.currentTime);
            ambientOscillator.start();
        } else {
            ambientOscillator = ambientAudioContext.createOscillator();
            ambientOscillator.connect(ambientGainNode);
            ambientOscillator.type = 'sine';
            ambientOscillator.frequency.setValueAtTime(180, ambientAudioContext.currentTime);
            ambientOscillator.start();
        }
        
        showToast('🎵 Playing ' + soundId, 'success');
    } catch(e) {
        showToast('Audio not available', 'error');
        currentAmbientSound = null;
    }
    
    // Mettre à jour l'interface
    const modal = document.getElementById('ambientModal');
    if (modal) modal.remove();
    showAmbientSoundsModal();
}

function stopAmbientSound() {
    if (ambientInterval) { clearInterval(ambientInterval); ambientInterval = null; }
    if (ambientOscillator) { try { ambientOscillator.stop(); } catch(e) {} ambientOscillator = null; }
    if (ambientAudioContext) { ambientAudioContext.close(); ambientAudioContext = null; }
    currentAmbientSound = null;
}

window.showAmbientSoundsModal = showAmbientSoundsModal;
window.closeAmbientSounds = closeAmbientSounds;
window.toggleAmbientSound = toggleAmbientSound;
window.stopAmbientSound = stopAmbientSound;
