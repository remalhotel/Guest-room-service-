// ==================== SERVICES UI ====================
// Utiliser le supabaseClient global
const supabaseClient = window.supabaseClient || null;

function renderServiceFields(fields) {
    const container = document.getElementById('otherServiceFields');
    if (!container) {
        console.error('❌ Container otherServiceFields not found');
        return;
    }
    
    container.innerHTML = fields.map(field => {
        if (field.type === 'select') {
            return `
                <div>
                    <label class="block font-bold text-[var(--text-gold,#DCA773)] mb-1.5 uppercase tracking-wider text-[10px]">${field.label}</label>
                    <select id="${field.id}" class="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3.5 font-bold cursor-pointer text-xs text-stone-200">
                        ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>
                </div>
            `;
        } else if (field.type === 'date') {
            const today = new Date().toISOString().split('T')[0];
            return `
                <div>
                    <label class="block font-bold text-[var(--text-gold,#DCA773)] mb-1.5 uppercase tracking-wider text-[10px]">${field.label}</label>
                    <input type="date" id="${field.id}" value="${today}" class="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3.5 font-bold text-xs text-stone-200">
                </div>
            `;
        } else if (field.type === 'time') {
            return `
                <div>
                    <label class="block font-bold text-[var(--text-gold,#DCA773)] mb-1.5 uppercase tracking-wider text-[10px]">${field.label}</label>
                    <input type="time" id="${field.id}" value="19:30" class="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3.5 font-bold text-xs text-stone-200">
                </div>
            `;
        } else if (field.type === 'number') {
            return `
                <div>
                    <label class="block font-bold text-[var(--text-gold,#DCA773)] mb-1.5 uppercase tracking-wider text-[10px]">${field.label}</label>
                    <input type="number" id="${field.id}" min="1" max="10" value="1" class="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3.5 font-bold text-xs text-stone-200">
                </div>
            `;
        }
        return '';
    }).join('');
}

// ==================== ONE-TAP SERVICES (CONNECTÉS AU STAFF) ====================
const ONE_TAP_SERVICES = [
    { id: 'one_tap_cleaning', icon: '🧹', label: 'Clean Room Now', serviceType: 'Housekeeping / Room Cleaning', details: 'Immediate room cleaning requested', staffTab: 'housekeeping' },
    { id: 'one_tap_towels', icon: '🧴', label: 'Fresh Towels', serviceType: 'Housekeeping / Room Cleaning', details: 'Fresh towels requested', staffTab: 'housekeeping' },
    { id: 'one_tap_water', icon: '💧', label: 'Water Bottles', serviceType: 'Front Desk Inquiry', details: 'Extra water bottles requested', staffTab: 'front_desk' },
    { id: 'one_tap_ice', icon: '🧊', label: 'Ice Bucket', serviceType: 'Front Desk Inquiry', details: 'Ice bucket requested', staffTab: 'front_desk' },
    { id: 'one_tap_wakeup', icon: '⏰', label: 'Wake-up 7AM', serviceType: 'Wake-up Call / Alarm Service', details: 'Wake-up call at 7:00 AM', staffTab: 'front_desk' },
    { id: 'one_tap_taxi', icon: '🚕', label: 'Book Taxi', serviceType: 'Front Desk Inquiry', details: 'Taxi booking requested', staffTab: 'front_desk' },
    { id: 'one_tap_maintenance', icon: '🔧', label: 'Report Issue', serviceType: 'Maintenance / Technical Support', details: 'Technical issue reported', staffTab: 'maintenance' },
    { id: 'one_tap_luggage', icon: '🧳', label: 'Luggage Help', serviceType: 'Luggage Assistance', details: 'Luggage assistance requested', staffTab: 'front_desk' }
];

