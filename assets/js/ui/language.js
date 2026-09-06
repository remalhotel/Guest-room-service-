// ==================== LANGUAGE FUNCTIONS ====================
const LANGUAGE_NAMES = {
    en: { name: 'English', flag: '🇬🇧', native: 'English' },
    fr: { name: 'French', flag: '🇫🇷', native: 'Français' },
    ar: { name: 'Arabic', flag: '🇸🇦', native: 'العربية' },
    hi: { name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' }
};

let preferredLanguage = null;

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('remal_language', lang);
    
    // Mettre à jour tous les éléments avec data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
            el.innerText = TRANSLATIONS[lang][key];
        } else if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
            el.innerText = TRANSLATIONS.en[key];
        }
    });
    
    // Mettre à jour les placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
            el.placeholder = TRANSLATIONS[lang][key];
        } else if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
            el.placeholder = TRANSLATIONS.en[key];
        }
    });
    
    document.getElementById('htmlRoot').setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.getElementById('htmlRoot').setAttribute('lang', lang);
    
    ['en', 'fr', 'ar', 'hi'].forEach(l => {
        const btn = document.getElementById(`lang${l.charAt(0).toUpperCase() + l.slice(1)}`);
        const btnMain = document.getElementById(`lang${l.charAt(0).toUpperCase() + l.slice(1)}Main`);
        if (btn) {
            if (l === lang) btn.classList.add('active'); else btn.classList.remove('active');
        }
        if (btnMain) {
            if (l === lang) btnMain.classList.add('active'); else btnMain.classList.remove('active');
        }
    });
    
    renderFaqList();
    updateGreeting();
    renderServiceRequestsTracking();
    updateChatLanguage();
    renderLanguageSelector();
}

function updateGreeting() {
    const greeting = getGreeting();
    const greetings = {
        en: { text: greeting.text, emoji: greeting.emoji },
        fr: { text: greeting.text === 'Good Morning' ? 'Bonjour' : greeting.text === 'Good Afternoon' ? 'Bon après-midi' : 'Bonsoir', emoji: greeting.emoji },
        ar: { text: greeting.text === 'Good Morning' ? 'صباح الخير' : greeting.text === 'Good Afternoon' ? 'مساء الخير' : 'مساء الخير', emoji: greeting.emoji },
        hi: { text: greeting.text === 'Good Morning' ? 'सुप्रभात' : greeting.text === 'Good Afternoon' ? 'नमस्कार' : 'शुभ संध्या', emoji: greeting.emoji }
    };
    
    const g = greetings[currentLanguage] || greetings.en;
    const greetingTextEl = document.getElementById('greetingText');
    if (greetingTextEl) {
        greetingTextEl.innerText = `${g.emoji} ${g.text} - ${TRANSLATIONS[currentLanguage]?.welcomeTitle || TRANSLATIONS.en.welcomeTitle}`;
    }
    
    const greetingTimeEl = document.getElementById('greetingTime');
    if (greetingTimeEl) {
        greetingTimeEl.innerText = `${g.emoji} ${g.text}`;
    }
}

function renderFaqList() {
    const container = document.getElementById('faqContainer');
    if (!container) return;
    const faqs = FAQ_DATA[currentLanguage] || FAQ_DATA.en;
    
    container.innerHTML = faqs.map(faq => `
        <div class="p-3.5 bg-stone-950/60 border border-amber-500/20 rounded-2xl">
            <p class="text-[11px] font-bold text-[var(--text-gold,#DCA773)]">❓ ${faq.q}</p>
            <p class="text-[10px] text-stone-400 mt-1">${faq.a}</p>
        </div>
    `).join('');
}

function updateChatLanguage() {
    const chatInput = document.getElementById('guestChatInput');
    if (chatInput) {
        const placeholders = {
            en: 'Write a message...',
            fr: 'Écrivez un message...',
            ar: 'اكتب رسالة...',
            hi: 'संदेश लिखें...'
        };
        chatInput.placeholder = placeholders[currentLanguage] || placeholders.en;
    }
    
    const sendBtn = document.getElementById('chatSendButton');
    if (sendBtn) {
        const sendTexts = {
            en: 'Send',
            fr: 'Envoyer',
            ar: 'إرسال',
            hi: 'भेजें'
        };
        sendBtn.innerText = sendTexts[currentLanguage] || sendTexts.en;
    }
    
    const staffStatus = document.getElementById('staffPresenceStatus');
    if (staffStatus) {
        const staffOnline = staffStatus.innerHTML.includes('emerald');
        const statusTexts = {
            en: staffOnline ? '● Staff online' : '● Staff offline',
            fr: staffOnline ? '● Staff en ligne' : '● Staff hors ligne',
            ar: staffOnline ? '● الموظف متصل' : '● الموظف غير متصل',
            hi: staffOnline ? '● स्टाफ ऑनलाइन' : '● स्टाफ ऑफलाइन'
        };
        staffStatus.innerHTML = `<span class="${staffOnline ? 'text-emerald-400' : 'text-gray-400'} text-[10px]">${statusTexts[currentLanguage] || statusTexts.en}</span>`;
    }
    
    const typingIndicator = document.getElementById('chatTypingIndicator');
    if (typingIndicator && !typingIndicator.classList.contains('hidden')) {
        const typingTexts = {
            en: 'Staff is typing...',
            fr: 'Le staff est en train d\'écrire...',
            ar: 'الموظف يكتب...',
            hi: 'स्टाफ टाइप कर रहा है...'
        };
        typingIndicator.textContent = typingTexts[currentLanguage] || typingTexts.en;
    }
}

