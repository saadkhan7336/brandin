// src/pages/profile/ProfilesSetting.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Camera, Save, Trash2, Check, AlertCircle, User,
  Lock, ShieldAlert,
  ShieldClose, LogOut,
  Plus, Instagram, Twitter, Linkedin, Youtube, Globe, Facebook,
  Shield, ShieldCheck, Zap, Info, ExternalLink,
  ChevronRight, Loader2, X, Link, File, UploadCloud, CreditCard
} from "lucide-react";
import PaymentSettings from "./PaymentSettings";
import { updateProfileComplete, updateUserFields } from "../../redux/slices/authSlice";
import {
  setProfileLoading, setProfileSaving, setProfileError,
  setProfileData,
} from "../../redux/slices/Profileslice";
import profileService from "../../services/profileService";
import { cn } from "../../utils/helper";

// ── Avatar upload area (Standardized) ───────────────────────────────────────────
function AvatarUpload({ label, currentUrl, onChange, shape = "circle", size = "lg" }) {
  const inputRef = useRef();
  const [preview, setPreview] = useState(currentUrl || "");

  useEffect(() => { setPreview(currentUrl || ""); }, [currentUrl]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  const isCircle = shape === "circle";
  const containerClass = isCircle
    ? `${size === "lg" ? "w-24 h-24" : "w-16 h-16"} rounded-2xl`
    : "w-full max-w-[280px] h-24 md:h-24 rounded-2xl aspect-[3/1]";

  return (
    <div className="flex flex-col items-center gap-2.5 group">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative overflow-hidden border border-gray-100 shadow-sm",
          "hover:scale-[1.01] transition-all duration-300 bg-gray-50",
          containerClass
        )}
      >
        {preview ? (
          <img src={preview} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
            <Camera size={20} className="text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera size={20} className="text-white" />
        </div>
      </button>
      <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
        {label}
      </p>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

// ── Section card wrapper (Standardized) ─────────────────────────────────────────
function SectionCard({ title, description, children, saving, onSave, saveLabel = "Save changes", icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300">
      <div className="px-8 py-6 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center gap-3">
          {Icon && <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Icon size={18} /></div>}
          <div>
            <h2 className="text-base font-bold text-gray-900 leading-tight">{title}</h2>
            {description && <p className="text-xs font-medium text-gray-400 mt-0.5">{description}</p>}
          </div>
        </div>
        {onSave && (
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-black disabled:opacity-50
              text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all"
          >
            {saving ? (
              <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {saving ? "Updating..." : saveLabel}
          </button>
        )}
      </div>
      <div className="p-8 space-y-6">{children}</div>
    </div>
  );
}

// ── Field component (Standardized) ──────────────────────────────────────────────
function Field({ label, required, children, icon: Icon }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider ml-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}

const inputClass = "w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3 text-sm font-bold text-gray-700 " +
  "placeholder:text-gray-300 placeholder:font-medium focus:ring-2 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all focus:outline-none shadow-sm";

export default function ProfileSettings() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { saving, loading } = useSelector((state) => state.profile);

  // Form states
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState(""); // Influencer only
  const [about, setAbout] = useState("");       // Influencer only
  const [category, setCategory] = useState(""); // Influencer only
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  
  // Portfolio state
  const [portfolio, setPortfolio] = useState([]);
  const [newPortfolioFiles, setNewPortfolioFiles] = useState([]);
  const [portfolioLink, setPortfolioLink] = useState({ title: "", url: "" });

  // Social Links state

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [showManageAccount, setShowManageAccount] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Verified Platforms state — { youtube: true, instagram: false, ... }
  const [verifiedPlatforms, setVerifiedPlatforms] = useState({});
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  // Email OTP state
  const [isOTPsent, setIsOTPsent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [connectingPlatform, setConnectingPlatform] = useState(null);

  useEffect(() => {
    let timer;
    if (otpCooldown > 0) {
      timer = setInterval(() => setOtpCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpCooldown]);

  const loadData = useCallback(async () => {
    dispatch(setProfileLoading(true));
    try {
      const data = await profileService.getMe();
      const roleProfile = data.roleProfile || {};
      dispatch(setProfileData({ roleProfile, completion: data.completion }));
      setFullname(data.user?.fullname || "");
      setUsername(roleProfile.username || "");
      setAbout(roleProfile.about || "");
      setCategory(roleProfile.category || "");
      setPortfolio(Array.isArray(roleProfile.portfolio) ? roleProfile.portfolio : []);


      // Load verified platforms from user data
      if (data.user?.verifiedPlatforms) {
        // verifiedPlatforms is an ARRAY from the backend
        const vpArray = Array.from(data.user.verifiedPlatforms || []);
        const vpMap = {};
        vpArray.forEach(p => {
          if (p.platform && p.verified) vpMap[p.platform] = p;
        });
        setVerifiedPlatforms(vpMap);

        // Initialize selected platforms from verified platforms and legacy socialMedia
        const sm = roleProfile.socialMedia || {};
        const platforms = new Set([
          ...Object.keys(vpMap),
          ...Object.keys(sm).filter(k => sm[k] || sm[k] === "") // Include all keys in Map
        ]);
        
        // Filter to only include supported platforms
        const supported = ['youtube', 'instagram', 'tiktok', 'linkedin', 'twitter', 'facebook'];
        setSelectedPlatforms(Array.from(platforms).filter(p => supported.includes(p)));
      } else {
        // Fallback for socialMedia if verifiedPlatforms doesn't exist
        const sm = roleProfile.socialMedia || {};
        const supported = ['youtube', 'instagram', 'tiktok', 'linkedin', 'twitter', 'facebook'];
        setSelectedPlatforms(Object.keys(sm).filter(p => supported.includes(p)));
      }
    } catch (err) {
      dispatch(setProfileError("Failed to load profile"));
    }
  }, [dispatch]);

  useEffect(() => { loadData(); }, [loadData]);

  // Helper to format bytes
  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const saveUserInfo = async () => {
    dispatch(setProfileSaving(true));
    try {
      // 1. Update Core User Info
      const userFd = new FormData();
      if (fullname.trim()) userFd.append("fullname", fullname.trim());
      if (profilePic) userFd.append("profilePic", profilePic);
      if (coverPic) userFd.append("coverPic", coverPic);

      const userData = await profileService.updateUserInfo(userFd);
      dispatch(updateUserFields(userData.user));

      if (user?.role === 'brand') {
        const brandFd = new FormData();
        brandFd.append("socialMediaUpdate", "true");
        // Pass selected platforms as socialMedia[platformName] = "" 
        // this allows the backend to know which keys to keep in the Map
        selectedPlatforms.forEach(p => {
          brandFd.append(`socialMedia[${p}]`, "");
        });

        // Sync logo for brand
        if (profilePic) brandFd.append("logo", profilePic);
        
        const brandRes = await profileService.updateBrandProfile(brandFd);
        dispatch(setProfileData({ roleProfile: brandRes.brand, completion: brandRes.completion }));
        if (brandRes.user) {
          dispatch(updateUserFields(brandRes.user));
          dispatch(updateProfileComplete(brandRes.completion?.isComplete));
        }
      } else if (user?.role === 'influencer') {
        const infFd = new FormData();
        infFd.append("username", username);
        infFd.append("about", about);
        infFd.append("category", category);
        infFd.append("socialMediaUpdate", "true");

        // Sync cover for influencer
        if (coverPic) infFd.append("coverImage", coverPic);
        
        const socialMedia = {};
        selectedPlatforms.forEach(p => socialMedia[p] = "");
        infFd.append("socialMedia", JSON.stringify(socialMedia));

        // Append existing portfolio items (links and already uploaded files)
        infFd.append("portfolio", JSON.stringify(portfolio));

        // Append new portfolio files
        newPortfolioFiles.forEach(file => {
          infFd.append("portfolioFiles", file);
        });

        const infRes = await profileService.updateInfluencerProfile(infFd);
        dispatch(setProfileData({ roleProfile: infRes.influencer, completion: infRes.completion }));
        setPortfolio(Array.isArray(infRes.influencer.portfolio) ? infRes.influencer.portfolio : []);
        setNewPortfolioFiles([]);
        if (infRes.user) {
          dispatch(updateUserFields(infRes.user));
          dispatch(updateProfileComplete(infRes.completion?.isComplete));
        }
      }

      dispatch(updateProfileComplete(userData.completion?.isComplete));
      showToast("Settings updated!");
    } catch (err) {
      showToast("Update failed", "error");
    } finally {
      dispatch(setProfileSaving(false));
    }
  };


  // ── OAuth connect handler ───────────────────────────────────────────────────
  const handleConnect = async (platform) => {
    setConnectingPlatform(platform);
    // All platforms now use central OAuth logic via backend redirect
    const backendUrl = "http://localhost:8000/api/v1/oauth";
    window.location.href = `${backendUrl}/${platform}/connect`;
  };

  // ── Revoke platform verification (for testing / reset) ─────────────────────
  const handleRevoke = async (platform) => {
    try {
      await profileService.revokeVerify(platform);
      setVerifiedPlatforms(prev => {
        const next = { ...prev };
        delete next[platform];
        return next;
      });
      showToast(`${platform} verification revoked`);
    } catch {
      showToast('Failed to revoke', 'error');
    }
  };


  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) return showToast("Fields missing", "error");
    if (newPassword !== confirmPassword) return showToast("Passwords mismatch", "error");

    setIsChangingPassword(true);
    try {
      await profileService.changePassword(oldPassword, newPassword);
      showToast("Password updated!");
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed", "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSendOTP = async () => {
    if (otpCooldown > 0) return;
    try {
      await profileService.sendOTP();
      setIsOTPsent(true);
      setOtpCooldown(60); // 1 minute cooldown
      showToast("Verification code sent!");
    } catch (err) {
      showToast("Failed to send code", "error");
    }
  };

  const handleVerifyOTP = async () => {
    if (otpValue.length !== 6) return showToast("Enter 6-digit code", "error");
    setIsVerifying(true);
    try {
      await profileService.verifyOTP(otpValue);
      showToast("Email verified successfully!");
      setIsOTPsent(false);
      setOtpValue("");
      // Update local and redux state
      const updatedUser = { ...user, isVerified: true };
      dispatch(updateUserFields(updatedUser));
    } catch (err) {
      showToast(err.response?.data?.message || "Verification failed", "error");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      dispatch(setProfileSaving(true));
      await profileService.deactivateAccount();
      showToast("Account deactivated.");
      setTimeout(() => window.location.href = "/", 2000);
    } catch (err) {
      showToast("Deactivation failed", "error");
      dispatch(setProfileSaving(false));
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(setProfileSaving(true));
      await profileService.deleteAccount();
      showToast("Account deleted.");
      setTimeout(() => window.location.href = "/", 2000);
    } catch (err) {
      showToast("Deletion failed", "error");
      dispatch(setProfileSaving(false));
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-sm" />
      <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Settings...</p>
    </div>
  );

  return (
    <div className="w-full max-w-[1800px] mx-auto space-y-8 pb-24 px-4 md:px-8">
      {/* Header */}
      <div className="flex flex-col gap-1 pt-8 border-b border-gray-100 pb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
        <p className="text-gray-500 font-medium text-sm">Control your platform identity and security settings.</p>
      </div>



      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed bottom-10 right-10 z-50 flex items-center gap-3 px-6 py-3.5 rounded-2xl shadow-xl text-white font-bold animate-in slide-in-from-right-10",
          toast.type === "success" ? "bg-gray-900" : "bg-red-600"
        )}>
          {toast.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      {/* Section 1: Basic Info */}
      <SectionCard title="Basic Identity" saving={saving} onSave={saveUserInfo} icon={User}>
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0">
            <AvatarUpload 
              label={user?.role === 'brand' ? "Logo" : "Avatar"} 
              currentUrl={user?.profilePic} 
              onChange={setProfilePic} 
            />
            <AvatarUpload 
              label="Cover Banner" 
              currentUrl={user?.coverPic} 
              onChange={setCoverPic} 
              shape="rect" 
            />
          </div>
          <div className="flex-1 space-y-6 max-w-2xl">
            <Field label="Full Name" required>
              <input type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} className={inputClass} placeholder="Enter your full name" />
            </Field>

            {user?.role === 'influencer' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Username (Display Name)" required>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} placeholder="e.g. @cool_influencer" />
                  </Field>
                  <Field label="Niche / Category" required>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                      <option value="" disabled>Select your niche</option>
                      {["Fashion", "Technology", "Food & Beverage", "Beauty", "Lifestyle", "Fitness", "Travel", "Gaming", "Entertainment", "Finance", "Healthcare", "Art & Design", "Sports", "Other"].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="Bio (About Me)" required>
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className={cn(inputClass, "min-h-[100px] py-4 shadow-sm")}
                    placeholder="Tell brands about your style, audience, and content..."
                  />
                </Field>
              </>
            )}
            <div className="bg-gray-50/50 rounded-xl px-5 py-4 flex items-center gap-4 border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-400 shadow-sm">
                <User size={18} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                <p className="text-sm font-bold text-gray-900">{user?.email}</p>
              </div>
              {user?.isVerified ? (
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Check size={10} /> Verified
                </span>
              ) : (
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">Unverified</span>
              )}
            </div>

          </div>
        </div>
      </SectionCard>
      
      {/* Section: Portfolio (Influencer Only) */}
      {user?.role === 'influencer' && (
        <SectionCard 
          title="Professional Portfolio" 
          description="Showcase your best work to brands. Add links or upload PDF portfolios."
          saving={saving} 
          onSave={saveUserInfo} 
          icon={Globe}
        >
          <div className="space-y-8">
            {/* Add New Item */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Add Link */}
              <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Link size={16} className="text-blue-500" />
                  <h3 className="text-sm font-bold text-gray-900">Add Project Link</h3>
                </div>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Project Title (e.g. Summer Campaign 2023)"
                    className={inputClass}
                    value={portfolioLink.title}
                    onChange={(e) => setPortfolioLink(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <input 
                      type="url" 
                      placeholder="https://..."
                      className={inputClass}
                      value={portfolioLink.url}
                      onChange={(e) => setPortfolioLink(prev => ({ ...prev, url: e.target.value }))}
                    />
                    <button 
                      onClick={() => {
                        if (!portfolioLink.title || !portfolioLink.url) return showToast("Enter title and URL", "error");
                        setPortfolio(prev => [...prev, { ...portfolioLink, type: "link" }]);
                        setPortfolioLink({ title: "", url: "" });
                      }}
                      className="p-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Upload File */}
              <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <File size={16} className="text-blue-500" />
                  <h3 className="text-sm font-bold text-gray-900">Upload Portfolio File</h3>
                </div>
                <div 
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group"
                  onClick={() => document.getElementById('portfolio-file-input').click()}
                >
                  <UploadCloud size={24} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Click to upload (PDF, Images)</p>
                  <input 
                    id="portfolio-file-input"
                    type="file" 
                    className="hidden" 
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setNewPortfolioFiles(prev => [...prev, ...files]);
                    }}
                  />
                </div>
                {newPortfolioFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Uploads ({newPortfolioFiles.length})</p>
                    {newPortfolioFiles.map((f, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100 text-xs font-bold text-gray-600">
                        <span className="truncate max-w-[200px]">{f.name}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setNewPortfolioFiles(prev => prev.filter((_, idx) => idx !== i));
                          }}
                          className="text-red-400 hover:text-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Existing Portfolio Items */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Portfolio Items</h3>
              {(!Array.isArray(portfolio) || portfolio.length === 0) && newPortfolioFiles.length === 0 ? (
                <div className="p-12 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your portfolio is empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(Array.isArray(portfolio) ? portfolio : []).map((item, idx) => (
                    <div key={idx} className="group relative bg-white p-4 rounded-2xl border border-gray-100 hover:border-blue-100 transition-all hover:shadow-md">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            {item.type === 'link' ? <Link size={16} /> : <File size={16} />}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 truncate pr-4">{item.title}</h4>
                            <div className="flex items-center gap-2">
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-1"
                              >
                                View {item.type === 'link' ? 'Link' : 'File'} <ExternalLink size={8} />
                              </a>
                              {item.type === 'file' && item.fileSize > 0 && (
                                <span className="text-[10px] text-gray-400 font-medium tracking-tight">
                                  ({formatBytes(item.fileSize)})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => setPortfolio(prev => prev.filter((_, i) => i !== idx))}
                          className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SectionCard>
      )}

      {/* Section 2: Security */}
      <SectionCard title="Security & Password" saving={isChangingPassword} onSave={handlePasswordChange} icon={Lock}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Field label="Current Password">
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
          </Field>
          <Field label="New Password">
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} placeholder="Minimum 6 characters" />
          </Field>
          <Field label="Confirm New Password">
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} placeholder="Repeat new password" />
          </Field>
        </div>
      </SectionCard>

      {/* ── Verify Your Profile ───────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 mb-8 mt-8">
        <div className="px-8 py-6 flex items-center justify-between border-b border-gray-50 bg-gray-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Shield size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-tight">Verify Your Profile</h2>
              <p className="text-xs font-medium text-gray-400 mt-0.5">
                Connect your social platforms via OAuth to get your Verified badge and boost brand trust.
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Email Verification Card */}
          <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-blue-50">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Verify Your Email</h3>
                  <p className="text-[11px] font-medium text-gray-500">Registered Email: <span className="text-gray-900 font-bold">{user?.email}</span></p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {user?.isVerified ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 text-[11px] font-bold uppercase tracking-wider rounded-xl border border-emerald-100">
                    <Check size={14} />
                    Email Verified ✅
                  </div>
                ) : (
                  !isOTPsent && (
                    <button
                      onClick={handleSendOTP}
                      disabled={otpCooldown > 0}
                      className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-md shadow-blue-500/10"
                    >
                      {otpCooldown > 0 ? `Resend in ${otpCooldown}s` : "Verify Email Now"}
                    </button>
                  )
                )}
              </div>
            </div>

            {!user?.isVerified && isOTPsent && (
              <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-4 max-w-md bg-white p-4 rounded-xl border border-blue-50 shadow-sm">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enter 6-Digit OTP</label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          maxLength={6}
                          value={otpValue}
                          onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                          placeholder="000000"
                          className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-center text-lg font-black tracking-[0.5em] text-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                        <button
                          onClick={handleVerifyOTP}
                          disabled={isVerifying || otpValue.length !== 6}
                          className="px-8 py-2 bg-gray-900 hover:bg-black disabled:opacity-50 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-lg"
                        >
                          {isVerifying ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                          Submit OTP
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-medium text-gray-400">Code sent to your inbox.</p>
                      <button
                        onClick={handleSendOTP}
                        disabled={otpCooldown > 0}
                        className="text-[10px] font-bold text-blue-600 hover:underline disabled:opacity-30 uppercase tracking-widest"
                      >
                        {otpCooldown > 0 ? `Resend in ${otpCooldown}s` : "Resend OTP"}
                      </button>
                    </div>
                  </div>
              </div>
            )}
          </div>
          {/* Profile Status Badge */}
          {(() => {
            const verifiedCount = selectedPlatforms.filter(p => verifiedPlatforms[p]).length;
            const totalCount = selectedPlatforms.length;
            const isFullyVerified = totalCount > 0 && verifiedCount === totalCount;
            return (
              <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                <div className="space-y-0.5 flex-1">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Verification Progress</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-gray-500">
                      {totalCount > 0
                        ? `${verifiedCount} OF ${totalCount} SELECTED PLATFORMS VERIFIED VIA OAUTH`
                        : "SELECT A PLATFORM BELOW TO START VERIFICATION"}
                    </p>
                    <div className="px-1.5 py-0.5 bg-blue-50 text-blue-500 rounded text-[8px] font-black uppercase tracking-tighter">
                      <Zap size={8} className="inline mr-0.5" /> Fast Track
                    </div>
                  </div>
                </div>
                {totalCount > 0 && (
                  isFullyVerified ? (
                    <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-emerald-100 shadow-sm">
                      <div className="text-right">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Profile Status</p>
                        <p className="text-[11px] font-black text-emerald-600 uppercase tracking-wider">Verified ✓</p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <ShieldCheck size={16} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-amber-100 shadow-sm">
                      <div className="text-right">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Profile Status</p>
                        <p className="text-[11px] font-black text-amber-600 uppercase tracking-wider">Unverified ({verifiedCount}/{totalCount})</p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                        <AlertCircle size={16} />
                      </div>
                    </div>
                  )
                )}
              </div>
            );
          })()}

          {/* Platform Selector Dropdown */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-blue-50/20 rounded-2xl border border-blue-50">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Add Social Platform</h3>
                <p className="text-[10px] font-medium text-gray-500">Select which platforms you want to verify and display on your profile.</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  onChange={async (e) => {
                    const val = e.target.value;
                    if (val && !selectedPlatforms.includes(val)) {
                      const newSelected = [...selectedPlatforms, val];
                      setSelectedPlatforms(newSelected);
                      
                      try {
                        if (user?.role === 'brand') {
                          const brandFd = new FormData();
                          brandFd.append("socialMediaUpdate", "true");
                          newSelected.forEach(p => brandFd.append(`socialMedia[${p}]`, ""));
                          await profileService.updateBrandProfile(brandFd);
                        } else if (user?.role === 'influencer') {
                          const socialMedia = {};
                          newSelected.forEach(p => socialMedia[p] = "");
                          await profileService.updateInfluencerProfile({ socialMediaUpdate: true, socialMedia });
                        }
                        showToast(`${val} added to your platforms`);
                      } catch (err) {
                        showToast(`Failed to save ${val}`, 'error');
                      }
                    }
                    e.target.value = "";
                  }}
                  className={cn(inputClass, "w-full sm:w-48 py-2 px-4 shadow-none")}
                >
                  <option value="">Select Platform...</option>
                  {[
                    { id: 'youtube', label: 'YouTube' },
                    { id: 'instagram', label: 'Instagram' },
                    { id: 'facebook', label: 'Facebook' },
                    { id: 'tiktok', label: 'TikTok' },
                    { id: 'linkedin', label: 'LinkedIn' },
                    { id: 'twitter', label: 'Twitter / X' }
                  ].filter(p => !selectedPlatforms.includes(p.id)).map(p => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Plus size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* Your Platforms List */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Selected Platforms</h3>
            </div>

            <div className="space-y-3">
              {selectedPlatforms.length === 0 && (
                <div className="p-12 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No platforms selected yet.</p>
                </div>
              )}
              {selectedPlatforms.map((platform) => {
                const isVerified = !!verifiedPlatforms[platform];
                const platformData = verifiedPlatforms[platform] || {};

                return (
                  <div key={platform} className="group flex flex-col sm:flex-row items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-blue-100 transition-all hover:shadow-md">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isVerified
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600'
                        }`}>
                        {platform === 'instagram' && <Instagram size={20} />}
                        {platform === 'linkedin' && <Linkedin size={20} />}
                        {platform === 'youtube' && <Youtube size={20} />}
                        {platform === 'twitter' && <Twitter size={20} />}
                        {platform === 'facebook' && <Facebook size={20} />}
                        {platform === 'tiktok' && (
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-gray-900 capitalize">
                            {platform === 'twitter' ? 'Twitter / X' : platform}
                          </h4>
                          {isVerified ? (
                            <span className="text-[8px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <ShieldCheck size={8} /> Verified
                            </span>
                          ) : (
                            <span className="text-[8px] font-bold uppercase tracking-widest bg-amber-50 text-amber-500 px-1.5 py-0.5 rounded">
                              Not Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-gray-400 truncate max-w-[200px]">
                          {isVerified ? (platformData.username || 'Account Connected') : `Connect your ${platform} account`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                      {isVerified ? (
                        <div className="flex items-center gap-2 flex-1 sm:flex-none">
                          <div className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-50 text-emerald-600 text-[11px] font-bold uppercase tracking-wider rounded-xl border border-emerald-100">
                            <ShieldCheck size={14} />
                            Verified
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleConnect(platform)}
                          disabled={connectingPlatform === platform}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
                        >
                          {connectingPlatform === platform ? (
                            <><Loader2 size={14} className="animate-spin" /> Verifying…</>
                          ) : (
                            <>Connect {platform}<ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" /></>
                          )}
                        </button>
                      )}

                      <button
                        title="Remove Platform"
                        onClick={async () => {
                          try {
                            if (isVerified) {
                              await handleRevoke(platform);
                            }
                            const newSelected = selectedPlatforms.filter(p => p !== platform);
                            setSelectedPlatforms(newSelected);
                            
                            if (user?.role === 'brand') {
                              const brandFd = new FormData();
                              brandFd.append("socialMediaUpdate", "true");
                              newSelected.forEach(p => brandFd.append(`socialMedia[${p}]`, ""));
                              await profileService.updateBrandProfile(brandFd);
                            } else if (user?.role === 'influencer') {
                              const socialMedia = {};
                              newSelected.forEach(p => socialMedia[p] = "");
                              await profileService.updateInfluencerProfile({ socialMediaUpdate: true, socialMedia });
                            }
                            
                            showToast(`${platform} removed from selection`);
                          } catch (err) {
                            showToast(`Failed to remove ${platform}`, 'error');
                          }
                        }}
                        className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Why verify Section */}
          <div className="bg-blue-50/30 rounded-3xl p-8 space-y-6 border border-blue-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">Why verify your profile?</h3>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                Learn More <ExternalLink size={12} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Zap, label: "Higher AI match ranking" },
                { icon: ShieldCheck, label: "Increased brand trust" },
                { icon: ShieldClose, label: "Access to premium campaigns" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3 shadow-sm hover:scale-[1.02] transition-all">
                  <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
                    <Check size={12} className="text-blue-500" />
                  </div>
                  <p className="text-[11px] font-bold text-gray-600 tracking-tight leading-tight">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center flex-col items-center gap-2 border-t border-blue-100/50 pt-6">
              <p className="text-[10px] font-medium text-gray-400 flex items-center gap-1.5">
                <Info size={12} className="text-blue-400" /> Your data is processed securely through official platform APIs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Payments & Payouts */}
      <div id="payments" className="pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <CreditCard size={18} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Payments & Financials</h2>
            <p className="text-sm font-medium text-gray-500">Manage your payment methods and view transaction history.</p>
          </div>
        </div>
        <PaymentSettings user={user} />
      </div>

      {/* Section 3: Danger Zone */}
      <div className="bg-red-50/30 rounded-2xl border border-red-100 p-8 md:p-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-red-900">Danger Zone</h3>
            <p className="text-sm font-medium text-red-600/70">These actions are irreversible. Please proceed with caution.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Deactivate */}
          <div className="bg-white p-6 rounded-2xl border border-red-100 flex flex-col justify-between items-start gap-5 shadow-sm">
            <div>
              <h4 className="font-bold text-red-900 flex items-center gap-2 tracking-tight"><ShieldClose size={18} /> Deactivate Account</h4>
              <p className="text-xs font-medium text-gray-500 mt-2 leading-relaxed">
                Temporarily hide your profile and active campaigns. You can reactivate at any time by logging back in.
              </p>
            </div>
            {showManageAccount === 'deactivate' ? (
              <div className="flex gap-2 w-full">
                <button onClick={handleDeactivate} className="flex-1 bg-red-600 text-white text-xs font-bold uppercase py-2.5 rounded-lg hover:bg-red-700 transition-colors">Confirm</button>
                <button onClick={() => setShowManageAccount(null)} className="flex-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase py-2.5 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setShowManageAccount('deactivate')} className="w-full py-2.5 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-red-100 transition-colors">Deactivate Now</button>
            )}
          </div>

          {/* Delete */}
          <div className="bg-white p-6 rounded-2xl border border-red-100 flex flex-col justify-between items-start gap-5 shadow-sm">
            <div>
              <h4 className="font-bold text-red-900 flex items-center gap-2 tracking-tight"><Trash2 size={18} /> Delete Permanently</h4>
              <p className="text-xs font-medium text-gray-500 mt-2 leading-relaxed">
                Careful: This will wipe your account, history, and collaborations forever from our database.
              </p>
            </div>
            {showManageAccount === 'delete' ? (
              <div className="flex gap-2 w-full">
                <button onClick={handleDelete} className="flex-1 bg-red-900 text-white text-xs font-bold uppercase py-2.5 rounded-lg hover:bg-black transition-colors">Confirm Delete</button>
                <button onClick={() => setShowManageAccount(null)} className="flex-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase py-2.5 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setShowManageAccount('delete')} className="w-full py-2.5 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-red-100 transition-colors">Delete Account</button>
            )}
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <button onClick={() => window.location.href = "/"} className="flex items-center gap-2 text-red-500 hover:text-red-700 font-bold text-xs bg-white px-8 py-3 rounded-full border border-red-100 shadow-sm transition-all hover:shadow-md active:scale-95">
            <LogOut size={16} /> Sign out of account
          </button>
        </div>
      </div>
    </div>
  );
}