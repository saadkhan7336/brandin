import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, CheckCircle, Clock, Users,
  Instagram, Youtube, ShieldCheck, Twitter, Linkedin,
  Search, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import api from '../../services/api';

function Influencers() {
  const navigate = useNavigate();

  // --- Dashboard Stats State (from old dashboard) ---
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeCampaigns: 0,
    pendingRequests: 0,
    totalInfluencersContacted: 0,
    totalCampaigns: 0,
    completedCampaigns: 0,
    successRate: 0
  });

  // --- Influencer Search State (from search page) ---
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

  // UI States
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingInfluencers, setIsLoadingInfluencers] = useState(true);

  // --- Fetch Dash Stats ---
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

          setStats({
            ...statsData,
            successRate: rate
          });
        }
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // --- Fetch Influencers (Search) ---
  const fetchInfluencers = useCallback(async (currentPage = 1) => {
    try {
      setIsLoadingInfluencers(true);

      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 12
      });

      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.platform) queryParams.append('platform', filters.platform);
      if (filters.minFollowers) queryParams.append('minFollowers', filters.minFollowers);

      const response = await api.get(`/brands/influencers?${queryParams.toString()}`);

      if (response.data?.success) {
        setInfluencers(response.data.data.influencers || []);
        setPagination({
          total: response.data.data.total || 0,
          page: response.data.data.page || 1,
          pages: response.data.data.pages || 1
        });
      }
    } catch (err) {
      console.error("Error fetching influencers:", err);
    } finally {
      setIsLoadingInfluencers(false);
    }
  }, [filters]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchInfluencers(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters.search, filters.category, filters.platform, filters.minFollowers, fetchInfluencers]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      platform: '',
      minFollowers: '',
      search: ''
    });
  };

  const isFilterApplied = filters.search !== '' || filters.category !== '' || filters.platform !== '' || filters.minFollowers !== '';

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchInfluencers(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPlatformIcon = (platformName) => {
    const name = platformName?.toLowerCase() || '';
    if (name.includes('instagram')) return <Instagram className="w-4 h-4 mr-1 text-gray-500" />;
    if (name.includes('youtube')) return <Youtube className="w-4 h-4 mr-1 text-gray-500" />;
    if (name.includes('twitter') || name.includes('x')) return <Twitter className="w-4 h-4 mr-1 text-gray-500" />;
    if (name.includes('linkedin')) return <Linkedin className="w-4 h-4 mr-1 text-gray-500" />;
    return <Users className="w-4 h-4 mr-1 text-gray-500" />;
  };

  const displayStats = [
    { id: 1, title: "Success Rate", value: `${stats.successRate}%`, icon: <CheckCircle className="w-6 h-6 text-green-500" />, bgClass: "bg-green-50" },
    { id: 2, title: "Active Campaigns", value: stats.activeCampaigns, icon: <FileText className="w-6 h-6 text-blue-500" />, bgClass: "bg-blue-50" },
    { id: 3, title: "Total Campaigns", value: stats.totalCampaigns, icon: <ShieldCheck className="w-6 h-6 text-indigo-500" />, bgClass: "bg-indigo-50" },
    { id: 4, title: "Pending Requests", value: stats.pendingRequests, icon: <Clock className="w-6 h-6 text-yellow-500" />, bgClass: "bg-yellow-50" }
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1800px] mx-auto pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Influencers</h1>
        <p className="text-gray-500 mt-1">Manage and discover influencers for your campaigns.</p>
      </div>

      {/* Stats Cards (Old Dashboard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoadingStats ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-gray-200 shrink-0"></div>
              <div className="flex flex-col w-full py-1">
                <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-10"></div>
              </div>
            </div>
          ))
        ) : (
          displayStats.map(stat => (
            <div key={stat.id} className="bg-white rounded-xl shadow-sm border border-gray-100/60 p-5 flex flex-col justify-center transition-all hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bgClass}`}>
                  {stat.icon}
                </div>
                <div className="flex flex-col">
                  <p className="text-[13px] text-gray-500 font-medium mb-0.5">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 leading-none">{stat.value}</h3>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Recommended Influencers Preview (Optional top section) */}
      {!filters.search && !filters.category && !filters.platform && (
        <div className="mb-2">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recommended Influencers</h2>
            {/* Using the grid below for all results, but keeping the title for visual context */}
        </div>
      )}

      {/* Search & Filter Section (Merged) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Search Keywords</label>
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search by name, category..."
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full bg-white border border-gray-200 text-gray-700 text-[14px] rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-[#1A73E8] block p-2.5 pl-10 focus:outline-none transition-colors"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full bg-white border border-gray-200 text-gray-700 text-[14px] rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:outline-none p-2.5"
            >
              <option value="">All Categories</option>
              <option value="Health">Health</option>
              <option value="Technology">Technology</option>
              <option value="Food">Food</option>
              <option value="Beauty">Beauty</option>
              <option value="Fitness">Fitness</option>
              <option value="Travel">Travel</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Fashion">Fashion</option>
              <option value="Gaming">Gaming</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Platform</label>
            <select
              name="platform"
              value={filters.platform}
              onChange={handleFilterChange}
              className="w-full bg-white border border-gray-200 text-gray-700 text-[14px] rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:outline-none p-2.5"
            >
              <option value="">All Platforms</option>
              <option value="Instagram">Instagram</option>
              <option value="Youtube">Youtube</option>
              <option value="Twitter">Twitter</option>
              <option value="Linkedin">LinkedIn</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Followers</label>
            <select
              name="minFollowers"
              value={filters.minFollowers}
              onChange={handleFilterChange}
              className="w-full bg-white border border-gray-200 text-gray-700 text-[14px] rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:outline-none p-2.5"
            >
              <option value="">Any</option>
              <option value="10000">10k+</option>
              <option value="50000">50k+</option>
              <option value="100000">100k+</option>
              <option value="500000">500k+</option>
              <option value="1000000">1M+</option>
            </select>
          </div>
        </div>

        {isFilterApplied && (
          <div className="mt-4 flex justify-end border-t border-gray-50 pt-4">
            <button 
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider"
            >
              <X size={14} strokeWidth={3} />
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Influencers Results Grid */}
      {isLoadingInfluencers ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-center animate-pulse shadow-sm">
              <div className="w-16 h-16 rounded-full bg-gray-200 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-28 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-24 mb-6"></div>
              <div className="w-full h-[38px] bg-gray-200 rounded-full mt-auto"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {influencers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {influencers.map(influencer => {
                const mainPlatform = influencer.platforms?.[0];
                const followers = mainPlatform?.followers >= 1000 ? `${(mainPlatform.followers / 1000).toFixed(0)}k` : mainPlatform?.followers || 0;

                return (
                  <div key={influencer._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center transition-all hover:shadow-md">
                    <img
                      src={influencer.profilePicture || `https://ui-avatars.com/api/?name=${influencer.username}&background=random`}
                      alt={influencer.username}
                      className="w-[72px] h-[72px] rounded-full object-cover mb-3.5 ring-[3px] ring-gray-50"
                    />
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <h3 className="text-[15px] font-bold text-gray-900">{influencer.username}</h3>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#e8f5e9] text-[#2e7d32]">
                        <ShieldCheck className="w-3 h-3 mr-0.5" />
                        Verified
                      </span>
                    </div>
                    <div className="flex flex-col items-center text-[12px] text-gray-500 space-y-0.5 mb-5 w-full">
                      <div className="flex items-center">
                        {getPlatformIcon(mainPlatform?.name)}
                        <span className="capitalize">{mainPlatform?.name || 'Social Media'}</span>
                      </div>
                      {followers !== 0 && <span>{followers} followers</span>}
                      {influencer.category && <span className="capitalize">{influencer.category}</span>}
                    </div>
                    <button
                      onClick={() => navigate(`/brand/influencer/${influencer._id}`)}
                      className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white text-[13px] font-medium rounded-full py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 mt-auto"
                    >
                      View Profile
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500">No influencers found matching your criteria.</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg">
                Page {pagination.page} of {pagination.pages}
              </div>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Influencers;
