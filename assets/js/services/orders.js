// ==================== ORDER MANAGEMENT ====================
const supabaseClient = window.supabaseClient || initSupabaseClient();
async function submitRoomServiceOrder(method) {
    console.log('🔍 submitRoomServiceOrder called, method:', method);
    
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    const instructions = document.getElementById('guestSpecialInstructions')?.value?.trim() || '';
    
    if (!isGuestVerified) { 
        showToast('Please verify first', 'error'); 
        return; 
    }
    if (Object.keys(menuCart).length === 0) { 
        showToast('Select at least one item', 'error'); 
        return; 
    }
    if (!supabaseClient) {
        console.error('❌ supabaseClient is NULL');
        showToast('Error: Supabase not initialized', 'error');
        return;
    }
    
    let itemsArray = [];
    let totalAmount = 0;
    
    for (const [itemId, qty] of Object.entries(menuCart)) {
        const item = typeof findMenuItem === 'function' ? findMenuItem(itemId) : null;
        if (item) {
            itemsArray.push({ name: item.name, quantity: qty, price: item.price, total: qty * item.price });
            totalAmount += qty * item.price;
        } else {
            itemsArray.push({ name: itemId, quantity: qty, price: 0, total: 0 });
        }
    }
    
    console.log('📦 Room:', room);
    console.log('🛒 Items:', JSON.stringify(itemsArray));
    console.log('💰 Total:', totalAmount);
    
    const orderData = {
        room_number: String(room),
        guest_name: cachedGuestData?.guest_name || 'Guest',
        items: itemsArray,
        special_instructions: instructions,
        total_amount: totalAmount,
        status: 'Pending',
        service_type: 'Room Service / Order Food',
        created_at: new Date().toISOString()
    };
    
    console.log('📤 Sending to Supabase...');
    
    try {
        const { data, error } = await supabaseClient
            .from('food_orders')
            .insert([orderData])
            .select();
            
        if (error) {
            console.error('❌ Supabase error:', error.message);
            showToast('Error: ' + error.message, 'error');
            return;
        }
        
        console.log('✅ Order inserted successfully:', data);
        
        if (data && data.length > 0) {
            currentOrderId = data[0].id;
            localStorage.setItem('remal_current_order_id', currentOrderId);
            updateOrderTracking('Pending');
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
        
        if (typeof fetchOrderHistory === 'function') {
            fetchOrderHistory();
        }
        
    } catch (err) {
        console.error('❌ Exception:', err);
        showToast('Error: ' + err.message, 'error');
    }
}

function updateOrderTracking(status) {
    const trackingSection = document.getElementById('orderTrackingSection');
    if (!trackingSection) return;
    trackingSection.classList.remove('hidden');
    
    if (trackingTimeout) clearTimeout(trackingTimeout);
    
    const statusMap = {
        'Pending': { step: 'received', text: 'Order Received', color: 'text-amber-400' },
        'Preparing': { step: 'preparing', text: 'Being Prepared', color: 'text-blue-400' },
        'Ready': { step: 'ready', text: 'Ready for Delivery', color: 'text-purple-400' },
        'Delivered': { step: 'delivered', text: 'Delivered', color: 'text-emerald-400' },
        'Completed': { step: 'delivered', text: 'Delivered', color: 'text-emerald-400' }
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
    } catch (err) {
        console.warn('Error checking order:', err);
    }
}

// ==================== ORDER HISTORY ====================
async function fetchOrderHistory() {
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    if (!room || !supabaseClient) return;
    
    try {
        const { data, error } = await supabaseClient
            .from('food_orders')
            .select('*')
            .eq('room_number', String(room))
            .order('created_at', { ascending: false })
            .limit(20);
            
        if (error) return;
        window.orderHistory = data || [];
        renderOrderHistory();
    } catch (err) {
        window.orderHistory = [];
        renderOrderHistory();
    }
}

function renderOrderHistory() {
    const container = document.getElementById('orderHistoryContainer');
    if (!container) return;
    
    const orders = window.orderHistory || [];
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="text-center py-6">
                <i class="fas fa-receipt text-3xl text-stone-600 mb-2"></i>
                <p class="text-[10px] text-stone-400">No orders yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = orders.map(order => {
        const statusColors = {
            'Pending': { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: '⏳' },
            'Preparing': { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: '👨‍🍳' },
            'Ready': { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: '🔔' },
            'Delivered': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: '✅' },
            'Completed': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: '✅' }
        };
        const sc = statusColors[order.status] || statusColors['Pending'];
        const date = new Date(order.created_at).toLocaleDateString();
        
        let itemsList = '';
        try {
            const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
            if (Array.isArray(items)) itemsList = items.map(i => `${i.quantity}x ${i.name}`).join(', ');
        } catch (e) { itemsList = 'Items'; }
        
        return `
            <div class="p-3 bg-stone-950/60 border border-stone-800 rounded-xl">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex-1">
                        <p class="font-bold text-stone-100 text-xs">🛎️ Order #${String(order.id).slice(-6)}</p>
                        <p class="text-[9px] text-stone-400">${date}</p>
                    </div>
                    <span class="text-[9px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}">${sc.icon} ${order.status}</span>
                </div>
                <div class="bg-stone-900/50 rounded-lg p-2 mb-2">
                    <p class="text-[9px] text-stone-400 line-clamp-2">${itemsList}</p>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[10px] font-bold text-[var(--text-gold,#DCA773)]">AED ${(order.total_amount || 0).toFixed(2)}</span>
                    <button onclick="reorderFromHistory('${order.id}')" class="text-[9px] text-[var(--text-gold,#DCA773)] font-bold">
                        <i class="fas fa-redo mr-1"></i> Re-order
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function reorderFromHistory(orderId) {
    const order = (window.orderHistory || []).find(o => o.id === orderId);
    if (!order) return;
    
    let itemsData = [];
    try {
        itemsData = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    } catch (e) { return; }
    
    menuCart = {};
    itemsData.forEach(item => {
        if (typeof MENU_DATA !== 'undefined') {
            for (const items of Object.values(MENU_DATA)) {
                const found = items.find(mi => mi.name === item.name);
                if (found) menuCart[found.id] = item.quantity;
            }
        }
    });
    
    showToast('🛒 Items added to cart!', 'success');
    showService('room_service');
    renderMenuItems();
}

function trackOrder(orderId) {
    currentOrderId = orderId;
    localStorage.setItem('remal_current_order_id', orderId);
    showService('room_service');
    verifierEtRestaurerCommandeEnCours();
}

function showOrderHistory() {
    document.getElementById('servicesSection').classList.add('hidden');
    document.getElementById('offersSection').classList.add('hidden');
    document.getElementById('faqSection').classList.add('hidden');
    document.getElementById('favoritesSection').classList.add('hidden');
    document.getElementById('orderHistorySection').classList.remove('hidden');
    
    document.getElementById('tabServices').classList.remove('active');
    document.getElementById('tabOffers').classList.remove('active');
    document.getElementById('tabFaq').classList.remove('active');
    document.getElementById('tabFavorites').classList.remove('active');
    document.getElementById('tabHistory').classList.add('active');
    
    fetchOrderHistory();
}

// ==================== SUGGESTIONS ====================
async function fetchPersonalizedSuggestions() {
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    if (!room || !supabaseClient) return;
    
    try {
        const { data } = await supabaseClient
            .from('food_orders')
            .select('items')
            .eq('room_number', String(room))
            .limit(10);
            
        const itemFrequency = {};
        (data || []).forEach(order => {
            try {
                const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                if (Array.isArray(items)) {
                    items.forEach(item => {
                        if (item.name) itemFrequency[item.name] = (itemFrequency[item.name] || 0) + item.quantity;
                    });
                }
            } catch (e) {}
        });
        
        const sortedItems = Object.entries(itemFrequency).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const suggestions = [];
        
        if (typeof MENU_DATA !== 'undefined') {
            for (const items of Object.values(MENU_DATA)) {
                items.forEach(item => {
                    const match = sortedItems.find(s => s[0] === item.name);
                    if (match) suggestions.push({ ...item, orderCount: match[1] });
                });
            }
        }
        
        renderSuggestions(suggestions);
    } catch (err) {
        renderSuggestions([]);
    }
}

function renderSuggestions(suggestions) {
    const container = document.getElementById('suggestionsContainer');
    if (!container) return;
    
    if (!suggestions || suggestions.length === 0) {
        container.innerHTML = '';
        container.classList.add('hidden');
        return;
    }
    
    container.classList.remove('hidden');
    container.innerHTML = `
        <div class="p-3 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl">
            <span class="text-[10px] font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-wider">
                <i class="fas fa-star mr-1"></i> Recommended For You
            </span>
            <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-none mt-2">
                ${suggestions.map(item => `
                    <div class="min-w-[120px] bg-stone-950/80 border border-stone-700 rounded-xl p-2.5 cursor-pointer" onclick="addSuggestionToCart('${item.id}')">
                        <div class="text-2xl">${item.emoji || '🍽️'}</div>
                        <p class="text-[10px] font-bold text-stone-100 truncate">${item.name}</p>
                        <p class="text-[9px] text-stone-400">AED ${item.price.toFixed(2)}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function addSuggestionToCart(itemId) {
    updateCart(itemId, 1);
    showToast('Added to cart! 🛒', 'success');
}

// ==================== NOTIFICATIONS ====================
let orderNotificationChannel = null;

function startOrderNotifications(orderId) {
    if (!supabaseClient || !orderId) return;
    if (orderNotificationChannel) supabaseClient.removeChannel(orderNotificationChannel);
    
    orderNotificationChannel = supabaseClient
        .channel(`order-${orderId}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'food_orders', filter: `id=eq.${orderId}` }, (payload) => {
            updateOrderTracking(payload.new.status);
        })
        .subscribe();
}

function stopOrderNotifications() {
    if (orderNotificationChannel && supabaseClient) {
        supabaseClient.removeChannel(orderNotificationChannel);
        orderNotificationChannel = null;
    }
}

// ==================== FAMILY ORDER ====================
let familyGroupOrder = { adults: 1, children: 0, infants: 0, items: {}, notes: '' };

function showFamilyOrderModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 z-[700] flex items-center justify-center p-4';
    modal.id = 'familyOrderModal';
    
    modal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-md rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center border-b border-stone-800 pb-3">
                <h3 class="text-xs font-serif-luxury font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-widest">👨‍👩‍👧‍👦 Family Order</h3>
                <button onclick="closeFamilyOrder()" class="text-stone-400 text-xl">✕</button>
            </div>
            <div class="space-y-3">
                <div class="flex justify-between items-center">
                    <span class="text-[10px] text-stone-400">👨 Adults</span>
                    <div class="flex items-center gap-2">
                        <button onclick="adjustFamilyCount('adults', -1)" class="w-7 h-7 bg-stone-800 rounded-lg">-</button>
                        <span id="familyAdultsCount" class="font-bold w-6 text-center">1</span>
                        <button onclick="adjustFamilyCount('adults', 1)" class="w-7 h-7 bg-[#DCA773] text-stone-950 rounded-lg">+</button>
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[10px] text-stone-400">🧒 Children</span>
                    <div class="flex items-center gap-2">
                        <button onclick="adjustFamilyCount('children', -1)" class="w-7 h-7 bg-stone-800 rounded-lg">-</button>
                        <span id="familyChildrenCount" class="font-bold w-6 text-center">0</span>
                        <button onclick="adjustFamilyCount('children', 1)" class="w-7 h-7 bg-[#DCA773] text-stone-950 rounded-lg">+</button>
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[10px] text-stone-400">👶 Infants</span>
                    <div class="flex items-center gap-2">
                        <button onclick="adjustFamilyCount('infants', -1)" class="w-7 h-7 bg-stone-800 rounded-lg">-</button>
                        <span id="familyInfantsCount" class="font-bold w-6 text-center">0</span>
                        <button onclick="adjustFamilyCount('infants', 1)" class="w-7 h-7 bg-[#DCA773] text-stone-950 rounded-lg">+</button>
                    </div>
                </div>
            </div>
            <button onclick="openMenuModal()" class="w-full bg-stone-950 border border-amber-500/30 text-[var(--text-gold,#DCA773)] font-bold py-3 rounded-2xl">
                <i class="fas fa-utensils mr-1"></i> Browse Menu
            </button>
            <textarea id="familyOrderNotes" placeholder="Special notes..." class="w-full h-16 bg-stone-950 border border-stone-800 rounded-2xl p-3 text-xs text-stone-200"></textarea>
            <button onclick="submitFamilyOrder()" class="w-full bg-[#DCA773] text-stone-950 font-black py-4 rounded-2xl text-xs uppercase tracking-widest">
                Submit Family Order
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeFamilyOrder() {
    document.getElementById('familyOrderModal')?.remove();
}

function adjustFamilyCount(type, delta) {
    familyGroupOrder[type] = Math.max(0, familyGroupOrder[type] + delta);
    const map = { adults: 'familyAdultsCount', children: 'familyChildrenCount', infants: 'familyInfantsCount' };
    const el = document.getElementById(map[type]);
    if (el) el.innerText = familyGroupOrder[type];
}

async function submitFamilyOrder() {
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    const totalGuests = familyGroupOrder.adults + familyGroupOrder.children;
    
    if (totalGuests === 0) { showToast('Add at least one adult', 'error'); return; }
    if (Object.keys(familyGroupOrder.items).length === 0) { showToast('Select meals first', 'error'); return; }
    
    let itemsArray = [];
    let totalAmount = 0;
    
    for (const [itemId, qty] of Object.entries(familyGroupOrder.items)) {
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
        special_instructions: `👨‍👩‍👧‍👦 FAMILY ORDER - Adults: ${familyGroupOrder.adults}, Children: ${familyGroupOrder.children}, Infants: ${familyGroupOrder.infants}`,
        total_amount: totalAmount,
        status: 'Pending',
        service_type: 'Room Service / Order Food',
        created_at: new Date().toISOString()
    };
    
    try {
        const { error } = await supabaseClient.from('food_orders').insert([orderData]);
        if (error) { showToast('Error: ' + error.message, 'error'); return; }
        
        closeFamilyOrder();
        showToast(`✅ Family order submitted!`, 'success');
        familyGroupOrder = { adults: 1, children: 0, infants: 0, items: {}, notes: '' };
        menuCart = {};
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
}

// ==================== EXPOSER GLOBALEMENT ====================
window.submitRoomServiceOrder = submitRoomServiceOrder;
window.updateOrderTracking = updateOrderTracking;
window.verifierEtRestaurerCommandeEnCours = verifierEtRestaurerCommandeEnCours;
window.fetchOrderHistory = fetchOrderHistory;
window.renderOrderHistory = renderOrderHistory;
window.reorderFromHistory = reorderFromHistory;
window.trackOrder = trackOrder;
window.showOrderHistory = showOrderHistory;
window.fetchPersonalizedSuggestions = fetchPersonalizedSuggestions;
window.renderSuggestions = renderSuggestions;
window.addSuggestionToCart = addSuggestionToCart;
window.startOrderNotifications = startOrderNotifications;
window.stopOrderNotifications = stopOrderNotifications;
window.showFamilyOrderModal = showFamilyOrderModal;
window.closeFamilyOrder = closeFamilyOrder;
window.adjustFamilyCount = adjustFamilyCount;
window.submitFamilyOrder = submitFamilyOrder;
