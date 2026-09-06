// ==================== PROFIL CLIENT ET PRÉFÉRENCES ====================
let guestPreferences = null;

function initProfile() {
    loadPreferences();
    renderProfileButton();
}

function loadPreferences() {
    try {
        const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
        const key = `remal_preferences_${room}`;
        guestPreferences = JSON.parse(localStorage.getItem(key) || 'null');
        
        if (!guestPreferences) {
            guestPreferences = {
                dietary: [],
                allergies: [],
                room_preferences: [],
                language: currentLanguage,
                notifications: true,
                email: '',
                phone: ''
            };
        }
    } catch (e) {
        guestPreferences = {
            dietary: [],
            allergies: [],
            room_preferences: [],
            language: currentLanguage,
            notifications: true,
            email: '',
            phone: ''
        };
    }
}

function savePreferences() {
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    const key = `remal_preferences_${room}`;
    localStorage.setItem(key, JSON.stringify(guestPreferences));
}

function renderProfileButton() {
    const container = document.getElementById('profileButtonContainer');
    if (!container) return;
    
    container.innerHTML = `
        <button onclick="showProfileModal()" class="w-full p-3 bg-stone-950/60 border border-amber-500/20 rounded-2xl hover:border-amber-500/50 transition">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[var(--text-gold,#DCA773)] text-stone-950 flex items-center justify-center font-bold">
                    <i class="fas fa-user"></i>
                </div>
                <div class="text-left flex-1">
                    <p class="font-bold text-stone-100 text-xs">${cachedGuestData?.guest_name || 'Guest'}</p>
                    <p class="text-[9px] text-stone-400">Room ${cachedGuestData?.room || localStorage.getItem('remal_guest_room')}</p>
                </div>
                <i class="fas fa-chevron-right text-stone-400 text-xs"></i>
            </div>
        </button>
    `;
}

function showProfileModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 z-[800] flex items-center justify-center p-4 backdrop-blur-sm';
    modal.id = 'profileModal';
    
    modal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center border-b border-stone-800 pb-3">
                <h3 class="text-xs font-serif-luxury font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-widest">
                    👤 My Profile
                </h3>
                <button onclick="closeProfileModal()" class="text-stone-400 hover:text-stone-100 text-xl font-bold">✕</button>
            </div>
            
            <div class="space-y-4">
                <!-- Informations -->
                <div class="p-3 bg-stone-950/60 border border-stone-800 rounded-2xl space-y-2">
                    <p class="text-[10px] font-bold text-[var(--text-gold,#DCA773)] uppercase">Guest Information</p>
                    <div class="flex justify-between">
                        <span class="text-[10px] text-stone-400">Name</span>
                        <span class="text-[10px] font-bold text-stone-100">${cachedGuestData?.guest_name || 'Guest'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-[10px] text-stone-400">Room</span>
                        <span class="text-[10px] font-bold text-stone-100">${cachedGuestData?.room || localStorage.getItem('remal_guest_room')}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-[10px] text-stone-400">Room Type</span>
                        <span class="text-[10px] font-bold text-stone-100">${cachedGuestData?.room_typ || 'Standard'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-[10px] text-stone-400">Departure</span>
                        <span class="text-[10px] font-bold text-stone-100">${cachedGuestData?.departure || '---'}</span>
                    </div>
                </div>
                
                <!-- Préférences alimentaires -->
                <div>
                    <p class="text-[10px] font-bold text-[var(--text-gold,#DCA773)] uppercase mb-2">Dietary Preferences</p>
                    <div class="flex flex-wrap gap-2" id="dietaryContainer">
                        ${['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'No Preference'].map(diet => `
                            <button onclick="toggleDietary('${diet}')" class="pref-btn px-3 py-1.5 rounded-full text-[9px] font-bold transition border ${guestPreferences.dietary.includes(diet) ? 'bg-amber-400 text-stone-950 border-amber-400' : 'bg-stone-800 text-stone-400 border-stone-700'}" data-diet="${diet}">
                                ${diet}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Allergies -->
                <div>
                    <p class="text-[10px] font-bold text-[var(--text-gold,#DCA773)] uppercase mb-2">Allergies</p>
                    <div class="flex flex-wrap gap-2" id="allergiesContainer">
                        ${['Peanuts', 'Shellfish', 'Eggs', 'Milk', 'Soy', 'Wheat', 'Fish', 'None'].map(allergy => `
                            <button onclick="toggleAllergy('${allergy}')" class="pref-btn px-3 py-1.5 rounded-full text-[9px] font-bold transition border ${guestPreferences.allergies.includes(allergy) ? 'bg-red-400 text-stone-950 border-red-400' : 'bg-stone-800 text-stone-400 border-stone-700'}" data-allergy="${allergy}">
                                ${allergy}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Préférences de chambre -->
                <div>
                    <p class="text-[10px] font-bold text-[var(--text-gold,#DCA773)] uppercase mb-2">Room Preferences</p>
                    <div class="flex flex-wrap gap-2" id="roomPrefsContainer">
                        ${['High Floor', 'Low Floor', 'Quiet Room', 'Extra Pillows', 'Extra Blanket', 'Feather-Free'].map(pref => `
                            <button onclick="toggleRoomPref('${pref}')" class="pref-btn px-3 py-1.5 rounded-full text-[9px] font-bold transition border ${guestPreferences.room_preferences.includes(pref) ? 'bg-blue-400 text-stone-950 border-blue-400' : 'bg-stone-800 text-stone-400 border-stone-700'}" data-pref="${pref}">
                                ${pref}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Notifications -->
                <div class="p-3 bg-stone-950/60 border border-stone-800 rounded-2xl">
                    <label class="flex items-center justify-between cursor-pointer">
                        <span class="text-[10px] font-bold text-stone-100">🔔 Notifications</span>
                        <input type="checkbox" id="notificationsToggle" ${guestPreferences.notifications ? 'checked' : ''} onchange="toggleNotifications()" class="w-4 h-4">
                    </label>
                </div>
                
                <button onclick="saveProfile()" class="w-full bg-[#DCA773] hover:bg-[#ebd0b3] text-stone-950 font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition">
                    Save Preferences
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) modal.remove();
}

function toggleDietary(diet) {
    const index = guestPreferences.dietary.indexOf(diet);
    if (index > -1) {
        guestPreferences.dietary.splice(index, 1);
    } else {
        guestPreferences.dietary.push(diet);
    }
    
    const btn = document.querySelector(`[data-diet="${diet}"]`);
    if (btn) {
        if (index > -1) {
            btn.className = 'pref-btn px-3 py-1.5 rounded-full text-[9px] font-bold transition border bg-stone-800 text-stone-400 border-stone-700';
        } else {
            btn.className = 'pref-btn px-3 py-1.5 rounded-full text-[9px] font-bold transition border bg-amber-400 text-stone-950 border-amber-400';
        }
    }
}

function toggleAllergy(allergy) {
    const index = guestPreferences.allergies.indexOf(allergy);
    if (index > -1) {
        guestPreferences.allergies.splice(index, 1);
    } else {
        guestPreferences.allergies.push(allergy);
    }
    
    const btn = document.querySelector(`[data-allergy="${allergy}"]`);
    if (btn) {
        if (index > -1) {
            btn.className = 'pref-btn px-3 py-1.5 rounded-full text-[9px] font-bold transition border bg-stone-800 text-stone-400 border-stone-700';
        } else {
            btn.className = 'pref-btn px-3 py-1.5 rounded-full text-[9px] font-bold transition border bg-red-400 text-stone-950 border-red-400';
        }
    }
}

function toggleRoomPref(pref) {
    const index = guestPreferences.room_preferences.indexOf(pref);
    if (index > -1) {
        guestPreferences.room_preferences.splice(index, 1);
    } else {
        guestPreferences.room_preferences.push(pref);
    }
    
    const btn = document.querySelector(`[data-pref="${pref}"]`);
    if (btn) {
        if (index > -1) {
            btn.className = 'pref-btn px-3 py-1.5 rounded-full text-[9px] font-bold transition border bg-stone-800 text-stone-400 border-stone-700';
        } else {
            btn.className = 'pref-btn px-3 py-1.5 rounded-full text-[9px] font-bold transition border bg-blue-400 text-stone-950 border-blue-400';
        }
    }
}

function toggleNotifications() {
    guestPreferences.notifications = !guestPreferences.notifications;
}

function saveProfile() {
    savePreferences();
    closeProfileModal();
    showToast('✅ Preferences saved!', 'success');
    
    // Envoyer les préférences au staff
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    const requestData = {
        room_number: String(room),
        guest_name: cachedGuestData?.guest_name || 'Guest',
        service_type: 'Profile Update',
        details: `Dietary: ${guestPreferences.dietary.join(', ') || 'None'}\nAllergies: ${guestPreferences.allergies.join(', ') || 'None'}\nRoom Preferences: ${guestPreferences.room_preferences.join(', ') || 'None'}`,
        status: 'Pending',
        created_at: new Date().toISOString()
    };
    
    if (supabaseClient) {
        supabaseClient.from('guest_requests').insert([requestData]).then(({ error }) => {
            if (error) console.warn('Error sending preferences:', error);
        });
    }
}
