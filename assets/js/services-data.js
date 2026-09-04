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
