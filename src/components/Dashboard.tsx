import React, { useEffect, useState } from 'react';
import { DollarSign, FileCheck, TrendingUp, Plus, Trash2 } from 'lucide-react';
import { InvoiceData } from '../type';
import './Dashboard.css';

interface DashboardProps {
  onCreateNew: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onCreateNew }) => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [companyName, setCompanyName] = useState('User');

  // Load data from Local Storage on mount
  useEffect(() => {
    const savedInvoices = localStorage.getItem('savedInvoices');
    const savedCompany = localStorage.getItem('companyData');
    
    if (savedInvoices) {
      const parsedInvoices: InvoiceData[] = JSON.parse(savedInvoices);
      setInvoices(parsedInvoices);
      
      // Calculate Total Revenue
      const total = parsedInvoices.reduce((acc, curr) => {
        // Calculate total for each invoice item
        const invoiceTotal = curr.items.reduce((sum, item) => {
            const qty = Number(item.quantity) || 0;
            const price = Number(item.unitPrice) || 0;
            return sum + (qty * price);
        }, 0);
        return acc + invoiceTotal;
      }, 0);
      setTotalRevenue(total);
    }

    if (savedCompany) {
      const parsed = JSON.parse(savedCompany);
      if (parsed.name) setCompanyName(parsed.name);
    }
  }, []);

  const deleteInvoice = (indexToDelete: number) => {
    const updatedInvoices = invoices.filter((_, index) => index !== indexToDelete);
    setInvoices(updatedInvoices);
    localStorage.setItem('savedInvoices', JSON.stringify(updatedInvoices));
    // Recalculate revenue simply by reloading page or simple math, 
    // but for simplicity we let React state update naturally or reload:
    window.location.reload(); 
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-subtitle">Welcome back, <b>{companyName}</b>! Here is your business overview.</p>
        </div>
        <button className="create-btn" onClick={onCreateNew}>
          <Plus size={18} />
          Create Invoice
        </button>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-green"><DollarSign size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">${totalRevenue.toFixed(2)}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-blue"><FileCheck size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Invoices Generated</span>
            <span className="stat-value">{invoices.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-purple"><TrendingUp size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Avg. Invoice Value</span>
            <span className="stat-value">
              ${invoices.length > 0 ? (totalRevenue / invoices.length).toFixed(2) : '0.00'}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="recent-section">
        <h2 className="section-title">Recent Invoices</h2>
        {invoices.length === 0 ? (
          <div className="empty-state">
             <p>No invoices found. Create one to get started!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Invoice No.</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, idx) => {
                   const invTotal = inv.items.reduce((s, i) => s + (Number(i.quantity)*Number(i.unitPrice)), 0);
                   return (
                    <tr key={idx}>
                      <td className="font-medium">{inv.invoiceNumber || '-'}</td>
                      <td>{inv.clientName || 'Unknown'}</td>
                      <td>{inv.issueDate}</td>
                      <td>${invTotal.toFixed(2)}</td>
                      <td>
                        <button 
                          onClick={() => deleteInvoice(idx)} 
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                   );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;