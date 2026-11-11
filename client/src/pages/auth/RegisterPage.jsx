import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { COMMUNITIES } from '../../constants';
import { UserPlus, User, Mail, Key, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [community, setCommunity] = useState(COMMUNITIES[0]);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your complete student/faculty name.';
    }

    if (!email.trim()) {
      newErrors.email = 'Campus email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email format (e.g. name@adtu.edu.in).';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must accept the Community Terms and Conditions.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please resolve the errors highlighted below.');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        community
      });
      toast.success('Registration successful! +50 Welcome RePoints credited to your account! 🎉', {
        duration: 4000,
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
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="relative w-full max-w-lg bg-white border-3 border-brand-black rounded-neo shadow-hard-xl p-6 sm:p-8 overflow-hidden">
          {/* Tape decoration at top */}
          <div className="absolute -top-3 right-1/4 w-28 h-6 tape-strip -rotate-2 pointer-events-none" />

          {/* Form Header */}
          <div className="text-center space-y-1 mb-6">
            <span className="text-[11px] font-mono font-black uppercase tracking-wider bg-brand-pink text-brand-black px-2.5 py-0.5 border border-brand-black rounded inline-block">
              New Member Registration
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-black uppercase font-heading">
              Join ReConnect ADTU
            </h2>
            <p className="text-xs text-neutral-600 font-medium font-hand text-base">
              Share textbooks, lab equipment & appliances with fellow students
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase text-brand-black">
                Full Name: <span className="text-brand-urgent">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors(prev => ({ ...prev, fullName: null }));
                  }}
                  placeholder="e.g. Priyam Sharma"
                  className={`w-full pl-9 pr-3 py-2.5 bg-brand-bg text-brand-black text-sm font-semibold border-2 rounded shadow-hard-sm focus:outline-none focus:bg-white transition ${
                    errors.fullName ? 'border-brand-urgent bg-red-50' : 'border-brand-black'
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs font-bold text-brand-urgent flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            {/* Email */}
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
                  placeholder="name.dept@adtu.edu.in"
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

            {/* Select Community */}
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase text-brand-black">
                Select Campus Community / Department: <span className="text-brand-urgent">*</span>
              </label>
              <select
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                className="w-full px-3 py-2.5 bg-brand-bg text-brand-black text-xs font-bold border-2 border-brand-black rounded shadow-hard-sm focus:outline-none focus:bg-white transition"
                disabled={loading}
              >
                {COMMUNITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Password and Confirm Password with visibility toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
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
                    placeholder="Min 6 chars"
                    className={`w-full pl-9 pr-10 py-2.5 bg-brand-bg text-brand-black text-sm font-semibold border-2 rounded shadow-hard-sm focus:outline-none focus:bg-white transition ${
                      errors.password ? 'border-brand-urgent bg-red-50' : 'border-brand-black'
                    }`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-neutral-600 hover:text-brand-black p-0.5 focus:outline-none"
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

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-xs font-black uppercase text-brand-black">
                  Confirm Password: <span className="text-brand-urgent">*</span>
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: null }));
                    }}
                    placeholder="Re-enter password"
                    className={`w-full pl-9 pr-10 py-2.5 bg-brand-bg text-brand-black text-sm font-semibold border-2 rounded shadow-hard-sm focus:outline-none focus:bg-white transition ${
                      errors.confirmPassword ? 'border-brand-urgent bg-red-50' : 'border-brand-black'
                    }`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-neutral-600 hover:text-brand-black p-0.5 focus:outline-none"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs font-bold text-brand-urgent flex items-center gap-1 pt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Terms and conditions */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (errors.agreeTerms) setErrors(prev => ({ ...prev, agreeTerms: null }));
                  }}
                  className="w-4 h-4 mt-0.5 accent-brand-black rounded border-2 border-brand-black cursor-pointer"
                  disabled={loading}
                />
                <span className="text-xs font-medium text-neutral-800 leading-tight">
                  I accept the <strong>Community Terms and Conditions</strong>: I agree to pass items in safe, working condition, return borrowed equipment on time, and uphold the ADTU zero-waste charter.
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-xs font-bold text-brand-urgent flex items-center gap-1 pt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.agreeTerms}</span>
                </p>
              )}
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 stroke-[2.5]" />
                  <span>Register & Claim 50 RePoints</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-4 border-t-2 border-brand-black/20 text-center text-xs font-bold text-neutral-700">
            <span>Already registered? </span>
            <Link to="/login" className="text-brand-black underline decoration-2 font-black hover:text-neutral-900">
              Sign In to your account →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
