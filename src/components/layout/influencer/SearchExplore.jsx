// src/pages/influencer/SearchExplore.jsx
// Matches: Figma Make → SearchBrandsPage.tsx
// Replaces the placeholder at /influencer/search-brands

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  Filter,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  X,
  Heart,
  Users,
  CheckCircle,
  TrendingUp,
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  MessageCircle
} from "lucide-react";
import api from "../../../services/api";
import collaborationService from "../../../services/collaborationService";
import { getAiMatchForInfluencer } from "../../../services/aiService";
import { useAuth } from "../../../hooks/useAuth";
import ApplyCampaignModal from "./ApplyCampaignModal";
import VerifiedTick from "../../common/VerifiedTick";
import SocialIcon from "../../common/SocialIcon";
import { clsx } from "clsx";
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));



// ── Campaign Card ─────────────────────────────────────────────────────────────
const CampaignCard = ({
  campaign,
  isApplied,
  isViewed,
  isCollaboration,
  collaborationId,
  onViewDetails,
  onApply,
  onViewCollaboration,
  isAIMatch,
  aiData
}) => {
  const budgetMin = campaign.budget?.min?.toLocaleString() || 0;
  const budgetMax = campaign.budget?.max?.toLocaleString() || 0;
  
  const matchScore = aiData?.matchScore || campaign.matchScore;
  const matchLevel = aiData?.matchLevel || campaign.matchLevel;
  const reasons = aiData?.reasons || (aiData?.aiReason ? [aiData.aiReason] : (campaign.reasons || []));

  const brandName = campaign.brandProfile?.brandname || campaign.brandUser?.fullname || "Brand";
  const brandLogo = campaign.brandProfile?.logo || campaign.brandUser?.profilePic;

  const startDateStr = campaign.campaignTimeline?.startDate
    ? new Date(campaign.campaignTimeline.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;
  const endDateStr = campaign.campaignTimeline?.endDate
    ? new Date(campaign.campaignTimeline.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden flex flex-col h-[465px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] w-full max-w-[380px] mx-auto relative group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12)] hover:border-blue-100 cursor-pointer">
      {/* Header Profile with Top Background */}
      <div className="relative h-[80px] bg-gradient-to-br from-blue-700 to-indigo-800 p-4 flex justify-between items-start transition-all duration-500 group-hover:from-blue-600 group-hover:to-indigo-700">
          <div className="flex flex-row flex-wrap gap-1.5 z-10 max-w-[80%]">
            <div className="px-3 py-1 bg-[#0f172a]/40 backdrop-blur-sm text-white text-[9px] font-black uppercase rounded-full flex items-center gap-1.5 shadow-sm border border-white/10 tracking-wider w-fit">
               <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> ACTIVE
            </div>
            {isApplied ? (
              <div className="px-3 py-1 bg-emerald-50/20 backdrop-blur-sm text-white text-[9px] font-bold uppercase rounded-full flex items-center shadow-sm border border-white/10 w-fit">
                APPLIED
              </div>
            ) : isCollaboration ? (
              <div className="px-3 py-1 bg-indigo-50/20 backdrop-blur-sm text-white text-[9px] font-bold uppercase rounded-full flex items-center shadow-sm border border-white/10 w-fit">
                ONGOING
              </div>
            ) : isViewed ? (
              <div className="px-3 py-1 bg-gray-50/20 backdrop-blur-sm text-white text-[9px] font-bold uppercase rounded-full flex items-center shadow-sm border border-white/10 w-fit">
                VIEWED
              </div>
            ) : null}
         </div>
          <div className="z-10 relative flex flex-col items-end gap-1">
            {Array.isArray(campaign.platform) ? (
              campaign.platform.map((p, idx) => (
                <SocialIcon key={idx} platformName={p} className="transition-transform duration-300 hover:scale-110" />
              ))
            ) : campaign.platform ? (
              <SocialIcon platformName={campaign.platform} className="transition-transform duration-300 hover:scale-110" />
            ) : null}
          </div>
      </div>

      <div className="px-5 pb-5 flex-1 flex flex-col -mt-10 relative items-center text-center">
         {/* Profile Image (Brand Logo) */}
         <div className="relative mb-2 transition-transform duration-500 group-hover:scale-105">
            {brandLogo ? (
              <img
                src={brandLogo}
                alt={brandName}
                className="w-[84px] h-[84px] rounded-full object-cover border-[4px] border-white shadow-md bg-white relative z-10 transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-[84px] h-[84px] rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl border-[4px] border-white shadow-md relative z-10 transition-transform duration-500 group-hover:scale-110">
                {brandName[0]}
              </div>
            )}
         </div>
         
         <div className="flex items-center gap-1.5 justify-center mb-0.5">
            <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate max-w-[180px]">{campaign.name}</h3>
            {isAIMatch && (
              <div className="flex items-center gap-1 bg-purple-50 text-purple-600 text-[9px] font-black px-2 py-0.5 rounded-full border border-purple-100 ml-1 whitespace-nowrap">
                <Sparkles size={10} /> {matchScore}% MATCH
              </div>
            )}
         </div>
         <div className="text-[11px] font-medium text-gray-500 mb-2 flex items-center justify-center gap-1">by {brandName} <VerifiedTick user={campaign.brandUser} roleProfile={campaign.brandProfile} size="xs" /></div>

         <div className="mb-3 px-3 w-full">
            <p className="text-[10px] text-gray-500 leading-normal line-clamp-2 overflow-hidden h-[30px]">
              {campaign.description || `Join this exciting ${campaign.industry || "brand"} campaign and showcase your talent.`}
            </p>
            <button 
              onClick={(e) => { e.stopPropagation(); onViewDetails(campaign); }}
              className="text-[9px] text-blue-600 font-bold hover:underline mt-0.5 block mx-auto"
            >
              See More
            </button>
         </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 w-full mb-3">
           {/* Budget */}
           <div className="p-2.5 bg-white rounded-[14px] border border-gray-100 flex items-center gap-2.5 shadow-sm transition-all duration-300 hover:bg-amber-50/30 hover:border-amber-100 hover:scale-[1.02] hover:shadow-md cursor-default group/stat1">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/stat1:scale-110 group-hover/stat1:bg-amber-100">
                 <DollarSign className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="flex flex-col text-left">
                 <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">BUDGET</span>
                 <span className="text-[11px] font-black text-gray-900 leading-none mt-0.5">
                    ${budgetMin}+
                 </span>
              </div>
           </div>
           {/* Duration */}
           <div className="p-2.5 bg-white rounded-[14px] border border-gray-100 flex items-center gap-2.5 shadow-sm transition-all duration-300 hover:bg-indigo-50/30 hover:border-indigo-100 hover:scale-[1.02] hover:shadow-md cursor-default group/stat2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/stat2:scale-110 group-hover/stat2:bg-indigo-100">
                 <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              </div>
              <div className="flex flex-col text-left">
                 <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">START DATE</span>
                 <span className="text-[10px] font-black text-gray-900 leading-none mt-0.5">
                    {startDateStr || "Flexible"}
                 </span>
              </div>
           </div>
           {/* Applicants */}
           <div className="p-2.5 bg-white rounded-[14px] border border-gray-100 flex items-center gap-2.5 shadow-sm transition-all duration-300 hover:bg-rose-50/30 hover:border-rose-100 hover:scale-[1.02] hover:shadow-md cursor-default group/stat3 col-span-1">
              <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/stat3:scale-110 group-hover/stat3:bg-rose-100">
                 <Users className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <div className="flex flex-col text-left truncate">
                 <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">APPLICANTS</span>
                 <span className="text-[11px] font-black text-gray-900 leading-none mt-0.5 truncate">
                    {campaign.applicantsCount || 0}
                 </span>
              </div>
           </div>
           {/* Industry */}
           <div className="p-2.5 bg-white rounded-[14px] border border-gray-100 flex items-center gap-2.5 shadow-sm transition-all duration-300 hover:bg-purple-50/30 hover:border-purple-100 hover:scale-[1.02] hover:shadow-md cursor-default group/stat4">
              <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/stat4:scale-110 group-hover/stat4:bg-purple-100">
                 <Briefcase className="w-3.5 h-3.5 text-purple-500" />
              </div>
              <div className="flex flex-col text-left">
                 <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">INDUSTRY</span>
                 <span className="text-[11px] font-black text-gray-900 leading-none mt-0.5 truncate max-w-[70px]">
                    {campaign.industry || "General"}
                 </span>
              </div>
           </div>
        </div>

        <div className="mt-auto flex gap-3 w-full">
           <button
             onClick={() => onViewDetails(campaign)}
             className="flex-1 bg-[#111827] hover:bg-black text-white text-[10px] font-bold uppercase tracking-wide rounded-[12px] py-3 transition-all flex items-center justify-center gap-2 group/btn shadow-md"
           >
             VIEW DETAILS <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
           </button>
           <button 
             onClick={() => isCollaboration ? onViewCollaboration(collaborationId) : (!isApplied && onApply(campaign))}
             disabled={isApplied && !isCollaboration}
             className={cn(
               "flex-[1.4] text-[9px] font-bold uppercase tracking-tight rounded-[12px] py-3 transition-all shadow-sm flex items-center justify-center text-center",
               isCollaboration
                 ? "bg-indigo-600 text-white hover:bg-indigo-700"
                 : isApplied
                   ? "bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default"
                   : "bg-[#EFF6FF] text-blue-600 hover:bg-[#DBEAFE]"
             )}
            >
              {isCollaboration ? "GO TO COLLABORATION" : isApplied ? "APPLIED" : "APPLY NOW"}
           </button>
        </div>
      </div>
    </div>
  );
};

