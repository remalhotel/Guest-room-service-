// ==================== MENU UI FUNCTIONS ====================
let menuNotificationChannel = null;

function openMenuModal() { 
    document.getElementById('menuModal').classList.remove('hidden'); 
    renderMenuItems();
    
    // Démarrer les notifications de mise à jour du menu
    startMenuNotifications();
}

function closeMenuModal() { 
    document.getElementById('menuModal').classList.add('hidden'); 
}

function confirmMenuSelection() { 
    closeMenuModal(); 
}

function renderMenuItems() {
    const container = document.getElementById('menuItemsContainer');
    if (!container) return;
    const searchQuery = document.getElementById('menuSearchInput')?.value?.toLowerCase() || '';
    let html = '';
    let totalPcs = 0;
    let totalPrice = 0;

    if (typeof MENU_DATA === 'undefined') {
        container.innerHTML = '<p class="text-center text-stone-400 py-8">Menu unavailable</p>';
        return;
    }

    for (const [category, items] of Object.entries(MENU_DATA)) {
        const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchQuery) || (item.desc && item.desc.toLowerCase().includes(searchQuery)));
        if (filteredItems.length === 0) continue;
        html += `<div class="menu-category-header px-3 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest text-[var(--text-gold,#DCA773)] bg-stone-950/80 mb-2">${category}</div>`;
        filteredItems.forEach(item => {
            const qty = menuCart[item.id] || 0;
            totalPcs += qty;
            totalPrice += qty * item.price;
            const badgesHTML = getBadgeHTML(item.badges);
            const isFav = favoritesList.dishes && favoritesList.dishes[item.id] ? 'active' : '';
            html += `
                <div class="flex justify-between items-center py-2.5 border-b border-stone-800">
                    <div class="flex-1 pr-2">
                        <div class="flex items-center gap-2 mb-1">
                            <button onclick="toggleFavorite('${item.id}', 'dishes')" class="favorite-heart ${isFav} text-xs"><i class="fas fa-heart"></i></button>
                            <p class="font-bold text-stone-100 text-xs">${item.name}</p>
                            ${item.is_new ? '<span class="text-[7px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">NEW</span>' : ''}
                        </div>
                        ${badgesHTML}
                        <p class="text-[10px] text-stone-400 mt-1">${item.desc || ''}</p>
                        <div class="flex items-center gap-2 mt-1">
                            <p class="text-[var(--text-gold,#DCA773)] font-bold text-xs">AED ${item.price.toFixed(2)}</p>
                            <span class="text-[8px] text-stone-500">•</span>
                            <span class="text-[8px] text-stone-400">⏱️ ${item.prepTime || '20m'}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 bg-stone-950 p-1 rounded-xl border border-stone-800">
                        <button onclick="updateCart('${item.id}', -1)" class="w-6 h-6 bg-stone-800 text-stone-200 rounded-lg font-bold hover:bg-stone-700">-</button>
                        <span class="font-bold px-1 w-6 text-center text-xs text-stone-100">${qty}</span>
                        <button onclick="updateCart('${item.id}', 1)" class="w-6 h-6 bg-[var(--text-gold,#DCA773)] text-stone-950 rounded-lg font-bold hover:bg-[#ebd0b3]">+</button>
                    </div>
                </div>
            `;
        });
    }
    container.innerHTML = html || '<p class="text-center text-stone-400 py-8">No items found</p>';
    
    const summaryEl = document.getElementById('modalMenuTotalSummary');
    if (summaryEl) summaryEl.innerText = `${totalPcs} items · ${totalPrice.toFixed(2)} AED`;
    
    const badgeEl = document.getElementById('selectedBadgeCount');
    if (badgeEl) badgeEl.innerText = `${totalPcs}`;
}

function updateCart(itemId, delta) {
    if (!menuCart[itemId]) menuCart[itemId] = 0;
    menuCart[itemId] = Math.max(0, menuCart[itemId] + delta);
    if (menuCart[itemId] === 0) delete menuCart[itemId];
    renderMenuItems();
}

function toggleFavorite(itemId, category = 'dishes') {
    if (!favoritesList[category]) {
        favoritesList[category] = {};
    }
    
    if (favoritesList[category][itemId]) {
        delete favoritesList[category][itemId];
    } else {
        favoritesList[category][itemId] = {
            added_at: new Date().toISOString()
        };
    }
    
    localStorage.setItem('remal_favorites', JSON.stringify(favoritesList));
    renderMenuItems();
    if (typeof renderFavoritesView === 'function') {
        renderFavoritesView();
    }
}

