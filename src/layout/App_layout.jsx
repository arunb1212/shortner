import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Link2,
  LogOut,
  Plus
} from 'lucide-react';

const App_layout = () => {
  const { user: authUser, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Pure UI showcase: bypass login restrictions completely
  const user = authUser || { id: 'demo-user', email: 'florence@untitledui.com' };

  const handleLogout = async () => {
    if (signOut) {
      await signOut();
    }
    navigate('/login');
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return ['Sisyphus Ventures', 'Dashboard'];
    if (path === '/create-link') return ['Sisyphus Ventures', 'Create link'];
    if (path === '/login') return ['Authentication'];

    const parts = path.split('/').filter(Boolean);
    return ['Sisyphus Ventures', ...parts.map(p => {
      if (p.toLowerCase() === 'create-link') return 'Create link';
      return p.charAt(0).toUpperCase() + p.slice(1);
    })];
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Create link', path: '/create-link', icon: Link2 },
  ];

  // Render the clean public layout for authentication views (e.g. login form screen)
  if (location.pathname === '/login') {
    return (
      <div className="min-h-screen bg-background flex flex-col antialiased">
        {/* Sleek Modern Header for Visitors */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-zinc-900">Trimmer</span>
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-semibold text-zinc-900 hover:text-zinc-600 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/login?tab=SignUp')}
                className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-all shadow-premium"
              >
                Get Started
              </button>
            </div>
          </div>
        </header>

        {/* Public Content Pane */}
        <main className="flex-1 w-full max-w-7xl mx-auto">
          <Outlet />
        </main>

        {/* Premium footer */}
        <footer className="py-8 bg-white border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Trimmer. Built with absolute love for premium design.
          </p>
        </footer>
      </div>
    );
  }

  // Render the modern top horizontal navigation dashboard layout
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col antialiased">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100 px-6 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-8">
          {/* Logo Brand Header */}
          <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight leading-none text-zinc-900">Trimmer</span>
              <span className="text-[10px] text-muted-foreground font-medium mt-0.5">v1.0</span>
            </div>
          </Link>

          {/* Vertical Divider */}
          <div className="h-6 w-px bg-zinc-200 hidden sm:block"></div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2">
            {menuItems.map((item, itemIdx) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
              return (
                <Link
                  key={itemIdx}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${isActive
                    ? 'bg-zinc-100 text-zinc-950 font-bold'
                    : 'text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950'
                    }`}
                >
                  <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-950' : 'text-zinc-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions Segment */}
        <div className="flex items-center gap-4">
          {/* Create Link quick action button */}
          {/* <Link
            to="/create-link"
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900 text-white rounded-lg text-xs font-bold hover:bg-zinc-800 transition-all shadow-premium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Link</span>
          </Link> */}

          {/* Log Out button - Absolutely NO photo, NO email, NO user name */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-1.5 border border-zinc-200 bg-white text-zinc-750 hover:bg-zinc-50 hover:text-zinc-950 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
            title="Sign Out of session"
          >
            <LogOut className="w-3.5 h-3.5 text-zinc-550" />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      {/* Page Body Container */}
      <main className="flex-1 p-6 sm:p-8 bg-[#f8f9fa] w-full">
        <div className="max-w-7xl mx-auto w-full">
          {/* Breadcrumb Navigation below Navbar */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 mb-6 tracking-wider uppercase">
            {getBreadcrumbs().map((crumb, index, arr) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="text-zinc-300">/</span>}
                <span className={index === arr.length - 1 ? 'text-zinc-650 font-extrabold' : ''}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>

          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default App_layout;