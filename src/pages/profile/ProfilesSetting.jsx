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

// ── Avatar upload area (Modernized) ───────────────────────────────────────────
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
    ? `${size === "lg" ? "w-24 h-24" : "w-16 h-16"} rounded-3xl`
    : "w-full h-32 rounded-3xl";

  return (
    <div className="flex flex-col items-center gap-3 group">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative overflow-hidden border-4 border-white shadow-xl shadow-slate-200/50",
          "hover:scale-[1.02] transition-all duration-300 bg-slate-50",
          containerClass
        )}
      >
        {preview ? (
          <img src={preview} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Camera size={20} className="text-slate-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera size={20} className="text-white" />
        </div>
      </button>
      <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 group-hover:text-blue-500 transition-colors">
        {label}
      </p>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

// ── Section card wrapper (Modernized) ─────────────────────────────────────────
function SectionCard({ title, description, children, saving, onSave, saveLabel = "Save changes", icon: Icon }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/40 overflow-hidden group/card hover:shadow-blue-900/5 transition-all duration-500">
      <div className="px-10 py-8 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-3">
             {Icon && <Icon size={20} className="text-blue-600" />} {title}
          </h2>
          {description && <p className="text-sm font-medium text-slate-400 mt-1">{description}</p>}
        </div>
        {onSave && (
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50
              text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-2xl transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {saving ? "Wait..." : saveLabel}
          </button>
        )}
      </div>
      <div className="px-10 pb-10 space-y-6">{children}</div>
    </div>
  );
}

// ── Field component (Modernized) ──────────────────────────────────────────────
function Field({ label, required, children, icon: Icon }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative group/field">
        {Icon && <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-blue-500 transition-colors" />}
        <div className={cn("transition-all duration-300", Icon ? "pl-0" : "")}>
           {children}
        </div>
      </div>
    </div>
  );
}

const inputClass = "w-full bg-slate-50 border-0 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 " +
  "placeholder:text-slate-300 placeholder:font-medium focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all";

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
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

  const [showManageAccount, setShowManageAccount] = useState(null); // 'delete' or 'deactivate'

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
      showToast("Account deactivated. Redirecting...");
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

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="w-full max-w-[1800px] mx-auto space-y-10 pb-24 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-end justify-between px-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 font-medium">Control your platform identity and security.</p>
        </div>
      </div>

      <CompletionBanner completion={completion} />

      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed bottom-10 right-10 z-50 flex items-center gap-3 px-6 py-4 rounded-[1.5rem] shadow-2xl text-white font-bold animate-in slide-in-from-right-10",
          toast.type === "success" ? "bg-slate-900" : "bg-rose-600"
        )}>
          {toast.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      {/* Section 1: Basic Info */}
      <SectionCard title="Basic Identity" saving={saving} onSave={saveUserInfo} icon={User}>
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex gap-6">
            <AvatarUpload label="Avatar" currentUrl={user?.profilePic} onChange={setProfilePic} />
            <AvatarUpload label="Story Cover" currentUrl={user?.coverPic} onChange={setCoverPic} shape="rect" />
          </div>
          <div className="flex-1 space-y-6">
             <Field label="Personal Name" required>
                <input type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} className={inputClass} />
             </Field>
             <div className="bg-slate-50 rounded-[1.5rem] p-5 flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-colors">
                  <User size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-slate-900">{user?.email}</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter text-slate-300 bg-slate-100 px-2 py-1 rounded-md">Locked</span>
             </div>
          </div>
        </div>
      </SectionCard>

      {/* Section 2: Security */}
      <SectionCard title="Security" saving={isChangingPassword} onSave={handlePasswordChange} icon={Lock}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Field label="Current Password">
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
          </Field>
          <Field label="New Password">
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} placeholder="Min 6 chars" />
          </Field>
          <Field label="Confirm">
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} placeholder="Repeat new" />
          </Field>
        </div>
      </SectionCard>

      {/* Section 3: Danger Zone */}
      <div className="bg-rose-50/50 backdrop-blur-sm rounded-[2.5rem] border border-rose-100 p-10 space-y-8">
        <div className="flex items-center gap-4 text-rose-600">
           <ShieldAlert size={28} />
           <div>
             <h3 className="text-xl font-black tracking-tight text-rose-900">Danger Zone</h3>
             <p className="text-sm font-medium text-rose-600/70">These actions are irreversible or highly impactful.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
           {/* Deactivate */}
           <div className="bg-white p-6 rounded-[2rem] border border-rose-100 flex flex-col justify-between items-start gap-4 h-full shadow-sm">
             <div>
                <h4 className="font-bold text-rose-900 flex items-center gap-2 italic"><ShieldClose size={16} /> Deactivate Account</h4>
                <p className="text-xs font-medium text-slate-400 mt-2 leading-relaxed">
                  Hide your profile and campaigns temporarily. Logging back in will reactivate your account instantly.
                </p>
             </div>
             {showManageAccount === 'deactivate' ? (
                <div className="flex gap-2 w-full animate-in zoom-in-95 duration-200">
                  <button onClick={handleDeactivate} className="flex-1 bg-rose-600 text-white text-[10px] font-black uppercase py-2.5 rounded-xl">Confirm</button>
                  <button onClick={() => setShowManageAccount(null)} className="flex-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase py-2.5 rounded-xl">Back</button>
                </div>
             ) : (
                <button onClick={() => setShowManageAccount('deactivate')} className="w-full py-3 bg-rose-50 text-rose-600 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-rose-100 transition-colors">Deactivate Now</button>
             )}
           </div>

           {/* Delete */}
           <div className="bg-white p-6 rounded-[2rem] border border-rose-100 flex flex-col justify-between items-start gap-4 h-full shadow-sm">
             <div>
                <h4 className="font-bold text-rose-900 flex items-center gap-2 italic"><Trash2 size={16} /> Delete Forever</h4>
                <p className="text-xs font-medium text-slate-400 mt-2 leading-relaxed">
                  Permanently delete everything. All collaborations and history will be wiped from our servers.
                </p>
             </div>
             {showManageAccount === 'delete' ? (
                <div className="flex gap-2 w-full animate-in zoom-in-95 duration-200">
                  <button onClick={handleDelete} className="flex-1 bg-rose-900 text-white text-[10px] font-black uppercase py-2.5 rounded-xl">Yes, Delete</button>
                  <button onClick={() => setShowManageAccount(null)} className="flex-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase py-2.5 rounded-xl">Back</button>
                </div>
             ) : (
                <button onClick={() => setShowManageAccount('delete')} className="w-full py-3 bg-rose-50 text-rose-600 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-rose-100 transition-colors">Delete Account</button>
             )}
           </div>
        </div>

        <div className="flex justify-center pt-4">
           <button onClick={() => window.location.href = "/"} className="flex items-center gap-2 text-rose-400 hover:text-rose-600 transition-colors text-xs font-bold bg-white px-6 py-3 rounded-full border border-rose-100">
             <LogOut size={16} /> Sign out instead
           </button>
        </div>
      </div>
    </div>
  );
}