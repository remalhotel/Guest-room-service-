// ==================== MULTILINGUAL COMPLETE ====================
// Amélioration du système multilingue
// N'affecte AUCUNE fonctionnalité existante

(function() {
    'use strict';
    
    console.log('🌍 Multilingual Complete activé');
    
    // Traductions supplémentaires
    const additionalTranslations = {
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
            
            // Messages
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
    
    // Fonction de traduction améliorée
    function translate(key, lang) {
        const translations = additionalTranslations[lang] || additionalTranslations['en'];
        return translations[key] || key;
    }
    
    // Détecter la langue du navigateur
    function detectBrowserLanguage() {
        const savedLang = localStorage.getItem('remal_lang');
        if (savedLang && additionalTranslations[savedLang]) {
            return savedLang;
        }
        
        const browserLang = navigator.language || navigator.userLanguage;
        const shortLang = browserLang.split('-')[0];
        
        if (additionalTranslations[shortLang]) {
            return shortLang;
        }
        
        return 'en';
    }
    
    // Formater la date selon la langue
    function formatLocalizedDate(date, lang) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        return date.toLocaleDateString(lang === 'ar' ? 'ar-AE' : lang === 'hi' ? 'hi-IN' : lang === 'fr' ? 'fr-FR' : 'en-GB', options);
    }
    
    // Formater l'heure selon la langue
    function formatLocalizedTime(date, lang) {
        return date.toLocaleTimeString(lang === 'ar' ? 'ar-AE' : lang === 'hi' ? 'hi-IN' : lang === 'fr' ? 'fr-FR' : 'en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }
    
    // Appliquer le RTL pour l'arabe
    function applyRTL(lang) {
        const htmlRoot = document.getElementById('htmlRoot');
        if (htmlRoot) {
            htmlRoot.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        }
    }
    
    // Mettre à jour les textes traduits
    function updateTranslatedElements(lang) {
        document.querySelectorAll('[data-i18n-extra]').forEach(el => {
            const key = el.getAttribute('data-i18n-extra');
            el.textContent = translate(key, lang);
        });
    }
    
    // Initialisation
    document.addEventListener('DOMContentLoaded', () => {
        const lang = detectBrowserLanguage();
        localStorage.setItem('remal_lang', lang);
        applyRTL(lang);
        updateTranslatedElements(lang);
        
        console.log('🌍 Langue détectée:', lang);
    });
    
    // Exposer
    window.translate = translate;
    window.formatLocalizedDate = formatLocalizedDate;
    window.formatLocalizedTime = formatLocalizedTime;
    window.detectBrowserLanguage = detectBrowserLanguage;
    
})();
