import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { updateProfileApi, changePasswordApi } from '../services/api';
import {
  User,
  Mail,
  Shield,
  Phone,
  MapPin,
  Calendar,
  Lock,
  LogOut,
  Save,
  KeyRound,
  CheckCircle2,
  BellRing
} from 'lucide-react';

const ProfilePage = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  // Profile Form State
  const [name, setName] = useState(user?.name || 'Alex Vance');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [location, setLocation] = useState(user?.location || 'San Francisco Solar Tech Hub');
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notificationsEnabled !== false);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await updateProfileApi({ name, phone, location, notificationsEnabled });
      if (res.data.success) {
        updateUserProfile(res.data.user);
        setToast({ message: 'Profile information updated successfully!', type: 'success' });
      }
    } catch (err) {
      setToast({ message: 'Failed to update profile.', type: 'error' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setToast({ message: 'Please enter both current and new passwords.', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast({ message: 'New password and confirmation do not match.', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setToast({ message: 'New password must be at least 6 characters long.', type: 'error' });
      return;
    }

    setSavingPass(true);
    try {
      const res = await changePasswordApi({ currentPassword, newPassword });
      if (res.data.success) {
        setToast({ message: 'Password updated successfully!', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password. Check current password.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setSavingPass(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-lightBg dark:bg-navy-950 transition-colors">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <div>
            <span className="text-xs font-bold text-solar-500 uppercase tracking-wider">Account Settings</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white tracking-tight">
              Operator Profile & Credentials
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage personal details, notification preferences, and security passcodes
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out of Console
          </button>
        </div>

        {/* Two Column Layout: Profile Card & Password Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: User Badge Info */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 text-center">
            
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-solar-500 to-skyAccent-400 p-1 mx-auto shadow-xl shadow-solar-500/20">
              <div className="w-full h-full rounded-full bg-navy-900 flex items-center justify-center text-3xl font-extrabold text-white">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AV'}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-navy-900 dark:text-white">
                {user?.name || 'Alex Vance'}
              </h2>
              <span className="text-xs font-semibold text-solar-500 block mt-0.5">
                {user?.role || 'Administrator'}
              </span>
              <span className="text-[11px] text-slate-400 block">{user?.email || 'admin@solar.com'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-navy-900/60 text-left space-y-2 text-xs border border-slate-200/50 dark:border-white/5">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-solar-500 flex-shrink-0" />
                <span className="truncate">{user?.location || 'San Francisco Solar Tech Hub'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Phone className="w-4 h-4 text-skyAccent-400 flex-shrink-0" />
                <span>{user?.phone || '+1 (555) 234-5678'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Member Since: {user?.joinedDate || '2024-01-15'}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Edit Profile & Change Password Forms */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Edit Profile Form */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-solar-500" /> Edit Operator Information
                </h3>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Phone Contact</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Substation Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/50 dark:bg-navy-900/50 border border-slate-200/50 dark:border-white/5 text-xs">
                  <div className="flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-skyAccent-400" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">Telemetry Anomaly Alerts</span>
                      <span className="text-[11px] text-slate-400">Receive instant push notifications for panel overheating</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    className="w-4 h-4 text-solar-500 rounded border-slate-300 focus:ring-solar-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 rounded-xl bg-solar-500 hover:bg-solar-600 text-white font-bold text-xs shadow-md shadow-solar-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Save className="w-4 h-4" /> Save Profile Details
                </button>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-500" /> Change Security Password
                </h3>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingPass}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Lock className="w-4 h-4" /> Update Password
                </button>
              </form>
            </div>

          </div>

        </div>

      </main>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  );
};

export default ProfilePage;
