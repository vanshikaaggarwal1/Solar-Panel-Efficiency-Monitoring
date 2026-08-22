import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sun,
  Moon,
  Search,
  Bell,
  LogOut,
  User,
  ShieldCheck,
  Calendar,
  Grid,
  BarChart3,
  AlertTriangle,
  Wrench,
  FileText,
  Settings,
  LayoutDashboard
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const hideNavbar =
    location.pathname === '/login' ||
    location.pathname === '/register';

  const isDashboardPage =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/monitoring') ||
    location.pathname.startsWith('/analytics') ||
    location.pathname.startsWith('/alerts') ||
    location.pathname.startsWith('/maintenance') ||
    location.pathname.startsWith('/reports') ||
    location.pathname.startsWith('/profile');

  const navigate = useNavigate();

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

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Panels', path: '/monitoring', icon: Grid },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Alerts', path: '/alerts', icon: AlertTriangle, badge: 3 },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/profile', icon: Settings },
  ];

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
    <header className="sticky top-0 z-40 w-full bg-[#F2F0E9] dark:bg-[#132F29] border-b border-borderNeutral dark:border-[#1E5B4C]/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Left Welcome / Brand Header */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-forest-500 text-white flex items-center justify-center font-bold text-xs shadow-subtle">
              <Sun className="w-4 h-4 text-sand-400" />
            </div>
            <span className="font-bold text-base tracking-tight text-primaryText dark:text-white">
              SOLARIX
            </span>
          </Link>

          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-2 text-xs text-secondaryText border-l border-borderNeutral dark:border-[#1E5B4C]/40 pl-4">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentDate}</span>
            </div>
          )}
        </div>

        {/* Center Search Input */}
        {/* {isAuthenticated && (
          <div className="hidden lg:flex items-center relative w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
            <input
              type="text"
              placeholder="Search panels, telemetry, alerts..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
            />
          </div>
        )} */}
        {!isDashboardPage && (
          <nav className="hidden lg:flex items-center">
            <ul className="flex items-center gap-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.path}
                    className="
            relative px-3 py-2
            text-sm font-medium
            text-secondaryText
            hover:text-primaryText
            dark:text-gray-300
            dark:hover:text-white
            rounded-lg
            transition-all duration-200
            group
          ">{item.name}
                    {/* Animated underline */}
                    <span
                      className="
              absolute
              left-3 right-3 bottom-0
              h-[2px]
              bg-forest-500
              rounded-full
              scale-x-0
              group-hover:scale-x-100
              transition-transform duration-200
              origin-center
            "
                    />

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
            className="p-2 rounded-xl text-secondaryText hover:text-primaryText hover:bg-warmBg dark:hover:bg-[#17473B] transition-colors"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-sand-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <Link
                to="/alerts"
                className="p-2 rounded-xl text-secondaryText hover:text-primaryText hover:bg-warmBg dark:hover:bg-[#17473B] transition-colors relative"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-copper-500"></span>
              </Link>

              {/* User Avatar */}
              <div className="flex items-center gap-3 border-l border-borderNeutral dark:border-[#1E5B4C]/40 pl-3">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="w-7 h-7 rounded-full bg-forest-500 text-white flex items-center justify-center text-xs font-bold shadow-subtle group-hover:bg-forest-600 transition-colors">
                    {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AV'}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-primaryText dark:text-white leading-tight">{user?.name}</span>
                    <span className="text-[10px] text-secondaryText font-medium">{user?.role || 'Operator'}</span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-secondaryText hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-xs font-medium text-secondaryText hover:text-primaryText">Sign In</Link>
              <Link to="/register" className="px-4 py-2 rounded-xl bg-forest-500 hover:bg-forest-600 text-white text-xs font-semibold shadow-subtle transition-colors">
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
