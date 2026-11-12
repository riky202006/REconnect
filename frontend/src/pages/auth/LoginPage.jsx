import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { LogIn, Key, Mail, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Campus email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email (e.g. name@adtu.edu.in).';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      toast.success('Welcome back to ReConnect ADTU!', {
        style: {
          border: '2px solid #121411',
          boxShadow: '3px 3px 0px #121411',
          background: '#DDF247',
          color: '#121411',
          fontWeight: 'bold'
        }
      });
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('priyam.sharma@adtu.edu.in');
    setPassword('adtu2026pass');
    setErrors({});
    setLoading(true);
    try {
      await login('priyam.sharma@adtu.edu.in', 'adtu2026pass');
      toast.success('Logged in as Priyam Sharma (CSE - 6th Sem)', {
        style: {
          border: '2px solid #121411',
          boxShadow: '3px 3px 0px #121411',
          background: '#DDF247',
          color: '#121411',
          fontWeight: 'bold'
        }
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      toast.error('Enter your registered email address first.');
      return;
    }
    toast.success(`Password reset link dispatched to ${email.trim()}!`, {
      style: {
        border: '2px solid #121411',
        boxShadow: '3px 3px 0px #121411',
        background: '#8FD3F4',
        color: '#121411',
        fontWeight: 'bold'
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="relative w-full max-w-md bg-white border-3 border-brand-black rounded-neo shadow-hard-xl p-6 sm:p-8 overflow-hidden">
          {/* Tape decoration at top */}
          <div className="absolute -top-3 left-1/3 w-24 h-6 tape-strip rotate-2 pointer-events-none" />

          {/* Form Header */}
          <div className="text-center space-y-1 mb-6">
            <span className="text-[11px] font-mono font-black uppercase tracking-wider bg-brand-chartreuse px-2.5 py-0.5 border border-brand-black rounded inline-block">
              Student & Faculty Access
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-black uppercase font-heading">
              Sign In to ReConnect
            </h2>
            <p className="text-xs text-neutral-600 font-medium font-hand text-base">
              Manage your noticeboard listings, requests & RePoints
            </p>
          </div>

          {/* 1-Click Demo Shortcut */}
          <div className="mb-6 p-3.5 bg-brand-paper border-2 border-dashed border-brand-black rounded-neo flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-mono font-black uppercase bg-brand-black text-white px-1.5 py-0.5 rounded">
                Fast Evaluation
              </span>
              <p className="text-xs font-black text-brand-black mt-1 truncate">Priyam Sharma (CSE Student)</p>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="px-3 py-1.5 bg-brand-chartreuse text-brand-black font-black text-xs uppercase border-2 border-brand-black rounded brutal-btn shadow-hard-sm hover:bg-yellow-300 shrink-0"
            >
              1-Click Login
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase text-brand-black">
                Campus Email: <span className="text-brand-urgent">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                  }}
                  placeholder="student@adtu.edu.in"
                  className={`w-full pl-9 pr-3 py-2.5 bg-brand-bg text-brand-black text-sm font-semibold border-2 rounded shadow-hard-sm focus:outline-none focus:bg-white transition ${
                    errors.email ? 'border-brand-urgent bg-red-50' : 'border-brand-black'
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-bold text-brand-urgent flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase text-brand-black">
                Password: <span className="text-brand-urgent">*</span>
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: null }));
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-10 py-2.5 bg-brand-bg text-brand-black text-sm font-semibold border-2 rounded shadow-hard-sm focus:outline-none focus:bg-white transition ${
                    errors.password ? 'border-brand-urgent bg-red-50' : 'border-brand-black'
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-neutral-600 hover:text-brand-black focus:outline-none p-0.5"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-bold text-brand-urgent flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-xs font-bold pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-brand-black rounded border-2 border-brand-black cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-neutral-700 hover:text-brand-black underline decoration-2 cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-chartreuse text-brand-black font-black text-sm uppercase tracking-wider border-2 border-brand-black rounded brutal-btn shadow-hard hover:bg-yellow-300 flex items-center justify-center gap-2 mt-4 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-brand-black border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 stroke-[2.5]" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 pt-4 border-t-2 border-brand-black/20 text-center text-xs font-bold text-neutral-700">
            <span>New to ADTU ReConnect? </span>
            <Link to="/register" className="text-brand-black underline decoration-2 font-black hover:text-neutral-900">
              Create an account here →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
