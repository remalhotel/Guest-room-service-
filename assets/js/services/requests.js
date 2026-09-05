// ==================== SERVICE REQUESTS ====================
async function submitOtherService() {
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    const notes = document.getElementById('otherServiceNotes').value.trim();
    const serviceData = SERVICES_DATA[currentService];
    
    if (!serviceData) {
        showToast('Error: Service not found', 'error');
        return;
    }
    
    if (!room) {
        showToast('Error: Room not found', 'error');
        return;
    }
    
    let details = [];
    serviceData.fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
            details.push(`${field.label}: ${element.value}`);
        }
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
    
    console.log('📤 Submitting service request:', requestData);
    
    try {
        if (supabaseClient) {
            const { data, error } = await supabaseClient
                .from('guest_requests')
                .insert([requestData])
                .select();
                
            if (error) {
                console.error('❌ Supabase error:', error);
                showToast('Error: ' + error.message, 'error');
                return;
            }
            
            console.log('✅ Request submitted:', data);
        } else {
            console.warn('⚠️ No Supabase client, simulating submission');
        }
        
        showToast('✅ Request submitted!', 'success');
        document.getElementById('otherServiceNotes').value = '';
        backToServices();
        renderServiceRequestsTracking();
        
    } catch (err) {
        console.error('❌ Error submitting request:', err);
        showToast('Error: ' + err.message, 'error');
    }
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
        
        if (error) {
            console.warn('Error loading requests:', error);
            window.activeServiceRequests = [];
        } else {
            window.activeServiceRequests = data.filter(r => r.status === 'Pending' || r.status === 'In Progress');
        }
    } catch (err) {
        console.warn('Error loading requests:', err);
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
    
    container.innerHTML = `
        <div class="p-4 bg-stone-950/60 border border-amber-500/20 rounded-2xl space-y-3">
            <span class="text-[10px] font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-wider">
                <i class="fas fa-clipboard-list mr-1"></i> ${TRANSLATIONS[currentLanguage]?.serviceRequestsTracking || TRANSLATIONS.en.serviceRequestsTracking}
            </span>
            ${requests.map(request => {
                const statusColors = {
                    'Pending': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', label: TRANSLATIONS[currentLanguage]?.pendingStatus || TRANSLATIONS.en.pendingStatus },
                    'In Progress': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', label: TRANSLATIONS[currentLanguage]?.inProgressStatus || TRANSLATIONS.en.inProgressStatus },
                    'Completed': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', label: TRANSLATIONS[currentLanguage]?.completedStatus || TRANSLATIONS.en.completedStatus }
                };
                const sc = statusColors[request.status] || statusColors['Pending'];
                const timeAgo = getTimeAgo(request.created_at);
                
                const stepIndex = request.status === 'Pending' ? 0 : request.status === 'In Progress' ? 1 : 2;
                
                return `
                    <div class="service-tracking-card">
                        <div class="flex justify-between items-center mb-2">
                            <p class="font-bold text-stone-100 text-xs">${request.service_type}</p>
                            <span class="text-[9px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text} border ${sc.border}">${sc.label}</span>
                        </div>
                        <div class="order-progress">
                            <div class="order-progress-step">
                                <div class="service-tracking-dot ${stepIndex >= 0 ? 'active completed' : ''}"><i class="fas fa-check"></i></div>
                                <span class="order-progress-label ${stepIndex >= 0 ? 'active' : ''}">${TRANSLATIONS[currentLanguage]?.pendingStatus || TRANSLATIONS.en.pendingStatus}</span>
                            </div>
                            <div class="service-tracking-line ${stepIndex >= 1 ? 'completed' : ''}"></div>
                            <div class="order-progress-step">
                                <div class="service-tracking-dot ${stepIndex >= 1 ? 'active completed' : ''}"><i class="fas fa-cog"></i></div>
                                <span class="order-progress-label ${stepIndex >= 1 ? 'active' : ''}">${TRANSLATIONS[currentLanguage]?.inProgressStatus || TRANSLATIONS.en.inProgressStatus}</span>
                            </div>
                            <div class="service-tracking-line ${stepIndex >= 2 ? 'completed' : ''}"></div>
                            <div class="order-progress-step">
                                <div class="service-tracking-dot ${stepIndex >= 2 ? 'active completed' : ''}"><i class="fas fa-check-double"></i></div>
                                <span class="order-progress-label ${stepIndex >= 2 ? 'active' : ''}">${TRANSLATIONS[currentLanguage]?.completedStatus || TRANSLATIONS.en.completedStatus}</span>
                            </div>
                        </div>
                        <p class="text-[9px] text-stone-400 mt-2">${TRANSLATIONS[currentLanguage]?.submittedAt || TRANSLATIONS.en.submittedAt}: ${timeAgo}</p>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// ==================== TABLEAU DE BORD DES DEMANDES ====================
function createDashboardView() {
    const container = document.getElementById('servicesTrackingContainer');
    if (!container) return;
    
    const requests = window.activeServiceRequests || [];
    
    if (requests.length === 0) {
        container.innerHTML = `
            <div class="p-4 bg-stone-950/60 border border-amber-500/20 rounded-2xl text-center">
                <i class="fas fa-inbox text-2xl text-stone-600 mb-2"></i>
                <p class="text-[10px] text-stone-400">${TRANSLATIONS[currentLanguage]?.noActiveRequests || TRANSLATIONS.en.noActiveRequests}</p>
            </div>
        `;
        container.classList.remove('hidden');
        return;
    }
    
    const pendingCount = requests.filter(r => r.status === 'Pending').length;
    const inProgressCount = requests.filter(r => r.status === 'In Progress').length;
    const completedCount = requests.filter(r => r.status === 'Completed').length;
    
    container.innerHTML = `
        <div class="p-4 bg-stone-950/60 border border-amber-500/20 rounded-2xl space-y-4">
            <div class="flex justify-between items-center">
                <span class="text-[10px] font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-wider">
                    <i class="fas fa-chart-bar mr-1"></i> ${TRANSLATIONS[currentLanguage]?.serviceRequestsTracking || TRANSLATIONS.en.serviceRequestsTracking}
                </span>
                <button onclick="refreshDashboard()" class="text-[10px] text-stone-400 hover:text-[var(--text-gold,#DCA773)]">
                    <i class="fas fa-sync-alt"></i>
                </button>
            </div>
            
            <div class="grid grid-cols-3 gap-2">
                <div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2 text-center">
                    <p class="text-lg font-bold text-amber-400">${pendingCount}</p>
                    <p class="text-[8px] text-stone-400 uppercase">${TRANSLATIONS[currentLanguage]?.pendingStatus || TRANSLATIONS.en.pendingStatus}</p>
                </div>
                <div class="bg-blue-500/10 border border-blue-500/20 rounded-xl p-2 text-center">
                    <p class="text-lg font-bold text-blue-400">${inProgressCount}</p>
                    <p class="text-[8px] text-stone-400 uppercase">${TRANSLATIONS[currentLanguage]?.inProgressStatus || TRANSLATIONS.en.inProgressStatus}</p>
                </div>
                <div class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2 text-center">
                    <p class="text-lg font-bold text-emerald-400">${completedCount}</p>
                    <p class="text-[8px] text-stone-400 uppercase">${TRANSLATIONS[currentLanguage]?.completedStatus || TRANSLATIONS.en.completedStatus}</p>
                </div>
            </div>
            
            <div class="space-y-2 max-h-60 overflow-y-auto">
                ${requests.map(request => {
                    const statusConfig = getRequestStatusConfig(request.status);
                    const timeAgo = getTimeAgo(request.created_at);
                    
                    return `
                        <div class="bg-stone-900/50 border ${statusConfig.border} rounded-xl p-3 transition">
                            <div class="flex justify-between items-start mb-2">
                                <div class="flex-1">
                                    <p class="font-bold text-stone-100 text-xs">${request.service_type}</p>
                                    <p class="text-[9px] text-stone-400 mt-1 line-clamp-2">${request.details || ''}</p>
                                </div>
                                <span class="text-[9px] font-bold px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} ml-2">
                                    ${statusConfig.icon} ${statusConfig.label}
                                </span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-[8px] text-stone-500">${TRANSLATIONS[currentLanguage]?.submittedAt || TRANSLATIONS.en.submittedAt}: ${timeAgo}</span>
                                <div class="flex gap-1">
                                    ${request.status === 'Pending' ? `
                                        <button onclick="cancelRequest('${request.id}')" class="text-[8px] text-red-400 hover:text-red-300">
                                            <i class="fas fa-times-circle"></i> Cancel
                                        </button>
                                    ` : ''}
                                    <button onclick="viewRequestDetails('${request.id}')" class="text-[8px] text-stone-400 hover:text-[var(--text-gold,#DCA773)]">
                                        <i class="fas fa-eye"></i> Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    container.classList.remove('hidden');
}

function getRequestStatusConfig(status) {
    const configs = {
        'Pending': {
            bg: 'bg-amber-500/20',
            text: 'text-amber-400',
            border: 'border-amber-500/30',
            color: 'amber',
            icon: '⏳',
            label: TRANSLATIONS[currentLanguage]?.pendingStatus || TRANSLATIONS.en.pendingStatus
        },
        'In Progress': {
            bg: 'bg-blue-500/20',
            text: 'text-blue-400',
            border: 'border-blue-500/30',
            color: 'blue',
            icon: '🔄',
            label: TRANSLATIONS[currentLanguage]?.inProgressStatus || TRANSLATIONS.en.inProgressStatus
        },
        'Completed': {
            bg: 'bg-emerald-500/20',
            text: 'text-emerald-400',
            border: 'border-emerald-500/30',
            color: 'emerald',
            icon: '✅',
            label: TRANSLATIONS[currentLanguage]?.completedStatus || TRANSLATIONS.en.completedStatus
        }
    };
    return configs[status] || configs['Pending'];
}

function refreshDashboard() {
    fetchServiceRequestsTracking();
    showToast('Dashboard refreshed', 'info');
}

async function cancelRequest(requestId) {
    if (!requestId || !supabaseClient) return;
    
    if (!confirm('Are you sure you want to cancel this request?')) return;
    
    try {
        const { error } = await supabaseClient
            .from('guest_requests')
            .update({ status: 'Cancelled' })
            .eq('id', requestId);
            
        if (error) {
            showToast('Error: ' + error.message, 'error');
            return;
        }
        
        showToast('Request cancelled', 'success');
        fetchServiceRequestsTracking();
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
}

function viewRequestDetails(requestId) {
    const request = (window.activeServiceRequests || []).find(r => r.id === requestId);
    if (!request) return;
    
    const detailsModal = document.createElement('div');
    detailsModal.className = 'fixed inset-0 bg-black/90 z-[400] flex items-center justify-center p-4 backdrop-blur-sm';
    detailsModal.id = 'requestDetailsModal';
    
    const statusConfig = getRequestStatusConfig(request.status);
    
    detailsModal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl">
            <div class="flex justify-between items-center border-b border-stone-800 pb-3">
                <h3 class="text-xs font-serif-luxury font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-widest">
                    Request Details
                </h3>
                <button onclick="closeRequestDetails()" class="text-stone-400 hover:text-stone-100 text-xl font-bold">✕</button>
            </div>
            
            <div class="space-y-3">
                <div>
                    <p class="text-[9px] text-stone-400 uppercase font-bold">Service Type</p>
                    <p class="text-sm font-bold text-stone-100">${request.service_type}</p>
                </div>
                
                <div>
                    <p class="text-[9px] text-stone-400 uppercase font-bold">Status</p>
                    <span class="text-[9px] font-bold px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}">
                        ${statusConfig.icon} ${statusConfig.label}
                    </span>
                </div>
                
                <div>
                    <p class="text-[9px] text-stone-400 uppercase font-bold">Details</p>
                    <div class="bg-stone-950/60 border border-stone-800 rounded-xl p-3 mt-1">
                        <p class="text-[10px] text-stone-300 whitespace-pre-line">${request.details || 'No details provided'}</p>
                    </div>
                </div>
                
                <div>
                    <p class="text-[9px] text-stone-400 uppercase font-bold">Submitted</p>
                    <p class="text-[10px] text-stone-300">${new Date(request.created_at).toLocaleString()}</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(detailsModal);
}

function closeRequestDetails() {
    const modal = document.getElementById('requestDetailsModal');
    if (modal) modal.remove();
}
