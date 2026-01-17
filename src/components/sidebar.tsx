import React, { useEffect, useState } from 'react';
import { LayoutDashboard, FileText, User } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const [companyName, setCompanyName] = useState('My Company');

  // Load company name from local storage to show in the profile section
  useEffect(() => {
    const savedCompany = localStorage.getItem('companyData');
    if (savedCompany) {
      const parsed = JSON.parse(savedCompany);
      if (parsed.name) setCompanyName(parsed.name);
    }
  }, [activeTab]); // Refresh when tab changes

  return (
    <div className="app-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">T</div>
          <span className="logo-text">INVOICE GENRETOR</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => onTabChange('dashboard')}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'builder' ? 'active' : ''}`}
            onClick={() => onTabChange('builder')}
          >
            <FileText size={20} />
            <span>Invoice Builder</span>
          </button>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <p className="user-name">{companyName}</p>
            <p className="user-role">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
