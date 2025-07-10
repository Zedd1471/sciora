import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

export async function addWatermarkAndDownload(url: string, filename: string) {
  try {
    // Fetch the PDF
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());

    // Load the PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();

    // Add watermark and footer to each page
    for (const page of pages) {
      const { width, height } = page.getSize();

      // Watermark
      page.drawText('Property of Sciora', {
        x: width / 2 - 150,
        y: height / 2 + 50,
        size: 60,
        font,
        color: rgb(0.75, 0.75, 0.75),
        opacity: 0.2,
        rotate: degrees(-45),
      });

      // Footer
      page.drawText('sciora.name.ng', {
        x: width / 2 - 50,
        y: 30,
        size: 10,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    // Save the modified PDF
    const pdfBytes = await pdfDoc.save();

    // Trigger download
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    console.error('Failed to add watermark and download PDF:', error);
    // Fallback to direct download if watermarking fails
    window.open(url, '_blank');
  }
}
