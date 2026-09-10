// ==================== TRANSLATIONS MODULE ====================
// Module unique de traduction — simple et complet

(function () {
    'use strict';

    // ==================== DICTIONNAIRE ====================
    const TRANSLATIONS = {
        en: {
            // Hôtel
            hotelName: 'Remal Hotel & Villas',
            hotelLocation: 'Remal Hotel & Villas • Al Dhannah City',
            guestId: '🔒 Guest Identification',
            welcomeTitle: 'Welcome to Guest Hub',
            verifyPrompt: 'Please verify your identity to access all services',
            roomNumber: 'Room Number',
            yourName: 'Your Name',
            nameHint: 'Enter any name on your reservation',
            verifying: 'Verifying with hotel records...',
            notFound: 'Room number or name not found. Please try again.',
            verifyAccess: 'Verify & Access',
            // Navigation
            services: 'Services',
            offers: 'Offers',
            faq: 'FAQ',
            history: 'History',
            // Services
            selectService: 'Select a Service',
            roomService: 'Room Service / Order Food',
            roomServiceDesc: 'In-room dining & beverages',
            laundry: 'Laundry Service',
            laundryDesc: 'Wash, dry clean & ironing',
            tableReservation: 'Table Reservation',
            tableReservationDesc: 'Restaurant & lounge booking',
            wakeupCall: 'Wake-up Call / Alarm',
            wakeupCallDesc: 'Morning wake-up service',
            lateCheckout: 'Late Check-out / Extension',
            lateCheckoutDesc: 'Extend your stay',
            housekeeping: 'Housekeeping / Room Cleaning',
            housekeepingDesc: 'Room cleaning service',
            frontDesk: 'Front Desk Inquiry',
            frontDeskDesc: 'General assistance',
            luggage: 'Luggage Assistance',
            luggageDesc: 'Baggage handling',
            maintenance: 'Maintenance / Technical Support',
            maintenanceDesc: 'Repairs & technical help',
            backToServices: 'Back to Services',
            // Suivi commande
            orderTracking: 'Order Tracking',
            received: 'Received',
            preparing: 'Preparing',
            ready: 'Ready',
            delivered: 'Delivered',
            orderReceived: 'Order Received',
            beingPrepared: 'Being Prepared',
            readyForDelivery: 'Ready for Delivery',
            orderDelivered: 'Delivered',
            // Room Service
            mealPeriod: 'Meal Period',
            breakfast: 'Breakfast',
            lunch: 'Lunch',
            dinner: 'Dinner',
            allDay: 'All Day',
            browseMenu: 'Browse Menu',
            searchDish: 'Search dish...',
            specialInstructions: 'Special Instructions / Allergies',
            deliveryTime: 'Delivery Time',
            asap: 'ASAP (~30 min)',
            in45min: 'In 45 minutes',
            in1hour: 'In 1 hour',
            directOrder: 'Direct Order to Kitchen',
            whatsappOrder: 'Send via WhatsApp',
            additionalNotes: 'Additional Notes',
            submitRequest: 'Submit Request',
            sending: 'Sending...',
            requestSent: 'Request sent successfully!',
            errorOccurred: 'An error occurred. Please try again.',
            // Offres
            exclusiveOffers: 'Exclusive Offers',
            featured: 'Featured',
            noOffers: 'No offers available at the moment',
            // FAQ
            faqTitle: 'Frequently Asked Questions',
            // Menu
            restaurantMenu: 'Restaurant Menu',
            total: 'Total:',
            confirmSelection: 'Confirm Selection',
            addToCart: 'Add',
            removeFromCart: 'Remove',
            emptyCart: 'Your cart is empty',
            cartItems: 'items',
            // Chambre
            room: 'Room:',
            roomType: 'Room Type:',
            departure: 'Departure:',
            logout: 'Change Room / Logout',
            confirmLogout: 'Are you sure you want to log out?',
            // Suivi services
            serviceRequestsTracking: 'Service Requests Tracking',
            pendingStatus: 'Pending',
            inProgressStatus: 'In Progress',
            completedStatus: 'Completed',
            submittedAt: 'Submitted',
            noActiveRequests: 'No active service requests',
            // Historique
            orderHistory: 'Order History',
            noHistory: 'No orders yet',
            // Chat
            chatTitle: 'Front Desk Chat',
            chatPlaceholder: 'Write a message...',
            chatSend: 'Send',
            chatOnline: 'Staff online',
            chatOffline: 'Staff offline',
            // Rappels
            reminders: 'Reminders',
            noReminders: 'No reminders',
            // Checkout
            checkoutIn: 'Check-out in',
            // Salutations
            welcome: 'Welcome',
            goodMorning: 'Good morning',
            goodAfternoon: 'Good afternoon',
            goodEvening: 'Good evening',
            // Météo
            wind: 'Wind',
            weatherUnavailable: 'Weather unavailable',
            weatherLoading: 'Loading weather...',
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
            dayMonday: 'Monday', dayTuesday: 'Tuesday', dayWednesday: 'Wednesday',
            dayThursday: 'Thursday', dayFriday: 'Friday', daySaturday: 'Saturday', daySunday: 'Sunday',
            // Mois
            monthJanuary: 'January', monthFebruary: 'February', monthMarch: 'March',
            monthApril: 'April', monthMay: 'May', monthJune: 'June',
            monthJuly: 'July', monthAugust: 'August', monthSeptember: 'September',
            monthOctober: 'October', monthNovember: 'November', monthDecember: 'December',
            // Boutons génériques
            cancel: 'Cancel', confirm: 'Confirm', close: 'Close',
            back: 'Back', save: 'Save', yes: 'Yes', no: 'No'
        },

        fr: {
            hotelName: 'Remal Hotel & Villas',
            hotelLocation: 'Remal Hotel & Villas • Al Dhannah City',
            guestId: '🔒 Identification Client',
            welcomeTitle: 'Bienvenue au Guest Hub',
            verifyPrompt: 'Veuillez vérifier votre identité pour accéder aux services',
            roomNumber: 'Numéro de chambre',
            yourName: 'Votre nom',
            nameHint: 'Entrez un nom de votre réservation',
            verifying: 'Vérification avec les dossiers de l\'hôtel...',
            notFound: 'Numéro de chambre ou nom introuvable. Veuillez réessayer.',
            verifyAccess: 'Vérifier & Accéder',
            services: 'Services',
            offers: 'Offres',
            faq: 'FAQ',
            history: 'Historique',
            selectService: 'Sélectionnez un service',
            roomService: 'Service de chambre / Commander',
            roomServiceDesc: 'Restauration en chambre',
            laundry: 'Service de blanchisserie',
            laundryDesc: 'Lavage, nettoyage à sec & repassage',
            tableReservation: 'Réservation de table',
            tableReservationDesc: 'Réservation restaurant & lounge',
            wakeupCall: 'Réveil / Alarme',
            wakeupCallDesc: 'Service de réveil matinal',
            lateCheckout: 'Départ tardif / Extension',
            lateCheckoutDesc: 'Prolongez votre séjour',
            housekeeping: 'Ménage / Nettoyage',
            housekeepingDesc: 'Service de nettoyage',
            frontDesk: 'Réception',
            frontDeskDesc: 'Assistance générale',
            luggage: 'Aide bagages',
            luggageDesc: 'Manutention des bagages',
            maintenance: 'Maintenance / Support technique',
            maintenanceDesc: 'Réparations & aide technique',
            backToServices: 'Retour aux services',
            orderTracking: 'Suivi de commande',
            received: 'Reçue',
            preparing: 'En préparation',
            ready: 'Prête',
            delivered: 'Livrée',
            orderReceived: 'Commande reçue',
            beingPrepared: 'En préparation',
            readyForDelivery: 'Prête pour livraison',
            orderDelivered: 'Livrée',
            mealPeriod: 'Période de repas',
            breakfast: 'Petit-déjeuner',
            lunch: 'Déjeuner',
            dinner: 'Dîner',
            allDay: 'Toute la journée',
            browseMenu: 'Parcourir le menu',
            searchDish: 'Rechercher un plat...',
            specialInstructions: 'Instructions spéciales / Allergies',
            deliveryTime: 'Heure de livraison',
            asap: 'Dès que possible (~30 min)',
            in45min: 'Dans 45 minutes',
            in1hour: 'Dans 1 heure',
            directOrder: 'Commande directe',
            whatsappOrder: 'Envoyer via WhatsApp',
            additionalNotes: 'Notes supplémentaires',
            submitRequest: 'Envoyer la demande',
            sending: 'Envoi en cours...',
            requestSent: 'Demande envoyée avec succès !',
            errorOccurred: 'Une erreur est survenue. Veuillez réessayer.',
            exclusiveOffers: 'Offres exclusives',
            featured: 'En vedette',
            noOffers: 'Aucune offre disponible',
            faqTitle: 'Questions fréquentes',
            restaurantMenu: 'Menu du restaurant',
            total: 'Total :',
            confirmSelection: 'Confirmer la sélection',
            addToCart: 'Ajouter',
            removeFromCart: 'Retirer',
            emptyCart: 'Votre panier est vide',
            cartItems: 'articles',
            room: 'Chambre :',
            roomType: 'Type de chambre :',
            departure: 'Départ :',
            logout: 'Changer de chambre',
            confirmLogout: 'Êtes-vous sûr de vouloir vous déconnecter ?',
            serviceRequestsTracking: 'Suivi des demandes de service',
            pendingStatus: 'En attente',
            inProgressStatus: 'En cours',
            completedStatus: 'Terminé',
            submittedAt: 'Soumis',
            noActiveRequests: 'Aucune demande de service active',
            orderHistory: 'Historique des commandes',
            noHistory: 'Aucune commande pour le moment',
            chatTitle: 'Chat avec la réception',
            chatPlaceholder: 'Écrivez un message...',
            chatSend: 'Envoyer',
            chatOnline: 'Personnel en ligne',
            chatOffline: 'Personnel hors ligne',
            reminders: 'Rappels',
            noReminders: 'Aucun rappel',
            checkoutIn: 'Départ dans',
            welcome: 'Bienvenue',
            goodMorning: 'Bonjour',
            goodAfternoon: 'Bon après-midi',
            goodEvening: 'Bonsoir',
            wind: 'Vent',
            weatherUnavailable: 'Météo indisponible',
            weatherLoading: 'Chargement météo...',
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
            dayMonday: 'Lundi', dayTuesday: 'Mardi', dayWednesday: 'Mercredi',
            dayThursday: 'Jeudi', dayFriday: 'Vendredi', daySaturday: 'Samedi', daySunday: 'Dimanche',
            monthJanuary: 'Janvier', monthFebruary: 'Février', monthMarch: 'Mars',
            monthApril: 'Avril', monthMay: 'Mai', monthJune: 'Juin',
            monthJuly: 'Juillet', monthAugust: 'Août', monthSeptember: 'Septembre',
            monthOctober: 'Octobre', monthNovember: 'Novembre', monthDecember: 'Décembre',
            cancel: 'Annuler', confirm: 'Confirmer', close: 'Fermer',
            back: 'Retour', save: 'Enregistrer', yes: 'Oui', no: 'Non'
        },

        ar: {
            hotelName: 'فندق وفلل رمال',
            hotelLocation: 'فندق وفلل رمال • مدينة الظنة',
            guestId: '🔒 تعريف النزيل',
            welcomeTitle: 'مرحباً بكم في Guest Hub',
            verifyPrompt: 'يرجى التحقق من هويتك للوصول إلى الخدمات',
            roomNumber: 'رقم الغرفة',
            yourName: 'اسمك',
            nameHint: 'أدخل أي اسم من حجزك',
            verifying: 'جارٍ التحقق من سجلات الفندق...',
            notFound: 'رقم الغرفة أو الاسم غير موجود',
            verifyAccess: 'تحقق وادخل',
            services: 'الخدمات',
            offers: 'العروض',
            faq: 'الأسئلة',
            history: 'السجل',
            selectService: 'اختر خدمة',
            roomService: 'خدمة الغرف / طلب طعام',
            roomServiceDesc: 'تناول الطعام في الغرفة',
            laundry: 'خدمة الغسيل',
            laundryDesc: 'غسيل وتنظيف جاف وكي',
            tableReservation: 'حجز طاولة',
            tableReservationDesc: 'حجز المطعم والصالة',
            wakeupCall: 'خدمة الإيقاظ',
            wakeupCallDesc: 'خدمة الاستيقاظ الصباحي',
            lateCheckout: 'مغادرة متأخرة / تمديد',
            lateCheckoutDesc: 'تمديد إقامتك',
            housekeeping: 'التنظيف / خدمة الغرف',
            housekeepingDesc: 'خدمة تنظيف الغرف',
            frontDesk: 'الاستفسار من الاستقبال',
            frontDeskDesc: 'مساعدة عامة',
            luggage: 'مساعدة الأمتعة',
            luggageDesc: 'معالجة الأمتعة',
            maintenance: 'الصيانة / الدعم الفني',
            maintenanceDesc: 'إصلاحات ومساعدة فنية',
            backToServices: 'العودة إلى الخدمات',
            orderTracking: 'تتبع الطلب',
            received: 'تم الاستلام',
            preparing: 'قيد التحضير',
            ready: 'جاهز',
            delivered: 'تم التسليم',
            orderReceived: 'تم استلام الطلب',
            beingPrepared: 'قيد التحضير',
            readyForDelivery: 'جاهز للتسليم',
            orderDelivered: 'تم التسليم',
            mealPeriod: 'فترة الوجبة',
            breakfast: 'الإفطار',
            lunch: 'الغداء',
            dinner: 'العشاء',
            allDay: 'طوال اليوم',
            browseMenu: 'تصفح القائمة',
            searchDish: 'ابحث عن طبق...',
            specialInstructions: 'تعليمات خاصة / حساسية',
            deliveryTime: 'وقت التسليم',
            asap: 'في أسرع وقت (~30 دقيقة)',
            in45min: 'خلال 45 دقيقة',
            in1hour: 'خلال ساعة',
            directOrder: 'طلب مباشر للمطبخ',
            whatsappOrder: 'إرسال عبر واتساب',
            additionalNotes: 'ملاحظات إضافية',
            submitRequest: 'إرسال الطلب',
            sending: 'جارٍ الإرسال...',
            requestSent: 'تم إرسال الطلب بنجاح!',
            errorOccurred: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
            exclusiveOffers: 'عروض حصرية',
            featured: 'مميز',
            noOffers: 'لا توجد عروض متاحة',
            faqTitle: 'الأسئلة الشائعة',
            restaurantMenu: 'قائمة المطعم',
            total: 'المجموع:',
            confirmSelection: 'تأكيد الاختيار',
            addToCart: 'إضافة',
            removeFromCart: 'إزالة',
            emptyCart: 'سلتك فارغة',
            cartItems: 'عناصر',
            room: 'الغرفة:',
            roomType: 'نوع الغرفة:',
            departure: 'المغادرة:',
            logout: 'تغيير الغرفة',
            confirmLogout: 'هل أنت متأكد من تسجيل الخروج؟',
            serviceRequestsTracking: 'تتبع طلبات الخدمة',
            pendingStatus: 'قيد الانتظار',
            inProgressStatus: 'قيد التنفيذ',
            completedStatus: 'مكتمل',
            submittedAt: 'تم الإرسال',
            noActiveRequests: 'لا توجد طلبات خدمة نشطة',
            orderHistory: 'سجل الطلبات',
            noHistory: 'لا توجد طلبات بعد',
            chatTitle: 'الدردشة مع الاستقبال',
            chatPlaceholder: 'اكتب رسالة...',
            chatSend: 'إرسال',
            chatOnline: 'الموظف متصل',
            chatOffline: 'الموظف غير متصل',
            reminders: 'التذكيرات',
            noReminders: 'لا توجد تذكيرات',
            checkoutIn: 'المغادرة خلال',
            welcome: 'مرحباً',
            goodMorning: 'صباح الخير',
            goodAfternoon: 'مساء الخير',
            goodEvening: 'مساء الخير',
            wind: 'الرياح',
            weatherUnavailable: 'الطقس غير متوفر',
            weatherLoading: 'جارٍ تحميل الطقس...',
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
            dayMonday: 'الاثنين', dayTuesday: 'الثلاثاء', dayWednesday: 'الأربعاء',
            dayThursday: 'الخميس', dayFriday: 'الجمعة', daySaturday: 'السبت', daySunday: 'الأحد',
            monthJanuary: 'يناير', monthFebruary: 'فبراير', monthMarch: 'مارس',
            monthApril: 'أبريل', monthMay: 'مايو', monthJune: 'يونيو',
            monthJuly: 'يوليو', monthAugust: 'أغسطس', monthSeptember: 'سبتمبر',
            monthOctober: 'أكتوبر', monthNovember: 'نوفمبر', monthDecember: 'ديسمبر',
            cancel: 'إلغاء', confirm: 'تأكيد', close: 'إغلاق',
            back: 'رجوع', save: 'حفظ', yes: 'نعم', no: 'لا'
        },

        hi: {
            hotelName: 'रेमल होटल और विला',
            hotelLocation: 'रेमल होटल और विला • अल धन्ना सिटी',
            guestId: '🔒 अतिथि पहचान',
            welcomeTitle: 'गेस्ट हब में आपका स्वागत है',
            verifyPrompt: 'सेवाओं तक पहुंचने के लिए कृपया अपनी पहचान सत्यापित करें',
            roomNumber: 'कमरा संख्या',
            yourName: 'आपका नाम',
            nameHint: 'अपने आरक्षण से कोई भी नाम दर्ज करें',
            verifying: 'होटल रिकॉर्ड से सत्यापित किया जा रहा है...',
            notFound: 'कमरा संख्या या नाम नहीं मिला',
            verifyAccess: 'सत्यापित करें और प्रवेश करें',
            services: 'सेवाएं',
            offers: 'ऑफ़र',
            faq: 'प्रश्न',
            history: 'इतिहास',
            selectService: 'एक सेवा चुनें',
            roomService: 'रूम सर्विस / खाना ऑर्डर',
            roomServiceDesc: 'कमरे में भोजन',
            laundry: 'लॉन्ड्री सेवा',
            laundryDesc: 'धुलाई, ड्राई क्लीन और इस्त्री',
            tableReservation: 'टेबल आरक्षण',
            tableReservationDesc: 'रेस्तरां बुकिंग',
            wakeupCall: 'वेक-अप कॉल',
            wakeupCallDesc: 'सुबह जगाने की सेवा',
            lateCheckout: 'लेट चेक-आउट',
            lateCheckoutDesc: 'अपने प्रवास को बढ़ाएं',
            housekeeping: 'हाउसकीपिंग',
            housekeepingDesc: 'कमरे की सफाई',
            frontDesk: 'फ्रंट डेस्क',
            frontDeskDesc: 'सामान्य सहायता',
            luggage: 'सामान सहायता',
            luggageDesc: 'सामान संभालना',
            maintenance: 'रखरखाव / तकनीकी सहायता',
            maintenanceDesc: 'मरम्मत और तकनीकी मदद',
            backToServices: 'सेवाओं पर वापस',
            orderTracking: 'ऑर्डर ट्रैकिंग',
            received: 'प्राप्त हुआ',
            preparing: 'तैयार हो रहा है',
            ready: 'तैयार',
            delivered: 'वितरित',
            orderReceived: 'ऑर्डर प्राप्त हुआ',
            beingPrepared: 'तैयार हो रहा है',
            readyForDelivery: 'डिलीवरी के लिए तैयार',
            orderDelivered: 'वितरित',
            mealPeriod: 'भोजन अवधि',
            breakfast: 'नाश्ता',
            lunch: 'दोपहर का भोजन',
            dinner: 'रात का खाना',
            allDay: 'पूरे दिन',
            browseMenu: 'मेनू ब्राउज़ करें',
            searchDish: 'व्यंजन खोजें...',
            specialInstructions: 'विशेष निर्देश / एलर्जी',
            deliveryTime: 'डिलीवरी का समय',
            asap: 'जल्द से जल्द (~30 मिनट)',
            in45min: '45 मिनट में',
            in1hour: '1 घंटे में',
            directOrder: 'सीधे रसोई में ऑर्डर',
            whatsappOrder: 'व्हाट्सएप से भेजें',
            additionalNotes: 'अतिरिक्त नोट्स',
            submitRequest: 'अनुरोध भेजें',
            sending: 'भेजा जा रहा है...',
            requestSent: 'अनुरोध सफलतापूर्वक भेजा गया!',
            errorOccurred: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
            exclusiveOffers: 'विशेष ऑफ़र',
            featured: 'विशेष',
            noOffers: 'कोई ऑफ़र उपलब्ध नहीं',
            faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
            restaurantMenu: 'रेस्तरां मेनू',
            total: 'कुल:',
            confirmSelection: 'चयन की पुष्टि करें',
            addToCart: 'जोड़ें',
            removeFromCart: 'हटाएं',
            emptyCart: 'आपकी कार्ट खाली है',
            cartItems: 'आइटम',
            room: 'कमरा:',
            roomType: 'कमरे का प्रकार:',
            departure: 'प्रस्थान:',
            logout: 'कमरा बदलें',
            confirmLogout: 'क्या आप लॉग आउट करना चाहते हैं?',
            serviceRequestsTracking: 'सेवा अनुरोध ट्रैकिंग',
            pendingStatus: 'लंबित',
            inProgressStatus: 'प्रगति में',
            completedStatus: 'पूर्ण',
            submittedAt: 'प्रस्तुत',
            noActiveRequests: 'कोई सक्रिय सेवा अनुरोध नहीं',
            orderHistory: 'ऑर्डर इतिहास',
            noHistory: 'अभी तक कोई ऑर्डर नहीं',
            chatTitle: 'फ्रंट डेस्क चैट',
            chatPlaceholder: 'संदेश लिखें...',
            chatSend: 'भेजें',
            chatOnline: 'स्टाफ ऑनलाइन',
            chatOffline: 'स्टाफ ऑफ़लाइन',
            reminders: 'रिमाइंडर',
            noReminders: 'कोई रिमाइंडर नहीं',
            checkoutIn: 'चेक-आउट में',
            welcome: 'स्वागत है',
            goodMorning: 'सुप्रभात',
            goodAfternoon: 'नमस्कार',
            goodEvening: 'शुभ संध्या',
            wind: 'हवा',
            weatherUnavailable: 'मौसम उपलब्ध नहीं',
            weatherLoading: 'मौसम लोड हो रहा है...',
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
            dayMonday: 'सोमवार', dayTuesday: 'मंगलवार', dayWednesday: 'बुधवार',
            dayThursday: 'गुरुवार', dayFriday: 'शुक्रवार', daySaturday: 'शनिवार', daySunday: 'रविवार',
            monthJanuary: 'जनवरी', monthFebruary: 'फरवरी', monthMarch: 'मार्च',
            monthApril: 'अप्रैल', monthMay: 'मई', monthJune: 'जून',
            monthJuly: 'जुलाई', monthAugust: 'अगस्त', monthSeptember: 'सितंबर',
            monthOctober: 'अक्टूबर', monthNovember: 'नवंबर', monthDecember: 'दिसंबर',
            cancel: 'रद्द करें', confirm: 'पुष्टि करें', close: 'बंद करें',
            back: 'वापस', save: 'सहेजें', yes: 'हाँ', no: 'नहीं'
        }
    };

    // ==================== CONFIGURATION ====================
    const SUPPORTED_LANGS = ['en', 'fr', 'ar', 'hi'];
    const RTL_LANGS = ['ar'];
    const DEFAULT_LANG = 'en';
    const STORAGE_KEY = 'remal_lang';

    // ==================== ÉTAT ====================
    let currentLanguage = DEFAULT_LANG;

    // ==================== STORAGE SÉCURISÉ ====================
    function getStoredLang() {
        try { return localStorage.getItem(STORAGE_KEY); }
        catch (e) { return null; }
    }
    function setStoredLang(lang) {
        try { localStorage.setItem(STORAGE_KEY, lang); }
        catch (e) { /* silencieux */ }
    }

    // ==================== DÉTECTION ====================
    function detectLanguage() {
        const saved = getStoredLang();
        if (saved && SUPPORTED_LANGS.includes(saved)) return saved;

        const browserLang = (navigator.language || 'en').split('-')[0].toLowerCase();
        if (SUPPORTED_LANGS.includes(browserLang)) return browserLang;

        return DEFAULT_LANG;
    }

    // ==================== FONCTION t() ====================
    function t(key, params = {}) {
        const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS[DEFAULT_LANG];
        let value = dict[key];

        // Fallback vers l'anglais
        if (value === undefined) {
            value = TRANSLATIONS[DEFAULT_LANG][key];
        }

        // Fallback final : clé brute
        if (value === undefined) {
            console.warn('⚠️ Traduction manquante:', key, '(', currentLanguage, ')');
            return key;
        }

        // Paramètres dynamiques {name}, {room}
        if (typeof value === 'string' && Object.keys(params).length > 0) {
            Object.keys(params).forEach(k => {
                value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
            });
        }

        return value;
    }

    // ==================== APPLIQUER AU DOM ====================
    function applyTranslations() {
        // [data-i18n] → textContent
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (!key) return;
            el.textContent = t(key);
        });

        // [data-i18n-extra] → textContent (compat avec ancien code)
        document.querySelectorAll('[data-i18n-extra]').forEach(el => {
            const key = el.getAttribute('data-i18n-extra');
            if (!key) return;
            el.textContent = t(key);
        });

        // [data-i18n-placeholder] → placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key) el.setAttribute('placeholder', t(key));
        });

        // [data-i18n-title] → title
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (key) el.setAttribute('title', t(key));
        });

        // [data-i18n-aria-label] → aria-label
        document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria-label');
            if (key) el.setAttribute('aria-label', t(key));
        });
    }

    // ==================== DIRECTION RTL ====================
    function applyDirection(lang) {
        const isRTL = RTL_LANGS.includes(lang);
        const htmlEl = document.documentElement;

        htmlEl.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        htmlEl.setAttribute('lang', lang);

        if (document.body) {
            document.body.classList.toggle('rtl-mode', isRTL);
            document.body.classList.toggle('ltr-mode', !isRTL);
        }
    }

    // ==================== CHANGER LA LANGUE ====================
    function setLanguage(lang) {
        if (!SUPPORTED_LANGS.includes(lang)) {
            console.warn('⚠️ Langue non supportée:', lang, '→ fallback EN');
            lang = DEFAULT_LANG;
        }

        currentLanguage = lang;
        window.currentLanguage = lang;

        // Persister
        setStoredLang(lang);

        // Direction RTL
        applyDirection(lang);

        // Traduire le DOM
        applyTranslations();

        // Mettre à jour les boutons de langue
        SUPPORTED_LANGS.forEach(l => {
            const cap = l.charAt(0).toUpperCase() + l.slice(1);
            ['lang' + cap, 'lang' + cap + 'Main'].forEach(id => {
                const btn = document.getElementById(id);
                if (!btn) return;
                if (l === lang) btn.classList.add('active');
                else btn.classList.remove('active');
            });
        });

        // Émettre un événement (pour les autres modules)
        try {
            window.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { language: lang }
            }));
        } catch (e) { /* silencieux */ }

        console.log('🌐 Langue changée:', lang);
    }

    // ==================== INITIALISATION ====================
    function init() {
        const lang = detectLanguage();
        // setLanguage va déclencher applyTranslations
        setLanguage(lang);
    }

    // Exécuter immédiatement
    init();

    // Réappliquer après DOMContentLoaded (au cas où le DOM change)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            applyTranslations();
        }, { once: true });
    }

    // ==================== API PUBLIQUE ====================
    window.t = t;
    window.setLanguage = setLanguage;
    window.applyTranslations = applyTranslations;
    window.getCurrentLanguage = () => currentLanguage;
    window.TRANSLATIONS = Object.freeze(TRANSLATIONS);

    console.log('✅ Translations module chargé');

})();
