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

// Exposer
window.switchTab = switchTab;
window.showService = showService;
window.backToServices = backToServices;
window.renderServiceFields = renderServiceFields;
