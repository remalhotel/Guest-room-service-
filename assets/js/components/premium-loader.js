// ==================== PREMIUM LOADER ====================
// Splash screen élégant au chargement

class PremiumLoader {
    constructor() {
        this.loaderDuration = 2000; // 2 secondes
        this.init();
    }
    
    init() {
        this.createLoader();
        this.hideLoaderAfterDelay();
    }
    
    createLoader() {
        // Vérifier si le loader existe déjà
        if (document.getElementById('premiumLoader')) return;
        
        const loader = document.createElement('div');
        loader.id = 'premiumLoader';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: rgba(12, 10, 9, 0.85);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            animation: loaderFadeOut 0.5s ease 1.5s forwards;
        `;
        
        loader.innerHTML = `
            <div style="text-align: center;">
                <!-- Logo animé -->
                <div style="
                    width: 100px;
                    height: 100px;
                    margin: 0 auto 30px;
                    background: radial-gradient(circle, #DCA773 0%, transparent 70%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: loaderPulse 1.5s ease-in-out infinite;
                ">
                    <i class="fas fa-concierge-bell" style="font-size: 40px; color: #0c0a09;"></i>
                </div>
                
                <!-- Nom de l'hôtel -->
                <h1 style="
                    font-family: 'Cinzel', serif;
                    font-size: 28px;
                    color: #DCA773;
                    letter-spacing: 0.3em;
                    margin-bottom: 10px;
                    animation: textReveal 1s ease forwards;
                ">
                    REMAL
                </h1>
                
                <p style="
                    font-size: 10px;
                    color: #a8a29e;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    margin-bottom: 30px;
                ">
                    Hotel & Villas
                </p>
                
                <!-- Barre de chargement -->
                <div style="
                    width: 200px;
                    height: 2px;
                    background: rgba(220, 167, 115, 0.1);
                    border-radius: 2px;
                    overflow: hidden;
                    margin: 0 auto;
                ">
                    <div style="
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, #DCA773, transparent);
                        animation: loadingSlide 1.5s ease infinite;
                    "></div>
                </div>
                
                <p style="
                    font-size: 8px;
                    color: #a8a29e;
                    margin-top: 15px;
                    letter-spacing: 0.3em;
                ">
                    LOADING EXPERIENCE...
                </p>
            </div>
        `;
        
        document.body.appendChild(loader);
        
        // Ajouter les animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes loaderPulse {
                0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(220, 167, 115, 0.3); }
                50% { transform: scale(1.1); box-shadow: 0 0 60px rgba(220, 167, 115, 0.6); }
            }
            @keyframes loadingSlide {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            @keyframes textReveal {
                from { opacity: 0; letter-spacing: 0.5em; }
                to { opacity: 1; letter-spacing: 0.3em; }
            }
            @keyframes loaderFadeOut {
                from { opacity: 1; }
                to { opacity: 0; visibility: hidden; }
            }
        `;
        document.head.appendChild(style);
    }
    
    hideLoaderAfterDelay() {
        setTimeout(() => {
            const loader = document.getElementById('premiumLoader');
            if (loader) {
                loader.style.display = 'none';
                loader.remove();
            }
        }, this.loaderDuration);
    }
}

// Initialisation immédiate (avant DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
    window.premiumLoader = new PremiumLoader();
});
