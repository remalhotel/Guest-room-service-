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
    
    document.getElementById('offersManagementSection').classList.add('hidden');
    document.getElementById('requestsSection').classList.add('hidden');
    document.getElementById('analyticsSection').classList.add('hidden');
    
    if (tab === 'offers') {
        document.getElementById('offersManagementSection').classList.remove('hidden');
        fetchOffers();
    } else if (tab === 'analytics') {
        document.getElementById('analyticsSection').classList.remove('hidden');
        renderAnalytics();
    } else {
        document.getElementById('requestsSection').classList.remove('hidden');
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

window.switchStaffTab = switchStaffTab;
window.filterStaffOrders = filterStaffOrders;
window.handleSearch = handleSearch;
