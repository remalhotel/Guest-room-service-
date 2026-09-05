// ==================== CONSTANTS ====================
const SALUTATIONS_REGEX = /\b(mr|mrs|ms|miss|mme|mlle|dr|prof|eng|sir|madam|lady|lord|sheikh|sheikha)\.?\b/gi;

// ==================== FAQ DATA ====================
const FAQ_DATA = {
    en: [
        { q: 'What is the Wi-Fi password?', a: 'Connect to "Remal_Guest" - no password required.' },
        { q: 'What are the breakfast hours?', a: 'Daily at Falaj Restaurant from 06:30 AM to 11:00 AM.' },
        { q: 'How do I request a late check-out?', a: 'Use the Services tab and select "Late Check-out".' },
        { q: 'What are the pool timings?', a: 'Al Waha Pool is open from 07:00 AM to 08:00 PM.' }
    ],
    fr: [
        { q: 'Quel est le mot de passe Wi-Fi ?', a: 'Connectez-vous à "Remal_Guest" - aucun mot de passe requis.' },
        { q: 'Quels sont les horaires du petit-déjeuner ?', a: 'Tous les jours au restaurant Falaj de 06h30 à 11h00.' },
        { q: 'Comment demander un départ tardif ?', a: 'Utilisez l\'onglet Services et sélectionnez "Départ tardif".' },
        { q: 'Quels sont les horaires de la piscine ?', a: 'La piscine Al Waha est ouverte de 07h00 à 20h00.' }
    ],
    ar: [
        { q: 'ما هي كلمة مرور الواي فاي؟', a: 'اتصل بشبكة "Remal_Guest" - بدون كلمة مرور.' },
        { q: 'ما هي مواعيد الإفطار؟', a: 'يومياً في مطعم الفلج من 06:30 صباحاً حتى 11:00.' },
        { q: 'كيف أطلب مغادرة متأخرة؟', a: 'استخدم تبويب الخدمات واختر "مغادرة متأخرة".' },
        { q: 'ما هي مواعيد المسبح؟', a: 'مسبح الواحة مفتوح من 07:00 صباحاً حتى 08:00 مساءً.' }
    ],
    hi: [
        { q: 'वाई-फाई पासवर्ड क्या है?', a: '"Remal_Guest" से कनेक्ट करें - कोई पासवर्ड नहीं।' },
        { q: 'नाश्ते का समय क्या है?', a: 'फलज रेस्तरां में रोजाना सुबह 06:30 से 11:00 बजे तक।' },
        { q: 'लेट चेक-आउट कैसे करें?', a: 'सेवाएं टैब में जाएं और "लेट चेक-आउट" चुनें।' },
        { q: 'पूल का समय क्या है?', a: 'अल वाहा पूल सुबह 07:00 से रात 08:00 बजे तक खुला है।' }
    ]
};

// ==================== SERVICES DATA ====================
const SERVICES_DATA = {
    table_reservation: {
        title: 'Table Reservation',
        subtitle: 'Book a table at our restaurants',
        icon: 'fa-calendar-check',
        fields: [
            { type: 'select', id: 'reservation_venue', label: 'Venue', options: ['Falaj Restaurant', 'Sarab Bar & Lounge', 'Al Waha Pool Cabana'] },
            { type: 'select', id: 'reservation_guests', label: 'Number of Guests', options: ['1 Person', '2 Persons', '3 Persons', '4 Persons', '5+ Persons'] },
            { type: 'date', id: 'reservation_date', label: 'Date' },
            { type: 'time', id: 'reservation_time', label: 'Preferred Time' }
        ]
    },
    wakeup_call: {
        title: 'Wake-up Call / Alarm Service',
        subtitle: 'Set your morning wake-up call',
        icon: 'fa-clock',
        fields: [{ type: 'time', id: 'wakeup_time', label: 'Alarm Time' }]
    },
    late_checkout: {
        title: 'Late Check-out / Extension',
        subtitle: 'Request extended departure time',
        icon: 'fa-hourglass-half',
        fields: [{ type: 'select', id: 'checkout_time', label: 'Requested Departure Time', options: ['13:00 PM', '14:00 PM', '15:00 PM', '16:00 PM (Max)'] }]
    },
    housekeeping: {
        title: 'Housekeeping / Room Cleaning',
        subtitle: 'Request room cleaning service',
        icon: 'fa-broom',
        fields: [
            { type: 'select', id: 'cleaning_type', label: 'Service Type', options: ['Full Cleaning', 'Towel Change Only', 'Bed Linen Change', 'Turndown Service'] },
            { type: 'select', id: 'cleaning_time', label: 'Preferred Time', options: ['Morning (8AM-12PM)', 'Afternoon (12PM-4PM)', 'Evening (4PM-8PM)'] }
        ]
    },
    front_desk: {
        title: 'Front Desk Inquiry',
        subtitle: 'General assistance & information',
        icon: 'fa-headset',
        fields: [{ type: 'select', id: 'inquiry_type', label: 'Inquiry Type', options: ['General Information', 'Billing Question', 'Complaint', 'Suggestion', 'Other'] }]
    },
    luggage: {
        title: 'Luggage Assistance',
        subtitle: 'Baggage handling & storage',
        icon: 'fa-suitcase',
        fields: [
            { type: 'select', id: 'luggage_type', label: 'Service Type', options: ['Collect from Room', 'Deliver to Room', 'Store Luggage', 'Transport to Lobby'] },
            { type: 'number', id: 'luggage_count', label: 'Number of Bags' }
        ]
    },
    maintenance: {
        title: 'Maintenance / Technical Support',
        subtitle: 'Repairs & technical assistance',
        icon: 'fa-tools',
        fields: [
            { type: 'select', id: 'maintenance_type', label: 'Issue Type', options: ['Air Conditioning', 'Plumbing', 'Electrical', 'TV / Internet', 'Lighting', 'Other'] },
            { type: 'select', id: 'maintenance_urgency', label: 'Urgency', options: ['Low', 'Medium', 'High'] }
        ]
    }
};
