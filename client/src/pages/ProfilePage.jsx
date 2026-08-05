import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { updateProfileApi, changePasswordApi } from '../services/api';
import {
  User,
  Mail,
  Shield,
  Phone,
  MapPin,
  Lock,
  LogOut,
  Save,
  Key,
  Bell,
  Sliders,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';

const ProfilePage = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'preferences' | 'security' | 'api'

  // Profile Form State
  const [name, setName] = useState(user?.name || 'Alexander Vance');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 019-2834');
  const [location, setLocation] = useState(user?.location || 'Bay Area Telemetry Hub Sector 4');
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notificationsEnabled !== false);

  // Preferences State
  const [tempUnit, setTempUnit] = useState('C'); // C or F
  const [refreshInterval, setRefreshInterval] = useState('8s');

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfileApi({ name, phone, location, notificationsEnabled });
      if (res.data.success) {
        updateUserProfile(res.data.user);
        setToast({ message: 'Operator settings updated successfully.', type: 'success' });
      }
    } catch (err) {
      setToast({ message: 'Failed to update profile.', type: 'error' });
    } font: {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setToast({ message: 'New passwords do not match.', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      const res = await changePasswordApi({ currentPassword, newPassword });
      if (res.data.success) {
        setToast({ message: 'Security credentials updated.', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Failed to update password.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-warmBg dark:bg-[#121212] text-primaryText dark:text-neutral-100 transition-colors">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderNeutral dark:border-[#262626]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primaryText dark:text-white">
              System Settings & Operator Profile
            </h1>
            <p className="text-xs text-secondaryText mt-0.5">
              Manage security credentials, telemetry refresh preferences, and notification webhooks
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-rose-500/20 text-rose-600 hover:bg-rose-500/10 font-semibold text-xs transition-colors self-start sm:self-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-borderNeutral dark:border-[#262626] text-xs">
          {[
            { id: 'profile', label: 'Operator Details', icon: User },
            { id: 'preferences', label: 'System Preferences', icon: Sliders },
            { id: 'security', label: 'Security & Auth', icon: Shield },
            { id: 'api', label: 'API Keys & Webhooks', icon: Key }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 font-semibold transition-colors border-b-2 ${
                  isActive
                    ? 'border-forest-500 text-forest-500'
                    : 'border-transparent text-secondaryText hover:text-primaryText'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OPERATOR DETAILS */}
        {activeTab === 'profile' && (
          <div className="saas-card p-6 max-w-2xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-forest-500 text-white flex items-center justify-center text-xl font-bold shadow-subtle">
                {name ? name.substring(0, 2).toUpperCase() : 'AV'}
              </div>
              <div>
                <h3 className="text-base font-bold text-primaryText dark:text-white">{name}</h3>
                <p className="text-xs text-secondaryText">{user?.email || 'operator@solarix.energy'} • {user?.role || 'Lead Telemetry Engineer'}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-secondaryText mb-1">Full Operator Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-secondaryText mb-1">Work Email Address (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'operator@solarix.energy'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-[#1A1A1A] border border-borderNeutral dark:border-[#262626] text-secondaryText cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-secondaryText mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-secondaryText mb-1">Substation Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-500 hover:bg-forest-600 text-white font-semibold text-xs shadow-subtle transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Operator Profile</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: SYSTEM PREFERENCES */}
        {activeTab === 'preferences' && (
          <div className="saas-card p-6 max-w-2xl space-y-6 text-xs">
            <h3 className="text-sm font-bold text-primaryText dark:text-white">Workspace Configuration</h3>

            <div className="space-y-4">
              {/* Theme Preference */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-warmBg dark:bg-[#202020] border border-borderNeutral dark:border-[#262626]">
                <div>
                  <span className="font-semibold text-primaryText dark:text-white block">Appearance Mode</span>
                  <span className="text-[11px] text-secondaryText">Choose between warm light neutral or high-contrast dark theme</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1A1A1A] border border-borderNeutral dark:border-[#333] font-semibold text-primaryText dark:text-white"
                >
                  {isDarkMode ? <Sun className="w-3.5 h-3.5 text-sand-400" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
              </div>

              {/* Temperature Unit */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-warmBg dark:bg-[#202020] border border-borderNeutral dark:border-[#262626]">
                <div>
                  <span className="font-semibold text-primaryText dark:text-white block">Temperature Unit</span>
                  <span className="text-[11px] text-secondaryText">Telemetry thermal readings unit</span>
                </div>
                <div className="flex items-center p-1 bg-white dark:bg-[#1A1A1A] border border-borderNeutral dark:border-[#333] rounded-xl font-semibold">
                  <button
                    onClick={() => setTempUnit('C')}
                    className={`px-3 py-1 rounded-lg ${tempUnit === 'C' ? 'bg-forest-500 text-white' : 'text-secondaryText'}`}
                  >
                    °C (Celsius)
                  </button>
                  <button
                    onClick={() => setTempUnit('F')}
                    className={`px-3 py-1 rounded-lg ${tempUnit === 'F' ? 'bg-forest-500 text-white' : 'text-secondaryText'}`}
                  >
                    °F (Fahrenheit)
                  </button>
                </div>
              </div>

              {/* Polling interval */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-warmBg dark:bg-[#202020] border border-borderNeutral dark:border-[#262626]">
                <div>
                  <span className="font-semibold text-primaryText dark:text-white block">Sensor Refresh Frequency</span>
                  <span className="text-[11px] text-secondaryText">Substation telemetry sampling rate</span>
                </div>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1A1A1A] border border-borderNeutral dark:border-[#333] font-semibold text-primaryText dark:text-white"
                >
                  <option value="4s">4 Seconds (Real-time)</option>
                  <option value="8s">8 Seconds (Standard)</option>
                  <option value="15s">15 Seconds (Eco Mode)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SECURITY & AUTH */}
        {activeTab === 'security' && (
          <div className="saas-card p-6 max-w-2xl space-y-6">
            <h3 className="text-sm font-bold text-primaryText dark:text-white">Security & Password Credentials</h3>

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-secondaryText mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-secondaryText mb-1">New Secure Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-secondaryText mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-500 hover:bg-forest-600 text-white font-semibold text-xs shadow-subtle transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Update Password Credentials</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: API KEYS */}
        {activeTab === 'api' && (
          <div className="saas-card p-6 max-w-2xl space-y-6 text-xs">
            <h3 className="text-sm font-bold text-primaryText dark:text-white">Substation Telemetry API Access</h3>
            <p className="text-secondaryText leading-relaxed">
              Use API tokens to connect hardware IoT string combiners, Modbus gateways, and SCADA monitoring systems.
            </p>

            <div className="p-4 rounded-xl bg-warmBg dark:bg-[#202020] border border-borderNeutral dark:border-[#262626] space-y-2">
              <span className="font-semibold text-secondaryText text-[10px] uppercase tracking-wider block">Production Telemetry Key</span>
              <div className="flex items-center justify-between font-mono bg-white dark:bg-[#181818] p-2.5 rounded-lg border border-borderNeutral dark:border-[#333]">
                <span className="truncate">solarix_live_pk_99e821a0f82741bc</span>
                <span className="text-[10px] text-forest-500 font-bold px-2 py-0.5 rounded bg-forest-500/10">ACTIVE</span>
              </div>
            </div>
          </div>
        )}

      </main>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  );
};

export default ProfilePage;
