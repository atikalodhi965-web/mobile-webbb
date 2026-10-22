import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { X, ExternalLink } from 'lucide-react';
import { adminNavSections } from './adminNav';

const AdminSidebar = ({ open, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[280px] bg-[#b8370e] text-white flex flex-col shadow-xl transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/20 flex items-center justify-between shrink-0">
          <div>
            <p className="text-2xl font-black tracking-tight">SAMZ</p>
            <p className="text-xs font-semibold text-white/85 mt-0.5">Admin Panel</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-white/15 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 admin-sidebar-scroll">
          {adminNavSections.map((section) => (
            <div key={section.title}>
              <p className="px-3 mb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white/70">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                            isActive
                              ? 'bg-white text-[#b8370e] shadow-sm'
                              : 'text-white/95 hover:bg-white/15'
                          }`
                        }
                      >
                        <Icon className="w-4.5 h-4.5 shrink-0" strokeWidth={2.25} />
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer link */}
        <div className="p-4 border-t border-white/20 shrink-0">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full bg-[#1C0D2A] hover:bg-[#2B0A3D] text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Storefront
          </Link>
        </div>
      </aside>

      <style>{`
        .admin-sidebar-scroll::-webkit-scrollbar { width: 5px; }
        .admin-sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.35); border-radius: 4px; }
      `}</style>
    </>
  );
};

export default AdminSidebar;
