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
        errorMsg.innerText = '❌ ' + TRANSLATIONS[currentLanguage].notFound; 
        errorMsg.classList.remove('hidden'); 
    } finally { 
        loadingIndicator.classList.add('hidden'); 
    }
}

function afficherPagePersonnalisee(pmsData, roomNum) {
    updateGreeting();
    document.getElementById('welcomeGuestName').innerText = pmsData.guest_name || 'Guest';
    document.getElementById('displayRoomNumber').innerText = roomNum;
    document.getElementById('displayRoomType').innerText = pmsData.room_typ || 'Standard';
    document.getElementById('displayDeparture').innerText = pmsData.departure || '---';
}

function changerDeChambre() {
    isGuestVerified = false;
    cachedGuestData = null;
    currentOrderId = null;
    
    // Arrêter les notifications
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
    const savedRoom = localStorage.getItem('remal_guest_room');
    const savedData = localStorage.getItem('remal_guest_data');
    
    if (savedRoom && savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            cachedGuestData = parsedData;
            isGuestVerified = true;
            
            // Afficher directement le mainScreen sans animation
            document.getElementById('lockScreen').classList.add('hidden');
            document.getElementById('mainScreen').classList.remove('hidden');
            
            afficherPagePersonnalisee(parsedData, savedRoom);
            
            // Restaurer la commande en cours et les demandes
            setTimeout(() => {
                verifierEtRestaurerCommandeEnCours();
                fetchServiceRequestsTracking();
            }, 500);
            
        } catch (e) {
            console.warn('Erreur lors de la restauration de session:', e);
            localStorage.removeItem('remal_guest_room');
            localStorage.removeItem('remal_guest_data');
        }
    } else {
        // S'assurer que l'écran de verrouillage est visible
        document.getElementById('lockScreen').classList.remove('hidden');
        document.getElementById('mainScreen').classList.add('hidden');
    }
}