// ── Brand Card ────────────────────────────────────────────────────────────────
const BrandCard = ({
  brand,
  isRequested,
  isViewed,
  isCollaboration,
  collaborationId,
  onViewProfile,
  onSendRequest,
  onViewCollaboration,
  activeCampaignName,
  isAIMatch,
  aiData,
  collaborationStatus
}) => {
  const navigate = useNavigate();
  const name = brand.brandname || (brand.user && brand.user.fullname) || "Brand";
  const logo = brand.logo || (brand.user && brand.user.profilePic);
  
  const matchScore = aiData?.matchScore;
  const matchLevel = aiData?.matchLevel;
  const reasons = aiData?.reasons || [];

  // Determine collaboration badge from API collaborationStatus or local isCollaboration
  const collabLabel = collaborationStatus?.label || null;
  const isOngoing = isCollaboration || ['Ongoing'].includes(collabLabel);
  const isPreviouslyWorked = collabLabel === 'Previously Worked';
  const isCancelled = collabLabel === 'Cancelled';
  const effectiveCollabId = collaborationId || collaborationStatus?.collaborationId;
  const effectiveCampaignName = activeCampaignName || collaborationStatus?.campaignName;

  const rating = brand.rating || 0;
  const reviewCount = brand.reviewsCount || 0;
  const trustLevel = brand.isVerified ? 'High' : 'MODERATE';

  // Determine platform icon
  let platformName = '';
  if (brand.socialMedia) {
      const socialKeys = typeof brand.socialMedia.keys === 'function' 
        ? Array.from(brand.socialMedia.keys()) 
        : Object.keys(brand.socialMedia);
      if (socialKeys.length > 0) platformName = socialKeys[0];
  }
  if (!platformName && brand.verifiedPlatforms) {
      const verifiedKeys = Object.keys(brand.verifiedPlatforms);
      if (verifiedKeys.length > 0) platformName = verifiedKeys[0];
  }

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden flex flex-col h-[445px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] w-full max-w-[380px] mx-auto relative group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12)] hover:border-indigo-100 cursor-pointer">
      {/* Header Profile with Top Background */}
      <div className="relative h-[80px] bg-gradient-to-br from-blue-700 to-indigo-800 p-4 flex justify-between items-start transition-all duration-500 group-hover:from-blue-600 group-hover:to-indigo-700">
          <div className="flex flex-row flex-wrap gap-1.5 z-10 max-w-[80%]">
            {/* AI Match moved to profile section */}
            <div className="px-3 py-1 bg-[#0f172a]/40 backdrop-blur-sm text-white text-[9px] font-black uppercase rounded-full flex items-center gap-1.5 shadow-sm border border-white/10 tracking-wider w-fit">
               <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> ACTIVE
            </div>
            {isRequested ? (
              <div className="px-3 py-1 bg-emerald-50/20 backdrop-blur-sm text-white text-[9px] font-bold uppercase rounded-full flex items-center shadow-sm border border-white/10 w-fit">
                REQUESTED
              </div>
            ) : null}
         </div>
          <div className="z-10 relative flex flex-col items-end gap-2">
            <SocialIcon platformName={platformName} className="transition-transform duration-300 hover:scale-110 hover:rotate-6" />
          </div>
      </div>

      <div className="px-5 pb-5 flex-1 flex flex-col -mt-10 relative items-center text-center">
         {/* Profile Image */}
         <div className="relative mb-2 transition-transform duration-500 group-hover:scale-105">
            {logo ? (
              <img
                src={logo}
                alt={name}
                className="w-[84px] h-[84px] rounded-[24px] object-cover border-[4px] border-white shadow-md bg-white relative z-10 transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-[84px] h-[84px] rounded-[24px] bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl border-[4px] border-white shadow-md relative z-10 transition-transform duration-500 group-hover:scale-110">
                {name[0]}
              </div>
            )}
         </div>
         
         <div className="flex items-center gap-1.5 justify-center mb-0.5">
            <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{name}</h3>
            <VerifiedTick user={brand} roleProfile={brand} size="sm" />
            {isAIMatch && (
              <div className="flex items-center gap-1 bg-purple-50 text-purple-600 text-[9px] font-black px-2 py-0.5 rounded-full border border-purple-100 ml-1 whitespace-nowrap">
                <Sparkles size={10} /> {matchScore}% MATCHED
              </div>
            )}
         </div>
         <p className="text-[11px] font-medium text-gray-500 mb-2">{brand.industry || "Brand"}</p>

         <div className="mb-3 px-3 w-full">
            <p className="text-[10px] text-gray-500 leading-normal line-clamp-2 overflow-hidden h-[30px]">
              {brand.description || `Leading ${brand.industry || "brand"} looking for influencers to collaborate on exciting campaigns.`}
            </p>
            <button 
              onClick={(e) => { e.stopPropagation(); onViewProfile(brand); }}
              className="text-[9px] text-blue-600 font-bold hover:underline mt-0.5 block mx-auto"
            >
              See More
            </button>
         </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 w-full mb-2">
           {/* Rating */}
           <div className="p-2.5 bg-white rounded-[14px] border border-gray-100 flex items-center gap-2.5 shadow-sm transition-all duration-300 hover:bg-amber-50/30 hover:border-amber-100 hover:scale-[1.02] hover:shadow-md cursor-default group/rating">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/rating:scale-110 group-hover/rating:bg-amber-100">
                 <Star className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="flex flex-col text-left">
                 <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">RATING</span>
                 <span className="text-[12px] font-black text-gray-900 leading-none mt-0.5">
                    {rating > 0 ? rating.toFixed(1) : "New"}
                 </span>
              </div>
           </div>
           {/* Campaigns */}
           <div className="p-2.5 bg-white rounded-[14px] border border-gray-100 flex items-center gap-2.5 shadow-sm transition-all duration-300 hover:bg-indigo-50/30 hover:border-indigo-100 hover:scale-[1.02] hover:shadow-md cursor-default group/stat2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/stat2:scale-110 group-hover/stat2:bg-indigo-100">
                 <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
              </div>
              <div className="flex flex-col text-left">
                 <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">CAMPAIGNS</span>
                 <span className="text-[12px] font-black text-gray-900 leading-none mt-0.5">
                    {brand.activeCampaignsCount || 0} Active
                 </span>
              </div>
           </div>
           {/* Location */}
           <div className="p-2.5 bg-white rounded-[14px] border border-gray-100 flex items-center gap-2.5 shadow-sm transition-all duration-300 hover:bg-rose-50/30 hover:border-rose-100 hover:scale-[1.02] hover:shadow-md cursor-default group/stat3 col-span-1">
              <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/stat3:scale-110 group-hover/stat3:bg-rose-100">
                 <MapPin className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <div className="flex flex-col text-left truncate">
                 <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">LOCATION</span>
                 <span className="text-[10px] font-black text-gray-900 leading-none mt-0.5 truncate" title={brand.address || brand.location || "N/A"}>
                    {brand.address || brand.location || "N/A"}
                 </span>
              </div>
           </div>
           {/* Reviews */}
           <div className="p-2.5 bg-white rounded-[14px] border border-gray-100 flex items-center gap-2.5 shadow-sm transition-all duration-300 hover:bg-purple-50/30 hover:border-purple-100 hover:scale-[1.02] hover:shadow-md cursor-default group/stat4">
              <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/stat4:scale-110 group-hover/stat4:bg-purple-100">
                 <MessageCircle className="w-3.5 h-3.5 text-purple-500" />
              </div>
              <div className="flex flex-col text-left">
                 <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">REVIEWS</span>
                 <span className="text-[12px] font-black text-gray-900 leading-none mt-0.5">
                    {reviewCount || 0} Total
                 </span>
              </div>
           </div>
        </div>

        <div className="mt-auto flex gap-3 w-full">
           <button
             onClick={() => onViewProfile(brand)}
             className="flex-1 bg-[#111827] hover:bg-black text-white text-[10px] font-bold uppercase tracking-wide rounded-[12px] py-3 transition-all flex items-center justify-center gap-2 group/btn shadow-md"
           >
             VIEW PROFILE <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
           </button>
           <button 
             onClick={() => isOngoing ? onViewCollaboration(effectiveCollabId) : isPreviouslyWorked ? onViewCollaboration(effectiveCollabId) : (!isRequested && onSendRequest(brand))}
             disabled={isRequested && !isOngoing && !isPreviouslyWorked}
             className={cn(
               "flex-[1.4] text-[9px] font-bold uppercase tracking-tight rounded-[12px] py-3 transition-all shadow-sm flex items-center justify-center text-center",
               isOngoing
                 ? "bg-indigo-600 text-white hover:bg-indigo-700"
                 : isPreviouslyWorked
                   ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                   : isRequested
                     ? "bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default"
                     : "bg-[#EFF6FF] text-blue-600 hover:bg-[#DBEAFE]"
             )}
            >
              {isOngoing ? "GO TO COLLABORATION" : isPreviouslyWorked ? "PAST WORK" : isRequested ? "SENT" : "REQUEST"}
           </button>
        </div>
      </div>
    </div>
  );
};

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse space-y-3">
    <div className="h-36 bg-gray-100 rounded-lg" />
    <div className="flex gap-2 items-center">
      <div className="w-7 h-7 rounded-full bg-gray-100" />
      <div className="h-3 bg-gray-100 rounded w-24" />
    </div>
    <div className="h-4 bg-gray-100 rounded w-3/4" />
    <div className="flex gap-1">
      <div className="h-5 bg-gray-100 rounded-full w-16" />
      <div className="h-5 bg-gray-100 rounded-full w-20" />
    </div>
    <div className="h-3 bg-gray-50 rounded w-1/2" />
  </div>
);

