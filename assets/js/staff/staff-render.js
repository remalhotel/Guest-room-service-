// ==================== STAFF RENDER ====================
function renderStaffOrders() {
    const container = document.getElementById('staffOrdersContainer');
    if (!container) return;
    
    let filtered = allRequests.filter(r => r.tabCategory === currentStaffTab);
    if (currentFilter !== 'all') filtered = filtered.filter(r => r.status === currentFilter);
    filtered = filterBySearch(filtered);
    
    const tabRequests = allRequests.filter(r => r.tabCategory === currentStaffTab);
    document.getElementById('statTotalOrders').innerText = tabRequests.length;
    document.getElementById('statPendingOrders').innerText = tabRequests.filter(o => o.status === 'Pending').length;
    document.getElementById('statPreparingOrders').innerText = tabRequests.filter(o => o.status === 'Preparing' || o.status === 'In Progress' || o.status === 'Ready').length;
    document.getElementById('statCompletedOrders').innerText = tabRequests.filter(o => o.status === 'Delivered' || o.status === 'Completed').length;
    
    if (filtered.length === 0) {
        container.innerHTML = '<p class="text-center text-muted-custom col-span-full py-8">No requests found</p>';
        return;
    }
    
    container.innerHTML = filtered.map(request => {
        const isFood = request.requestType === 'food';
        const statusColors = {
            'Pending': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
            'Preparing': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            'In Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            'Ready': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            'Delivered': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            'Completed': 'bg-green-500/20 text-green-400 border-green-500/30'
        };
        const sc = statusColors[request.status] || statusColors['Pending'];
        const timeAgo = getTimeAgo(request.created_at);
        
        if (isFood) {
            let items = [];
            try { items = typeof request.items === 'string' ? JSON.parse(request.items) : (Array.isArray(request.items) ? request.items : []); } catch(e) {}
            
            return `
                <div class="remal-card rounded-2xl p-4 space-y-3 ${request.status === 'Pending' ? 'pulse-ring' : ''}">
                    <div class="flex justify-between">
                        <div>
                            <p class="font-bold text-[var(--text-gold)] text-sm">Room ${request.room_number}</p>
                            <p class="text-[10px] text-stone-400">${request.guest_name}</p>
                        </div>
                        <span class="text-[9px] font-bold px-2 py-0.5 rounded-full ${sc}">${request.status}</span>
                    </div>
                    <div class="space-y-1 text-xs">
                        ${items.map(item => `
                            <div class="flex justify-between border-b border-stone-800 pb-1">
                                <span class="text-stone-200">${item.quantity}x ${item.name}</span>
                                <span class="text-[var(--text-gold,#DCA773)] font-bold">AED ${(item.total || item.price * item.quantity || 0).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="flex justify-between text-xs">
                        <span class="font-bold text-[var(--text-gold,#DCA773)]">Total: AED ${(request.total_amount || 0).toFixed(2)}</span>
                        <span class="text-stone-400">${timeAgo}</span>
                    </div>
                    <div class="flex gap-2">
                        ${request.status === 'Pending' ? `<button onclick="updateFoodOrderStatus(${request.id},'Preparing')" class="flex-1 bg-blue-500/20 text-blue-400 py-2 rounded-xl text-xs font-bold">👨‍🍳 Start</button>` :
                        request.status === 'Preparing' ? `<button onclick="updateFoodOrderStatus(${request.id},'Ready')" class="flex-1 bg-purple-500/20 text-purple-400 py-2 rounded-xl text-xs font-bold">✅ Ready</button>` :
                        request.status === 'Ready' ? `<button onclick="updateFoodOrderStatus(${request.id},'Delivered')" class="flex-1 bg-emerald-500/20 text-emerald-400 py-2 rounded-xl text-xs font-bold">🚚 Deliver</button>` :
                        `<span class="flex-1 text-center text-emerald-400 text-xs font-bold py-2">✅ Completed</span>`}
                        <button onclick="openChatModal('${request.room_number}','${request.guest_name}')" class="bg-purple-500/20 text-purple-400 px-3 py-2 rounded-xl text-xs">💬</button>
                        <button onclick="deleteFoodOrder(${request.id})" class="bg-red-500/10 text-red-400 px-3 py-2 rounded-xl text-xs">🗑️</button>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="remal-card rounded-2xl p-4 space-y-3 ${request.status === 'Pending' ? 'pulse-ring' : ''}">
                    <div class="flex justify-between">
                        <div>
                            <p class="font-bold text-[var(--text-gold)] text-sm">Room ${request.room_number}</p>
                            <p class="text-[10px] text-stone-400">${request.guest_name}</p>
                        </div>
                        <span class="text-[9px] font-bold px-2 py-0.5 rounded-full ${sc}">${request.status}</span>
                    </div>
                    <p class="text-xs font-bold text-stone-200">${request.serviceLabel}</p>
                    ${request.details ? `<div class="bg-stone-950/60 p-3 rounded-xl text-[10px] text-stone-400 whitespace-pre-line">${request.details}</div>` : ''}
                    <div class="flex gap-2">
                        ${request.status === 'Pending' ? `<button onclick="updateGuestRequestStatus(${request.id},'In Progress')" class="flex-1 bg-blue-500/20 text-blue-400 py-2 rounded-xl text-xs font-bold">👨‍💼 Handle</button>` :
                        request.status === 'In Progress' ? `<button onclick="updateGuestRequestStatus(${request.id},'Completed')" class="flex-1 bg-emerald-500/20 text-emerald-400 py-2 rounded-xl text-xs font-bold">✔️ Complete</button>` :
                        `<span class="flex-1 text-center text-emerald-400 text-xs font-bold py-2">✅ Completed</span>`}
                        <button onclick="openChatModal('${request.room_number}','${request.guest_name}')" class="bg-purple-500/20 text-purple-400 px-3 py-2 rounded-xl text-xs">💬</button>
                        <button onclick="deleteGuestRequest(${request.id})" class="bg-red-500/10 text-red-400 px-3 py-2 rounded-xl text-xs">🗑️</button>
                    </div>
                    <p class="text-[9px] text-stone-400">${timeAgo}</p>
                </div>
            `;
        }
    }).join('');
}

function updateFoodBeverageStats() {
    const fbOrders = allRequests.filter(r => r.tabCategory === 'food_beverage' && r.requestType === 'food');
    const container = document.getElementById('foodBeverageStats');
    if (!container) return;
    
    if (currentStaffTab === 'food_beverage') container.classList.remove('hidden');
    else { container.classList.add('hidden'); return; }
    
    const totalOrders = fbOrders.length;
    const totalRevenue = fbOrders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    document.getElementById('fbStatTotalOrders').innerText = totalOrders;
    document.getElementById('fbStatRevenue').innerText = 'AED ' + totalRevenue.toFixed(2);
    document.getElementById('fbStatAvgOrder').innerText = 'AED ' + avgOrder.toFixed(2);
}

window.renderStaffOrders = renderStaffOrders;
window.updateFoodBeverageStats = updateFoodBeverageStats;
