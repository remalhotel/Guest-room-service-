// ==================== STAFF ANALYTICS ====================
function setAnalyticsPeriod(period) {
    analyticsPeriod = period;
    ['today', 'week', 'month', 'all'].forEach(p => {
        const btn = document.getElementById(`period${p.charAt(0).toUpperCase() + p.slice(1)}`);
        if (btn) {
            if (p === period) btn.className = 'px-4 py-2 rounded-xl bg-[var(--text-gold)] text-stone-950 text-xs font-bold';
            else btn.className = 'px-4 py-2 rounded-xl remal-card text-stone-400 text-xs font-bold';
        }
    });
    renderAnalytics();
}

function getFilteredByPeriod(requests) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = todayStart - (now.getDay() * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    
    return requests.filter(r => {
        const created = new Date(r.created_at).getTime();
        if (analyticsPeriod === 'today') return created >= todayStart;
        if (analyticsPeriod === 'week') return created >= weekStart;
        if (analyticsPeriod === 'month') return created >= monthStart;
        return true;
    });
}

function renderAnalytics() {
    const filtered = getFilteredByPeriod(allRequests);
    const foodOrdersFiltered = filtered.filter(r => r.requestType === 'food');
    const totalRevenue = foodOrdersFiltered.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);
    const completed = filtered.filter(r => r.status === 'Completed' || r.status === 'Delivered');
    const resolutionRate = filtered.length > 0 ? Math.round((completed.length / filtered.length) * 100) : 0;
    
    document.getElementById('analyticsTotalOrders').innerText = filtered.length;
    document.getElementById('analyticsTotalRevenue').innerText = 'AED ' + totalRevenue.toFixed(2);
    document.getElementById('analyticsResolutionRate').innerText = resolutionRate + '%';
    document.getElementById('analyticsAvgTime').innerText = '0 min';
    
    // Graphique par heure
    const hourCounts = Array(24).fill(0);
    filtered.forEach(r => { if (r.created_at) hourCounts[new Date(r.created_at).getHours()]++; });
    
    const canvasHour = document.getElementById('chartOrdersByHour');
    if (canvasHour) {
        if (analyticsCharts.hourly) analyticsCharts.hourly.destroy();
        analyticsCharts.hourly = new Chart(canvasHour, {
            type: 'bar',
            data: { labels: Array.from({length: 24}, (_, i) => i + 'h'), datasets: [{ data: hourCounts, backgroundColor: '#DCA773' }] },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
    }
    
    // Graphique par service
    const serviceCounts = {};
    filtered.forEach(r => { const key = r.serviceLabel || 'Other'; serviceCounts[key] = (serviceCounts[key] || 0) + 1; });
    
    const canvasService = document.getElementById('chartServiceBreakdown');
    if (canvasService) {
        if (analyticsCharts.service) analyticsCharts.service.destroy();
        analyticsCharts.service = new Chart(canvasService, {
            type: 'doughnut',
            data: { labels: Object.keys(serviceCounts), datasets: [{ data: Object.values(serviceCounts), backgroundColor: ['#DCA773', '#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6'] }] },
            options: { responsive: true }
        });
    }
    
    // Graphique par statut
    const statusCounts = { 'Pending': 0, 'In Progress': 0, 'Completed': 0 };
    filtered.forEach(r => {
        const s = r.status || 'Pending';
        if (s === 'Pending') statusCounts['Pending']++;
        else if (s === 'Preparing' || s === 'Ready' || s === 'In Progress') statusCounts['In Progress']++;
        else statusCounts['Completed']++;
    });
    
    const canvasStatus = document.getElementById('chartStatusBreakdown');
    if (canvasStatus) {
        if (analyticsCharts.status) analyticsCharts.status.destroy();
        analyticsCharts.status = new Chart(canvasStatus, {
            type: 'bar',
            data: { labels: ['Pending', 'In Progress', 'Completed'], datasets: [{ data: [statusCounts['Pending'], statusCounts['In Progress'], statusCounts['Completed']], backgroundColor: ['#f59e0b', '#3b82f6', '#10b981'] }] },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
    }
}

function exportAnalyticsCSV() {
    const filtered = getFilteredByPeriod(allRequests);
    let csv = 'ID,Room,Guest,Service,Status,Date,Total\n';
    filtered.forEach(r => { csv += `${r.id},${r.room_number},${r.guest_name},${r.serviceLabel},${r.status},${r.created_at},${r.total_amount || 0}\n`; });
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'analytics.csv';
    a.click();
}

function exportAnalyticsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Remal Hotel - Analytics Report', 105, 20, { align: 'center' });
    doc.text('Period: ' + analyticsPeriod, 105, 30, { align: 'center' });
    doc.save('analytics.pdf');
}

// PDF tickets
function generateFoodOrderPDF(orderId) {
    const order = allRequests.find(r => r.id == orderId);
    if (!order) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ format: 'a5' });
    doc.text('REMAL HOTEL & VILLAS', 74, 15, { align: 'center' });
    doc.text('Room: ' + order.room_number, 10, 25);
    doc.text('Total: AED ' + (order.total_amount || 0), 10, 32);
    doc.save(`Ticket_${order.id}.pdf`);
}

function printFoodOrderPDF(orderId) {
    generateFoodOrderPDF(orderId);
}

window.setAnalyticsPeriod = setAnalyticsPeriod;
window.renderAnalytics = renderAnalytics;
window.exportAnalyticsCSV = exportAnalyticsCSV;
window.exportAnalyticsPDF = exportAnalyticsPDF;
window.generateFoodOrderPDF = generateFoodOrderPDF;
window.printFoodOrderPDF = printFoodOrderPDF;
