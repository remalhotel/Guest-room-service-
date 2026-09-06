// ==================== STAFF NAVIGATION ====================
function switchStaffTab(tab) {
    currentStaffTab = tab;
    
    const tabs = ['front_desk', 'food_beverage', 'housekeeping', 'maintenance', 'offers', 'analytics'];
    tabs.forEach(t => {
        const btn = document.getElementById(`staffTab${t.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`);
        if (btn) {
            if (t === tab) btn.classList.add('active');
            else btn.classList.remove('active');
        }
    });
    
    const offersSection = document.getElementById('offersManagementSection');
    const requestsSection = document.getElementById('requestsSection');
    const analyticsSection = document.getElementById('analyticsSection');
    
    if (offersSection) offersSection.classList.add('hidden');
    if (requestsSection) requestsSection.classList.add('hidden');
    if (analyticsSection) analyticsSection.classList.add('hidden');
    
    if (tab === 'offers') {
        if (offersSection) offersSection.classList.remove('hidden');
        fetchOffers();
    } else if (tab === 'analytics') {
        if (analyticsSection) analyticsSection.classList.remove('hidden');
        renderAnalytics();
    } else {
        if (requestsSection) requestsSection.classList.remove('hidden');
        updateFoodBeverageStats();
        renderStaffOrders();
    }
}

function filterStaffOrders(filter) {
    currentFilter = filter;
    renderStaffOrders();
}

function handleSearch() {
    searchQuery = document.getElementById('searchInput')?.value?.toLowerCase()?.trim() || '';
    renderStaffOrders();
}

function filterBySearch(requests) {
    if (!searchQuery) return requests;
    return requests.filter(r => {
        const roomMatch = String(r.room_number || '').toLowerCase().includes(searchQuery);
        const guestMatch = String(r.guest_name || '').toLowerCase().includes(searchQuery);
        const serviceMatch = String(r.serviceLabel || '').toLowerCase().includes(searchQuery);
        return roomMatch || guestMatch || serviceMatch;
    });
}

function updateFoodBeverageStats() {
    const fbOrders = allRequests.filter(r => r.tabCategory === 'food_beverage' && r.requestType === 'food');
    const statsContainer = document.getElementById('foodBeverageStats');
    if (!statsContainer) return;
    
    if (currentStaffTab === 'food_beverage') {
        statsContainer.classList.remove('hidden');
    } else {
        statsContainer.classList.add('hidden');
        return;
    }
    
    const totalOrders = fbOrders.length;
    const totalRevenue = fbOrders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const itemCounts = {};
    fbOrders.forEach(order => {
        const items = Array.isArray(order.items) ? order.items : [];
        items.forEach(item => {
            const itemName = item.name || 'Unknown';
            const qty = item.quantity || 1;
            itemCounts[itemName] = (itemCounts[itemName] || 0) + qty;
        });
    });
    
    let topItem = '---';
    let topCount = 0;
    for (const [name, count] of Object.entries(itemCounts)) {
        if (count > topCount) { topCount = count; topItem = name; }
    }
    
    document.getElementById('fbStatTotalOrders').innerText = totalOrders;
    document.getElementById('fbStatRevenue').innerText = 'AED ' + totalRevenue.toFixed(2);
    document.getElementById('fbStatAvgOrder').innerText = 'AED ' + avgOrder.toFixed(2);
    document.getElementById('fbStatTopItem').innerText = truncateString(topItem, 15);
}

window.switchStaffTab = switchStaffTab;
window.filterStaffOrders = filterStaffOrders;
window.handleSearch = handleSearch;
window.updateFoodBeverageStats = updateFoodBeverageStats;
