import React, { useState, useEffect } from 'react';
import CompanyForm from './CompanyForm';
import InvoiceForm from './InvoiceForm';
import InvoicePreview from './InvoicePreview';
import ExportButtons from './ExportButtons';
import { CompanyData, InvoiceData, InvoiceDetailed, Totals } from '../type';
import './InvoiceBuilder.css';

const InvoiceBuilder: React.FC = () => {
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '', address: '', gst: '', logo: '', signature: ''
  });

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: '', 
    issueDate: new Date().toISOString().split('T')[0], 
    dueDate: '', 
    clientName: '', 
    clientAddress: '', 
    notes: '', 
    items: []
  } as any); 
  const [totals, setTotals] = useState<Totals>({
    subtotal: '0.00', taxAmount: '0.00', discount: '0.00', total: '0.00'
  });

  // Load from Local Storage on Mount
  useEffect(() => {
    const savedCompany = localStorage.getItem('companyData');
    if (savedCompany) setCompanyData(JSON.parse(savedCompany));
  }, []);

  // Save Company Data to Local Storage whenever it changes
  useEffect(() => {
    if(companyData.name) {
        localStorage.setItem('companyData', JSON.stringify(companyData));
    }
  }, [companyData]);

  // Save current Invoice to Local Storage (so Dashboard can see it)
  const saveInvoiceToDashboard = () => {
    const existingInvoices = localStorage.getItem('savedInvoices');
    let invoicesArray: InvoiceData[] = [];
    if (existingInvoices) {
        invoicesArray = JSON.parse(existingInvoices);
    }
    // Check if invoice number exists, if so update, else push
    const existingIndex = invoicesArray.findIndex(inv => inv.invoiceNumber === invoiceData.invoiceNumber);
    if (existingIndex >= 0) {
        invoicesArray[existingIndex] = invoiceData;
    } else {
        invoicesArray.push(invoiceData);
    }
    localStorage.setItem('savedInvoices', JSON.stringify(invoicesArray));
    alert("Invoice Saved to Dashboard!");
  };

  useEffect(() => {
    let sub = 0;
    let tax = 0;
    invoiceData.items.forEach(item => {
      const q = Number(item.quantity) || 0;
      const p = Number(item.unitPrice) || 0;
      const t = Number(item.taxRate) || 0;
      sub += q * p;
      tax += (q * p) * (t / 100);
    });
    setTotals({
      subtotal: sub.toFixed(2),
      taxAmount: tax.toFixed(2),
      discount: '0.00',
      total: (sub + tax).toFixed(2)
    });
  }, [invoiceData.items]);

  return (
    // FIX: Using height: 100% to fill the parent container completely
    <div className="tetrisly-container" style={{ height: '100%', width: '100%' }}>
      
      {/* LEFT PANEL */}
      <div className="panel-editor">
        <div className="editor-content">
          <header className="editor-header">
            <h1 className="brand-title">Invoice Generator</h1>
            <p className="brand-subtitle">Fill in the details. Changes are auto-saved to your local browser.</p>
          </header>

          <div className="form-stack">
            <section className="form-group">
              <h2 className="section-label">Company Information</h2>
              {/* FIX APPLIED HERE: Passing companyData prop */}
              <CompanyForm 
                companyData={companyData} 
                onChange={setCompanyData} 
              />
            </section>

            <div className="divider-line"></div>

            <section className="form-group">
              <h2 className="section-label">Invoice Details</h2>
              <InvoiceForm invoiceData={invoiceData} onChange={setInvoiceData} />
            </section>

            <div className="divider-line"></div>

            <section className="form-group">
              <h2 className="section-label">Actions</h2>
              {/* Added a Manual Save Button */}
              <button 
                onClick={saveInvoiceToDashboard}
                className="save-dash-btn"
                style={{ width: '100%', padding: '0.875rem', marginBottom: '1rem', background:'#10B981', color:'white', border:'none', borderRadius:'8px', fontWeight:600, cursor:'pointer' }}
              >
                Save to Dashboard
              </button>
              <ExportButtons companyData={companyData} invoiceData={invoiceData} totals={totals} />
            </section>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="panel-preview">
        <div className="preview-centering-wrapper">
          <div className="preview-card-frame">
             <div className="preview-card-header">
                <span className="preview-badge">Live Preview</span>
             </div>
             <InvoicePreview 
               companyData={companyData} 
               invoiceData={invoiceData as InvoiceDetailed} 
               totals={totals} 
             />
          </div>
        </div>
      </div>

    </div>
  );
};

export default InvoiceBuilder;