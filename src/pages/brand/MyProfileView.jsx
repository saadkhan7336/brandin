import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Globe,
  MapPin,
  Briefcase,
  DollarSign,
  CheckCircle,
  Users,
  Target,
  TrendingUp,
  Edit3,
  Save,
  X,
  Camera,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import api from "../../services/api";
import profileService from "../../services/profileService";
import { setProfileData } from "../../redux/slices/Profileslice";
import {
  updateUserFields,
  updateProfileComplete,
} from "../../redux/slices/authSlice";
import { cn } from "../../utils/helper";

const INDUSTRIES = [
  "Fashion",
  "Technology",
  "Food & Beverage",
  "Beauty",
  "Lifestyle",
  "Fitness",
  "Travel",
  "Gaming",
  "Entertainment",
  "Finance",
  "Healthcare",
  "Art & Design",
  "Sports",
  "Other",
];
const NICHES = [
  "Lifestyle",
  "Beauty",
  "Fashion",
  "Fitness",
  "Tech",
  "Gaming",
  "Travel",
  "Food",
  "Parenting",
  "Business",
  "Education",
  "Finance",
  "Health",
  "Comedy",
  "Art",
  "Sports",
];

// Platform Icon Helper
const SocialIcon = ({ name, size = 16, className }) => {
  const map = {
    instagram: Instagram,
    tiktok: ({ size, className }) => (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
    twitter: Twitter,
    linkedin: Linkedin,
  };
  const Icon = map[name?.toLowerCase()] || Globe;
  return <Icon size={size} className={className} />;
};

// ── Shared Input Components ────────────────────────────────────────────────
const InlineInput = ({
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  label,
}) => (
  <div className="space-y-1.5 w-full">
    {label && (
      <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 ml-1">
        {label}
      </p>
    )}
    <div className="relative group w-full">
      {Icon && (
        <Icon
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
        />
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "w-full bg-slate-50 border-0 border-b-2 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 text-sm font-bold transition-all py-2.5",
          Icon ? "pl-9" : "px-3",
        )}
      />
    </div>
  </div>
);

const InlineTextarea = ({ value, onChange, placeholder, label }) => (
  <div className="space-y-2">
    {label && (
      <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 ml-1">
        {label}
      </p>
    )}
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
      className="w-full bg-slate-50 border-0 border-b-2 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 text-sm font-medium transition-all py-3 px-4 resize-none leading-relaxed"
    />
  </div>
);

const SectionHeader = ({ title, icon: Icon, color = "blue" }) => (
  <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tight">
    <div
      className={cn(
        "w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200",
        `bg-${color}-600`,
      )}
    >
      <Icon size={16} />
    </div>
    {title}
  </h3>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const MyProfileView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { roleProfile } = useSelector((state) => state.profile);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");

  // Inline Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedBrand, setEditedBrand] = useState({});
  const [editedUser, setEditedUser] = useState({});
  const [files, setFiles] = useState({
    logo: null,
    profilePic: null,
    coverPic: null,
  });
  const [previews, setPreviews] = useState({
    logo: null,
    profilePic: null,
    coverPic: null,
  });

  const fileRefs = {
    logo: useRef(),
    profilePic: useRef(),
    coverPic: useRef(),
  };

  const brandId = roleProfile?._id;

  const fetchBrand = useCallback(async () => {
    if (!brandId) return;
    setLoading(true);
    try {
      const res = await api.get(`/brands/${brandId}/public`);
      const brandData = res.data.data;
      setData(brandData);

      // Initialize edit state
      setEditedBrand({
        brandname: brandData.brand.brandname || "",
        industry: brandData.brand.industry || "",
        description: brandData.brand.description || "",
        website: brandData.brand.website || "",
        address: brandData.brand.address || "",
        budgetMin: brandData.brand.budgetRange?.min || "",
        budgetMax: brandData.brand.budgetRange?.max || "",
        instagram: brandData.brand.socialMedia?.instagram || "",
        tiktok: brandData.brand.socialMedia?.tiktok || "",
        twitter: brandData.brand.socialMedia?.twitter || "",
        linkedin: brandData.brand.socialMedia?.linkedin || "",
        lookingFor: brandData.brand.lookingFor || [],
        customLookingFor: (brandData.brand.lookingFor || [])
          .filter((n) => !NICHES.includes(n))
          .join(", "),
      });
      setEditedUser({
        fullname: brandData.brand.user?.fullname || "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Brand profile not found");
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  useEffect(() => {
    fetchBrand();
  }, [fetchBrand]);

  const handleFileChange = (type, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFiles((prev) => ({ ...prev, [type]: file }));
    setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Update Brand Info
      const brandFd = new FormData();
      brandFd.append("brandname", editedBrand.brandname);
      brandFd.append("industry", editedBrand.industry);
      brandFd.append("description", editedBrand.description);
      brandFd.append("website", editedBrand.website);
      brandFd.append("address", editedBrand.address);
      brandFd.append("budgetRange[min]", editedBrand.budgetMin || 0);
      brandFd.append("budgetRange[max]", editedBrand.budgetMax || 0);

      brandFd.append("socialMedia[instagram]", editedBrand.instagram);
      brandFd.append("socialMedia[tiktok]", editedBrand.tiktok);
      brandFd.append("socialMedia[twitter]", editedBrand.twitter);
      brandFd.append("socialMedia[linkedin]", editedBrand.linkedin);

      // Handle lookingFor (checkboxes + custom)
      let finalLookingFor = [...editedBrand.lookingFor].filter((n) =>
        NICHES.includes(n),
      );
      if (editedBrand.customLookingFor) {
        const customTags = editedBrand.customLookingFor
          .split(",")
          .map((val) => val.trim())
          .filter(Boolean);
        finalLookingFor = [...finalLookingFor, ...customTags];
      }
      finalLookingFor = [...new Set(finalLookingFor)]; // Remove duplicates

      if (finalLookingFor.length === 0) {
        brandFd.append("lookingForClear", "true");
      } else {
        finalLookingFor.forEach((tag, index) => {
          brandFd.append(`lookingFor[${index}]`, tag);
        });
      }

      if (files.logo) brandFd.append("logo", files.logo);

      const brandResponse = await profileService.updateBrandProfile(brandFd);

      // 2. Update User Info
      const userFd = new FormData();
      userFd.append("fullname", editedUser.fullname);
      if (files.profilePic) userFd.append("profilePic", files.profilePic);
      if (files.coverPic) userFd.append("coverPic", files.coverPic);

      const userResponse = await profileService.updateUserInfo(userFd);

      // 3. Sync Redux
      dispatch(updateUserFields(userResponse.user));
      dispatch(updateProfileComplete(userResponse.completion?.isComplete));
      dispatch(
        setProfileData({
          roleProfile: brandResponse.brand,
          completion: brandResponse.completion,
        }),
      );

      // 4. Refresh local view
      await fetchBrand();
      setIsEditing(false);
      setFiles({ logo: null, profilePic: null, coverPic: null });
      setPreviews({ logo: null, profilePic: null, coverPic: null });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest animate-pulse">
          Synchronizing Data...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 text-center px-6">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center shadow-2xl shadow-rose-100">
          <Briefcase size={32} className="text-rose-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Oops! Profile Missing
          </h2>
          <p className="text-slate-500 font-medium max-w-sm mx-auto mt-2 text-sm leading-relaxed">
            We couldn't find your brand profile stats. Please ensure your setup
            is complete.
          </p>
        </div>
        <button
          onClick={() => navigate("/brand/settings")}
          className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all active:scale-95"
        >
          Go to Settings
        </button>
      </div>
    );
  }

  const { brand, campaigns } = data;
  const name = brand.brandname || "My Brand";
  const userDoc = brand.user || {};

  const metrics = {
    activeCampaigns: data.stats?.activeCampaignsCount || 0,
    collaborations: data.stats?.collaborationsCount || 0,
    avgBudget: isEditing
      ? "Editing..."
      : brand.budgetRange?.min
        ? `$${brand.budgetRange.min?.toLocaleString()}-$${brand.budgetRange.max?.toLocaleString()}`
        : "Not specified",
    totalCampaigns: data.stats?.totalCampaignsCount || 0,
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto space-y-10 pb-24 animate-in fade-in duration-700">
      {/* ── HEADER ACTIONS ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Public Profile
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            This is how{" "}
            <span className="text-blue-600 font-bold">Influencers</span> and{" "}
            <span className="text-slate-900 font-bold">Talents</span> see your
            brand.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95 shadow-sm"
              >
                <X size={14} /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-slate-200 hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2.5 transition-all active:scale-95"
              >
                {saving ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {saving ? "Wait..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2.5 active:scale-95"
            >
              <Edit3 size={14} /> Refine Profile
            </button>
          )}
        </div>
      </div>

      {/* ── HERO BANNER ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden group/card transition-all hover:shadow-slate-300/30">
        <div className="h-80 bg-slate-100 relative group/cover cursor-default">
          <img
            src={
              previews.coverPic ||
              userDoc.coverPic ||
              "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=2000"
            }
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

          {isEditing && (
            <button
              onClick={() => fileRefs.coverPic.current.click()}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover/cover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white font-black uppercase text-[10px] tracking-widest"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-1">
                <Camera size={18} />
              </div>
              Change Cover
            </button>
          )}
          <input
            ref={fileRefs.coverPic}
            type="file"
            className="hidden"
            onChange={(e) => handleFileChange("coverPic", e)}
          />
        </div>

        <div className="px-12 pb-12">
          <div className="flex flex-col md:flex-row items-end gap-12 -mt-16 relative z-10">
            {/* LOGO AREA */}
            <div className="relative group/logo">
              <div className="w-44 h-44 rounded-[2.5rem] overflow-hidden border-[10px] border-white shadow-2xl bg-white flex items-center justify-center relative translate-y-2">
                {previews.logo ||
                previews.profilePic ||
                brand.logo ||
                userDoc.profilePic ? (
                  <img
                    src={
                      previews.logo ||
                      previews.profilePic ||
                      brand.logo ||
                      userDoc.profilePic
                    }
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-black text-slate-100 drop-shadow-sm select-none">
                    {name[0]}
                  </span>
                )}
              </div>
              {isEditing && (
                <div className="absolute inset-x-0 bottom-0 top-2 flex flex-col items-center justify-center gap-2 opacity-0 group-hover/logo:opacity-100 transition-opacity bg-black/50 rounded-[2.5rem] text-white">
                  <button
                    onClick={() => fileRefs.logo.current.click()}
                    className="text-[10px] font-black uppercase tracking-tighter hover:text-blue-400 transition-colors"
                  >
                    Brand Logo
                  </button>
                  <div className="w-8 h-px bg-white/20" />
                  <button
                    onClick={() => fileRefs.profilePic.current.click()}
                    className="text-[10px] font-black uppercase tracking-tighter hover:text-blue-400 transition-colors"
                  >
                    User Avatar
                  </button>
                </div>
              )}
              <input
                ref={fileRefs.logo}
                type="file"
                className="hidden"
                onChange={(e) => handleFileChange("logo", e)}
              />
              <input
                ref={fileRefs.profilePic}
                type="file"
                className="hidden"
                onChange={(e) => handleFileChange("profilePic", e)}
              />
            </div>

            {/* IDENTITY AREA */}
            <div className="flex-1 pb-4 space-y-6">
              <div className="flex items-center gap-4">
                {isEditing ? (
                  <div className="w-full max-w-md">
                    <InlineInput
                      value={editedBrand.brandname}
                      onChange={(e) =>
                        setEditedBrand((prev) => ({
                          ...prev,
                          brandname: e.target.value,
                        }))
                      }
                      label="BRAND NAME"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">
                      {name}
                    </h2>
                    {userDoc.isVerified && (
                      <div className="bg-blue-600 p-1.5 rounded-full text-white shadow-lg shadow-blue-200">
                        <CheckCircle
                          size={14}
                          fill="currentColor"
                          stroke="white"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* INFO BAR WITH LABELS */}
              <div className="flex flex-wrap items-center gap-10 pt-8">
                {/* Location */}
                <div className="flex items-center gap-3.5 group/info">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 transition-all group-hover/info:scale-110 shadow-sm border border-blue-100/50">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">
                      Location
                    </p>
                    <div className="text-sm font-black text-slate-800">
                      {isEditing ? (
                        <input
                          value={editedBrand.address}
                          onChange={(e) =>
                            setEditedBrand((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                          className="bg-transparent border-0 border-b border-slate-200 p-0 focus:ring-0 w-24 text-sm font-bold"
                          placeholder="Set Location"
                        />
                      ) : (
                        brand.address || "Global HQ"
                      )}
                    </div>
                  </div>
                </div>

                {/* Industry */}
                <div className="flex items-center gap-3.5 group/info">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 transition-all group-hover/info:scale-110 shadow-sm border border-orange-100/50">
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">
                      Category
                    </p>
                    <div className="text-sm font-black text-slate-800">
                      {isEditing ? (
                        <div className="flex flex-col gap-1.5 relative z-10 w-32">
                          <select
                            value={
                              INDUSTRIES.includes(editedBrand.industry)
                                ? editedBrand.industry
                                : editedBrand.industry
                                  ? "Other"
                                  : ""
                            }
                            onChange={(e) => {
                              if (e.target.value === "Other")
                                setEditedBrand((prev) => ({
                                  ...prev,
                                  industry: "Custom",
                                }));
                              else
                                setEditedBrand((prev) => ({
                                  ...prev,
                                  industry: e.target.value,
                                }));
                            }}
                            className="bg-white border text-slate-700 border-slate-200 focus:border-blue-500 focus:ring-0 w-full text-xs font-bold py-1.5 px-2 rounded-xl shadow-sm transition-all"
                          >
                            <option value="" disabled>
                              Select Industry
                            </option>
                            {INDUSTRIES.map((ind) => (
                              <option key={ind} value={ind}>
                                {ind}
                              </option>
                            ))}
                          </select>
                          {!INDUSTRIES.includes(editedBrand.industry) &&
                            editedBrand.industry && (
                              <input
                                value={
                                  editedBrand.industry === "Custom"
                                    ? ""
                                    : editedBrand.industry
                                }
                                onChange={(e) =>
                                  setEditedBrand((prev) => ({
                                    ...prev,
                                    industry: e.target.value,
                                  }))
                                }
                                className="bg-white border border-slate-200 focus:border-blue-500 p-1.5 px-2 rounded-lg focus:ring-0 w-full text-xs font-bold shadow-sm placeholder:text-slate-300"
                                placeholder="Type custom..."
                              />
                            )}
                        </div>
                      ) : (
                        brand.industry || "General"
                      )}
                    </div>
                  </div>
                </div>

                {/* Portfolio */}
                <div className="flex items-center gap-3.5 group/info">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 transition-all group-hover/info:scale-110 shadow-sm border border-emerald-100/50">
                    <Globe size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">
                      Portfolio
                    </p>
                    <div className="text-sm font-black text-slate-800">
                      {isEditing ? (
                        <input
                          value={editedBrand.website}
                          onChange={(e) =>
                            setEditedBrand((prev) => ({
                              ...prev,
                              website: e.target.value,
                            }))
                          }
                          className="bg-transparent border-0 border-b border-slate-200 p-0 focus:ring-0 w-32 text-sm font-bold text-blue-600"
                          placeholder="Website URL"
                        />
                      ) : (
                        <a
                          href={brand.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Launch Site
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── GRID SYSTEM ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">
        {/* LEFT COLUMN: STATS & SOCIALS */}
        <div className="lg:col-span-4 space-y-8 animate-in slide-in-from-left-4 duration-1000">
          {/* CORE METRICS */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-2xl shadow-slate-200/30 space-y-10 group">
            <h3 className="text-sm font-black text-slate-900 tracking-widest uppercase flex items-center gap-3">
              <TrendingUp size={16} className="text-blue-600" /> Platform
              Insights
            </h3>
            <div className="space-y-8">
              {[
                {
                  label: "Active Campaigns",
                  val: metrics.activeCampaigns,
                  icon: Target,
                  color: "blue",
                },
                {
                  label: "Talent Connections",
                  val: metrics.collaborations,
                  icon: Users,
                  color: "orange",
                },
                {
                  label: "Est. Budget Peak",
                  val: metrics.avgBudget,
                  icon: DollarSign,
                  color: "emerald",
                  isEditable: true,
                },
                {
                  label: "Campaign Footprint",
                  val: metrics.totalCampaigns,
                  icon: TrendingUp,
                  color: "violet",
                },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-6 group/stat">
                  <div
                    className={cn(
                      `w-12 h-12 rounded-2xl flex items-center justify-center text-${stat.color}-600 bg-${stat.color}-50 group-hover/stat:scale-110 transition-all duration-500 shadow-sm`,
                    )}
                  >
                    <stat.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">
                      {stat.label}
                    </p>
                    {isEditing && stat.isEditable ? (
                      <div className="flex gap-2 items-center mt-2">
                        <input
                          type="number"
                          value={editedBrand.budgetMin}
                          onChange={(e) =>
                            setEditedBrand((prev) => ({
                              ...prev,
                              budgetMin: e.target.value,
                            }))
                          }
                          className="w-16 bg-slate-50 border-0 rounded-lg text-[10px] font-black focus:ring-1 focus:ring-blue-500 h-8 text-center"
                          placeholder="MIN"
                        />
                        <span className="text-slate-300 text-xs font-black">
                          ─
                        </span>
                        <input
                          type="number"
                          value={editedBrand.budgetMax}
                          onChange={(e) =>
                            setEditedBrand((prev) => ({
                              ...prev,
                              budgetMax: e.target.value,
                            }))
                          }
                          className="w-16 bg-slate-50 border-0 rounded-lg text-[10px] font-black focus:ring-1 focus:ring-blue-500 h-8 text-center"
                          placeholder="MAX"
                        />
                      </div>
                    ) : (
                      <p className="text-lg font-black text-slate-900 tracking-tight italic">
                        {stat.val}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SOCIAL HANDLINGS - USER FEEDBACK SECTION */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-2xl shadow-slate-200/30 space-y-8">
            <h3 className="text-sm font-black text-slate-900 tracking-widest uppercase flex items-center gap-3">
              <Globe size={16} className="text-emerald-600" /> Digital Ecosystem
            </h3>
            <div className="flex flex-col gap-3">
              {[
                {
                  id: "instagram",
                  label: "Instagram Handle",
                  name: "INSTAGRAM",
                  color: "pink",
                },
                {
                  id: "tiktok",
                  label: "TikTok User",
                  name: "TIKTOK",
                  color: "slate",
                },
                {
                  id: "twitter",
                  label: "Twitter Post",
                  name: "TWITTER",
                  color: "blue",
                },
                {
                  id: "linkedin",
                  label: "LinkedIn Page",
                  name: "LINKEDIN",
                  color: "indigo",
                },
              ].map((social) => (
                <div
                  key={social.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all group/soc overflow-hidden"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div
                      className={cn(
                        `w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-white shadow-sm transition-transform group-hover/soc:rotate-6`,
                        `text-${social.color}-600`,
                      )}
                    >
                      <SocialIcon name={social.id} size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex flex-col">
                          <p className="text-[10px] font-black text-slate-400 tracking-widest leading-none mb-1 uppercase">
                            {social.name}
                          </p>
                          <input
                            value={editedBrand[social.id]}
                            onChange={(e) =>
                              setEditedBrand((prev) => ({
                                ...prev,
                                [social.id]: e.target.value,
                              }))
                            }
                            className="bg-transparent border-0 border-b border-slate-300 p-0 focus:ring-0 focus:border-blue-500 text-xs font-bold w-full transition-all"
                            placeholder={`e.g. username or URL`}
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-[10px] font-black text-slate-400 tracking-widest leading-none mb-1 uppercase">
                            {social.name}
                          </p>
                          <p className="text-xs font-bold text-slate-600 truncate pr-2">
                            {brand.socialMedia?.[social.id]
                              ? brand.socialMedia[social.id].startsWith("http")
                                ? brand.socialMedia[social.id]
                                : `@${brand.socialMedia[social.id]}`
                              : "Not linked"}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  {!isEditing && brand.socialMedia?.[social.id] && (
                    <a
                      href={
                        brand.socialMedia[social.id].startsWith("http")
                          ? brand.socialMedia[social.id]
                          : `https://${social.id}.com/${brand.socialMedia[social.id]}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 shrink-0 rounded-lg bg-slate-200/50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all border-none"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTENT AREAS */}
        <div className="lg:col-span-8 space-y-8 animate-in slide-in-from-right-4 duration-1000">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/30 overflow-hidden flex flex-col h-full">
            <div className="border-b border-slate-50 px-10 flex gap-12 bg-slate-50/10">
              {["about", "campaigns"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "py-6 text-xs font-black uppercase tracking-[0.2em] border-b-[3px] transition-all relative outline-none",
                    activeTab === tab
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-600",
                  )}
                >
                  {tab === "about"
                    ? "Strategic Overview"
                    : "Live Opportunities"}
                  {tab === "campaigns" && campaigns.length > 0 && (
                    <span className="absolute top-4 -right-6 w-5 h-5 bg-blue-600 text-[10px] text-white flex items-center justify-center rounded-full border-2 border-white">
                      {campaigns.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="p-12 flex-1">
              {activeTab === "about" ? (
                <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
                  {/* STORY SECTION */}
                  <div className="space-y-6">
                    <SectionHeader title="Brand Narrative" icon={Edit3} />
                    {isEditing ? (
                      <InlineTextarea
                        value={editedBrand.description}
                        onChange={(e) =>
                          setEditedBrand((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Define your brand's mission, values, and why influencers should work with you..."
                      />
                    ) : (
                      <div className="relative pl-6 border-l-4 border-slate-100">
                        <p className="text-slate-600 leading-relaxed text-base font-medium whitespace-pre-wrap">
                          {brand.description ||
                            "Inspiration under maintenance. Please check the 'Refine Profile' section to share your story."}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* IDEAL COLLABORATORS (LOOKING FOR) */}
                  <div className="space-y-6 pt-6">
                    <SectionHeader
                      title="Ideal Collaborators"
                      icon={Target}
                      color="orange"
                    />
                    {isEditing ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {NICHES.map((niche) => (
                            <label
                              key={niche}
                              className="flex items-center gap-3 text-sm font-bold text-slate-700 cursor-pointer group bg-slate-50/50 hover:bg-slate-50 p-2.5 rounded-xl border border-transparent hover:border-slate-100 transition-all select-none"
                            >
                              <input
                                type="checkbox"
                                checked={editedBrand.lookingFor.includes(niche)}
                                onChange={(e) => {
                                  if (e.target.checked)
                                    setEditedBrand((prev) => ({
                                      ...prev,
                                      lookingFor: [...prev.lookingFor, niche],
                                    }));
                                  else
                                    setEditedBrand((prev) => ({
                                      ...prev,
                                      lookingFor: prev.lookingFor.filter(
                                        (n) => n !== niche,
                                      ),
                                    }));
                                }}
                                className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                              />
                              <span className="group-hover:text-blue-600 transition-colors uppercase tracking-[0.1em] text-[10px]">
                                {niche}
                              </span>
                            </label>
                          ))}
                        </div>
                        <div className="pt-2">
                          <InlineInput
                            label="ADD CUSTOM NICHES (Comma Separated)"
                            value={editedBrand.customLookingFor || ""}
                            onChange={(e) =>
                              setEditedBrand((prev) => ({
                                ...prev,
                                customLookingFor: e.target.value,
                              }))
                            }
                            placeholder="e.g. Real Estate, Music, AI..."
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {brand.lookingFor && brand.lookingFor.length > 0 ? (
                          brand.lookingFor.map((tag, idx) => (
                            <span
                              key={idx}
                              className="bg-slate-50 border border-slate-100 text-slate-600 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-default"
                            >
                              #{tag}
                            </span>
                          ))
                        ) : (
                          <p className="text-slate-400 italic text-sm">
                            No specific niches defined.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 tracking-widest uppercase flex items-center gap-3">
                      <Briefcase size={16} className="text-blue-600" /> Handler
                      Campaigns
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Showing {campaigns.length} Result
                      {campaigns.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {campaigns.length === 0 ? (
                    <div className="py-32 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 group">
                      <div className="w-16 h-16 rounded-full bg-white mx-auto flex items-center justify-center text-slate-100 mb-4 shadow-sm group-hover:scale-110 transition-all duration-500">
                        <Briefcase size={28} />
                      </div>
                      <h4 className="text-slate-900 font-black uppercase text-xs tracking-[0.2em] mb-1">
                        No Active Reach
                      </h4>
                      <p className="text-slate-400 font-medium text-xs max-w-[180px] mx-auto leading-relaxed">
                        Your brand is currently not recruiting for live
                        campaigns.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                      {campaigns.map((c) => (
                        <div
                          key={c._id}
                          className="p-8 bg-slate-50/30 border border-slate-100/50 rounded-[3rem] hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-100 hover:-translate-y-2 transition-all duration-500 group"
                        >
                          <div className="flex justify-between items-start mb-6">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-blue-600 tracking-widest uppercase">
                                Open Opportunity
                              </p>
                              <h4 className="text-lg font-black text-slate-900 tracking-tighter group-hover:text-blue-700 transition-colors uppercase italic leading-none">
                                {c.name}
                              </h4>
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest bg-emerald-500 text-white px-3 py-1.5 rounded-xl shadow-lg shadow-emerald-200">
                              LIVE
                            </span>
                          </div>
                          <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-8 leading-relaxed h-10">
                            {c.description}
                          </p>
                          <div className="flex items-center justify-between pt-6 border-t border-slate-100/50">
                            <div className="flex items-center gap-2 font-black text-slate-900 text-sm italic">
                              <DollarSign
                                size={14}
                                className="text-emerald-500 not-italic"
                              />
                              {c.budget?.min?.toLocaleString()} -{" "}
                              {c.budget?.max?.toLocaleString()}
                            </div>
                            <button className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center self-end opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                              <SocialIcon
                                name="github"
                                size={12}
                                className="rotate-45"
                              />{" "}
                              {/* Using social icon as arrow placeholder if needed */}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Helper for External Links Icon (not in lucide standard imports list above)
const ExternalLink = ({ size = 16, className }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export default MyProfileView;
