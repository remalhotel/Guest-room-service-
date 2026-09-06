// ==================== SUGGESTIONS INTELLIGENTES SELON L'HEURE ====================
let smartSuggestionsInterval = null;

function initSmartSuggestions() {
    renderSmartSuggestions();
    
    // Mettre à jour toutes les 30 minutes
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
                { icon: '📰', text: 'Request newspaper', action: 'service' },
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
                { icon: '💧', text: 'Water bottles', action: 'water' }
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

function handleSmartSuggestion(action) {
    switch(action) {
        case 'breakfast':
        case 'lunch':
        case 'late_dining':
            showService('room_service');
            break;
        case 'wakeup':
            showService('wakeup_call');
            break;
        case 'cleaning':
        case 'turndown':
            showService('housekeeping');
            break;
        case 'taxi':
            showService('front_desk');
            break;
        case 'ice':
        case 'water':
            oneTapService(action === 'ice' ? 'one_tap_ice' : 'one_tap_water');
            break;
        case 'wellness':
            showToast('🧘 Wellness services available at the spa', 'info');
            break;
        case 'pool':
            showToast('🏊 Pool is open from 7AM to 8PM', 'info');
            break;
        case 'tea':
            showToast('🍵 Afternoon tea served in the lounge', 'info');
            break;
        case 'entertainment':
            showToast('🎮 Check the in-room entertainment system', 'info');
            break;
        case 'lounge':
            showToast('🍹 Lounge is open until 11PM', 'info');
            break;
        default:
            showService('room_service');
    }
}

function stopSmartSuggestions() {
    if (smartSuggestionsInterval) {
        clearInterval(smartSuggestionsInterval);
        smartSuggestionsInterval = null;
    }
}