// ==================== NOTIFICATIONS DE MISE À JOUR DU MENU ====================
function startMenuNotifications() {
    if (!supabaseClient) return;
    
    if (menuNotificationChannel) {
        supabaseClient.removeChannel(menuNotificationChannel);
    }
    
    menuNotificationChannel = supabaseClient
        .channel('menu-updates')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'menu_items'
        }, (payload) => {
            handleMenuUpdate(payload);
        })
        .subscribe();
}

function handleMenuUpdate(payload) {
    const eventType = payload.eventType;
    
    if (eventType === 'INSERT') {
        showMenuUpdateNotification('New dish added!', payload.new?.name || 'Check the menu');
    } else if (eventType === 'UPDATE') {
        showMenuUpdateNotification('Menu updated!', payload.new?.name || 'Check the menu');
    } else if (eventType === 'DELETE') {
        showMenuUpdateNotification('Menu item removed', payload.old?.name || 'Check the menu');
    }
    
    // Rafraîchir le menu
    renderMenuItems();
}

function showMenuUpdateNotification(title, message) {
    showEnhancedToast('🍽️', title, message, 'info');
    
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`🍽️ ${title}`, {
            body: message,
            icon: '/assets/images/logo.png'
        });
    }
}

function stopMenuNotifications() {
    if (menuNotificationChannel && supabaseClient) {
        supabaseClient.removeChannel(menuNotificationChannel);
        menuNotificationChannel = null;
    }
}

// ==================== RECHERCHE AVANCÉE ====================
function filterMenuByCategory(category) {
    const searchInput = document.getElementById('menuSearchInput');
    if (searchInput) {
        searchInput.value = category;
        renderMenuItems();
    }
}

function sortMenuByPrice(order = 'asc') {
    const container = document.getElementById('menuItemsContainer');
    if (!container) return;
    
    let allItems = [];
    if (typeof MENU_DATA !== 'undefined') {
        for (const [category, items] of Object.entries(MENU_DATA)) {
            items.forEach(item => {
                allItems.push({ ...item, category });
            });
        }
    }
    
    allItems.sort((a, b) => {
        if (order === 'asc') return a.price - b.price;
        return b.price - a.price;
    });
    
    let html = '';
    let currentCategory = '';
    
    allItems.forEach(item => {
        if (item.category !== currentCategory) {
            currentCategory = item.category;
            html += `<div class="menu-category-header px-3 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest text-[var(--text-gold,#DCA773)] bg-stone-950/80 mb-2">${currentCategory}</div>`;
        }
        
        const qty = menuCart[item.id] || 0;
        const isFav = favoritesList.dishes && favoritesList.dishes[item.id] ? 'active' : '';
        
        html += `
            <div class="flex justify-between items-center py-2.5 border-b border-stone-800">
                <div class="flex-1 pr-2">
                    <div class="flex items-center gap-2 mb-1">
                        <button onclick="toggleFavorite('${item.id}', 'dishes')" class="favorite-heart ${isFav} text-xs"><i class="fas fa-heart"></i></button>
                        <p class="font-bold text-stone-100 text-xs">${item.name}</p>
                    </div>
                    <p class="text-[var(--text-gold,#DCA773)] font-bold text-xs">AED ${item.price.toFixed(2)}</p>
                </div>
                <div class="flex items-center gap-2 bg-stone-950 p-1 rounded-xl border border-stone-800">
                    <button onclick="updateCart('${item.id}', -1)" class="w-6 h-6 bg-stone-800 text-stone-200 rounded-lg font-bold hover:bg-stone-700">-</button>
                    <span class="font-bold px-1 w-6 text-center text-xs text-stone-100">${qty}</span>
                    <button onclick="updateCart('${item.id}', 1)" class="w-6 h-6 bg-[var(--text-gold,#DCA773)] text-stone-950 rounded-lg font-bold hover:bg-[#ebd0b3]">+</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html || '<p class="text-center text-stone-400 py-8">No items found</p>';
}    localStorage.setItem('remal_favorites', JSON.stringify(favoritesList));
    renderMenuItems();
    if (typeof renderFavoritesView === 'function') {
        renderFavoritesView();
    }
}
