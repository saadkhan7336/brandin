import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Outlet, NavLink } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageCircle, 
  LayoutDashboard, 
  ClipboardList, 
  Loader2,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import collaborationService from '../../services/collaborationService';
import { chatService } from '../../services/chatService';
import { setActiveConversation } from '../../redux/slices/chatSlice';

const CollabDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [collaboration, setCollaboration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCollaboration = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await collaborationService.getOne(id);
      setCollaboration(response?.data || response);
    } catch (err) {
      console.error('Error fetching collaboration details:', err);
      setError('Failed to load collaboration details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCollaboration();
  }, [fetchCollaboration]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600 w-12 h-12 mb-4" />
        <p className="text-gray-500 font-black uppercase tracking-widest text-sm">Loading Project...</p>
      </div>
    );
  }

  if (error || !collaboration) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <AlertCircle className="text-red-500 w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-gray-900 uppercase">Oops! Project Not Found</h2>
        <p className="text-gray-500 mt-2 max-w-sm mx-auto font-bold">{error || "This collaboration might have been moved or deleted."}</p>
        <button 
          onClick={() => navigate(user.role === 'brand' ? '/brand/collaborations' : '/influencer/collaborations')}
          className="mt-6 px-8 py-3 bg-[#0F172A] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all"
        >
          Back to list
        </button>
      </div>
    );
  }

  const { campaign, influencer, brand, status, deliverables = [] } = collaboration;
  const partner = user.role === 'brand' ? influencer : brand;
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner?.fullname || 'User')}&background=random&size=150`;

  // Calculate stats for progress fix
  const delivTotal = deliverables.length;
  const delivCompleted = deliverables.filter(d => d.status === 'APPROVED').length;
  const progress = delivTotal > 0 ? Math.round((delivCompleted / delivTotal) * 100) : 0;

  const handleChatClick = async () => {
    try {
      const partnerId = partner?._id || partner?.id;
      if (!partnerId) return;
      const res = await chatService.createOrGetConversation(partnerId);
      dispatch(setActiveConversation(res.data || res));
      navigate('/messages');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto pb-10 px-4 md:px-8">
      {/* Back Button & Top Meta */}
      <div className="flex items-center justify-between mb-8 pt-6">
        <button
          onClick={() => navigate(user.role === 'brand' ? '/brand/collaborations' : '/influencer/collaborations')}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
           <button 
             onClick={handleChatClick}
             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-black text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
             <MessageCircle size={14} className="text-blue-500" />
             Chat with Partner
           </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-white border border-gray-200 rounded-2xl px-8 py-10 shadow-sm mb-8 relative overflow-hidden">
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
               <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                 Campaign Project
               </span>
               <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-gray-100">
                 {status || 'ONGOING'}
               </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-4 capitalize">
              {campaign?.name || collaboration.title || 'Untitled Project'}
            </h1>
            
            <div className="flex flex-wrap gap-6 mt-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-sm font-bold">{new Date(collaboration.startDate).toLocaleDateString()} - {new Date(collaboration.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign size={16} className="text-emerald-500" />
                <span className="text-sm font-bold">Project Budget: ${collaboration.agreedBudget?.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <TrendingUp size={16} className="text-amber-500" />
                <span className="text-sm font-bold">{progress}% Progress ({delivCompleted}/{delivTotal})</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <img 
              src={partner?.profilePic || fallbackAvatar} 
              alt={partner?.fullname}
              className="w-14 h-14 rounded-xl object-cover border border-gray-200"
            />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Partner</p>
              <h4 className="font-bold text-gray-900 truncate max-w-[150px] capitalize text-[15px]">{partner?.fullname}</h4>
              <button 
                onClick={() => navigate(user.role === 'brand' ? `/brand/influencer/${partner._id}` : `/influencer/search/brand/${partner._id}`)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-all mt-1 inline-flex items-center gap-1"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 w-fit">
        <NavLink
          to="overview"
          className={({ isActive }) => `flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
            isActive 
              ? 'bg-white text-blue-600 shadow-sm border border-gray-200' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
          }`}
        >
          <LayoutDashboard size={16} />
          Overview
        </NavLink>
        <NavLink
          to="tasks"
          className={({ isActive }) => `flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
            isActive 
              ? 'bg-white text-blue-600 shadow-sm border border-gray-200' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
          }`}
        >
          <ClipboardList size={16} />
          Deliverables
        </NavLink>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300">
        <Outlet context={{ collaboration, userRole: user.role, onRefresh: fetchCollaboration }} />
      </div>
    </div>
  );
};

export default CollabDetailView;
