// ==================== STAFF PDF GENERATION ====================
function generateFoodOrderPDF(orderId) {
    const order = allRequests.find(r => r.id == orderId && r.requestType === 'food');
    if (!order) return;
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let y = margin;
    const items = Array.isArray(order.items) ? order.items : [];
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('REMAL HOTEL & VILLAS', pageWidth / 2, y, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Room Service Ticket', pageWidth / 2, y + 6, { align: 'center' });
    y += 14;
    
    doc.setFontSize(9);
    doc.text('Room: ' + (order.room_number || 'N/A'), margin, y);
    doc.text('Ticket #: ' + order.id, pageWidth - margin, y, { align: 'right' });
    y += 5;
    doc.text('Guest: ' + (order.guest_name || 'Guest'), margin, y);
    doc.text('Date: ' + new Date(order.created_at).toLocaleString(), pageWidth - margin, y, { align: 'right' });
    y += 8;
    
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('ITEMS', margin, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    
    items.forEach(item => {
        const itemTotal = item.total || (item.price * item.quantity) || 0;
        doc.text(`${item.quantity}x ${item.name}`, margin, y);
        doc.text(`AED ${itemTotal.toFixed(2)}`, pageWidth - margin, y, { align: 'right' });
        y += 5;
    });
    
    y += 3;
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 7;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('TOTAL: AED ' + (parseFloat(order.total_amount) || 0).toFixed(2), pageWidth - margin, y, { align: 'right' });
    
    doc.save(`Remal_Ticket_${order.room_number}_${order.id}.pdf`);
}

function printFoodOrderPDF(orderId) {
    const order = allRequests.find(r => r.id == orderId && r.requestType === 'food');
    if (!order) return;
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let y = margin;
    const items = Array.isArray(order.items) ? order.items : [];
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('REMAL HOTEL & VILLAS', pageWidth / 2, y, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Room Service Ticket', pageWidth / 2, y + 6, { align: 'center' });
    y += 14;
    
    doc.setFontSize(9);
    doc.text('Room: ' + (order.room_number || 'N/A'), margin, y);
    doc.text('Ticket #: ' + order.id, pageWidth - margin, y, { align: 'right' });
    y += 5;
    doc.text('Guest: ' + (order.guest_name || 'Guest'), margin, y);
    y += 8;
    
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('ITEMS', margin, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    
    items.forEach(item => {
        const itemTotal = item.total || (item.price * item.quantity) || 0;
        doc.text(`${item.quantity}x ${item.name}`, margin, y);
        doc.text(`AED ${itemTotal.toFixed(2)}`, pageWidth - margin, y, { align: 'right' });
        y += 5;
    });
    
    y += 3;
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 7;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('TOTAL: AED ' + (parseFloat(order.total_amount) || 0).toFixed(2), pageWidth - margin, y, { align: 'right' });
    
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
}

function exportAnalyticsCSV() {
    const filteredRequests = getFilteredByPeriod(allRequests);
    let csv = 'ID,Room,Guest,Service,Status,Date,Total\n';
    
    filteredRequests.forEach(r => {
        csv += `${r.id},${r.room_number},${r.guest_name},${r.serviceLabel},${r.status},${r.created_at},${r.total_amount || 0}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics_export.csv';
    a.click();
    URL.revokeObjectURL(url);
}

function exportAnalyticsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const filteredRequests = getFilteredByPeriod(allRequests);
    const totalRevenue = filteredRequests
        .filter(r => r.requestType === 'food')
        .reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);
    
    doc.setFontSize(16);
    doc.text('Remal Hotel & Villas - Analytics Report', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Period: ' + analyticsPeriod, 105, 30, { align: 'center' });
    doc.text('Generated: ' + new Date().toLocaleString(), 105, 36, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('Total Requests: ' + filteredRequests.length, 20, 50);
    doc.text('Total Revenue: AED ' + totalRevenue.toFixed(2), 20, 58);
    
    doc.save('analytics_report.pdf');
}
