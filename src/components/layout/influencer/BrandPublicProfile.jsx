import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Globe,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  CheckCircle,
  ExternalLink,
  Heart,
  Send,
  Users,
  TrendingUp,
  Star,
  Instagram,
  Twitter,
  LayoutDashboard,
  ShieldClose,
} from "lucide-react";
import api from "../../../services/api";
import collaborationService from "../../../services/collaborationService";
import SendCollabModal from "./SendCollabModal";
import { cn } from "../../../utils/helper";

const BrandPublicProfile = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [saved, setSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [activeCollab, setActiveCollab] = useState(null);
  const [isRequested, setIsRequested] = useState(false);
  const [appliedCampaignIds, setAppliedCampaignIds] = useState([]);
  const [activeCollabMap, setActiveCollabMap] = useState({}); // { [campaignId]: collabId }

  useEffect(() => {
    const fetchBrand = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/brands/${brandId}/public`);
        setData(res.data.data);
        
        // Check for active collaboration
        const brandUserId = res.data.data.brand?.user?._id;
        if (brandUserId) {
          try {
            const [collabRes, sentReqRes, activeCollabsRes] = await Promise.all([
              collaborationService.getLatestWithUser(brandUserId),
              collaborationService.getRequests({ type: "sent", limit: 100 }),
              collaborationService.getAll({ status: "active", limit: 100 })
            ]);

            if (collabRes.success && collabRes.data) {
              if (collabRes.data.status === 'active') {
                setActiveCollab(collabRes.data);
              } else if (collabRes.data.status === 'pending') {
                setIsRequested(true);
              }
            }

            if (sentReqRes.success) {
              const ids = sentReqRes.data.requests
                ?.filter(r => r.campaign)
                .map(r => (r.campaign?._id || r.campaign));
              setAppliedCampaignIds(ids || []);
            }

            if (activeCollabsRes.success) {
              const map = {};
              activeCollabsRes.data.collaborations
                ?.filter(c => c.campaign)
                .forEach(c => {
                  // Use robust ID extraction
                  const getStrId = (val) => {
                    if (!val) return '';
                    if (typeof val === 'string') return val;
                    return String(val.id || val._id || val);
                  };
                  const campId = getStrId(c.campaign);
                  map[campId] = getStrId(c._id);
                });
              setActiveCollabMap(map);
            }
          } catch (collabErr) {
            console.error("Error fetching relationship data:", collabErr);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "Brand not found");
      } finally {
        setLoading(false);
      }
    };
    fetchBrand();
  }, [brandId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading brand profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <Briefcase size={28} className="text-red-300" />
        </div>
        <p className="text-gray-600 font-medium">{error || "Brand not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1.5"
        >
          <ArrowLeft size={14} /> Go back
        </button>
      </div>
    );
  }

  // Deactivated state handle
  if (data.brand?.user?.isDeactivated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center mb-8 animate-bounce">
          <ShieldClose size={40} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Profile Deactivated</h2>
        <p className="text-slate-500 max-w-sm mb-8 font-medium">
          The brand has temporarily deactivated their account. Check back later or explore other brands.
        </p>
        <button
          onClick={() => navigate("/influencer/search/brands")}
          className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all"
        >
          Explore Other Brands
        </button>
      </div>
    );
  }

  const { brand, campaigns } = data;
  const user = brand?.user || data?.user || {};
  const name = brand?.brandname || user?.fullname || "Brand";
  const logo = brand?.logo || user?.profilePic;

  // Real metrics from backend stats object
  const metrics = {
    activeCampaigns: data.stats?.activeCampaignsCount || 0,
    collaborations: data.stats?.collaborationsCount || 0,
    avgBudget: brand.budgetRange
      ? `$${brand.budgetRange.min?.toLocaleString()}-$${brand.budgetRange.max?.toLocaleString()}`
      : "Not specified",
    totalCampaigns: data.stats?.totalCampaignsCount || 0,
  };

  // Contact / social data
  const socialLinks = {
    website: brand.website || null,
    instagram: brand.socialMedia?.instagram || null,
    twitter: brand.socialMedia?.twitter || null,
    tiktok: brand.socialMedia?.tiktok || null,
  };

  // What We Look For items
  const lookingFor = brand.lookingFor && brand.lookingFor.length > 0 
    ? brand.lookingFor 
    : [];

  // Niche tags
  const tags = [brand.industry, ...(brand.lookingFor?.slice(0, 2) || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      {/* ── HEADER ACTIONS ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in duration-700">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors mb-4 border-none bg-transparent p-0"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </button>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">
            {name}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSaved(!saved)}
            className={cn(
              "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border shadow-sm",
              saved
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            <Heart size={14} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save"}
          </button>
          
          {activeCollab ? (
            <button 
              onClick={() => navigate(`/influencer/collaboration/${activeCollab._id}`)}
              className="px-6 py-3 bg-indigo-600 border border-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-sm shadow-indigo-100"
            >
              <LayoutDashboard size={14} /> Collaboration
            </button>
          ) : isRequested ? (
            <div className="px-6 py-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
              <CheckCircle size={14} className="text-emerald-500" /> Requested
            </div>
          ) : (
            <button
              onClick={() => setShowApplyModal(true)}
              className="px-8 py-3 bg-amber-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-amber-100 hover:bg-amber-600 transition-all flex items-center gap-2.5 active:scale-95 border-none"
            >
              <Send size={14} /> Send Collab Request
            </button>
          )}
        </div>
      </div>


      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <div className="relative">
        <div className="h-44 sm:h-52 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 overflow-hidden relative">
          {user.coverPic ? (
            <img src={user.coverPic} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900" />
          )}
          {/* Decorative pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

      </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 -mt-16 relative z-10 px-8 pt-24 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              {/* Logo + Info */}
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="absolute -top-16 left-8">
                  {logo || user.profilePic ? (
                    <img
                      src={logo || user.profilePic}
                      alt={name}
                      className="w-36 h-36 rounded-2xl object-cover border-4 border-white shadow-xl"
                    />
                  ) : (
                    <div className="w-36 h-36 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 border-4 border-white shadow-xl flex items-center justify-center text-blue-600 font-bold text-4xl">
                      {name[0]}
                    </div>
                  )}
                </div>

                {/* Name + Meta */}
                <div className="pt-1">
                  <div className="flex items-center gap-2">
                    {user.isVerified && (
                      <div className="flex items-center gap-1 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-tight">
                        <CheckCircle size={10} fill="currentColor" stroke="white" /> Verified Entity
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {brand.description
                      ? brand.description.substring(0, 60) + (brand.description.length > 60 ? "..." : "")
                      : `Leading ${brand.industry || "brand"} looking for lifestyle influencers`}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                    {brand.address && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-gray-400" /> {brand.address}
                      </span>
                    )}
                    {!brand.address && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-gray-400" /> New York, NY
                      </span>
                    )}
                    {brand.followersCount > 0 && (
                      <span className="flex items-center gap-1">
                        <Users size={12} className="text-gray-400" /> {brand.followersCount.toLocaleString()} followers
                      </span>
                    )}
                    {brand.rating > 0 && (
                      <span className="flex items-center gap-1 text-amber-500">
                        <Star size={12} fill="currentColor" /> {brand.rating} ({brand.reviewsCount || 0} reviews)
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium bg-orange-50 text-orange-700 px-2.5 py-0.5 rounded-full border border-orange-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats / Description section remains below */}
          </div>
        </div>

      {/* ── Metrics Bar ───────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Briefcase size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{metrics.activeCampaigns}</p>
              <p className="text-xs text-gray-500">Active Campaigns</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <Users size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{metrics.collaborations}</p>
              <p className="text-xs text-gray-500">Collaborations</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
              <DollarSign size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{metrics.avgBudget}</p>
              <p className="text-xs text-gray-500">Avg. Budget</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <TrendingUp size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{metrics.totalCampaigns}</p>
              <p className="text-xs text-gray-500">Total Campaigns</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
        <div className="flex gap-1 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("about")}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "about"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            About Brand
          </button>
          <button
            onClick={() => setActiveTab("campaigns")}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "campaigns"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Active Campaigns
            {campaigns.length > 0 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                {campaigns.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Tab Content ───────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === "about" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column — About */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-base font-bold text-gray-900 mb-3">About {name}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {brand.description || "No description provided yet."}
                </p>
              </div>

              {/* What We Look For */}
              {lookingFor.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-base font-bold text-gray-900 mb-3">What We Look For</h2>
                  <ul className="space-y-2.5">
                    {lookingFor.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <CheckCircle
                          size={16}
                          className="text-green-500 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          stroke="white"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column — Contact + Industry */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4">Contact Info</h3>
                <div className="space-y-3">
                  {socialLinks.website && (
                    <a
                      href={socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Globe size={16} className="text-gray-400 flex-shrink-0" />
                      <span>Visit Website</span>
                      <ExternalLink size={12} className="text-gray-300 ml-auto" />
                    </a>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Instagram size={16} className="text-pink-500 flex-shrink-0" />
                    <span>{socialLinks.instagram}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg viewBox="0 0 24 24" width="16" height="16" className="text-gray-800 flex-shrink-0 fill-current">
                      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                    <span>{socialLinks.tiktok}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Twitter size={16} className="text-blue-400 flex-shrink-0" />
                    <span>{socialLinks.twitter}</span>
                  </div>
                </div>
              </div>

              {/* Industry */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-base font-bold text-gray-900 mb-3">Industry</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "campaigns" && (
          <div>
            {campaigns.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center">
                <Briefcase size={36} className="text-gray-200 mx-auto mb-3" />
                <h3 className="text-gray-700 font-medium mb-1">No active campaigns</h3>
                <p className="text-sm text-gray-400">
                  This brand doesn't have any active campaigns right now.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {campaigns.map((c) => {
                  const endDate = c.campaignTimeline?.endDate
                    ? new Date(c.campaignTimeline.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : null;
                  const collabId = activeCollabMap[String(c._id)];
                  const isOngoingCollab = !!collabId;
                  return (
                    <div
                      key={c._id}
                      onClick={() => {
                        if (isOngoingCollab) {
                          navigate(`/influencer/collaboration/${collabId}`);
                        } else {
                          navigate(`/influencer/search/campaign/${c._id}`);
                        }
                      }}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group p-5 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-purple-700 transition-colors line-clamp-2">
                          {c.name}
                        </h3>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          {isOngoingCollab ? (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-600 text-white px-2 py-0.5 rounded shadow-sm">
                              Ongoing Collaboration
                            </span>
                          ) : appliedCampaignIds.includes(c._id) ? (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded shadow-sm">
                              Applied
                            </span>
                          ) : (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full capitalize">
                              {c.status}
                            </span>
                          )}
                        </div>
                      </div>

                      {c.description && (
                        <p className="text-xs text-gray-500 line-clamp-2">{c.description}</p>
                      )}

                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full">
                          {c.industry}
                        </span>
                        {c.platform?.slice(0, 2).map((p) => (
                          <span
                            key={p}
                            className="text-xs bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-full capitalize"
                          >
                            {p}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-1 text-gray-700">
                          <DollarSign size={12} className="text-green-500" />
                          <span className="text-xs font-semibold">
                            ${c.budget?.min?.toLocaleString()} – $
                            {c.budget?.max?.toLocaleString()}
                          </span>
                        </div>
                        {endDate && (
                          <div className="flex items-center gap-1 text-gray-400">
                            <Calendar size={10} />
                            <span className="text-xs">Ends {endDate}</span>
                          </div>
                        )}
                      </div>

                      <p className={cn(
                        "text-xs font-bold transition-colors",
                        isOngoingCollab ? "text-indigo-600" :
                        appliedCampaignIds.includes(c._id) ? "text-emerald-600" : 
                        "text-purple-600 group-hover:text-purple-800"
                      )}>
                        {isOngoingCollab ? "Go to Collaboration →" :
                         appliedCampaignIds.includes(c._id) ? "View Application →" :
                         "View & apply →"}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Send Request Modal ────────────────────────────────────── */}
      {showApplyModal && (
        <SendCollabModal
          targetUser={{ _id: brandId, name: name }}
          targetType="brand"
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => setShowApplyModal(false)}
        />
      )}
    </div>
  );
};

export { BrandPublicProfile };
export default BrandPublicProfile;
