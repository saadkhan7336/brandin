import React from 'react';
import {
  MessageCircle,
  ExternalLink,
  ClipboardList,
  Briefcase,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { chatService } from '../../services/chatService';
import { setActiveConversation } from '../../redux/slices/chatSlice';

const cn = (...inputs) => twMerge(clsx(inputs));

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  }).replace(/\//g, '-');
};

const CollaborationCard = ({ collaboration, userRole }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!collaboration) return null;

  const { deliverables, deliverablesSummary } = collaboration;

  // Partner Info
  let partnerName = 'Unknown';
  let partnerAvatar = null;
  let partnerId = null;

  if (userRole === 'influencer') {
    const brand = collaboration.brand || {};
    partnerName = brand.name || brand.fullname || 'Unknown Brand';
    partnerAvatar = brand.avatar || brand.profilePic || null;
    partnerId = brand._id || brand.id;
  } else {
    const influencer = collaboration.influencer || {};
    partnerName = influencer.name || influencer.username || influencer.fullname || 'Unknown Influencer';
    partnerAvatar = influencer.avatar || influencer.profilePic || null;
    partnerId = influencer._id || influencer.id;
  }

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerName)}&background=random&size=150`;

  // Stats
  const delivCompleted = deliverablesSummary?.completed || 0;
  const delivTotal = deliverablesSummary?.total || 0;
  const progress = delivTotal > 0 ? Math.round((delivCompleted / delivTotal) * 100) : 0;

  // Next Up Task Logic - Find first task not yet started (exclude IN_PROGRESS, APPROVED, DELIVERED, SUBMITTED)
  const nextTask = deliverables?.find(d => !['APPROVED', 'DELIVERED', 'IN_PROGRESS', 'SUBMITTED', 'REVISION_REQUESTED'].includes(d.status));
  
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === 'active' || s === 'ongoing') return 'bg-blue-50 text-blue-600 border-blue-100';
    if (s === 'completed') return 'bg-gray-100 text-gray-600 border-gray-200';
    return 'bg-amber-50 text-amber-600 border-amber-100';
  };

  const handleChatClick = async (e) => {
    e.stopPropagation();
    try {
      if (!partnerId) return;
      const res = await chatService.createOrGetConversation(partnerId);
      dispatch(setActiveConversation(res.data || res));
      navigate('/messages');
    } catch (err) {
      console.error('Chat routing error:', err);
    }
  };

  return (
    <div 
      className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col lg:flex-row items-center gap-8 cursor-pointer"
      onClick={() => navigate(`/${userRole}/collaboration/${collaboration._id}`)}
    >
      
      {/* Main Info Part (Left/Middle) */}
      <div className="flex-1 w-full space-y-6 lg:border-r border-gray-100 lg:pr-8">
        <div className="flex items-center gap-5">
          <img 
            src={partnerAvatar || fallbackAvatar} 
            alt={partnerName}
            className="w-14 h-14 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-300 ring-2 ring-gray-100"
            onError={(e) => { e.target.src = fallbackAvatar; }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight truncate">
                {partnerName}
              </h3>
              <span className={cn(
                "px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border",
                getStatusBadge(collaboration.status)
              )}>
                {collaboration.status || 'ONGOING'}
              </span>
            </div>
            
            {/* Campaign Name */}
            {collaboration.campaign && (
              <div 
                className="flex items-center gap-1.5 mb-1 hover:text-blue-600 transition-colors cursor-pointer w-fit"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/${userRole}/search/campaign/${collaboration.campaign._id || collaboration.campaign}`);
                }}
              >
                <Briefcase size={12} className="text-gray-400" />
                <p className="text-xs font-bold text-gray-700 uppercase tracking-tight">
                  {collaboration.campaign.name || 'View Campaign Details'}
                </p>
              </div>
            )}

            <p className="text-xs font-medium text-gray-500">
              {formatDate(collaboration.startDate)} to {formatDate(collaboration.endDate)} • <span className="text-blue-600 font-bold">${collaboration.agreedBudget?.toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* Progress Bar - Only show if NOT completed */}
        {collaboration.status?.toLowerCase() !== 'completed' ? (
          <div className="space-y-3">
            <div className="flex justify-between items-end">
               <div className="space-y-0.5">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Campaign Milestones</p>
                 <h4 className="text-xs font-bold text-gray-700 uppercase">{delivCompleted} / {delivTotal} Deliverables Completed</h4>
               </div>
               <span className="text-xs font-bold text-blue-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          /* Review Display for Completed Collaborations */
          <div className="space-y-3 animate-in fade-in zoom-in duration-500">
            {/* Brand's Review */}
            {collaboration.review && (
              <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Brand Review</p>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={10} 
                        className={cn(
                          "fill-current",
                          i < (collaboration.review?.rating || 0) ? "text-amber-400" : "text-gray-200"
                        )} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 italic leading-relaxed">
                  "{collaboration.review?.comment || 'No comment provided.'}"
                </p>
              </div>
            )}
            {/* Influencer's Review */}
            {collaboration.influencerReview && (
              <div className="bg-blue-50/30 border border-blue-100/50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Influencer Review</p>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={10} 
                        className={cn(
                          "fill-current",
                          i < (collaboration.influencerReview?.rating || 0) ? "text-blue-400" : "text-gray-200"
                        )} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 italic leading-relaxed">
                  "{collaboration.influencerReview?.comment || 'No comment provided.'}"
                </p>
              </div>
            )}
            {!collaboration.review && !collaboration.influencerReview && (
              <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No reviews yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Part (Right) */}
      <div className="lg:w-[300px] w-full shrink-0 flex flex-col justify-between self-stretch bg-gray-50/50 p-6 rounded-2xl border border-gray-100" onClick={(e) => e.stopPropagation()}>
        
        {/* Next Task */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
             <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
               Next Up
             </span>
             {nextTask && (
               <span className="bg-white text-gray-700 text-[10px] font-bold px-2.5 py-0.5 rounded-lg border border-gray-200 uppercase shadow-sm">
                 {nextTask.priority || 'NORMAL'}
               </span>
             )}
          </div>
          
          {nextTask ? (
            <div className="space-y-2">
              <h4 className="text-[15px] font-bold text-gray-900 truncate capitalize tracking-tight">
                {nextTask.title}
              </h4>
              <p className="text-[11px] font-bold text-gray-500 flex items-center gap-1.5 mt-1 tracking-wider">
                <ClipboardList size={12} className="text-gray-400" />
                Deadline: {nextTask.dueDate ? formatDate(nextTask.dueDate) : 'Pending'}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center py-2 bg-gray-50/50 rounded-lg border border-gray-100 border-dashed">
               <span className="text-xs font-bold text-gray-400">No pending tasks</span>
            </div>
          )}
        </div>

        {/* Payment Status */}
        <div className="mb-5">
           {collaboration.paymentStatus === 'PROCESSING' ? (
             <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-500">
               <span className="font-sans font-bold border border-blue-500 text-blue-500 w-3.5 h-3.5 rounded flex items-center justify-center text-[8px]">$</span>
               Payment Processing
             </div>
           ) : collaboration.paymentStatus === 'PAID' ? (
             <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500">
               <span className="font-sans font-bold border border-emerald-500 text-emerald-500 w-3.5 h-3.5 rounded flex items-center justify-center text-[8px]">$</span>
               Payment Paid
             </div>
           ) : (
             <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-500">
               <span className="font-sans font-bold border border-amber-500 text-amber-500 w-3.5 h-3.5 rounded flex items-center justify-center text-[8px]">$</span>
               Payment Pending
             </div>
           )}
           <div className="w-full border-t border-gray-100 mt-4" />
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <button 
              onClick={handleChatClick}
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 py-2.5 rounded-xl text-xs font-bold text-gray-900 hover:bg-gray-50 transition-colors shadow-sm">
              <MessageCircle size={14} className="text-gray-900" />
              Chat
            </button>
            <button 
              onClick={() => navigate(`/${userRole}/collaboration/${collaboration._id}/tasks/board`)}
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 py-2.5 rounded-xl text-xs font-bold text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ClipboardList size={14} className="text-gray-900" />
              Tasks
            </button>
          </div>
          <button 
            onClick={() => navigate(userRole === 'influencer' ? `/influencer/search/brand/${partnerId}` : `/brand/influencer/${partnerId}`)}
            className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-blue-500 hover:text-blue-600 transition-all capitalize"
          >
            {userRole === 'influencer' ? 'View Brand Profile' : 'View Influencer Profile'}
            <ExternalLink size={12} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollaborationCard;
