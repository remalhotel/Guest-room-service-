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
            
            if (data && data.length > 0) {
                startRequestNotifications(data[0].id);
            }
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
            window.activeServiceRequests = [];
        } else {
            window.activeServiceRequests = data.filter(r => r.status === 'Pending' || r.status === 'In Progress');
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
    
    container.innerHTML = `
        <div class="p-4 bg-stone-950/60 border border-amber-500/20 rounded-2xl space-y-3">
            <span class="text-[10px] font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-wider">
                <i class="fas fa-clipboard-list mr-1"></i> ${TRANSLATIONS[currentLanguage]?.serviceRequestsTracking || TRANSLATIONS.en.serviceRequestsTracking}
            </span>
            ${requests.map(request => {
                const statusColors = {
                    'Pending': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Pending' },
                    'In Progress': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', label: 'In Progress' },
                    'Completed': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Completed' }
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
                                <span class="order-progress-label ${stepIndex >= 0 ? 'active' : ''}">Pending</span>
                            </div>
                            <div class="service-tracking-line ${stepIndex >= 1 ? 'completed' : ''}"></div>
                            <div class="order-progress-step">
                                <div class="service-tracking-dot ${stepIndex >= 1 ? 'active completed' : ''}"><i class="fas fa-cog"></i></div>
                                <span class="order-progress-label ${stepIndex >= 1 ? 'active' : ''}">In Progress</span>
                            </div>
                            <div class="service-tracking-line ${stepIndex >= 2 ? 'completed' : ''}"></div>
                            <div class="order-progress-step">
                                <div class="service-tracking-dot ${stepIndex >= 2 ? 'active completed' : ''}"><i class="fas fa-check-double"></i></div>
                                <span class="order-progress-label ${stepIndex >= 2 ? 'active' : ''}">Completed</span>
                            </div>
                        </div>
                        <p class="text-[9px] text-stone-400 mt-2">Submitted: ${timeAgo}</p>
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
    fetchServiceRequestsTracking();
    
    const statusMessages = {
        'Pending': { icon: '📝', title: 'Request Received', message: 'Your request has been registered', type: 'info' },
        'In Progress': { icon: '🔄', title: 'Request In Progress', message: 'Our team is working on your request', type: 'info' },
        'Completed': { icon: '✅', title: 'Request Completed', message: 'Your request has been completed!', type: 'success' },
        'Cancelled': { icon: '❌', title: 'Request Cancelled', message: 'Your request has been cancelled', type: 'error' }
    };
    
    const config = statusMessages[newStatus] || statusMessages['Pending'];
    showRequestNotification(config.icon, config.title, config.message, config.type);
    
    if (newStatus === 'Completed') {
        if (requestNotificationChannel) {
            supabaseClient.removeChannel(requestNotificationChannel);
            requestNotificationChannel = null;
        }
        
        setTimeout(() => {
            showStaffRatingModal(requestData.id, requestData.service_type);
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

// ==================== NOTATION DU PERSONNEL ====================
let staffRatingValue = 0;

function showStaffRatingModal(requestId, serviceType) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 z-[800] flex items-center justify-center p-4 backdrop-blur-sm';
    modal.id = 'staffRatingModal';
    
    modal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl">
            <div class="flex justify-between items-center border-b border-stone-800 pb-3">
                <h3 class="text-xs font-serif-luxury font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-widest">
                    ⭐ Rate Our Staff
                </h3>
                <button onclick="closeStaffRating()" class="text-stone-400 hover:text-stone-100 text-xl font-bold">✕</button>
            </div>
            
            <div class="text-center space-y-3">
                <p class="text-[10px] text-stone-400">How was the service for:</p>
                <p class="text-sm font-bold text-stone-100">${serviceType}</p>
                
                <div class="flex justify-center gap-2" id="staffStars">
                    ${[1, 2, 3, 4, 5].map(star => `
                        <button onclick="selectStaffStar(${star})" class="staff-star-btn text-4xl hover:scale-125 transition text-stone-600" data-star="${star}">
                            ★
                        </button>
                    `).join('')}
                </div>
                
                <div>
                    <p class="text-[10px] text-stone-400 font-bold uppercase mb-2">Comments (optional)</p>
                    <textarea id="staffRatingComment" placeholder="Tell us about the staff member..." class="w-full h-16 bg-stone-950 border border-stone-800 rounded-2xl p-3 outline-none resize-none text-xs text-stone-200"></textarea>
                </div>
                
                <button onclick="submitStaffRating('${requestId}')" class="w-full bg-[#DCA773] hover:bg-[#ebd0b3] text-stone-950 font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest transition">
                    Submit Rating
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function selectStaffStar(star) {
    staffRatingValue = star;
    document.querySelectorAll('.staff-star-btn').forEach(btn => {
        const btnStar = parseInt(btn.getAttribute('data-star'));
        if (btnStar <= star) {
            btn.className = 'staff-star-btn text-4xl hover:scale-125 transition text-amber-400';
        } else {
            btn.className = 'staff-star-btn text-4xl hover:scale-125 transition text-stone-600';
        }
    });
}

function closeStaffRating() {
    const modal = document.getElementById('staffRatingModal');
    if (modal) modal.remove();
    staffRatingValue = 0;
}

async function submitStaffRating(requestId) {
    if (!staffRatingValue) {
        showToast('Please select a rating', 'error');
        return;
    }
    
    const comment = document.getElementById('staffRatingComment')?.value?.trim() || '';
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    
    const ratingData = {
        request_id: requestId,
        room_number: String(room),
        rating: staffRatingValue,
        feedback_text: comment,
        created_at: new Date().toISOString()
    };
    
    try {
        if (supabaseClient) {
            const { error } = await supabaseClient
                .from('staff_ratings')
                .insert([ratingData]);
                
            if (error) {
                console.warn('Error saving rating:', error);
                showToast('Error saving rating', 'error');
                return;
            }
        }
        
        closeStaffRating();
        showToast(`Thank you for rating ${staffRatingValue} stars! 🌟`, 'success');
        staffRatingValue = 0;
        
    } catch (err) {
        console.warn('Error saving rating:', err);
        showToast('Error saving rating', 'error');
    }
}
