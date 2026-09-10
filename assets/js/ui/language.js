// ==================== LANGUAGE UI ====================
// Greeting + FAQ + mises à jour UI
// Ne redéfinit PAS setLanguage (déjà fait dans translations.js)

(function () {
    'use strict';

    // ==================== GARDE-FOU ====================
    if (typeof window.t !== 'function') {
        console.warn('⚠️ language.js: translations.js doit être chargé avant.');
        return;
    }

    // ==================== SALUTATION ====================
    function getGreetingByHour() {
        const hour = new Date().getHours();
        if (hour < 12) return 'goodMorning';
        if (hour < 18) return 'goodAfternoon';
        return 'goodEvening';
    }

    const GREETING_EMOJIS = {
        goodMorning: '☀️',
        goodAfternoon: '🌤️',
        goodEvening: '🌙'
    };

    function updateGreeting() {
        const period = getGreetingByHour();
        const emoji = GREETING_EMOJIS[period];
        const greetingText = window.t(period);

        // greetingText (page verrouillage)
        const greetingTextEl = document.getElementById('greetingText');
        if (greetingTextEl) {
            const welcomeTitle = window.t('welcomeTitle');
            greetingTextEl.textContent = `${emoji} ${greetingText} — ${welcomeTitle}`;
        }

        // greetingTime (page principale)
        const greetingTimeEl = document.getElementById('greetingTime');
        if (greetingTimeEl) {
            greetingTimeEl.textContent = `${emoji} ${greetingText}`;
        }
    }

    // ==================== FAQ ====================
    function renderFaqList() {
        const container = document.getElementById('faqContainer');
        if (!container) return;

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

    // ==================== SYNCHRONISATION ====================
    // Écouter les changements de langue pour mettre à jour greeting + FAQ
    window.addEventListener('languageChanged', () => {
        updateGreeting();
        renderFaqList();
    });

    // ==================== INITIALISATION ====================
    function init() {
        updateGreeting();
        // Rafraîchir la salutation toutes les heures
        setInterval(updateGreeting, 60 * 60 * 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }

    // ==================== API PUBLIQUE ====================
    window.updateGreeting = updateGreeting;
    window.renderFaqList = renderFaqList;
    window.escapeHtml = escapeHtml;

    console.log('✅ Language UI chargé');

})();
