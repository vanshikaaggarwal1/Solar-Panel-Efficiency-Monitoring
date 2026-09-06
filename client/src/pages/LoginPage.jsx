import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { Sun, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await login({ email, password });
      if (res.success) {
        setToast({ message: 'Authentication successful. Redirecting to console...', type: 'success' });
        setTimeout(() => navigate('/dashboard'), 400);
      } else {
        setToast({ message: res.error || 'Invalid credentials.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Login authentication error.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#121212] px-4 py-12 transition-colors">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-3 left-3 p-2 rounded-xl text-[#6B7280] hover:text-[#111827] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#1E242B] transition-colors"
        title="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="w-full max-w-md space-y-6">

        {/* Header Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#1B3D3D] dark:bg-[#D5E5F2] text-white dark:text-[#121212] flex items-center justify-center shadow-subtle">
            <Sun className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#111827] dark:text-white">
            Solarix Telemetry Portal
          </h2>
          <p className="text-xs text-[#6B7280] dark:text-slate-400">
            Sign in to access solar monitoring console and field telemetry
          </p>
        </div>

        {/* Card Form */}
        <div className="saas-card p-6 space-y-4 bg-white dark:bg-[#1E242B] border border-[#E5E7EB] dark:border-[#283038]">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#6B7280] dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="user@solarix.energy"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F9FAFB] dark:bg-[#121212] border border-[#E5E7EB] dark:border-[#283038] text-[#111827] dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#1B3D3D] dark:focus:ring-[#D5E5F2]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-[#6B7280] dark:text-slate-300">Password</label>
                <span className="text-[10px] text-[#1B3D3D] dark:text-[#D5E5F2] cursor-pointer hover:underline">Forgot password?</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F9FAFB] dark:bg-[#121212] border border-[#E5E7EB] dark:border-[#283038] text-[#111827] dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#1B3D3D] dark:focus:ring-[#D5E5F2]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-[#1B3D3D] dark:bg-[#D5E5F2] hover:opacity-90 text-white dark:text-[#121212] font-semibold text-xs shadow-subtle flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <span>Sign In to Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-[#6B7280] dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-[#1B3D3D] dark:text-[#D5E5F2] hover:underline">
            Register Account
          </Link>
        </div>

      </div>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  );
};

export default LoginPage;
