import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Globe,
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  Target,
  TrendingUp,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  ExternalLink,
  Star,
} from "lucide-react";
import api from "../../services/api";
import profileService from "../../services/profileService";
import { setProfileData } from "../../redux/slices/Profileslice";
import {
  updateUserFields,
  updateProfileComplete,
} from "../../redux/slices/authSlice";
import { cn } from "../../utils/helper";
import VerifiedTick from "../../components/common/VerifiedTick";



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
    youtube: Youtube,
  };
  const Icon = map[name?.toLowerCase()] || Globe;
  return <Icon size={size} className={className} />;
};



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

  // Profile State
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  
  const brandId = roleProfile?._id;

  const fetchBrand = useCallback(async () => {
    if (!brandId) return;
    setLoading(true);
    try {
      const res = await api.get(`/brands/${brandId}/public`);
      const brandData = res.data.data;
      setData(brandData);
    } catch (err) {
      setError(err.response?.data?.message || "Brand profile not found");
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  useEffect(() => {
    fetchBrand();
  }, [fetchBrand]);

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
    avgBudget: brand.budgetRange?.min
        ? `$${brand.budgetRange.min?.toLocaleString()}-$${brand.budgetRange.max?.toLocaleString()}`
        : "Not specified",
    totalCampaigns: data.stats?.totalCampaignsCount || 0,
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto space-y-10 pb-24 px-4 md:px-8 animate-in fade-in duration-700">
      {/* ── HEADER ACTIONS ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-10 border-b border-gray-100 pb-8">
        <div>

          <p className="text-slate-500 text-sm font-medium">
            How your brand appears to <span className="text-blue-600 font-bold">Influencers</span> and collaborators.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Edit Profile button removed as per user request */}
        </div>
      </div>

      {/* ── HERO BANNER ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden group/card relative transition-all">
        <div className="h-80 bg-slate-100 relative group/cover cursor-default">
          <img
            src={
              userDoc.coverPic ||
              "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=2000"
            }
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        </div>

        <div className="px-12 pb-12">
          <div className="flex flex-col md:flex-row items-end gap-12 -mt-16 relative z-10">
            {/* LOGO AREA */}
            <div className="relative group/logo shrink-0">
              <div className="w-44 h-44 rounded-[2.5rem] overflow-hidden border-[10px] border-white shadow-2xl bg-white flex items-center justify-center relative ring-1 ring-gray-100">
                {brand.logo ||
                  userDoc.profilePic ? (
                  <img
                    src={
                      brand.logo ||
                      userDoc.profilePic
                    }
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-black text-slate-100 italic">
                    {(name || "B")[0]}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 pb-4 space-y-6">
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight italic capitalize">
                    {name}
                  </h2>
                  <VerifiedTick user={userDoc} roleProfile={brand} size="lg" className="shadow-lg shadow-emerald-200" />
                </div>
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
                      {brand.address || "Global"}
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
                      {brand.industry || "General"}
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
                      {brand.website ? (
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
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-2xl shadow-slate-200/30 space-y-10 group">
            <h3 className="text-sm font-black text-slate-900 tracking-widest uppercase flex items-center gap-3">
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
                    <p className="text-lg font-bold text-gray-900 tracking-tight italic">
                      {stat.val}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-2xl shadow-slate-200/30 space-y-8">
            <h3 className="text-sm font-black text-slate-900 tracking-widest uppercase flex items-center gap-3">
              <Globe size={16} className="text-emerald-600" /> Web Presence
            </h3>
            <div className="flex flex-col gap-3">
              {(Array.isArray(brand.user?.verifiedPlatforms) ? brand.user.verifiedPlatforms : []).map((platData) => {
                if (!platData || !platData.platform || !platData.verified) return null;
                const platform = platData.platform;
                const knownPlatforms = {
                  instagram: { label: "Instagram", name: "INSTAGRAM", color: "pink" },
                  tiktok: { label: "TikTok", name: "TIKTOK", color: "gray" },
                  twitter: { label: "Twitter / X", name: "TWITTER", color: "blue" },
                  linkedin: { label: "LinkedIn", name: "LINKEDIN", color: "indigo" },
                  youtube: { label: "YouTube", name: "YOUTUBE", color: "red" },
                  facebook: { label: "Facebook", name: "FACEBOOK", color: "blue" }
                };

                const platformKey = platform.toLowerCase();
                const social = knownPlatforms[platformKey];

                if (!social) return null;

                const value = platData.username || platData.handle || platData.platformUserId;
                if (!value) return null;

                return (
                  <div
                    key={platform}
                    className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-all group/soc"
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div
                        className={cn(
                          "w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-white shadow-sm border border-gray-50",
                          social.color === "pink" ? "text-pink-600" :
                            social.color === "blue" ? "text-blue-600" :
                              social.color === "red" ? "text-red-600" :
                                social.color === "indigo" ? "text-indigo-600" : "text-gray-900"
                        )}
                      >
                        <SocialIcon name={platform} size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[9px] font-bold text-gray-400 tracking-widest leading-none uppercase">
                            {social.name}
                          </p>
                          <div className="px-1 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[7px] font-black uppercase tracking-tighter">
                            Verified
                          </div>
                        </div>
                        <p className="text-xs font-bold text-gray-700 truncate pr-2">
                          @{value}
                        </p>
                      </div>
                    </div>
                    {(() => {
                      const linkUrl = platData.profileUrl || (value.startsWith("http") ? value : `https://${platformKey === 'twitter' ? 'x' : platformKey}.com/${value.replace('@', '')}`);
                      return (
                        <a
                          href={linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all border-none"
                        >
                          <ExternalLink size={12} />
                        </a>
                      );
                    })()}
                  </div>
                );
              })}
              {(!brand.user?.verifiedPlatforms || Object.keys(brand.user.verifiedPlatforms).length === 0) && (
                <div className="py-8 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">No verified platforms</p>
                </div>
              )}
              {(!brand.socialMedia || Object.values(brand.socialMedia).every(v => !v)) && (
                <p className="text-xs font-medium text-gray-400 text-center py-4">No social platforms linked.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTENT AREAS */}
        <div className="lg:col-span-8 space-y-8 animate-in slide-in-from-right-4 duration-1000">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/30 overflow-hidden flex flex-col h-full min-h-[600px]">
            <div className="border-b border-slate-50 px-10 flex gap-8 bg-slate-50/10">
              {["about", "campaigns", "reviews"].map((tab) => (
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
                    ? "Our Story"
                    : tab === "campaigns"
                      ? "Open Campaigns"
                      : "Reviews"}
                  {tab === "campaigns" && campaigns.length > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      {campaigns.length}
                    </span>
                  )}
                  {tab === "reviews" && data.reviews && data.reviews.length > 0 && (
                    <span className="ml-2 bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      {data.reviews.length}
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
                    <SectionHeader title="Brand Narrative" icon={Globe} />
                    <p className="text-slate-600 leading-relaxed font-medium pl-6 border-l-4 border-slate-100 whitespace-pre-wrap text-left text-[15px]">
                      {brand.description ||
                        "No description provided yet."}
                    </p>
                  </div>

                  {/* IDEAL COLLABORATORS (LOOKING FOR) */}
                  <div className="space-y-6 pt-6">
                    <SectionHeader
                      title="Ideal Partners"
                      icon={Target}
                      color="orange"
                    />
                    <div className="flex flex-wrap gap-2.5">
                      {brand.lookingFor && brand.lookingFor.length > 0 ? (
                        brand.lookingFor.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-50 border border-slate-100 text-slate-600 px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all cursor-default shadow-sm shadow-slate-100"
                          >
                            #{tag}
                          </span>
                        ))
                      ) : (
                        <p className="text-slate-400 italic text-sm font-medium">
                          No categories defined.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : activeTab === "campaigns" ? (
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
                          className="p-10 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="flex justify-between items-start mb-6">
                            <div className="space-y-1.5">
                              <p className="text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase">
                                Campaign
                              </p>
                              <h4 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors uppercase italic">
                                {c.name}
                              </h4>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500 text-white px-3 py-1.5 rounded-full shadow-lg shadow-emerald-100">
                              LIVE
                            </span>
                          </div>
                          <p className="text-slate-500 text-sm font-medium line-clamp-3 mb-8 leading-relaxed">
                            {c.description}
                          </p>
                          <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                            <div className="flex items-center gap-2.5 font-black text-slate-900 text-base italic tracking-tight">
                              <DollarSign size={16} className="text-emerald-500 not-italic" />
                              <span className="text-slate-300 not-italic font-medium mr-1">$</span>
                              {c.budget?.min?.toLocaleString()} - {c.budget?.max?.toLocaleString()}
                            </div>
                            <button className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 hover:bg-blue-600">
                              <TrendingUp size={16} className="rotate-45" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Reviews Tab */
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <SectionHeader
                    title="Influencer Feedback"
                    icon={Star}
                    color="amber"
                  />
                  <div className="space-y-6">
                    {(data.reviews || []).map((review, i) => (
                      <div
                        key={i}
                        className="p-10 bg-white border border-slate-100 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-start group hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-700"
                      >
                        <div className="relative shrink-0">
                          <img
                            src={
                              review.reviewer?.profilePic ||
                              `https://ui-avatars.com/api/?name=${review.reviewer?.fullname}`
                            }
                            className="w-20 h-20 rounded-[1.5rem] object-cover border-[6px] border-slate-50 shadow-xl group-hover:scale-105 transition-transform duration-500"
                            alt="Reviewer"
                          />
                        </div>
                        <div className="flex-1 text-left space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-black text-slate-900 uppercase italic tracking-tight text-lg">
                                {review.reviewer?.fullname}
                              </h4>
                              <p className="text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase">
                                Verified Influencer
                              </p>
                            </div>
                            <div className="flex gap-1 bg-slate-50 px-3 py-2 rounded-xl">
                              {[...Array(5)].map((_, idx) => (
                                <Star
                                  key={idx}
                                  size={14}
                                  className={cn(
                                    idx < review.rating
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-slate-200",
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-600 font-medium leading-relaxed italic text-[15px] pl-4 border-l-2 border-slate-100">
                            "{review.comment}"
                          </p>
                        </div>
                      </div>
                    ))}
                    {(!data.reviews || data.reviews.length === 0) && (
                      <div className="py-20 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                        <Star size={32} className="text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 font-black uppercase text-xs tracking-widest italic">
                          No reviews yet.
                        </p>
                        <p className="text-[10px] font-bold text-gray-300 mt-1 uppercase tracking-wide">
                          Reviews will appear here when influencers rate your brand.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfileView;
