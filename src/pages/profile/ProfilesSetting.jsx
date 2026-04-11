// src/pages/profile/ProfilesSetting.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Camera, Save, Trash2, Check, AlertCircle, User,
  Lock, ShieldAlert,
  ShieldClose, LogOut,
} from "lucide-react";
import { updateProfileComplete, updateUserFields } from "../../redux/slices/authSlice";
import {
  setProfileLoading, setProfileSaving, setProfileError,
  setProfileData,
} from "../../redux/slices/Profileslice";
import profileService from "../../services/profileService";
import CompletionBanner from "../../components/common/CompletionBanner";
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
    : "w-full h-32 rounded-2xl";

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
  const dispatch   = useDispatch();
  const { user }   = useSelector((state) => state.auth);
  const { completion, saving, loading } = useSelector((state) => state.profile);

  // Form states
  const [fullname, setFullname] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);

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

  const loadData = useCallback(async () => {
    dispatch(setProfileLoading(true));
    try {
      const data = await profileService.getMe();
      dispatch(setProfileData({ roleProfile: data.roleProfile, completion: data.completion }));
      setFullname(data.user?.fullname || "");
    } catch (err) {
      dispatch(setProfileError("Failed to load profile"));
    }
  }, [dispatch]);

  useEffect(() => { loadData(); }, [loadData]);

  const saveUserInfo = async () => {
    dispatch(setProfileSaving(true));
    try {
      const fd = new FormData();
      if (fullname.trim()) fd.append("fullname", fullname.trim());
      if (profilePic) fd.append("profilePic", profilePic);
      if (coverPic) fd.append("coverPic", coverPic);

      const data = await profileService.updateUserInfo(fd);
      dispatch(updateUserFields(data.user));
      dispatch(updateProfileComplete(data.completion?.isComplete));
      dispatch(setProfileData({ completion: data.completion }));
      showToast("Settings updated!");
    } catch (err) {
      showToast("Update failed", "error");
      dispatch(setProfileSaving(false));
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

      <CompletionBanner completion={completion} />

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
          <div className="flex gap-6 shrink-0">
            <AvatarUpload label="Avatar" currentUrl={user?.profilePic} onChange={setProfilePic} />
            <AvatarUpload label="Cover" currentUrl={user?.coverPic} onChange={setCoverPic} shape="rect" />
          </div>
          <div className="flex-1 space-y-6 max-w-2xl">
             <Field label="Full Name" required>
                <input type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} className={inputClass} placeholder="Enter your full name" />
             </Field>
             <div className="bg-gray-50/50 rounded-xl px-5 py-4 flex items-center gap-4 border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-400 shadow-sm">
                  <User size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-bold text-gray-900">{user?.email}</p>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2.5 py-1 rounded-md">Verified</span>
             </div>
          </div>
        </div>
      </SectionCard>

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