async function oneTapService(serviceId) {
    const service = ONE_TAP_SERVICES.find(s => s.id === serviceId);
    if (!service) return;
    
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    if (!room) {
        showToast('Please verify your room first', 'error');
        return;
    }
    
    const requestData = {
        room_number: String(room),
        guest_name: cachedGuestData?.guest_name || 'Guest',
        service_type: service.serviceType,
        details: service.details,
        status: 'Pending',
        created_at: new Date().toISOString()
    };
    
    try {
        if (supabaseClient) {
            const { error } = await supabaseClient
                .from('guest_requests')
                .insert([requestData]);
                
            if (error) {
                console.error('Error submitting one-tap:', error);
                showToast('Error: ' + error.message, 'error');
                return;
            }
        }
        
        showToast(`${service.icon} ${service.label} requested!`, 'success');
        
        // Suivre l'utilisation
        trackServiceUsage(service.serviceType);
        
        // Rafraîchir les demandes
        if (typeof fetchServiceRequestsTracking === 'function') {
            fetchServiceRequestsTracking();
        }
        
    } catch (err) {
        console.error('Error submitting one-tap:', err);
        showToast('Error: ' + err.message, 'error');
    }
}

function renderOneTapServices() {
    const container = document.getElementById('oneTapContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="p-3 bg-stone-950/60 border border-amber-500/20 rounded-2xl">
            <p class="text-[9px] font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-wider mb-2">
                <i class="fas fa-hand-pointer mr-1"></i> One-Tap Services
            </p>
            <div class="grid grid-cols-4 gap-2">
                ${ONE_TAP_SERVICES.map(service => `
                    <button onclick="oneTapService('${service.id}')" class="bg-stone-800 hover:bg-stone-700 text-stone-200 p-3 rounded-xl text-center transition hover:border-amber-500/50 border border-transparent">
                        <span class="text-2xl block mb-1">${service.icon}</span>
                        <span class="text-[7px] font-bold">${service.label}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

// ==================== RACCOURCIS RAPIDES ====================
function trackServiceUsage(serviceId) {
    const usageKey = 'remal_service_usage';
    let usage = JSON.parse(localStorage.getItem(usageKey) || '{}');
    
    usage[serviceId] = (usage[serviceId] || 0) + 1;
    
    const sortedEntries = Object.entries(usage).sort((a, b) => b[1] - a[1]);
    if (sortedEntries.length > 5) {
        usage = Object.fromEntries(sortedEntries.slice(0, 5));
    }
    
    localStorage.setItem(usageKey, JSON.stringify(usage));
    renderQuickAccess();
}

function getFrequentServices() {
    const usageKey = 'remal_service_usage';
    const usage = JSON.parse(localStorage.getItem(usageKey) || '{}');
    
    return Object.entries(usage)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([serviceId, count]) => ({
            serviceId,
            count,
            serviceData: SERVICES_DATA[serviceId]
        }))
        .filter(item => item.serviceData);
}

function renderQuickAccess() {
    const container = document.getElementById('quickAccessContainer');
    if (!container) return;
    
    const frequentServices = getFrequentServices();
    
    if (frequentServices.length === 0) {
        container.classList.add('hidden');
        container.innerHTML = '';
        return;
    }
    
    container.classList.remove('hidden');
    
    container.innerHTML = `
        <div class="p-3 bg-stone-950/60 border border-amber-500/20 rounded-2xl">
            <p class="text-[9px] font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-wider mb-2">
                <i class="fas fa-bolt mr-1"></i> Quick Access
            </p>
            <div class="flex gap-2 flex-wrap">
                ${frequentServices.map(item => `
                    <button onclick="quickAccessService('${item.serviceId}')" class="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-full text-[9px] font-bold transition">
                        <i class="fas ${item.serviceData.icon} text-[var(--text-gold,#DCA773)]"></i>
                        ${item.serviceData.title.split('/')[0].trim()}
                        <span class="bg-stone-700 text-stone-400 px-1.5 py-0.5 rounded-full text-[7px]">${item.count}x</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function quickAccessService(serviceId) {
    trackServiceUsage(serviceId);
    showService(serviceId);
}

function initQuickAccess() {
    renderQuickAccess();
    renderOneTapServices();
}
