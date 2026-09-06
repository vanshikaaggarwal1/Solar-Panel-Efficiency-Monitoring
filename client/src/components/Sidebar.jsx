import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';
import {
  LayoutDashboard,
  Grid,
  BarChart3,
  AlertTriangle,
  Wrench,
  FileText,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { activeCount } = useAlerts() || { activeCount: 0 };

  const accountType = (user?.accountType || 'personal').toLowerCase();
  const role = user?.role || (accountType === 'personal' ? 'Personal' : 'Viewer');

  // Build dynamic navigation items based on accountType and role
  const getNavigationItems = () => {
    if (accountType === 'personal') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'My Panels', path: '/monitoring', icon: Grid },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'Alerts', path: '/alerts', icon: AlertTriangle, badge: activeCount > 0 ? activeCount : null },
        { name: 'Maintenance', path: '/maintenance', icon: Wrench },
        { name: 'Settings', path: '/profile', icon: Settings }
      ];
    }

    // Business & Organisation Accounts (Role Matrix)
    switch (role) {
      case 'Admin':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Panels', path: '/monitoring', icon: Grid },
          { name: 'Analytics', path: '/analytics', icon: BarChart3 },
          { name: 'Alerts', path: '/alerts', icon: AlertTriangle, badge: activeCount > 0 ? activeCount : null },
          { name: 'Maintenance', path: '/maintenance', icon: Wrench },
          { name: 'Users', path: '/users', icon: User },
          { name: 'Settings', path: '/profile', icon: Settings }
        ];

      case 'Manager':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Panels', path: '/monitoring', icon: Grid },
          { name: 'Analytics', path: '/analytics', icon: BarChart3 },
          { name: 'Alerts', path: '/alerts', icon: AlertTriangle, badge: activeCount > 0 ? activeCount : null },
          { name: 'Maintenance', path: '/maintenance', icon: Wrench },
          { name: 'Reports', path: '/reports', icon: FileText },
          { name: 'Settings', path: '/profile', icon: Settings }
        ];

      case 'Operator':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Panels', path: '/monitoring', icon: Grid },
          { name: 'Alerts', path: '/alerts', icon: AlertTriangle, badge: activeCount > 0 ? activeCount : null },
          { name: 'Settings', path: '/profile', icon: Settings }
        ];

      case 'Technician':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Panels', path: '/monitoring', icon: Grid },
          { name: 'Alerts', path: '/alerts', icon: AlertTriangle, badge: activeCount > 0 ? activeCount : null },
          { name: 'Maintenance', path: '/maintenance', icon: Wrench },
          { name: 'Settings', path: '/profile', icon: Settings }
        ];

      case 'Viewer':
      default:
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Panels', path: '/monitoring', icon: Grid },
          { name: 'Analytics', path: '/analytics', icon: BarChart3 },
          { name: 'Settings', path: '/profile', icon: Settings }
        ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* =========================================================
          DESKTOP FIXED SIDEBAR NAVIGATION (Large Screens: lg and up)
          - Fixed to screen viewport (sticky top-16 h-[calc(100vh-4rem)])
          - Pinned visible even when page content scrolls
      ========================================================= */}
      <aside
        className={`hidden lg:flex flex-col bg-white dark:bg-[#121212] text-[#111827] dark:text-white border-r border-[#E5E7EB] dark:border-[#283038] sticky top-16 h-[calc(100vh-4rem)] flex-shrink-0 transition-all duration-200 z-30 overflow-hidden ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Collapse/Expand Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-white dark:bg-[#1E242B] text-[#6B7280] dark:text-slate-300 border border-[#E5E7EB] dark:border-[#283038] flex items-center justify-center shadow-subtle hover:text-[#1B3D3D] dark:hover:text-[#D5E5F2] transition-colors z-40"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* Account Type & Role Indicator */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-[#E5E7EB] dark:border-[#283038]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#F3F4F6] dark:bg-[#1E242B] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#1B3D3D] dark:text-[#D5E5F2]" />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-[9px] uppercase tracking-wider text-[#6B7280] dark:text-slate-400 font-semibold">
                  {accountType} Account
                </span>
                <span className="text-[11px] text-[#111827] dark:text-white font-semibold truncate capitalize">
                  {role} Role
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden">
          {!collapsed && (
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] dark:text-slate-400">
              Platform Menu
            </div>
          )}

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#1B3D3D] text-white font-semibold dark:bg-[#D5E5F2] dark:text-[#121212]'
                    : 'text-[#6B7280] dark:text-slate-300 hover:text-[#111827] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#1E242B]'
                }`}
                title={collapsed ? item.name : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white dark:text-[#121212]' : 'text-[#6B7280] dark:text-slate-400'}`} />
                  {!collapsed && <span>{item.name}</span>}
                </div>
                {!collapsed && item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white dark:bg-[#121212]/20 dark:text-[#121212]'
                        : 'bg-[#F3F4F6] dark:bg-[#1E242B] text-[#1B3D3D] dark:text-[#D5E5F2] border border-[#E5E7EB] dark:border-[#283038]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Telemetry Status Footer */}
        {!collapsed && (
          <div className="p-3 m-3 rounded-xl bg-[#F9FAFB] dark:bg-[#1E242B] border border-[#E5E7EB] dark:border-[#283038] text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#6B7280] dark:text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1B3D3D] dark:bg-[#D5E5F2]"></span> Telemetry
              </span>
              <span className="text-[10px] text-[#1B3D3D] dark:text-[#D5E5F2] font-bold px-1.5 py-0.5 rounded bg-[#1B3D3D]/10 dark:bg-[#D5E5F2]/15">
                ONLINE
              </span>
            </div>
            <p className="text-[10px] text-[#6B7280] dark:text-slate-400 leading-tight">
              Grid Sync Active • Solarix System
            </p>
          </div>
        )}
      </aside>

      {/* =========================================================
          MOBILE FIXED BOTTOM NAVIGATION BAR (Small Screens: < lg)
          - Fixed at viewport bottom (fixed bottom-0 left-0 right-0 z-50)
          - ICON-ONLY navigation (no text)
          - Touch-friendly min 44px tap target size
      ========================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-white dark:bg-[#121212] border-t border-[#E5E7EB] dark:border-[#283038] px-2 py-1.5 shadow-card overflow-hidden touch-manipulation">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative p-3 rounded-xl flex items-center justify-center min-w-[44px] min-h-[44px] transition-colors ${
                  isActive
                    ? 'bg-[#1B3D3D] text-white dark:bg-[#D5E5F2] dark:text-[#121212]'
                    : 'text-[#6B7280] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#1E242B]'
                }`}
                aria-label={item.name}
                title={item.name}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.badge && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1B3D3D] dark:bg-[#D5E5F2] border border-white dark:border-[#121212]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
