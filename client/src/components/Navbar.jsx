import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sun,
  Moon,
  Bell,
  LogOut,
  Calendar
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';
  const isDashboardPage =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/monitoring') ||
    location.pathname.startsWith('/analytics') ||
    location.pathname.startsWith('/alerts') ||
    location.pathname.startsWith('/maintenance') ||
    location.pathname.startsWith('/reports') ||
    location.pathname.startsWith('/profile') ||
    location.pathname.startsWith('/users');

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: "Home", path: "#home" },
    { name: "How It Works", path: "#how-it-works" },
    { name: "Features", path: "#features" },
    { name: "Insights", path: "#insights" },
    { name: "About", path: "#about" },
  ];

  if (hideNavbar) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#121212] border-b border-[#E5E7EB] dark:border-[#283038] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Left Welcome / Brand Header */}
        <div className="flex items-center gap-6">
          <a href="/#home" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1B3D3D] dark:bg-[#D5E5F2] text-white dark:text-[#121212] flex items-center justify-center font-bold text-xs shadow-subtle">
              <Sun className="w-4 h-4" />
            </div>
            <span className="font-bold text-base tracking-tight text-[#111827] dark:text-white">
              SOLARIX
            </span>
          </a>

          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-2 text-xs text-[#6B7280] dark:text-slate-400 border-l border-[#E5E7EB] dark:border-[#283038] pl-4">
              <Calendar className="w-3.5 h-3.5" />
              <span>{currentDate}</span>
            </div>
          )}
        </div>

        {/* Center Nav Links for Landing Page */}
        {!isDashboardPage && (
          <nav className="hidden lg:flex items-center">
            <ul className="flex items-center gap-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.path}
                    className="relative px-3 py-2 text-xs font-medium text-[#6B7280] dark:text-slate-300 hover:text-[#111827] dark:hover:text-white rounded-lg transition-colors group"
                  >
                    {item.name}
                    <span className="absolute left-3 right-3 bottom-0 h-[2px] bg-[#1B3D3D] dark:bg-[#D5E5F2] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Right Actions & Profile */}
        <div className="flex items-center gap-3">

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[#6B7280] dark:text-slate-300 hover:text-[#111827] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#1E242B] transition-colors"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-[#D5E5F2]" /> : <Moon className="w-4 h-4 text-[#1B3D3D]" />}
          </button>

          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <Link
                to="/alerts"
                className="p-2 rounded-xl text-[#6B7280] dark:text-slate-300 hover:text-[#111827] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#1E242B] transition-colors relative"
                title="System Alerts"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1B3D3D] dark:bg-[#D5E5F2]"></span>
              </Link>

              {/* User Avatar */}
              <div className="flex items-center gap-3 border-l border-[#E5E7EB] dark:border-[#283038] pl-3">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="w-7 h-7 rounded-full bg-[#1B3D3D] dark:bg-[#D5E5F2] text-white dark:text-[#121212] flex items-center justify-center text-xs font-bold shadow-subtle transition-colors">
                    {user?.name ? user.name.substring(0, 2).toUpperCase() : 'SX'}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-[#111827] dark:text-white leading-tight">{user?.name}</span>
                    <span className="text-[10px] text-[#6B7280] dark:text-slate-400 font-medium">{user?.role || 'User'}</span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-[#6B7280] dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#1E242B] transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-xs font-medium text-[#6B7280] hover:text-[#111827] dark:text-slate-300 dark:hover:text-white">
                Sign In
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-xl bg-[#1B3D3D] dark:bg-[#D5E5F2] text-white dark:text-[#121212] text-xs font-semibold shadow-subtle transition-colors">
                Get Started
              </Link>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;
