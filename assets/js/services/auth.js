// ==================== AUTHENTICATION SERVICE ====================
async function verifierIdentiteClient() {
    const roomNum = document.getElementById('lockRoomInput').value.trim();
    const nameInput = document.getElementById('lockNameInput').value.trim();
    const errorMsg = document.getElementById('lockErrorMsg');
    const loadingIndicator = document.getElementById('lockLoadingIndicator');
    errorMsg.classList.add('hidden');
    
    if (!roomNum) { 
        errorMsg.innerText = '⚠️ ' + TRANSLATIONS[currentLanguage].roomNumber; 
        errorMsg.classList.remove('hidden'); 
        return; 
    }
    if (!nameInput || nameInput.length < 2) { 
        errorMsg.innerText = '⚠️ ' + TRANSLATIONS[currentLanguage].yourName; 
        errorMsg.classList.remove('hidden'); 
        return; 
    }
    
    loadingIndicator.classList.remove('hidden');
    try {
        if (!pmsSupabaseClient) {
            throw new Error("PMS Client uninitialized");
        }
        const { data: pmsData, error: pmsError } = await pmsSupabaseClient
            .from('pms_guests')
            .select('*')
            .ilike('room', `%${roomNum}%`)
            .maybeSingle();

        if (pmsError || !pmsData) { 
            errorMsg.innerText = '❌ ' + TRANSLATIONS[currentLanguage].notFound; 
            errorMsg.classList.remove('hidden'); 
            return; 
        }

        const cleanInputName = nameInput.toLowerCase().replace(SALUTATIONS_REGEX, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "").trim();
        const cleanPmsName = (pmsData.guest_name || '').toLowerCase().replace(SALUTATIONS_REGEX, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        const pmsWords = cleanPmsName.split(/[\s\-_,/]+/).map(w => w.replace(/[^a-z0-9]/g, "")).filter(w => w.length > 1);
        
        const isMatch = pmsWords.some(word => { 
            if (cleanInputName.length <= 3) return word === cleanInputName; 
            return word === cleanInputName || word.includes(cleanInputName) || cleanInputName.includes(word); 
        });

        if (!isMatch) { 
            errorMsg.innerText = '❌ ' + TRANSLATIONS[currentLanguage].notFound; 
            errorMsg.classList.remove('hidden'); 
            return; 
        }

        cachedGuestData = pmsData;
        isGuestVerified = true;
        localStorage.setItem('remal_guest_room', pmsData.room);
        localStorage.setItem('remal_guest_data', JSON.stringify(pmsData));
        
        afficherPagePersonnalisee(pmsData, pmsData.room);
        
        const lockScreen = document.getElementById('lockScreen');
        const mainScreen = document.getElementById('mainScreen');
        lockScreen.classList.add('screen-exit');
        setTimeout(() => { 
            lockScreen.classList.add('hidden'); 
            mainScreen.classList.remove('hidden'); 
            mainScreen.classList.add('screen-enter'); 
            verifierEtRestaurerCommandeEnCours();
            fetchServiceRequestsTracking();
        }, 400);

    } catch (error) { 
        console.error('Erreur vérification:', error);
        errorMsg.innerText = '❌ ' + TRANSLATIONS[currentLanguage].notFound; 
        errorMsg.classList.remove('hidden'); 
    } finally { 
        loadingIndicator.classList.add('hidden'); 
    }
}

function afficherPagePersonnalisee(pmsData, roomNum) {
    updateGreeting();
    const welcomeEl = document.getElementById('welcomeGuestName');
    const roomEl = document.getElementById('displayRoomNumber');
    const roomTypeEl = document.getElementById('displayRoomType');
    const departureEl = document.getElementById('displayDeparture');
    
    if (welcomeEl) welcomeEl.innerText = pmsData.guest_name || 'Guest';
    if (roomEl) roomEl.innerText = roomNum;
    if (roomTypeEl) roomTypeEl.innerText = pmsData.room_typ || 'Standard';
    if (departureEl) departureEl.innerText = pmsData.departure || '---';
}

function changerDeChambre() {
    isGuestVerified = false;
    cachedGuestData = null;
    currentOrderId = null;
    
    if (typeof stopOrderNotifications === 'function') {
        stopOrderNotifications();
    }
    
    if (trackingTimeout) clearTimeout(trackingTimeout);
    if (serviceRequestsTimeout) clearTimeout(serviceRequestsTimeout);
    if (guestChatManager) {
        guestChatManager.destroy();
        guestChatManager = null;
    }
    
    localStorage.removeItem('remal_guest_room');
    localStorage.removeItem('remal_guest_data');
    localStorage.removeItem('remal_current_order_id');
    
    document.getElementById('lockRoomInput').value = '';
    document.getElementById('lockNameInput').value = '';
    menuCart = {};
    window.activeServiceRequests = [];
    
    const lockScreen = document.getElementById('lockScreen');
    const mainScreen = document.getElementById('mainScreen');
    
    mainScreen.classList.add('hidden');
    mainScreen.classList.remove('screen-enter');
    lockScreen.classList.remove('hidden');
    lockScreen.classList.remove('screen-exit');
    lockScreen.classList.add('screen-enter');
}

function restaurerSession() {
    console.log('🔄 Tentative de restauration de session...');
    
    const savedRoom = localStorage.getItem('remal_guest_room');
    const savedData = localStorage.getItem('remal_guest_data');
    
    console.log('📦 Données trouvées:', { savedRoom, savedData: savedData ? 'OUI' : 'NON' });
    
    if (savedRoom && savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            cachedGuestData = parsedData;
            isGuestVerified = true;
            
            const lockScreen = document.getElementById('lockScreen');
            const mainScreen = document.getElementById('mainScreen');
            
            if (lockScreen && mainScreen) {
                lockScreen.classList.add('hidden');
                lockScreen.classList.remove('screen-exit');
                mainScreen.classList.remove('hidden');
                mainScreen.classList.remove('screen-enter');
                
                afficherPagePersonnalisee(parsedData, savedRoom);
                
                setTimeout(() => {
                    verifierEtRestaurerCommandeEnCours();
                    fetchServiceRequestsTracking();
                }, 300);
                
                console.log('✅ Session restaurée avec succès');
            } else {
                console.error('❌ Éléments DOM non trouvés');
            }
            
        } catch (e) {
            console.error('❌ Erreur restauration:', e);
            localStorage.removeItem('remal_guest_room');
            localStorage.removeItem('remal_guest_data');
        }
    } else {
        console.log('ℹ️ Aucune session à restaurer');
    }
}
