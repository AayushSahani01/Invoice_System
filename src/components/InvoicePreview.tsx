import React from 'react';
import { CompanyData, InvoiceDetailed, Totals } from '../type';
import './InvoicePreview.css';

interface InvoicePreviewProps {
  companyData: CompanyData;
  invoiceData: InvoiceDetailed;
  totals: Totals;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ companyData, invoiceData, totals }) => {
  return (
    <div className="invoice-preview-container" id="invoice-preview">
      
      {/* Header Section */}
      <div className="invoice-header">
        <div className="header-info">
          <h2 className="company-name">{companyData.name || 'Company Name'}</h2>
          <p className="company-address">{companyData.address || 'Company Address'}</p>
          {companyData.gst && <p className="company-gst">GST: {companyData.gst}</p>}
        </div>
        
        {/* Logo Display */}
        {companyData.logo && (
          <div className="logo-wrapper">
             <img src={companyData.logo} alt="Company Logo" className="company-logo" />
          </div>
        )}
      </div>

      <hr className="divider" />

      {/* Bill To & Invoice Meta */}
      <div className="invoice-details-row">
        <div className="bill-to-section">
          <h3 className="bill-to-title">Bill To:</h3>
          <p className="client-name">{invoiceData.clientName || 'Client Name'}</p>
          <p className="client-address">{invoiceData.clientAddress || 'Client Address'}</p>
        </div>
        
        <div className="invoice-meta">
          <p className="invoice-meta-item">
             <span className="meta-label">Invoice No:</span> {invoiceData.invoiceNumber}
          </p>
          <p>
             <span className="meta-label">Date:</span> {invoiceData.issueDate}
          </p>
          {invoiceData.dueDate && (
             <p><span className="meta-label">Due Date:</span> {invoiceData.dueDate}</p>
          )}
        </div>
      </div>

      {/* Items Table */}
      <table className="invoice-table">
        <thead>
          <tr className="table-header-row">
            <th className="table-header description-col">Description</th>
            <th className="table-header text-center">Qty</th>
            <th className="table-header text-center">Price</th>
            <th className="table-header text-center">Tax %</th>
            <th className="table-header text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.items.length > 0 ? (
            invoiceData.items.map((item, idx) => (
              <tr key={idx}>
                <td className="table-cell">{item.description}</td>
                <td className="table-cell text-center">{item.quantity}</td>
                <td className="table-cell text-center">{item.unitPrice}</td>
                <td className="table-cell text-center">{item.taxRate}</td>
                <td className="table-cell text-right font-bold">
                  {(
                    Number(item.quantity || 0) * Number(item.unitPrice || 0) * (1 + Number(item.taxRate) / 100)
                  ).toFixed(2)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="table-cell text-center text-muted" style={{ padding: '2rem' }}>
                No items added yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Summary Section */}
      <div className="invoice-summary">
        <div className="summary-row">
           <span>Subtotal:</span>
           <span>{totals.subtotal}</span>
        </div>
        <div className="summary-row">
           <span>Tax:</span>
           <span>{totals.taxAmount}</span>
        </div>
        <div className="summary-row">
           <span>Discount:</span>
           <span>{totals.discount}</span>
        </div>
        <div className="summary-row summary-total">
           <span>Total:</span>
           <span>{totals.total}</span>
        </div>
      </div>

      {/* Signature & Footer */}
      <div className="invoice-footer-section">
        {companyData.signature && (
          <div className="signature-section">
            <p className="signature-title">Authorized Signature:</p>
            <img src={companyData.signature} alt="Signature" className="signature-img" />
          </div>
        )}

        {invoiceData.notes && (
          <div className="invoice-notes">
             <p>{invoiceData.notes}</p>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default InvoicePreview;
