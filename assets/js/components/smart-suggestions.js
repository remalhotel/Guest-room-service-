// ==================== SUGGESTIONS INTELLIGENTES SELON L'HEURE ====================
let smartSuggestionsInterval = null;

function initSmartSuggestions() {
    renderSmartSuggestions();
    
    smartSuggestionsInterval = setInterval(() => {
        renderSmartSuggestions();
    }, 30 * 60 * 1000);
}

function getCurrentTimeContext() {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 11) {
        return {
            period: 'morning',
            icon: '🌅',
            title: 'Good Morning!',
            suggestions: [
                { icon: '☕', text: 'Order breakfast in bed', action: 'breakfast' },
                { icon: '🧘', text: 'Morning yoga session', action: 'wellness' },
                { icon: '📰', text: 'Request newspaper', action: 'newspaper' },
                { icon: '⏰', text: 'Set wake-up call', action: 'wakeup' }
            ]
        };
    } else if (hour >= 11 && hour < 15) {
        return {
            period: 'afternoon',
            icon: '☀️',
            title: 'Good Afternoon!',
            suggestions: [
                { icon: '🍽️', text: 'Order lunch', action: 'lunch' },
                { icon: '🏊', text: 'Pool is open', action: 'pool' },
                { icon: '🧹', text: 'Request cleaning', action: 'cleaning' },
                { icon: '🚕', text: 'Book taxi', action: 'taxi' }
            ]
        };
    } else if (hour >= 15 && hour < 19) {
        return {
            period: 'evening',
            icon: '🌤️',
            title: 'Good Evening!',
            suggestions: [
                { icon: '🍵', text: 'Afternoon tea', action: 'tea' },
                { icon: '🛏️', text: 'Turndown service', action: 'turndown' },
                { icon: '🎮', text: 'Entertainment options', action: 'entertainment' },
                { icon: '🍹', text: 'Lounge access', action: 'lounge' }
            ]
        };
    } else {
        return {
            period: 'night',
            icon: '🌙',
            title: 'Good Night!',
            suggestions: [
                { icon: '🍜', text: 'Late night dining', action: 'late_dining' },
                { icon: '🛎️', text: '24/7 room service', action: 'room_service' },
                { icon: '🧊', text: 'Ice bucket', action: 'ice' },
                { icon: '💧', text: 'Water bottles', action: 'water' },
                { icon: '🛏️', text: 'Extra blanket', action: 'blanket' },
                { icon: '🧴', text: 'Extra toiletries', action: 'toiletries' },
                { icon: '🔇', text: 'Quiet room request', action: 'quiet_room' },
                { icon: '☕', text: 'Hot tea service', action: 'tea_service' }
            ]
        };
    }
}

