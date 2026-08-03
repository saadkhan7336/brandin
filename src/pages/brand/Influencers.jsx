import React, { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, CheckCircle, Clock, Users,
  Search, X, Briefcase, Sparkles, XCircle,
  ArrowRight, Star, ShieldCheck, MapPin, TrendingUp,
  ChevronLeft, ChevronRight, Zap, Tag, Activity
} from 'lucide-react';
import api from '../../services/api';
import collaborationService from '../../services/collaborationService';
import VerifiedTick from '../../components/common/VerifiedTick';
import SocialIcon from '../../components/common/SocialIcon';
import { getFilteredInfluencers } from '../../services/aiService.js';
import SendCollabModal from '../../components/layout/influencer/SendCollabModal';
import { getOptimizedImage } from '../../utils/imageOptimization';

const CampaignSelectionModal = lazy(() => import('../../components/ai/CampaignSelectionModal.jsx'));
const AIInfluencerCard = lazy(() => import('../../components/cards/AIInfluencerCard.jsx'));

const stripHtml = (text) => {
  if (!text) return '';
  return text.replace(/<\/?[^>]+(>|$)/g, '');
};

const formatFollowers = (n) => {
  if (!n || n === 0) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

// ─── Platform gradient map ───────────────────────────────────────────────────
const PLATFORM_GRADIENT = {
  instagram: 'from-[#833ab4] via-[#fd1d1d] to-[#fcb045]',
  youtube:   'from-[#ff0000] to-[#c4302b]',
  tiktok:    'from-[#010101] to-[#69C9D0]',
  linkedin:  'from-[#0077B5] to-[#00a0dc]',
  twitter:   'from-[#1DA1F2] to-[#0d8bd9]',
  x:         'from-[#14171a] to-[#536471]',
};

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-l-4 border-[#e2e8f0] shadow-sm overflow-hidden animate-pulse" style={{ borderLeftColor: '#cbd5e1' }}>
      <div className="px-4 pt-4 pb-3 flex items-start gap-3">
        <div className="w-[52px] h-[52px] rounded-xl bg-slate-200 flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 w-28 bg-slate-200 rounded-full" />
          <div className="h-2.5 w-16 bg-slate-100 rounded-full" />
          <div className="h-2.5 w-20 bg-slate-100 rounded-full" />
        </div>
        <div className="text-right space-y-1">
          <div className="h-6 w-14 bg-slate-200 rounded" />
          <div className="h-2 w-10 bg-slate-100 rounded ml-auto" />
        </div>
      </div>
      <div className="px-4 pb-3"><div className="h-6 w-32 bg-slate-100 rounded-full" /></div>
      <div className="px-4 pb-3 space-y-1.5">
        <div className="flex justify-between"><div className="h-2.5 w-20 bg-slate-100 rounded" /><div className="h-2.5 w-16 bg-slate-100 rounded" /></div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full" />
      </div>
      <div className="px-4 pb-3 flex gap-2">
        <div className="h-7 w-20 bg-slate-100 rounded-full" />
        <div className="h-7 w-20 bg-slate-100 rounded-full" />
      </div>
      <div className="px-4 pb-3 space-y-1">
        <div className="h-2.5 w-full bg-slate-100 rounded" />
        <div className="h-2.5 w-4/5 bg-slate-100 rounded" />
      </div>
      <div className="px-4 pb-4 flex gap-2">
        <div className="flex-[2] h-10 bg-slate-200 rounded-xl" />
        <div className="flex-1 h-10 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

// ─── Influencer Card ──────────────────────────────────────────────────────────
function InfluencerCard({ inf, collab, isRequested, onInvite, onNavigate }) {
  // DB aligned fields
  const primaryPlatform = inf.platforms?.find(p => p?.name)?.name || '';
  const totalFollowers = (inf.platforms || []).reduce((sum, p) => sum + (p?.followers || 0), 0)
    || inf.followersCount || 0;
  const engagementRate = inf.engagementRate || 0;
  const tags = Array.isArray(inf.tags) ? inf.tags.slice(0, 3) : [];
  const rating = inf.averageRating || 0;
  const reviewCount = inf.reviewsCount || 0;
  const collabCount = inf.collaborationCount || 0;
  const category = inf.category || '';
  const location = stripHtml(inf.location || '');
  const cleanUsername = stripHtml(inf.username || 'Creator');
  const cleanAbout = stripHtml(inf.about)
    || 'Top-tier creator focused on high-quality content and brand storytelling.';
  const isVerified = inf.isVerified;
  const trustHigh = isVerified || rating >= 4;

  // Platform color map for left border + badge
  const PLATFORM_COLOR = {
    instagram: { border: '#c026d3', bg: 'bg-fuchsia-50', text: 'text-fuchsia-600', bar: 'bg-fuchsia-500' },
    youtube:   { border: '#dc2626', bg: 'bg-red-50',     text: 'text-red-600',     bar: 'bg-red-500'     },
    tiktok:    { border: '#0ea5e9', bg: 'bg-sky-50',     text: 'text-sky-600',     bar: 'bg-sky-500'     },
    linkedin:  { border: '#0077B5', bg: 'bg-blue-50',    text: 'text-blue-700',    bar: 'bg-blue-600'    },
    twitter:   { border: '#1DA1F2', bg: 'bg-sky-50',     text: 'text-sky-600',     bar: 'bg-sky-400'     },
    x:         { border: '#14171a', bg: 'bg-slate-100',  text: 'text-slate-800',   bar: 'bg-slate-700'   },
  };
  const platformKey = primaryPlatform.toLowerCase();
  const pColor = PLATFORM_COLOR[platformKey] || { border: '#2563eb', bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500' };

  // Audience Fit score
  const audienceFit = engagementRate > 0
    ? Math.min(100, Math.round(engagementRate * 10))
    : Math.min(100, Math.round((rating / 5) * 85 + 10));

  const audienceLabel = audienceFit >= 85 ? { text: 'Exceptional', color: 'text-emerald-600' }
    : audienceFit >= 65 ? { text: 'High', color: 'text-blue-600' }
    : audienceFit >= 40 ? { text: 'Moderate', color: 'text-amber-600' }
    : { text: 'Low', color: 'text-slate-400' };

  const audienceBarColor = audienceFit >= 85 ? 'bg-emerald-500'
    : audienceFit >= 65 ? pColor.bar
    : audienceFit >= 40 ? 'bg-amber-400'
    : 'bg-slate-300';

  // Score display
  const scoreValue = engagementRate > 0
    ? `${engagementRate.toFixed(1)}%`
    : rating > 0 ? `${Math.round((rating / 5) * 99)}%` : '—';
  const scoreLabel = engagementRate > 0 ? 'ENG.RATE' : 'SCORE';
  const scoreColor = audienceFit >= 85 ? 'text-emerald-600'
    : audienceFit >= 65 ? 'text-blue-600'
    : 'text-amber-500';

  return (
    <div
      className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-0.5"
      style={{ borderLeft: `4px solid ${pColor.border}` }}
    >
      {/* ── Top: avatar + name + score ── */}
      <div className="px-4 pt-4 pb-3 flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            loading="lazy"
            decoding="async"
            src={getOptimizedImage(
              inf.profilePicture
                || `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanUsername)}&background=random`,
              'avatar'
            )}
            alt={cleanUsername}
            className="w-[52px] h-[52px] rounded-xl object-cover border-2 border-white shadow-md bg-white"
            width="52" height="52"
          />
          {isVerified && (
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border border-white shadow-sm">
              <ShieldCheck className="w-2.5 h-2.5 text-white" />
            </span>
          )}
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <h3 className="text-[14px] font-black text-[#1e293b] group-hover:text-blue-600 transition-colors truncate max-w-[120px]">
              {cleanUsername}
            </h3>
            <VerifiedTick user={inf} roleProfile={inf} size="sm" />
          </div>
          {category && (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{category}</span>
          )}
          <div className="flex items-center gap-1 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${trustHigh ? 'bg-emerald-500' : 'bg-amber-400'}`} />
            <span className={`text-[10px] font-semibold ${trustHigh ? 'text-emerald-600' : 'text-amber-600'}`}>
              {trustHigh ? 'Verified Creator' : 'Building Trust'}
            </span>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap gap-1 mt-1">
            {inf.isAvailable !== false && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase rounded-full border border-emerald-100">
                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />Available
              </span>
            )}
            {collab && (
              <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-bold uppercase rounded-full border border-indigo-100">Partner</span>
            )}
            {!collab && isRequested && (
              <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold uppercase rounded-full border border-blue-100">Requested</span>
            )}
          </div>
        </div>

        {/* Score */}
        <div className="flex-shrink-0 text-right ml-1">
          <div className={`text-[22px] font-black leading-none ${scoreColor}`}>{scoreValue}</div>
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{scoreLabel}</div>
        </div>
      </div>

      {/* ── Platform badges ── */}
      <div className="px-4 pb-3">
        <div className="flex flex-wrap gap-1.5">
          {(inf.platforms || []).filter(p => p?.name && p?.followers > 0).slice(0, 3).map((p, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${pColor.bg} ${pColor.text} border-current border-opacity-20`}
            >
              <SocialIcon platformName={p.name} size="xs" />
              {p.name.toUpperCase()}
            </span>
          ))}
          {tags.slice(0, 1).map((t, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-semibold rounded-full border border-slate-100">
              <Tag className="w-2.5 h-2.5" />{t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Audience Fit bar ── */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Audience Fit</span>
          <span className={`text-[11px] font-black ${audienceLabel.color}`}>{audienceLabel.text}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${audienceBarColor}`}
            style={{ width: `${audienceFit}%` }}
          />
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="px-4 pb-3 flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          {reviewCount > 0 && rating > 0 ? rating.toFixed(1) : 'New'}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
          <Briefcase className="w-3 h-3 text-blue-400" />
          {collabCount} Collabs
        </span>
        {location && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full truncate max-w-[110px]">
            <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </span>
        )}
      </div>

      {/* ── Bio ── */}
      <div className="px-4 pb-3">
        <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{cleanAbout}</p>
      </div>

      {/* ── Action buttons ── */}
      <div className="px-4 pb-4 mt-auto flex gap-2">
        <button
          onClick={() => onNavigate(inf._id)}
          className="flex-[2] bg-[#0f172a] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wide rounded-xl py-2.5 transition-all flex items-center justify-center gap-1.5 group/btn"
        >
          View Profile <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
        </button>
        <button
          onClick={() => {
            if (collab) onNavigate(collab.id, true);
            else onInvite(inf);
          }}
          className={`flex-1 text-[11px] font-bold uppercase tracking-wide rounded-xl py-2.5 border transition-colors ${
            collab
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600'
              : 'bg-white text-blue-600 hover:bg-blue-50 border-blue-200'
          }`}
        >
          {collab ? 'Manage' : 'Invite'}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function Influencers() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalRequests: 0, activeCampaigns: 0, pendingRequests: 0,
    totalInfluencersContacted: 0, totalCampaigns: 0, completedCampaigns: 0, successRate: 0
  });
  const [filters, setFilters] = useState({ category: '', platform: '', minFollowers: '', search: '' });
  const [influencers, setInfluencers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [activeCollaborations, setActiveCollaborations] = useState([]);
  const [requestedInfluencerIds, setRequestedInfluencerIds] = useState([]);

  // AI
  const [isAIMode, setIsAIMode] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [currentAICampaignId, setCurrentAICampaignId] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState([]);
  const [aiMessage, setAiMessage] = useState(null);

  // Invite Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);

  // Loading
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingInfluencers, setIsLoadingInfluencers] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        const r = await api.get('/brands/dashboard');
        if (r.data?.success) {
          const s = r.data.data;
          const rate = s.totalCampaigns > 0 ? Math.round((s.completedCampaigns / s.totalCampaigns) * 100) : 0;
          setStats({ ...s, successRate: rate });
        }
      } catch (e) { console.error(e); } finally { setIsLoadingStats(false); }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const [collabRes, reqRes] = await Promise.all([
          collaborationService.getAll({ status: 'active', limit: 100 }),
          collaborationService.getRequests({ type: 'sent', limit: 100 })
        ]);
        if (collabRes.success) {
          setActiveCollaborations(
            (collabRes.data.collaborations || []).map(c => ({
              id: c._id,
              influencerId: c.influencer?._id || c.influencer,
              campaignId: c.campaign?._id || c.campaign,
              campaignName: c.campaign?.name || c.campaign?.title
            }))
          );
        }
        if (reqRes.success) {
          const ids = (reqRes.data.requests || [])
            .filter(r => r.status === 'pending')
            .flatMap(r => {
              const rec = r.receiverDetails || r.receiver;
              const snd = r.senderDetails || r.sender;
              return [rec?._id || rec, snd?._id || snd];
            }).filter(Boolean);
          setRequestedInfluencerIds(ids);
        }
      } catch (e) { console.error(e); }
    };
    fetchExisting();
  }, []);

  const fetchInfluencers = useCallback(async (currentPage = 1) => {
    try {
      setIsLoadingInfluencers(true);
      const q = new URLSearchParams({ page: currentPage, limit: 12 });
      if (filters.search) q.append('search', filters.search);
      if (filters.category) q.append('category', filters.category);
      if (filters.platform) q.append('platform', filters.platform);
      if (filters.minFollowers) q.append('minFollowers', filters.minFollowers);
      const r = await api.get(`/brands/influencers?${q.toString()}`);
      if (r.data?.success) {
        setInfluencers(r.data.data.influencers || []);
        setPagination({ total: r.data.data.total || 0, page: r.data.data.page || 1, pages: r.data.data.pages || 1 });
      }
    } catch (e) { console.error(e); } finally { setIsLoadingInfluencers(false); }
  }, [filters]);

  useEffect(() => {
    const h = setTimeout(() => fetchInfluencers(1), 500);
    return () => clearTimeout(h);
  }, [filters.search, filters.category, filters.platform, filters.minFollowers, fetchInfluencers]);

  const handleAIMatchSelect = async (campaignId) => {
    setCurrentAICampaignId(campaignId);
    setShowCampaignModal(false);
    setIsAIMode(true);
    setAiLoading(true);
    setAiMessage(null);
    try {
      const r = await getFilteredInfluencers(campaignId);
      if (r?.data) {
        if (Array.isArray(r.data)) setAiResults(r.data);
        else if (r.data.suggestion) { setAiResults([]); setAiMessage(r.data.message); }
      }
    } catch (e) { console.error(e); } finally { setAiLoading(false); }
  };

  const handleAIInvite = (influencer) => {
    setSelectedInfluencer({ _id: influencer.userId || influencer.id, name: influencer.name });
    setShowInviteModal(true);
  };
  const clearAIMatch = () => { setIsAIMode(false); setAiResults([]); setCurrentAICampaignId(''); };
  const handleNavigate = (idOrPath, isCollab = false) =>
    navigate(isCollab ? `/brand/collaboration/${idOrPath}` : `/brand/influencer/${idOrPath}`);
  const handleInvite = (inf) => {
    setSelectedInfluencer({ _id: inf._id, name: inf.username });
    setShowInviteModal(true);
  };

  const displayStats = [
    { title: 'Success Rate',    value: `${stats.successRate}%`,     icon: <TrendingUp className="w-5 h-5 text-emerald-500" />, bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { title: 'Active Campaigns',value: stats.activeCampaigns,       icon: <FileText   className="w-5 h-5 text-blue-500" />,    bg: 'bg-blue-50',    border: 'border-blue-100'    },
    { title: 'Total Campaigns', value: stats.totalCampaigns,        icon: <Briefcase  className="w-5 h-5 text-indigo-500" />,  bg: 'bg-indigo-50',  border: 'border-indigo-100'  },
    { title: 'Pending Requests',value: stats.pendingRequests,       icon: <Clock      className="w-5 h-5 text-amber-500" />,   bg: 'bg-amber-50',   border: 'border-amber-100'   },
  ];
  const hasActiveFilters = filters.search || filters.category || filters.platform || filters.minFollowers;

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1800px] mx-auto pb-10 px-4 md:px-6">

      {/* Header */}
      <div className="pt-2 pb-1">
        <h1 className="text-2xl sm:text-3xl font-black text-[#1e293b] tracking-tight mb-1">
          Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Influencers</span>
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Connect with verified creators matched to your brand. Use AI matching for precision partnerships.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {displayStats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl sm:rounded-3xl border border-[#e2e8f0] shadow-sm p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${s.bg} border ${s.border}`}>{s.icon}</div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-[12px] font-semibold text-slate-400 mb-0.5 leading-snug truncate">{s.title}</p>
              <p className="text-lg sm:text-2xl font-black text-[#1e293b] leading-none">
                {isLoadingStats ? <span className="inline-block w-8 sm:w-10 h-5 sm:h-6 bg-slate-100 animate-pulse rounded" /> : s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#e2e8f0] shadow-sm p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
          {/* Search */}
          <div className="w-full">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-left">Search</label>
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by username..."
                value={filters.search}
                onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl placeholder-slate-400 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Category */}
          <div className="w-full">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-left">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(p => ({ ...p, category: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
            >
              <option value="">All Categories</option>
              {['Health', 'Technology', 'Food', 'Beauty', 'Fitness', 'Travel', 'Lifestyle', 'Fashion', 'Gaming'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Platform */}
          <div className="w-full">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-left">Platform</label>
            <select
              value={filters.platform}
              onChange={(e) => setFilters(p => ({ ...p, platform: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
            >
              <option value="">All Platforms</option>
              {['Instagram', 'Youtube', 'Twitter', 'Linkedin', 'TikTok'].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 w-full">
            {hasActiveFilters && (
              <button
                onClick={() => setFilters({ category: '', platform: '', minFollowers: '', search: '' })}
                className="flex items-center justify-center gap-1.5 flex-1 h-[42px] text-sm font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            )}

            <button
              onClick={() => setShowCampaignModal(true)}
              className="flex items-center justify-center gap-2 flex-[2] h-[42px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-200 transition-all shrink-0 group"
            >
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              AI Match
            </button>
          </div>
        </div>
      </div>

      {/* AI Mode Banner */}
      {isAIMode && (
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-5 shadow-lg shadow-blue-200">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">AI Curated Matches</h2>
              <p className="text-xs text-blue-100 mt-0.5">Influencers precisely analysed for your campaign requirements</p>
            </div>
          </div>
          <button
            onClick={clearAIMatch}
            className="flex items-center gap-1.5 text-sm font-bold text-white bg-white/15 hover:bg-white/25 px-4 py-2 rounded-xl border border-white/20 transition-all"
          >
            <XCircle className="w-4 h-4" /> Exit AI Mode
          </button>
        </div>
      )}

      {/* Result count */}
      {!isAIMode && !isLoadingInfluencers && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm font-semibold text-slate-500">
            {pagination.total > 0
              ? <><span className="text-[#1e293b] font-black">{pagination.total}</span> creators found</>
              : 'No creators found'}
            {hasActiveFilters && <span className="text-blue-500 ml-1">· Filtered</span>}
          </p>
        </div>
      )}

      {/* Grid */}
      {aiLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : isAIMode ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <Suspense fallback={null}>
            {aiResults.map(data => <AIInfluencerCard key={data.id} data={data} onInvite={handleAIInvite} />)}
          </Suspense>
          {aiMessage && (
            <div className="col-span-full bg-blue-50 border border-blue-100 rounded-3xl p-8 text-center">
              <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-blue-700">{aiMessage}</p>
            </div>
          )}
        </div>
      ) : isLoadingInfluencers ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : influencers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-black text-[#1e293b] mb-1">No Influencers Found</h3>
          <p className="text-sm text-slate-400 max-w-xs mx-auto mb-4">
            Try adjusting your filters or use AI matching to find the best creators for your campaign.
          </p>
          {hasActiveFilters && (
            <button onClick={() => setFilters({ category: '', platform: '', minFollowers: '', search: '' })}
              className="text-sm font-bold text-blue-600 hover:text-blue-700">
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {influencers.map(inf => {
            const collab = activeCollaborations.find(
              ac => ac.influencerId === inf._id || ac.influencerId === String(inf.user)
            );
            const isRequested =
              requestedInfluencerIds.includes(inf._id) ||
              requestedInfluencerIds.includes(String(inf.user));
            return (
              <InfluencerCard
                key={inf._id}
                inf={inf}
                collab={collab}
                isRequested={isRequested}
                onInvite={handleInvite}
                onNavigate={handleNavigate}
              />
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!isAIMode && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <button
            onClick={() => fetchInfluencers(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === pagination.pages || Math.abs(p - pagination.page) <= 1)
            .reduce((acc, p, idx, arr) => {
              if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('...');
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === '...'
                ? <span key={`d-${i}`} className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm">…</span>
                : <button key={p} onClick={() => fetchInfluencers(p)}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                      pagination.page === p
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                        : 'border border-[#e2e8f0] bg-white text-slate-600 hover:bg-slate-50'
                    }`}>{p}</button>
            )}
          <button
            onClick={() => fetchInfluencers(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals */}
      <Suspense fallback={null}>
        <CampaignSelectionModal
          isOpen={showCampaignModal}
          onClose={() => setShowCampaignModal(false)}
          onSelect={handleAIMatchSelect}
        />
      </Suspense>

      {showInviteModal && (
        <SendCollabModal
          targetType="influencer"
          targetUser={selectedInfluencer}
          initialCampaignId={currentAICampaignId}
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
}

export default Influencers;
