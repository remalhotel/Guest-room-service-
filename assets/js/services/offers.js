// ==================== OFFERS SERVICE ====================
async function fetchOffers() {
    if (!supabaseClient) { 
        renderOffers([]); 
        return; 
    }
    try {
        const { data, error } = await supabaseClient
            .from('offers')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(10);
        if (data && data.length > 0) { 
            currentOffers = data; 
            renderOffers(data); 
        } else { 
            renderOffers([]); 
        }
    } catch (err) { 
        console.warn('Erreur lors du chargement des offres:', err);
        renderOffers([]); 
    }
}

function renderOffers(offers) {
    const container = document.getElementById('offersContainer');
    if (!container) return;
    
    if (!offers || offers.length === 0) {
        container.innerHTML = `<div class="text-center py-8"><i class="fas fa-tags text-3xl text-stone-600 mb-2"></i><p class="text-[10px] text-stone-400">${TRANSLATIONS[currentLanguage].noOffers}</p></div>`;
        return;
    }
    
    const firstOffer = offers[0];
    const otherOffers = offers.slice(1);
    let html = `
        <div class="featured-offer">
            <img src="${firstOffer.image || 'assets/images/placeholder.jpg'}" alt="${firstOffer.title}" onerror="this.onerror=null;this.src='https://via.placeholder.com/400x200?text=Remal+Offer'">
            <div class="featured-offer-overlay">
                <span class="inline-block text-[8px] bg-[var(--text-gold,#DCA773)] text-stone-950 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1">${TRANSLATIONS[currentLanguage].featured}</span>
                <p class="text-sm font-serif-luxury font-bold text-white">${firstOffer.title}</p>
                <p class="text-[10px] text-stone-300">${firstOffer.description}</p>
                <p class="text-lg font-serif-luxury font-bold text-[var(--text-gold,#DCA773)] mt-1">${firstOffer.price}</p>
            </div>
        </div>
    `;
    
    if (otherOffers.length > 0) {
        html += `<div class="grid grid-cols-2 gap-3">`;
        otherOffers.forEach(offer => {
            html += `
                <div class="offer-card remal-card rounded-2xl overflow-hidden cursor-pointer bg-stone-950/60 border border-stone-800">
                    <img src="${offer.image || 'assets/images/placeholder.jpg'}" alt="${offer.title}" class="w-full h-24 object-cover" onerror="this.onerror=null;this.src='https://via.placeholder.com/200x100?text=Remal+Offer'">
                    <div class="p-3 space-y-1">
                        <p class="text-[10px] font-bold text-stone-100">${offer.title}</p>
                        <p class="text-[8px] text-stone-400">${offer.category || 'Special'}</p>
                        <p class="text-xs font-serif-luxury font-bold text-[var(--text-gold,#DCA773)]">${offer.price}</p>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    }
    container.innerHTML = html;
}
