// ==================== STAFF RENDER FUNCTIONS ====================
function renderStaffOrders() {
    const container = document.getElementById('staffOrdersContainer');
    if (!container) return;
    
    let filteredRequests = allRequests.filter(r => r.tabCategory === currentStaffTab);
    
    if (currentFilter !== 'all') {
        filteredRequests = filteredRequests.filter(r => r.status === currentFilter);
    }
    
    filteredRequests = filterBySearch(filteredRequests);
    
    const tabRequests = allRequests.filter(r => r.tabCategory === currentStaffTab);
    updateStatsDisplay(tabRequests);
    
    if (filteredRequests.length === 0) {
        container.innerHTML = '<p class="text-center text-muted-custom col-span-full py-8">No requests found</p>';
        return;
    }
    
    container.innerHTML = filteredRequests.map(request => {
        const isFood = request.requestType === 'food';
        const statusColor = getStatusColor(request.status);
        const timeAgo = getTimeAgo(request.created_at);
        const isPending = request.status === 'Pending';
        
        if (isFood) {
            return renderFoodOrderCard(request, statusColor, timeAgo, isPending);
        } else {
            return renderServiceRequestCard(request, statusColor, timeAgo, isPending);
        }
    }).join('');
    
    updateFoodBeverageStats();
}

