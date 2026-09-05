// ==================== SERVICE REQUESTS ====================
let requestNotificationChannel = null;

async function submitOtherService() {
    console.log('📤 submitOtherService called');
    
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    const notes = document.getElementById('otherServiceNotes')?.value?.trim() || '';
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
    
    console.log('📤 Sending to Supabase:', requestData);
    
    try {
        if (supabaseClient) {
            const { data, error } = await supabaseClient
                .from('guest_requests')
                .insert([requestData])
                .select();
                
            if (error) {
                console.error('❌ Supabase error:', error.message);
                showToast('Error: ' + error.message, 'error');
                return;
            }
            
            console.log('✅ Request inserted:', data);
            
            // Démarrer les notifications en temps réel pour cette demande
            if (data && data.length > 0) {
                startRequestNotifications(data[0].id);
            }
        } else {
            console.warn('⚠️ No Supabase client');
        }
        
        showToast('✅ Request submitted!', 'success');
        document.getElementById('otherServiceNotes').value = '';
        backToServices();
        
        await fetchServiceRequestsTracking();
        
    } catch (err) {
        console.error('❌ Exception:', err);
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

// ==================== NOTIFICATIONS TEMPS RÉEL POUR DEMANDES ====================
function startRequestNotifications(requestId) {
    if (!supabaseClient || !requestId) return;
    
    if (requestNotificationChannel) {
        supabaseClient.removeChannel(requestNotificationChannel);
    }
    
    requestNotificationChannel = supabaseClient
        .channel(`request-updates-${requestId}`)
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'guest_requests',
            filter: `id=eq.${requestId}`
        }, (payload) => {
            const newStatus = payload.new.status;
            const oldStatus = payload.old.status;
            
            if (newStatus !== oldStatus) {
                handleRequestStatusChange(newStatus, oldStatus, payload.new);
            }
        })
        .subscribe();
}

function handleRequestStatusChange(newStatus, oldStatus, requestData) {
    // Rafraîchir la liste des demandes
    fetchServiceRequestsTracking();
    
    const statusMessages = {
        'Pending': { icon: '📝', title: 'Request Received', message: 'Your request has been registered', type: 'info' },
        'In Progress': { icon: '🔄', title: 'Request In Progress', message: 'Our team is working on your request', type: 'info' },
        'Completed': { icon: '✅', title: 'Request Completed', message: 'Your request has been completed!', type: 'success' },
        'Cancelled': { icon: '❌', title: 'Request Cancelled', message: 'Your request has been cancelled', type: 'error' }
    };
    
    const config = statusMessages[newStatus] || statusMessages['Pending'];
    showRequestNotification(config.icon, config.title, config.message, config.type);
    
    // Si complété, arrêter les notifications et proposer un feedback
    if (newStatus === 'Completed') {
        if (requestNotificationChannel) {
            supabaseClient.removeChannel(requestNotificationChannel);
            requestNotificationChannel = null;
        }
        
        setTimeout(() => {
            if (typeof showServiceFeedbackPrompt === 'function') {
                showServiceFeedbackPrompt(requestData.id, requestData.service_type);
            }
        }, 3000);
    }
}

function showRequestNotification(icon, title, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast-notification toast-in';
    toast.style.borderColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#DCA773';
    
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <span class="text-2xl">${icon}</span>
            <div>
                <p class="text-xs font-bold text-stone-100">${title}</p>
                <p class="text-[10px] text-stone-300">${message}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => { 
        toast.style.opacity = '0'; 
        toast.style.transition = 'opacity 0.3s ease'; 
        setTimeout(() => toast.remove(), 300); 
    }, 4000);
}

function stopRequestNotifications() {
    if (requestNotificationChannel && supabaseClient) {
        supabaseClient.removeChannel(requestNotificationChannel);
        requestNotificationChannel = null;
    }
}
