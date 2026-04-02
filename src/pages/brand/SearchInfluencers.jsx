import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, ShieldCheck, Instagram, Youtube, Twitter, Linkedin, Users,
  AlertCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import api from '../../services/api.js';

function SearchInfluencers() {
  // Filter States
  const [filters, setFilters] = useState({
    category: '',
    platform: '',
    minFollowers: '',
    search: ''
  });

  // Data States
  const [influencers, setInfluencers] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  });

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInfluencers = useCallback(async (currentPage = 1) => {
    try {
      setIsLoading(true);
      setError(null);

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
      setError("Failed to load influencers. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Debounced fetch when filters change
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchInfluencers(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [filters.search, filters.category, filters.platform, filters.minFollowers]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchClick = () => {
    fetchInfluencers(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchInfluencers(newPage, false); // Fetch without resetting filters or triggering debounce
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Helper function to map platform name to dynamic icon
  const getPlatformIcon = (platformName) => {
    const name = platformName?.toLowerCase() || '';
    if (name.includes('instagram')) return <Instagram className="w-[14px] h-[14px] mr-1 text-gray-500" />;
    if (name.includes('youtube')) return <Youtube className="w-[14px] h-[14px] mr-1 text-gray-500" />;
    if (name.includes('twitter') || name.includes('x')) return <Twitter className="w-[14px] h-[14px] mr-1 text-gray-500" />;
    if (name.includes('linkedin')) return <Linkedin className="w-[14px] h-[14px] mr-1 text-gray-500" />;
    return <Users className="w-[14px] h-[14px] mr-1 text-gray-500" />;
  };

  return (
    <div className="flex flex-col max-w-[1200px] mx-auto w-full pb-10">

      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Find the Perfect Influencers for Your Brand
        </h1>
        <p className="text-gray-500 mt-1">
          Search and connect with top influencers to boost your campaigns.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start mb-6">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">

          <div className="w-full md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Search Keywords</label>
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search by name, category or bio..."
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full bg-white border border-gray-200 text-gray-700 text-[14px] rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-[#1A73E8] block p-2.5 pl-10 focus:outline-none transition-colors"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="w-full">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Category</label>
            <div className="relative">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full appearance-none bg-white border border-gray-200 text-gray-700 text-[14px] rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-[#1A73E8] block p-2.5 pr-8 focus:outline-none transition-colors"
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="w-full">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Platform</label>
            <div className="relative">
              <select
                name="platform"
                value={filters.platform}
                onChange={handleFilterChange}
                className="w-full appearance-none bg-white border border-gray-200 text-gray-700 text-[14px] rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-[#1A73E8] block p-2.5 pr-8 focus:outline-none transition-colors"
              >
                <option value="">All Platforms</option>
                <option value="Instagram">Instagram</option>
                <option value="Youtube">Youtube</option>
                <option value="Twitter">Twitter</option>
                <option value="Linkedin">LinkedIn</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="w-full">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Followers</label>
            <div className="relative">
              <select
                name="minFollowers"
                value={filters.minFollowers}
                onChange={handleFilterChange}
                className="w-full appearance-none bg-white border border-gray-200 text-gray-700 text-[14px] rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-[#1A73E8] block p-2.5 pr-8 focus:outline-none transition-colors"
              >
                <option value="">Any</option>
                <option value="10000">10k+</option>
                <option value="50000">50k+</option>
                <option value="100000">100k+</option>
                <option value="500000">500k+</option>
                <option value="1000000">1M+</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="w-full mt-4 md:mt-0">
            <button
              onClick={handleSearchClick}
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white py-2.5 rounded-lg flex items-center justify-center font-medium text-[15px] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2"
            >
              <Search className="w-[18px] h-[18px] mr-2" />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      {!isLoading && !error && (
        <h2 className="text-[15px] font-semibold text-gray-800 mb-4 px-1">
          Found {pagination.total} Influencers
        </h2>
      )}

      {/* Influencers Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-center animate-pulse shadow-sm">
              <div className="w-16 h-16 rounded-full bg-gray-200 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-28 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24 mb-6"></div>
              <div className="w-full h-[38px] bg-gray-200 rounded-full mt-auto"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {influencers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {influencers.map((influencer) => {
                const mainPlatform = influencer.platforms && influencer.platforms.length > 0 ? influencer.platforms[0] : null;
                const followersCount = mainPlatform?.followers || 0;
                let followersString = followersCount >= 1000
                  ? `${(followersCount / 1000).toFixed(0)}k followers`
                  : `${followersCount} followers`;

                return (
                  <div key={influencer._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center transition-all hover:shadow-md">
                    <img
                      src={influencer.profilePicture || `https://ui-avatars.com/api/?name=${influencer.username}&background=random`}
                      alt={influencer.username}
                      className="w-[72px] h-[72px] rounded-full object-cover mb-3.5 ring-[3px] ring-gray-50"
                    />

                    <div className="flex items-center gap-1.5 mb-1.5">
                      <h3 className="text-[15px] font-bold text-gray-900">{influencer.username}</h3>
                      {/* Assumed true or driven by a verified property if it exists. Replicating the design */}
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
                      {followersCount > 0 && <span>{followersString}</span>}
                      {influencer.category && <span className="capitalize">{influencer.category}</span>}
                      {influencer.minPrice > 0 && (
                        <span className="text-[#1A73E8] font-semibold mt-1">
                          Starts from ${influencer.minPrice}
                        </span>
                      )}
                    </div>

                    <button className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white text-[13px] font-medium rounded-full py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 mt-auto">
                      View Profile
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No influencers found</h3>
              <p className="text-gray-500 text-center max-w-md">
                We couldn't find any influencers matching your current filters. Try adjusting your category or platform choices.
              </p>
              <button
                onClick={() => setFilters({ category: '', platform: '', minFollowers: '' })}
                className="mt-6 text-blue-600 font-medium hover:underline focus:outline-none"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg">
                Page {pagination.page} of {pagination.pages}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
}

export default SearchInfluencers;
