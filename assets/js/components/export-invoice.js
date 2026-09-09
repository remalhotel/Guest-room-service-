// ==================== EXPORT INVOICE ====================
// Export PDF des factures pour les commandes
// N'affecte AUCUNE fonctionnalité existante

(function() {
    'use strict';
    
    console.log('📄 Export Invoice activé');
    
    function exportInvoiceToPDF(order) {
        if (!order) return;
        
        // Vérifier si jsPDF est disponible
        if (typeof window.jspdf === 'undefined') {
            // Charger jsPDF dynamiquement
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => generatePDF(order);
            document.head.appendChild(script);
        } else {
            generatePDF(order);
        }
    }
    
    function generatePDF(order) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        // ==================== EN-TÊTE ====================
        // Fond doré
        doc.setFillColor(220, 167, 115);
        doc.rect(0, 0, pageWidth, 40, 'F');
        
        // Titre
        doc.setFontSize(22);
        doc.setTextColor(0, 0, 0);
        doc.setFont('times', 'bold');
        doc.text('REMAL HOTEL & VILLAS', pageWidth / 2, 20, { align: 'center' });
        
        doc.setFontSize(9);
        doc.setFont('times', 'normal');
        doc.text('Al Dhannah City - Abu Dhabi - UAE', pageWidth / 2, 28, { align: 'center' });
        
        doc.setFontSize(8);
        doc.text('www.remalhotel.com', pageWidth / 2, 34, { align: 'center' });
        
        // ==================== TITRE FACTURE ====================
        doc.setFontSize(14);
        doc.setTextColor(220, 167, 115);
        doc.setFont('times', 'bold');
        doc.text('INVOICE', pageWidth / 2, 52, { align: 'center' });
        
        doc.setDrawColor(220, 167, 115);
        doc.line(20, 56, pageWidth - 20, 56);
        
        // ==================== INFORMATIONS COMMANDE ====================
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont('times', 'normal');
        
        const startY = 66;
        
        doc.text(`Invoice Number: #${String(order.id || 'N/A').slice(-6).toUpperCase()}`, 20, startY);
        doc.text(`Date: ${new Date(order.created_at || Date.now()).toLocaleDateString('en-GB')}`, 20, startY + 7);
        doc.text(`Time: ${new Date(order.created_at || Date.now()).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`, 20, startY + 14);
        
        doc.text(`Room: ${order.room_number || 'N/A'}`, pageWidth - 20, startY, { align: 'right' });
        doc.text(`Guest: ${order.guest_name || 'Guest'}`, pageWidth - 20, startY + 7, { align: 'right' });
        doc.text(`Status: ${order.status || 'Pending'}`, pageWidth - 20, startY + 14, { align: 'right' });
        
        doc.line(20, startY + 22, pageWidth - 20, startY + 22);
        
        // ==================== TABLEAU DES ARTICLES ====================
        let y = startY + 34;
        
        // En-tête du tableau
        doc.setFillColor(28, 25, 23);
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('times', 'bold');
        doc.rect(20, y - 6, pageWidth - 40, 10, 'F');
        doc.text('Item', 25, y);
        doc.text('Qty', pageWidth / 2, y, { align: 'center' });
        doc.text('Unit Price', pageWidth - 60, y, { align: 'right' });
        doc.text('Total', pageWidth - 25, y, { align: 'right' });
        
        y += 12;
        
        // Lignes des articles
        doc.setTextColor(0, 0, 0);
        doc.setFont('times', 'normal');
        doc.setFontSize(9);
        
        const items = Array.isArray(order.items) ? order.items : [];
        
        if (items.length === 0) {
            doc.text('No items', 25, y);
            y += 8;
        } else {
            items.forEach(item => {
                const qty = item.quantity || item.qty || 1;
                const price = item.price || item.unit_price || 0;
                const total = item.total || item.total_price || (price * qty);
                
                doc.text(String(item.name || 'Item'), 25, y);
                doc.text(String(qty), pageWidth / 2, y, { align: 'center' });
                doc.text(`${price.toFixed(2)} AED`, pageWidth - 60, y, { align: 'right' });
                doc.text(`${total.toFixed(2)} AED`, pageWidth - 25, y, { align: 'right' });
                
                y += 8;
            });
        }
        
        // ==================== TOTAL ====================
        y += 5;
        doc.setDrawColor(220, 167, 115);
        doc.line(20, y, pageWidth - 20, y);
        y += 10;
        
        const subtotal = order.subtotal || order.total_amount || 0;
        const vat = order.vat || (subtotal * 0.05);
        const grandTotal = order.grand_total || order.total_amount || (subtotal + vat);
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Subtotal:`, pageWidth - 80, y);
        doc.text(`${subtotal.toFixed(2)} AED`, pageWidth - 25, y, { align: 'right' });
        y += 7;
        
        doc.text(`VAT (5%):`, pageWidth - 80, y);
        doc.text(`${vat.toFixed(2)} AED`, pageWidth - 25, y, { align: 'right' });
        y += 10;
        
        // Total en or
        doc.setFontSize(14);
        doc.setTextColor(220, 167, 115);
        doc.setFont('times', 'bold');
        doc.text(`GRAND TOTAL:`, pageWidth - 80, y);
        doc.text(`${grandTotal.toFixed(2)} AED`, pageWidth - 25, y, { align: 'right' });
        
        // ==================== NOTES ====================
        if (order.special_instructions || order.special_notes || order.note) {
            y += 15;
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.setFont('times', 'italic');
            doc.text('Notes: ' + (order.special_instructions || order.special_notes || order.note), 20, y);
        }
        
        // ==================== FOOTER ====================
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.setFont('times', 'normal');
        doc.text('Thank you for choosing Remal Hotel & Villas', pageWidth / 2, pageHeight - 20, { align: 'center' });
        doc.text('This is a computer generated invoice', pageWidth / 2, pageHeight - 15, { align: 'center' });
        
        // ==================== SAUVEGARDER ====================
        const fileName = `Remal_Invoice_${String(order.id || Date.now()).slice(-6).toUpperCase()}.pdf`;
        doc.save(fileName);
        
        console.log('✅ Facture PDF générée:', fileName);
    }
    
    // Exposer
    window.exportInvoiceToPDF = exportInvoiceToPDF;
    
})();
