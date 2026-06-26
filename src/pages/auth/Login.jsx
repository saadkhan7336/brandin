import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, Sparkles, Video, Camera, BarChart2 } from 'lucide-react';
import { getDashboardByRole } from '../../routes/ProtectedRoute';

import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import { setLoading, setAuthUser, clearAuthState } from '../../redux/slices/authSlice';

const validate = (field, value) => {
  switch (field) {
    case 'email':
      if (!value.trim()) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
      return '';
    case 'password':
      if (!value) return 'Password is required';
      return '';
    default:
      return '';
  }
};

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const AppleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05 1.8-3.08 1.8-1.09 0-1.44-.65-2.67-.65-1.25 0-1.64.65-2.69.65-1.07 0-2.02-.76-3.13-1.84C3.12 17.73 1.57 13.08 2.8 9.9c.61-1.58 2.15-2.58 3.82-2.58 1.15 0 2.22.75 2.89.75.66 0 1.95-.9 3.28-.9 1.4 0 2.62.53 3.42 1.45-2.08 1.25-1.74 4.09.28 5.12-.5 1.49-1.3 3.12-2.44 4.54zM12.03 7.25c-.15-1.56 1.13-3.16 2.72-3.25.26 1.69-1.29 3.25-2.72 3.25z" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, isAuthenticated, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(clearAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getDashboardByRole(user.role));
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: validate(name, value) }));
    }
    setSubmitError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setFieldErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = { email: true, password: true };
    setTouched(allTouched);
    const errors = {
      email: validate('email', formData.email),
      password: validate('password', formData.password),
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    try {
      dispatch(setLoading(true));
      setSubmitError('');

      const loginRes = await api.post(ENDPOINTS.LOGIN, formData);
      const res = await api.get(ENDPOINTS.ME);
      const { user: authUser } = res.data.data;

      dispatch(setAuthUser(authUser));
      navigate(getDashboardByRole(authUser.role));
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#f8fafc] relative overflow-hidden flex-col justify-center items-center">
        <img 
          src="/images/login/Diverse group of creators collaborating.png" 
          alt="Creators collaborating" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-20" 
        />
        
        <div className="relative z-20 flex flex-col items-start w-full max-w-xl px-12 xl:px-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#e0e7ff] text-[#4f46e5] text-xs font-bold rounded-full mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Orchestration
          </div>
          
          <h1 className="text-5xl xl:text-7xl font-black text-[#111827] leading-[1.05] tracking-tight mb-6">
            Welcome to the <br/>
            Pulse of <span className="text-[#2563eb]">Creator</span> <br/>
            <span className="text-[#2563eb]">Commerce</span>
          </h1>
          
          <p className="text-[#475569] text-lg max-w-md leading-relaxed mb-12 font-medium">
            Join the elite ecosystem where data-driven insights meet authentic storytelling. Scale your influence with precision.
          </p>

          <div className="flex items-center gap-4 mb-16">
            <div className="flex -space-x-3">
              <img src="/images/login/Creator 1.png" className="w-11 h-11 rounded-full border-[3px] border-white object-cover shadow-sm" alt="Creator 1" />
              <img src="/images/login/Creator 2.png" className="w-11 h-11 rounded-full border-[3px] border-white object-cover shadow-sm" alt="Creator 2" />
              <img src="/images/login/Creator 3.png" className="w-11 h-11 rounded-full border-[3px] border-white object-cover shadow-sm" alt="Creator 3" />
              <div className="w-11 h-11 rounded-full border-[3px] border-white bg-[#6366f1] text-white flex items-center justify-center text-xs font-bold shadow-sm z-10">
                +2k
              </div>
            </div>
            <span className="text-[#475569] text-sm font-semibold">Trusted by creators worldwide</span>
          </div>
        </div>

        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end z-20">
          <Link to="/" className="text-3xl font-black text-[#2563eb] tracking-tight hover:opacity-80 transition-opacity">Brandly.</Link>
          <div className="flex gap-5 text-[#cbd5e1]">
            <Video className="w-6 h-6"/>
            <Camera className="w-6 h-6"/>
            <BarChart2 className="w-6 h-6"/>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white relative">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-[32px] font-extrabold text-[#111827] mb-2 tracking-tight">Sign In</h2>
          <p className="text-[#64748b] mb-10 font-medium text-[15px]">Enter your credentials to access your hub.</p>

          {submitError && (
            <div className="bg-red-50 text-red-600 p-3.5 rounded-xl mb-5 text-sm border border-red-100 flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-[10px] font-bold">!</span>
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label className="block text-sm font-bold text-[#334155] mb-2">Email</label>
              <input 
                type="email"
                name="email"
                placeholder="name@creatorhub.com"
                className="w-full bg-[#f1f5f9] border border-transparent rounded-xl px-4 py-4 text-[#334155] placeholder:text-[#cbd5e1] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition-all font-medium"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.email && fieldErrors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{fieldErrors.email}</p>}
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-[#334155]">Password</label>
                <Link to="/forgot-password" className="text-sm font-bold text-[#3b82f6] hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  className="w-full bg-[#f1f5f9] border border-transparent rounded-xl pl-4 pr-12 py-4 text-[#334155] placeholder:text-[#cbd5e1] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 outline-none transition-all font-medium"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {touched.password && fieldErrors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{fieldErrors.password}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#3b82f6] text-white rounded-xl py-4 font-bold text-base hover:bg-[#2563eb] transition-all shadow-[0_8px_20px_rgb(59,130,246,0.25)] hover:shadow-[0_8px_25px_rgb(59,130,246,0.35)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative flex items-center justify-center mt-8 mb-8">
            <div className="border-t border-[#e2e8f0] w-full"></div>
            <span className="bg-white px-4 text-[11px] font-bold text-[#94a3b8] tracking-widest uppercase absolute">Or Continue With</span>
          </div>

          <div className="mb-8">
            <button type="button" className="w-full flex items-center justify-center gap-2.5 border border-[#e2e8f0] rounded-xl py-3.5 font-bold text-sm text-[#334155] hover:bg-[#f8fafc] transition-colors shadow-sm">
              <GoogleIcon />
              Google
            </button>
          </div>

          <div className="mt-10 text-center text-[15px] font-medium text-[#64748b]">
            New here? <Link to="/register" className="text-[#6366f1] font-bold hover:underline">Join the Movement</Link>
          </div>

          <div className="mt-20 flex justify-center gap-6 text-[13px] text-[#94a3b8] font-semibold">
            <Link to="/privacy" className="hover:text-[#64748b] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#64748b] transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-[#64748b] transition-colors">Contact Us</Link>
          </div>
          <div className="text-center mt-5 text-[10px] text-[#94a3b8] font-bold uppercase tracking-widest">
            © 2024 BRANDLY INC. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </div>
  );
}
