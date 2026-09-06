// ==================== ORDER MANAGEMENT ====================
async function submitRoomServiceOrder(method) {
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    const instructions = document.getElementById('guestSpecialInstructions').value.trim();
    if (!isGuestVerified) { 
        showToast('Please verify first', 'error'); 
        return; 
    }
    if (Object.keys(menuCart).length === 0) { 
        showToast('Select at least one item', 'error'); 
        return; 
    }

    showOrderSummary(method, room, instructions);
}

function showOrderSummary(method, room, instructions) {
    let itemsArray = [];
    let totalAmount = 0;
    let totalPrepTime = 0;
    
    for (const [itemId, qty] of Object.entries(menuCart)) {
        const item = typeof findMenuItem === 'function' ? findMenuItem(itemId) : null;
        if (item) {
            itemsArray.push({ name: item.name, quantity: qty, price: item.price, total: qty * item.price, prepTime: item.prepTime || '20m' });
            totalAmount += qty * item.price;
            const prepMinutes = parseInt(item.prepTime || '20');
            totalPrepTime = Math.max(totalPrepTime, prepMinutes * qty);
        }
    }
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 z-[600] flex items-center justify-center p-4 backdrop-blur-sm';
    modal.id = 'orderSummaryModal';
    
    modal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl max-h-[80vh] flex flex-col">
            <div class="flex justify-between items-center border-b border-stone-800 pb-3">
                <h3 class="text-xs font-serif-luxury font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-widest">
                    🛎️ Order Summary
                </h3>
                <button onclick="closeOrderSummary()" class="text-stone-400 hover:text-stone-100 text-xl font-bold">✕</button>
            </div>
            
            <div class="flex-1 overflow-y-auto space-y-2 pr-1">
                ${itemsArray.map(item => `
                    <div class="flex justify-between items-center p-2.5 bg-stone-950/60 border border-stone-800 rounded-xl">
                        <div>
                            <p class="font-bold text-stone-100 text-xs">${item.quantity}x ${item.name}</p>
                            <p class="text-[8px] text-stone-400">⏱️ ~${item.prepTime} prep time</p>
                        </div>
                        <p class="font-bold text-[var(--text-gold,#DCA773)] text-xs">AED ${item.total.toFixed(2)}</p>
                    </div>
                `).join('')}
                
                ${instructions ? `
                    <div class="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <p class="text-[9px] text-stone-400 font-bold uppercase">Special Instructions</p>
                        <p class="text-[10px] text-stone-200 mt-1">${instructions}</p>
                    </div>
                ` : ''}
            </div>
            
            <div class="border-t border-stone-800 pt-3 space-y-3">
                <div class="flex justify-between items-center">
                    <span class="text-[10px] text-stone-400">Total Items</span>
                    <span class="text-xs font-bold text-stone-100">${itemsArray.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[10px] text-stone-400">Estimated Time</span>
                    <span class="text-xs font-bold text-amber-400">⏱️ ~${totalPrepTime} minutes</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[10px] text-stone-400">Total Amount</span>
                    <span class="text-sm font-serif-luxury font-bold text-[var(--text-gold,#DCA773)]">AED ${totalAmount.toFixed(2)}</span>
                </div>
                
                <div class="flex gap-2">
                    <button onclick="closeOrderSummary()" class="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold py-3.5 rounded-2xl text-xs uppercase tracking-widest transition">
                        Cancel
                    </button>
                    <button onclick="confirmOrder('${method}')" class="flex-1 bg-[#DCA773] hover:bg-[#ebd0b3] text-stone-950 font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest transition">
                        ${method === 'whatsapp' ? 'Send via WhatsApp' : 'Confirm Order'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeOrderSummary() {
    const modal = document.getElementById('orderSummaryModal');
    if (modal) modal.remove();
}

async function confirmOrder(method) {
    closeOrderSummary();
    
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    const instructions = document.getElementById('guestSpecialInstructions').value.trim();
    
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

    const orderData = {
        room_number: String(room),
        guest_name: cachedGuestData?.guest_name || 'Guest',
        items: itemsArray,
        special_instructions: instructions,
        total_amount: totalAmount,
        status: 'Pending',
        created_at: new Date().toISOString()
    };

    try {
        if (supabaseClient) {
            const { data, error } = await supabaseClient.from('food_orders').insert([orderData]).select();
            if (error) { 
                showToast('Error: ' + error.message, 'error'); 
                return; 
            }
            if (data && data.length > 0) {
                currentOrderId = data[0].id;
                localStorage.setItem('remal_current_order_id', currentOrderId);
                updateOrderTracking('Pending');
                
                if (typeof startOrderNotifications === 'function') {
                    startOrderNotifications(currentOrderId);
                }
            }
        } else {
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
            if (index <= currentIndex) {
                dot.classList.add('completed', 'active');
            } else {
                dot.classList.remove('completed', 'active');
            }
        }
        if (line) {
            if (index < currentIndex) {
                line.classList.add('completed');
            } else {
                line.classList.remove('completed');
            }
        }
        if (label) {
            if (index <= currentIndex) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        }
    });
    
    if (status === 'Delivered' || status === 'Completed') {
        if (typeof stopOrderNotifications === 'function') {
            stopOrderNotifications();
        }
        trackingTimeout = setTimeout(() => {
            trackingSection.classList.add('hidden');
            localStorage.removeItem('remal_current_order_id');
            currentOrderId = null;
            if (typeof fetchOrderHistory === 'function') {
                fetchOrderHistory();
            }
        }, 20 * 60 * 1000);
    }
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

        if (data.status === 'Delivered' || data.status === 'Completed') {
            const updatedAt = new Date(data.created_at).getTime();
            const now = new Date().getTime();
            if (now - updatedAt > 20 * 60 * 1000) {
                localStorage.removeItem('remal_current_order_id');
                return;
            }
        }

        showService('room_service');
        updateOrderTracking(data.status || 'Pending');
        
        if (typeof startOrderNotifications === 'function') {
            startOrderNotifications(savedOrderId);
        }
    } catch (err) {
        console.warn('Error checking order:', err);
    }
}

// ==================== ORDER HISTORY ====================
async function fetchOrderHistory() {
    console.log('📜 fetchOrderHistory called');
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    if (!room || !supabaseClient) {
        console.warn('⚠️ No room or no supabaseClient');
        return;
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('food_orders')
            .select('*')
            .eq('room_number', String(room))
            .order('created_at', { ascending: false })
            .limit(20);
            
        if (error) {
            console.error('❌ Error fetching history:', error);
            return;
        }
        
        console.log('✅ History fetched:', data?.length || 0, 'orders');
        window.orderHistory = data || [];
        renderOrderHistory();
    } catch (err) {
        console.error('❌ Exception fetching history:', err);
        window.orderHistory = [];
        renderOrderHistory();
    }
}

function renderOrderHistory() {
    console.log('📜 renderOrderHistory called');
    const container = document.getElementById('orderHistoryContainer');
    if (!container) {
        console.error('❌ orderHistoryContainer not found');
        return;
    }
    
    const orders = window.orderHistory || [];
    console.log('📦 Orders to render:', orders.length);
    
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
            'Completed': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: '✅' },
            'Cancelled': { bg: 'bg-red-500/20', text: 'text-red-400', icon: '❌' }
        };
        const sc = statusColors[order.status] || statusColors['Pending'];
        const date = new Date(order.created_at).toLocaleDateString();
        const time = new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        let itemsList = '';
        try {
            const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
            if (Array.isArray(items)) {
                itemsList = items.map(item => `${item.quantity}x ${item.name}`).join(', ');
            }
        } catch (e) {
            itemsList = 'Items';
        }
        
        return `
            <div class="p-3 bg-stone-950/60 border border-stone-800 rounded-xl hover:border-amber-500/30 transition">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex-1">
                        <p class="font-bold text-stone-100 text-xs">🛎️ Order #${String(order.id).slice(-6)}</p>
                        <p class="text-[9px] text-stone-400 mt-1">${date} at ${time}</p>
                    </div>
                    <span class="text-[9px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}">
                        ${sc.icon} ${order.status}
                    </span>
                </div>
                
                <div class="bg-stone-900/50 rounded-lg p-2 mb-2">
                    <p class="text-[9px] text-stone-400 line-clamp-2">${itemsList}</p>
                </div>
                
                <div class="flex justify-between items-center">
                    <span class="text-[10px] font-bold text-[var(--text-gold,#DCA773)]">
                        AED ${(order.total_amount || 0).toFixed(2)}
                    </span>
                    ${order.status === 'Pending' || order.status === 'Preparing' ? `
                        <button onclick="trackOrder('${order.id}')" class="text-[9px] text-blue-400 hover:text-blue-300">
                            <i class="fas fa-satellite-dish mr-1"></i> Track
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function trackOrder(orderId) {
    currentOrderId = orderId;
    localStorage.setItem('remal_current_order_id', orderId);
    showService('room_service');
    
    if (typeof startOrderNotifications === 'function') {
        startOrderNotifications(orderId);
    }
    
    verifierEtRestaurerCommandeEnCours();
}

function showOrderHistory() {
    console.log('📜 showOrderHistory called');
    
    // Masquer toutes les sections
    document.getElementById('servicesSection').classList.add('hidden');
    document.getElementById('offersSection').classList.add('hidden');
    document.getElementById('faqSection').classList.add('hidden');
    document.getElementById('favoritesSection').classList.add('hidden');
    
    // Afficher la section historique
    const historySection = document.getElementById('orderHistorySection');
    if (historySection) {
        historySection.classList.remove('hidden');
    } else {
        console.error('❌ orderHistorySection not found');
    }
    
    // Mettre à jour les onglets
    document.getElementById('tabServices').classList.remove('active');
    document.getElementById('tabOffers').classList.remove('active');
    document.getElementById('tabFaq').classList.remove('active');
    document.getElementById('tabFavorites').classList.remove('active');
    document.getElementById('tabHistory').classList.add('active');
    
    // Charger l'historique
    fetchOrderHistory();
}
