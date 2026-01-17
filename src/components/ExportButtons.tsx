import React from 'react';
import jsPDF from 'jspdf';
import PptxGenJS from 'pptxgenjs';
import html2canvas from 'html2canvas';
import { CompanyData, InvoiceData, Totals } from '../type';
import { toast } from 'react-hot-toast';
import './ExportButtons.css';
interface ExportButtonsProps {
  companyData: CompanyData;
  invoiceData: InvoiceData;
  totals: Totals;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ companyData, invoiceData, totals }) => {
  // const exportToPDF = async () => {
  //   const loadingToast = toast.loading('Generating PDF...');
  //   try {
  //     const preview = document.getElementById('invoice-preview');

  //     if (!preview) {
  //       toast.error('Invoice preview not found!', { id: loadingToast });
  //       return;
  //     }

  //     const canvas = await html2canvas(preview, { scale: 2, useCORS: true });
  //     const imgData = canvas.toDataURL('image/png');

  //     const pdfWidth = 210; // A4 width in mm
  //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  //     const doc = new jsPDF('p', 'mm', 'a4');
  //     doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

  //     const fileName = invoiceData.invoiceNumber?.trim() 
  //       ? `invoice_${invoiceData.invoiceNumber}.pdf` 
  //       : 'invoice.pdf';
  //     doc.save(fileName);

  //     toast.success('PDF downloaded successfully!', { id: loadingToast });
  //   } catch (error) {
  //     console.error('PDF export error:', error);
  //     toast.error('Failed to export PDF. Please try again.', { id: loadingToast });
  //   }
  // };
  const exportToPDF = async () => {
    const loadingToast = toast.loading('Generating PDF...');
    try {
      const preview = document.getElementById('invoice-preview');
      console.log(preview);

      if (!preview) {
        toast.error('Invoice preview not found!', { id: loadingToast });
        return;
      }

      // Convert oklch and other modern CSS colors to standard formats
      const clonedPreview = preview.cloneNode(true) as HTMLElement;
      clonedPreview.style.position = 'absolute';
      clonedPreview.style.left = '-9999px';
      document.body.appendChild(clonedPreview);

      // Get all elements and normalize problematic CSS color/shadow values
      const allElements = clonedPreview.querySelectorAll('*');
      allElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const computedStyle = window.getComputedStyle(htmlElement);

        // color
        const color = computedStyle.getPropertyValue('color');
        if (color) {
          if (color.includes('oklch')) htmlElement.style.setProperty('color', '#000');
          else htmlElement.style.setProperty('color', color);
        }

        // background-color
        const bg = computedStyle.getPropertyValue('background-color');
        if (bg) {
          if (bg.includes('oklch')) htmlElement.style.setProperty('background-color', '#ffffff');
          else htmlElement.style.setProperty('background-color', bg);
        }

        // border colors
        ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'].forEach(bprop => {
          const bval = computedStyle.getPropertyValue(bprop);
          if (bval) {
            if (bval.includes('oklch')) htmlElement.style.setProperty(bprop, 'transparent');
            else htmlElement.style.setProperty(bprop, bval);
          }
        });

        // shadows can contain color functions too — remove to avoid parsing issues
        const boxShadow = computedStyle.getPropertyValue('box-shadow');
        if (boxShadow && boxShadow.includes('oklch')) htmlElement.style.setProperty('box-shadow', 'none');
        else if (boxShadow) htmlElement.style.setProperty('box-shadow', boxShadow);

        const textShadow = computedStyle.getPropertyValue('text-shadow');
        if (textShadow && textShadow.includes('oklch')) htmlElement.style.setProperty('text-shadow', 'none');
        else if (textShadow) htmlElement.style.setProperty('text-shadow', textShadow);
      });

      const canvas = await html2canvas(clonedPreview, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Remove cloned element
      document.body.removeChild(clonedPreview);

      const imgData = canvas.toDataURL('image/png');

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const doc = new jsPDF('p', 'mm', 'a4');
      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      const fileName = invoiceData.invoiceNumber?.trim()
        ? `invoice_${invoiceData.invoiceNumber}.pdf`
        : 'invoice.pdf';
      doc.save(fileName);

      toast.success('PDF downloaded successfully!', { id: loadingToast });
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF. Please try again.', { id: loadingToast });
    }
  };

  const exportToPPT = () => {
    const loadingToast = toast.loading('Generating PowerPoint...');
    try {
      const pptx = new PptxGenJS();
      const slide = pptx.addSlide();

      // Add company name as title
      slide.addText(`${companyData.name} Invoice`, {
        x: 1,
        y: 0.5,
        fontSize: 24,
        bold: true
      });

      // Add GST information
      slide.addText(`GST: ${companyData.gst}`, {
        x: 1,
        y: 1.5,
        fontSize: 14
      });

      // Create table with invoice items
      const rows: (string | number)[][] = [
        ['Description', 'Qty', 'Price', 'Tax', 'Amount']
      ];

      invoiceData.items.forEach(item => {
        const totalQty = Number(item.quantity) || 0;
        const price = Number(item.unitPrice) || 0;
        const tax = Number(item.taxRate) || 0;
        const amount = Number((totalQty * price) * (1 + tax / 100));
        rows.push([
          item.description,
          item.quantity,
          price.toFixed(2),
          `${tax}%`,
          amount.toFixed(2)
        ]);
      });

      slide.addTable(rows as never, {
        x: 1,
        y: 2,
        w: 8,
        colW: [2, 1, 1, 1, 2],
        fontSize: 12
      });

      // Add total
      slide.addText(
        `Total: ${totals.total} ${companyData.currency || ''}`,
        { x: 7, y: 5, fontSize: 14, bold: true }
      );

      // Add logo if available
      if (companyData.logo) {
        slide.addImage({
          data: companyData.logo.split(',')[1],
          x: 8,
          y: 0.5,
          w: 1,
          h: 1
        });
      }

      // Add signature if available
      if (companyData.signature) {
        slide.addImage({
          data: companyData.signature.split(',')[1],
          x: 7,
          y: 6,
          w: 1,
          h: 0.5
        });
      }

      // Add notes if available
      if (invoiceData.notes) {
        slide.addText(invoiceData.notes, {
          x: 1,
          y: 6,
          fontSize: 12
        });
      }

      const fileName = invoiceData.invoiceNumber?.trim()
        ? `invoice_${invoiceData.invoiceNumber}.pptx`
        : 'invoice.pptx';
      pptx.writeFile({ fileName });

      toast.success('PowerPoint downloaded successfully!', { id: loadingToast });
    } catch (error) {
      console.error('PPT export error:', error);
      toast.error('Failed to export PowerPoint. Please try again.', { id: loadingToast });
    }
  };

  return (
    <div className="flex gap-6">
      <button
        onClick={exportToPDF}
        className="bg-green-500 text-white px-4 py-2 hover:bg-green-600 font-medium rounded-xl"
      >
        Download PDF📃
      </button>
      <button
        onClick={exportToPPT}
        className="bg-purple-500 text-white px-4 py-2 hover:bg-purple-600 font-medium rounded-xl"
      >
        Download as PPT📃
      </button>
    </div>
  );
};

export default ExportButtons;
