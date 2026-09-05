// ==================== LANGUAGE FUNCTIONS ====================
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('remal_language', lang);
    
    // Mettre à jour tous les éléments avec data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
            el.innerText = TRANSLATIONS[lang][key];
        } else if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
            // Fallback vers l'anglais si la traduction n'existe pas
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
    
    // Mettre à jour les textes du chat si ouvert
    updateChatLanguage();
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
    
    // Mettre à jour le statut du staff
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
    
    // Mettre à jour l'indicateur de frappe
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
