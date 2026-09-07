// ==================== SERVICE REQUESTS ====================
async function submitOtherService() {
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    const notes = document.getElementById('otherServiceNotes').value.trim();
    const serviceData = SERVICES_DATA[currentService];
    if (!serviceData) return;
    let details = [];
    serviceData.fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) details.push(`${field.label}: ${element.value}`);
    });
    const fullDetails = details.join('\n') + (notes ? `\n📝 Notes: ${notes}` : '');
    const requestData = {
        room_number: String(room),
        guest_name: cachedGuestData?.guest_name || 'Guest',
        service_type: serviceData.title,
        details: fullDetails,
        status: 'Pending',
        created_at: new Date().toISOString()
    };
    try {
        if (supabaseClient) {
            const { error } = await supabaseClient.from('guest_requests').insert([requestData]);
            if (error) { showToast('Error: ' + error.message, 'error'); return; }
        }
        showToast('✅ Request submitted!', 'success');
        document.getElementById('otherServiceNotes').value = '';
        backToServices();
        renderServiceRequestsTracking();
    } catch (err) { showToast('Error: ' + err.message, 'error'); }
}

async function fetchServiceRequestsTracking() {
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    if (!room || !supabaseClient) return;
    
    try {
        const { data, error } = await supabaseClient
            .from('guest_requests')
            .select('*')
            .eq('room_number', String(room))
            .order('created_at', { ascending: false })
            .limit(10);
        
        if (!error && data && data.length > 0) {
            window.activeServiceRequests = data.filter(r => r.status === 'Pending' || r.status === 'In Progress');
        } else {
            window.activeServiceRequests = [];
        }
    } catch (err) {
        window.activeServiceRequests = [];
    }
    renderServiceRequestsTracking();
}

function renderServiceRequestsTracking() {
    const container = document.getElementById('servicesTrackingContainer');
    if (!container) return;
    
    const requests = window.activeServiceRequests || [];
    
    if (requests.length === 0) {
        container.classList.add('hidden');
        container.innerHTML = '';
        return;
    }
    
    container.classList.remove('hidden');
    
    container.innerHTML = requests.map(request => {
        const sc = request.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400';
        const timeAgo = getTimeAgo(request.created_at);
        return `
            <div class="p-3 bg-stone-950/60 border border-amber-500/20 rounded-xl">
                <div class="flex justify-between items-center">
                    <p class="font-bold text-stone-100 text-xs">${request.service_type}</p>
                    <span class="text-[9px] font-bold px-2 py-0.5 rounded-full ${sc}">${request.status}</span>
                </div>
                <p class="text-[9px] text-stone-400 mt-1">${timeAgo}</p>
            </div>
        `;
    }).join('');
}

// Exposer
window.submitOtherService = submitOtherService;
window.fetchServiceRequestsTracking = fetchServiceRequestsTracking;
window.renderServiceRequestsTracking = renderServiceRequestsTracking;
