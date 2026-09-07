// ==================== NAVIGATION FUNCTIONS ====================
function switchTab(tab) {
    currentTab = tab;
    document.getElementById('servicesSection').classList.add('hidden');
    document.getElementById('offersSection').classList.add('hidden');
    document.getElementById('faqSection').classList.add('hidden');
    
    document.getElementById('tabServices').classList.remove('active');
    document.getElementById('tabOffers').classList.remove('active');
    document.getElementById('tabFaq').classList.remove('active');
    
    if (tab === 'services') {
        document.getElementById('servicesSection').classList.remove('hidden');
        document.getElementById('tabServices').classList.add('active');
        renderServiceRequestsTracking();
    } else if (tab === 'offers') {
        document.getElementById('offersSection').classList.remove('hidden');
        document.getElementById('tabOffers').classList.add('active');
        fetchOffers();
    } else if (tab === 'faq') {
        document.getElementById('faqSection').classList.remove('hidden');
        document.getElementById('tabFaq').classList.add('active');
        renderFaqList();
    }
}

function showService(serviceId) {
    currentService = serviceId;
    document.getElementById('servicesList').classList.add('hidden');
    if (serviceId === 'room_service') {
        document.getElementById('roomServiceSection').classList.remove('hidden');
        document.getElementById('otherServiceSection').classList.add('hidden');
        renderMenuItems();
    } else {
        document.getElementById('roomServiceSection').classList.add('hidden');
        document.getElementById('otherServiceSection').classList.remove('hidden');
        const serviceData = SERVICES_DATA[serviceId];
        if (serviceData) {
            document.getElementById('otherServiceTitle').innerText = serviceData.title;
            document.getElementById('otherServiceSubtitle').innerText = serviceData.subtitle;
            document.getElementById('otherServiceIcon').innerHTML = `<i class="fas ${serviceData.icon}"></i>`;
            renderServiceFields(serviceData.fields);
        }
    }
}

function backToServices() {
    document.getElementById('servicesList').classList.remove('hidden');
    document.getElementById('roomServiceSection').classList.add('hidden');
    document.getElementById('otherServiceSection').classList.add('hidden');
    currentService = null;
    renderServiceRequestsTracking();
}

function renderServiceFields(fields) {
    const container = document.getElementById('otherServiceFields');
    container.innerHTML = fields.map(field => {
        if (field.type === 'select') {
            return `<div><label class="block font-bold text-[var(--text-gold,#DCA773)] mb-1.5 uppercase tracking-wider text-[10px]">${field.label}</label><select id="${field.id}" class="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3.5 font-bold cursor-pointer text-xs text-stone-200">${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}</select></div>`;
        } else if (field.type === 'date') {
            const today = new Date().toISOString().split('T')[0];
            return `<div><label class="block font-bold text-[var(--text-gold,#DCA773)] mb-1.5 uppercase tracking-wider text-[10px]">${field.label}</label><input type="date" id="${field.id}" value="${today}" class="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3.5 font-bold text-xs text-stone-200"></div>`;
        } else if (field.type === 'time') {
            return `<div><label class="block font-bold text-[var(--text-gold,#DCA773)] mb-1.5 uppercase tracking-wider text-[10px]">${field.label}</label><input type="time" id="${field.id}" value="19:30" class="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3.5 font-bold text-xs text-stone-200"></div>`;
        } else if (field.type === 'number') {
            return `<div><label class="block font-bold text-[var(--text-gold,#DCA773)] mb-1.5 uppercase tracking-wider text-[10px]">${field.label}</label><input type="number" id="${field.id}" min="1" max="10" value="1" class="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3.5 font-bold text-xs text-stone-200"></div>`;
        }
        return '';
    }).join('');
}
// ==================== ONE-TAP SERVICES ====================
const ONE_TAP_SERVICES = [
    { id: 'one_tap_cleaning', icon: '🧹', label: 'Clean Room', serviceType: 'Housekeeping / Room Cleaning', details: 'Immediate room cleaning requested' },
    { id: 'one_tap_towels', icon: '🧴', label: 'Fresh Towels', serviceType: 'Housekeeping / Room Cleaning', details: 'Fresh towels requested' },
    { id: 'one_tap_water', icon: '💧', label: 'Water', serviceType: 'Front Desk Inquiry', details: 'Water bottles requested' },
    { id: 'one_tap_ice', icon: '🧊', label: 'Ice', serviceType: 'Front Desk Inquiry', details: 'Ice bucket requested' },
    { id: 'one_tap_wakeup', icon: '⏰', label: 'Wake-up 7AM', serviceType: 'Wake-up Call / Alarm Service', details: 'Wake-up call at 7:00 AM' },
    { id: 'one_tap_taxi', icon: '🚕', label: 'Taxi', serviceType: 'Front Desk Inquiry', details: 'Taxi booking requested' }
];

async function oneTapService(serviceId) {
    const service = ONE_TAP_SERVICES.find(s => s.id === serviceId);
    if (!service) return;
    
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    if (!room) { showToast('Verify room first', 'error'); return; }
    
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
            const { error } = await supabaseClient.from('guest_requests').insert([requestData]);
            if (error) { showToast('Error: ' + error.message, 'error'); return; }
        }
        showToast(`${service.icon} ${service.label} requested!`, 'success');
        if (typeof fetchServiceRequestsTracking === 'function') fetchServiceRequestsTracking();
    } catch (err) {
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
            <div class="grid grid-cols-3 gap-2">
                ${ONE_TAP_SERVICES.map(service => `
                    <button onclick="oneTapService('${service.id}')" class="bg-stone-800 hover:bg-stone-700 text-stone-200 p-3 rounded-xl text-center transition border border-transparent hover:border-amber-500/50">
                        <span class="text-2xl block mb-1">${service.icon}</span>
                        <span class="text-[7px] font-bold">${service.label}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

// Exposer
window.oneTapService = oneTapService;
window.renderOneTapServices = renderOneTapServices;
// Exposer
window.switchTab = switchTab;
window.showService = showService;
window.backToServices = backToServices;
window.renderServiceFields = renderServiceFields;
