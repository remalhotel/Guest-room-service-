// ==================== OFFERS EXPERIENCE ====================
// Transforme l'onglet Offers en expérience luxueuse
// Même style que Remal Experiences

class OffersExperience {
    constructor() {
        this.offers = [];
        this.currentFilter = 'all';
        this.init();
    }
    
    async init() {
        this.injectStyles();
        await this.loadOffers();
        this.enhanceOffersContainer();
    }
    
    injectStyles() {
        if (document.getElementById('offersExperienceStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'offersExperienceStyles';
        style.textContent = `
            .offers-experience-container {
                display: grid;
                gap: 15px;
            }
            
            .offer-experience-card {
                background: rgba(22, 20, 18, 0.92);
                border: 1px solid rgba(220, 167, 115, 0.3);
                border-radius: 20px;
                overflow: hidden;
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                cursor: pointer;
                animation: offerCardIn 0.6s ease forwards;
                opacity: 0;
                position: relative;
            }
            
            .offer-experience-card:hover {
                transform: translateY(-8px) scale(1.02);
                border-color: #DCA773;
                box-shadow: 0 20px 60px rgba(220, 167, 115, 0.3);
            }
            
            .offer-experience-card img {
                width: 100%;
                height: 160px;
                object-fit: cover;
                transition: all 0.5s ease;
            }
            
            .offer-experience-card:hover img {
                transform: scale(1.08);
            }
            
            .offer-experience-badge {
                position: absolute;
                top: 12px;
                right: 12px;
                background: linear-gradient(135deg, #FFD700, #FFA500);
                color: #000;
                padding: 5px 12px;
                border-radius: 20px;
                font-weight: 900;
                font-size: 9px;
                text-transform: uppercase;
                letter-spacing: 1px;
                animation: badgePulse 2s ease-in-out infinite;
                z-index: 5;
            }
            
            .offer-experience-venue {
                display: inline-block;
                background: rgba(220, 167, 115, 0.15);
                color: #DCA773;
                border: 1px solid rgba(220, 167, 115, 0.3);
                padding: 3px 10px;
                border-radius: 12px;
                font-size: 8px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 8px;
            }
            
            .offer-experience-filters {
                display: flex;
                gap: 8px;
                overflow-x: auto;
                padding: 10px 0;
                scrollbar-width: none;
                margin-bottom: 15px;
            }
            
            .offer-experience-filters::-webkit-scrollbar { display: none; }
            
            .offer-experience-filter-btn {
                white-space: nowrap;
                padding: 8px 16px;
                border-radius: 20px;
                border: 1px solid rgba(220, 167, 115, 0.3);
                background: rgba(28, 25, 23, 0.8);
                color: #a8a29e;
                font-weight: bold;
                font-size: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .offer-experience-filter-btn.active {
                background: #DCA773;
                color: #000;
                border-color: #DCA773;
            }
            
            @keyframes offerCardIn {
                from { opacity: 0; transform: translateY(30px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            
            @keyframes badgePulse {
                0%, 100% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.3); }
                50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.6); }
            }
            
            body.light-mode .offer-experience-card {
                background: #ffffff;
                border-color: rgba(180, 122, 62, 0.3);
            }
        `;
        document.head.appendChild(style);
    }
    
    async loadOffers() {
        try {
            const { data, error } = await supabase
                .from('experiences_offers')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });
            
            this.offers = data || [];
        } catch (e) {
            this.offers = [];
        }
        
        if (this.offers.length === 0) {
            this.offers = this.getDefaultOffers();
        }
    }
    
    getDefaultOffers() {
        return [
            {
                id: '1',
                category: 'falaj',
                venue: 'Falaj Restaurant',
                title: 'International Breakfast Buffet',
                description: 'Start your day with a lavish spread',
                price: '120 AED',
                image_url: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600',
                badge: 'Morning',
                details: 'Enjoy a sumptuous breakfast buffet featuring international and Arabic specialties.'
            },
            {
                id: '2',
                category: 'sarab',
                venue: 'Sarab Bar Lounge',
                title: 'Sunset Happy Hour',
                description: 'Cocktails with stunning views',
                price: '90 AED',
                image_url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600',
                badge: 'Sunset',
                details: 'Sip on expertly crafted cocktails while enjoying breathtaking sunset views.'
            },
            {
                id: '3',
                category: 'spa',
                venue: 'Remal Spa',
                title: 'Royal Spa Ritual',
                description: 'Full body massage and facial',
                price: '450 AED',
                image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600',
                badge: 'Signature',
                details: 'Our signature Royal Spa Ritual features a 90-minute therapeutic massage.'
            },
            {
                id: '4',
                category: 'alrodah',
                venue: 'Al Rodah',
                title: 'Afternoon High Tea',
                description: 'Traditional tea experience',
                price: '110 AED',
                image_url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600',
                badge: 'Elegant',
                details: 'Indulge in a refined afternoon tea with delicate sandwiches and pastries.'
            }
        ];
    }
    
