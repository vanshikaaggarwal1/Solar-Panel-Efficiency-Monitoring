import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import { Zap, Mail, Lock, ArrowRight, KeyRound, CheckSquare, Square } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@solar.com');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setToast({ message: 'Please enter both email and password.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res.success) {
        setToast({ message: 'Login successful! Redirecting to Dashboard...', type: 'success' });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Invalid credentials.';
      setToast({ message: errMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setToast({ message: `Password reset link sent to ${resetEmail || email}`, type: 'info' });
    setForgotModalOpen(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lightBg dark:bg-navy-950 p-4 relative overflow-hidden transition-colors">
      
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-solar-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-skyAccent-400/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 relative z-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-solar-600 to-skyAccent-400 p-0.5 mx-auto flex items-center justify-center shadow-lg shadow-solar-500/20">
            <div className="w-full h-full bg-navy-900 rounded-[14px] flex items-center justify-center">
              <Zap className="w-7 h-7 text-skyAccent-400" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-navy-900 dark:text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to access real-time solar telemetry & analytics
          </p>
        </div>

        {/* Demo Credentials Tip */}
        
        {/* <div className="p-3 rounded-xl bg-solar-500/10 border border-solar-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <div>
            <span className="font-bold text-solar-600 dark:text-solar-400">Demo Operator:</span>
            <br />
            admin@solar.com / admin123
          </div>
          <button
            onClick={() => { setEmail('admin@solar.com'); setPassword('admin123'); }}
            className="px-2.5 py-1 rounded bg-solar-500 text-white text-[11px] font-semibold hover:bg-solar-600 transition-colors"
          >
            Auto Fill
          </button>
        </div> */}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@solar.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-100/70 dark:bg-navy-900/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-solar-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-100/70 dark:bg-navy-900/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-solar-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white"
            >
              {rememberMe ? (
                <CheckSquare className="w-4 h-4 text-solar-500" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>Remember Me</span>
            </button>

            <button
              type="button"
              onClick={() => setForgotModalOpen(true)}
              className="text-solar-600 dark:text-skyAccent-400 font-semibold hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-solar-500 to-solar-600 hover:from-solar-600 hover:to-solar-700 text-white font-bold text-sm shadow-lg shadow-solar-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign In to System</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer link to Register */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-white/10">
          Don't have an operator account?{' '}
          <Link to="/register" className="text-solar-600 dark:text-skyAccent-400 font-bold hover:underline">
            Register Here
          </Link>
        </div>

      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Account Password"
      >
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Enter your registered operator email address to receive password recovery instructions and a single-use authentication pin.
          </p>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Registered Email</label>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="operator@solar.com"
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setForgotModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-lg bg-solar-500 text-white hover:bg-solar-600"
            >
              Send Reset Link
            </button>
          </div>
        </form>
      </Modal>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  );
};

export default LoginPage;
