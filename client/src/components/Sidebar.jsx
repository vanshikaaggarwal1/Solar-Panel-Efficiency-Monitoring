import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Sun,
  ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Panels', path: '/monitoring', icon: Grid },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Alerts', path: '/alerts', icon: AlertTriangle, badge: 3 },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/profile', icon: Settings },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col bg-[#1F1F1F] text-slate-300 border-r border-[#2A2A2A] transition-all duration-200 relative z-30 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Collapse/Expand Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-[#1F1F1F] text-slate-400 border border-[#333333] flex items-center justify-center shadow-subtle hover:text-white transition-colors"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Brand Logo Header */}
      <div className="h-16 px-4 flex items-center gap-3 border-b border-[#2A2A2A] overflow-hidden">
        <div className="w-8 h-8 rounded-lg bg-forest-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
          <Sun className="w-4 h-4 text-sand-400" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-white tracking-tight">Solarix Systems</span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Enterprise IoT</span>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
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
                  ? 'bg-forest-500 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-[#2A2A2A]'
              }`}
              title={collapsed ? item.name : undefined}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-sand-400' : 'text-slate-400'}`} />
                {!collapsed && <span>{item.name}</span>}
              </div>
              {!collapsed && item.badge && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-copper-500/20 text-copper-500'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Substation Status */}
      {!collapsed && (
        <div className="p-3 m-3 rounded-xl bg-[#262626] border border-[#333333] text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-forest-500"></span> Substation Telemetry
            </span>
            <span className="text-[10px] text-forest-500 font-bold bg-forest-500/15 px-1.5 py-0.5 rounded">ONLINE</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Grid Synchronization Active • 8 Arrays Monitored
          </p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
