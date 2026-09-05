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
                
                // 🆕 Démarrer les notifications en temps réel
                startOrderNotifications(currentOrderId);
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
        trackingTimeout = setTimeout(() => {
            trackingSection.classList.add('hidden');
            localStorage.removeItem('remal_current_order_id');
            currentOrderId = null;
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
    } catch (err) {
        console.warn('Erreur lors de la vérification de la commande:', err);
    }
}
// ==================== NOTIFICATIONS TEMPS RÉEL ====================
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
    // Mettre à jour l'affichage du suivi
    updateOrderTracking(newStatus);
    
    // Afficher une notification toast
    const statusMessages = {
        'Pending': {
            icon: '📝',
            title: TRANSLATIONS[currentLanguage].orderReceived,
            message: 'Votre commande a été enregistrée',
            type: 'info'
        },
        'Preparing': {
            icon: '👨‍🍳',
            title: TRANSLATIONS[currentLanguage].beingPrepared,
            message: 'Le chef prépare votre commande',
            type: 'info'
        },
        'Ready': {
            icon: '🔔',
            title: TRANSLATIONS[currentLanguage].readyForDelivery,
            message: 'Votre commande est prête !',
            type: 'success'
        },
        'Delivered': {
            icon: '✅',
            title: TRANSLATIONS[currentLanguage].orderDelivered,
            message: 'Bon appétit !',
            type: 'success'
        },
        'Completed': {
            icon: '🌟',
            title: TRANSLATIONS[currentLanguage].orderDelivered,
            message: 'Commande terminée. Merci !',
            type: 'success'
        },
        'Cancelled': {
            icon: '❌',
            title: 'Commande annulée',
            message: 'Votre commande a été annulée',
            type: 'error'
        }
    };
    
    const config = statusMessages[newStatus] || statusMessages['Pending'];
    
    // Notification toast avec style amélioré
    showEnhancedToast(config.icon, config.title, config.message, config.type);
    
    // Jouer un son de notification
    playOrderNotificationSound();
    
    // Notification système si autorisée
    showSystemNotification(config.icon, config.title, config.message);
    
    // Si la commande est livrée, préparer la notification de feedback
    if (newStatus === 'Delivered' || newStatus === 'Completed') {
        setTimeout(() => {
            showFeedbackPrompt();
        }, 5000);
    }
}

function showEnhancedToast(icon, title, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast-notification toast-in';
    
    const colors = {
        'info': 'border-amber-500/30',
        'success': 'border-emerald-500/30',
        'error': 'border-red-500/30'
    };
    
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
        
        // Créer un son agréable de notification
        const notes = [523.25, 659.25, 783.99]; // Do, Mi, Sol
        
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
                <p class="text-xs font-bold text-stone-100">Comment était votre expérience ?</p>
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
                console.warn('Erreur lors de l\'enregistrement du feedback:', error);
                showToast('Erreur lors de l\'enregistrement', 'error');
                return;
            }
        }
        
        // Fermer tous les toasts de feedback
        document.querySelectorAll('.toast-notification').forEach(t => t.remove());
        
        showToast(`Merci pour votre note de ${rating} étoiles ! 🌟`, 'success');
    } catch (error) {
        console.warn('Erreur lors de l\'enregistrement du feedback:', error);
        showToast('Erreur lors de l\'enregistrement', 'error');
    }
}

// Variable pour stocker le canal de notification
let orderNotificationChannel = null;

// Fonction pour démarrer le suivi des notifications
function startOrderNotifications(orderId) {
    // Fermer l'ancien canal s'il existe
    if (orderNotificationChannel && supabaseClient) {
        supabaseClient.removeChannel(orderNotificationChannel);
    }
    
    orderNotificationChannel = subscribeToOrderUpdates(orderId);
    
    // Demander la permission pour les notifications système
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// Fonction pour arrêter le suivi des notifications
function stopOrderNotifications() {
    if (orderNotificationChannel && supabaseClient) {
        supabaseClient.removeChannel(orderNotificationChannel);
        orderNotificationChannel = null;
    }
}
