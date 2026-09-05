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
