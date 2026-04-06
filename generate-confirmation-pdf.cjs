const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');

async function generateConfirmationPDF(reservation) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([400, 600]);
  const { width, height } = page.getSize();
  
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  // Colors
  const gold = rgb(0.831, 0.659, 0.325);    // #d4a853
  const dark = rgb(0.102, 0.102, 0.102);     // #1a1a1a
  const teal = rgb(0.251, 0.710, 0.678);     // #40B5AD
  const white = rgb(1, 1, 1);
  const lightGold = rgb(0.95, 0.90, 0.78);

  // Background
  page.drawRectangle({ x: 0, y: 0, width, height, color: dark });

  // Header bar
  page.drawRectangle({ x: 0, y: height - 90, width, height: 90, color: teal });
  
  // Restaurant name
  page.drawText('CAMARÓN YANKEE', {
    x: 60, y: height - 45, size: 24, font: fontBold, color: white
  });
  page.drawText('Mariscos frescos frente al mar', {
    x: 82, y: height - 65, size: 10, font: fontRegular, color: rgb(1, 1, 1, 0.8)
  });
  page.drawText('Acapulco, Guerrero', {
    x: 120, y: height - 80, size: 8, font: fontRegular, color: rgb(1, 1, 1, 0.7)
  });

  // Confirmation title
  const checkY = height - 130;
  page.drawText('Reservacion Confirmada', {
    x: 70, y: checkY, size: 20, font: fontBold, color: gold
  });

  // Divider line
  page.drawRectangle({ x: 40, y: checkY - 15, width: width - 80, height: 2, color: gold });

  // Reservation details card
  const cardY = checkY - 40;
  const cardH = 220;
  page.drawRectangle({
    x: 30, y: cardY - cardH, width: width - 60, height: cardH,
    color: rgb(0.15, 0.15, 0.15), borderColor: gold, borderWidth: 1
  });

  const labels = [
    { label: 'Cliente:', value: reservation.name },
    { label: 'Fecha:', value: reservation.date },
    { label: 'Hora:', value: reservation.time },
    { label: 'Personas:', value: String(reservation.guests) },
    { label: 'Zona:', value: reservation.area === 'playa' ? 'Playa - Frente al mar' : 'Comedor - Interior con A/C' },
    { label: 'Mesa:', value: reservation.table_id || 'Asignada al llegar' },
    { label: 'Notas:', value: reservation.notes || '-' },
  ];

  let y = cardY - 25;
  for (const item of labels) {
    page.drawText(item.label, {
      x: 50, y, size: 11, font: fontBold, color: gold
    });
    page.drawText(item.value, {
      x: 140, y, size: 11, font: fontRegular, color: white
    });
    y -= 28;
  }

  // QR placeholder / ID
  const idY = cardY - cardH - 30;
  page.drawText(`Reservacion #${reservation.id}`, {
    x: 130, y: idY, size: 12, font: fontBold, color: gold
  });

  // Instructions
  const instrY = idY - 30;
  page.drawRectangle({
    x: 30, y: instrY - 60, width: width - 60, height: 60,
    color: rgb(0.12, 0.12, 0.12)
  });
  page.drawText('Muestra este comprobante al llegar al restaurante.', {
    x: 50, y: instrY - 22, size: 9, font: fontRegular, color: lightGold
  });
  page.drawText('Para cancelar o modificar, contactanos.', {
    x: 48, y: instrY - 38, size: 9, font: fontRegular, color: lightGold
  });
  page.drawText('Tel: 744-XXX-XXXX  |  camaron-yankee.vercel.app', {
    x: 58, y: instrY - 52, size: 8, font: fontRegular, color: rgb(0.5, 0.5, 0.5)
  });

  // Footer
  page.drawText('Powered by VULKN', {
    x: 150, y: 15, size: 7, font: fontRegular, color: rgb(0.3, 0.3, 0.3)
  });

  const pdfBytes = await doc.save();
  return pdfBytes;
}

// Run with reservation data
const reservation = JSON.parse(process.argv[2]);
generateConfirmationPDF(reservation).then(bytes => {
  const filename = `reservacion_${reservation.id}_${reservation.name.replace(/\s+/g, '_')}.pdf`;
  fs.writeFileSync(filename, bytes);
  console.log(filename);
});
