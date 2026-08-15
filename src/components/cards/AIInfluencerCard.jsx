import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Users, 
  Sparkles, ArrowRight, Star, Tag
} from 'lucide-react';
import VerifiedTick from '../common/VerifiedTick';
import SocialIcon from '../common/SocialIcon';
import UserAvatar from '../common/UserAvatar';

const stripHtml = (text) => {
  if (!text) return '';
  return text.replace(/<\/?[^>]+(>|$)/g, '');
};

const AIInfluencerCard = memo(({ data, onInvite }) => {
  const navigate = useNavigate();

  let primaryPlatform = '';
  if (data.platforms && data.platforms.length > 0 && data.platforms[0]) {
      primaryPlatform = typeof data.platforms[0] === 'string' ? data.platforms[0] : data.platforms[0].name;
  }
  if (!primaryPlatform && data.verifiedPlatforms) {
      const verifiedKeys = Object.keys(data.verifiedPlatforms);
      if (verifiedKeys.length > 0) primaryPlatform = verifiedKeys[0];
  }
  if (!primaryPlatform && data.socialMedia) {
      const socialKeys = Object.keys(data.socialMedia);
      if (socialKeys.length > 0) primaryPlatform = socialKeys[0];
  }
  
  const rating = data.averageRating || 0;
  const reviewCount = data.reviewsCount || 0;
  const collabCount = data.collaborationCount || 0;
  const trustLevel = data.trustLevel || 'MODERATE';
  const matchScore = data.matchScore || '74.5';
  const category = data.category || '';
  const location = stripHtml(data.location || '');
  const tags = Array.isArray(data.tags) ? data.tags.slice(0, 3) : [];

  const cleanName = stripHtml(data.name || data.username || 'Creator');
  const cleanUsername = stripHtml(data.username);
  const cleanAbout = stripHtml(data.about) || "Top-tier creator focused on high-quality content and brand storytelling across multiple platforms.";
  const isVerified = data.isVerified;
  const trustHigh = isVerified || trustLevel.toLowerCase() === 'high' || rating >= 4;

  // Platform color map for left border + badge
  const PLATFORM_COLOR = {
    instagram: { border: '#c026d3', bg: 'bg-fuchsia-50', text: 'text-fuchsia-600', bar: 'bg-fuchsia-500' },
    youtube:   { border: '#dc2626', bg: 'bg-red-50',     text: 'text-red-600',     bar: 'bg-red-500'     },
    tiktok:    { border: '#0ea5e9', bg: 'bg-sky-50',     text: 'text-sky-600',     bar: 'bg-sky-500'     },
    linkedin:  { border: '#0077B5', bg: 'bg-blue-50',    text: 'text-blue-700',    bar: 'bg-blue-600'    },
    twitter:   { border: '#1DA1F2', bg: 'bg-sky-50',     text: 'text-sky-600',     bar: 'bg-sky-400'     },
    x:         { border: '#14171a', bg: 'bg-slate-100',  text: 'text-slate-800',   bar: 'bg-slate-700'   },
  };
  const platformKey = (primaryPlatform || '').toLowerCase();
  const pColor = PLATFORM_COLOR[platformKey] || { border: '#2563eb', bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500' };

  // Audience Fit score derived from AI match score
  const numericMatch = parseFloat(matchScore) || 75;
  const audienceLabel = numericMatch >= 85 ? { text: 'Exceptional', color: 'text-emerald-600' }
    : numericMatch >= 65 ? { text: 'High', color: 'text-blue-600' }
    : numericMatch >= 40 ? { text: 'Moderate', color: 'text-amber-600' }
    : { text: 'Low', color: 'text-slate-400' };

  const audienceBarColor = numericMatch >= 85 ? 'bg-emerald-500'
    : numericMatch >= 65 ? pColor.bar
    : numericMatch >= 40 ? 'bg-amber-400'
    : 'bg-slate-300';

  const formatFollowers = (n) => {
    if (!n || n === 0) return '—';
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
  };

  return (
    <div
      className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-0.5"
      style={{ borderLeft: `4px solid ${pColor.border}` }}
    >
      {/* ── Top: avatar + name + score ── */}
      <div className="px-4 pt-4 pb-3 flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <UserAvatar
            src={data.profileImage}
            name={cleanUsername}
            className="w-[52px] h-[52px] rounded-xl border-2 border-white shadow-md"
            textClassName="text-lg"
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
              {cleanName}
            </h3>
            <VerifiedTick user={data} roleProfile={data} size="sm" />
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
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-bold uppercase rounded-full border border-indigo-100">
              <Sparkles className="w-2.5 h-2.5" /> AI MATCHED
            </span>
          </div>
        </div>

        {/* AI Match Score */}
        <div className="flex-shrink-0 text-right ml-1">
          <div className="text-[22px] font-black leading-none text-indigo-600">{matchScore}%</div>
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">MATCH</div>
        </div>
      </div>

      {/* ── Platform badges ── */}
      <div className="px-4 pb-3">
        <div className="flex flex-wrap gap-1.5">
          {(() => {
            const rawPlatforms = Array.isArray(data.platforms) && data.platforms.length > 0
              ? data.platforms
              : primaryPlatform ? [{ name: primaryPlatform, followers: data.followersCount || 0 }] : [];

            // Deduplicate and only show platforms with followers > 0 (verified/active)
            const seen = new Set();
            const uniquePlatforms = [];
            for (const p of rawPlatforms) {
              const name = typeof p === 'string' ? p : p?.name;
              const followers = typeof p === 'object' ? (p?.followers || 0) : (data.followersCount || 0);
              if (name && followers > 0 && !seen.has(name.toLowerCase())) {
                seen.add(name.toLowerCase());
                uniquePlatforms.push(p);
              }
            }

            return uniquePlatforms.slice(0, 3).map((p, i) => {
              const pName = typeof p === 'string' ? p : p?.name || primaryPlatform;
              if (!pName) return null;
              return (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${pColor.bg} ${pColor.text} border-current border-opacity-20`}
                >
                  <SocialIcon platformName={pName} size="xs" />
                  {pName.toUpperCase()}
                </span>
              );
            });
          })()}
          {tags.slice(0, 1).map((t, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-semibold rounded-full border border-slate-100">
              <Tag className="w-2.5 h-2.5 text-slate-400" />{t}
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
            style={{ width: `${numericMatch}%` }}
          />
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="px-4 pb-3 flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          {reviewCount > 0 && rating > 0 ? rating : 'New'} ({reviewCount})
        </span>
        {collabCount > 0 && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
            {collabCount} Collabs
          </span>
        )}
        {location && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full truncate max-w-[110px]">
            <span className="truncate">{location}</span>
          </span>
        )}
      </div>

      {/* ── Bio ── */}
      <div className="px-4 pb-3 flex-1">
        <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{cleanAbout}</p>
      </div>

      {/* ── Action buttons ── */}
      <div className="px-4 pb-4 mt-auto flex gap-2">
        <button
          onClick={() => navigate(`/brand/influencer/${data.id || data._id}`)}
          className="flex-[2] bg-[#0f172a] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wide rounded-xl py-2.5 transition-all flex items-center justify-center gap-1.5 group/btn"
        >
          View Profile <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
        </button>
        <button
          onClick={() => onInvite && onInvite(data)}
          className="flex-1 bg-white text-blue-600 border border-blue-200 text-[11px] font-bold uppercase tracking-wide rounded-xl py-2.5 hover:bg-blue-50 transition-colors"
        >
          Invite
        </button>
      </div>
    </div>
  );
});

export default AIInfluencerCard;
