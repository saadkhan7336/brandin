import React, { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, CheckCircle, Clock, Users,
  Instagram, Youtube, ShieldCheck, Twitter, Linkedin,
  Search, ChevronLeft, ChevronRight, X,
  Briefcase, Sparkles, XCircle, AlertCircle, Loader2,
  ArrowRight, Star
} from 'lucide-react';
import api from '../../services/api';
import collaborationService from '../../services/collaborationService';
import VerifiedTick from '../../components/common/VerifiedTick';
import SocialIcon from '../../components/common/SocialIcon';
import { getFilteredInfluencers } from '../../services/aiService.js';
import SendCollabModal from '../../components/layout/influencer/SendCollabModal';

// Lazy loading AI Feature Components to optimize initial bundle bounds
const CampaignSelectionModal = lazy(() => import('../../components/ai/CampaignSelectionModal.jsx'));
const AIInfluencerCard = lazy(() => import('../../components/cards/AIInfluencerCard.jsx'));

function Influencers() {
  const navigate = useNavigate();

  // ... (stats and local states)
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeCampaigns: 0,
    pendingRequests: 0,
    totalInfluencersContacted: 0,
    totalCampaigns: 0,
    completedCampaigns: 0,
    successRate: 0
  });

  const [filters, setFilters] = useState({
    category: '',
    platform: '',
    minFollowers: '',
    search: ''
  });
  const [influencers, setInfluencers] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  });
  const [activeCollaborations, setActiveCollaborations] = useState([]);
  const [requestedInfluencerIds, setRequestedInfluencerIds] = useState([]);

  // AI Matching States
  const [isAIMode, setIsAIMode] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [currentAICampaignId, setCurrentAICampaignId] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState([]);
  const [aiMessage, setAiMessage] = useState(null);
  const abortControllerRef = useRef(null);

  // Invitation Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);

  // UI States
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingInfluencers, setIsLoadingInfluencers] = useState(true);

  // --- Fetch Dash Stats ---
  // ... (omitted for brevity - keeping logic same)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        const response = await api.get('/brands/dashboard');
        if (response.data?.success) {
          const statsData = response.data.data;
          const total = statsData.totalCampaigns || 0;
          const completed = statsData.completedCampaigns || 0;
          const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
          setStats({ ...statsData, successRate: rate });
        }
      } catch (err) { console.error(err); } finally { setIsLoadingStats(false); }
    };
    fetchStats();
  }, []);

  // --- Fetch Collaborations & Requests ---
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const [collabRes, reqRes] = await Promise.all([
          collaborationService.getAll({ status: "active", limit: 100 }),
          collaborationService.getRequests({ type: "sent", limit: 100 })
        ]);

        if (collabRes.success) {
          const mapping = (collabRes.data.collaborations || []).map(c => ({
            id: c._id,
            influencerId: c.influencer?._id || c.influencer,
            campaignId: c.campaign?._id || c.campaign,
            campaignName: c.campaign?.name || c.campaign?.title
          }));
          setActiveCollaborations(mapping);
        }

        if (reqRes.success) {
          // Robust mapping to catch different ID structures
          const reqs = reqRes.data.requests || [];
          const ids = reqs
            .filter(r => r.status === 'pending') // Only show "Requested" for pending ones
            .map(r => {
               const rec = r.receiverDetails || r.receiver;
               const recId = rec?._id || rec;
               // Also include the other party ID if it was sent by influencer
               const snd = r.senderDetails || r.sender;
               const sndId = snd?._id || snd;
               return [recId, sndId];
            })
            .flat()
            .filter(id => id); // Remove nulls
            
          setRequestedInfluencerIds(ids);
        }
      } catch (err) {
        console.error("Error fetching partnership data:", err);
      }
    };
    fetchExistingData();
  }, []);

  // --- Search Logic ---
  const fetchInfluencers = useCallback(async (currentPage = 1) => {
    try {
      setIsLoadingInfluencers(true);
      const queryParams = new URLSearchParams({ page: currentPage, limit: 12 });
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.platform) queryParams.append('platform', filters.platform);
      const response = await api.get(`/brands/influencers?${queryParams.toString()}`);
      if (response.data?.success) {
        setInfluencers(response.data.data.influencers || []);
        setPagination({ total: response.data.data.total || 0, page: response.data.data.page || 1, pages: response.data.data.pages || 1 });
      }
    } catch (err) { console.error(err); } finally { setIsLoadingInfluencers(false); }
  }, [filters]);

  useEffect(() => {
    const handler = setTimeout(() => fetchInfluencers(1), 500);
    return () => clearTimeout(handler);
  }, [filters.search, filters.category, filters.platform, fetchInfluencers]);

  // AI Logic
  const handleAIMatchSelect = async (campaignId) => {
    setCurrentAICampaignId(campaignId);
    setShowCampaignModal(false);
    setIsAIMode(true);
    setAiLoading(true);
    setAiMessage(null);
    try {
      const response = await getFilteredInfluencers(campaignId);
      if (response && response.data) {
        if (Array.isArray(response.data)) setAiResults(response.data);
        else if (response.data.suggestion) {
          setAiResults([]);
          setAiMessage(response.data.message);
        }
      }
    } catch(err) { console.error(err); } finally { setAiLoading(false); }
  };

  const handleAIInvite = (influencer) => {
    setSelectedInfluencer({ _id: influencer.userId || influencer.id, name: influencer.name });
    setShowInviteModal(true);
  };

  const clearAIMatch = () => {
    setIsAIMode(false);
    setAiResults([]);
    setCurrentAICampaignId('');
  };

  // Rendering
  const displayStats = [
    { title: "Success Rate", value: `${stats.successRate}%`, icon: <CheckCircle className="text-green-500" />, bgClass: "bg-green-50" },
    { title: "Active Campaigns", value: stats.activeCampaigns, icon: <FileText className="text-blue-500" />, bgClass: "bg-blue-50" },
    { title: "Total Campaigns", value: stats.totalCampaigns, icon: <ShieldCheck className="text-indigo-500" />, bgClass: "bg-indigo-50" },
    { title: "Pending Requests", value: stats.pendingRequests, icon: <Clock className="text-yellow-500" />, bgClass: "bg-yellow-50" }
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1800px] mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Influencers</h1>
        <p className="text-gray-500 font-medium">Discover and collaborate with the world's top creators.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {displayStats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100/60 p-5 flex items-center gap-4 transition-all hover:shadow-md">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bgClass}`}>{stat.icon}</div>
            <div className="flex flex-col">
              <p className="text-[13px] text-gray-500 font-medium mb-0.5">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 leading-none">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {/* Filters */}
           <div className="md:col-span-1">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Search Keywords</label>
            <div className="relative">
              <input type="text" name="search" placeholder="Search..." value={filters.search} onChange={(e) => setFilters(p => ({...p, search: e.target.value}))} className="w-full bg-white border border-gray-200 text-[14px] rounded-lg p-2.5 pl-10 focus:outline-none" />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            </div>
           </div>
           <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Category</label>
            <select value={filters.category} onChange={(e) => setFilters(p => ({...p, category: e.target.value}))} className="w-full bg-white border border-gray-200 text-[14px] rounded-lg p-2.5">
               <option value="">All Categories</option>
               {['Health', 'Technology', 'Food', 'Beauty', 'Fitness', 'Travel', 'Lifestyle', 'Fashion', 'Gaming'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
           </div>
           <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Platform</label>
            <select value={filters.platform} onChange={(e) => setFilters(p => ({...p, platform: e.target.value}))} className="w-full bg-white border border-gray-200 text-[14px] rounded-lg p-2.5">
               <option value="">All Platforms</option>
               {['Instagram', 'Youtube', 'Twitter', 'Linkedin'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
           </div>
           <button onClick={() => setShowCampaignModal(true)} className="w-full h-[46px] mt-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl font-black text-xs uppercase transition-all shadow-xl border-b-4 border-blue-900 flex items-center justify-center gap-2 group">
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" /> AI Match
           </button>
        </div>
      </div>

      {isAIMode && (
         <div className="flex justify-between items-center bg-blue-50 border border-blue-100 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600"><Sparkles className="w-6 h-6 animate-pulse" /></div>
               <div>
                  <h2 className="text-xl font-bold text-gray-900 italic uppercase italic">AI Curated Matches</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Influencers precisely analyzed for your campaign requirements</p>
               </div>
            </div>
            <button onClick={clearAIMatch} className="flex items-center text-sm font-bold text-gray-700 bg-white px-4 py-2 rounded-xl border border-gray-200 transition-all shadow-sm"><XCircle className="w-4 h-4 mr-2" /> Exit AI Mode</button>
         </div>
      )}

      {aiLoading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-3xl border border-gray-100 p-8 animate-pulse h-[400px]" />)}
         </div>
      ) : isAIMode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <Suspense fallback={null}>
              {aiResults.map(data => (
                 <AIInfluencerCard key={data.id} data={data} onInvite={handleAIInvite} />
              ))}
           </Suspense>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {influencers.map(inf => {
              const collab = activeCollaborations.find(ac => ac.influencerId === inf._id || ac.influencerId === inf.user);
              const isRequested = requestedInfluencerIds.includes(inf._id) || requestedInfluencerIds.includes(inf.user);

              let platformName = '';
              if (inf.platforms && inf.platforms.length > 0 && inf.platforms[0]) {
                  platformName = typeof inf.platforms[0] === 'string' ? inf.platforms[0] : inf.platforms[0].name;
              }
              if (!platformName && inf.verifiedPlatforms) {
                  const verifiedKeys = Object.keys(inf.verifiedPlatforms);
                  if (verifiedKeys.length > 0) platformName = verifiedKeys[0];
              }
              if (!platformName && inf.socialMedia) {
                  const socialKeys = Object.keys(inf.socialMedia);
                  if (socialKeys.length > 0) platformName = socialKeys[0];
              }

              const rating = inf.averageRating || 0;
              const reviewCount = inf.reviewsCount || 0;
              const trustLevel = inf.trustLevel || (inf.isVerified ? 'High' : 'MODERATE');

              return (
                <div key={inf._id} className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group h-[420px]">
                  {/* Header Profile with Top Background */}
                  <div className="relative h-[100px] bg-gradient-to-br from-blue-700 to-indigo-800 p-4 flex justify-between items-start transition-all duration-500 group-hover:from-blue-600 group-hover:to-indigo-700">
                     <div className="flex gap-2 z-10 flex-col">
                        <div className="px-3 py-1 bg-[#0f172a]/40 backdrop-blur-sm text-white text-[9px] font-black uppercase rounded-full flex items-center gap-1.5 shadow-sm border border-white/10 tracking-wider">
                           <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> AVAILABLE
                        </div>
                        {collab ? (
                           <div className="px-3 py-1 bg-indigo-50/20 backdrop-blur-sm text-white text-[9px] font-bold uppercase rounded-full flex items-center shadow-sm border border-white/10 mt-1 max-w-[120px] truncate">
                             Partner: {collab.campaignName}
                           </div>
                        ) : isRequested ? (
                           <div className="px-3 py-1 bg-emerald-50/20 backdrop-blur-sm text-white text-[9px] font-bold uppercase rounded-full flex items-center shadow-sm border border-white/10 mt-1">
                             REQUESTED
                           </div>
                        ) : null}
                     </div>
                     <div className="z-10 relative cursor-pointer transition-transform duration-300 hover:scale-110 hover:rotate-6">
                        <SocialIcon platformName={platformName} />
                     </div>
                  </div>

                  <div className="px-6 pb-6 flex-1 flex flex-col -mt-12 relative items-center text-center">
                     {/* Profile Image */}
                     <div className="relative mb-3 transition-transform duration-500 group-hover:scale-105">
                        <img
                          src={inf.profilePicture || `https://ui-avatars.com/api/?name=${inf.username}&background=random`}
                          alt={inf.username}
                          className="w-[84px] h-[84px] rounded-[24px] object-cover border-[4px] border-white shadow-md bg-white relative z-10 transition-transform duration-500 group-hover:scale-110"
                        />
                     </div>
                     
                     <div className="flex items-center gap-1.5 justify-center mb-0.5">
                        <h3 className="text-[16px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{inf.username}</h3>
                        <VerifiedTick user={inf} roleProfile={inf} size="sm" />
                     </div>
                     <p className="text-[12px] font-medium text-gray-500 mb-4">@{inf.username}</p>

                     <p className="text-[11px] text-gray-500 leading-relaxed mb-6 line-clamp-2 px-2 h-[34px]">
                        {inf.about || "Top-tier creator focused on high-quality content and brand storytelling across multiple platforms."}
                     </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 w-full mb-6">
                       <div className="p-3 bg-white rounded-[16px] border border-gray-100 flex items-center gap-3 shadow-sm transition-all duration-300 hover:bg-amber-50/30 hover:border-amber-100 hover:scale-[1.02] hover:shadow-md cursor-default group/rating">
                          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/rating:scale-110 group-hover/rating:bg-amber-100">
                             <Sparkles className="w-4 h-4 text-amber-500" />
                          </div>
                          <div className="flex flex-col text-left">
                             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">RATING</span>
                             <span className="text-[13px] font-black text-gray-900 leading-none mt-0.5">
                                {reviewCount > 0 && rating > 0 ? rating : 'New'} <span className="text-gray-400 font-bold text-[10px]">({reviewCount})</span>
                             </span>
                          </div>
                       </div>
                       <div className="p-3 bg-white rounded-[16px] border border-gray-100 flex items-center gap-3 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-default group/trust">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/trust:scale-110 ${trustLevel.toLowerCase() === 'high' ? 'bg-emerald-50 group-hover/trust:bg-emerald-100' : 'bg-orange-50 group-hover/trust:bg-orange-100'}`}>
                             <ShieldCheck className={`w-4 h-4 ${trustLevel.toLowerCase() === 'high' ? 'text-emerald-500' : 'text-orange-500'}`} />
                          </div>
                          <div className="flex flex-col text-left">
                             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">TRUST</span>
                             <span className={`text-[12px] font-black uppercase leading-none mt-0.5 ${trustLevel.toLowerCase() === 'high' ? 'text-emerald-600' : 'text-orange-500'}`}>
                                {trustLevel}
                             </span>
                          </div>
                       </div>
                    </div>

                    <div className="mt-auto flex gap-3 w-full">
                       <button
                         onClick={() => navigate(`/brand/influencer/${inf._id}`)}
                         className="flex-[2] bg-[#111827] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wide rounded-[12px] py-3.5 transition-all flex items-center justify-center gap-2 group/btn shadow-md"
                       >
                         VIEW PROFILE <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                       </button>
                       <button 
                         onClick={() => {
                            if (collab) navigate(`/brand/collaboration/${collab.id}`);
                            else {
                               setSelectedInfluencer({ _id: inf._id, name: inf.username });
                               setShowInviteModal(true);
                            }
                         }}
                         className={`flex-1 text-[11px] font-bold uppercase tracking-wide rounded-[12px] py-3.5 transition-colors shadow-sm ${collab ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-[#EFF6FF] text-blue-600 hover:bg-[#DBEAFE]'}`}
                        >
                          {collab ? 'MANAGE' : 'INVITE'}
                       </button>
                    </div>
                  </div>
                </div>
              );
           })}
        </div>
      )}

      {/* Logic Modals */}
      <Suspense fallback={null}>
        <CampaignSelectionModal isOpen={showCampaignModal} onClose={() => setShowCampaignModal(false)} onSelect={handleAIMatchSelect} />
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
