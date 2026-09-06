// ==================== CHAT UI FUNCTIONS ====================
const QUICK_REPLIES = [
    { icon: '🧹', text: 'Please clean my room', type: 'housekeeping' },
    { icon: '🧴', text: 'Need more toiletries', type: 'amenities' },
    { icon: '🍽️', text: 'Restaurant recommendations', type: 'dining' },
    { icon: '🚕', text: 'Book a taxi', type: 'transport' },
    { icon: '🧊', text: 'Need ice bucket', type: 'amenities' },
    { icon: '💧', text: 'Need extra water bottles', type: 'amenities' },
    { icon: '🔑', text: 'Lost my room key', type: 'help' },
    { icon: '📶', text: 'Wi-Fi not working', type: 'technical' },
    { icon: '🅿️', text: 'Parking information', type: 'info' },
    { icon: '⏰', text: 'Wake-up call request', type: 'service' },
    { icon: '🧳', text: 'Luggage storage', type: 'service' },
    { icon: '🏊', text: 'Pool hours', type: 'info' }
];

let selectedImageFile = null;

function openGuestChatModal() {
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    const guestName = cachedGuestData?.guest_name || 'Guest';
    
    if (!room) {
        const noRoomTexts = {
            en: 'Please verify your room first',
            fr: 'Veuillez d\'abord vérifier votre chambre',
            ar: 'يرجى التحقق من غرفتك أولاً',
            hi: 'कृपया पहले अपना कमरा सत्यापित करें'
        };
        const lang = typeof currentLanguage !== 'undefined' ? currentLanguage : 'en';
        showToast(noRoomTexts[lang] || noRoomTexts.en, 'error');
        return;
    }
    
    document.getElementById('guestChatModal').classList.remove('hidden');
    
    if (!guestChatManager) {
        guestChatManager = new GuestChatManager(supabaseClient, room, guestName);
        guestChatManager.init();
    } else {
        guestChatManager.render();
    }
    
    renderQuickReplies();
    updateChatLanguage();
    
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function closeGuestChatModal() {
    document.getElementById('guestChatModal').classList.add('hidden');
}

function toggleChatSound() {
    if (guestChatManager) {
        guestChatManager.soundEnabled = !guestChatManager.soundEnabled;
        localStorage.setItem('remal_chat_sound', guestChatManager.soundEnabled ? 'on' : 'off');
        const soundToggle = document.getElementById('chatSoundToggle');
        if (soundToggle) {
            soundToggle.textContent = guestChatManager.soundEnabled ? '🔊' : '🔇';
        }
    }
}

async function sendGuestChatMessage() {
    const input = document.getElementById('guestChatInput');
    const message = input.value.trim();
    
    if (!message && !selectedImageFile) return;
    if (!guestChatManager) return;
    
    if (selectedImageFile) {
        await sendImageMessage(selectedImageFile);
        selectedImageFile = null;
        clearImagePreview();
    }
    
    if (message) {
        const sent = await guestChatManager.sendMessage(message);
        if (sent) {
            input.value = '';
            input.focus();
            hideQuickReplies();
        }
    }
}

async function sendQuickReply(text) {
    if (!guestChatManager) return;
    
    const sent = await guestChatManager.sendMessage(text);
    if (sent) {
        hideQuickReplies();
        showToast('Message sent ✅', 'success');
    }
}

function renderQuickReplies() {
    const container = document.getElementById('quickRepliesContainer');
    if (!container) return;
    
    container.classList.remove('hidden');
    
    container.innerHTML = `
        <div class="border-t border-stone-800 pt-2">
            <p class="text-[8px] text-stone-500 uppercase font-bold mb-1.5">Quick Replies</p>
            <div class="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                ${QUICK_REPLIES.map(qr => `
                    <button onclick="sendQuickReply('${qr.text.replace(/'/g, "\\'")}')" class="flex-shrink-0 bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1.5 rounded-full text-[9px] font-bold transition whitespace-nowrap">
                        ${qr.icon} ${qr.text}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function hideQuickReplies() {
    const container = document.getElementById('quickRepliesContainer');
    if (container) {
        container.classList.add('hidden');
        container.innerHTML = '';
    }
}

// ==================== PIÈCES JOINTES (PHOTOS COMPRESSÉES) ====================
function triggerImageUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                showToast('Image too large (max 10MB)', 'error');
                return;
            }
            
            // Compresser l'image avant de l'envoyer
            compressImage(file, (compressedFile) => {
                if (compressedFile.size > 500 * 1024) {
                    showToast('Image still too large after compression', 'error');
                    return;
                }
                selectedImageFile = compressedFile;
                showImagePreview(compressedFile);
            });
        }
    };
    input.click();
}

function compressImage(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // Redimensionner si trop grand (max 800px)
            const maxDimension = 800;
            if (width > maxDimension || height > maxDimension) {
                if (width > height) {
                    height = Math.round((height * maxDimension) / width);
                    width = maxDimension;
                } else {
                    width = Math.round((width * maxDimension) / height);
                    height = maxDimension;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Compresser en JPEG avec qualité 0.7
            canvas.toBlob((blob) => {
                const compressedFile = new File([blob], file.name.replace(/\.(png|jpg|jpeg|gif)$/i, '.jpg'), {
                    type: 'image/jpeg'
                });
                callback(compressedFile);
            }, 'image/jpeg', 0.7);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function showImagePreview(file) {
    const container = document.getElementById('imagePreviewContainer');
    if (!container) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        container.classList.remove('hidden');
        container.innerHTML = `
            <div class="relative inline-block">
                <img src="${e.target.result}" class="w-20 h-20 object-cover rounded-xl border border-amber-500/30">
                <button onclick="clearImagePreview()" class="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] font-bold">✕</button>
            </div>
        `;
    };
    reader.readAsDataURL(file);
}

function clearImagePreview() {
    const container = document.getElementById('imagePreviewContainer');
    if (container) {
        container.classList.add('hidden');
        container.innerHTML = '';
    }
    selectedImageFile = null;
}

async function sendImageMessage(file) {
    if (!file || !guestChatManager || !supabaseClient) return;
    
    showToast('Uploading image...', 'info');
    
    try {
        const fileName = `chat_${Date.now()}.jpg`;
        const filePath = `chat-images/${fileName}`;
        
        // Upload vers Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseClient
            .storage
            .from('chat-images')
            .upload(filePath, file, {
                contentType: 'image/jpeg',
                cacheControl: '3600'
            });
            
        if (uploadError) {
            console.error('Upload error:', uploadError);
            showToast('Error uploading image', 'error');
            return;
        }
        
        // Obtenir l'URL publique
        const { data: publicUrl } = supabaseClient
            .storage
            .from('chat-images')
            .getPublicUrl(filePath);
            
        // Envoyer le message avec l'image
        const message = {
            room_number: guestChatManager.roomNumber,
            sender: 'guest',
            guest_name: guestChatManager.guestName,
            message: '📷 [Image]',
            image_url: publicUrl.publicUrl,
            is_read: false,
            created_at: new Date().toISOString()
        };
        
        const { error: msgError } = await supabaseClient
            .from('chat_messages')
            .insert([message]);
            
        if (msgError) {
            console.error('Message error:', msgError);
            showToast('Error sending image', 'error');
            return;
        }
        
        showToast('Image sent ✅', 'success');
        
    } catch (err) {
        console.error('Error:', err);
        showToast('Error sending image', 'error');
    }
}
