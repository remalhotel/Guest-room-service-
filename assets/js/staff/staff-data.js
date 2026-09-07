// ==================== STAFF DATA MANAGEMENT ====================
async function fetchAllData() {
    console.log('📥 Fetching staff data...');
    
    try {
        // Récupérer les commandes
        const { data: foodData, error: foodError } = await supabaseClient
            .from('food_orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(200);
            
        if (foodError) console.warn('Food orders error:', foodError.message);
        else {
            const newFood = (foodData || []).filter(o => o.status === 'Pending' && !foodOrders.some(e => e.id === o.id));
            if (newFood.length > 0 && foodOrders.length > 0) {
                playNotificationSound();
                showNotificationPopup(`🔔 ${newFood.length} new food order(s)!`);
            }
            foodOrders = foodData || [];
        }
        
        // Récupérer les demandes
        const { data: requestData, error: requestError } = await supabaseClient
            .from('guest_requests')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(200);
            
        if (requestError) console.warn('Guest requests error:', requestError.message);
        else {
            const newReq = (requestData || []).filter(r => r.status === 'Pending' && !guestRequests.some(e => e.id === r.id));
            if (newReq.length > 0 && guestRequests.length > 0) {
                playNotificationSound();
                showNotificationPopup(`🔔 ${newReq.length} new service request(s)!`);
            }
            guestRequests = requestData || [];
        }
        
        // Fusionner
        allRequests = [
            ...foodOrders.map(o => ({ 
                ...o, 
                requestType: 'food', 
                serviceLabel: o.service_type || 'Room Service / Order Food', 
                tabCategory: 'food_beverage' 
            })),
            ...guestRequests.map(r => ({ 
                ...r, 
                requestType: 'other', 
                serviceLabel: r.service_type || 'Guest Request', 
                tabCategory: SERVICE_TAB_MAPPING[r.service_type] || 'front_desk' 
            }))
        ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        updateTabBadges();
        updateFoodBeverageStats();
        renderStaffOrders();
        
    } catch (err) {
        console.error('Error fetching data:', err);
    }
}

async function updateFoodOrderStatus(orderId, newStatus) {
    try {
        const { error } = await supabaseClient
            .from('food_orders')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', orderId);
            
        if (error) {
            const fallback = await supabaseClient.from('food_orders').update({ status: newStatus }).eq('id', orderId);
            if (fallback.error) { showToast('Error: ' + fallback.error.message, 'error'); return; }
        }
        showToast(`Order #${orderId} → ${newStatus}`, 'success');
        fetchAllData();
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
}

async function updateGuestRequestStatus(requestId, newStatus) {
    try {
        const { error } = await supabaseClient
            .from('guest_requests')
            .update({ status: newStatus, updated_at: new Date().toISOString(), is_read: true, read_at: new Date().toISOString() })
            .eq('id', requestId);
            
        if (error) {
            const fallback = await supabaseClient.from('guest_requests').update({ status: newStatus }).eq('id', requestId);
            if (fallback.error) { showToast('Error: ' + fallback.error.message, 'error'); return; }
        }
        showToast(`Request #${requestId} → ${newStatus}`, 'success');
        fetchAllData();
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
}

async function deleteFoodOrder(orderId) {
    if (!confirm('Delete this food order?')) return;
    const { error } = await supabaseClient.from('food_orders').delete().eq('id', orderId);
    if (!error) { showToast('Order deleted', 'info'); fetchAllData(); }
}

async function deleteGuestRequest(requestId) {
    if (!confirm('Delete this request?')) return;
    const { error } = await supabaseClient.from('guest_requests').delete().eq('id', requestId);
    if (!error) { showToast('Request deleted', 'info'); fetchAllData(); }
}

window.fetchAllData = fetchAllData;
window.updateFoodOrderStatus = updateFoodOrderStatus;
window.updateGuestRequestStatus = updateGuestRequestStatus;
window.deleteFoodOrder = deleteFoodOrder;
window.deleteGuestRequest = deleteGuestRequest;
