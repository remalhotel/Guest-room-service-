// ==================== LANGUAGE FUNCTIONS (UI) ====================
// Module UI qui DÉLÈGUE au système principal (translations.js)
// Ne redéfinit PAS setLanguage — l'enrichit proprement

(function () {
    'use strict';

    // ==================== GARDE-FOU ====================
    if (typeof window.t !== 'function' || !window.TRANSLATIONS) {
        console.error('❌ language.js: translations.js doit être chargé AVANT. Module ignoré.');
        return;
    }

    // ==================== CONSTANTES ====================
    const SUPPORTED_LANGS = ['en', 'fr', 'ar', 'hi'];
    const RTL_LANGS = ['ar'];

    // ==================== ACCÈS SÉCURISÉ AU STORAGE ====================
    const safeStorage = {
        get(key) {
            try { return localStorage.getItem(key); }
            catch (e) { return null; }
        },
        set(key, value) {
            try { localStorage.setItem(key, value); return true; }
            catch (e) { return false; }
        }
    };

    // ==================== SYNCHRONISATION DES CLÉS DE STOCKAGE ====================
    // Fusionner 'remal_language' (ancien) et 'remal_lang' (nouveau)
    function syncStorageKeys() {
        const oldKey = safeStorage.get('remal_language');
        const newKey = safeStorage.get('remal_lang');

        // Si l'ancien existe mais pas le nouveau → migrer
        if (oldKey && !newKey && SUPPORTED_LANGS.includes(oldKey)) {
            safeStorage.set('remal_lang', oldKey);
        }
        // Si le nouveau existe mais pas l'ancien → rétro-compatibilité
        else if (newKey && !oldKey && SUPPORTED_LANGS.includes(newKey)) {
            safeStorage.set('remal_language', newKey);
        }
    }

    // ==================== MISE À JOUR DES BOUTONS DE LANGUE ====================
    function updateLanguageButtons(lang) {
        SUPPORTED_LANGS.forEach(l => {
            const capitalized = l.charAt(0).toUpperCase() + l.slice(1);
            const btn = document.getElementById(`lang${capitalized}`);
            const btnMain = document.getElementById(`lang${capitalized}Main`);

            [btn, btnMain].forEach(el => {
                if (!el) return;
                if (l === lang) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            });
        });
    }

    // ==================== RTL ====================
    function applyDirection(lang) {
        const isRTL = RTL_LANGS.includes(lang);
        const htmlEl = document.getElementById('htmlRoot') || document.documentElement;

        htmlEl.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        htmlEl.setAttribute('lang', lang);

        if (document.body) {
            document.body.classList.toggle('rtl-mode', isRTL);
            document.body.classList.toggle('ltr-mode', !isRTL);
        }
    }

    // ==================== AUGMENTATION DE setLanguage ====================
    // On garde la fonction de translations.js et on l'enrichit
    const baseSetLanguage = window.setLanguage;

    function enhancedSetLanguage(lang) {
        // 1. Valider
        if (!SUPPORTED_LANGS.includes(lang)) {
            console.warn('⚠️ Langue non supportée:', lang, '→ fallback EN');
            lang = 'en';
        }

        // 2. Appeler la fonction de base (gère t(), applyTranslations(), etc.)
        try {
            baseSetLanguage(lang);
        } catch (err) {
            console.error('❌ Erreur baseSetLanguage:', err);
            return;
        }

        // 3. Actions UI supplémentaires
        safeStorage.set('remal_language', lang);
        safeStorage.set('remal_lang', lang);

        applyDirection(lang);
        updateLanguageButtons(lang);

        // 4. Mettre à jour les sections dynamiques
        try {
            if (typeof window.renderFaqList === 'function') window.renderFaqList();
        } catch (e) { console.warn('renderFaqList:', e); }

        try {
            if (typeof window.updateGreeting === 'function') window.updateGreeting();
        } catch (e) { console.warn('updateGreeting:', e); }

        try {
            if (typeof window.renderServiceRequestsTracking === 'function') {
                window.renderServiceRequestsTracking();
            }
        } catch (e) { console.warn('renderServiceRequestsTracking:', e); }

        // 5. Traduire les éléments étendus [data-i18n-extra]
        try {
            if (window.translations && typeof window.translations.translateExtended === 'function') {
                document.querySelectorAll('[data-i18n-extra]').forEach(el => {
                    const key = el.getAttribute('data-i18n-extra');
                    if (key) el.textContent = window.translations.translateExtended(key, lang);
                });
            }
        } catch (e) { /* silencieux */ }

        console.log('🌐 Langue appliquée (UI):', lang);
    }

    // ==================== SALUTATION ====================
    function getGreetingByHour() {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 18) return 'afternoon';
        return 'evening';
    }

    const GREETINGS = {
        en: { morning: 'Good Morning', afternoon: 'Good Afternoon', evening: 'Good Evening' },
        fr: { morning: 'Bonjour', afternoon: 'Bon après-midi', evening: 'Bonsoir' },
        ar: { morning: 'صباح الخير', afternoon: 'مساء الخير', evening: 'مساء الخير' },
        hi: { morning: 'सुप्रभात', afternoon: 'नमस्कार', evening: 'शुभ संध्या' }
    };

    const GREETING_EMOJIS = {
        morning: '☀️',
        afternoon: '🌤️',
        evening: '🌙'
    };

    function updateGreeting() {
        const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'en';
        const period = getGreetingByHour();
        const emoji = GREETING_EMOJIS[period];
        const greetings = GREETINGS[lang] || GREETINGS.en;
        const greetingText = greetings[period];

        // greetingText element (page de verrouillage)
        const greetingTextEl = document.getElementById('greetingText');
        if (greetingTextEl) {
            const welcomeTitle = typeof window.t === 'function'
                ? window.t('welcomeTitle')
                : 'Welcome to Guest Hub';
            greetingTextEl.textContent = `${emoji} ${greetingText} — ${welcomeTitle}`;
        }

        // greetingTime element (page principale)
        const greetingTimeEl = document.getElementById('greetingTime');
        if (greetingTimeEl) {
            greetingTimeEl.textContent = `${emoji} ${greetingText}`;
        }
    }

    // ==================== FAQ ====================
    function renderFaqList() {
        const container = document.getElementById('faqContainer');
        if (!container) return;

        // Récupérer FAQ_DATA depuis le scope global (constants.js)
        const FAQ_DATA = window.FAQ_DATA;
        if (!FAQ_DATA) {
            console.warn('⚠️ FAQ_DATA non chargé');
            return;
        }

        const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'en';
        const faqs = FAQ_DATA[lang] || FAQ_DATA.en || [];

        if (!Array.isArray(faqs) || faqs.length === 0) {
            container.innerHTML = `<p class="text-center text-[10px] text-stone-400">—</p>`;
            return;
        }

        container.innerHTML = faqs.map(faq => `
            <div class="p-3.5 bg-stone-950/60 border border-amber-500/20 rounded-2xl">
                <p class="text-[11px] font-bold text-[var(--text-gold,#DCA773)]">❓ ${escapeHtml(faq.q)}</p>
                <p class="text-[10px] text-stone-400 mt-1">${escapeHtml(faq.a)}</p>
            </div>
        `).join('');
    }

    // ==================== SÉCURITÉ XSS ====================
    function escapeHtml(str) {
        if (typeof str !== 'string') return str;
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // ==================== INITIALISATION ====================
    function init() {
        // Synchroniser les clés de stockage
        syncStorageKeys();

        // Appliquer la langue actuelle aux boutons et à la direction
        const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'en';
        updateLanguageButtons(lang);
        applyDirection(lang);

        // Mettre à jour la salutation au démarrage
        updateGreeting();

        // Rafraîchir la salutation toutes les heures
        setInterval(updateGreeting, 60 * 60 * 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }

    // ==================== ÉCOUTE DES CHANGEMENTS DE LANGUE ====================
    // Synchronisation avec translations.js (si un autre module change la langue)
    window.addEventListener('languageChanged', (e) => {
        const lang = e.detail && e.detail.language;
        if (lang && SUPPORTED_LANGS.includes(lang)) {
            updateLanguageButtons(lang);
            applyDirection(lang);
            updateGreeting();
            renderFaqList();
        }
    });

    // ==================== API PUBLIQUE ====================
    // On REMPLACE setLanguage par la version enrichie
    window.setLanguage = enhancedSetLanguage;
    window.updateGreeting = updateGreeting;
    window.renderFaqList = renderFaqList;
    window.escapeHtml = escapeHtml;

    console.log('✅ Language UI prêt');

})();
