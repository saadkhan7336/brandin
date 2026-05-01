import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Users, 
  Sparkles, ArrowRight, Star
} from 'lucide-react';
import VerifiedTick from '../common/VerifiedTick';
import SocialIcon from '../common/SocialIcon';

const AIInfluencerCard = memo(({ data, onInvite }) => {
  const navigate = useNavigate();

  let platformName = '';
  if (data.platforms && data.platforms.length > 0 && data.platforms[0]) {
      platformName = typeof data.platforms[0] === 'string' ? data.platforms[0] : data.platforms[0].name;
  }
  if (!platformName && data.verifiedPlatforms) {
      const verifiedKeys = Object.keys(data.verifiedPlatforms);
      if (verifiedKeys.length > 0) platformName = verifiedKeys[0];
  }
  if (!platformName && data.socialMedia) {
      const socialKeys = Object.keys(data.socialMedia);
      if (socialKeys.length > 0) platformName = socialKeys[0];
  }
  
  const rating = data.averageRating || 0;
  const reviewCount = data.reviewsCount || 0;
  const trustLevel = data.trustLevel || 'MODERATE';

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden flex flex-col h-[420px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] w-full max-w-[340px] mx-auto relative group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12)] hover:border-indigo-100 cursor-pointer">
      {/* Header Profile with Top Background */}
      <div className="relative h-[100px] bg-gradient-to-br from-blue-700 to-indigo-800 p-4 flex justify-between items-start transition-all duration-500 group-hover:from-blue-600 group-hover:to-indigo-700">
         <div className="flex gap-2 z-10">
            <div className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-[9px] font-black uppercase rounded-full flex items-center gap-1.5 shadow-sm border border-white/20">
               <Sparkles className="w-3 h-3" /> {data.matchScore || '74.50'}% MATCH
            </div>
            <div className="px-3 py-1 bg-[#0f172a]/40 backdrop-blur-sm text-white text-[9px] font-black uppercase rounded-full flex items-center gap-1.5 shadow-sm border border-white/10 tracking-wider">
               <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> AVAILABLE
            </div>
         </div>
         <div className="z-10 relative cursor-pointer transition-transform duration-300 hover:scale-110 hover:rotate-6">
            <SocialIcon platformName={platformName} />
         </div>
      </div>

      <div className="px-6 pb-6 flex-1 flex flex-col -mt-12 relative items-center text-center">
         {/* Profile Image */}
         <div className="relative mb-3 transition-transform duration-500 hover:scale-105 cursor-pointer">
            <img
              src={data.profileImage || `https://ui-avatars.com/api/?name=${data.username}&background=random`}
              alt={data.name}
              className="w-[84px] h-[84px] rounded-[24px] object-cover border-[4px] border-white shadow-md bg-white relative z-10"
            />
         </div>
         
         <div className="flex items-center gap-1.5 justify-center mb-0.5">
            <h3 className="text-[16px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{data.name || data.username}</h3>
            <VerifiedTick user={data} roleProfile={data} size="sm" />
         </div>
         <p className="text-[12px] font-medium text-gray-500 mb-4">@{data.username}</p>

         <p className="text-[11px] text-gray-500 leading-relaxed mb-6 line-clamp-2 px-2 h-[34px]">
            {data.about || "Top-tier creator focused on high-quality content and brand storytelling across multiple platforms."}
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
             onClick={() => navigate(`/brand/influencer/${data.id || data._id}`)}
             className="flex-[2] bg-[#111827] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wide rounded-[12px] py-3.5 transition-all flex items-center justify-center gap-2 group/btn shadow-md"
           >
             VIEW PROFILE <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
           </button>
           <button 
             onClick={() => onInvite && onInvite(data)}
             className="flex-1 bg-[#EFF6FF] text-blue-600 text-[11px] font-bold uppercase tracking-wide rounded-[12px] py-3.5 hover:bg-[#DBEAFE] transition-colors shadow-sm"
            >
              INVITE
           </button>
        </div>
      </div>
    </div>
  );
});

export default AIInfluencerCard;
