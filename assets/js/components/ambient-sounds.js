// ==================== SONS D'AMBIANCE ====================
let currentAmbientSound = null;
let ambientAudioContext = null;
let ambientOscillator = null;
let ambientGainNode = null;
let ambientInterval = null;

const AMBIENT_SOUNDS = [
    { id: 'rain', icon: '🌧️', label: 'Rain', description: 'Gentle rain sounds' },
    { id: 'waves', icon: '🌊', label: 'Ocean Waves', description: 'Calming waves' },
    { id: 'forest', icon: '🌲', label: 'Forest', description: 'Birds and nature' },
    { id: 'white_noise', icon: '📻', label: 'White Noise', description: 'Soft static' },
    { id: 'night', icon: '🌙', label: 'Night', description: 'Peaceful night sounds' },
    { id: 'fire', icon: '🔥', label: 'Fireplace', description: 'Crackling fire' }
];

function showAmbientSoundsModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 z-[750] flex items-center justify-center p-4 backdrop-blur-sm';
    modal.id = 'ambientSoundsModal';
    
    modal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl">
            <div class="flex justify-between items-center border-b border-stone-800 pb-3">
                <h3 class="text-xs font-serif-luxury font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-widest">
                    🎵 Ambient Sounds
                </h3>
                <button onclick="closeAmbientSounds()" class="text-stone-400 hover:text-stone-100 text-xl font-bold">✕</button>
            </div>
            
            <div class="grid grid-cols-2 gap-3">
                ${AMBIENT_SOUNDS.map(sound => `
                    <button onclick="toggleAmbientSound('${sound.id}')" id="ambient_${sound.id}" class="p-4 bg-stone-950/60 border border-stone-800 hover:border-amber-500/50 rounded-2xl text-center transition ${currentAmbientSound === sound.id ? 'border-amber-500/50 bg-amber-500/10' : ''}">
                        <span class="text-3xl block mb-2">${sound.icon}</span>
                        <p class="font-bold text-stone-100 text-xs">${sound.label}</p>
                        <p class="text-[8px] text-stone-400 mt-1">${sound.description}</p>
                        ${currentAmbientSound === sound.id ? '<span class="text-[8px] text-amber-400 font-bold mt-1 block">▶ Playing</span>' : ''}
                    </button>
                `).join('')}
            </div>
            
            <div id="ambientVolumeControl" class="p-3 bg-stone-950/60 border border-stone-800 rounded-2xl ${currentAmbientSound ? '' : 'hidden'}">
                <label class="block text-[9px] text-stone-400 font-bold uppercase mb-2">Volume</label>
                <input type="range" id="ambientVolumeSlider" min="0" max="100" value="50" oninput="adjustAmbientVolume(this.value)" class="w-full">
            </div>
            
            ${currentAmbientSound ? `
                <button onclick="stopAmbientSound()" class="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold py-3 rounded-2xl text-xs uppercase tracking-widest transition">
                    <i class="fas fa-stop mr-1"></i> Stop Sound
                </button>
            ` : ''}
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeAmbientSounds() {
    const modal = document.getElementById('ambientSoundsModal');
    if (modal) modal.remove();
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
        
        switch(soundId) {
            case 'rain':
                playRainSound();
                break;
            case 'waves':
                playWavesSound();
                break;
            case 'forest':
                playForestSound();
                break;
            case 'white_noise':
                playWhiteNoise();
                break;
            case 'night':
                playNightSound();
                break;
            case 'fire':
                playFireSound();
                break;
        }
        
        showToast('🔊 Playing ambient sound', 'success');
        
    } catch (error) {
        console.warn('Audio not available:', error);
        showToast('Audio not available on this device', 'error');
        currentAmbientSound = null;
    }
    
    // Mettre à jour l'interface
    updateAmbientUI();
}

