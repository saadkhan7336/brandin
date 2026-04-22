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
} from "lucide-react";
import api from "../../../services/api";
import collaborationService from "../../../services/collaborationService";
import ApplyCampaignModal from "./ApplyCampaignModal";
import VerifiedTick from "../../common/VerifiedTick";
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
  onViewCollaboration
}) => {
  const budgetMin = campaign.budget?.min?.toLocaleString() || 0;
  const budgetMax = campaign.budget?.max?.toLocaleString() || 0;
  const brandName = campaign.brandProfile?.brandname || campaign.brandUser?.fullname || "Brand";
  const brandLogo = campaign.brandProfile?.logo || campaign.brandUser?.profilePic;

  const startDateStr = campaign.campaignTimeline?.startDate
    ? new Date(campaign.campaignTimeline.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;
  const endDateStr = campaign.campaignTimeline?.endDate
    ? new Date(campaign.campaignTimeline.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  // Requirements from db or split from text
  const requirements = campaign.goals && campaign.goals.length > 0
    ? campaign.goals.slice(0, 3)
    : campaign.additionalRequirements
      ? campaign.additionalRequirements.split(".").filter(Boolean).slice(0, 3)
      : [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 p-5 space-y-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {brandLogo ? (
            <img src={brandLogo} alt={brandName} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex flex-col justify-center items-center font-bold">
              {brandName[0]}
            </div>
          )}
          <div className="flex items-center gap-1">
            <p className="text-xs text-gray-500 font-medium whitespace-nowrap">by {brandName}</p>
            <VerifiedTick user={campaign.brandUser} roleProfile={campaign.brandProfile} size="xs" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isCollaboration ? (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
              Ongoing Collaboration
            </span>
          ) : isApplied ? (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
              Applied
            </span>
          ) : isViewed && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
              Viewed
            </span>
          )}
          <button className="text-gray-300 hover:text-red-500 transition-colors p-1">
            <Heart size={18} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div>
        <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors" onClick={() => onViewDetails(campaign)}>
          {campaign.name}
        </h3>
        {campaign.description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{campaign.description}</p>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {campaign.industry && (
          <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
            {campaign.industry}
          </span>
        )}
        {campaign.platform?.map((p) => (
          <span key={p} className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200 capitalize">
            {p}
          </span>
        ))}
        {campaign.status === "active" && !isCollaboration && (
          <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
            Active
          </span>
        )}
      </div>

      {/* Key Stats Block */}
      <div className="space-y-2 py-3 border-y border-gray-50 text-sm">
        <div className="flex justify-between items-center text-gray-600">
          <div className="flex items-center gap-2"><DollarSign size={15} className="text-gray-400" /> Budget</div>
          <span className="font-semibold text-gray-900">${budgetMin} - ${budgetMax}</span>
        </div>
        <div className="flex justify-between items-center text-gray-600">
          <div className="flex items-center gap-2"><Calendar size={15} className="text-gray-400" /> Duration</div>
          <span className="font-medium text-gray-800 text-xs">{startDateStr} - {endDateStr}</span>
        </div>
        <div className="flex justify-between items-center text-gray-600">
          <div className="flex items-center gap-2"><Users size={15} className="text-gray-400" /> Applicants</div>
          <span className="font-medium text-gray-800 text-xs">{campaign.applicantsCount || 0} applied</span>
        </div>
      </div>

      {/* Requirements Placeholder List */}
      <div className="flex-grow">
        <p className="text-xs font-semibold text-gray-800 mb-2 uppercase tracking-wide">Requirements</p>
        <ul className="space-y-1.5 list-disc list-inside text-sm text-gray-600">
          {requirements.map((req, idx) => (
            <li key={idx} className="truncate">{req}</li>
          ))}
        </ul>
      </div>

      {/* Footer Buttons */}
      <div className="flex gap-2 pt-2 mt-auto">
        <button
          onClick={() => onViewDetails(campaign)}
          className={cn(
            "flex-1 py-2.5 text-sm font-semibold rounded-lg border transition-all",
            isViewed
              ? "bg-gray-50 border-gray-200 text-gray-400"
              : "border-gray-200 text-gray-700 hover:bg-gray-50"
          )}
        >
          {isCollaboration ? "Collaboration Overview" : (isViewed ? "Viewed" : "View Details")}
        </button>

        <button
          onClick={() => isCollaboration ? onViewCollaboration(collaborationId) : (!isApplied && onApply(campaign))}
          disabled={isApplied && !isCollaboration}
          className={cn(
            "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5",
            isCollaboration
              ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200"
              : isApplied
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default"
                : "bg-blue-600 text-white hover:bg-blue-700"
          )}
        >
          {isCollaboration ? (
            <>Collaboration</>
          ) : (
            <>
              {isApplied && <CheckCircle size={14} />}
              {isApplied ? "Applied" : "Apply Now"}
            </>
          )}
        </button>

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
  activeCampaignName
}) => {
  const name = brand.brandname || "Brand";
  const logo = brand.logo;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 p-5 space-y-4 flex flex-col h-full">
      {/* Brand header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {logo ? (
            <img src={logo} alt={name} className="w-14 h-14 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex flex-col items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">
              {name[0]}
            </div>
          )}
          <div className="min-w-0 pt-1">
            <div className="flex items-center gap-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors truncate">
                {name}
              </h3>
              <VerifiedTick user={brand.userDoc} roleProfile={brand} size="xs" />
            </div>
            {brand.description ? (
              <p className="text-sm text-gray-500 line-clamp-2 mt-0.5 leading-snug">{brand.description}</p>
            ) : (
              <p className="text-sm text-gray-500 line-clamp-2 mt-0.5 leading-snug">Leading {brand.industry || "brand"} looking for influencers.</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isCollaboration ? (
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                Collaborating
              </span>
              {activeCampaignName && (
                <span className="text-[9px] font-bold text-indigo-400 uppercase truncate max-w-[110px]" title={activeCampaignName}>
                  via: {activeCampaignName}
                </span>
              )}
            </div>
          ) : isRequested ? (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
              Requested
            </span>
          ) : isViewed && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
              Viewed
            </span>
          )}
          <button className="text-gray-300 hover:text-red-500 transition-colors pt-1">
            <Heart size={18} />
          </button>
        </div>
      </div>

      {brand.industry && (
        <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded border border-gray-200">
          {brand.industry}
        </span>
      )}
      {brand.lookingFor?.slice(0, 2).map((item, idx) => (
        <span key={idx} className="text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded border border-gray-200">
          {item.length > 15 ? item.substring(0, 15) + "..." : item}
        </span>
      ))}

      {/* Stats row */}
      <div className="space-y-2.5 py-3 text-sm flex-grow">
        <div className="flex items-center gap-3 text-gray-600">
          <MapPin size={16} className="text-gray-400" />
          <span className="text-sm font-medium">{brand.address || brand.location || "Location not provided"}</span>
        </div>
        {brand.budgetRange && (
          <div className="flex items-center gap-3 text-gray-600">
            <DollarSign size={16} className="text-gray-400" />
            <span className="text-sm font-medium">
              Avg. list: ${brand.budgetRange.min?.toLocaleString()} – ${brand.budgetRange.max?.toLocaleString()}
            </span>
          </div>
        )}
        <div className="flex items-center gap-3 text-gray-600">
          <Briefcase size={16} className="text-gray-400" />
          <span className="text-sm font-medium pr-1">{brand.activeCampaignsCount || 0} active campaigns</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <TrendingUp size={16} className="text-gray-400" />
          <span className="text-sm font-medium">{(brand.followersCount || 0).toLocaleString()}+ Followers</span>
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onViewProfile(brand)}
          className={cn(
            "flex-1 py-2.5 text-sm font-semibold border rounded-lg transition-colors",
            isViewed
              ? "bg-gray-50 border-gray-200 text-gray-400"
              : "border-gray-200 text-gray-700 hover:bg-gray-50"
          )}
        >
          {isViewed ? "Viewed" : "View Profile"}
        </button>

        <button
          onClick={() => isCollaboration ? onViewCollaboration(collaborationId) : (!isRequested && onSendRequest(brand))}
          disabled={isRequested && !isCollaboration}
          className={cn(
            "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5",
            isCollaboration
              ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200"
              : isRequested
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default"
                : "bg-blue-600 text-white hover:bg-blue-700"
          )}
        >
          {isCollaboration ? (
            <>Collaboration</>
          ) : (
            <>
              {isRequested ? <CheckCircle size={15} /> : <Send size={15} />}
              {isRequested ? "Requested" : "Send Request"}
            </>
          )}
        </button>

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
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
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
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => {
                navigate("/influencer/search/campaigns");
                setPage(1);
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
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading &&
          !error &&
          (activeTab === "campaigns" ? campaigns : brands).length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeTab === "campaigns" ? (
                  <Briefcase size={28} className="text-purple-300" />
                ) : (
                  <Building2 size={28} className="text-purple-300" />
                )}
              </div>
              <h3 className="text-gray-700 font-medium mb-1">
                No {activeTab} found
              </h3>
              <p className="text-sm text-gray-400">
                Try changing your filters or search term
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-3 text-sm text-purple-600 hover:text-purple-800"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

        {/* Campaign cards grid */}
        {!loading && activeTab === "campaigns" && campaigns.length > 0 && (
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
        {!loading && activeTab === "brands" && brands.length > 0 && (
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
            setSelectedBrand(null);
          }}
        />
      )}

    </div>
  );
};

export default SearchExplore;
