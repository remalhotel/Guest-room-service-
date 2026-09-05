// ==================== LANGUAGE FUNCTIONS ====================
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('remal_language', lang);
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
            el.innerText = TRANSLATIONS[lang][key];
        }
    });
    
    document.getElementById('htmlRoot').setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
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
        greetingTextEl.innerText = `${g.emoji} ${g.text} - ${TRANSLATIONS[currentLanguage].welcomeTitle}`;
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
