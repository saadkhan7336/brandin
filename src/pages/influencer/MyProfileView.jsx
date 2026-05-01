import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Globe,
  MapPin,
  Briefcase,
  CheckCircle,
  Users,
  TrendingUp,
  FileText,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Star,
  ExternalLink,
  Download,
  Eye,
  X,
  Link as LinkIcon,
  FolderOpen,
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

// Helper to format bytes
const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};





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

export default function MyProfileView() {
  const dispatch = useDispatch();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [previewItem, setPreviewItem] = useState(null);
  const navigate = useNavigate();

    const handleDownload = async (url, title, type) => {
      if (type === "link") {
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }
      
      // For Cloudinary files, especially raw ones, we can force a download by 
      // adding the fl_attachment flag to the URL if it's an image/video, 
      // or just opening it in a new tab for raw files if fetch fails.
      try {
        // Try to fetch and download if possible (helps with naming)
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = title || "portfolio-item";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Download failed, falling back to direct link:", error);
        // For Cloudinary files, try fl_attachment. If it's a raw file, it will just open/download.
        const downloadUrl = (url.includes('cloudinary.com') && !url.includes('/raw/')) 
          ? url.replace('/upload/', '/upload/fl_attachment/')
          : url;
        
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };
    


  // Check if viewing own profile
  const isOwnProfile = useSelector(state => state.auth.user?._id) === data?.user?._id;

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/influencers/profile");
      const profileData = res.data.data;
      setData(profileData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest animate-pulse">
          Synchronizing Data...
        </p>
      </div>
    );

  if (!data) return <div className="text-center py-20">Profile not found.</div>;

  const name = data.user?.fullname || data.username || "Influencer";
  const avatar =
    data.profilePicture ||
    data.user?.profilePic ||
    `https://ui-avatars.com/api/?name=${name}`;
  const cover =
    data.coverImage ||
    data.user?.coverPic ||
    "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=2000";

  return (
    <div className="w-full max-w-[1800px] mx-auto space-y-10 pb-24 animate-in fade-in duration-700">
      {/* ── HEADER ACTIONS ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-4 pt-10">
        <div>
          <p className="text-slate-500 text-sm font-medium">
            This is how <span className="text-blue-600 font-bold">Brands</span>{" "}
            and{" "}
            <span className="text-slate-900 font-bold">Talent Managers</span>{" "}
            see your portfolio.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Edit option removed as per user request */}
        </div>
      </div>

      {/* ── HERO BANNER ── */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden group/card relative">
        <div className="h-80 bg-slate-100 relative group/cover cursor-default">
          <img
            src={cover}
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover transition-transform group-hover/card:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        </div>

        <div className="px-12 pb-12">
          <div className="flex flex-col md:flex-row items-center gap-12 -mt-16 relative z-10">
            <div className="relative group/logo">
              <img
                src={avatar}
                alt="Avatar"
                className="w-44 h-44 rounded-[2.5rem] object-cover border-[10px] border-white shadow-2xl bg-white"
              />
            </div>

            <div className="flex-1 pt-16 pb-4 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight italic capitalize">
                    {name}
                  </h2>
                  <VerifiedTick user={data.user} roleProfile={data} size="lg" className="shadow-lg shadow-emerald-200" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-10 pt-2">
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
                      {data.location || "Earth"}
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-center gap-3.5 group/info">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 transition-all group-hover/info:scale-110 shadow-sm border border-orange-100/50">
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">
                      Niche
                    </p>
                    <div className="text-sm font-black text-slate-800 text-left">
                      {data.category || "-"}
                    </div>
                  </div>
                </div>

                {/* Portfolio */}
                <div className="flex items-center gap-3.5 group/info">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 transition-all group-hover/info:scale-110 shadow-sm border border-emerald-100/50">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">
                      Portfolio
                    </p>
                    <div className="text-sm font-black text-slate-800 text-left">
                      {Array.isArray(data.portfolio) && data.portfolio.length > 0 ? (
                        <span className="text-blue-600">
                          {data.portfolio.length} {data.portfolio.length === 1 ? "Item" : "Items"}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic font-medium">
                          None
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">
        {/* LEFT COLUMN: STATS & SOCIALS */}
        <div className="lg:col-span-4 space-y-8 animate-in slide-in-from-left-4 duration-1000">
          {/* CORE METRICS */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-2xl shadow-slate-200/30 space-y-10 group">
            <h3 className="text-sm font-black text-slate-900 tracking-widest uppercase flex items-center gap-3">
              <TrendingUp size={16} className="text-blue-600" /> Influence Stats
            </h3>
            <div className="space-y-8">
              <div className="flex items-center gap-6 group/stat">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 bg-blue-50 group-hover/stat:scale-110 transition-all duration-500 shadow-sm">
                  <Users size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">
                    Total Reach
                  </p>
                  <p className="text-lg font-black text-slate-900 tracking-tight italic">
                    {(data.followersCount || 0).toLocaleString()}+
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 group/stat">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-orange-600 bg-orange-50 group-hover/stat:scale-110 transition-all duration-500 shadow-sm">
                  <Star size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">
                    Avg Rating
                  </p>
                  <p className="text-lg font-black text-slate-900 tracking-tight italic">
                    {data.averageRating || "0.0"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 group/stat">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600 bg-emerald-50 group-hover/stat:scale-110 transition-all duration-500 shadow-sm">
                  <CheckCircle size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">
                    Collaborations
                  </p>
                  <p className="text-lg font-black text-slate-900 tracking-tight italic">
                    {data.collaborationCount || "0"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SOCIAL HANDLINGS */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-2xl shadow-slate-200/30 space-y-8">
            <h3 className="text-sm font-black text-slate-900 tracking-widest uppercase flex items-center gap-3">
              <Globe size={16} className="text-emerald-600" /> Digital Ecosystem
            </h3>
            <div className="flex flex-col gap-4">
              {(Array.isArray(data.user?.verifiedPlatforms) ? data.user.verifiedPlatforms : []).map((platformData) => {
                if (!platformData || !platformData.platform || !platformData.verified) return null;
                const platform = platformData.platform;
                
                const knownPlatforms = {
                  instagram: { label: "Instagram", name: "INSTAGRAM", color: "pink" },
                  tiktok: { label: "TikTok", name: "TIKTOK", color: "slate" },
                  twitter: { label: "Twitter", name: "TWITTER", color: "blue" },
                  youtube: { label: "YouTube", name: "YOUTUBE", color: "red" },
                  linkedin: { label: "LinkedIn", name: "LINKEDIN", color: "indigo" },
                  facebook: { label: "Facebook", name: "FACEBOOK", color: "blue" }
                };

                const social = knownPlatforms[platform.toLowerCase()] || {
                  label: platform.charAt(0).toUpperCase() + platform.slice(1),
                  name: platform.toUpperCase(),
                  color: "slate"
                };

                const displayValue = platformData.username || platformData.platformUserId || platformData.profileUrl || "Connected";
                const linkUrl = platformData.profileUrl || (displayValue.startsWith("http") ? displayValue : `https://${platform}.com/${displayValue}`);

                return (
                  <div
                    key={platform}
                    className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all group/soc"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={cn(
                          `w-9 h-9 rounded-xl flex items-center justify-center bg-white shadow-sm transition-transform group-hover/soc:rotate-6`,
                          `text-${social.color}-600`,
                        )}
                      >
                        <SocialIcon name={platform} size={16} />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <p className="text-[10px] font-black text-slate-400 tracking-widest leading-none uppercase">
                            {social.name}
                          </p>
                          <div className="px-1 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[7px] font-black uppercase tracking-tighter">
                            Verified
                          </div>
                        </div>
                        <p className="text-xs font-bold text-slate-600">
                          {displayValue.startsWith("http") ? "Profile" : (displayValue.startsWith("@") ? displayValue : `@${displayValue}`)}
                        </p>
                      </div>
                    </div>
                    {linkUrl && (
                      <a
                        href={linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded-lg bg-slate-200/50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all border-none"
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                );
              })}
              {(!data.user?.verifiedPlatforms || !Array.isArray(data.user.verifiedPlatforms) || data.user.verifiedPlatforms.length === 0) && (
                <div className="text-center py-6">
                   <p className="text-xs font-medium text-slate-400">No verified platforms linked.</p>
                   <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tight mt-1">Connect accounts in Settings</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTENT AREAS */}
        <div className="lg:col-span-8 space-y-8 animate-in slide-in-from-right-4 duration-1000">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/30 overflow-hidden flex flex-col h-full">
            <div className="border-b border-slate-50 px-10 flex gap-8 bg-slate-50/10">
              {["about", "portfolio", "collaborations", "reviews"].map((tab) => (
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
                    ? "Story"
                    : tab === "portfolio"
                      ? "Portfolio"
                      : tab === "collaborations"
                        ? "Collaborations"
                        : "Reviews"}
                </button>
              ))}
            </div>

            <div className="p-12 flex-1">
              {activeTab === "about" && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                  <SectionHeader title="My Narrative" icon={Globe} />
                  <p className="text-slate-600 leading-relaxed font-medium pl-6 border-l-4 border-slate-100 whitespace-pre-wrap text-left">
                    {data.about || "No story shared yet."}
                  </p>
                </div>
              )}

              {activeTab === "portfolio" && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                  <SectionHeader title="My Portfolio" icon={FolderOpen} color="violet" />
                  {Array.isArray(data.portfolio) && data.portfolio.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {data.portfolio.map((item, idx) => (
                        <div
                          key={idx}
                          className="group bg-slate-50 hover:bg-white border border-slate-100 hover:border-violet-100 rounded-[2rem] p-6 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 flex flex-col gap-4"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                              {item.type === "link" ? (
                                <LinkIcon size={18} className="text-violet-500" />
                              ) : (
                                <FileText size={18} className="text-blue-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <h4 className="text-sm font-black text-slate-900 truncate tracking-tight">{item.title || "Untitled"}</h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                {item.type === "link" ? "Web Link" : (
                                  <>
                                    File {item.fileSize > 0 && `• ${formatBytes(item.fileSize)}`}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-auto">
                            <button
                              onClick={() => setPreviewItem(item)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all"
                            >
                              <Eye size={13} /> Preview
                            </button>
                            <button
                              onClick={() => handleDownload(item.url, item.title, item.type)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-black transition-all"
                            >
                              <Download size={13} /> {item.type === "link" ? "Open" : "Download"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                      <FolderOpen size={32} className="text-slate-200 mx-auto mb-3" />
                      <p className="text-slate-400 font-black uppercase text-xs tracking-widest italic">
                        No portfolio items yet.
                      </p>
                      <p className="text-[10px] font-bold text-blue-400 mt-1 uppercase tracking-wide">
                        Add items in Profile Settings
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "collaborations" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between">
                    <SectionHeader
                      title="Active Collaborations"
                      icon={Briefcase}
                      color="blue"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                    {(data.activeCollaborations || []).map((collab, idx) => (
                      <div
                        key={idx}
                        className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] group hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className="space-y-1 text-left">
                            <p className="text-[10px] font-black text-blue-600 tracking-widest uppercase leading-none">
                              Live Campaign
                            </p>
                            <h4 className="text-xl font-black text-slate-900 tracking-tight italic uppercase leading-tight">
                              {collab.campaign?.name || "Untitled"}
                            </h4>
                            <p className="text-xs font-bold text-slate-400 italic">
                              With {collab.brand?.fullname || collab.sender?.fullname || "Brand Partner"}
                            </p>
                          </div>
                          <span className="text-[8px] font-black uppercase tracking-widest bg-emerald-500 text-white px-3 py-1.5 rounded-xl shadow-lg shadow-emerald-200">
                            ACTIVE
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium line-clamp-3 text-left mb-6">
                          {collab.campaign?.description || "Ongoing collaboration details..."}
                        </p>
                        
                        {isOwnProfile && (
                          <button
                            onClick={() => navigate(`/influencer/collaboration/${collab._id}`)}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all duration-300"
                          >
                            Manage Project
                            <ExternalLink size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                    {(data.activeCollaborations || []).length === 0 && (
                      <div className="col-span-full py-20 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-black uppercase text-xs tracking-widest italic">
                          No active collaborations right now.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <SectionHeader
                    title="Brand Feedback"
                    icon={Star}
                    color="yellow"
                  />
                  <div className="space-y-6">
                    {(data.reviews || []).map((review, i) => (
                      <div
                        key={i}
                        className="p-8 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] flex flex-col md:flex-row gap-6 items-start group hover:bg-white hover:shadow-2xl transition-all duration-500"
                      >
                        <img
                          src={
                            review.reviewer?.profilePic ||
                            `https://ui-avatars.com/api/?name=${review.reviewer?.fullname}`
                          }
                          className="w-14 h-14 rounded-2xl object-cover border-4 border-white shadow-lg"
                          alt="Reviewer"
                        />
                        <div className="flex-1 text-left space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-black text-slate-900 uppercase italic tracking-tight">
                              {review.reviewer?.fullname}
                            </h4>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, idx) => (
                                <Star
                                  key={idx}
                                  size={12}
                                  className={cn(
                                    idx < review.rating
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-slate-200",
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-600 font-medium leading-relaxed italic text-sm">
                            "{review.comment}"
                          </p>
                          <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase pt-2">
                            Verified Brand Partner
                          </p>
                        </div>
                      </div>
                    ))}
                    {(!data.reviews || data.reviews.length === 0) && (
                      <div className="py-20 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-black uppercase text-xs tracking-widest italic">
                          No reviews yet.
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

      {/* ── Portfolio Preview Modal ── */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="bg-white rounded-[2.5rem] overflow-hidden w-full max-w-4xl shadow-2xl flex flex-col"
            style={{ maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                  {previewItem.type === "link" ? (
                    <LinkIcon size={16} className="text-violet-500" />
                  ) : (
                    <FileText size={16} className="text-blue-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight">{previewItem.title || "Portfolio Item"}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{previewItem.type === "link" ? "Web Link" : "File"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewItem(null)}
                  className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
             {/* Modal Body */}
            <div className="flex-grow bg-slate-900/5 overflow-hidden relative">
              {previewItem.type === "link" ? (
                <iframe
                  src={previewItem.url}
                  title={previewItem.title}
                  className="w-full h-full border-0 bg-white"
                  style={{ minHeight: "70vh" }}
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4" style={{ minHeight: "70vh" }}>
                  {previewItem.url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) ? (
                    <img 
                      src={previewItem.url} 
                      alt={previewItem.title} 
                      className="max-w-full max-h-full object-contain shadow-2xl rounded-lg bg-white" 
                    />
                  ) : (previewItem.url.toLowerCase().endsWith('.pdf') || 
                       previewItem.title?.toLowerCase().endsWith('.pdf') || 
                       previewItem.format?.toLowerCase() === 'pdf') ? (
                    <iframe
                      src={`https://docs.google.com/gview?url=${encodeURIComponent(previewItem.url)}&embedded=true`}
                      title={previewItem.title}
                      className="w-full h-full border-0 bg-white rounded-lg shadow-sm"
                      style={{ minHeight: "70vh" }}
                    />
                  ) : (
                    <div className="text-center space-y-4">
                       <FileText size={48} className="text-slate-300 mx-auto" />
                       <p className="text-slate-500 font-medium">Preview not available for this file type.</p>
                       <button 
                        onClick={() => handleDownload(previewItem.url, previewItem.title, previewItem.type)}
                        className="text-blue-600 font-bold uppercase text-[10px] tracking-widest"
                       >
                        Download to View
                       </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center">
              <p className="text-xs text-slate-400 font-medium italic">
                {previewItem.type === "link" ? "External content may have restrictions." : "Portfolio file preview."}
              </p>
              <button
                onClick={() => handleDownload(previewItem.url, previewItem.title, previewItem.type)}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                <Download size={16} /> {previewItem.type === "link" ? "Open Link" : "Download File"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
