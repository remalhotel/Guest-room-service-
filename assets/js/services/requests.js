// ==================== SERVICE REQUESTS ====================
async function submitOtherService() {
    console.log('📤 submitOtherService called');
    
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    const notes = document.getElementById('otherServiceNotes')?.value?.trim() || '';
    const serviceData = SERVICES_DATA[currentService];
    
    console.log('📦 Room:', room);
    console.log('📦 Service:', currentService);
    console.log('📦 Service Data:', serviceData);
    
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
            console.log(`📝 ${field.label}: ${element.value}`);
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
                console.error('❌ Full error:', error);
                showToast('Error: ' + error.message, 'error');
                return;
            }
            
            console.log('✅ Request inserted:', data);
        } else {
            console.warn('⚠️ No Supabase client');
        }
        
        showToast('✅ Request submitted!', 'success');
        document.getElementById('otherServiceNotes').value = '';
        backToServices();
        
        // Rafraîchir la liste des demandes
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
// ==================== FEEDBACK APRÈS SERVICE ====================
function showServiceFeedbackPrompt(requestId, serviceType) {
    const feedbackModal = document.createElement('div');
    feedbackModal.className = 'fixed inset-0 bg-black/90 z-[500] flex items-center justify-center p-4 backdrop-blur-sm';
    feedbackModal.id = 'serviceFeedbackModal';
    
    feedbackModal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl">
            <div class="flex justify-between items-center border-b border-stone-800 pb-3">
                <h3 class="text-xs font-serif-luxury font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-widest">
                    ⭐ Rate Your Experience
                </h3>
                <button onclick="closeServiceFeedback()" class="text-stone-400 hover:text-stone-100 text-xl font-bold">✕</button>
            </div>
            
            <div class="space-y-3">
                <div>
                    <p class="text-[10px] text-stone-400 font-bold uppercase">Service</p>
                    <p class="text-sm font-bold text-stone-100">${serviceType}</p>
                </div>
                
                <div>
                    <p class="text-[10px] text-stone-400 font-bold uppercase mb-2">Your Rating</p>
                    <div class="flex gap-2 justify-center" id="starRating">
                        ${[1, 2, 3, 4, 5].map(star => `
                            <button onclick="selectStar(${star})" class="star-btn text-3xl hover:scale-125 transition text-stone-600" data-star="${star}">
                                ★
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div>
                    <p class="text-[10px] text-stone-400 font-bold uppercase mb-2">Comments (optional)</p>
                    <textarea id="feedbackComment" placeholder="Tell us more about your experience..." class="w-full h-20 bg-stone-950 border border-stone-800 rounded-2xl p-3 outline-none resize-none text-xs text-stone-200"></textarea>
                </div>
                
                <button onclick="submitServiceFeedback('${requestId}')" class="w-full bg-[#DCA773] hover:bg-[#ebd0b3] text-stone-950 font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest transition">
                    Submit Feedback
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(feedbackModal);
}

let selectedRating = 0;

function selectStar(star) {
    selectedRating = star;
    document.querySelectorAll('.star-btn').forEach(btn => {
        const btnStar = parseInt(btn.getAttribute('data-star'));
        if (btnStar <= star) {
            btn.className = 'star-btn text-3xl hover:scale-125 transition text-amber-400';
        } else {
            btn.className = 'star-btn text-3xl hover:scale-125 transition text-stone-600';
        }
    });
}

function closeServiceFeedback() {
    const modal = document.getElementById('serviceFeedbackModal');
    if (modal) modal.remove();
    selectedRating = 0;
}

async function submitServiceFeedback(requestId) {
    if (!selectedRating) {
        showToast('Please select a rating', 'error');
        return;
    }
    
    const comment = document.getElementById('feedbackComment')?.value?.trim() || '';
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    
    const feedbackData = {
        request_id: requestId,
        room_number: String(room),
        rating: selectedRating,
        feedback_text: comment,
        created_at: new Date().toISOString()
    };
    
    try {
        if (supabaseClient) {
            const { error } = await supabaseClient
                .from('service_feedback')
                .insert([feedbackData]);
                
            if (error) {
                console.warn('Error saving feedback:', error);
                showToast('Error saving feedback', 'error');
                return;
            }
        }
        
        closeServiceFeedback();
        showToast(`Thank you for your ${selectedRating} star rating! 🌟`, 'success');
        selectedRating = 0;
        
    } catch (err) {
        console.warn('Error saving feedback:', err);
        showToast('Error saving feedback', 'error');
    }
}

// Vérifier et afficher le feedback pour les demandes complétées
function checkForCompletedRequests() {
    const requests = window.activeServiceRequests || [];
    const completedRequests = requests.filter(r => r.status === 'Completed');
    
    completedRequests.forEach(request => {
        const feedbackKey = `feedback_shown_${request.id}`;
        if (!localStorage.getItem(feedbackKey)) {
            localStorage.setItem(feedbackKey, 'true');
            setTimeout(() => {
                showServiceFeedbackPrompt(request.id, request.service_type);
            }, 2000);
        }
    });
}
