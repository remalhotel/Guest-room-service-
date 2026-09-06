// ==================== LANGUAGE FUNCTIONS ====================
const LANGUAGE_NAMES = {
    en: { name: 'English', flag: '🇬🇧', native: 'English', dir: 'ltr' },
    fr: { name: 'French', flag: '🇫🇷', native: 'Français', dir: 'ltr' },
    ar: { name: 'Arabic', flag: '🇸🇦', native: 'العربية', dir: 'rtl' },
    hi: { name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी', dir: 'ltr' }
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
    
    // Appliquer la direction RTL si nécessaire
    applyRTLSupport(lang);
    
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
}

function applyRTLSupport(lang) {
    const langInfo = LANGUAGE_NAMES[lang] || LANGUAGE_NAMES.en;
    const dir = langInfo.dir;
    
    // Appliquer au HTML root
    document.getElementById('htmlRoot').setAttribute('dir', dir);
    document.getElementById('htmlRoot').setAttribute('lang', lang);
    
    // Ajuster les éléments qui doivent changer en RTL
    const rtlAdjustments = {
        'text-left': dir === 'rtl' ? 'text-right' : 'text-left',
        'text-right': dir === 'rtl' ? 'text-left' : 'text-right',
        'ml-auto': dir === 'rtl' ? 'mr-auto' : 'ml-auto',
        'mr-auto': dir === 'rtl' ? 'ml-auto' : 'mr-auto'
    };
    
    // Ajuster les éléments flottants
    const floatingElements = document.querySelectorAll('.fixed');
    floatingElements.forEach(el => {
        if (dir === 'rtl') {
            if (el.classList.contains('left-4')) {
                el.classList.remove('left-4');
                el.classList.add('right-4');
            }
            if (el.classList.contains('right-4')) {
                el.classList.remove('right-4');
                el.classList.add('left-4');
            }
        }
    });
    
    // Ajuster les marges
    const marginElements = document.querySelectorAll('[class*="ml-"], [class*="mr-"]');
    marginElements.forEach(el => {
        if (dir === 'rtl') {
            el.classList.forEach(cls => {
                if (cls.startsWith('ml-')) {
                    el.classList.remove(cls);
                    el.classList.add(cls.replace('ml-', 'mr-'));
                } else if (cls.startsWith('mr-')) {
                    el.classList.remove(cls);
                    el.classList.add(cls.replace('mr-', 'ml-'));
                }
            });
        }
    });
    
    // Ajuster les textes alignés
    const textElements = document.querySelectorAll('.text-left, .text-right');
    textElements.forEach(el => {
        if (dir === 'rtl') {
            if (el.classList.contains('text-left')) {
                el.classList.remove('text-left');
                el.classList.add('text-right');
            } else if (el.classList.contains('text-right')) {
                el.classList.remove('text-right');
                el.classList.add('text-left');
            }
        }
    });
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
        
        // Ajuster la direction du champ de saisie
        const langInfo = LANGUAGE_NAMES[currentLanguage] || LANGUAGE_NAMES.en;
        chatInput.setAttribute('dir', langInfo.dir);
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
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    const profileKey = `remal_preferences_${room}`;
    
    try {
        const profile = JSON.parse(localStorage.getItem(profileKey) || 'null');
        if (profile && profile.language) {
            preferredLanguage = profile.language;
            return profile.language;
        }
    } catch (e) {}
    
    const savedLanguage = localStorage.getItem('remal_language');
    if (savedLanguage) {
        return savedLanguage;
    }
    
    const browserLang = navigator.language || navigator.userLanguage;
    const browserCode = browserLang.split('-')[0].toLowerCase();
    
    if (browserCode === 'fr') return 'fr';
    if (browserCode === 'ar') return 'ar';
    if (browserCode === 'hi') return 'hi';
    
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
