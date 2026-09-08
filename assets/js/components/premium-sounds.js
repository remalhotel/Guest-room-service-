// ==================== PREMIUM SOUNDS ====================
// Sons subtils pour les interactions (désactivés par défaut)

class PremiumSounds {
    constructor() {
        this.enabled = false; // Désactivé par défaut
        this.volume = 0.3;
        this.sounds = {};
        this.init();
    }
    
    init() {
        this.createSounds();
        this.setupSoundToggle();
    }
    
    createSounds() {
        // Créer les sons avec Web Audio API
        this.audioContext = null;
        
        this.soundEffects = {
            click: { frequency: 800, duration: 0.1, type: 'sine' },
            success: { frequency: 1200, duration: 0.2, type: 'sine' },
            error: { frequency: 300, duration: 0.3, type: 'sawtooth' },
            notification: { frequency: 1000, duration: 0.15, type: 'sine' },
            transition: { frequency: 600, duration: 0.2, type: 'sine' }
        };
    }
    
    playSound(soundName) {
        if (!this.enabled) return;
        
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const sound = this.soundEffects[soundName];
            if (!sound) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = sound.type;
            oscillator.frequency.setValueAtTime(sound.frequency, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + sound.duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + sound.duration);
        } catch (e) {
            // Silencieux
        }
    }
    
    setupSoundToggle() {
        // Créer un bouton pour activer/désactiver les sons
        const soundToggle = document.createElement('button');
        soundToggle.id = 'soundToggle';
        soundToggle.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 80px;
            z-index: 9999;
            background: rgba(28, 25, 23, 0.8);
            color: #DCA773;
            border: 1px solid rgba(220, 167, 115, 0.3);
            border-radius: 50%;
            width: 45px;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 16px;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        `;
        soundToggle.innerHTML = '🔇';
        soundToggle.title = 'Enable sounds';
        
        soundToggle.onclick = () => {
            this.enabled = !this.enabled;
            soundToggle.innerHTML = this.enabled ? '🔊' : '🔇';
            soundToggle.title = this.enabled ? 'Disable sounds' : 'Enable sounds';
            
            if (this.enabled) {
                this.playSound('success');
            }
        };
        
        document.body.appendChild(soundToggle);
    }
    
    // Méthodes publiques
    click() {
        this.playSound('click');
    }
    
    success() {
        this.playSound('success');
    }
    
    error() {
        this.playSound('error');
    }
    
    notification() {
        this.playSound('notification');
    }
    
    transition() {
        this.playSound('transition');
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.premiumSounds = new PremiumSounds();
    
    // Ajouter des sons aux interactions
    document.addEventListener('click', (e) => {
        if (window.premiumSounds && e.target.closest('button')) {
            window.premiumSounds.click();
        }
    });
});
