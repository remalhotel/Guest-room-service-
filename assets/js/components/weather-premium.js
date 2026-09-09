// ==================== WEATHER PREMIUM ====================
// Météo animée avec effets visuels selon la météo
// N'affecte AUCUNE fonctionnalité existante

(function() {
    'use strict';
    
    console.log('🌤️ Weather Premium activé');
    
    class WeatherPremium {
        constructor() {
            this.container = document.getElementById('weatherContainer');
            this.init();
        }
        
        init() {
            this.injectStyles();
            this.enhanceWeatherDisplay();
            this.observeWeatherChanges();
        }
        
        injectStyles() {
            if (document.getElementById('weatherPremiumStyles')) return;
            
            const style = document.createElement('style');
            style.id = 'weatherPremiumStyles';
            style.textContent = `
                /* Carte météo premium */
                #weatherContainer {
                    transition: all 0.5s ease;
                    border-radius: 16px;
                    overflow: hidden;
                    position: relative;
                }
                
                #weatherContainer:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 40px rgba(220, 167, 115, 0.25);
                }
                
                /* Animation du soleil */
                @keyframes sunRotate {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(180deg); }
                }
                
                /* Animation du nuage */
                @keyframes cloudFloat {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(10px); }
                }
                
                /* Animation de la pluie */
                @keyframes rainDrop {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(20px); opacity: 0; }
                }
                
                /* Animation du flocon */
                @keyframes snowFall {
                    0% { transform: translateY(0) rotate(0deg); }
                    100% { transform: translateY(20px) rotate(360deg); }
                }
                
                /* Animation du vent */
                @keyframes windBlow {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(5px) rotate(5deg); }
                    75% { transform: translateX(-5px) rotate(-5deg); }
                }
                
                /* Animation de l'éclair */
                @keyframes lightningFlash {
                    0%, 90%, 100% { opacity: 1; }
                    92% { opacity: 0.3; }
                    94% { opacity: 1; }
                    96% { opacity: 0.5; }
                }
                
                /* Icône météo animée */
                .weather-animated-icon {
                    display: inline-block;
                    font-size: 35px;
                    animation: cloudFloat 3s ease-in-out infinite;
                }
                
                .weather-animated-icon.sunny {
                    animation: sunRotate 8s linear infinite;
                }
                
                .weather-animated-icon.rainy {
                    animation: cloudFloat 2s ease-in-out infinite;
                }
                
                .weather-animated-icon.snowy {
                    animation: snowFall 3s linear infinite;
                }
                
                .weather-animated-icon.windy {
                    animation: windBlow 2s ease-in-out infinite;
                }
                
                .weather-animated-icon.stormy {
                    animation: lightningFlash 3s ease-in-out infinite;
                }
                
                /* Température animée */
                .weather-temp-animated {
                    animation: tempPulse 2s ease-in-out infinite;
                }
                
                @keyframes tempPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
                
                /* Détails météo */
                .weather-detail-item {
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .weather-detail-item:hover {
                    transform: scale(1.1);
                    color: #DCA773;
                }
                
                /* Mode clair */
                body.light-mode #weatherContainer {
                    background: rgba(255, 255, 255, 0.85);
                    border: 1px solid rgba(180, 122, 62, 0.3);
                }
            `;
            document.head.appendChild(style);
        }
        
        enhanceWeatherDisplay() {
            if (!this.container) return;
            
            // Observer les changements dans le conteneur
            const observer = new MutationObserver(() => {
                this.animateWeatherContent();
            });
            
            observer.observe(this.container, {
                childList: true,
                subtree: true,
                characterData: true
            });
            
            this.animateWeatherContent();
        }
        
        animateWeatherContent() {
            if (!this.container) return;
            
            const content = this.container.textContent || '';
            
            // Détecter le type de météo
            let weatherType = 'default';
            let icon = '🌤️';
            
            if (content.includes('☀️') || content.includes('Clear') || content.includes('Sunny')) {
                weatherType = 'sunny';
                icon = '☀️';
            } else if (content.includes('🌧️') || content.includes('Rain') || content.includes('Drizzle')) {
                weatherType = 'rainy';
                icon = '🌧️';
            } else if (content.includes('❄️') || content.includes('Snow')) {
                weatherType = 'snowy';
                icon = '❄️';
            } else if (content.includes('💨') || content.includes('Wind')) {
                weatherType = 'windy';
                icon = '💨';
            } else if (content.includes('⛈️') || content.includes('Thunder') || content.includes('Storm')) {
                weatherType = 'stormy';
                icon = '⛈️';
            } else if (content.includes('🌤️') || content.includes('Cloud')) {
                weatherType = 'cloudy';
                icon = '☁️';
            }
            
            // Ajouter une icône animée si elle n'existe pas
            if (!this.container.querySelector('.weather-animated-icon')) {
                const iconSpan = document.createElement('span');
                iconSpan.className = `weather-animated-icon ${weatherType}`;
                iconSpan.textContent = icon;
                
                // Insérer au début du conteneur
                this.container.prepend(iconSpan);
            }
            
            // Animer la température
            const tempEls = this.container.querySelectorAll('[class*="temp"], [id*="temp"]');
            tempEls.forEach(el => {
                el.classList.add('weather-temp-animated');
            });
        }
        
        observeWeatherChanges() {
            // Rafraîchir l'animation toutes les 30 secondes
            setInterval(() => {
                this.animateWeatherContent();
            }, 30000);
        }
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        window.weatherPremium = new WeatherPremium();
    });
    
})();
