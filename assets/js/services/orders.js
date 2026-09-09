// ==================== ORDER MANAGEMENT ====================
async function submitRoomServiceOrder(method) {
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    const instructions = document.getElementById('guestSpecialInstructions').value.trim();
    if (!isGuestVerified) { showToast('Please verify first', 'error'); return; }
    if (Object.keys(menuCart).length === 0) { showToast('Select at least one item', 'error'); return; }

    let itemsArray = [];
    let totalAmount = 0;
    for (const [itemId, qty] of Object.entries(menuCart)) {
        const item = typeof findMenuItem === 'function' ? findMenuItem(itemId) : null;
        if (item) {
            itemsArray.push({ name: item.name, quantity: qty, price: item.price, total: qty * item.price });
            totalAmount += qty * item.price;
        }
    }

    const orderData = {
        room_number: String(room),
        guest_name: cachedGuestData?.guest_name || 'Guest',
        items: itemsArray,
        special_instructions: instructions,
        total_amount: totalAmount,
        status: 'Pending',
        // CORRECTION : Utiliser ISO string au lieu de toLocaleString
        created_at: new Date().toISOString()
    };

    try {
        if (supabaseClient) {
            const { data, error } = await supabaseClient.from('food_orders').insert([orderData]).select();
            if (error) { showToast('Error: ' + error.message, 'error'); return; }
            if (data && data.length > 0) {
                currentOrderId = data[0].id;
                localStorage.setItem('remal_current_order_id', currentOrderId);
                updateOrderTracking('Pending');
            }
        }

        if (method === 'whatsapp') {
            const itemsList = itemsArray.map(i => `${i.quantity}x ${i.name} (AED ${i.total})`).join('\n');
            const message = `🛎️ ORDER\n\nRoom: ${room}\nGuest: ${cachedGuestData?.guest_name || 'Guest'}\n\n${itemsList}\n\nTotal: AED ${totalAmount.toFixed(2)}`;
            const waNum = (typeof SUPABASE_CONFIG !== 'undefined' && SUPABASE_CONFIG.whatsappNumber) ? SUPABASE_CONFIG.whatsappNumber : '971526966865';
            window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(message)}`, '_blank');
        }
        showToast('✅ Order submitted!', 'success');
        menuCart = {};
        document.getElementById('guestSpecialInstructions').value = '';
        renderMenuItems();
    } catch (err) { showToast('Error: ' + err.message, 'error'); }
}

function updateOrderTracking(status) {
    const trackingSection = document.getElementById('orderTrackingSection');
    if (!trackingSection) return;
    trackingSection.classList.remove('hidden');
    
    if (trackingTimeout) clearTimeout(trackingTimeout);
    
    const statusMap = {
        'Pending': { step: 'received', text: TRANSLATIONS[currentLanguage].orderReceived, color: 'text-amber-400' },
        'Preparing': { step: 'preparing', text: TRANSLATIONS[currentLanguage].beingPrepared, color: 'text-blue-400' },
        'Ready': { step: 'ready', text: TRANSLATIONS[currentLanguage].readyForDelivery, color: 'text-purple-400' },
        'Delivered': { step: 'delivered', text: TRANSLATIONS[currentLanguage].orderDelivered, color: 'text-emerald-400' },
        'Completed': { step: 'delivered', text: TRANSLATIONS[currentLanguage].orderDelivered, color: 'text-emerald-400' }
    };
    
    const config = statusMap[status] || statusMap['Pending'];
    const statusTextEl = document.getElementById('orderStatusText');
    if (statusTextEl) {
        statusTextEl.innerText = config.text;
        statusTextEl.className = `text-[10px] font-bold ${config.color}`;
    }
    
    const steps = ['received', 'preparing', 'ready', 'delivered'];
    const currentIndex = steps.indexOf(config.step);
    
    steps.forEach((step, index) => {
        const stepCapitalized = step.charAt(0).toUpperCase() + step.slice(1);
        const dot = document.getElementById(`step${stepCapitalized}`);
        const line = document.getElementById(`line${stepCapitalized}`);
        const label = document.getElementById(`label${stepCapitalized}`);
        
        if (dot) {
            if (index <= currentIndex) dot.classList.add('completed', 'active');
            else dot.classList.remove('completed', 'active');
        }
        if (line) {
            if (index < currentIndex) line.classList.add('completed');
            else line.classList.remove('completed');
        }
        if (label) {
            if (index <= currentIndex) label.classList.add('active');
            else label.classList.remove('active');
        }
    });
}

async function verifierEtRestaurerCommandeEnCours() {
    const savedOrderId = localStorage.getItem('remal_current_order_id');
    if (!savedOrderId || !supabaseClient) return;

    try {
        const { data, error } = await supabaseClient
            .from('food_orders')
            .select('status, created_at')
            .eq('id', savedOrderId)
            .maybeSingle();

        if (error || !data) {
            localStorage.removeItem('remal_current_order_id');
            return;
        }

        showService('room_service');
        updateOrderTracking(data.status || 'Pending');
    } catch (err) {}
}

// ==================== ORDER HISTORY ====================
async function fetchOrderHistory() {
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    const container = document.getElementById('orderHistoryContainer');
    if (!room || !supabaseClient || !container) return;
    
    const { data } = await supabaseClient.from('food_orders').select('*').eq('room_number', String(room)).order('created_at', { ascending: false }).limit(20);
    
    if (!data || data.length === 0) {
        container.innerHTML = '<p class="text-center text-stone-400 py-6">No orders yet</p>';
        return;
    }
    
    container.innerHTML = data.map(order => {
        let itemsList = '';
        try { itemsList = (typeof order.items === 'string' ? JSON.parse(order.items) : order.items).map(i => `${i.quantity}x ${i.name}`).join(', '); } catch(e) {}
        
        // CORRECTION : Formater l'heure correctement
        let timeDisplay = '';
        if (order.created_at) {
            const orderTime = new Date(order.created_at);
            const now = new Date();
            const diffMs = now.getTime() - orderTime.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            
            if (diffMins < 1) {
                timeDisplay = 'Just now';
            } else if (diffMins < 60) {
                timeDisplay = `${diffMins} min ago`;
            } else if (diffMins < 1440) {
                const hours = Math.floor(diffMins / 60);
                timeDisplay = `${hours} hour${hours > 1 ? 's' : ''} ago`;
            } else {
                timeDisplay = orderTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
            }
        }
        
        return `
            <div class="p-3 bg-stone-950/60 border border-stone-800 rounded-xl">
                <div class="flex justify-between">
                    <p class="font-bold text-stone-100 text-xs">🛎️ #${String(order.id).slice(-6)}</p>
                    <span class="text-[9px] text-stone-400">${order.status}</span>
                </div>
                <p class="text-[9px] text-stone-400 mt-1">${itemsList}</p>
                <p class="text-[10px] font-bold text-[var(--text-gold,#DCA773)] mt-2">AED ${(order.total_amount || 0).toFixed(2)}</p>
                <p class="text-[8px] text-stone-500 mt-1">${timeDisplay}</p>
            </div>
        `;
    }).join('');
}

function showOrderHistory() {
    document.getElementById('servicesSection').classList.add('hidden');
    document.getElementById('offersSection').classList.add('hidden');
    document.getElementById('faqSection').classList.add('hidden');
    document.getElementById('orderHistorySection').classList.remove('hidden');
    
    document.getElementById('tabServices').classList.remove('active');
    document.getElementById('tabOffers').classList.remove('active');
    document.getElementById('tabFaq').classList.remove('active');
    document.getElementById('tabHistory').classList.add('active');
    
    fetchOrderHistory();
}

window.fetchOrderHistory = fetchOrderHistory;
window.showOrderHistory = showOrderHistory;
window.submitRoomServiceOrder = submitRoomServiceOrder;
window.updateOrderTracking = updateOrderTracking;
window.verifierEtRestaurerCommandeEnCours = verifierEtRestaurerCommandeEnCours;
