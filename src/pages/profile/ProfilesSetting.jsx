// src/pages/profile/ProfileSettings.jsx
// Role-aware profile settings page.
// Loads GET /users/me on mount, then provides three save sections:
//   1. User Info   → PATCH /users/update-profile
//   2. Brand Info  → PATCH /brands/update-profile   (brand only)
//   2. Influencer  → PATCH /influencers/update-profile (influencer only)

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  Camera, Save, Plus, Trash2, Globe, Instagram, Youtube,
  Twitter, Linkedin, Facebook, Check, AlertCircle, User,
  ChevronDown, MapPin,
  ChevronUp, ExternalLink,
} from "lucide-react";
import { updateProfileComplete, updateUserFields } from "../../redux/slices/authSlice";
import {
  setProfileLoading, setProfileSaving, setProfileError,
  setProfileData,
} from "../../redux/slices/Profileslice";
import profileService from "../../services/profileService";
import CompletionBanner from "../../components/common/CompletionBanner";
import { cn } from "../../utils/helper";

// ── Constants ─────────────────────────────────────────────────────────────────
const PLATFORM_OPTIONS = ["Instagram", "YouTube", "TikTok", "Twitter", "Facebook", "LinkedIn"];
const CONTENT_TYPES = ["Post", "Reel", "Story", "Vlog", "Photo Shoot", "Appearance", "Short", "Thread"];
const CATEGORY_OPTIONS = [
  "Fashion", "Beauty", "Food", "Travel", "Fitness", "Tech",
  "Gaming", "Lifestyle", "Finance", "Education", "Entertainment",
  "Sports", "Music", "Art", "Business",
];
const INDUSTRY_OPTIONS = [
  "Fashion", "Beauty", "Food & Beverage", "Travel", "Fitness & Wellness",
  "Technology", "Gaming", "Finance", "Education", "Entertainment",
  "Sports", "Music", "Art & Design", "E-commerce", "Healthcare",
  "Real Estate", "Automotive", "Retail",
];

// Platform icon mapping
const PlatformIcon = ({ name, size = 14 }) => {
  const map = {
    instagram: Instagram, youtube: Youtube, twitter: Twitter,
    linkedin: Linkedin, facebook: Facebook,
  };
  const Icon = map[name?.toLowerCase()] || Globe;
  return <Icon size={size} />;
};

