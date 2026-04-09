import React from 'react';
import {
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Clock,
  CheckCircle,
  MessageCircle,
  User,
  FileText,
  ChevronRight,
  TrendingUp,
  Building2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

// ── Helpers ─────────────────────────────────────────────────────────────────

const getPlatformIcon = (name) => {
  switch (name?.toLowerCase()) {
    case 'instagram': return <Instagram size={14} className="text-pink-600" />;
    case 'youtube':   return <Youtube size={14} className="text-red-600" />;
    case 'twitter':   return <Twitter size={14} className="text-blue-400" />;
    case 'linkedin':  return <Linkedin size={14} className="text-blue-700" />;
    default:          return <TrendingUp size={14} className="text-blue-600" />;
  }
};

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
};

const timeAgo = (d) => {
  if (!d) return '—';
  const diff = Date.now() - new Date(d).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (days > 0)  return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
};

// ── Main Component ───────────────────────────────────────────────────────────

const CollaborationCard = ({ collaboration, userRole }) => {
  const navigate = useNavigate();

  if (!collaboration) return null;

  const { campaign, status, updatedAt, deliverables } = collaboration;

  // ── Resolve "partner" based on who is viewing ──────────────────────────────
  // Brand sees influencer; influencer sees brand
  let partnerName    = 'Unknown';
  let partnerAvatar  = null;
  let partnerSubtext = null; // e.g. niche / company type
  let partnerId      = null;

  if (userRole === 'influencer') {
    // Show brand info
    const brand = collaboration.brand || {};
    partnerName   = brand.name || 'Unknown Brand';
    partnerAvatar = brand.avatar || null;
    partnerSubtext = brand.industry || 'Brand';
    partnerId     = brand.id;
  } else {
    // Show influencer info (brand viewing)
    const influencer = collaboration.influencer || {};
    partnerName   = influencer.name || influencer.username || 'Unknown Influencer';
    partnerAvatar = influencer.avatar || null;
    partnerSubtext = influencer.category || 'Influencer';
    partnerId     = influencer.id;
  }

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerName)}&background=random&size=100`;

  // ── Campaign data ──────────────────────────────────────────────────────────
  const campaignTitle  = campaign?.title || 'Unknown Campaign';
  const budget         = collaboration.agreedBudget || null;
  const startDate      = collaboration.startDate;
  const endDate        = collaboration.endDate;
  // Platform: use targetPlatform from campaign
  const platform       = campaign?.targetPlatform?.[0] || null;

  // ── Status ─────────────────────────────────────────────────────────────────
  // Backend: 'active' → 'ongoing', 'completed' → 'completed'
  const rawStatus    = status?.toLowerCase() || 'active';
  const displayStatus = rawStatus === 'active' ? 'ongoing' : rawStatus;
  const isCompleted   = displayStatus === 'completed';

  // ── Deliverables ──────────────────────────────────────────────────────────
  const delivCompleted = deliverables?.completed ?? deliverables?.submittedCount ?? 0;
  const delivTotal     = deliverables?.total ?? deliverables?.totalCount ?? 0;
  const progress       = delivTotal > 0 ? Math.round((delivCompleted / delivTotal) * 100) : 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">

        {/* ── Left: Partner + Campaign info ─────────────────────────────── */}
        <div className="flex gap-4 items-start flex-1 min-w-0">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={partnerAvatar || fallbackAvatar}
              alt={partnerName}
              onError={(e) => { e.target.src = fallbackAvatar; }}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
            />
            {/* Small platform badge */}
            {platform && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow border border-gray-100">
                {getPlatformIcon(platform)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[17px] font-bold text-[#0F172A] truncate">{partnerName}</h3>
              {/* Status badge */}
              <span className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold',
                displayStatus === 'ongoing'
                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              )}>
                {displayStatus === 'ongoing'
                  ? <Clock size={11} />
                  : <CheckCircle size={11} />}
                {displayStatus}
              </span>
            </div>

            {/* Campaign */}
            <p className="text-sm font-medium text-gray-500">
              Campaign:{' '}
              <span className="text-gray-900 font-semibold">{campaignTitle}</span>
            </p>

            {/* Partner subtext (niche / industry) */}
            {partnerSubtext && (
              <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                {userRole === 'influencer'
                  ? <Building2 size={11} />
                  : <User size={11} />}
                <span className="capitalize">{partnerSubtext}</span>
              </div>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 font-medium pt-0.5">
              {platform && (
                <div className="flex items-center gap-1 text-gray-600">
                  {getPlatformIcon(platform)}
                  <span className="capitalize">{platform}</span>
                </div>
              )}
              {platform && budget != null && <span>•</span>}
              {budget != null && (
                <div>
                  Budget: <span className="text-emerald-700 font-bold">${Number(budget).toLocaleString()}</span>
                </div>
              )}
              {(platform || budget != null) && (startDate || endDate) && <span>•</span>}
              {(startDate || endDate) && (
                <div className="text-gray-400 italic">
                  {formatDate(startDate)} – {formatDate(endDate)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right: Deliverables progress ──────────────────────────────── */}
        <div className="w-full md:w-60 shrink-0">
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <span className="text-gray-400">Deliverables</span>
            {delivTotal > 0
              ? <span className="text-gray-900 font-bold">{delivCompleted}/{delivTotal}</span>
              : <span className="text-gray-400">—</span>}
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-700',
                isCompleted ? 'bg-blue-600' : 'bg-blue-500'
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400 italic mt-1.5">
            Last update: {timeAgo(updatedAt)}
          </p>
        </div>
      </div>

      {/* ── Action Buttons ─────────────────────────────────────────────── */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-gray-50">
        <div className="flex flex-wrap items-center gap-2">
          {/* View Profile */}
          {userRole === 'brand' && partnerId ? (
            <button
              onClick={() => navigate(`/brand/influencer/${partnerId}`)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <User size={15} />
              View Profile
            </button>
          ) : userRole === 'influencer' && partnerId ? (
            <button
              onClick={() => navigate(`/influencer/search/brand/${partnerId}`)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <User size={15} />
              View Profile
            </button>
          ) : (
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              disabled
            >
              <User size={15} />
              View Profile
            </button>
          )}
          {/* Message — placeholder */}
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <MessageCircle size={15} />
            Message
          </button>

          {/* View Deliverables */}
          <button
            onClick={() => navigate(`/${userRole}/collaboration/${collaboration._id}/deliverables`)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <FileText size={15} />
            View Deliverables
          </button>
        </div>

        {/* View Report — only for completed */}
        {isCompleted && (
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors">
            View Report
            <ChevronRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CollaborationCard;