    enhanceOffersContainer() {
        const container = document.getElementById('offersContainer');
        if (!container) return;
        
        container.classList.add('offers-experience-container');
        
        // Vider le conteneur
        container.innerHTML = '';
        
        // Ajouter les filtres
        const filtersDiv = document.createElement('div');
        filtersDiv.className = 'offer-experience-filters';
        filtersDiv.innerHTML = `
            <button class="offer-experience-filter-btn active" onclick="offersExperience.filterOffers('all')">✨ All</button>
            <button class="offer-experience-filter-btn" onclick="offersExperience.filterOffers('falaj')">🍽️ Falaj</button>
            <button class="offer-experience-filter-btn" onclick="offersExperience.filterOffers('sarab')">🍸 Sarab</button>
            <button class="offer-experience-filter-btn" onclick="offersExperience.filterOffers('alrodah')">🕌 Al Rodah</button>
            <button class="offer-experience-filter-btn" onclick="offersExperience.filterOffers('spa')">💆 Spa</button>
        `;
        
        container.appendChild(filtersDiv);
        
        this.renderOffers();
    }
    
    renderOffers() {
        const container = document.getElementById('offersContainer');
        if (!container) return;
        
        // Supprimer les anciennes cartes mais garder les filtres
        const filters = container.querySelector('.offer-experience-filters');
        container.innerHTML = '';
        if (filters) container.appendChild(filters);
        
        const filtered = this.currentFilter === 'all' 
            ? this.offers 
            : this.offers.filter(o => o.category === this.currentFilter);
        
        filtered.forEach((offer, index) => {
            const card = document.createElement('div');
            card.className = 'offer-experience-card';
            card.style.animationDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <div style="position: relative; overflow: hidden;">
                    <img src="${offer.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600'}" 
                         alt="${offer.title}" 
                         onerror="this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600'">
                    <span class="offer-experience-badge">${offer.badge || 'Special'}</span>
                </div>
                <div style="padding: 15px;">
                    <span class="offer-experience-venue">${offer.venue || 'Remal Hotel'}</span>
                    <h3 style="font-family: 'Cinzel', serif; font-size: 15px; font-weight: bold; color: #DCA773; margin-bottom: 5px;">
                        ${offer.title}
                    </h3>
                    <p style="font-size: 10px; color: #a8a29e; margin-bottom: 12px;">
                        ${offer.description || ''}
                    </p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-family: 'Cinzel', serif; font-size: 16px; font-weight: bold; color: #DCA773;">
                            ${offer.price || 'N/A'}
                        </span>
                        <button onclick="offersExperience.showDetail('${offer.id}')" style="
                            background: #DCA773;
                            color: #000;
                            border: none;
                            padding: 8px 18px;
                            border-radius: 20px;
                            font-weight: bold;
                            font-size: 10px;
                            cursor: pointer;
                        ">Discover →</button>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', () => this.showDetail(offer.id));
            container.appendChild(card);
        });
    }
    
    filterOffers(category) {
        this.currentFilter = category;
        
        document.querySelectorAll('.offer-experience-filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Activer le bon bouton
        const buttons = document.querySelectorAll('.offer-experience-filter-btn');
        const categoryMap = {
            'all': 0,
            'falaj': 1,
            'sarab': 2,
            'alrodah': 3,
            'spa': 4
        };
        const index = categoryMap[category] || 0;
        if (buttons[index]) buttons[index].classList.add('active');
        
        this.renderOffers();
    }
    
    showDetail(offerId) {
        const offer = this.offers.find(o => String(o.id) === String(offerId));
        if (!offer) return;
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.9);
            padding: 20px;
            animation: fadeIn 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="
                background: #1c1917;
                border: 2px solid #DCA773;
                border-radius: 20px;
                max-width: 450px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
                animation: slideUp 0.4s ease;
            ">
                <div style="position: relative;">
                    <img src="${offer.image_url || ''}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 20px 20px 0 0;">
                    <button onclick="this.closest('div[style*=fixed]').remove()" style="
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        background: rgba(0,0,0,0.7);
                        color: #DCA773;
                        border: 1px solid #DCA773;
                        border-radius: 50%;
                        width: 35px;
                        height: 35px;
                        cursor: pointer;
                    ">✕</button>
                </div>
                <div style="padding: 20px;">
                    <span class="offer-experience-venue">${offer.venue || 'Remal Hotel'}</span>
                    <h2 style="font-family: 'Cinzel', serif; font-size: 20px; font-weight: bold; color: #DCA773; margin: 10px 0;">
                        ${offer.title}
                    </h2>
                    <p style="font-size: 11px; color: #a8a29e; line-height: 1.6; margin-bottom: 15px;">
                        ${offer.details || offer.description || ''}
                    </p>
                    <div style="border-top: 1px solid rgba(220,167,115,0.2); padding-top: 15px; text-align: center;">
                        <span style="font-family: 'Cinzel', serif; font-size: 22px; font-weight: bold; color: #DCA773;">
                            ${offer.price || 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
        `;
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        document.body.appendChild(modal);
    }
}

// ==================== INITIALISATION ET INTÉGRATION FORCÉE ====================
document.addEventListener('DOMContentLoaded', () => {
    window.offersExperience = new OffersExperience();
    
    // Écraser la fonction fetchOffers existante
    window.fetchOffers = function() {
        if (window.offersExperience) {
            window.offersExperience.enhanceOffersContainer();
        }
    };
    
    // Attendre que tout soit chargé puis forcer l'affichage
    setTimeout(() => {
        if (window.offersExperience) {
            console.log('🔄 Intégration OffersExperience forcée');
            window.offersExperience.enhanceOffersContainer();
        }
    }, 3000);
});
