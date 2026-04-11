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
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">
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
          "w-full bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 text-sm font-bold transition-all py-2.5 shadow-sm outline-none px-4",
          Icon ? "pl-9" : "px-4",
        )}
      />
    </div>
  </div>
);

const InlineTextarea = ({ value, onChange, placeholder, label }) => (
  <div className="space-y-1.5">
    {label && (
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">
        {label}
      </p>
    )}
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
      className="w-full bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 text-sm font-medium transition-all py-3 px-4 resize-none leading-relaxed shadow-sm outline-none"
    />
  </div>
);

const SectionHeader = ({ title, icon: Icon, color = "blue" }) => (
  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3 tracking-tight">
    <div
      className={cn(
        "w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm",
        color === "blue" ? "bg-blue-600" : `bg-${color}-600`,
      )}
    >
      <Icon size={18} />
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
    <div className="w-full max-w-[1800px] mx-auto space-y-10 pb-24 px-4 md:px-8">
      {/* ── HEADER ACTIONS ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Brand Public Profile
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">
            How your brand appears to influencers and collaborators.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-all flex items-center gap-2 active:scale-95 shadow-sm"
              >
                <X size={14} /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-black disabled:opacity-50 flex items-center gap-2.5 transition-all active:scale-95"
              >
                {saving ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-blue-700 transition-all flex items-center gap-2.5 active:scale-95"
            >
              <Edit3 size={14} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* ── HERO BANNER ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group/card transition-all">
        <div className="h-64 md:h-80 bg-gray-100 relative group/cover cursor-default">
          <img
            src={
              previews.coverPic ||
              userDoc.coverPic ||
              "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=2000"
            }
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40" />

          {isEditing && (
            <button
              onClick={() => fileRefs.coverPic.current.click()}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover/cover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white font-bold uppercase text-[10px] tracking-wider"
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

        <div className="px-10 pb-10">
          <div className="flex flex-col md:flex-row items-end gap-10 -mt-12 relative z-10">
            {/* LOGO AREA */}
            <div className="relative group/logo shrink-0">
              <div className="w-40 h-40 rounded-2xl overflow-hidden border-[6px] border-white shadow-lg bg-white flex items-center justify-center relative ring-1 ring-gray-100">
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
                  <span className="text-5xl font-bold text-gray-200">
                    {name[0]}
                  </span>
                )}
              </div>
              {isEditing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover/logo:opacity-100 transition-opacity bg-black/50 rounded-2xl text-white">
                  <button
                    onClick={() => fileRefs.logo.current.click()}
                    className="text-[10px] font-bold uppercase tracking-tight hover:text-blue-400 transition-colors"
                  >
                    Logo
                  </button>
                  <div className="w-8 h-px bg-white/20" />
                  <button
                    onClick={() => fileRefs.profilePic.current.click()}
                    className="text-[10px] font-bold uppercase tracking-tight hover:text-blue-400 transition-colors"
                  >
                    Avatar
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
            <div className="flex-1 pb-2 space-y-4">
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
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                      {name}
                    </h2>
                    {userDoc.isVerified && (
                      <div className="bg-blue-600 p-1 rounded-full text-white">
                        <CheckCircle
                          size={12}
                          fill="currentColor"
                          stroke="white"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* INFO BAR WITH LABELS */}
              <div className="flex flex-wrap items-center gap-8 pt-2">
                {/* Location */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">
                      Location
                    </p>
                    <div className="text-sm font-bold text-gray-700">
                      {isEditing ? (
                        <input
                          value={editedBrand.address}
                          onChange={(e) =>
                            setEditedBrand((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                          className="bg-transparent border-0 border-b border-gray-200 p-0 focus:ring-0 w-24 text-sm font-bold"
                          placeholder="Set Location"
                        />
                      ) : (
                        brand.address || "Global"
                      )}
                    </div>
                  </div>
                </div>

                {/* Industry */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">
                      Category
                    </p>
                    <div className="text-sm font-bold text-gray-700">
                      {isEditing ? (
                        <div className="flex flex-col gap-1 w-32">
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
                            className="bg-white border text-gray-700 border-gray-200 focus:border-blue-500 focus:ring-0 w-full text-xs font-bold py-1 px-2 rounded-lg"
                          >
                            <option value="" disabled>
                              Select
                            </option>
                            {INDUSTRIES.map((ind) => (
                              <option key={ind} value={ind}>
                                {ind}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        brand.industry || "General"
                      )}
                    </div>
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                    <Globe size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">
                      Website
                    </p>
                    <div className="text-sm font-bold text-gray-700">
                      {isEditing ? (
                        <input
                          value={editedBrand.website}
                          onChange={(e) =>
                            setEditedBrand((prev) => ({
                              ...prev,
                              website: e.target.value,
                            }))
                          }
                          className="bg-transparent border-0 border-b border-gray-200 p-0 focus:ring-0 w-32 text-sm font-bold text-blue-600"
                          placeholder="URL"
                        />
                      ) : brand.website ? (
                        <a
                          href={brand.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Visit Site
                        </a>
                      ) : 'Not set'}
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
          <div className="bg-white rounded-2xl border border-gray-100 p-10 shadow-sm space-y-10">
            <h3 className="text-xs font-bold text-gray-900 tracking-widest uppercase flex items-center gap-3">
              <TrendingUp size={16} className="text-blue-600" /> Platform Insights
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
                  label: "Collaborations",
                  val: metrics.collaborations,
                  icon: Users,
                  color: "orange",
                },
                {
                  label: "Budget Range",
                  val: metrics.avgBudget,
                  icon: DollarSign,
                  color: "emerald",
                  isEditable: true,
                },
                {
                  label: "Total Campaigns",
                  val: metrics.totalCampaigns,
                  icon: TrendingUp,
                  color: "violet",
                },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-6 group/stat">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-tiny",
                      stat.color === "blue" ? "bg-blue-50 text-blue-600" :
                      stat.color === "orange" ? "bg-orange-50 text-orange-600" :
                      stat.color === "emerald" ? "bg-emerald-50 text-emerald-600" :
                      "bg-violet-50 text-violet-600"
                    )}
                  >
                    <stat.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">
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
                          className="w-20 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold focus:ring-1 focus:ring-blue-500 h-8 text-center outline-none"
                          placeholder="MIN"
                        />
                        <span className="text-gray-300 text-xs font-bold">─</span>
                        <input
                          type="number"
                          value={editedBrand.budgetMax}
                          onChange={(e) =>
                            setEditedBrand((prev) => ({
                              ...prev,
                              budgetMax: e.target.value,
                            }))
                          }
                          className="w-20 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold focus:ring-1 focus:ring-blue-500 h-8 text-center outline-none"
                          placeholder="MAX"
                        />
                      </div>
                    ) : (
                      <p className="text-lg font-bold text-gray-900 tracking-tight italic">
                        {stat.val}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-10 shadow-sm space-y-8">
            <h3 className="text-xs font-bold text-gray-900 tracking-widest uppercase flex items-center gap-3">
              <Globe size={16} className="text-emerald-600" /> Web Presence
            </h3>
            <div className="flex flex-col gap-3">
              {[
                {
                  id: "instagram",
                  label: "Instagram",
                  name: "INSTAGRAM",
                  color: "pink",
                },
                {
                  id: "tiktok",
                  label: "TikTok",
                  name: "TIKTOK",
                  color: "gray",
                },
                {
                  id: "twitter",
                  label: "Twitter / X",
                  name: "TWITTER",
                  color: "blue",
                },
                {
                  id: "linkedin",
                  label: "LinkedIn",
                  name: "LINKEDIN",
                  color: "indigo",
                },
              ].map((social) => (
                <div
                  key={social.id}
                  className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-all group/soc"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div
                      className={cn(
                        "w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-white shadow-sm border border-gray-50",
                        social.color === "pink" ? "text-pink-600" :
                        social.color === "blue" ? "text-blue-600" :
                        social.color === "indigo" ? "text-indigo-600" : "text-gray-900"
                      )}
                    >
                      <SocialIcon name={social.id} size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex flex-col">
                          <p className="text-[9px] font-bold text-gray-400 tracking-widest leading-none mb-1 uppercase">
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
                            className="bg-transparent border-0 border-b border-gray-200 p-0 focus:ring-0 focus:border-blue-500 text-xs font-bold w-full transition-all outline-none"
                            placeholder="handle or url"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-[9px] font-bold text-gray-400 tracking-widest leading-none mb-1 uppercase">
                            {social.name}
                          </p>
                          <p className="text-xs font-bold text-gray-700 truncate pr-2">
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
                      className="w-8 h-8 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all"
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
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
            <div className="border-b border-gray-100 px-10 flex gap-8 bg-gray-50/30">
              {["about", "campaigns"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "py-5 text-[11px] font-bold uppercase tracking-widest border-b-2 transition-all relative outline-none",
                    activeTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-400 hover:text-gray-600",
                  )}
                >
                  {tab === "about"
                    ? "About Brand"
                    : "Open Campaigns"}
                  {tab === "campaigns" && campaigns.length > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
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
                    <SectionHeader title="Our Story" icon={Edit3} />
                    {isEditing ? (
                      <InlineTextarea
                        value={editedBrand.description}
                        onChange={(e) =>
                          setEditedBrand((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Tell your brand's mission and values..."
                      />
                    ) : (
                      <div className="pl-6 border-l-2 border-blue-600/10">
                        <p className="text-gray-600 leading-relaxed text-[15px] font-medium whitespace-pre-wrap">
                          {brand.description ||
                            "No description provided yet. Edit your profile to add one."}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* IDEAL COLLABORATORS (LOOKING FOR) */}
                  <div className="space-y-6 pt-6">
                    <SectionHeader
                      title="Looking For"
                      icon={Target}
                      color="orange"
                    />
                    {isEditing ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {NICHES.map((niche) => (
                            <label
                              key={niche}
                              className="flex items-center gap-3 text-xs font-bold text-gray-600 cursor-pointer group bg-gray-50 hover:bg-gray-100 p-2.5 rounded-lg border border-gray-100 transition-all select-none"
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
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-0 cursor-pointer"
                              />
                              <span className="uppercase tracking-wide">
                                {niche}
                              </span>
                            </label>
                          ))}
                        </div>
                        <div className="pt-2">
                          <InlineInput
                            label="Add Custom Tags (Comma Separated)"
                            value={editedBrand.customLookingFor || ""}
                            onChange={(e) =>
                              setEditedBrand((prev) => ({
                                ...prev,
                                customLookingFor: e.target.value,
                              }))
                            }
                            placeholder="e.g. Design, Crypto, Outdoor..."
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2.5">
                        {brand.lookingFor && brand.lookingFor.length > 0 ? (
                          brand.lookingFor.map((tag, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-50 border border-gray-100 text-gray-600 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-gray-100 transition-all cursor-default"
                            >
                              #{tag}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-400 italic text-sm">
                            No categories defined.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                    <h3 className="text-xs font-bold text-gray-900 tracking-widest uppercase flex items-center gap-3">
                      <Briefcase size={16} className="text-blue-600" /> Live Campaigns
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {campaigns.length} results
                    </p>
                  </div>

                  {campaigns.length === 0 ? (
                    <div className="py-24 text-center">
                      <div className="w-16 h-16 rounded-full bg-gray-50 mx-auto flex items-center justify-center text-gray-200 mb-4">
                        <Briefcase size={28} />
                      </div>
                      <h4 className="text-gray-900 font-bold uppercase text-xs tracking-widest mb-1">
                        No active campaigns
                      </h4>
                      <p className="text-gray-400 font-medium text-xs max-w-[200px] mx-auto">
                        Your brand hasn't posted any live campaigns yet.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {campaigns.map((c) => (
                        <div
                          key={c._id}
                          className="p-8 bg-gray-50/50 border border-gray-100 rounded-2xl hover:bg-white hover:shadow-md transition-all group"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-blue-600 tracking-widest uppercase">
                                Campaign
                              </p>
                              <h4 className="text-base font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors uppercase">
                                {c.name}
                              </h4>
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-500 text-white px-2.5 py-1 rounded-lg">
                              LIVE
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-6 leading-relaxed">
                            {c.description}
                          </p>
                          <div className="flex items-center justify-between pt-6 border-t border-gray-200/50">
                            <div className="flex items-center gap-2 font-bold text-gray-900 text-sm italic">
                              <DollarSign size={14} className="text-emerald-500 not-italic" />
                              {c.budget?.min?.toLocaleString()} - {c.budget?.max?.toLocaleString()}
                            </div>
                            <button className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all outline-none">
                               <TrendingUp size={14} className="rotate-45" />
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
