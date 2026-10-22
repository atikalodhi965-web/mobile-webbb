import React, { useState } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { Menu, LogOut, Bell } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const { admin, isAdminAuthenticated, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F7F5F9] font-sans text-[#1F1B2E]">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-[280px] min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-[#1C0D2A]" />
            </button>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Admin Console</p>
              <p className="text-sm font-extrabold text-[#1C0D2A]">Device Repair & E-commerce</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="relative p-2 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-[#1C0D2A]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#b8370e]" />
            </button>

            <div className="hidden sm:flex flex-col items-end mr-1">
              <span className="text-sm font-extrabold text-[#1C0D2A]">{admin?.name}</span>
              <span className="text-[11px] font-medium text-gray-500">{admin?.email}</span>
            </div>

            <div className="w-9 h-9 rounded-full bg-[#b8370e] text-white flex items-center justify-center font-black text-sm">
              {(admin?.name || 'A').charAt(0)}
            </div>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1C0D2A] hover:bg-[#2B0A3D] text-white text-xs font-bold cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        <footer className="px-6 py-4 text-center text-xs font-medium text-gray-400 border-t border-gray-100 bg-white">
          SAMZ Admin Panel · Static demo ·{' '}
          <Link to="/" className="text-[#b8370e] hover:underline font-bold">
            Back to website
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
