// ==================== TRANSLATIONS MODULE ====================
// Multilingue complet avec fonction t(), applyTranslations() et RTL

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
            // Suivi de commande
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
            faqQ1: 'What time is check-out?',
            faqA1: 'Check-out is at 12:00 PM. Late check-out can be requested via the app.',
            faqQ2: 'How do I order room service?',
            faqA2: 'Go to Services → Room Service, browse the menu and confirm your order.',
            faqQ3: 'Is Wi-Fi free?',
            faqA3: 'Yes, free high-speed Wi-Fi is available throughout the hotel.',
            faqQ4: 'How can I contact the front desk?',
            faqA4: 'Use the chat button at the bottom-left, or call +971 52 696 6865.',
            faqQ5: 'Do you offer laundry service?',
            faqA5: 'Yes, laundry service is available daily. Access it from the Services menu.',
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
            // Suivi des services
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
            // Boutons génériques
            cancel: 'Cancel',
            confirm: 'Confirm',
            close: 'Close',
            back: 'Back',
            save: 'Save',
            yes: 'Yes',
            no: 'No'
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
            faqQ1: 'À quelle heure est le départ ?',
            faqA1: 'Le départ est à 12h00. Un départ tardif peut être demandé via l\'application.',
            faqQ2: 'Comment commander le service en chambre ?',
            faqA2: 'Allez dans Services → Service de chambre, parcourez le menu et confirmez.',
            faqQ3: 'Le Wi-Fi est-il gratuit ?',
            faqA3: 'Oui, le Wi-Fi haut débit gratuit est disponible partout dans l\'hôtel.',
            faqQ4: 'Comment contacter la réception ?',
            faqA4: 'Utilisez le bouton de chat en bas à gauche, ou appelez le +971 52 696 6865.',
            faqQ5: 'Proposez-vous un service de blanchisserie ?',
            faqA5: 'Oui, le service est disponible tous les jours. Accédez-y depuis le menu Services.',
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
            cancel: 'Annuler',
            confirm: 'Confirmer',
            close: 'Fermer',
            back: 'Retour',
            save: 'Enregistrer',
            yes: 'Oui',
            no: 'Non'
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
            faqQ1: 'ما هو وقت المغادرة؟',
            faqA1: 'المغادرة الساعة 12:00 ظهراً. يمكن طلب المغادرة المتأخرة عبر التطبيق.',
            faqQ2: 'كيف أطلب خدمة الغرف؟',
            faqA2: 'اذهب إلى الخدمات → خدمة الغرف، تصفح القائمة وأكد طلبك.',
            faqQ3: 'هل الواي فاي مجاني؟',
            faqA3: 'نعم، الواي فاي عالي السرعة مجاني في جميع أنحاء الفندق.',
            faqQ4: 'كيف أتواصل مع الاستقبال؟',
            faqA4: 'استخدم زر الدردشة أسفل اليسار، أو اتصل على 6865 696 52 971+.',
            faqQ5: 'هل تقدمون خدمة غسيل الملابس؟',
            faqA5: 'نعم، الخدمة متاحة يومياً. يمكنك الوصول إليها من قائمة الخدمات.',
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
            cancel: 'إلغاء',
            confirm: 'تأكيد',
            close: 'إغلاق',
            back: 'رجوع',
            save: 'حفظ',
            yes: 'نعم',
            no: 'لا'
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
            faqQ1: 'चेक-आउट का समय क्या है?',
            faqA1: 'चेक-आउट दोपहर 12:00 बजे है। ऐप के माध्यम से लेट चेक-आउट का अनुरोध किया जा सकता है।',
            faqQ2: 'मैं रूम सर्विस कैसे ऑर्डर करूं?',
            faqA2: 'सेवाएं → रूम सर्विस पर जाएं, मेनू ब्राउज़ करें और ऑर्डर की पुष्टि करें।',
            faqQ3: 'क्या वाई-फाई मुफ्त है?',
            faqA3: 'हां, पूरे होटल में मुफ्त हाई-स्पीड वाई-फाई उपलब्ध है।',
            faqQ4: 'मैं फ्रंट डेस्क से कैसे संपर्क करूं?',
            faqA4: 'नीचे-बाएं चैट बटन का उपयोग करें, या +971 52 696 6865 पर कॉल करें।',
            faqQ5: 'क्या आप लॉन्ड्री सेवा प्रदान करते हैं?',
            faqA5: 'हां, लॉन्ड्री सेवा प्रतिदिन उपलब्ध है। सेवाएं मेनू से एक्सेस करें।',
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
            cancel: 'रद्द करें',
            confirm: 'पुष्टि करें',
            close: 'बंद करें',
            back: 'वापस',
            save: 'सहेजें',
            yes: 'हाँ',
            no: 'नहीं'
        }
    };

    // ==================== LANGUES SUPPORTÉES ====================
    const SUPPORTED_LANGS = ['en', 'fr', 'ar', 'hi'];
    const RTL_LANGS = ['ar'];
    const DEFAULT_LANG = 'en';

    // ==================== ÉTAT ====================
    let currentLanguage = DEFAULT_LANG;

    // ==================== DÉTECTION LANGUE ====================
    function detectLanguage() {
        try {
            const saved = localStorage.getItem('remal_lang');
            if (saved && SUPPORTED_LANGS.includes(saved)) return saved;

            const browserLang = (navigator.language || 'en').split('-')[0].toLowerCase();
            if (SUPPORTED_LANGS.includes(browserLang)) return browserLang;
        } catch (e) {
            // ignore
        }
        return DEFAULT_LANG;
    }

    // ==================== FONCTION DE TRADUCTION ====================
    function t(key, params = {}) {
        const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS[DEFAULT_LANG];
        let value = dict[key];

        // Fallback vers l'anglais
        if (value === undefined) {
            value = TRANSLATIONS[DEFAULT_LANG][key];
        }

        // Fallback final : retourner la clé
        if (value === undefined) {
            console.warn('⚠️ Traduction manquante:', key, '(', currentLanguage, ')');
            return key;
        }

        // Remplacer les paramètres {name}, {room}, etc.
        if (typeof value === 'string' && Object.keys(params).length > 0) {
            Object.keys(params).forEach(k => {
                value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
            });
        }

        return value;
    }

    // ==================== APPLIQUER LES TRADUCTIONS AU DOM ====================
    function applyTranslations() {
        // 1. Éléments [data-i18n]
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (!key) return;
            const translated = t(key);

            // Support des placeholders et attributs
            const attr = el.getAttribute('data-i18n-attr');
            if (attr) {
                el.setAttribute(attr, translated);
            } else {
                el.textContent = translated;
            }
        });

        // 2. Attributs [data-i18n-placeholder]
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key) el.setAttribute('placeholder', t(key));
        });

        // 3. Attributs [data-i18n-title]
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (key) el.setAttribute('title', t(key));
        });

        // 4. Attributs [data-i18n-aria-label]
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

        // Ajouter une classe pour styles RTL personnalisés
        document.body.classList.toggle('rtl-mode', isRTL);
        document.body.classList.toggle('ltr-mode', !isRTL);
    }

    // ==================== CHANGER LA LANGUE ====================
    function setLanguage(lang) {
        if (!SUPPORTED_LANGS.includes(lang)) {
            console.warn('⚠️ Langue non supportée:', lang);
            lang = DEFAULT_LANG;
        }

        currentLanguage = lang;
        window.currentLanguage = lang;

        // Persister
        try { localStorage.setItem('remal_lang', lang); } catch (e) {}

        // Appliquer direction
        applyDirection(lang);

        // Mettre à jour les boutons actifs
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll(
            `#lang${lang.charAt(0).toUpperCase()}${lang.slice(1)}, ` +
            `#lang${lang.charAt(0).toUpperCase()}${lang.slice(1)}Main`
        ).forEach(btn => {
            btn.classList.add('active');
        });

        // Appliquer les traductions
        applyTranslations();

        // Émettre un événement pour les autres modules
        try {
            window.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { language: lang }
            }));
        } catch (e) {}

        console.log('🌐 Langue changée:', lang);
    }

    // ==================== INITIALISATION ====================
    function init() {
        const lang = detectLanguage();
        setLanguage(lang);
    }

    // Exécuter dès que possible (avant DOMContentLoaded pour éviter le flash)
    init();

    // ==================== API PUBLIQUE ====================
    window.t = t;
    window.setLanguage = setLanguage;
    window.applyTranslations = applyTranslations;
    window.getCurrentLanguage = () => currentLanguage;
    window.TRANSLATIONS = Object.freeze(TRANSLATIONS);
    window.translations = {
        t,
        setLanguage,
        applyTranslations,
        getCurrentLanguage: () => currentLanguage,
        supportedLangs: SUPPORTED_LANGS,
        rtlLangs: RTL_LANGS
    };

})();        received: 'Received',
        preparing: 'Preparing',
        ready: 'Ready',
        delivered: 'Delivered',
        mealPeriod: 'Meal Period',
        browseMenu: 'Browse Menu',
        specialInstructions: 'Special Instructions / Allergies',
        deliveryTime: 'Delivery Time',
        directOrder: 'Direct Order to Kitchen',
        whatsappOrder: 'Send via WhatsApp',
        additionalNotes: 'Additional Notes',
        submitRequest: 'Submit Request',
        exclusiveOffers: 'Exclusive Offers',
        faqTitle: 'Frequently Asked Questions',
        restaurantMenu: 'Restaurant Menu',
        total: 'Total:',
        confirmSelection: 'Confirm Selection',
        room: 'Room:',
        roomType: 'Room Type:',
        departure: 'Departure:',
        logout: 'Change Room / Logout',
        orderReceived: 'Order Received',
        beingPrepared: 'Being Prepared',
        readyForDelivery: 'Ready for Delivery',
        orderDelivered: 'Delivered',
        noOffers: 'No offers available at the moment',
        featured: 'Featured',
        serviceRequestsTracking: 'Service Requests Tracking',
        pendingStatus: 'Pending',
        inProgressStatus: 'In Progress',
        completedStatus: 'Completed',
        submittedAt: 'Submitted',
        noActiveRequests: 'No active service requests'
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
        selectService: 'Sélectionnez un service',
        roomService: 'Service de chambre / Commander',
        roomServiceDesc: 'Restauration en chambre',
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
        mealPeriod: 'Période de repas',
        browseMenu: 'Parcourir le menu',
        specialInstructions: 'Instructions spéciales / Allergies',
        deliveryTime: 'Heure de livraison',
        directOrder: 'Commande directe',
        whatsappOrder: 'Envoyer via WhatsApp',
        additionalNotes: 'Notes supplémentaires',
        submitRequest: 'Envoyer la demande',
        exclusiveOffers: 'Offres exclusives',
        faqTitle: 'Questions fréquentes',
        restaurantMenu: 'Menu du restaurant',
        total: 'Total :',
        confirmSelection: 'Confirmer la sélection',
        room: 'Chambre :',
        roomType: 'Type de chambre :',
        departure: 'Départ :',
        logout: 'Changer de chambre',
        orderReceived: 'Commande reçue',
        beingPrepared: 'En préparation',
        readyForDelivery: 'Prête pour livraison',
        orderDelivered: 'Livrée',
        noOffers: 'Aucune offre disponible',
        featured: 'En vedette',
        serviceRequestsTracking: 'Suivi des demandes de service',
        pendingStatus: 'En attente',
        inProgressStatus: 'En cours',
        completedStatus: 'Terminé',
        submittedAt: 'Soumis',
        noActiveRequests: 'Aucune demande de service active'
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
        selectService: 'اختر خدمة',
        roomService: 'خدمة الغرف / طلب طعام',
        roomServiceDesc: 'تناول الطعام في الغرفة',
        tableReservation: 'حجز طاولة',
        tableReservationDesc: 'حجز المطعم والصالة',
        wakeupCall: 'خدمة الإيقاظ',
        wakeupCallDesc: 'خدمة الاستيقاظ الصباحي',
        lateCheckout: 'مغادرة متأخرة / تمديد',
        lateCheckoutDesc: 'تمديد إقاماتك',
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
        mealPeriod: 'فترة الوجبة',
        browseMenu: 'تصفح القائمة',
        specialInstructions: 'تعليمات خاصة / حساسية',
        deliveryTime: 'وقت التسليم',
        directOrder: 'طلب مباشر للمطبخ',
        whatsappOrder: 'إرسال عبر واتساب',
        additionalNotes: 'ملاحظات إضافية',
        submitRequest: 'إرسال الطلب',
        exclusiveOffers: 'عروض حصرية',
        faqTitle: 'الأسئلة الشائعة',
        restaurantMenu: 'قائمة المطعم',
        total: 'المجموع:',
        confirmSelection: 'تأكيد الاختيار',
        room: 'الغرفة:',
        roomType: 'نوع الغرفة:',
        departure: 'المغادرة:',
        logout: 'تغيير الغرفة',
        orderReceived: 'تم استلام الطلب',
        beingPrepared: 'قيد التحضير',
        readyForDelivery: 'جاهز للتسليم',
        orderDelivered: 'تم التسليم',
        noOffers: 'لا توجد عروض متاحة',
        featured: 'مميز',
        serviceRequestsTracking: 'تتبع طلبات الخدمة',
        pendingStatus: 'قيد الانتظار',
        inProgressStatus: 'قيد التنفيذ',
        completedStatus: 'مكتمل',
        submittedAt: 'تم الإرسال',
        noActiveRequests: 'لا توجد طلبات خدمة نشطة'
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
        selectService: 'एक सेवा चुनें',
        roomService: 'रूम सर्विस / खाना ऑर्डर',
        roomServiceDesc: 'कमरे में भोजन',
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
        mealPeriod: 'भोजन अवधि',
        browseMenu: 'मेनू ब्राउज़ करें',
        specialInstructions: 'विशेष निर्देश / एलर्जी',
        deliveryTime: 'डिलीवरी का समय',
        directOrder: 'सीधे रसोई में ऑर्डर',
        whatsappOrder: 'व्हाट्सएप से भेजें',
        additionalNotes: 'अतिरिक्त नोट्स',
        submitRequest: 'अनुरोध भेजें',
        exclusiveOffers: 'विशेष ऑफ़र',
        faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
        restaurantMenu: 'रेस्तरां मेनू',
        total: 'कुल:',
        confirmSelection: 'चयन की पुष्टि करें',
        room: 'कमरा:',
        roomType: 'कमरे का प्रकार:',
        departure: 'प्रस्थान:',
        logout: 'कमरा बदलें',
        orderReceived: 'ऑर्डर प्राप्त हुआ',
        beingPrepared: 'तैयार हो रहा है',
        readyForDelivery: 'डिलीवरी के लिए तैयार',
        orderDelivered: 'वितरित',
        noOffers: 'कोई ऑफ़र उपलब्ध नहीं',
        featured: 'विशेष',
        serviceRequestsTracking: 'सेवा अनुरोध ट्रैकिंग',
        pendingStatus: 'लंबित',
        inProgressStatus: 'प्रगति में',
        completedStatus: 'पूर्ण',
        submittedAt: 'प्रस्तुत',
        noActiveRequests: 'कोई सक्रिय सेवा अनुरोध नहीं'
    }
};