function renderFoodOrderCard(request, statusColor, timeAgo, isPending) {
    const items = Array.isArray(request.items) ? request.items : [];
    
    return `
        <div class="order-card remal-card rounded-2xl p-4 space-y-3 ${isPending ? 'pulse-ring' : ''}">
            <div class="flex justify-between items-start">
                <div>
                    <p class="font-bold text-[var(--text-gold)] text-sm">Room ${request.room_number}</p>
                    <p class="text-[10px] text-muted-custom uppercase">${request.guest_name || 'Guest'}</p>
                </div>
                <span class="status-badge ${statusColor}">${request.status || 'Pending'}</span>
            </div>
            
            <span class="service-type-badge bg-orange-500/15 text-orange-400 border-orange-500/30">🍽️ Room Service</span>
            
            <div class="space-y-1.5 text-xs">
                ${items.map(item => `
                    <div class="flex justify-between items-start border-b border-[var(--border-gold)] pb-1.5">
                        <div>
                            <p class="font-bold text-[var(--text-main)]">${item.quantity}x ${item.name}</p>
                        </div>
                        <span class="font-bold text-[var(--text-gold)]">AED ${(item.total || item.price * item.quantity || 0).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="flex justify-between items-center text-xs border-t border-[var(--border-gold)] pt-2">
                <span class="font-bold text-[var(--text-gold)]">Total: AED ${(request.total_amount || 0).toFixed(2)}</span>
                <span class="text-[10px] text-muted-custom">${timeAgo}</span>
            </div>
            
            ${request.special_instructions ? `
                <div class="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
                    <p class="text-[10px] font-bold text-amber-400">📝 Notes:</p>
                    <p class="text-[10px] text-amber-300">${request.special_instructions}</p>
                </div>
            ` : ''}
            
            <div class="flex gap-2 pt-1">
                ${getFoodOrderActionButton(request)}
            </div>
            
            <div class="flex gap-2 pt-1">
                <button onclick="printFoodOrderPDF(${request.id})" class="flex-1 bg-blue-500/20 text-blue-400 py-2 rounded-xl text-[10px] font-bold hover:bg-blue-500/40 transition">
                    🖨️ PDF
                </button>
                <button onclick="generateFoodOrderPDF(${request.id})" class="flex-1 bg-emerald-500/20 text-emerald-400 py-2 rounded-xl text-[10px] font-bold hover:bg-emerald-500/40 transition">
                    ⬇️ Download
                </button>
                <button onclick="openChatModal('${request.room_number}', '${request.guest_name}')" class="flex-1 bg-purple-500/20 text-purple-400 py-2 rounded-xl text-[10px] font-bold hover:bg-purple-500/40 transition">
                    💬 Chat
                </button>
                <button onclick="deleteFoodOrder(${request.id})" class="bg-red-500/10 text-red-400 px-3 py-2 rounded-xl text-xs font-bold hover:bg-red-500/30 transition">
                    🗑️
                </button>
            </div>
        </div>
    `;
}

function renderServiceRequestCard(request, statusColor, timeAgo, isPending) {
    return `
        <div class="order-card remal-card rounded-2xl p-4 space-y-3 ${isPending ? 'pulse-ring' : ''}">
            <div class="flex justify-between items-start">
                <div>
                    <p class="font-bold text-[var(--text-gold)] text-sm">Room ${request.room_number}</p>
                    <p class="text-[10px] text-muted-custom uppercase">${request.guest_name || 'Guest'}</p>
                </div>
                <span class="status-badge ${statusColor}">${request.status || 'Pending'}</span>
            </div>
            
            <span class="service-type-badge bg-blue-500/15 text-blue-400 border-blue-500/30">${request.serviceLabel}</span>
            
            <p class="text-xs font-bold text-[var(--text-main)]">${request.serviceLabel}</p>
            
            ${request.details ? `
                <div class="bg-stone-950/60 p-3 rounded-xl text-[10px] text-muted-custom whitespace-pre-line">
                    ${request.details}
                </div>
            ` : ''}
            
            <div class="flex justify-between items-center text-xs">
                <span class="text-[10px] text-muted-custom">${timeAgo}</span>
            </div>
            
            <div class="flex gap-2 pt-1">
                ${getServiceRequestActionButton(request)}
                <button onclick="openChatModal('${request.room_number}', '${request.guest_name}')" class="bg-purple-500/20 text-purple-400 px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-purple-500/40 transition">
                    💬
                </button>
                <button onclick="deleteGuestRequest(${request.id})" class="bg-red-500/10 text-red-400 px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-red-500/30 transition">
                    🗑️
                </button>
            </div>
        </div>
    `;
}

function getFoodOrderActionButton(request) {
    switch(request.status) {
        case 'Pending':
            return `<button onclick="updateFoodOrderStatus(${request.id}, 'Preparing')" class="flex-1 bg-blue-500/20 text-blue-400 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-500/40 transition">👨‍🍳 Start Preparing</button>`;
        case 'Preparing':
            return `<button onclick="updateFoodOrderStatus(${request.id}, 'Ready')" class="flex-1 bg-purple-500/20 text-purple-400 py-2.5 rounded-xl text-xs font-bold hover:bg-purple-500/40 transition">✅ Mark Ready</button>`;
        case 'Ready':
            return `<button onclick="updateFoodOrderStatus(${request.id}, 'Delivered')" class="flex-1 bg-emerald-500/20 text-emerald-400 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-500/40 transition">🚚 Deliver</button>`;
        default:
            return `<span class="flex-1 text-center text-[10px] text-emerald-400 font-bold py-2.5">✅ Completed</span>`;
    }
}

function getServiceRequestActionButton(request) {
    switch(request.status) {
        case 'Pending':
            return `<button onclick="updateGuestRequestStatus(${request.id}, 'In Progress')" class="flex-1 bg-blue-500/20 text-blue-400 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-500/40 transition">👨‍💼 Handle</button>`;
        case 'In Progress':
            return `<button onclick="updateGuestRequestStatus(${request.id}, 'Completed')" class="flex-1 bg-emerald-500/20 text-emerald-400 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-500/40 transition">✔️ Complete</button>`;
        default:
            return `<span class="flex-1 text-center text-[10px] text-emerald-400 font-bold py-2.5">✅ Completed</span>`;
    }
}

function updateStatsDisplay(requests) {
    document.getElementById('statTotalOrders').innerText = requests.length;
    document.getElementById('statPendingOrders').innerText = requests.filter(o => o.status === 'Pending').length;
    document.getElementById('statPreparingOrders').innerText = requests.filter(o => o.status === 'Preparing' || o.status === 'In Progress' || o.status === 'Ready').length;
    document.getElementById('statCompletedOrders').innerText = requests.filter(o => o.status === 'Delivered' || o.status === 'Completed').length;
}
