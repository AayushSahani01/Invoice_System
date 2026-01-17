import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InvoiceBuilder from './components/InvoiceBuilder';
import './App.css'; // We need to create/update this file for the layout

const App: React.FC = () => {
  // State to track which page is currently active
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-layout">
      {/* 1. The Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      {/* 2. The Main Content Area */}
      <main className="main-content">
        
        {/* Render Dashboard if active */}
        {activeTab === 'dashboard' && (
          <Dashboard 
            onCreateNew={() => setActiveTab('builder')} 
          />
        )}

        {/* Render Invoice Builder if active */}
        {activeTab === 'builder' && (
          <InvoiceBuilder />
        )}

      </main>
    </div>
  );
};

export default App;