function playRainSound() {
    // Simuler le son de pluie avec du bruit aléatoire
    ambientInterval = setInterval(() => {
        if (!ambientAudioContext) return;
        
        const oscillator = ambientAudioContext.createOscillator();
        const gain = ambientAudioContext.createGain();
        
        oscillator.connect(gain);
        gain.connect(ambientGainNode);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(300 + Math.random() * 500, ambientAudioContext.currentTime);
        
        gain.gain.setValueAtTime(Math.random() * 0.1, ambientAudioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ambientAudioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(ambientAudioContext.currentTime + 0.3);
    }, 50);
}

function playWavesSound() {
    ambientInterval = setInterval(() => {
        if (!ambientAudioContext) return;
        
        const oscillator = ambientAudioContext.createOscillator();
        const gain = ambientAudioContext.createGain();
        
        oscillator.connect(gain);
        gain.connect(ambientGainNode);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(200, ambientAudioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ambientAudioContext.currentTime + 2);
        
        gain.gain.setValueAtTime(0, ambientAudioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, ambientAudioContext.currentTime + 1);
        gain.gain.exponentialRampToValueAtTime(0.001, ambientAudioContext.currentTime + 3);
        
        oscillator.start();
        oscillator.stop(ambientAudioContext.currentTime + 3);
    }, 3000);
}

function playForestSound() {
    ambientInterval = setInterval(() => {
        if (!ambientAudioContext) return;
        
        const oscillator = ambientAudioContext.createOscillator();
        const gain = ambientAudioContext.createGain();
        
        oscillator.connect(gain);
        gain.connect(ambientGainNode);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400 + Math.random() * 800, ambientAudioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, ambientAudioContext.currentTime + 0.15);
        
        gain.gain.setValueAtTime(0.05, ambientAudioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ambientAudioContext.currentTime + 0.2);
        
        oscillator.start();
        oscillator.stop(ambientAudioContext.currentTime + 0.2);
    }, 500);
}

function playWhiteNoise() {
    const bufferSize = 2 * ambientAudioContext.sampleRate;
    const buffer = ambientAudioContext.createBuffer(1, bufferSize, ambientAudioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const source = ambientAudioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(ambientGainNode);
    source.loop = true;
    source.start();
}

function playNightSound() {
    // Son doux et continu
    ambientOscillator = ambientAudioContext.createOscillator();
    ambientOscillator.connect(ambientGainNode);
    ambientOscillator.type = 'sine';
    ambientOscillator.frequency.setValueAtTime(220, ambientAudioContext.currentTime);
    ambientOscillator.start();
}

function playFireSound() {
    ambientInterval = setInterval(() => {
        if (!ambientAudioContext) return;
        
        const oscillator = ambientAudioContext.createOscillator();
        const gain = ambientAudioContext.createGain();
        
        oscillator.connect(gain);
        gain.connect(ambientGainNode);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(100 + Math.random() * 200, ambientAudioContext.currentTime);
        
        gain.gain.setValueAtTime(Math.random() * 0.08, ambientAudioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ambientAudioContext.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(ambientAudioContext.currentTime + 0.1);
    }, 100);
}

function stopAmbientSound() {
    if (ambientInterval) {
        clearInterval(ambientInterval);
        ambientInterval = null;
    }
    
    if (ambientOscillator) {
        try { ambientOscillator.stop(); } catch(e) {}
        ambientOscillator = null;
    }
    
    if (ambientAudioContext) {
        ambientAudioContext.close();
        ambientAudioContext = null;
    }
    
    currentAmbientSound = null;
    updateAmbientUI();
}

function adjustAmbientVolume(value) {
    if (ambientGainNode) {
        ambientGainNode.gain.setValueAtTime(value / 1000, ambientAudioContext.currentTime);
    }
}

function updateAmbientUI() {
    // Mettre à jour les boutons
    document.querySelectorAll('[id^="ambient_"]').forEach(btn => {
        const soundId = btn.id.replace('ambient_', '');
        if (soundId === currentAmbientSound) {
            btn.className = 'p-4 bg-amber-500/10 border border-amber-500/50 rounded-2xl text-center transition';
        } else {
            btn.className = 'p-4 bg-stone-950/60 border border-stone-800 hover:border-amber-500/50 rounded-2xl text-center transition';
        }
    });
    
    // Afficher/masquer le contrôle de volume
    const volumeControl = document.getElementById('ambientVolumeControl');
    if (volumeControl) {
        if (currentAmbientSound) {
            volumeControl.classList.remove('hidden');
        } else {
            volumeControl.classList.add('hidden');
        }
    }
}

function showAmbientSoundsButton() {
    const container = document.getElementById('ambientSoundsButtonContainer');
    if (!container) return;
    
    container.innerHTML = `
        <button onclick="showAmbientSoundsModal()" class="fixed bottom-20 left-32 z-50 bg-stone-800 text-amber-400 w-10 h-10 rounded-full flex items-center justify-center shadow-2xl transition hover:scale-110">
            <i class="fas fa-music text-sm"></i>
        </button>
    `;
}
