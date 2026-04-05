import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FileText, CheckCircle, Clock, Users,
  Instagram, Youtube, ShieldCheck, Twitter, Linkedin,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';

function BrandDashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Data State
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeCampaigns: 0,
    pendingRequests: 0,
    totalInfluencersContacted: 0,
    totalCampaigns: 0,
    completedCampaigns: 0,
    successRate: 0
  });
  const [influencers, setInfluencers] = useState([]);

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Concurrently fetch all dashboard widgets using allSettled to prevent one failure from breaking everything
        const results = await Promise.allSettled([
          api.get('/brands/dashboard'),
          api.get('/brands/influencers?limit=3'),
          api.get('/brands/activity?limit=3')
        ]);

        const statsResult = results[0];
        const influencersResult = results[1];
        const activitiesResult = results[2];

        // Map Stats Data
        if (statsResult.status === 'fulfilled' && statsResult.value.data?.success) {
          const statsData = statsResult.value.data.data;
          const total = statsData.totalCampaigns || 0;
          const completed = statsData.completedCampaigns || 0;
          const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

          setStats({
            totalRequests: statsData.totalRequests || 0,
            activeCampaigns: statsData.activeCampaigns || 0,
            pendingRequests: statsData.pendingRequests || 0,
            totalInfluencersContacted: statsData.totalInfluencersContacted || 0,
            totalCampaigns: total,
            completedCampaigns: completed,
            successRate: rate
          });
        } else if (statsResult.status === 'rejected') {
          const status = statsResult.reason?.response?.status;
          if (status === 404) {
            setError("Your brand profile was not found. Please complete your profile in settings to see dashboard stats.");
          } else {
            console.error("Dashboard stats error:", statsResult.reason);
          }
        }

        // Map Influencers Data
        if (influencersResult.status === 'fulfilled' && influencersResult.value.data?.success) {
          setInfluencers(influencersResult.value.data.data.influencers || []);
        }

        // Automatically mark activities as read on fetch
        if (activitiesResult.status === 'fulfilled' && activitiesResult.value.data?.success) {
          try {
            // Backend endpoint for marking all as read (if exists) or we could call mark as read for each
            // For now, if the user requested automatic "read on viewing", and we are fetching them, 
            // we should ideally tell the backend they are viewed.
            // Assuming there's a bulk mark as read endpoint or we can implement it.
            // Based on my research, there's router.patch("/activity/:id/read")
            // I'll add a helper to mark all unread ones.
            const unread = activitiesResult.value.data.data.activities?.filter(a => !a.isRead) || [];
            if (unread.length > 0) {
              await Promise.all(unread.map(a => api.patch(`/brands/activity/${a._id}/read`)));
            }
          } catch (activityErr) {
            console.error("Error marking activities as read:", activityErr);
          }
        }

      } catch (err) {
        console.error("Unexpected error in dashboard:", err);
        setError("An unexpected error occurred while loading the dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // UI mapping array for stats
  const displayStats = [
    {
      id: 1,
      title: "Success Rate",
      value: `${stats.successRate}%`,
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      bgClass: "bg-green-50"
    },
    {
      id: 2,
      title: "Active Campaigns",
      value: stats.activeCampaigns,
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      bgClass: "bg-blue-50"
    },
    {
      id: 3,
      title: "Total Campaigns",
      value: stats.totalCampaigns,
      icon: <ShieldCheck className="w-6 h-6 text-indigo-500" />,
      bgClass: "bg-indigo-50"
    },
    {
      id: 4,
      title: "Pending Requests",
      value: stats.pendingRequests,
      icon: <Clock className="w-6 h-6 text-yellow-500" />,
      bgClass: "bg-yellow-50"
    }
  ];

  // Helper function to map platform name to icon
  const getPlatformIcon = (platformName) => {
    const name = platformName?.toLowerCase() || '';
    if (name.includes('instagram')) return <Instagram className="w-4 h-4 mr-1 text-gray-500" />;
    if (name.includes('youtube')) return <Youtube className="w-4 h-4 mr-1 text-gray-500" />;
    if (name.includes('twitter') || name.includes('x')) return <Twitter className="w-4 h-4 mr-1 text-gray-500" />;
    if (name.includes('linkedin')) return <Linkedin className="w-4 h-4 mr-1 text-gray-500" />;
    // default
    return <Users className="w-4 h-4 mr-1 text-gray-500" />;
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1800px] mx-auto pb-10">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Welcome, {user?.name || "Brand Manager"}!
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening with your campaigns today.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Stats Cards Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-gray-200 shrink-0"></div>
              <div className="flex flex-col w-full py-1">
                <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-10"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayStats.map((stat) => (
            <div key={stat.id} className="bg-white rounded-xl shadow-sm border border-gray-100/60 p-5 flex flex-col justify-center relative overflow-hidden transition-all hover:shadow-md">
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
          ))}
        </div>
      )}

      {/* Recommended Influencers Section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Recommended Influencers</h2>
          <button
            onClick={() => navigate('/brand/search')}
            className="text-blue-600 border border-blue-200 hover:border-blue-600 hover:bg-blue-50 transition-colors font-medium text-sm rounded-full px-5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
            View All
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-center animate-pulse">
                <div className="w-16 h-16 rounded-full bg-gray-200 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-28 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24 mb-6"></div>
                <div className="w-full h-10 bg-gray-200 rounded-full mt-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {influencers.length > 0 ? (
              influencers.map((influencer) => {
                const mainPlatform = influencer.platforms && influencer.platforms.length > 0 ? influencer.platforms[0] : null;
                const followers = mainPlatform?.followers ? `${(mainPlatform.followers / 1000).toFixed(1)}k followers` : '';

                return (
                  <div key={influencer._id} className="bg-white rounded-xl shadow-sm border border-gray-100/60 p-6 flex flex-col items-center text-center transition-all hover:shadow-md">
                    <img
                      src={influencer.profilePicture || `https://ui-avatars.com/api/?name=${influencer.username}&background=random`}
                      alt={influencer.username}
                      className="w-16 h-16 rounded-full object-cover mb-4 ring-[3px] ring-gray-50"
                    />

                    <div className="flex items-center gap-1.5 mb-1.5">
                      <h3 className="text-[15px] font-bold text-gray-900">{influencer.username}</h3>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#e8f5e9] text-[#2e7d32]">
                        <ShieldCheck className="w-3 h-3 mr-0.5" />
                        Verified
                      </span>
                    </div>

                    <div className="flex flex-col items-center text-[13px] text-gray-500 space-y-0.5 mb-5 w-full">
                      <div className="flex items-center">
                        {getPlatformIcon(mainPlatform?.name)}
                        <span className="capitalize">{mainPlatform?.name || 'Social Media'}</span>
                      </div>
                      {followers && <span>{followers}</span>}
                      {influencer.category && <span className="capitalize">{influencer.category}</span>}
                    </div>

                    <button
                      onClick={() => navigate(`/brand/influencer/${influencer._id}`)}
                      className="w-full bg-[#1A73E8] hover:bg-[#1557B0] text-white text-[13px] font-medium rounded-full py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:ring-offset-2 mt-auto">
                      View Profile
                    </button>
                  </div>
                )
              })
            ) : (
              <div className="col-span-1 md:col-span-3 text-center py-10 bg-white rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500">No recommended influencers found at this time.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Activity Section Removed as per request */}
    </div>
  );
}

export default BrandDashboard;