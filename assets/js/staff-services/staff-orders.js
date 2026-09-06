// ==================== STAFF ORDER MANAGEMENT ====================
// Utiliser le supabaseClient global
const supabaseClient = window.supabaseClient || (typeof initSupabaseClient === 'function' ? initSupabaseClient() : null);
const SERVICE_TAB_MAPPING = window.SERVICE_TAB_MAPPING || {};

async function fetchAllData() {
    console.log('📥 Fetching all data...');
    
    if (!supabaseClient) {
        console.error('❌ supabaseClient is NULL');
        showToast('Error: Supabase client not initialized', 'error');
        return;
    }
    
    try {
        // Récupérer les commandes de nourriture
        const { data: foodData, error: foodError } = await supabaseClient
            .from('food_orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(200);
            
        if (foodError) {
            console.warn('Error food orders:', foodError.message);
        } else {
            foodOrders = foodData || [];
            console.log('✅ Food orders:', foodOrders.length);
        }
        
        // Récupérer les demandes
        const { data: requestData, error: requestError } = await supabaseClient
            .from('guest_requests')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(200);
            
        if (requestError) {
            console.warn('Error guest requests:', requestError.message);
        } else {
            guestRequests = requestData || [];
            console.log('✅ Guest requests:', guestRequests.length);
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
        
        console.log('✅ All requests:', allRequests.length);
        
        // Mettre à jour l'interface
        if (typeof updateTabBadges === 'function') updateTabBadges();
        if (typeof updateFoodBeverageStats === 'function') updateFoodBeverageStats();
        if (typeof renderStaffOrders === 'function') renderStaffOrders();
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        showToast('Error: ' + error.message, 'error');
    }
}

async function updateFoodOrderStatus(orderId, newStatus) {
    try {
        const { error } = await supabaseClient
            .from('food_orders')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', orderId);
            
        if (error) {
            const fallback = await supabaseClient
                .from('food_orders')
                .update({ status: newStatus })
                .eq('id', orderId);
            if (fallback.error) {
                showToast('Error: ' + fallback.error.message, 'error');
                return;
            }
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
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', requestId);
            
        if (error) {
            const fallback = await supabaseClient
                .from('guest_requests')
                .update({ status: newStatus })
                .eq('id', requestId);
            if (fallback.error) {
                showToast('Error: ' + fallback.error.message, 'error');
                return;
            }
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

// Exposer les fonctions
window.fetchAllData = fetchAllData;
window.updateFoodOrderStatus = updateFoodOrderStatus;
window.updateGuestRequestStatus = updateGuestRequestStatus;
window.deleteFoodOrder = deleteFoodOrder;
window.deleteGuestRequest = deleteGuestRequest;
