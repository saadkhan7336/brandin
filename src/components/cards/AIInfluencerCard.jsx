import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Instagram, Youtube, Twitter, Linkedin, Users, 
  Sparkles, AlertCircle, ArrowRight, ExternalLink
} from 'lucide-react';
import VerifiedTick from '../common/VerifiedTick';

const AIInfluencerCard = memo(({ data, onInvite }) => {
  const navigate = useNavigate();

  const getPlatformIcon = (platformName) => {
    const name = platformName?.toLowerCase() || '';
    if (name.includes('instagram')) return <Instagram className="w-4 h-4" />;
    if (name.includes('youtube')) return <Youtube className="w-4 h-4" />;
    if (name.includes('twitter') || name.includes('x')) return <Twitter className="w-4 h-4" />;
    if (name.includes('linkedin')) return <Linkedin className="w-4 h-4" />;
    return <Users className="w-4 h-4" />;
  };

  const getPlatformColor = (platformName) => {
    const name = platformName?.toLowerCase() || '';
    if (name.includes('instagram')) return 'text-pink-600 bg-pink-50 border-pink-100';
    if (name.includes('youtube')) return 'text-red-600 bg-red-50 border-red-100';
    if (name.includes('twitter') || name.includes('x')) return 'text-sky-500 bg-sky-50 border-sky-100';
    if (name.includes('linkedin')) return 'text-blue-700 bg-blue-50 border-blue-100';
    return 'text-indigo-600 bg-indigo-50 border-indigo-100';
  };

  const getMatchLevelStyles = (level) => {
    switch (level) {
      case "Excellent Match": return "bg-emerald-500 text-white shadow-emerald-200";
      case "Good Match": return "bg-blue-500 text-white shadow-blue-200";
      case "Moderate Match": return "bg-amber-500 text-white shadow-amber-200";
      default: return "bg-gray-500 text-white shadow-gray-200";
    }
  };

  const mainPlatform = data.platforms && data.platforms.length > 0 ? data.platforms[0] : null;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group min-h-[420px]">
      {/* Header Profile with Top Background */}
      <div className="relative h-24 bg-gradient-to-r from-blue-50 to-indigo-50">
         <div className="absolute top-4 right-4 z-10">
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${getMatchLevelStyles(data.matchLevel)}`}>
               {data.matchScore}% Match
            </div>
         </div>
      </div>

      <div className="px-6 pb-6 flex-1 flex flex-col -mt-10 relative">
        <div className="flex items-end justify-between mb-4">
           <div className="relative">
              <img
                src={data.profileImage || `https://ui-avatars.com/api/?name=${data.username}&background=random`}
                alt={data.name}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-sm"
              />
           </div>
           
           <div className="flex gap-2">
              {data.platforms?.slice(0, 3).map((p, idx) => (
                 <div key={idx} className={`p-2 rounded-xl border ${getPlatformColor(p.name)} transition-transform hover:scale-110`}>
                    {getPlatformIcon(p.name)}
                 </div>
              ))}
           </div>
        </div>

        <div>
           <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{data.name}</h3>
              <VerifiedTick user={data} roleProfile={data} size="sm" />
           </div>
           <p className="text-sm font-medium text-gray-500 mb-4">@{data.username}</p>
        </div>

        {/* AI Reasons Section */}
        <div className="bg-gray-50/80 rounded-2xl p-4 mb-6 relative overflow-hidden border border-gray-100/50">
           <div className="absolute top-0 right-0 p-2 opacity-10">
              <Sparkles className="w-8 h-8 text-blue-600" />
           </div>
           <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center">
              AI Insight
           </h4>
           <div className="space-y-2">
              {data.reasons?.slice(0, 2).map((reason, idx) => (
                 <div key={idx} className="flex items-start gap-2 text-sm text-gray-700 leading-tight">
                    <div className="w-1 h-1 rounded-full bg-blue-400 mt-2 shrink-0"></div>
                    <p>{reason}</p>
                 </div>
              ))}
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
           <div className="p-3 bg-white rounded-2xl border border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                 <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Followers</p>
                 <p className="text-sm font-bold text-gray-900 leading-none">
                    {mainPlatform?.followers >= 1000 ? (mainPlatform.followers/1000).toFixed(1) + 'k' : mainPlatform?.followers || 'N/A'}
                 </p>
              </div>
           </div>
           <div className="p-3 bg-white rounded-2xl border border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-xl">
                 <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Trust</p>
                 <p className={`text-sm font-bold leading-none ${data.trustLevel === 'High' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {data.trustLevel}
                 </p>
              </div>
           </div>
        </div>

        <div className="mt-auto flex gap-3">
           <button
             onClick={() => navigate(`/brand/influencer/${data.id}`)}
             className="flex-1 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-2xl py-3.5 transition-all flex items-center justify-center gap-2 group/btn"
           >
             View Profile
             <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:translate-y-[-2px] group-hover/btn:translate-x-[2px]" />
           </button>
           <button 
             onClick={() => onInvite && onInvite(data)}
             className="px-4 py-3.5 bg-blue-50 text-blue-600 font-bold rounded-2xl hover:bg-blue-100 transition-colors"
            >
              Invite
           </button>
        </div>
      </div>
    </div>
  );
});

export default AIInfluencerCard;
