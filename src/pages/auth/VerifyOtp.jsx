import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MailCheck, RefreshCw, Home, Loader2 } from 'lucide-react';

import { setResetEmail } from '../../redux/slices/authSlice';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { resetEmail } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const inputRefs = useRef([]);

  const email = resetEmail || location.state?.email;

  useEffect(() => {
    if (location.state?.email && !resetEmail) {
      dispatch(setResetEmail(location.state.email));
    }
  }, [location.state, resetEmail, dispatch]);

  useEffect(() => {
    if (!email) navigate('/forgot-password');
  }, [email, navigate]);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isExpired = timeLeft <= 0;

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setError('');
    setSuccessMsg('');

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    if (isExpired) return;
    
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      setError('');
      setSuccessMsg('');
      const focusIndex = Math.min(pastedData.length, 5);
      if (inputRefs.current[focusIndex]) {
        inputRefs.current[focusIndex].focus();
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    if (isExpired) {
      setError('OTP has expired. Please request a new one.');
      return;
    }

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.post('/auth/verify-reset-otp', { email, otp: otpString });
      if (res.data.success) {
        navigate('/reset-password', { state: { otp: otpString } });
      } else {
        setError(res.data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (isResending) return;
    setError('');
    setSuccessMsg('');
    try {
      setIsResending(true);
      await api.post('/auth/forgot-password', { email });
      setSuccessMsg('A new OTP has been sent to your email.');
      setOtp(['', '', '', '', '', '']);
      setTimeLeft(600); // Reset timer to 10 minutes
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col items-center justify-center p-4 font-sans">
      
      {/* Top Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-[#1a56db] rounded-lg flex items-center justify-center shadow-sm">
          <Home className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-[#111827]">Digital Curator</span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[440px] bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 pb-8 flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-blue-50/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="w-14 h-14 bg-[#f0f4ff] rounded-2xl flex items-center justify-center mb-6">
          <MailCheck className="w-7 h-7 text-[#1a56db]" strokeWidth={2} />
        </div>

        <h1 className="text-[26px] font-extrabold text-[#111827] mb-3 text-center tracking-tight">Verify your identity</h1>
        <p className="text-[#4b5563] text-[15px] text-center leading-relaxed mb-6">
          We've sent a 6-digit verification<br />
          code to <span className="font-semibold text-[#111827]">{email}</span>
        </p>

        {/* Timer Display */}
        <div className="mb-6 flex flex-col items-center">
          <span className={`text-xl font-bold ${isExpired ? 'text-red-500' : 'text-[#1a56db]'}`}>
            {formatTime(timeLeft)}
          </span>
          {isExpired && <span className="text-xs text-red-500 mt-1 font-medium">OTP Expired</span>}
        </div>

        <form onSubmit={handleVerify} className="w-full flex flex-col items-center">
          
          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-2 mb-6 w-full" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={el => inputRefs.current[idx] = el}
                type="text"
                inputMode="numeric"
                className={`w-12 h-14 rounded-xl text-center text-xl font-bold transition-all border ${
                  isExpired 
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                    : 'bg-[#f4f7ff] text-[#111827] border-transparent focus:outline-none focus:ring-2 focus:ring-[#1a56db] focus:bg-white'
                }`}
                value={digit}
                onChange={(e) => handleChange(idx, e)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                maxLength={1}
                placeholder="0"
                disabled={isExpired || isLoading}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mb-4 font-medium text-center">{error}</p>}
          {successMsg && <p className="text-green-600 text-sm mb-4 font-medium text-center">{successMsg}</p>}

          {/* Verify Button */}
          <button
            type="submit"
            disabled={isExpired || isLoading}
            className="w-full flex items-center justify-center gap-2 bg-[#1a56db] hover:bg-[#1e40af] disabled:bg-[#9ca3af] text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm mb-6"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            Verify Code
          </button>

          {/* Resend Link */}
          <button 
            type="button"
            onClick={handleResendCode}
            disabled={isResending}
            className="flex items-center gap-2 text-[14px] font-semibold text-[#4b5563] hover:text-[#111827] disabled:text-gray-400 transition-colors mb-8"
          >
            <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
            {isResending ? 'Sending...' : 'Resend Code'}
          </button>

          {/* Divider & Trusted By */}
          <div className="w-full relative py-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-[10px] font-bold tracking-widest text-[#6b7280] uppercase">
                Trusted by creators at
              </span>
            </div>
          </div>

          {/* Dummy Logos */}
          <div className="flex gap-4 justify-center items-center pb-2">
            <div className="w-6 h-6 bg-[#9ca3af] rounded flex items-center justify-center text-white text-[10px] font-bold opacity-80">A</div>
            <div className="w-6 h-6 bg-[#9ca3af] rounded flex items-center justify-center text-white text-[10px] font-bold opacity-80">B</div>
          </div>

        </form>
      </div>

      {/* Footer Links */}
      <div className="flex gap-6 mt-8 mb-8 text-[13px] font-medium text-[#4b5563]">
        <Link to="/privacy-policy" className="hover:text-[#111827] transition-colors">Privacy Policy</Link>
        <Link to="/help-center" className="hover:text-[#111827] transition-colors">Help Center</Link>
        <Link to="/contact" className="hover:text-[#111827] transition-colors">Contact Support</Link>
      </div>

      {/* Copyright */}
      <div className="text-[12px] text-[#9ca3af] font-medium pb-4">
        © 2026 Brandly. All rights reserved.
      </div>

    </div>
  );
}
