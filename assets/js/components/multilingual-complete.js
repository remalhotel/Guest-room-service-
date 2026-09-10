// ==================== MULTILINGUAL COMPLETE ====================
// Module COMPLÉMENTAIRE au système de traductions principal
// Ne redéfinit PAS window.t — l'étend proprement
// Synchronisé avec translations.js via l'événement 'languageChanged'

(function () {
    'use strict';

    // ==================== GARDE-FOU ====================
    // Vérifier que le module principal est chargé
    if (typeof window.t !== 'function' || !window.TRANSLATIONS) {
        console.warn('⚠️ Multilingual Complete: translations.js doit être chargé en premier. Module ignoré.');
        return;
    }

    console.log('🌍 Multilingual Complete activé');

    // ==================== TRADUCTIONS SUPPLÉMENTAIRES ====================
    // Ces clés sont AJOUTÉES au dictionnaire principal (pas de duplication)
    const ADDITIONAL_TRANSLATIONS = {
        en: {
            // Notifications
            notifOrderReady: 'Your order is ready!',
            notifOrderDelivered: 'Your order has been delivered',
            notifNewOffer: 'New offer available!',
            notifLaundryReady: 'Laundry is ready',
            // Boutons
            btnExportPDF: 'Export PDF',
            btnShareWhatsApp: 'Share via WhatsApp',
            btnCallReception: 'Call Reception',
            btnViewDetails: 'View Details',
            // Messages système
            msgWelcome: 'Welcome to Remal Hotel',
            msgSessionExpired: 'Session expired. Please reconnect.',
            msgOffline: 'You are offline. Showing cached data.',
            msgOnline: 'Back online!',
            // Jours
            dayMonday: 'Monday',
            dayTuesday: 'Tuesday',
            dayWednesday: 'Wednesday',
            dayThursday: 'Thursday',
            dayFriday: 'Friday',
            daySaturday: 'Saturday',
            daySunday: 'Sunday',
            // Mois
            monthJanuary: 'January',
            monthFebruary: 'February',
            monthMarch: 'March',
            monthApril: 'April',
            monthMay: 'May',
            monthJune: 'June',
            monthJuly: 'July',
            monthAugust: 'August',
            monthSeptember: 'September',
            monthOctober: 'October',
            monthNovember: 'November',
            monthDecember: 'December'
        },
        fr: {
            notifOrderReady: 'Votre commande est prête !',
            notifOrderDelivered: 'Votre commande a été livrée',
            notifNewOffer: 'Nouvelle offre disponible !',
            notifLaundryReady: 'Le linge est prêt',
            btnExportPDF: 'Exporter PDF',
            btnShareWhatsApp: 'Partager WhatsApp',
            btnCallReception: 'Appeler la réception',
            btnViewDetails: 'Voir détails',
            msgWelcome: 'Bienvenue au Remal Hotel',
            msgSessionExpired: 'Session expirée. Reconnectez-vous.',
            msgOffline: 'Vous êtes hors ligne. Données en cache.',
            msgOnline: 'De retour en ligne !',
            dayMonday: 'Lundi',
            dayTuesday: 'Mardi',
            dayWednesday: 'Mercredi',
            dayThursday: 'Jeudi',
            dayFriday: 'Vendredi',
            daySaturday: 'Samedi',
            daySunday: 'Dimanche',
            monthJanuary: 'Janvier',
            monthFebruary: 'Février',
            monthMarch: 'Mars',
            monthApril: 'Avril',
            monthMay: 'Mai',
            monthJune: 'Juin',
            monthJuly: 'Juillet',
            monthAugust: 'Août',
            monthSeptember: 'Septembre',
            monthOctober: 'Octobre',
            monthNovember: 'Novembre',
            monthDecember: 'Décembre'
        },
        ar: {
            notifOrderReady: 'طلبك جاهز!',
            notifOrderDelivered: 'تم توصيل طلبك',
            notifNewOffer: 'عرض جديد متاح!',
            notifLaundryReady: 'الغسيل جاهز',
            btnExportPDF: 'تصدير PDF',
            btnShareWhatsApp: 'مشاركة واتساب',
            btnCallReception: 'اتصال بالاستقبال',
            btnViewDetails: 'عرض التفاصيل',
            msgWelcome: 'مرحباً في فندق رمال',
            msgSessionExpired: 'انتهت الجلسة. أعد الاتصال.',
            msgOffline: 'أنت غير متصل. عرض البيانات المخزنة.',
            msgOnline: 'عاد الاتصال!',
            dayMonday: 'الاثنين',
            dayTuesday: 'الثلاثاء',
            dayWednesday: 'الأربعاء',
            dayThursday: 'الخميس',
            dayFriday: 'الجمعة',
            daySaturday: 'السبت',
            daySunday: 'الأحد',
            monthJanuary: 'يناير',
            monthFebruary: 'فبراير',
            monthMarch: 'مارس',
            monthApril: 'أبريل',
            monthMay: 'مايو',
            monthJune: 'يونيو',
            monthJuly: 'يوليو',
            monthAugust: 'أغسطس',
            monthSeptember: 'سبتمبر',
            monthOctober: 'أكتوبر',
            monthNovember: 'نوفمبر',
            monthDecember: 'ديسمبر'
        },
        hi: {
            notifOrderReady: 'आपका ऑर्डर तैयार है!',
            notifOrderDelivered: 'आपका ऑर्डर डिलीवर हो गया',
            notifNewOffer: 'नया ऑफर उपलब्ध!',
            notifLaundryReady: 'लॉन्ड्री तैयार है',
            btnExportPDF: 'PDF निर्यात करें',
            btnShareWhatsApp: 'व्हाट्सएप पर साझा करें',
            btnCallReception: 'रिसेप्शन को कॉल करें',
            btnViewDetails: 'विवरण देखें',
            msgWelcome: 'रेमल होटल में आपका स्वागत है',
            msgSessionExpired: 'सत्र समाप्त। कृपया पुनः जुड़ें।',
            msgOffline: 'आप ऑफ़लाइन हैं। कैश्ड डेटा दिखाया जा रहा है।',
            msgOnline: 'वापस ऑनलाइन!',
            dayMonday: 'सोमवार',
            dayTuesday: 'मंगलवार',
            dayWednesday: 'बुधवार',
            dayThursday: 'गुरुवार',
            dayFriday: 'शुक्रवार',
            daySaturday: 'शनिवार',
            daySunday: 'रविवार',
            monthJanuary: 'जनवरी',
            monthFebruary: 'फरवरी',
            monthMarch: 'मार्च',
            monthApril: 'अप्रैल',
            monthMay: 'मई',
            monthJune: 'जून',
            monthJuly: 'जुलाई',
            monthAugust: 'अगस्त',
            monthSeptember: 'सितंबर',
            monthOctober: 'अक्टूबर',
            monthNovember: 'नवंबर',
            monthDecember: 'दिसंबर'
        }
    };

    // ==================== FUSION DANS LE DICTIONNAIRE PRINCIPAL ====================
    // On ne remplace pas — on complète
    Object.keys(ADDITIONAL_TRANSLATIONS).forEach(lang => {
        if (!window.TRANSLATIONS[lang]) {
            window.TRANSLATIONS[lang] = {};
        }
        Object.keys(ADDITIONAL_TRANSLATIONS[lang]).forEach(key => {
            // Ne pas écraser une clé existante
            if (window.TRANSLATIONS[lang][key] === undefined) {
                window.TRANSLATIONS[lang][key] = ADDITIONAL_TRANSLATIONS[lang][key];
            }
        });
    });

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

    // ==================== LANGUES SUPPORTÉES ====================
    const SUPPORTED_LANGS = Object.keys(ADDITIONAL_TRANSLATIONS);

    // ==================== DÉTECTION DE LA LANGUE ====================
    function detectBrowserLanguage() {
        // 1. Langue sauvegardée
        const savedLang = safeStorage.get('remal_lang');
        if (savedLang && SUPPORTED_LANGS.includes(savedLang)) {
            return savedLang;
        }

        // 2. Langue du navigateur
        const browserLang = (navigator.language || navigator.userLanguage || 'en').split('-')[0].toLowerCase();
        if (SUPPORTED_LANGS.includes(browserLang)) {
            return browserLang;
        }

        // 3. Fallback
        return 'en';
    }

    // ==================== FORMATAGE LOCALISÉ ====================
    const LOCALE_MAP = {
        en: 'en-GB',
        fr: 'fr-FR',
        ar: 'ar-AE',
        hi: 'hi-IN'
    };

    function getLocale(lang) {
        return LOCALE_MAP[lang] || LOCALE_MAP.en;
    }

    function formatLocalizedDate(date, lang) {
        if (!(date instanceof Date) || isNaN(date.getTime())) return '';
        const locale = getLocale(lang || window.currentLanguage || 'en');
        try {
            return date.toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            });
        } catch (e) {
            return date.toLocaleDateString();
        }
    }

    function formatLocalizedTime(date, lang) {
        if (!(date instanceof Date) || isNaN(date.getTime())) return '';
        const locale = getLocale(lang || window.currentLanguage || 'en');
        try {
            return date.toLocaleTimeString(locale, {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } catch (e) {
            return date.toLocaleTimeString();
        }
    }

    // ==================== TRADUCTION ÉTENDUE ====================
    // Wrapper autour de window.t avec fallback
    function translate(key, lang) {
        if (typeof window.t === 'function' && !lang) {
            return window.t(key);
        }

        const targetLang = lang || window.currentLanguage || 'en';
        const dict = window.TRANSLATIONS[targetLang] || window.TRANSLATIONS.en;
        return dict[key] || window.TRANSLATIONS.en[key] || key;
    }

    // ==================== MISE À JOUR DES ÉLÉMENTS [data-i18n-extra] ====================
    function updateTranslatedElements(lang) {
        const targetLang = lang || window.currentLanguage || 'en';

        document.querySelectorAll('[data-i18n-extra]').forEach(el => {
            const key = el.getAttribute('data-i18n-extra');
            if (key) {
                el.textContent = translate(key, targetLang);
            }
        });
    }

    // ==================== ÉCOUTE DES CHANGEMENTS DE LANGUE ====================
    // Se synchronise avec translations.js
    window.addEventListener('languageChanged', (e) => {
        const lang = e.detail && e.detail.language;
        if (lang && SUPPORTED_LANGS.includes(lang)) {
            updateTranslatedElements(lang);
            console.log('🌍 Multilingual Complete synchronisé:', lang);
        }
    });

    // ==================== INITIALISATION ====================
    function init() {
        const lang = detectBrowserLanguage();

        // Sauvegarder UNIQUEMENT si pas déjà fait
        if (!safeStorage.get('remal_lang')) {
            safeStorage.set('remal_lang', lang);
        }

        updateTranslatedElements(lang);
        console.log('🌍 Langue détectée par Multilingual Complete:', lang);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }

    // ==================== API PUBLIQUE ====================
    // On étend window.translations sans écraser l'existant
    if (!window.translations) window.translations = {};

    Object.assign(window.translations, {
        translateExtended: translate,
        formatLocalizedDate,
        formatLocalizedTime,
        detectBrowserLanguage,
        additionalTranslations: Object.freeze(ADDITIONAL_TRANSLATIONS)
    });

    // On expose AUSSI directement pour compatibilité avec votre ancien code
    window.translate = translate;
    window.formatLocalizedDate = formatLocalizedDate;
    window.formatLocalizedTime = formatLocalizedTime;
    window.detectBrowserLanguage = detectBrowserLanguage;

    console.log('✅ Multilingual Complete: extensions ajoutées');

})();
