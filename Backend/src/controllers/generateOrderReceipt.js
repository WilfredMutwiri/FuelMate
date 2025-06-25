const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

async function generateOrderReceiptPdf(orderData, customerData, stationData) {
  function isEmergencyOrder(order) {
    return !!order.clientLocation && !!order.clientName;
  }

  function generateReceiptNumber(orderId) {
    const shortId = orderId.toString().slice(-6).toUpperCase();
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `FM-${datePart}-${shortId}`;
  }

  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    try {
      // Fallbacks
      const amount = orderData?.amount ?? 0;
      const fuelType = orderData?.fuelType || 'N/A';
      const fuelVolume = orderData?.fuelVolume || 'N/A';

      const receiptNumber = generateReceiptNumber(orderData._id);
      const receiptDate = new Date().toLocaleDateString('en-GB');
      const orderDate = orderData?.createdAt
        ? new Date(orderData.createdAt).toLocaleDateString('en-GB')
        : 'N/A';

      // Add logo if it exists
      const logoPath = path.join(__dirname, '..', 'assets', 'logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, doc.page.width / 2 - 40, 40, { width: 80 });
        doc.moveDown(4);
      }

      // Header
      doc.fontSize(18).fillColor('#0D47A1').font('Helvetica-Bold')
        .text('FUELMATE DELIVERY RECEIPT', { align: 'center' });

      doc.fontSize(10).fillColor('#333').font('Helvetica')
        .text('Your Fuel, Delivered Anywhere, Anytime', { align: 'center' })
        .text('P.O. Box 12345 - 00100, Nairobi, Kenya', { align: 'center' })
        .text('Email: info@fuelmate.co.ke | Phone: +254 745 567 568', { align: 'center' })
        .text('www.fuelmate.co.ke', { align: 'center' });

      doc.moveDown(1);
      doc.rect(50, doc.y, doc.page.width - 100, 1).fill('#1B5E20');
      doc.moveDown(1.2);

      // Receipt Title
      doc.fontSize(15).fillColor('#000').font('Helvetica-Bold')
        .text(isEmergencyOrder(orderData) ? 'EMERGENCY FUEL ORDER RECEIPT' : 'ORDER RECEIPT', { align: 'center' });

      doc.moveDown(1);

      // Receipt Metadata
      doc.fontSize(10).font('Helvetica')
        .text(`Receipt No: ${receiptNumber}`, 50)
        .text(`Receipt Date: ${receiptDate}`, 50)
        .text(`Order Date: ${orderDate}`, 50)
        .text(`Order ID: ${orderData._id}`, 50)
        .text(`Status: ${orderData.status || 'N/A'}`, 50);

      doc.moveDown(1.2);

      // Customer & Station Info
      doc.fontSize(11).font('Helvetica-Bold')
        .text('Customer & Station Info:', 50, doc.y, { underline: true });

      doc.fontSize(10).font('Helvetica')
        .text(`Customer Name: ${isEmergencyOrder(orderData) ? orderData.clientName : customerData?.username || 'N/A'}`)
        .text(`Phone Number: ${isEmergencyOrder(orderData) ? orderData.clientPhone : orderData.clientPhoneNo || 'N/A'}`)
        .text(`Delivery Location: ${isEmergencyOrder(orderData) ? orderData.readableLocation : orderData.location || 'N/A'}`)
        .text(`Assigned Station: ${stationData?.stationName || 'N/A'}`)
        .text(`Payment Method: Mobile Money (via Paystack)`);

      doc.moveDown(1.5);

      // Order Summary Table
      doc.fontSize(11).font('Helvetica-Bold').text('Order Summary:', { underline: true });
      doc.moveDown(0.5);

      const tableTop = doc.y;
      const col1 = 50, col2 = 230, col3 = 400;

      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Fuel Type', col1, tableTop)
        .text('Volume (Litres)', col2, tableTop)
        .text('Amount (KES)', col3, tableTop);

      doc.moveTo(col1, tableTop + 15).lineTo(545, tableTop + 15).stroke('#ccc');

      let rowY = tableTop + 25;
      doc.font('Helvetica').fontSize(10)
        .text(fuelType, col1, rowY)
        .text(fuelVolume.toString(), col2, rowY)
        .text(amount.toLocaleString('en-KE'), col3, rowY, { align: 'right' });

      rowY += 20;
      doc.moveTo(col1, rowY).lineTo(545, rowY).stroke('#ccc');

      doc.font('Helvetica-Bold')
        .text(`Total Amount: KES ${amount.toLocaleString('en-KE')}`, 50, rowY + 10, { align: 'right' });

      doc.moveDown(2.5);

      // QR Code (left) + Footer Notes (right)
      const qrText = `https://fuelmate.co.ke/verify/receipt/${orderData._id}`;
      try {
        const qrDataUrl = await QRCode.toDataURL(qrText);
        doc.image(qrDataUrl, 50, doc.y, { width: 80 });
      } catch (e) {
        console.warn("QR code generation failed:", e.message);
      }

      // Footer Notes
      const noteY = doc.y + 5;
      doc.fontSize(9).font('Helvetica-Oblique').fillColor('#666')
        .text(
          'Note: This receipt is computer-generated and does not require a physical signature.\nAll fuel orders are subject to FuelMate\'s terms and conditions.',
          150,
          noteY,
          {
            width: doc.page.width - 200,
            align: 'left',
          }
        );

      doc.end();
    } catch (err) {
      doc.end();
      reject(err);
    }
  });
}

module.exports = { generateOrderReceiptPdf };