// ── Industry options ──────────────────────────────────────────────────────────
const INDUSTRIES = [
  "All",
  "Food",
  "Fashion",
  "Tech",
  "Travel",
  "Fitness",
  "Beauty",
  "Gaming",
  "Finance",
  "Education",
  "Lifestyle",
];

const PLATFORMS = [
  "All",
  "instagram",
  "youtube",
  "tiktok",
  "twitter",
  "facebook",
  "linkedin",
];

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
const SearchExplore = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { tab } = useParams();
  const activeTab = tab === "brands" ? "brands" : "campaigns";

  // Data
  const [campaigns, setCampaigns] = useState([]);
  const [brands, setBrands] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedApplicationCampaign, setSelectedApplicationCampaign] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  // AI Match state
  const [isAIMode, setIsAIMode] = useState(false);
  const [aiCampaigns, setAiCampaigns] = useState([]);
  const [aiBrands, setAiBrands] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const handleAIMatch = async () => {
    if (!user?._id) return;
    setIsAIMode(true);
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await getAiMatchForInfluencer(user._id, activeTab);
      const matches = res?.matches || res?.data?.matches || res?.data || res || [];
      if (activeTab === 'campaigns') {
        setAiCampaigns(matches);
        setAiBrands([]);
      } else {
        setAiBrands(matches);
        setAiCampaigns([]);
      }
    } catch (err) {
      setAiError(err.response?.data?.message || "Failed to load AI matches");
    } finally {
      setAiLoading(false);
    }
  };

  const clearAIMatch = () => {
    setIsAIMode(false);
    setAiCampaigns([]);
    setAiBrands([]);
    setAiError(null);
  };

  // States for feedback tracking
  const [viewedIds, setViewedIds] = useState([]);
  const [appliedCampaignIds, setAppliedCampaignIds] = useState([]);
  const [requestedBrandIds, setRequestedBrandIds] = useState([]);

  // Collaboration tracking
  const [activeCollaborations, setActiveCollaborations] = useState([]); // List of { campaignId, brandId, collaborationId }

  // Filters
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All");
  const [platform, setPlatform] = useState("All");

  // Pagination
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Load viewed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("influencer_viewed_ids");
    if (saved) {
      try {
        setViewedIds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse viewed IDs", e);
      }
    }
  }, []);

  // Sync viewed state to localStorage
  useEffect(() => {
    if (viewedIds.length > 0) {
      localStorage.setItem("influencer_viewed_ids", JSON.stringify(viewedIds));
    }
  }, [viewedIds]);

  // Fetch influencer's sent requests to mark applied/requested cards
  useEffect(() => {
    const fetchExistingRequests = async () => {
      try {
        const res = await collaborationService.getRequests({ type: "sent", limit: 100 });
        if (res.success) {
          const sentRequests = res.data.requests || [];
          const appliedIds = sentRequests
            .filter(r => r.campaign)
            .map(r => r.campaign._id || r.campaign);
          const requestedIds = sentRequests
            .filter(r => r.receiverDetails?.role === 'brand' || r.receiver)
            .map(r => r.receiver?._id || r.receiver);

          setAppliedCampaignIds(appliedIds);
          setRequestedBrandIds(requestedIds);
        }
      } catch (err) {
        console.error("Failed to fetch existing requests", err);
      }
    };

    const fetchCollaborations = async () => {
      try {
        // Fetch all non-completed collaborations
        const res = await collaborationService.getAll({ limit: 100 });
        if (res.success) {
          const collabs = (res.data.collaborations || []).filter(
            c => !['completed', 'cancelled'].includes(c.status)
          );

          const mapping = collabs.map(c => {
            // Helper to extract ID from potential object or string
            const getStrId = (val) => {
              if (!val) return '';
              if (typeof val === 'string') return val;
              return String(val.id || val._id || val);
            };

            return {
              id: getStrId(c._id),
              campaignId: getStrId(c.campaign),
              brandId: getStrId(c.brand),
              campaignName: c.campaign?.name || c.campaign?.title || 'Collaboration'
            };
          });
          setActiveCollaborations(mapping);
        }
      } catch (err) {
        console.error("Failed to fetch active collaborations", err);
      }
    };

    fetchExistingRequests();
    fetchCollaborations();
  }, []);

  // ── Fetch campaigns ─────────────────────────────────────────────────────────
  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (search) params.append("search", search);
      if (industry !== "All") params.append("industry", industry);
      if (platform !== "All") params.append("platform", platform);

      const res = await api.get(`/campaigns?${params.toString()}`);
      const data = res.data.data;
      setCampaigns(data.campaigns || []);
      setPages(data.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }, [search, industry, platform, page]);

  // ── Fetch brands ────────────────────────────────────────────────────────────
  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (search) params.append("search", search);
      if (industry !== "All") params.append("industry", industry);

      const res = await api.get(`/brands/public-list?${params.toString()}`);
      const data = res.data.data;
      setBrands(data.brands || []);
      setPages(data.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load brands");
    } finally {
      setLoading(false);
    }
  }, [search, industry, page]);

  // ── Auto-fetch on mount and filter change ───────────────────────────────────
  useEffect(() => {
    if (activeTab === "campaigns") fetchCampaigns();
    else fetchBrands();
  }, [activeTab, fetchCampaigns, fetchBrands]);

  // Reset page on filter change
  const handleFilterChange = (setter) => (val) => {
    setPage(1);
    setter(val);
  };

  const clearFilters = () => {
    setSearch("");
    setIndustry("All");
    setPlatform("All");
    setPage(1);
  };

  const markAsViewed = (id) => {
    if (!viewedIds.includes(id)) {
      setViewedIds(prev => [...prev, id]);
    }
  };

  const hasActiveFilters = search || industry !== "All" || platform !== "All";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 pt-6 pb-4">
          {/* Page title + search bar */}
          <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Explore Opportunities</h1>
              <p className="text-sm text-gray-500 mt-1">Discover brands and campaigns to collaborate with</p>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder={`Search ${activeTab === 'campaigns' ? 'campaigns' : 'brands'}...`}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent bg-gray-50/50"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-colors text-sm font-medium ${showFilters || hasActiveFilters
                    ? "bg-purple-50 border-purple-200 text-purple-700"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <Filter size={16} />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="flex w-2 h-2 rounded-full border border-purple-200 bg-purple-600 ml-1"></span>
                )}
              </button>
            </div>
          </div>

          {/* Tab pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigate("/influencer/search/campaigns");
                  setPage(1);
                  clearAIMatch();
                }}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === "campaigns"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
              >
                <Briefcase size={16} />
                Campaigns
              </button>
              <button
                onClick={() => {
                  navigate("/influencer/search/brands");
                  setPage(1);
                  clearAIMatch();
                }}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === "brands"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
              >
                <Building2 size={16} />
                Brands
              </button>
            </div>
            
            {(activeTab === "campaigns" || activeTab === "brands") && (
              isAIMode ? (
                <button
                  onClick={clearAIMatch}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                >
                  <X size={16} />
                  Clear AI Match
                </button>
              ) : (
                <button
                  onClick={handleAIMatch}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-200 hover:shadow-lg hover:shadow-purple-300 hover:-translate-y-0.5"
                >
                  <Sparkles size={16} />
                  ✨ AI Match
                </button>
              )
            )}
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="mt-4 p-4 border border-gray-100 bg-gray-50 rounded-xl flex flex-wrap gap-4 items-end">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500 font-medium">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) =>
                    handleFilterChange(setIndustry)(e.target.value)
                  }
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  {INDUSTRIES.map((i) => (
                    <option key={i}>{i}</option>
                  ))}
                </select>
              </div>

              {activeTab === "campaigns" && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 font-medium">
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) =>
                      handleFilterChange(setPlatform)(e.target.value)
                    }
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 capitalize"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} className="capitalize">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 py-1.5"
                >
                  <X size={13} /> Clear all
                </button>
              )}
            </div>
          )}
          {/* end Filter panel */}
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 py-6">
        {/* Error */}
        {(error || aiError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
            {error || aiError}
          </div>
        )}

        {/* Loading skeletons */}
        {(loading || aiLoading) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!(loading || aiLoading) &&
          !error && !aiError &&
          (isAIMode
            ? (activeTab === 'campaigns' ? aiCampaigns : aiBrands).length === 0
            : (activeTab === "campaigns" ? campaigns : brands).length === 0
          ) && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeTab === "campaigns" ? (
                  <Briefcase size={28} className="text-purple-300" />
                ) : (
                  <Building2 size={28} className="text-purple-300" />
                )}
              </div>
              <h3 className="text-gray-700 font-medium mb-1">
                {isAIMode
                  ? activeTab === 'campaigns'
                    ? "No campaigns match your profile"
                    : "No brands match your profile"
                  : `No ${activeTab} found`}
              </h3>
              <p className="text-sm text-gray-400">
                {isAIMode ? "Try adjusting your profile or explore normally" : "Try changing your filters or search term"}
              </p>
              {hasActiveFilters && !isAIMode && (
                <button
                  onClick={clearFilters}
                  className="mt-3 text-sm text-purple-600 hover:text-purple-800"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

        {/* AI Campaign cards grid (Overrides regular tabs) */}
        {!(loading || aiLoading) && isAIMode && activeTab === 'campaigns' && aiCampaigns.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {aiCampaigns.map((item) => {
              const c = item.campaign || item;
              const collab = activeCollaborations.find(
                ac => ac.campaignId === String(c._id)
              );
              const isCollab = !!collab;
              return (
                <CampaignCard
                  key={c._id}
                  campaign={c}
                  isApplied={!isCollab && appliedCampaignIds.map(String).includes(String(c._id))}
                  isViewed={viewedIds.includes(c._id)}
                  isCollaboration={isCollab}
                  collaborationId={collab?.id}
                  isAIMatch={true}
                  aiData={item}
                  onViewDetails={(campaign) => {
                    markAsViewed(campaign._id);
                    navigate(`/influencer/search/campaign/${campaign._id}`);
                  }}
                  onApply={(campaign) => setSelectedApplicationCampaign(campaign)}
                  onViewCollaboration={(collabId) => {
                    navigate(`/influencer/collaboration/${collabId}`);
                  }}
                />
              );
            })}
          </div>
        )}

        {/* AI Brand cards grid */}
        {!(loading || aiLoading) && isAIMode && activeTab === 'brands' && aiBrands.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {aiBrands.map((item) => {
              const b = item.brand || item;
              const collabStatus = item.collaborationStatus || null;
              // Also check local active collaborations as fallback
              const localCollab = activeCollaborations.find(
                ac => ac.brandId === String(b._id) || ac.brandId === String(b.user?._id || b.user || '')
              );
              const isCollab = !!localCollab || (collabStatus && ['Ongoing'].includes(collabStatus.label));
              return (
                <BrandCard
                  key={b._id}
                  brand={b}
                  isRequested={!isCollab && requestedBrandIds.map(String).includes(String(b._id))}
                  isViewed={viewedIds.includes(b._id)}
                  isCollaboration={isCollab}
                  collaborationId={localCollab?.id || collabStatus?.collaborationId}
                  activeCampaignName={localCollab?.campaignName || collabStatus?.campaignName}
                  collaborationStatus={collabStatus}
                  isAIMatch={true}
                  aiData={item}
                  onViewProfile={(brand) => {
                    markAsViewed(brand._id);
                    navigate(`/influencer/search/brand/${brand._id}`);
                  }}
                  onSendRequest={(brand) => setSelectedBrand(brand)}
                  onViewCollaboration={(collabId) => {
                    navigate(`/influencer/collaboration/${collabId}`);
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Regular Campaign cards grid */}
        {!(loading || aiLoading) && !isAIMode && activeTab === "campaigns" && campaigns.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {campaigns.map((c) => {
              // Use String() to safely compare MongoDB ObjectIds
              const collab = activeCollaborations.find(
                ac => ac.campaignId === String(c._id)
              );
              const isCollab = !!collab;
              return (
                <CampaignCard
                  key={c._id}
                  campaign={c}
                  // If it's a collaboration, don't show it as just "applied"
                  isApplied={!isCollab && appliedCampaignIds.map(String).includes(String(c._id))}
                  isViewed={viewedIds.includes(c._id)}
                  isCollaboration={isCollab}
                  collaborationId={collab?.id}
                  isAIMatch={false}
                  aiData={null}
                  onViewDetails={(campaign) => {
                    markAsViewed(campaign._id);
                    navigate(`/influencer/search/campaign/${campaign._id}`);
                  }}
                  onApply={(campaign) => setSelectedApplicationCampaign(campaign)}
                  onViewCollaboration={(collabId) => {
                    navigate(`/influencer/collaboration/${collabId}`);
                  }}
                />
              );
            })}


          </div>
        )}

        {/* Brand cards grid */}
        {!(loading || aiLoading) && !isAIMode && activeTab === "brands" && brands.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {brands.map((b) => {
              const collab = activeCollaborations.find(
                ac => ac.brandId === String(b._id) || ac.brandId === String(b.user || '')
              );
              const isBrandCollab = !!collab;
              return (
                <BrandCard
                  key={b._id}
                  brand={b}
                  isRequested={!isBrandCollab && requestedBrandIds.map(String).includes(String(b._id))}
                  isViewed={viewedIds.includes(b._id)}
                  isCollaboration={isBrandCollab}
                  collaborationId={collab?.id}
                  activeCampaignName={collab?.campaignName}
                  onViewProfile={(brand) => {
                    markAsViewed(brand._id);
                    navigate(`/influencer/search/brand/${brand._id}`);
                  }}
                  onSendRequest={(brand) => setSelectedBrand(brand)}
                  onViewCollaboration={(collabId) => {
                    navigate(`/influencer/collaboration/${collabId}`);
                  }}
                />
              );
            })}


          </div>
        )}

        {/* Pagination */}
        {!loading && pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Apply Modal — from Campaign */}
      {selectedApplicationCampaign && (
        <ApplyCampaignModal
          campaign={selectedApplicationCampaign}
          targetType="campaign"
          onClose={() => setSelectedApplicationCampaign(null)}
          onSuccess={() => {
            setAppliedCampaignIds(prev => [...prev, selectedApplicationCampaign._id]);
            // Manually increment applicant count in local state for realtime feel
            setCampaigns(prev => prev.map(c => 
              String(c._id) === String(selectedApplicationCampaign._id) 
                ? { ...c, applicantsCount: (c.applicantsCount || 0) + 1 }
                : c
            ));
            setSelectedApplicationCampaign(null);
          }}
        />
      )}

      {/* Apply Modal — from Brand */}
      {selectedBrand && (
        <ApplyCampaignModal
          brand={selectedBrand}
          targetType="brand"
          onClose={() => setSelectedBrand(null)}
          onSuccess={() => {
            setRequestedBrandIds(prev => [...prev, selectedBrand._id]);
            // Note: If brand requests also affect a specific campaign count, 
            // that logic would be more complex since the user selects the campaign in the modal.
            // For now, we update the requested status which is the primary feedback.
            setSelectedBrand(null);
          }}
        />
      )}

    </div>
  );
};

export default SearchExplore;
