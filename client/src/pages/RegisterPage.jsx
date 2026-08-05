import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { Sun, Mail, Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setToast({ message: 'Passwords do not match.', type: 'error' });
      return;
    }
    setSubmitting(true);
    try {
      const res = await register({ name, email, password });
      if (res.success) {
        setToast({ message: 'Account registered! Redirecting to dashboard...', type: 'success' });
        setTimeout(() => navigate('/dashboard'), 400);
      } else {
        setToast({ message: res.error || 'Registration failed.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Registration error.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-warmBg dark:bg-[#121212] px-4 py-12 transition-colors">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-forest-500 text-white flex items-center justify-center shadow-subtle">
            <Sun className="w-5 h-5 text-sand-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-primaryText dark:text-white">
            Register Operator Credentials
          </h2>
          <p className="text-xs text-secondaryText">
            Join the Solarix Industrial Telemetry Platform
          </p>
        </div>

        {/* Card Form */}
        <div className="saas-card p-6 space-y-4 bg-white dark:bg-[#181818] border border-borderNeutral dark:border-[#262626]">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-secondaryText mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Alexander Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-secondaryText mb-1">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="operator@solarix.energy"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-secondaryText mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-secondaryText mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-forest-500 hover:bg-forest-600 text-white font-semibold text-xs shadow-subtle flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-secondaryText">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-forest-500 hover:underline">
            Sign In to Console
          </Link>
        </div>

      </div>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  );
};

export default RegisterPage;
