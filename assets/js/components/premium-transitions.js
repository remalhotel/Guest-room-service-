// ==================== PREMIUM TRANSITIONS ====================
// Transitions fluides entre les sections et modales

class PremiumTransitions {
    constructor() {
        this.init();
    }
    
    init() {
        this.enhanceModals();
        this.enhanceTabSwitching();
        this.enhanceServiceNavigation();
    }
    
    // Améliorer l'ouverture/fermeture des modales
    enhanceModals() {
        // Observer les changements de classe hidden
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const element = mutation.target;
                    
                    // Modale ouverte
                    if (!element.classList.contains('hidden') && 
                        element.classList.contains('fixed') && 
                        element.classList.contains('inset-0')) {
                        element.style.animation = 'modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
                        
                        // Animer le contenu de la modale
                        const modalContent = element.querySelector('div');
                        if (modalContent) {
                            modalContent.style.animation = 'modalContentIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards';
                        }
                    }
                }
            });
        });
        
        // Observer toutes les modales
        ['guestChatModal', 'menuModal'].forEach(id => {
            const modal = document.getElementById(id);
            if (modal) {
                observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
            }
        });
        
        // Ajouter les animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes modalIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes modalContentIn {
                from {
                    opacity: 0;
                    transform: translateY(30px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            @keyframes modalContentOut {
                from {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translateY(30px) scale(0.95);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Améliorer le changement d'onglets
    enhanceTabSwitching() {
        const tabs = ['services', 'offers', 'faq'];
        
        tabs.forEach(tab => {
            const button = document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
            const section = document.getElementById(`${tab}Section`);
            
            if (button && section) {
                button.addEventListener('click', () => {
                    // Animation de sortie
                    section.style.animation = 'sectionOut 0.2s ease forwards';
                    
                    // Animation d'entrée après un court délai
                    setTimeout(() => {
                        section.style.animation = 'sectionIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
                    }, 200);
                });
            }
        });
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes sectionOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-10px); }
            }
            
            @keyframes sectionIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Améliorer la navigation entre services
    enhanceServiceNavigation() {
        const servicesList = document.getElementById('servicesList');
        const roomServiceSection = document.getElementById('roomServiceSection');
        const otherServiceSection = document.getElementById('otherServiceSection');
        
        if (servicesList && roomServiceSection) {
            // Observer les changements de visibilité
            const observer = new MutationObserver(() => {
                if (!roomServiceSection.classList.contains('hidden')) {
                    roomServiceSection.style.animation = 'serviceIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
                }
                
                if (!otherServiceSection.classList.contains('hidden')) {
                    otherServiceSection.style.animation = 'serviceIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
                }
                
                if (!servicesList.classList.contains('hidden')) {
                    servicesList.style.animation = 'serviceIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
                }
            });
            
            observer.observe(roomServiceSection, { attributes: true, attributeFilter: ['class'] });
            observer.observe(otherServiceSection, { attributes: true, attributeFilter: ['class'] });
            observer.observe(servicesList, { attributes: true, attributeFilter: ['class'] });
        }
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes serviceIn {
                from {
                    opacity: 0;
                    transform: translateX(30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.premiumTransitions = new PremiumTransitions();
});
