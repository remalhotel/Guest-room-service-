// ==================== SERVICE REQUESTS ====================
let requestNotificationChannel = null;
let pendingReminderInterval = null;

async function submitOtherService() {
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
        startPendingReminders();
        
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
                <i class="fas fa-clipboard-list mr-1"></i> Service Requests Tracking
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
                const waitTime = getWaitTime(request.created_at);
                
                return `
                    <div class="service-tracking-card">
                        <div class="flex justify-between items-center mb-2">
                            <p class="font-bold text-stone-100 text-xs">${request.service_type}</p>
                            <span class="text-[9px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text} border ${sc.border}">${sc.label}</span>
                        </div>
                        
                        ${request.status === 'Pending' && waitTime.minutes > 15 ? `
                            <div class="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 mb-2">
                                <p class="text-[8px] text-amber-400 font-bold">
                                    <i class="fas fa-hourglass-half mr-1"></i> Waiting for ${waitTime.display}
                                </p>
                            </div>
                        ` : ''}
                        
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

function getWaitTime(createdAt) {
    const now = new Date();
    const then = new Date(createdAt);
    const diffMinutes = Math.floor((now - then) / 60000);
    
    if (diffMinutes < 1) return { minutes: diffMinutes, display: 'just now' };
    if (diffMinutes < 60) return { minutes: diffMinutes, display: `${diffMinutes} min` };
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return { minutes: diffMinutes, display: `${hours}h ${mins}m` };
}

// ==================== RAPPELS POUR DEMANDES EN ATTENTE ====================
function startPendingReminders() {
    if (pendingReminderInterval) clearInterval(pendingReminderInterval);
    
    // Vérifier toutes les 5 minutes
    pendingReminderInterval = setInterval(() => {
        checkPendingRequests();
    }, 5 * 60 * 1000);
}

function checkPendingRequests() {
    const requests = window.activeServiceRequests || [];
    const pendingRequests = requests.filter(r => r.status === 'Pending');
    
    pendingRequests.forEach(request => {
        const waitTime = getWaitTime(request.created_at);
        const reminderKey = `reminder_sent_${request.id}`;
        
        // Rappel après 15 minutes
        if (waitTime.minutes >= 15 && waitTime.minutes < 20 && !localStorage.getItem(reminderKey)) {
            localStorage.setItem(reminderKey, '15min');
            showPendingReminder(request, '15 minutes');
        }
        // Rappel après 30 minutes
        else if (waitTime.minutes >= 30 && waitTime.minutes < 35 && localStorage.getItem(reminderKey) !== '30min') {
            localStorage.setItem(reminderKey, '30min');
            showPendingReminder(request, '30 minutes');
        }
        // Rappel après 60 minutes
        else if (waitTime.minutes >= 60 && waitTime.minutes < 65 && localStorage.getItem(reminderKey) !== '60min') {
            localStorage.setItem(reminderKey, '60min');
            showPendingReminder(request, '1 hour');
        }
    });
}

function showPendingReminder(request, timeText) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification toast-in';
    toast.style.borderColor = '#f59e0b';
    
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <span class="text-2xl">⏳</span>
            <div>
                <p class="text-xs font-bold text-stone-100">Request Still Pending</p>
                <p class="text-[10px] text-stone-300">${request.service_type} - Waiting for ${timeText}</p>
                <button onclick="contactStaffAboutRequest('${request.id}')" class="text-[9px] text-amber-400 font-bold mt-1">
                    Contact Staff
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => { 
        toast.style.opacity = '0'; 
        toast.style.transition = 'opacity 0.3s ease'; 
        setTimeout(() => toast.remove(), 300); 
    }, 8000);
}

function contactStaffAboutRequest(requestId) {
    document.querySelectorAll('.toast-notification').forEach(t => t.remove());
    
    // Ouvrir le chat avec un message pré-rempli
    openGuestChatModal();
    
    const input = document.getElementById('guestChatInput');
    if (input) {
        input.value = `I'm following up on my request #${String(requestId).slice(-6)}. Can you check the status?`;
        input.focus();
    }
}

function stopPendingReminders() {
    if (pendingReminderInterval) {
        clearInterval(pendingReminderInterval);
        pendingReminderInterval = null;
    }
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
        
        // Supprimer le rappel local
        localStorage.removeItem(`reminder_sent_${requestData.id}`);
        
        setTimeout(() => {
            if (typeof showStaffRatingModal === 'function') {
                showStaffRatingModal(requestData.id, requestData.service_type);
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
                showToast('Error saving rating', 'error');
                return;
            }
        }
        
        closeStaffRating();
        showToast(`Thank you for rating ${staffRatingValue} stars! 🌟`, 'success');
        staffRatingValue = 0;
        
    } catch (err) {
        showToast('Error saving rating', 'error');
    }
}
