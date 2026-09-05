// ==================== OFFERS SERVICE ====================
let offerNotificationChannel = null;

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
            
            // Mettre en cache pour le mode hors-ligne
            if (typeof cacheOffersData === 'function') {
                cacheOffersData(data);
            }
            
            // Démarrer les notifications pour les nouvelles offres
            startOfferNotifications();
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
        container.innerHTML = `<div class="text-center py-8"><i class="fas fa-tags text-3xl text-stone-600 mb-2"></i><p class="text-[10px] text-stone-400">${TRANSLATIONS[currentLanguage]?.noOffers || TRANSLATIONS.en.noOffers}</p></div>`;
        return;
    }
    
    const firstOffer = offers[0];
    const otherOffers = offers.slice(1);
    let html = `
        <div class="featured-offer" onclick="viewOfferDetails('${firstOffer.id}')">
            <img src="${firstOffer.image || 'assets/images/placeholder.jpg'}" alt="${firstOffer.title}" onerror="this.onerror=null;this.src='https://via.placeholder.com/400x200?text=Remal+Offer'">
            <div class="featured-offer-overlay">
                <span class="inline-block text-[8px] bg-[var(--text-gold,#DCA773)] text-stone-950 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1">${TRANSLATIONS[currentLanguage]?.featured || TRANSLATIONS.en.featured}</span>
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
                <div class="offer-card remal-card rounded-2xl overflow-hidden cursor-pointer bg-stone-950/60 border border-stone-800" onclick="viewOfferDetails('${offer.id}')">
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

function viewOfferDetails(offerId) {
    const offer = currentOffers.find(o => o.id === offerId);
    if (!offer) return;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 z-[400] flex items-center justify-center p-4 backdrop-blur-sm';
    modal.id = 'offerDetailsModal';
    
    modal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl">
            <img src="${offer.image || 'assets/images/placeholder.jpg'}" alt="${offer.title}" class="w-full h-40 object-cover" onerror="this.onerror=null;this.src='https://via.placeholder.com/400x200?text=Remal+Offer'">
            
            <div class="p-5 space-y-3">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm font-serif-luxury font-bold text-[var(--text-gold,#DCA773)]">${offer.title}</p>
                        <p class="text-[9px] text-stone-400 uppercase tracking-wider">${offer.category || 'Special'}</p>
                    </div>
                    <button onclick="closeOfferDetails()" class="text-stone-400 hover:text-stone-100 text-xl font-bold">✕</button>
                </div>
                
                <p class="text-[10px] text-stone-300">${offer.description}</p>
                
                <div class="bg-stone-950/60 border border-amber-500/20 rounded-2xl p-3 space-y-2">
                    <div class="flex justify-between">
                        <span class="text-[10px] text-stone-400">Price</span>
                        <span class="text-sm font-bold text-[var(--text-gold,#DCA773)]">${offer.price}</span>
                    </div>
                    ${offer.valid_until ? `
                        <div class="flex justify-between">
                            <span class="text-[10px] text-stone-400">Valid until</span>
                            <span class="text-[10px] font-bold text-stone-200">${new Date(offer.valid_until).toLocaleDateString()}</span>
                        </div>
                    ` : ''}
                </div>
                
                <button onclick="bookOffer('${offer.id}')" class="w-full bg-[#DCA773] hover:bg-[#ebd0b3] text-stone-950 font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest transition">
                    <i class="fas fa-bookmark mr-1"></i> Book This Offer
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeOfferDetails() {
    const modal = document.getElementById('offerDetailsModal');
    if (modal) modal.remove();
}

function bookOffer(offerId) {
    closeOfferDetails();
    
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    if (!room) {
        showToast('Please verify your room first', 'error');
        return;
    }
    
    // Créer une demande de service pour l'offre
    const offer = currentOffers.find(o => o.id === offerId);
    if (!offer) return;
    
    const requestData = {
        room_number: String(room),
        guest_name: cachedGuestData?.guest_name || 'Guest',
        service_type: `Offer Booking: ${offer.title}`,
        details: `Price: ${offer.price}\nCategory: ${offer.category || 'Special'}`,
        status: 'Pending',
        created_at: new Date().toISOString()
    };
    
    try {
        if (supabaseClient) {
            supabaseClient.from('guest_requests').insert([requestData]).then(({ error }) => {
                if (error) {
                    showToast('Error: ' + error.message, 'error');
                    return;
                }
            });
        }
        showToast('✅ Offer booked! Our team will contact you.', 'success');
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
}

// ==================== NOTIFICATIONS POUR NOUVELLES OFFRES ====================
function startOfferNotifications() {
    if (!supabaseClient) return;
    
    if (offerNotificationChannel) {
        supabaseClient.removeChannel(offerNotificationChannel);
    }
    
    offerNotificationChannel = supabaseClient
        .channel('new-offers-notifications')
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'offers',
            filter: 'is_active=eq.true'
        }, (payload) => {
            const newOffer = payload.new;
            if (newOffer) {
                showNewOfferNotification(newOffer);
            }
        })
        .subscribe();
}

function showNewOfferNotification(offer) {
    showEnhancedToast('🎁', 'New Offer Available!', offer.title, 'success');
    
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🎁 New Offer Available!', {
            body: offer.title,
            icon: '/assets/images/logo.png'
        });
    }
    
    // Rafraîchir les offres
    fetchOffers();
}
