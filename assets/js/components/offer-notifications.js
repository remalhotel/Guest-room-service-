// ==================== OFFER NOTIFICATIONS ====================
let offerNotificationChannel = null;

function initOfferNotifications() {
    if (!window.supabaseClient) return;
    
    if (offerNotificationChannel) {
        window.supabaseClient.removeChannel(offerNotificationChannel);
    }
    
    offerNotificationChannel = window.supabaseClient
        .channel('offer-notifications')
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'offers'
        }, (payload) => {
            const newOffer = payload.new;
            if (newOffer && newOffer.is_active) {
                showNewOfferNotification(newOffer);
            }
        })
        .subscribe();
}

function showNewOfferNotification(offer) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification toast-in';
    toast.style.borderColor = '#10b981';
    
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <span class="text-2xl">🎁</span>
            <div>
                <p class="text-xs font-bold text-stone-100">New Offer!</p>
                <p class="text-[10px] text-stone-300">${offer.title} - ${offer.price}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
    
    // Notification système
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🎁 New Offer!', {
            body: `${offer.title} - ${offer.price}`,
            icon: 'logo.png'
        });
    }
    
    // Rafraîchir les offres
    if (typeof fetchOffers === 'function') fetchOffers();
}

window.initOfferNotifications = initOfferNotifications;
window.showNewOfferNotification = showNewOfferNotification;
