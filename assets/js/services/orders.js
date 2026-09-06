// ==================== STAFF ORDER MANAGEMENT ====================
async function fetchAllData() {
    console.log('📥 Fetching all data...');
    
    try {
        // Récupérer les commandes de nourriture
        const { data: foodData, error: foodError } = await supabaseClient
            .from('food_orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(200);
            
        if (foodError) {
            console.warn('Error fetching food orders:', foodError);
        } else {
            foodOrders = foodData || [];
            console.log('✅ Food orders fetched:', foodOrders.length);
        }
        
        // Récupérer les demandes de services
        const { data: requestData, error: requestError } = await supabaseClient
            .from('guest_requests')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(200);
            
        if (requestError) {
            console.warn('Error fetching guest requests:', requestError);
        } else {
            guestRequests = requestData || [];
            console.log('✅ Guest requests fetched:', guestRequests.length);
        }
        
        // Fusionner toutes les requêtes
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
        
        console.log('✅ All requests merged:', allRequests.length);
        console.log('📊 Front Desk requests:', allRequests.filter(r => r.tabCategory === 'front_desk').length);
        console.log('📊 F&B requests:', allRequests.filter(r => r.tabCategory === 'food_beverage').length);
        console.log('📊 Housekeeping requests:', allRequests.filter(r => r.tabCategory === 'housekeeping').length);
        console.log('📊 Maintenance requests:', allRequests.filter(r => r.tabCategory === 'maintenance').length);
        
        // Mettre à jour l'interface
        updateTabBadges();
        updateFoodBeverageStats();
        renderStaffOrders();
        
        if (currentStaffTab === 'analytics') {
            renderAnalytics();
        }
        
    } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Error fetching data: ' + error.message, 'error');
    }
}

async function updateFoodOrderStatus(orderId, newStatus) {
    try {
        const { error } = await supabaseClient
            .from('food_orders')
            .update({ 
                status: newStatus, 
                updated_at: new Date().toISOString() 
            })
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
            .update({ 
                status: newStatus, 
                updated_at: new Date().toISOString(),
                is_read: true,
                read_at: new Date().toISOString()
            })
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
    
    try {
        const { error } = await supabaseClient
            .from('food_orders')
            .delete()
            .eq('id', orderId);
            
        if (error) {
            showToast('Error: ' + error.message, 'error');
            return;
        }
        
        showToast('Order deleted', 'info');
        fetchAllData();
        
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
}

async function deleteGuestRequest(requestId) {
    if (!confirm('Delete this request?')) return;
    
    try {
        const { error } = await supabaseClient
            .from('guest_requests')
            .delete()
            .eq('id', requestId);
            
        if (error) {
            showToast('Error: ' + error.message, 'error');
            return;
        }
        
        showToast('Request deleted', 'info');
        fetchAllData();
        
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
}
