import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Globe,
  MapPin,
  Calendar,
  ShieldCheck,
  Users,
  ExternalLink,
  MessageSquare,
  Send,
  AlertCircle,
  ShieldClose,
  Star,
  Briefcase,
  TrendingUp,
  Edit3,
} from "lucide-react";
import api from "../../services/api";
import SendCollabModal from "../../components/layout/influencer/SendCollabModal";
import { cn } from "../../utils/helper";

// ── Helpers ────────────────────────────────────────────────────────────────────

const formatJoinDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

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

// ── Main Component ─────────────────────────────────────────────────────────────

const InfluencerProfile = () => {
  const { influencerId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/brands/influencers/${influencerId}`);
        if (res.data?.success) {
          setData(res.data.data);
        } else {
          setError("Failed to load influencer profile.");
        }
      } catch (err) {
        console.error("Error loading influencer profile:", err);
        setError(
          err.response?.data?.message || "Failed to load influencer profile.",
        );
      } finally {
        setLoading(false);
      }
    };
    if (influencerId) load();
  }, [influencerId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest animate-pulse">
          Fetching Influencer Data...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-[1100px] mx-auto w-full pb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex items-start gap-4 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="font-medium">
            {error || "Influencer profile not found"}
          </p>
        </div>
      </div>
    );
  }

  const { influencer, totalFollowers } = data || {};
  const user = influencer?.user || {};

  // ── DEACTIVATED ─────────────────────────────────────────────────────────────
  if (user?.isDeactivated) {
    return (
      <div className="max-w-[1100px] mx-auto w-full pb-10 px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-16 flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-4">
            <ShieldClose size={32} className="text-slate-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Account Deactivated
          </h2>
          <p className="text-slate-500 max-w-sm mb-6 font-medium leading-relaxed">
            This influencer has temporarily deactivated their account. They will
            be back soon!
          </p>
          <button
            onClick={() => navigate("/brand/search")}
            className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-slate-200"
          >
            Find Other Influencers
          </button>
        </div>
      </div>
    );
  }

  const name = user?.fullname || influencer?.username || "Influencer";
  const avatar =
    influencer?.profilePicture ||
    user?.profilePic ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`;
  const cover =
    influencer?.coverImage ||
    user?.coverPic ||
    "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=2000";

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24 animate-in fade-in duration-700 px-4">
      {/* ── HEADER ACTIONS ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors mb-4 border-none"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </button>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">
            {name}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <MessageSquare size={14} /> Message
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-3 bg-[#1A73E8] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-blue-100 hover:bg-[#1557B0] transition-all flex items-center gap-2.5 active:scale-95 border-none"
          >
            <Send size={14} /> Send Collab Request
          </button>
        </div>
      </div>

      {/* ── HERO BANNER ── */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden group/card relative">
        <div className="h-56 bg-slate-100 relative group/cover cursor-default">
          <img
            src={cover}
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        </div>

        <div className="px-12 pb-12">
          <div className="flex flex-col md:flex-row items-end gap-12 -mt-16 relative z-10">
            <div className="relative group/logo">
              <img
                src={avatar}
                alt="Avatar"
                className="w-44 h-44 rounded-[2.5rem] object-cover border-[10px] border-white shadow-2xl bg-white"
              />
              {user.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2.5 rounded-full text-white shadow-lg border-4 border-white">
                  <ShieldCheck size={20} fill="currentColor" stroke="white" />
                </div>
              )}
            </div>

            <div className="flex-1 pb-4 space-y-6">
              <div className="flex flex-wrap items-center gap-10 pt-8">
                {/* Location */}
                <div className="flex items-center gap-3.5 group/info">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 transition-all group-hover/info:scale-110 shadow-sm border border-blue-100/50">
                    <MapPin size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">
                      Location
                    </p>
                    <div className="text-sm font-black text-slate-800">
                      {influencer.location || "Earth"}
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-center gap-3.5 group/info">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 transition-all group-hover/info:scale-110 shadow-sm border border-orange-100/50">
                    <Briefcase size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">
                      Niche
                    </p>
                    <div className="text-sm font-black text-slate-800 capitalize">
                      {influencer.category || "Influencer"}
                    </div>
                  </div>
                </div>

                {/* Joined */}
                <div className="flex items-center gap-3.5 group/info">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 transition-all group-hover/info:scale-110 shadow-sm border border-emerald-100/50">
                    <Calendar size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">
                      Partner Since
                    </p>
                    <div className="text-sm font-black text-slate-800">
                      {formatJoinDate(user.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Media Kit */}
                {influencer.resume && (
                  <div className="flex items-center gap-3.5 group/info">
                    <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 transition-all group-hover/info:scale-110 shadow-sm border border-violet-100/50">
                      <Globe size={16} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">
                        Assets
                      </p>
                      <a
                        href={influencer.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-black text-blue-600 hover:underline"
                      >
                        Download Media Kit
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-0">
        {/* LEFT COLUMN: STATS & SOCIALS */}
        <div className="lg:col-span-4 space-y-8 animate-in slide-in-from-left-4 duration-1000">
          {/* CORE METRICS */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-2xl shadow-slate-200/30 space-y-10 group">
            <h3 className="text-sm font-black text-slate-900 tracking-widest uppercase flex items-center gap-3 text-left">
              <TrendingUp size={16} className="text-blue-600" /> Platform
              Insights
            </h3>
            <div className="space-y-8">
              <div className="flex items-center gap-6 group/stat">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 bg-blue-50 group-hover/stat:scale-110 transition-all duration-500 shadow-sm">
                  <Users size={20} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">
                    Total Reach
                  </p>
                  <p className="text-lg font-black text-slate-900 tracking-tight italic">
                    {(totalFollowers || 0).toLocaleString()}+
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 group/stat">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-orange-600 bg-orange-50 group-hover/stat:scale-110 transition-all duration-500 shadow-sm">
                  <Star size={20} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">
                    Avg Rating
                  </p>
                  <p className="text-lg font-black text-slate-900 tracking-tight italic">
                    {influencer.averageRating || "0.0"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SOCIAL HANDLINGS */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-2xl shadow-slate-200/30 space-y-8">
            <h3 className="text-sm font-black text-slate-900 tracking-widest uppercase flex items-center gap-3 text-left">
              <Globe size={16} className="text-emerald-600" /> Digital Ecosystem
            </h3>
            <div className="flex flex-col gap-4">
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
                  color: "slate",
                },
                {
                  id: "twitter",
                  label: "Twitter",
                  name: "TWITTER",
                  color: "blue",
                },
                {
                  id: "youtube",
                  label: "YouTube",
                  name: "YOUTUBE",
                  color: "red",
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
                  className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all group/soc"
                >
                  <div className="flex items-center gap-3.5 text-left">
                    <div
                      className={cn(
                        `w-9 h-9 rounded-xl flex items-center justify-center bg-white shadow-sm transition-transform group-hover/soc:rotate-6`,
                        `text-${social.color}-600`,
                      )}
                    >
                      <SocialIcon name={social.id} size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 tracking-widest leading-none mb-1.5 uppercase">
                        {social.name}
                      </p>
                      <p className="text-xs font-bold text-slate-600">
                        {influencer.socialMedia?.[social.id]
                          ? `@${influencer.socialMedia[social.id]}`
                          : "Not linked"}
                      </p>
                    </div>
                  </div>
                  {influencer.socialMedia?.[social.id] && (
                    <button className="w-8 h-8 rounded-lg bg-slate-200/50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all border-none">
                      <ExternalLink size={12} />
                    </button>
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
              {["about", "collaborations", "reviews"].map((tab) => (
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
                    ? "Strategic Bio"
                    : tab === "collaborations"
                      ? "Collaborations"
                      : "Brand Feedback"}
                </button>
              ))}
            </div>

            <div className="p-12 flex-1">
              {activeTab === "about" && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 text-left">
                  <SectionHeader title="The Narrative" icon={Edit3} />
                  <p className="text-slate-600 leading-relaxed font-medium pl-6 border-l-4 border-slate-100 whitespace-pre-wrap text-base">
                    {influencer.about || "Biography under review."}
                  </p>
                </div>
              )}

              {activeTab === "collaborations" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                  <SectionHeader
                    title="Active Collaborations"
                    icon={Briefcase}
                    color="blue"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(influencer.activeCollaborations || []).map(
                      (collab, idx) => (
                        <div
                          key={idx}
                          className="p-8 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group"
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
                                With{" "}
                                {collab.sender?.fullname || "Brand Partner"}
                              </p>
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest bg-emerald-500 text-white px-3 py-1.5 rounded-xl shadow-lg shadow-emerald-200">
                              ACTIVE
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium line-clamp-3 mb-6">
                            {collab.campaign?.description ||
                              "Ongoing collaboration."}
                          </p>
                        </div>
                      ),
                    )}
                    {(!influencer.activeCollaborations ||
                      influencer.activeCollaborations.length === 0) && (
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
                    title="Verified Feedback"
                    icon={Star}
                    color="yellow"
                  />
                  <div className="space-y-6 text-left">
                    {(influencer.reviews || []).map((review, i) => (
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
                        <div className="flex-1 space-y-2">
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
                        </div>
                      </div>
                    ))}
                    {(!influencer.reviews ||
                      influencer.reviews.length === 0) && (
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

      {showModal && (
        <SendCollabModal
          targetType="influencer"
          targetUser={{
            _id: user?._id || data?.influencer?.user?._id || influencerId,
            name: name,
          }}
          onClose={() => setShowModal(false)}
          onSuccess={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default InfluencerProfile;
