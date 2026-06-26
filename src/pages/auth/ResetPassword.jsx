import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, ShieldCheck, CheckCircle2, Circle } from 'lucide-react';

import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import { setLoading, clearAuthState } from '../../redux/slices/authSlice';

// ── Password strength helpers ──────────────────────────────────────────────────
const CRITERIA = [
  {
    id: 'minLength',
    label: 'Minimum 6 characters required',
    test: (p) => p.length >= 6,
  },
  {
    id: 'specialChar',
    label: 'Include one special glyph (!@#$%^&*)',
    test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p),
  },
];

const getScore = (password) => CRITERIA.filter((c) => c.test(password)).length;

const SCORE_CONFIG = [
  { label: 'WEAK',     color: 'bg-red-400',    textColor: 'text-red-400'    },
  { label: 'FAIR',     color: 'bg-orange-400',  textColor: 'text-orange-400' },
  { label: 'OPTIMAL',  color: 'bg-[#1a56db]',   textColor: 'text-[#1a56db]'  },
];

// 4 bar segments; filled count = score * 2 (max 4) but we cap at 4
const filledBars = (score) => Math.min(score * 2, 4);

export default function ResetPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const otpFromState = location.state?.otp;
  const { loading, resetEmail } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [submitError, setSubmitError]   = useState('');
  const [successMsg, setSuccessMsg]     = useState('');

  useEffect(() => { if (!resetEmail)    navigate('/forgot-password'); }, [resetEmail, navigate]);
  useEffect(() => { if (!otpFromState)  navigate('/verify-otp');      }, [otpFromState, navigate]);

  const score      = getScore(formData.password);
  const scoreConf  = SCORE_CONFIG[Math.min(score, SCORE_CONFIG.length - 1)];
  const bars       = filledBars(score);
  const allMet     = score === CRITERIA.length;
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

  const canSubmit = allMet && passwordsMatch && !loading;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      dispatch(setLoading(true));
      setSubmitError('');

      await api.post(ENDPOINTS.RESET_PASSWORD, {
        email:    resetEmail,
        otp:      otpFromState,
        password: formData.password,
      });

      setSuccessMsg('Password updated! Redirecting to login…');
      setTimeout(() => {
        dispatch(clearAuthState());
        navigate('/login');
      }, 1000);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Reset failed. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT HERO PANE ──────────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-10"
        style={{
          backgroundImage: "url('/images/reset-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#e8edf2',
        }}
      >
        {/* Subtle overlay for readability */}
        <div className="absolute inset-0 bg-white/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Top content */}
          <div className="mt-16 ml-4">
            {/* Security shield badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 mb-10 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#1a56db]" />
              <span className="text-[11px] font-bold tracking-widest text-[#374151] uppercase">
                Security Shield
              </span>
            </div>

            {/* Hero headline */}
            <h1 className="text-5xl font-black leading-tight text-[#111827] mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Identity.<br />
              <span className="text-[#1a56db]">Restored.</span>
            </h1>

            {/* Sub-copy */}
            <p className="text-[#4b5563] text-[16px] leading-relaxed max-w-xs">
              Ensuring the integrity of your digital workspace through professional-grade security measures. Regain access to your pulse.
            </p>
          </div>

          {/* Avatar trust badge */}
          <div className="ml-4 mb-6">
            <div className="flex items-center gap-3">
              {/* Overlapping avatar stack */}
              <div className="flex -space-x-3">
                <img
                  src="/images/reset-user1.png"
                  alt="User avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                />
                {/* Placeholder second avatar */}
                <div className="w-10 h-10 rounded-full bg-[#a7c5a0] border-2 border-white shadow flex items-center justify-center" />
                {/* Safe badge */}
                <div className="w-10 h-10 rounded-full bg-[#6d4fc7] border-2 border-white shadow flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold">Safe</span>
                </div>
              </div>
              <span className="text-[13px] text-[#374151] font-medium">
                Trusted security infrastructure
              </span>
            </div>
          </div>
        </div>

        {/* Brandly logo bottom-left */}
        <div className="absolute bottom-8 left-10 z-10">
          <span className="text-2xl font-black text-[#1a56db]">Brandly.</span>
        </div>
      </div>

      {/* ── RIGHT FORM PANE ─────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[45%] bg-white flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-[400px]">

          {/* Heading */}
          <h2 className="text-[28px] font-extrabold text-[#111827] mb-1">Reset Password</h2>
          <p className="text-[#6b7280] text-[14px] mb-8">Enter your new credentials to regain access.</p>

          {/* Success banner */}
          {successMsg && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-5 text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {successMsg}
            </div>
          )}

          {/* Error banner */}
          {submitError && (
            <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* New Password */}
            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-[#f3f4f6] rounded-xl px-4 py-3.5 text-[14px] text-[#111827] placeholder-[#9ca3af] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#1a56db] focus:bg-white transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#4b5563] transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full bg-[#f3f4f6] rounded-xl px-4 py-3.5 text-[14px] text-[#111827] placeholder-[#9ca3af] border focus:outline-none focus:ring-2 focus:ring-[#1a56db] focus:bg-white transition-all pr-12 ${
                    formData.confirmPassword && !passwordsMatch
                      ? 'border-red-300 focus:ring-red-300'
                      : 'border-transparent'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#4b5563] transition-colors"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && !passwordsMatch && (
                <p className="text-red-500 text-[12px] mt-1 font-medium">Passwords do not match</p>
              )}
            </div>

            {/* ── COMPLEXITY SCORE BOX ─────────────────────────────────── */}
            {formData.password && (
              <div className="border border-[#e5e7eb] rounded-2xl p-4 bg-[#fafafa]">
                {/* Header row */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-bold tracking-widest text-[#6b7280] uppercase">
                    Complexity Score
                  </span>
                  <span className={`text-[11px] font-bold tracking-widest uppercase ${scoreConf.textColor}`}>
                    {scoreConf.label}
                  </span>
                </div>

                {/* Score bars */}
                <div className="flex gap-1.5 mb-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        i < bars ? scoreConf.color : 'bg-[#e5e7eb]'
                      }`}
                    />
                  ))}
                </div>

                {/* Criteria checklist */}
                <div className="space-y-2">
                  {CRITERIA.map((c) => {
                    const met = c.test(formData.password);
                    return (
                      <div key={c.id} className="flex items-center gap-2">
                        {met ? (
                          <CheckCircle2 className="w-4 h-4 text-[#1a56db] shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-[#9ca3af] shrink-0" />
                        )}
                        <span
                          className={`text-[13px] font-medium transition-colors ${
                            met ? 'text-[#1a56db]' : 'text-[#6b7280]'
                          }`}
                        >
                          {c.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-[15px] transition-all shadow-sm mt-2 ${
                canSubmit
                  ? 'bg-[#1a56db] hover:bg-[#1e40af] shadow-blue-200 cursor-pointer'
                  : 'bg-[#9ca3af] cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Updating…
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-[13px] text-[#4b5563] font-medium hover:text-[#111827] transition-colors"
            >
              <span>←</span> Back to Login
            </Link>
          </div>

          {/* Footer links */}
          <div className="mt-10 pt-6 border-t border-[#f3f4f6]">
            <div className="flex justify-center gap-5 text-[12px] text-[#9ca3af] font-medium mb-2">
              <Link to="#" className="hover:text-[#6b7280] transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-[#6b7280] transition-colors">Terms of Service</Link>
              <Link to="#" className="hover:text-[#6b7280] transition-colors">Contact Us</Link>
            </div>
            <p className="text-center text-[11px] text-[#c9ced6] uppercase tracking-widest font-medium">
              © 2026 Brandly Inc. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
