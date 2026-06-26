import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, ArrowLeft, ArrowRight, RefreshCcw } from 'lucide-react';

import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import { setLoading, setError, setResetEmail } from '../../redux/slices/authSlice';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      await api.post(ENDPOINTS.FORGOT_PASSWORD, { email });
      dispatch(setResetEmail(email));
      navigate('/verify-otp');
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Something went wrong"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* Background Blurs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      <div className="z-10 w-full max-w-md px-6 flex flex-col items-center">
        
        {/* Top Icon */}
        <div className="w-14 h-14 bg-[#2563eb] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 mb-6">
          <RefreshCcw className="w-7 h-7 text-white" />
        </div>

        {/* Headings */}
        <h1 className="text-3xl font-black text-[#0f172a] tracking-tight text-center mb-3">
          Forgot Password?
        </h1>
        <p className="text-[#475569] text-center mb-8 leading-relaxed">
          No worries! Enter the email address associated with your account and we'll send you a link to reset your password.
        </p>

        {/* The Card */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full mb-8">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-5 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#334155] mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full bg-[#f1f5f9] text-[#0f172a] rounded-xl pl-12 pr-4 py-4 outline-none transition-all placeholder:text-[#94a3b8] focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/30 hover:bg-[#e2e8f0]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563eb] text-white rounded-xl py-4 font-bold text-base hover:bg-[#1d4ed8] transition-all shadow-[0_8px_20px_rgb(37,99,235,0.25)] hover:shadow-[0_8px_25px_rgb(37,99,235,0.35)] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? 'Sending...' : 'Send OTP'} {!loading && <ArrowRight className="w-5 h-5" />}
            </button>

            <div className="mt-8 text-center">
              <Link to="/login" className="inline-flex items-center text-sm font-bold text-[#2563eb] hover:underline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </form>
        </div>

        {/* Support Link */}
        <div className="text-sm text-[#475569] font-medium">
          Having trouble? <a href="#" className="text-[#8b5cf6] hover:underline">Contact our support team</a>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 w-full px-8 flex flex-col sm:flex-row justify-between items-center text-xs text-[#94a3b8] font-medium">
        <div className="mb-4 sm:mb-0">© 2026 Brandly. All rights reserved.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#64748b] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#64748b] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#64748b] transition-colors">Help Center</a>
          <a href="#" className="hover:text-[#64748b] transition-colors">Contact Us</a>
        </div>
      </div>

    </div>
  );
}
