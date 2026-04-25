import React, { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, CheckCircle, Clock, Users,
  Instagram, Youtube, ShieldCheck, Twitter, Linkedin,
  Search, ChevronLeft, ChevronRight, X,
  Briefcase, Sparkles, XCircle, AlertCircle, Loader2
} from 'lucide-react';
import api from '../../services/api';
import collaborationService from '../../services/collaborationService';
import VerifiedTick from '../../components/common/VerifiedTick';
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

              return (
                <div key={inf._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center transition-all hover:shadow-md relative overflow-hidden">
                   {/* Status Badge */}
                   <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                      {collab ? (
                        <div className="flex flex-col items-end">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wider">
                            Active Partner
                          </span>
                          <span className="text-[8px] font-bold text-indigo-400 uppercase truncate max-w-[80px] mt-0.5">
                            {collab.campaignName}
                          </span>
                        </div>
                      ) : isRequested ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wider">
                          Requested
                        </span>
                      ) : null}
                    </div>

                   <img src={inf.profilePicture || `https://ui-avatars.com/api/?name=${inf.username}`} className="w-[72px] h-[72px] rounded-full object-cover mb-3.5 ring-[3px] ring-gray-50" />
                   <div className="flex items-center gap-1.5 mb-1.5">
                      <h3 className="text-[15px] font-bold text-gray-900">{inf.username}</h3>
                      <VerifiedTick user={inf} roleProfile={inf} size="xs" />
                   </div>
                   <button 
                     onClick={() => collab ? navigate(`/brand/collaboration/${collab.id}`) : navigate(`/brand/influencer/${inf._id}`)} 
                     className={`w-full text-white text-[13px] font-bold rounded-full py-2.5 transition-all shadow-sm ${collab ? 'bg-indigo-600' : 'bg-[#3B82F6]'}`}
                    >
                      {collab ? 'Collaborate' : 'View Profile'}
                   </button>
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
