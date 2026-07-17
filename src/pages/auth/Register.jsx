import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Briefcase, Video, Eye, EyeOff, Globe, Hash, CheckCircle2, Shield, Zap, UploadCloud } from 'lucide-react';
import api from '../../services/api.js';
import { ENDPOINTS } from '../../services/endpoints.js';
import { setLoading, clearAuthState, setAuthUser } from '../../redux/slices/authSlice.js';
import { compressImage } from '../../utils/imageCompression.js';
import { getDashboardByRole } from '../../routes/ProtectedRoute.jsx';

const validate = (field, value) => {
  switch (field) {
    case 'name':
      if (!value.trim()) return 'Full name is required';
      if (value.trim().length < 3) return 'Name must be at least 3 characters';
      return '';
    case 'email':
      if (!value.trim()) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
      return '';
    case 'password':
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters';
      return '';
    default:
      return '';
  }
};

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [role, setRole] = useState('brand'); // 'brand' or 'influencer'
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [profileData, setProfileData] = useState({ website: '', industry: '', handle: '', category: '' });
  
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const fileInputRef = useRef(null);
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  
  // Store the login response locally so we don't trigger PublicRoute redirect until Step 2 is done
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    dispatch(clearAuthState());
    // Auto-select role if navigated from About page CTA
    const defaultRole = location.state?.defaultRole;
    if (defaultRole === 'creator') {
      setRole('influencer');
    } else if (defaultRole === 'brand') {
      setRole('brand');
    }
  }, [dispatch, location.state]);

  // Remove the initial useEffect that navigated on isAuthenticated because PublicRoute handles it anyway.

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
    setSubmitError('');
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setSubmitError('File size should not exceed 5MB');
      return;
    }

    try {
      const compressed = await compressImage(file, 'avatar');
      setProfilePicFile(compressed);
      setProfilePicPreview(URL.createObjectURL(compressed));
      setSubmitError('');
    } catch (err) {
      console.error('Error compressing image:', err);
      setSubmitError('Failed to process image');
    }
  };

  const handleContinueToStep2 = (e) => {
    e.preventDefault();
    const errors = {
      name: validate('name', formData.name),
      email: validate('email', formData.email),
      password: validate('password', formData.password),
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;
    
    // Just move to step 2 visually. Don't hit backend yet.
    setStep(2);
  };

  const performRegistration = async (isSkip = false) => {
    try {
      dispatch(setLoading(true));
      setSubmitError('');

      // 1. Register User (using FormData to support profile picture upload)
      const registerData = new FormData();
      registerData.append('fullname', formData.name);
      registerData.append('email', formData.email);
      registerData.append('password', formData.password);
      registerData.append('role', role);
      if (profilePicFile) {
        registerData.append('profilePic', profilePicFile);
      }

      await api.post(ENDPOINTS.REGISTER, registerData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // 2. Auto-Login (sets httpOnly cookies)
      await api.post(ENDPOINTS.LOGIN, {
        email: formData.email,
        password: formData.password,
      });

      // 3. Optional: Update Profile if not skipping
      if (!isSkip) {
        const updateEndpoint = role === 'brand' ? ENDPOINTS.brands.update : ENDPOINTS.influencers.update;
        // Map common profileData to what backend expects based on role
        const payload = role === 'brand' 
          ? { website: profileData.website, industry: profileData.industry }
          : { username: profileData.handle, category: profileData.category };
        
        try {
          await api.patch(updateEndpoint, payload);
        } catch (updateErr) {
          console.warn("Failed to update extra profile details during registration", updateErr);
          // Non-fatal, they can update later.
        }
      }

      // 4. Fetch full user via cookies
      const meRes = await api.get(ENDPOINTS.ME);
      const { user: authUser } = meRes.data.data;

      // 5. Dispatch to Redux (won't auto-redirect because we aren't in PublicRoute)
      dispatch(setAuthUser(authUser));
      
      // 6. Navigate to the correct dashboard manually
      navigate(getDashboardByRole(authUser.role));

    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Registration failed. Please try again.');
      // If registration failed, send them back to Step 1 to fix errors
      setStep(1);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSkip = () => {
    performRegistration(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    performRegistration(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      
      {/* LEFT PANEL */}
      <div className="w-full lg:w-[45%] bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] p-8 lg:p-16 flex flex-col relative overflow-hidden hidden lg:flex">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

        <div className="z-10 flex-1 flex flex-col">
          <div className="text-[11px] font-bold text-[#2563eb] tracking-widest uppercase mb-6">Selection</div>
          
          <h1 className="text-5xl lg:text-[3.5rem] leading-[1.1] font-black text-[#0f172a] mb-6 tracking-tight">
            Define your <span className="text-[#2563eb]">journey.</span>
          </h1>
          
          <p className="text-lg text-[#475569] mb-12 max-w-md">
            Choose how you want to interact with the world's most innovative ecosystem for digital storytelling.
          </p>

          <div className="space-y-4 max-w-md">
            <button
              type="button"
              onClick={() => step === 1 && setRole('brand')}
              disabled={step === 2}
              className={`w-full text-left p-6 rounded-2xl flex items-start gap-5 transition-all duration-300 ${
                role === 'brand' 
                  ? 'bg-white border-2 border-[#3b82f6] shadow-md ring-1 ring-[#3b82f6]/20' 
                  : 'bg-white/60 border-2 border-transparent hover:bg-white hover:shadow-sm'
              } ${step === 2 ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="w-14 h-14 shrink-0 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#3b82f6]">
                <Briefcase className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0f172a] mb-1">I am a Brand</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">
                  Looking for premium talent to scale my presence and reach new audiences.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => step === 1 && setRole('influencer')}
              disabled={step === 2}
              className={`w-full text-left p-6 rounded-2xl flex items-start gap-5 transition-all duration-300 ${
                role === 'influencer' 
                  ? 'bg-white border-2 border-[#a855f7] shadow-md ring-1 ring-[#a855f7]/20' 
                  : 'bg-white/60 border-2 border-transparent hover:bg-white hover:shadow-sm'
              } ${step === 2 ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="w-14 h-14 shrink-0 rounded-xl bg-[#faf5ff] flex items-center justify-center text-[#a855f7]">
                <Video className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0f172a] mb-1">I am a Creator</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">
                  Vlogger, model, or influencer looking for authentic brand partnerships.
                </p>
              </div>
            </button>
          </div>
        </div>

        <div className="z-10 mt-auto pt-12 flex items-center gap-4">
          <div className="flex -space-x-3">
            <img className="w-10 h-10 rounded-full border-2 border-[#f8fafc] object-cover" src="/images/login/Creator 1.png" alt="" onError={(e) => {e.target.style.display='none'}}/>
            <img className="w-10 h-10 rounded-full border-2 border-[#f8fafc] object-cover" src="/images/login/Creator 2.png" alt="" onError={(e) => {e.target.style.display='none'}}/>
            <div className="w-10 h-10 rounded-full border-2 border-[#f8fafc] bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 z-10">
              +2k
            </div>
          </div>
          <span className="text-sm font-semibold text-[#475569]">Join 20,000+ others today</span>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-[55%] flex flex-col relative overflow-hidden bg-white">
        
        {/* Top Header */}
        <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-20">
          <Link to="/" className="text-2xl font-black text-[#2563eb] tracking-tight hover:opacity-80 transition-opacity lg:hidden">Brandly.</Link>
          <Link to="/" className="hidden lg:block text-2xl font-black text-[#2563eb] tracking-tight hover:opacity-80 transition-opacity">Brandly.</Link>
          <Link to="/login" className="text-sm font-bold text-[#2563eb] hover:underline">Log In</Link>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 max-w-3xl w-full mx-auto relative mt-20 lg:mt-0">
          
          {/* Progress Indicators */}
          <div className="flex gap-2 mb-8">
            <div className={`h-1.5 rounded-full w-8 transition-all duration-500 ${step >= 1 ? 'bg-[#2563eb]' : 'bg-[#e2e8f0]'}`}></div>
            <div className={`h-1.5 rounded-full w-8 transition-all duration-500 ${step >= 2 ? 'bg-[#2563eb]' : 'bg-[#e2e8f0]'}`}></div>
          </div>

          <div className="relative w-full overflow-hidden pb-4">
            
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: step === 1 ? 'translateX(0)' : 'translateX(-100%)' }}
            >
              {/* ─── STEP 1 CONTAINER ─── */}
              <div 
                className="w-full shrink-0 transition-opacity duration-700 ease-in-out"
                style={{
                  opacity: step === 1 ? 1 : 0,
                  pointerEvents: step === 1 ? 'auto' : 'none'
                }}
              >
              <h2 className="text-3xl sm:text-[2.5rem] font-black text-[#0f172a] mb-2 tracking-tight">Join the Movement</h2>
              <p className="text-[#64748b] font-medium mb-10">Step 1 of 2: Basic Information</p>

              {submitError && step === 1 && (
                <div className="bg-red-50 text-red-600 p-3.5 rounded-xl mb-5 text-sm border border-red-100 flex items-start gap-2.5">
                  <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-[10px] font-bold">!</span>
                  {submitError}
                </div>
              )}

              <form onSubmit={handleContinueToStep2} noValidate className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-[#334155] mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Alex Rivera"
                    className={`w-full bg-[#f1f5f9] text-[#0f172a] rounded-xl px-4 py-4 outline-none transition-all placeholder:text-[#94a3b8] ${
                      fieldErrors.name ? 'ring-2 ring-red-400 bg-red-50' : 'focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/30 hover:bg-[#e2e8f0]'
                    }`}
                  />
                  {fieldErrors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{fieldErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#334155] mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@example.com"
                    className={`w-full bg-[#f1f5f9] text-[#0f172a] rounded-xl px-4 py-4 outline-none transition-all placeholder:text-[#94a3b8] ${
                      fieldErrors.email ? 'ring-2 ring-red-400 bg-red-50' : 'focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/30 hover:bg-[#e2e8f0]'
                    }`}
                  />
                  {fieldErrors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{fieldErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#334155] mb-2">Create Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full bg-[#f1f5f9] text-[#0f172a] rounded-xl pl-4 pr-12 py-4 outline-none transition-all placeholder:text-[#94a3b8] ${
                        fieldErrors.password ? 'ring-2 ring-red-400 bg-red-50' : 'focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/30 hover:bg-[#e2e8f0]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {fieldErrors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{fieldErrors.password}</p>}
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#2563eb] text-white rounded-xl py-4 font-bold text-base hover:bg-[#1d4ed8] transition-all shadow-[0_8px_20px_rgb(37,99,235,0.25)] hover:shadow-[0_8px_25px_rgb(37,99,235,0.35)] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Continue to Role Details'}
                  </button>
                </div>
              </form>

              {/* Bottom Feature Cards */}
              <div className="grid grid-cols-2 gap-4 mt-10">
                <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]/50">
                  <div className="flex items-center gap-2 mb-2 text-[#0f172a] font-bold text-xs uppercase tracking-wide">
                    <Shield className="w-4 h-4 text-[#2563eb]" />
                    Secure Payments
                  </div>
                  <p className="text-[11px] text-[#64748b] leading-relaxed">
                    Get paid the moment work is approved.
                  </p>
                </div>
                <div className="bg-[#faf5ff] rounded-xl p-4 border border-[#e9d5ff]/50">
                  <div className="flex items-center gap-2 mb-2 text-[#0f172a] font-bold text-xs uppercase tracking-wide">
                    <Zap className="w-4 h-4 text-[#a855f7]" />
                    AI Matching
                  </div>
                  <p className="text-[11px] text-[#64748b] leading-relaxed">
                    Find the perfect partner in seconds.
                  </p>
                </div>
              </div>
            </div>

            {/* ─── STEP 2 CONTAINER ─── */}
            <div 
              className="w-full shrink-0 transition-opacity duration-700 ease-in-out"
              style={{
                opacity: step === 2 ? 1 : 0,
                pointerEvents: step === 2 ? 'auto' : 'none'
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-3xl sm:text-[2.5rem] font-black text-[#0f172a] tracking-tight">You're in!</h2>
              </div>
              <p className="text-[#64748b] font-medium mb-10">Step 2 of 2: Optional Profile Setup</p>

              {submitError && step === 2 && (
                <div className="bg-red-50 text-red-600 p-3.5 rounded-xl mb-5 text-sm border border-red-100 flex items-start gap-2.5">
                  <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-[10px] font-bold">!</span>
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* Profile Picture Upload */}
                <div className="flex items-center gap-5 mb-8">
                  <input 
                    type="file" 
                    accept="image/jpeg, image/png, image/gif" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                  />
                  <div className="w-20 h-20 shrink-0 rounded-full bg-[#f1f5f9] border-2 border-dashed border-[#cbd5e1] flex items-center justify-center text-[#94a3b8] overflow-hidden">
                    {profilePicPreview ? (
                      <img src={profilePicPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      role === 'brand' ? <Briefcase className="w-8 h-8" /> : <Video className="w-8 h-8" />
                    )}
                  </div>
                  <div>
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()} 
                      className="text-sm font-bold text-[#2563eb] hover:underline mb-1"
                    >
                      {profilePicPreview ? 'Change Profile Picture' : 'Upload Profile Picture'}
                    </button>
                    <p className="text-xs text-[#64748b]">JPG, PNG or GIF (Max 5MB)</p>
                  </div>
                </div>

                {role === 'brand' ? (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-[#334155] mb-2">Company Website</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]"><Globe className="w-5 h-5"/></div>
                        <input
                          type="text"
                          name="website"
                          value={profileData.website}
                          onChange={handleProfileChange}
                          placeholder="https://yourbrand.com"
                          className="w-full bg-[#f1f5f9] text-[#0f172a] rounded-xl pl-12 pr-4 py-4 outline-none transition-all placeholder:text-[#94a3b8] focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/30 hover:bg-[#e2e8f0]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#334155] mb-2">Industry</label>
                      <input
                        type="text"
                        name="industry"
                        value={profileData.industry}
                        onChange={handleProfileChange}
                        placeholder="e.g. Fashion, Tech, Lifestyle"
                        className="w-full bg-[#f1f5f9] text-[#0f172a] rounded-xl px-4 py-4 outline-none transition-all placeholder:text-[#94a3b8] focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/30 hover:bg-[#e2e8f0]"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-[#334155] mb-2">Primary Social Handle</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]"><Hash className="w-5 h-5"/></div>
                        <input
                          type="text"
                          name="handle"
                          value={profileData.handle}
                          onChange={handleProfileChange}
                          placeholder="@username"
                          className="w-full bg-[#f1f5f9] text-[#0f172a] rounded-xl pl-12 pr-4 py-4 outline-none transition-all placeholder:text-[#94a3b8] focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/30 hover:bg-[#e2e8f0]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#334155] mb-2">Primary Content Category</label>
                      <input
                        type="text"
                        name="category"
                        value={profileData.category}
                        onChange={handleProfileChange}
                        placeholder="e.g. Beauty, Gaming, Travel"
                        className="w-full bg-[#f1f5f9] text-[#0f172a] rounded-xl px-4 py-4 outline-none transition-all placeholder:text-[#94a3b8] focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/30 hover:bg-[#e2e8f0]"
                      />
                    </div>
                  </>
                )}

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button" 
                    onClick={handleSkip}
                    disabled={loading}
                    className="flex-1 bg-white border border-[#e2e8f0] text-[#475569] rounded-xl py-4 font-bold text-base hover:bg-[#f8fafc] transition-all disabled:opacity-70"
                  >
                    Skip for now
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-[#2563eb] text-white rounded-xl py-4 font-bold text-base hover:bg-[#1d4ed8] transition-all shadow-[0_8px_20px_rgb(37,99,235,0.25)] hover:shadow-[0_8px_25px_rgb(37,99,235,0.35)] disabled:opacity-70"
                  >
                    {loading ? 'Saving...' : 'Save & Continue'}
                  </button>
                </div>
              </form>
            </div>
            </div>
            
          </div>

          <div className="mt-8 text-center pb-8">
            <p className="text-[11px] text-[#94a3b8]">
              By joining, you agree to our <a href="#" className="underline hover:text-[#64748b]">Terms of Service</a> and <a href="#" className="underline hover:text-[#64748b]">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