// ── Avatar upload area ─────────────────────────────────────────────────────────
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
    ? `${size === "lg" ? "w-24 h-24" : "w-16 h-16"} rounded-full`
    : "w-full h-28 rounded-xl";

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative group overflow-hidden border-2 border-dashed border-gray-200",
          "hover:border-blue-400 transition-colors bg-gray-50",
          containerClass
        )}
      >
        {preview ? (
          <img src={preview} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera size={20} className="text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera size={16} className="text-white" />
        </div>
      </button>
      <p className="text-xs text-gray-500">{label}</p>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

// ── Section card wrapper ───────────────────────────────────────────────────────
function SectionCard({ title, description, children, saving, onSave, saveLabel = "Save changes" }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
      {onSave && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60
              text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {saving ? "Saving…" : saveLabel}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Field component ────────────────────────────────────────────────────────────
function Field({ label, required, error, children }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

const inputClass = "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg " +
  "focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent " +
  "bg-white placeholder:text-gray-400";

// ═══════════════════════════════════════════════════════════════════════════════
// INFLUENCER: Platform Manager
// ═══════════════════════════════════════════════════════════════════════════════
function PlatformManager({ platforms, onChange }) {
  const [expanded, setExpanded] = useState(null); // index of open platform

  const addPlatform = () => {
    const updated = [
      ...platforms,
      { name: "Instagram", username: "", followers: "", profileUrl: "", influenceRate: 5, services: [] },
    ];
    onChange(updated);
    setExpanded(updated.length - 1);
  };

  const removePlatform = (i) => {
    const updated = platforms.filter((_, idx) => idx !== i);
    onChange(updated);
    if (expanded === i) setExpanded(null);
  };

  const updatePlatform = (i, field, value) => {
    const updated = platforms.map((p, idx) =>
      idx === i ? { ...p, [field]: value } : p
    );
    onChange(updated);
  };

  const addService = (pi) => {
    const updated = platforms.map((p, idx) =>
      idx === pi
        ? { ...p, services: [...(p.services || []), { contentType: "Post", price: "", description: "" }] }
        : p
    );
    onChange(updated);
  };

  const updateService = (pi, si, field, value) => {
    const updated = platforms.map((p, idx) => {
      if (idx !== pi) return p;
      const services = p.services.map((s, sidx) =>
        sidx === si ? { ...s, [field]: value } : s
      );
      return { ...p, services };
    });
    onChange(updated);
  };

  const removeService = (pi, si) => {
    const updated = platforms.map((p, idx) => {
      if (idx !== pi) return p;
      return { ...p, services: p.services.filter((_, sidx) => sidx !== si) };
    });
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {platforms.map((p, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
          {/* Platform header */}
          <div
            className="flex items-center gap-3 px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <PlatformIcon name={p.name} />
            <span className="text-sm font-medium text-gray-800 flex-1">
              {p.name} {p.username && <span className="text-gray-400">@{p.username}</span>}
            </span>
            <span className="text-xs text-gray-400">
              {p.services?.length || 0} service{p.services?.length !== 1 ? "s" : ""}
            </span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removePlatform(i); }}
              className="text-red-400 hover:text-red-600 p-1"
            >
              <Trash2 size={13} />
            </button>
            {expanded === i ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
          </div>

          {/* Platform details */}
          {expanded === i && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Platform">
                  <select
                    value={p.name}
                    onChange={(e) => updatePlatform(i, "name", e.target.value)}
                    className={inputClass}
                  >
                    {PLATFORM_OPTIONS.map((pl) => (
                      <option key={pl}>{pl}</option>
                    ))}
                  </select>
                </Field>
                <Field label="@Username">
                  <input
                    type="text"
                    value={p.username}
                    onChange={(e) => updatePlatform(i, "username", e.target.value)}
                    placeholder="yourhandle"
                    className={inputClass}
                  />
                </Field>
                <Field label="Followers">
                  <input
                    type="number"
                    value={p.followers}
                    onChange={(e) => updatePlatform(i, "followers", e.target.value)}
                    placeholder="10000"
                    className={inputClass}
                    min="0"
                  />
                </Field>
                <Field label="Influence rate (1–10)">
                  <input
                    type="number"
                    value={p.influenceRate}
                    onChange={(e) => updatePlatform(i, "influenceRate", Math.min(10, Math.max(1, Number(e.target.value))))}
                    className={inputClass}
                    min="1"
                    max="10"
                  />
                </Field>
              </div>
              <Field label="Profile URL">
                <input
                  type="url"
                  value={p.profileUrl}
                  onChange={(e) => updatePlatform(i, "profileUrl", e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                  className={inputClass}
                />
              </Field>

              {/* Services */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Services & Pricing</label>
                  <button
                    type="button"
                    onClick={() => addService(i)}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                  >
                    <Plus size={12} /> Add service
                  </button>
                </div>
                <div className="space-y-2">
                  {(p.services || []).map((s, si) => (
                    <div key={si} className="flex gap-2 items-start bg-gray-50 rounded-lg p-3">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <select
                          value={s.contentType}
                          onChange={(e) => updateService(i, si, "contentType", e.target.value)}
                          className={inputClass + " text-xs py-1.5"}
                        >
                          {CONTENT_TYPES.map((ct) => <option key={ct}>{ct}</option>)}
                        </select>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                          <input
                            type="number"
                            value={s.price}
                            onChange={(e) => updateService(i, si, "price", e.target.value)}
                            placeholder="Price"
                            className={inputClass + " pl-6 text-xs py-1.5"}
                            min="0"
                          />
                        </div>
                        <input
                          type="text"
                          value={s.description}
                          onChange={(e) => updateService(i, si, "description", e.target.value)}
                          placeholder="Short description (optional)"
                          className={inputClass + " text-xs py-1.5 col-span-2"}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeService(i, si)}
                        className="text-red-400 hover:text-red-600 p-1 mt-0.5"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {(p.services || []).length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-2">
                      No services yet — add at least one to complete your profile
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addPlatform}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed
          border-gray-200 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600
          transition-colors"
      >
        <Plus size={14} /> Add social platform
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function ProfileSettings() {
  const dispatch   = useDispatch();
  const { user }   = useSelector((state) => state.auth);
  const { roleProfile, completion, saving, loading } =
    useSelector((state) => state.profile);
  const location   = useLocation();
  const role       = user?.role;

  // ── Local state for form fields ──────────────────────────────────────────
  // Section 1: User info
  const [fullname,    setFullname]    = useState("");
  const [profilePic,  setProfilePic]  = useState(null); // File object
  const [coverPic,    setCoverPic]    = useState(null); // File object

  // Section 2: Brand info
  const [brandname,    setBrandname]    = useState("");
  const [industry,     setIndustry]     = useState("");
  const [description,  setDescription]  = useState("");
  const [website,      setWebsite]      = useState("");
  const [address,      setAddress]      = useState("");
  const [budgetMin,    setBudgetMin]    = useState("");
  const [budgetMax,    setBudgetMax]    = useState("");
  const [logoFile,     setLogoFile]     = useState(null);

  // Section 2: Influencer info
  const [username,     setUsername]     = useState("");
  const [about,        setAbout]        = useState("");
  const [category,     setCategory]     = useState("");
  const [infLocation,  setInfLocation]  = useState("");
  const [portfolio,    setPortfolio]    = useState("");
  const [isAvailable,  setIsAvailable]  = useState(true);
  const [platforms,    setPlatforms]    = useState([]);

  // Toast display
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Load data ─────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    dispatch(setProfileLoading(true));
    try {
      const data = await profileService.getMe();
      dispatch(setProfileData({ roleProfile: data.roleProfile, completion: data.completion }));

      // Hydrate user fields
      setFullname(data.user?.fullname || "");

      if (role === "brand" && data.roleProfile) {
        const b = data.roleProfile;
        setBrandname(b.brandname    || "");
        setIndustry(b.industry      || "");
        setDescription(b.description || "");
        setWebsite(b.website        || "");
        setAddress(b.address        || "");
        setBudgetMin(b.budgetRange?.min ?? "");
        setBudgetMax(b.budgetRange?.max ?? "");
      }

      if (role === "influencer" && data.roleProfile) {
        const inf = data.roleProfile;
        setUsername(inf.username    || "");
        setAbout(inf.about          || "");
        setCategory(inf.category    || "");
        setInfLocation(inf.location || "");
        setPortfolio(inf.portfolio  || "");
        setIsAvailable(inf.isAvailable ?? true);
        setPlatforms(inf.platforms  || []);
      }
    } catch (err) {
      dispatch(setProfileError(err.response?.data?.message || "Failed to load profile"));
    }
  }, [dispatch, role]);

  useEffect(() => { loadData(); }, [loadData]);

  // Show banner if redirected from profile gate
  const fromGate = location.state?.fromGate;

  // ── Save: User Info ───────────────────────────────────────────────────────
  const saveUserInfo = async () => {
    dispatch(setProfileSaving(true));
    try {
      const fd = new FormData();
      if (fullname.trim()) fd.append("fullname", fullname.trim());
      if (profilePic)      fd.append("profilePic", profilePic);
      if (coverPic)        fd.append("coverPic", coverPic);

      const data = await profileService.updateUserInfo(fd);
      dispatch(updateUserFields(data.user));
      dispatch(updateProfileComplete(data.completion?.isComplete));
      dispatch(setProfileData({ completion: data.completion }));
      showToast("Account info saved!");
    } catch (err) {
      showToast(err.response?.data?.message || "Save failed", "error");
      dispatch(setProfileSaving(false));
    }
  };

  // ── Save: Brand Info ──────────────────────────────────────────────────────
  const saveBrandInfo = async () => {
    if (!brandname.trim()) return showToast("Brand name is required", "error");
    dispatch(setProfileSaving(true));
    try {
      const fd = new FormData();
      fd.append("brandname",   brandname.trim());
      fd.append("industry",    industry);
      fd.append("description", description);
      fd.append("website",     website);
      fd.append("address",     address);
      if (budgetMin !== "") fd.append("budgetRange[min]", Number(budgetMin));
      if (budgetMax !== "") fd.append("budgetRange[max]", Number(budgetMax));
      if (logoFile) fd.append("logo", logoFile);

      const data = await profileService.updateBrandProfile(fd);
      dispatch(updateProfileComplete(data.completion?.isComplete));
      dispatch(setProfileData({ roleProfile: data.brand, completion: data.completion }));
      showToast("Brand info saved!");
    } catch (err) {
      showToast(err.response?.data?.message || "Save failed", "error");
      dispatch(setProfileSaving(false));
    }
  };

  // ── Save: Influencer Info ─────────────────────────────────────────────────
  const saveInfluencerInfo = async () => {
    if (!username.trim()) return showToast("Username is required", "error");
    if (!about.trim())    return showToast("Bio is required", "error");
    dispatch(setProfileSaving(true));
    try {
      // Clean up platforms — ensure numbers are numbers
      const cleanPlatforms = platforms.map((p) => ({
        ...p,
        followers:     Number(p.followers) || 0,
        influenceRate: Number(p.influenceRate) || 5,
        services: (p.services || []).map((s) => ({
          ...s,
          price: Number(s.price) || 0,
        })),
      }));

      const data = await profileService.updateInfluencerProfile({
        username:    username.trim(),
        about:       about.trim(),
        category,
        location:    infLocation,
        portfolio,
        isAvailable,
        platforms:   cleanPlatforms,
      });
      dispatch(updateProfileComplete(data.completion?.isComplete));
      dispatch(setProfileData({ roleProfile: data.influencer, completion: data.completion }));
      showToast("Influencer profile saved!");
    } catch (err) {
      showToast(err.response?.data?.message || "Save failed", "error");
      dispatch(setProfileSaving(false));
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">

      {/* Page title */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your profile information and visibility settings
        </p>
      </div>

      {/* Gate warning */}
      {fromGate && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 flex items-center gap-3">
          <AlertCircle size={18} className="text-blue-500 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            Please complete your profile to access all features. Fill in the required fields below.
          </p>
        </div>
      )}

      {/* Completion banner */}
      <CompletionBanner completion={completion} />

      {/* Toast */}
      {toast && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium",
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          )}
        >
          {toast.type === "success" ? <Check size={15} /> : <AlertCircle size={15} />}
          {toast.msg}
        </div>
      )}

      {/* ══ SECTION 1: Account info (both roles) ══════════════════════════ */}
      <SectionCard
        title="Account info"
        description="Your name and profile photo visible to everyone"
        saving={saving}
        onSave={saveUserInfo}
      >
        {/* Avatar + Cover row */}
        <div className="flex flex-wrap gap-6 items-start">
          <AvatarUpload
            label="Profile photo"
            currentUrl={user?.profilePic}
            onChange={setProfilePic}
            shape="circle"
            size="lg"
          />
          <AvatarUpload
            label="Cover photo"
            currentUrl={user?.coverPic}
            onChange={setCoverPic}
            shape="rect"
            size="lg"
          />
        </div>

        <Field label="Full name" required>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Your full name"
            className={inputClass}
          />
        </Field>

        <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
          <User size={14} className="text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm font-medium text-gray-900">{user?.email}</p>
          </div>
          <span className="ml-auto text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
            Cannot change
          </span>
        </div>
      </SectionCard>

      {/* ══ SECTION 2: Brand-specific ═════════════════════════════════════ */}
      {role === "brand" && (
        <SectionCard
          title="Brand profile"
          description="Shown to influencers on your public profile and campaign cards"
          saving={saving}
          onSave={saveBrandInfo}
        >
          {/* Logo upload */}
          <div className="flex items-center gap-4">
            <AvatarUpload
              label="Brand logo"
              currentUrl={roleProfile?.logo}
              onChange={setLogoFile}
              shape="circle"
              size="sm"
            />
            <div className="flex-1">
              <Field label="Brand name" required>
                <input
                  type="text"
                  value={brandname}
                  onChange={(e) => setBrandname(e.target.value)}
                  placeholder="Your Brand Name"
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          <Field label="Industry" required>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className={inputClass}
            >
              <option value="">Select industry…</option>
              {INDUSTRY_OPTIONS.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </Field>

          <Field label="Description" required>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Tell influencers about your brand, values, and what you're looking for…"
              className={inputClass + " resize-none"}
            />
          </Field>

          {/* Budget range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Campaign budget range (USD) <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  placeholder="Min (e.g. 500)"
                  className={inputClass + " pl-7"}
                  min="0"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  placeholder="Max (e.g. 5000)"
                  className={inputClass + " pl-7"}
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Website">
              <div className="relative">
                <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourbrand.com"
                  className={inputClass + " pl-9"}
                />
              </div>
            </Field>
            <Field label="Location">
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="City, Country"
                  className={inputClass + " pl-9"}
                />
              </div>
            </Field>
          </div>
        </SectionCard>
      )}

      {/* ══ SECTION 2: Influencer-specific ════════════════════════════════ */}
      {role === "influencer" && (
        <>
          <SectionCard
            title="Influencer profile"
            description="Your public profile shown to brands"
            saving={saving}
            onSave={saveInfluencerInfo}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Username" required>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="yourhandle"
                    className={inputClass + " pl-8"}
                  />
                </div>
              </Field>
              <Field label="Content category" required>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select category…</option>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Bio / About" required>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={4}
                placeholder="Tell brands about yourself, your audience, and your content style…"
                className={inputClass + " resize-none"}
              />
              <p className="text-xs text-gray-400 mt-1">{about.length} / 1000</p>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Location">
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={infLocation}
                    onChange={(e) => setInfLocation(e.target.value)}
                    placeholder="City, Country"
                    className={inputClass + " pl-9"}
                  />
                </div>
              </Field>
              <Field label="Portfolio URL">
                <div className="relative">
                  <ExternalLink size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    placeholder="https://yourportfolio.com"
                    className={inputClass + " pl-9"}
                  />
                </div>
              </Field>
            </div>

            {/* Availability toggle */}
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">Available for collaborations</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  When off, brands won't see you in search results
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAvailable((v) => !v)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  isAvailable ? "bg-green-500" : "bg-gray-300"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
                    isAvailable ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </SectionCard>

          {/* Social platforms — separate save included inside PlatformManager via parent save */}
          <SectionCard
            title="Social platforms & services"
            description="Add your social accounts and what you charge for each type of content"
            saving={saving}
            onSave={saveInfluencerInfo}
            saveLabel="Save platforms"
          >
            <PlatformManager platforms={platforms} onChange={setPlatforms} />
          </SectionCard>
        </>
      )}

      {/* ══ Account status ════════════════════════════════════════════════ */}
      <SectionCard title="Account status">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Profile status</p>
            <div className={cn(
              "inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full",
              user?.profileComplete
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            )}>
              {user?.profileComplete ? <Check size={12} /> : <AlertCircle size={12} />}
              {user?.profileComplete ? "Complete" : "Incomplete"}
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Verified</p>
            <div className={cn(
              "inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full",
              user?.isVerified
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600"
            )}>
              {user?.isVerified ? <Check size={12} /> : <AlertCircle size={12} />}
              {user?.isVerified ? "Verified" : "Not verified"}
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Account type</p>
            <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 px-3 py-1 rounded-full capitalize">
              {user?.role || "—"}
            </div>
          </div>
        </div>
      </SectionCard>

    </div>
  );
}