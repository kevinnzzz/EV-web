import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Gauge, 
  ArrowLeft, 
  Menu, 
  X, 
  Zap
} from 'lucide-react';
import { getHealth } from '../services/api';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking' | 'online' | 'offline'
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    async function checkApi() {
      try {
        await getHealth();
        if (isMounted) setApiStatus('online');
      } catch {
        if (isMounted) setApiStatus('offline');
      }
    }
    checkApi();
    return () => { isMounted = false; };
  }, [location.pathname]);

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Eksplorasi data & evaluasi model'
    },
    {
      to: '/prediksi',
      label: 'Prediksi',
      icon: Gauge,
      description: 'Uji model XGBoost & CatBoost'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col md:flex-row text-[#202522]">
      {/* Mobile Header Bar */}
      <header className="md:hidden flex items-center justify-between px-5 py-4 bg-[#FFFFFF] border-b border-[#E5E3DE] sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#26352F] flex items-center justify-center text-white">
            <Zap className="w-4 h-4" />
          </div>
          <span className="font-semibold text-base tracking-tight text-[#202522]">EV Predictor</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-[#202522] hover:bg-[#F6F5F2] btn-press"
          aria-label="Buka menu navigasi"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Backdrop for Mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar for Desktop & Mobile Drawer */}
      <aside 
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-[#FFFFFF] border-r border-[#E5E3DE] flex flex-col transition-transform duration-250 ease-out md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand identity */}
        <div className="p-6 border-b border-[#E5E3DE]">
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-9 h-9 rounded-xl bg-[#26352F] flex items-center justify-center text-white shadow-xs group-hover:bg-[#35483F] transition-colors">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-base tracking-tight text-[#202522]">EV Predictor</div>
              <div className="text-xs text-[#6B6E6A]">Sistem Analisis EV</div>
            </div>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-[#6B6E6A]">
            Menu Aplikasi
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-start gap-3 px-3.5 py-3 rounded-xl transition-all btn-press ${
                    isActive
                      ? 'bg-[#26352F] text-white shadow-xs'
                      : 'text-[#202522] hover:bg-[#F6F5F2] hover:text-[#202522]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${isActive ? 'text-white' : 'text-[#6B6E6A]'}`} />
                    <div>
                      <div className="font-medium text-sm leading-tight">{item.label}</div>
                      <div className={`text-xs mt-0.5 ${isActive ? 'text-[#EBEAE6]' : 'text-[#6B6E6A]'}`}>
                        {item.description}
                      </div>
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#E5E3DE] space-y-3 bg-[#FFFFFF]">
          {/* API Status Indicator */}
          <div className="px-3 py-2 rounded-lg bg-[#F6F5F2] flex items-center justify-between text-xs">
            <span className="text-[#6B6E6A]">API Backend</span>
            <div className="flex items-center gap-1.5">
              {apiStatus === 'online' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#397454] animate-pulse"></span>
                  <span className="text-[#397454] font-medium">Terhubung</span>
                </>
              ) : apiStatus === 'checking' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#A97936]"></span>
                  <span className="text-[#A97936] font-medium">Memeriksa</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#B94A42]"></span>
                  <span className="text-[#6B6E6A] font-medium">Offline</span>
                </>
              )}
            </div>
          </div>

          {/* Return to Landing Page */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#6B6E6A] hover:text-[#202522] hover:bg-[#F6F5F2] rounded-lg transition-colors btn-press w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 min-w-0 bg-[#FFFFFF] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
