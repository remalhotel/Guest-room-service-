// ==================== ORDER MANAGEMENT ====================
const supabaseClient = window.supabaseClient || (typeof initSupabaseClient === 'function' ? initSupabaseClient() : null);

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
        service_type: 'Room Service / Order Food',
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
                    <div class="flex gap-2">
                        ${order.status === 'Pending' || order.status === 'Preparing' ? `
                            <button onclick="trackOrder('${order.id}')" class="text-[9px] text-blue-400 hover:text-blue-300">
                                <i class="fas fa-satellite-dish mr-1"></i> Track
                            </button>
                        ` : ''}
                        <button onclick="reorderFromHistory('${order.id}')" class="text-[9px] text-[var(--text-gold,#DCA773)] hover:text-amber-300 font-bold">
                            <i class="fas fa-redo mr-1"></i> Re-order
                        </button>
                    </div>
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
    } catch (e) {
        showToast('Error parsing order', 'error');
        return;
    }
    
    if (!Array.isArray(itemsData) || itemsData.length === 0) {
        showToast('No items in this order', 'error');
        return;
    }
    
    menuCart = {};
    itemsData.forEach(item => {
        if (typeof MENU_DATA !== 'undefined') {
            for (const [category, menuItems] of Object.entries(MENU_DATA)) {
                const foundItem = menuItems.find(mi => mi.name === item.name);
                if (foundItem) {
                    menuCart[foundItem.id] = item.quantity;
                }
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
    
    if (typeof startOrderNotifications === 'function') {
        startOrderNotifications(orderId);
    }
    
    verifierEtRestaurerCommandeEnCours();
}

function showOrderHistory() {
    document.getElementById('servicesSection').classList.add('hidden');
    document.getElementById('offersSection').classList.add('hidden');
    document.getElementById('faqSection').classList.add('hidden');
    document.getElementById('favoritesSection').classList.add('hidden');
    
    const historySection = document.getElementById('orderHistorySection');
    if (historySection) historySection.classList.remove('hidden');
    
    document.getElementById('tabServices').classList.remove('active');
    document.getElementById('tabOffers').classList.remove('active');
    document.getElementById('tabFaq').classList.remove('active');
    document.getElementById('tabFavorites').classList.remove('active');
    document.getElementById('tabHistory').classList.add('active');
    
    fetchOrderHistory();
}

// ==================== SUGGESTIONS PERSONNALISÉES ====================
async function fetchPersonalizedSuggestions() {
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    if (!room || !supabaseClient) return;
    
    try {
        const { data: orderHistory, error } = await supabaseClient
            .from('food_orders')
            .select('items')
            .eq('room_number', String(room))
            .order('created_at', { ascending: false })
            .limit(10);
            
        if (error) {
            renderSuggestions([]);
            return;
        }
        
        const itemFrequency = {};
        orderHistory?.forEach(order => {
            try {
                const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                if (Array.isArray(items)) {
                    items.forEach(item => {
                        if (item.name) {
                            itemFrequency[item.name] = (itemFrequency[item.name] || 0) + item.quantity;
                        }
                    });
                }
            } catch (e) {}
        });
        
        const sortedItems = Object.entries(itemFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));
        
        const suggestions = [];
        if (typeof MENU_DATA !== 'undefined') {
            for (const [category, items] of Object.entries(MENU_DATA)) {
                items.forEach(item => {
                    const match = sortedItems.find(s => s.name === item.name);
                    if (match) {
                        suggestions.push({ ...item, category, orderCount: match.count, score: 100 });
                    }
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
            <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-wider">
                    <i class="fas fa-star mr-1"></i> Recommended For You
                </span>
            </div>
            <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                ${suggestions.map(item => `
                    <div class="min-w-[120px] bg-stone-950/80 border border-stone-700 rounded-xl p-2.5 flex-shrink-0 cursor-pointer" onclick="addSuggestionToCart('${item.id}')">
                        <div class="text-2xl mb-1">${item.emoji || '🍽️'}</div>
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

function refreshSuggestions() {
    fetchPersonalizedSuggestions();
    showToast('Suggestions refreshed', 'info');
}

// ==================== NOTIFICATIONS TEMPS RÉEL ====================
let orderNotificationChannel = null;

function startOrderNotifications(orderId) {
    if (!supabaseClient || !orderId) return;
    
    if (orderNotificationChannel) {
        supabaseClient.removeChannel(orderNotificationChannel);
    }
    
    orderNotificationChannel = supabaseClient
        .channel(`order-updates-${orderId}`)
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'food_orders',
            filter: `id=eq.${orderId}`
        }, (payload) => {
            const newStatus = payload.new.status;
            if (newStatus !== payload.old.status) {
                handleOrderStatusChange(newStatus);
            }
        })
        .subscribe();
    
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function handleOrderStatusChange(newStatus) {
    updateOrderTracking(newStatus);
    
    const statusMessages = {
        'Pending': { icon: '📝', title: 'Order Received', message: 'Your order has been registered', type: 'info' },
        'Preparing': { icon: '👨‍🍳', title: 'Being Prepared', message: 'The chef is preparing your order', type: 'info' },
        'Ready': { icon: '🔔', title: 'Ready for Delivery', message: 'Your order is ready!', type: 'success' },
        'Delivered': { icon: '✅', title: 'Delivered', message: 'Enjoy your meal!', type: 'success' }
    };
    
    const config = statusMessages[newStatus] || statusMessages['Pending'];
    showEnhancedToast(config.icon, config.title, config.message, config.type);
    playOrderNotificationSound();
    
    if (newStatus === 'Delivered' || newStatus === 'Completed') {
        setTimeout(() => showFeedbackPrompt(), 5000);
        if (typeof fetchOrderHistory === 'function') fetchOrderHistory();
    }
}

function showEnhancedToast(icon, title, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast-notification toast-in';
    toast.style.borderColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#DCA773';
    
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <span class="text-2xl">${icon}</span>
            <div>
                <p class="text-xs font-bold text-stone-100">${title}</p>
                <p class="text-[10px] text-stone-300">${message}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => { 
        toast.style.opacity = '0'; 
        toast.style.transition = 'opacity 0.3s ease'; 
        setTimeout(() => toast.remove(), 300); 
    }, 4000);
}

function playOrderNotificationSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99];
        
        notes.forEach((frequency, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + index * 0.1);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + index * 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.3);
            oscillator.start(audioContext.currentTime + index * 0.1);
            oscillator.stop(audioContext.currentTime + index * 0.1 + 0.3);
        });
    } catch (error) {
        console.warn('Sound not available:', error);
    }
}

function showFeedbackPrompt() {
    const feedbackToast = document.createElement('div');
    feedbackToast.className = 'toast-notification toast-in';
    feedbackToast.style.borderColor = '#DCA773';
    
    feedbackToast.innerHTML = `
        <div class="flex items-center gap-3">
            <span class="text-2xl">⭐</span>
            <div class="flex-1">
                <p class="text-xs font-bold text-stone-100">How was your experience?</p>
                <div class="flex gap-2 mt-2">
                    ${[1, 2, 3, 4, 5].map(star => `
                        <button onclick="submitFeedback(${star})" class="text-xl hover:scale-125 transition">⭐</button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(feedbackToast);
    setTimeout(() => { 
        feedbackToast.style.opacity = '0'; 
        feedbackToast.style.transition = 'opacity 0.3s ease'; 
        setTimeout(() => feedbackToast.remove(), 300); 
    }, 10000);
}

async function submitFeedback(rating) {
    const orderId = currentOrderId;
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    
    if (!orderId || !room) return;
    
    const feedbackData = {
        order_id: orderId,
        room_number: String(room),
        rating: rating,
        feedback_text: '',
        created_at: new Date().toISOString()
    };
    
    try {
        if (supabaseClient) {
            const { error } = await supabaseClient
                .from('order_feedback')
                .insert([feedbackData]);
                
            if (error) {
                showToast('Error saving feedback', 'error');
                return;
            }
        }
        
        document.querySelectorAll('.toast-notification').forEach(t => t.remove());
        showToast(`Thank you for your ${rating} star rating! 🌟`, 'success');
    } catch (error) {
        showToast('Error saving feedback', 'error');
    }
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
    modal.className = 'fixed inset-0 bg-black/90 z-[700] flex items-center justify-center p-4 backdrop-blur-sm';
    modal.id = 'familyOrderModal';
    
    modal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center border-b border-stone-800 pb-3">
                <h3 class="text-xs font-serif-luxury font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-widest">
                    👨‍👩‍👧‍👦 Family Order
                </h3>
                <button onclick="closeFamilyOrder()" class="text-stone-400 hover:text-stone-100 text-xl font-bold">✕</button>
            </div>
            
            <div class="p-3 bg-stone-950/60 border border-stone-800 rounded-2xl space-y-3">
                <p class="text-[10px] font-bold text-[var(--text-gold,#DCA773)] uppercase">Family Composition</p>
                
                <div class="flex justify-between items-center">
                    <span class="text-[10px] text-stone-400">👨 Adults</span>
                    <div class="flex items-center gap-2">
                        <button onclick="adjustFamilyCount('adults', -1)" class="w-7 h-7 bg-stone-800 text-stone-200 rounded-lg font-bold">-</button>
                        <span id="familyAdultsCount" class="font-bold text-stone-100 text-sm w-6 text-center">1</span>
                        <button onclick="adjustFamilyCount('adults', 1)" class="w-7 h-7 bg-[var(--text-gold,#DCA773)] text-stone-950 rounded-lg font-bold">+</button>
                    </div>
                </div>
                
                <div class="flex justify-between items-center">
                    <span class="text-[10px] text-stone-400">🧒 Children (4-12)</span>
                    <div class="flex items-center gap-2">
                        <button onclick="adjustFamilyCount('children', -1)" class="w-7 h-7 bg-stone-800 text-stone-200 rounded-lg font-bold">-</button>
                        <span id="familyChildrenCount" class="font-bold text-stone-100 text-sm w-6 text-center">0</span>
                        <button onclick="adjustFamilyCount('children', 1)" class="w-7 h-7 bg-[var(--text-gold,#DCA773)] text-stone-950 rounded-lg font-bold">+</button>
                    </div>
                </div>
                
                <div class="flex justify-between items-center">
                    <span class="text-[10px] text-stone-400">👶 Infants (0-3)</span>
                    <div class="flex items-center gap-2">
                        <button onclick="adjustFamilyCount('infants', -1)" class="w-7 h-7 bg-stone-800 text-stone-200 rounded-lg font-bold">-</button>
                        <span id="familyInfantsCount" class="font-bold text-stone-100 text-sm w-6 text-center">0</span>
                        <button onclick="adjustFamilyCount('infants', 1)" class="w-7 h-7 bg-[var(--text-gold,#DCA773)] text-stone-950 rounded-lg font-bold">+</button>
                    </div>
                </div>
            </div>
            
            <div>
                <p class="text-[10px] font-bold text-[var(--text-gold,#DCA773)] uppercase mb-2">Select Meals</p>
                <button onclick="openMenuModal()" class="w-full bg-stone-950/60 border border-amber-500/30 text-[var(--text-gold,#DCA773)] font-bold py-3 px-4 rounded-2xl transition">
                    <i class="fas fa-utensils mr-1"></i> Browse Menu
                </button>
                <div id="familySelectedItems" class="mt-2 space-y-2"></div>
            </div>
            
            <div>
                <label class="block font-bold text-[var(--text-gold,#DCA773)] mb-1.5 uppercase tracking-wider text-[10px]">Special Notes</label>
                <textarea id="familyOrderNotes" placeholder="e.g., One child is allergic to nuts..." class="w-full h-16 bg-stone-950 border border-stone-800 rounded-2xl p-3 outline-none resize-none text-xs text-stone-200"></textarea>
            </div>
            
            <button onclick="submitFamilyOrder()" class="w-full bg-[#DCA773] hover:bg-[#ebd0b3] text-stone-950 font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition">
                <i class="fas fa-users mr-1"></i> Submit Family Order
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeFamilyOrder() {
    const modal = document.getElementById('familyOrderModal');
    if (modal) modal.remove();
}

function adjustFamilyCount(type, delta) {
    familyGroupOrder[type] = Math.max(0, familyGroupOrder[type] + delta);
    const countMap = { 'adults': 'familyAdultsCount', 'children': 'familyChildrenCount', 'infants': 'familyInfantsCount' };
    const countEl = document.getElementById(countMap[type]);
    if (countEl) countEl.innerText = familyGroupOrder[type];
}

async function submitFamilyOrder() {
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    const totalGuests = familyGroupOrder.adults + familyGroupOrder.children;
    
    if (totalGuests === 0) { showToast('Please add at least one adult', 'error'); return; }
    if (Object.keys(familyGroupOrder.items).length === 0) { showToast('Please select at least one meal', 'error'); return; }
    
    const notes = document.getElementById('familyOrderNotes')?.value?.trim() || '';
    let itemsArray = [];
    let totalAmount = 0;
    
    for (const [itemId, qty] of Object.entries(familyGroupOrder.items)) {
        const item = typeof findMenuItem === 'function' ? findMenuItem(itemId) : null;
        if (item) {
            itemsArray.push({ name: item.name, quantity: qty, price: item.price, total: qty * item.price });
            totalAmount += qty * item.price;
        }
    }
    
    const familyDetails = `👨‍👩‍👧‍👦 FAMILY ORDER\nAdults: ${familyGroupOrder.adults}\nChildren: ${familyGroupOrder.children}\nInfants: ${familyGroupOrder.infants}${notes ? `\n📝 Notes: ${notes}` : ''}`;
    
    const orderData = {
        room_number: String(room),
        guest_name: cachedGuestData?.guest_name || 'Guest',
        items: itemsArray,
        special_instructions: familyDetails,
        total_amount: totalAmount,
        status: 'Pending',
        service_type: 'Room Service / Order Food',
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
                if (typeof startOrderNotifications === 'function') startOrderNotifications(currentOrderId);
            }
        }
        
        closeFamilyOrder();
        showToast(`✅ Family order for ${totalGuests} guests submitted!`, 'success');
        familyGroupOrder = { adults: 1, children: 0, infants: 0, items: {}, notes: '' };
        menuCart = {};
        if (typeof fetchOrderHistory === 'function') fetchOrderHistory();
        
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
}

// ==================== EXPOSER GLOBALEMENT ====================
window.submitRoomServiceOrder = submitRoomServiceOrder;
window.showOrderSummary = showOrderSummary;
window.closeOrderSummary = closeOrderSummary;
window.confirmOrder = confirmOrder;
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
window.refreshSuggestions = refreshSuggestions;
window.startOrderNotifications = startOrderNotifications;
window.stopOrderNotifications = stopOrderNotifications;
window.submitFeedback = submitFeedback;
window.showFamilyOrderModal = showFamilyOrderModal;
window.closeFamilyOrder = closeFamilyOrder;
window.adjustFamilyCount = adjustFamilyCount;
window.submitFamilyOrder = submitFamilyOrder;
