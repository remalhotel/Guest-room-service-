// ==================== STAFF ANALYTICS ====================
function setAnalyticsPeriod(period) {
    analyticsPeriod = period;
    
    ['today', 'week', 'month', 'all'].forEach(p => {
        const btn = document.getElementById(`period${p.charAt(0).toUpperCase() + p.slice(1)}`);
        if (btn) {
            if (p === period) {
                btn.className = 'px-4 py-2 rounded-xl bg-[var(--text-gold)] text-stone-950 text-xs font-bold whitespace-nowrap';
            } else {
                btn.className = 'px-4 py-2 rounded-xl remal-card text-muted-custom text-xs font-bold whitespace-nowrap';
            }
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
    const filteredRequests = getFilteredByPeriod(allRequests);
    const foodOrdersFiltered = filteredRequests.filter(r => r.requestType === 'food');
    const totalRevenue = foodOrdersFiltered.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);
    const completedRequests = filteredRequests.filter(r => r.status === 'Completed' || r.status === 'Delivered');
    const resolutionRate = filteredRequests.length > 0 ? Math.round((completedRequests.length / filteredRequests.length) * 100) : 0;
    
    const elTotal = document.getElementById('analyticsTotalOrders');
    const elRev = document.getElementById('analyticsTotalRevenue');
    const elRate = document.getElementById('analyticsResolutionRate');
    const elAvg = document.getElementById('analyticsAvgTime');
    
    if (elTotal) elTotal.innerText = filteredRequests.length;
    if (elRev) elRev.innerText = 'AED ' + totalRevenue.toFixed(2);
    if (elRate) elRate.innerText = resolutionRate + '%';
    
    let totalTime = 0;
    let timeCount = 0;
    completedRequests.forEach(r => {
        if (r.created_at && r.updated_at) {
            const diff = (new Date(r.updated_at) - new Date(r.created_at)) / 60000;
            if (diff > 0) {
                totalTime += diff;
                timeCount++;
            }
        }
    });
    const avgTime = timeCount > 0 ? Math.round(totalTime / timeCount) : 0;
    if (elAvg) elAvg.innerText = avgTime + ' min';
    
    renderHourlyChart(filteredRequests);
    renderServiceChart(filteredRequests);
    renderStatusChart(filteredRequests);
}

function renderHourlyChart(requests) {
    const hourCounts = Array(24).fill(0);
    requests.forEach(r => {
        if (r.created_at) {
            const hour = new Date(r.created_at).getHours();
            if (hour >= 0 && hour < 24) hourCounts[hour]++;
        }
    });
    
    const canvas = document.getElementById('chartOrdersByHour');
    if (!canvas) return;
    
    if (analyticsCharts.hourly) analyticsCharts.hourly.destroy();
    
    analyticsCharts.hourly = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: Array.from({ length: 24 }, (_, i) => i + 'h'),
            datasets: [{
                label: 'Orders',
                data: hourCounts,
                backgroundColor: '#DCA773',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } }
            }
        }
    });
}

function renderServiceChart(requests) {
    const serviceCounts = {};
    requests.forEach(r => {
        const key = r.serviceLabel || 'Other';
        serviceCounts[key] = (serviceCounts[key] || 0) + 1;
    });
    
    const canvas = document.getElementById('chartServiceBreakdown');
    if (!canvas) return;
    
    if (analyticsCharts.service) analyticsCharts.service.destroy();
    
    analyticsCharts.service = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: Object.keys(serviceCounts),
            datasets: [{
                data: Object.values(serviceCounts),
                backgroundColor: ['#DCA773', '#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { font: { size: 8 } }
                }
            }
        }
    });
}

function renderStatusChart(requests) {
    const statusCounts = { 'Pending': 0, 'In Progress': 0, 'Completed': 0 };
    
    requests.forEach(r => {
        const s = r.status || 'Pending';
        if (s === 'Pending') statusCounts['Pending']++;
        else if (s === 'Preparing' || s === 'Ready' || s === 'In Progress') statusCounts['In Progress']++;
        else if (s === 'Completed' || s === 'Delivered') statusCounts['Completed']++;
    });
    
    const canvas = document.getElementById('chartStatusBreakdown');
    if (!canvas) return;
    
    if (analyticsCharts.status) analyticsCharts.status.destroy();
    
    analyticsCharts.status = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: ['Pending', 'In Progress', 'Completed'],
            datasets: [{
                data: [statusCounts['Pending'], statusCounts['In Progress'], statusCounts['Completed']],
                backgroundColor: ['#f59e0b', '#3b82f6', '#10b981'],
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } }
            }
        }
    });
}
