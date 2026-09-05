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
                
                // Démarrer les notifications en temps réel
                if (typeof startOrderNotifications === 'function') {
                    startOrderNotifications(currentOrderId);
                }
            }
        } else {
            updateOrderTracking('Pending');
            showToast('Mode démo : les notifications sont simulées', 'info');
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
        
        // Rafraîchir l'historique
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
        console.warn('Erreur lors de la vérification de la commande:', err);
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
            
        if (error) {
            console.warn('Erreur lors du chargement de l\'historique:', error);
            return;
        }
        
        window.orderHistory = data || [];
        renderOrderHistory();
    } catch (err) {
        console.warn('Erreur lors du chargement de l\'historique:', err);
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

// ==================== NOTIFICATIONS TEMPS RÉEL ====================
let orderNotificationChannel = null;

function subscribeToOrderUpdates(orderId) {
    if (!supabaseClient || !orderId) return null;
    
    const channel = supabaseClient
        .channel(`order-updates-${orderId}`)
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'food_orders',
            filter: `id=eq.${orderId}`
        }, (payload) => {
            const newStatus = payload.new.status;
            const oldStatus = payload.old.status;
            
            if (newStatus !== oldStatus) {
                handleOrderStatusChange(newStatus, oldStatus);
            }
        })
        .subscribe();
        
    return channel;
}

function handleOrderStatusChange(newStatus, oldStatus) {
    updateOrderTracking(newStatus);
    
    const statusMessages = {
        'Pending': { icon: '📝', title: 'Order Received', message: 'Your order has been registered', type: 'info' },
        'Preparing': { icon: '👨‍🍳', title: 'Being Prepared', message: 'The chef is preparing your order', type: 'info' },
        'Ready': { icon: '🔔', title: 'Ready for Delivery', message: 'Your order is ready!', type: 'success' },
        'Delivered': { icon: '✅', title: 'Delivered', message: 'Enjoy your meal!', type: 'success' },
        'Completed': { icon: '🌟', title: 'Completed', message: 'Order completed. Thank you!', type: 'success' },
        'Cancelled': { icon: '❌', title: 'Cancelled', message: 'Your order has been cancelled', type: 'error' }
    };
    
    const config = statusMessages[newStatus] || statusMessages['Pending'];
    showEnhancedToast(config.icon, config.title, config.message, config.type);
    playOrderNotificationSound();
    
    if (newStatus === 'Delivered' || newStatus === 'Completed') {
        setTimeout(() => {
            showFeedbackPrompt();
        }, 5000);
        if (typeof fetchOrderHistory === 'function') {
            fetchOrderHistory();
        }
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
        console.warn('Son non disponible:', error);
    }
}

function showSystemNotification(icon, title, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`${icon} ${title}`, {
            body: message,
            icon: '/assets/images/logo.png'
        });
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
                console.warn('Erreur feedback:', error);
                showToast('Error saving feedback', 'error');
                return;
            }
        }
        
        document.querySelectorAll('.toast-notification').forEach(t => t.remove());
        showToast(`Thank you for your ${rating} star rating! 🌟`, 'success');
    } catch (error) {
        console.warn('Erreur feedback:', error);
        showToast('Error saving feedback', 'error');
    }
}

function startOrderNotifications(orderId) {
    if (orderNotificationChannel && supabaseClient) {
        supabaseClient.removeChannel(orderNotificationChannel);
    }
    
    orderNotificationChannel = subscribeToOrderUpdates(orderId);
    
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function stopOrderNotifications() {
    if (orderNotificationChannel && supabaseClient) {
        supabaseClient.removeChannel(orderNotificationChannel);
        orderNotificationChannel = null;
    }
}
// ==================== SUGGESTIONS PERSONNALISÉES ====================
async function fetchPersonalizedSuggestions() {
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    if (!room || !supabaseClient) return;
    
    try {
        // Récupérer l'historique des commandes
        const { data: orderHistory, error: historyError } = await supabaseClient
            .from('food_orders')
            .select('items, total_amount, created_at')
            .eq('room_number', String(room))
            .order('created_at', { ascending: false })
            .limit(10);
            
        if (historyError) {
            console.warn('Erreur historique:', historyError);
            renderSuggestions([]);
            return;
        }
        
        // Analyser les items commandés
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
        
        // Trier par fréquence
        const sortedItems = Object.entries(itemFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));
        
        // Trouver les suggestions dans le menu
        const suggestions = [];
        if (typeof MENU_DATA !== 'undefined') {
            for (const [category, items] of Object.entries(MENU_DATA)) {
                items.forEach(item => {
                    const match = sortedItems.find(s => s.name === item.name);
                    if (match) {
                        suggestions.push({
                            ...item,
                            category,
                            orderCount: match.count,
                            score: 100
                        });
                    }
                });
            }
        }
        
        // Ajouter des suggestions basées sur les catégories préférées
        if (suggestions.length < 3 && typeof MENU_DATA !== 'undefined') {
            const preferredCategories = {};
            suggestions.forEach(s => {
                preferredCategories[s.category] = (preferredCategories[s.category] || 0) + 1;
            });
            
            for (const [category, items] of Object.entries(MENU_DATA)) {
                if (preferredCategories[category]) {
                    items.forEach(item => {
                        if (!suggestions.find(s => s.id === item.id) && suggestions.length < 5) {
                            suggestions.push({
                                ...item,
                                category,
                                orderCount: 0,
                                score: 50,
                                reason: 'similar'
                            });
                        }
                    });
                }
            }
        }
        
        // Si toujours pas assez, ajouter des plats populaires (badge "popular")
        if (suggestions.length < 3 && typeof MENU_DATA !== 'undefined') {
            for (const [category, items] of Object.entries(MENU_DATA)) {
                items.forEach(item => {
                    if (item.badges && item.badges.includes('popular') && !suggestions.find(s => s.id === item.id) && suggestions.length < 5) {
                        suggestions.push({
                            ...item,
                            category,
                            orderCount: 0,
                            score: 30,
                            reason: 'popular'
                        });
                    }
                });
            }
        }
        
        window.personalizedSuggestions = suggestions;
        renderSuggestions(suggestions);
        
    } catch (err) {
        console.warn('Erreur suggestions:', err);
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
                <button onclick="refreshSuggestions()" class="text-[9px] text-stone-400 hover:text-[var(--text-gold,#DCA773)]">
                    <i class="fas fa-sync-alt"></i>
                </button>
            </div>
            <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                ${suggestions.map(item => {
                    const reasonLabel = item.orderCount > 0 ? 
                        `Ordered ${item.orderCount}x` : 
                        item.reason === 'popular' ? 'Popular' : 'Based on your taste';
                    
                    return `
                        <div class="min-w-[120px] bg-stone-950/80 border border-stone-700 rounded-xl p-2.5 flex-shrink-0 hover:border-[var(--text-gold,#DCA773)] transition cursor-pointer" onclick="addSuggestionToCart('${item.id}')">
                            <div class="text-2xl mb-1">${item.emoji || '🍽️'}</div>
                            <p class="text-[10px] font-bold text-stone-100 truncate">${item.name}</p>
                            <p class="text-[9px] text-stone-400">AED ${item.price.toFixed(2)}</p>
                            <p class="text-[8px] text-amber-400 mt-1">
                                <i class="fas fa-star mr-0.5"></i>${reasonLabel}
                            </p>
                        </div>
                    `;
                }).join('')}
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