function renderSmartSuggestions() {
    const container = document.getElementById('smartSuggestionsContainer');
    if (!container) return;
    
    const context = getCurrentTimeContext();
    
    container.innerHTML = `
        <div class="p-3 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl">
            <div class="flex items-center gap-2 mb-2">
                <span class="text-xl">${context.icon}</span>
                <p class="text-[10px] font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-wider">${context.title}</p>
            </div>
            
            <div class="grid grid-cols-2 gap-2">
                ${context.suggestions.map(suggestion => `
                    <button onclick="handleSmartSuggestion('${suggestion.action}')" class="bg-stone-950/60 border border-stone-800 hover:border-amber-500/50 rounded-xl p-2.5 text-center transition">
                        <span class="text-2xl block mb-1">${suggestion.icon}</span>
                        <span class="text-[8px] text-stone-300 font-bold">${suggestion.text}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

async function handleSmartSuggestion(action) {
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    const guestName = cachedGuestData?.guest_name || 'Guest';
    
    if (!room) {
        showToast('Please verify your room first', 'error');
        return;
    }
    
    switch(action) {
        case 'breakfast':
        case 'lunch':
        case 'late_dining':
        case 'room_service':
            // Rediriger vers Room Service
            showService('room_service');
            showToast('🍽️ Select your items from the menu', 'info');
            break;
            
        case 'wakeup':
            // Demande de wake-up call
            await submitSmartRequest('Wake-up Call / Alarm Service', 'Wake-up call requested via Quick Suggestion');
            break;
            
        case 'cleaning':
        case 'turndown':
            // Demande de housekeeping
            await submitSmartRequest('Housekeeping / Room Cleaning', `${action === 'turndown' ? 'Turndown service' : 'Room cleaning'} requested via Quick Suggestion`);
            break;
            
        case 'taxi':
            // Demande de taxi
            await submitSmartRequest('Front Desk Inquiry', 'Taxi booking requested via Quick Suggestion');
            break;
            
        case 'ice':
            // Demande de glace
            await submitSmartRequest('Front Desk Inquiry', 'Ice bucket requested via Quick Suggestion');
            break;
            
        case 'water':
            // Demande d'eau
            await submitSmartRequest('Front Desk Inquiry', 'Water bottles requested via Quick Suggestion');
            break;
            
        case 'blanket':
            // Demande de couverture
            await submitSmartRequest('Housekeeping / Room Cleaning', 'Extra blanket requested via Quick Suggestion');
            break;
            
        case 'toiletries':
            // Demande de toiletries
            await submitSmartRequest('Housekeeping / Room Cleaning', 'Extra toiletries requested via Quick Suggestion');
            break;
            
        case 'quiet_room':
            // Demande de chambre calme
            await submitSmartRequest('Front Desk Inquiry', 'Quiet room requested via Quick Suggestion');
            break;
            
        case 'tea_service':
            // Demande de thé
            await submitSmartRequest('Room Service / Order Food', 'Hot tea service requested via Quick Suggestion');
            break;
            
        case 'newspaper':
            // Demande de journal
            await submitSmartRequest('Front Desk Inquiry', 'Newspaper requested via Quick Suggestion');
            break;
            
        case 'wellness':
            showToast('🧘 Wellness services available at the spa', 'info');
            await submitSmartRequest('Front Desk Inquiry', 'Wellness/spa information requested via Quick Suggestion');
            break;
            
        case 'pool':
            showToast('🏊 Pool is open from 7AM to 8PM', 'info');
            await submitSmartRequest('Front Desk Inquiry', 'Pool information requested via Quick Suggestion');
            break;
            
        case 'tea':
            showToast('🍵 Afternoon tea served in the lounge', 'info');
            await submitSmartRequest('Room Service / Order Food', 'Afternoon tea service requested via Quick Suggestion');
            break;
            
        case 'entertainment':
            showToast('🎮 Check the in-room entertainment system', 'info');
            await submitSmartRequest('Front Desk Inquiry', 'Entertainment information requested via Quick Suggestion');
            break;
            
        case 'lounge':
            showToast('🍹 Lounge is open until 11PM', 'info');
            await submitSmartRequest('Front Desk Inquiry', 'Lounge access information requested via Quick Suggestion');
            break;
            
        default:
            showService('room_service');
    }
}

async function submitSmartRequest(serviceType, details) {
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    const guestName = cachedGuestData?.guest_name || 'Guest';
    
    const requestData = {
        room_number: String(room),
        guest_name: guestName,
        service_type: serviceType,
        details: details,
        status: 'Pending',
        created_at: new Date().toISOString()
    };
    
    try {
        if (supabaseClient) {
            const { error } = await supabaseClient
                .from('guest_requests')
                .insert([requestData]);
                
            if (error) {
                console.error('Error submitting smart request:', error);
                showToast('Error: ' + error.message, 'error');
                return;
            }
        }
        
        showToast('✅ Request sent to staff!', 'success');
        
        // Rafraîchir les demandes
        if (typeof fetchServiceRequestsTracking === 'function') {
            fetchServiceRequestsTracking();
        }
        
    } catch (err) {
        console.error('Error submitting smart request:', err);
        showToast('Error: ' + err.message, 'error');
    }
}

function stopSmartSuggestions() {
    if (smartSuggestionsInterval) {
        clearInterval(smartSuggestionsInterval);
        smartSuggestionsInterval = null;
    }
}
