import React from 'react';
import { Sidebar } from '../components/ui/sidebar';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />
      <main className="flex-1 ml-64 px-8 py-6">
        {children}
      </main>
    </div>
  );
};


export default DashboardLayout;