// ==================== DÉTECTION AUTOMATIQUE DE LANGUE ====================
function detectPreferredLanguage() {
    // 1. Vérifier si le client a une langue préférée dans son profil
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    const profileKey = `remal_preferences_${room}`;
    
    try {
        const profile = JSON.parse(localStorage.getItem(profileKey) || 'null');
        if (profile && profile.language && profile.language !== currentLanguage) {
            preferredLanguage = profile.language;
            return profile.language;
        }
    } catch (e) {}
    
    // 2. Vérifier la langue sauvegardée
    const savedLanguage = localStorage.getItem('remal_language');
    if (savedLanguage) {
        return savedLanguage;
    }
    
    // 3. Détecter depuis le navigateur
    const browserLang = navigator.language || navigator.userLanguage;
    const browserCode = browserLang.split('-')[0].toLowerCase();
    
    if (browserCode === 'fr') return 'fr';
    if (browserCode === 'ar') return 'ar';
    if (browserCode === 'hi') return 'hi';
    
    // 4. Défaut : anglais
    return 'en';
}

function applyPreferredLanguage() {
    const lang = detectPreferredLanguage();
    setLanguage(lang);
    showLanguageToast(lang);
}

function showLanguageToast(lang) {
    const langInfo = LANGUAGE_NAMES[lang] || LANGUAGE_NAMES.en;
    showToast(`${langInfo.flag} ${langInfo.name} selected`, 'info');
}

// ==================== SÉLECTEUR DE LANGUE AMÉLIORÉ ====================
function renderLanguageSelector() {
    const container = document.getElementById('languageSelectorContainer');
    if (!container) return;
    
    const currentLangInfo = LANGUAGE_NAMES[currentLanguage] || LANGUAGE_NAMES.en;
    
    container.innerHTML = `
        <button onclick="toggleLanguageDropdown()" class="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-2 rounded-xl text-[10px] font-bold transition">
            <span class="text-lg">${currentLangInfo.flag}</span>
            <span>${currentLangInfo.native}</span>
            <i class="fas fa-chevron-down text-[8px] text-stone-400"></i>
        </button>
        <div id="languageDropdown" class="hidden absolute top-full right-0 mt-1 bg-stone-800 border border-stone-700 rounded-xl shadow-2xl overflow-hidden z-50">
            ${Object.entries(LANGUAGE_NAMES).map(([code, info]) => `
                <button onclick="selectLanguage('${code}')" class="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-stone-700 text-stone-200 text-[10px] font-bold transition ${code === currentLanguage ? 'bg-amber-500/20 text-amber-400' : ''}">
                    <span class="text-lg">${info.flag}</span>
                    <span>${info.native}</span>
                    ${code === currentLanguage ? '<i class="fas fa-check ml-auto text-amber-400 text-xs"></i>' : ''}
                </button>
            `).join('')}
        </div>
    `;
}

function toggleLanguageDropdown() {
    const dropdown = document.getElementById('languageDropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

function selectLanguage(lang) {
    setLanguage(lang);
    closeLanguageDropdown();
}

function closeLanguageDropdown() {
    const dropdown = document.getElementById('languageDropdown');
    if (dropdown) {
        dropdown.classList.add('hidden');
    }
}

function showLanguageSettings() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 z-[850] flex items-center justify-center p-4 backdrop-blur-sm';
    modal.id = 'languageSettingsModal';
    
    modal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-xs rounded-3xl p-6 space-y-4 shadow-2xl">
            <div class="flex justify-between items-center border-b border-stone-800 pb-3">
                <h3 class="text-xs font-serif-luxury font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-widest">
                    🌐 Language
                </h3>
                <button onclick="closeLanguageSettings()" class="text-stone-400 hover:text-stone-100 text-xl font-bold">✕</button>
            </div>
            
            <div class="space-y-2">
                ${Object.entries(LANGUAGE_NAMES).map(([code, info]) => `
                    <button onclick="selectLanguage('${code}'); closeLanguageSettings();" class="w-full flex items-center gap-3 p-3 rounded-xl border transition ${code === currentLanguage ? 'bg-amber-500/20 border-amber-500/30' : 'bg-stone-950/60 border-stone-800 hover:border-stone-600'}">
                        <span class="text-2xl">${info.flag}</span>
                        <div class="text-left">
                            <p class="font-bold text-stone-100 text-xs">${info.native}</p>
                            <p class="text-[8px] text-stone-400">${info.name}</p>
                        </div>
                        ${code === currentLanguage ? '<i class="fas fa-check ml-auto text-amber-400"></i>' : ''}
                    </button>
                `).join('')}
            </div>
            
            <div class="bg-stone-950/60 border border-stone-800 rounded-xl p-3">
                <p class="text-[9px] text-stone-400">Language is automatically detected from your profile or browser. You can change it manually anytime.</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeLanguageSettings() {
    const modal = document.getElementById('languageSettingsModal');
    if (modal) modal.remove();
}
