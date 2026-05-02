import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useSocket } from '../../context/SocketContext';
import {
  Eye, Heart, Users, Share2, 
  Download, Handshake, Send,
  TrendingUp,
  Calendar
} from 'lucide-react';
import api from '../../services/api';

function BrandDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Data State
  const [analytics, setAnalytics] = useState({
    totalReach: "0",
    avgEngagementRate: "0%",
    activeCampaigns: 0,
    engagementOverview: {
      likes: 0,
      comments: 0,
      shares: 0,
      impressions: 0
    },
    platformStats: {
      instagram: { reach: 0, engagement: 0, posts: 0, followers: 0 },
      youtube: { reach: 0, engagement: 0, posts: 0, followers: 0 },
      tiktok: { reach: 0, engagement: 0, posts: 0, followers: 0 }
    },
    campaignPerformance: [],
    topPerformers: [],
    collaborationCount: 0,
    requestStats: {
      sent: 0,
      received: 0,
      accepted: 0,
      pending: 0,
      total: 0
    },
    totalSpending: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/brands/analytics');
      if (response.data?.success) {
        const data = response.data.data;
        
        // Format values for display (e.g. 2.4M)
        const formatNumber = (num) => {
          if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
          if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
          return num.toString();
        };

        setAnalytics({
          ...data,
          totalSpending: data.totalSpending || 0,
          avgEngagementRate: data.avgEngagementRate + "%"
        });
      }
    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const socket = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    const handleRefresh = (data) => {
      // Refresh analytics for any relevant activity
      if (['collaboration', 'application', 'system', 'escrow_funded', 'payout_released'].includes(data.category || data.type)) {
        fetchAnalytics();
      }
    };

    socket.on('activity_created', handleRefresh);
    socket.on('notification_received', handleRefresh);

    return () => {
      socket.off('activity_created', handleRefresh);
      socket.off('notification_received', handleRefresh);
    };
  }, [socket]);

  // --- CSV Export Logic ---
  const handleExport = () => {
    try {
      if (!analytics) return;

      const headers = ["Metric", "Value"];
      const rows = [
        ["Total Reach", analytics.totalReach],
        ["Engagement Rate", analytics.avgEngagementRate],
        ["Active Campaigns", analytics.activeCampaigns],
        ["Collaborations", analytics.collaborationCount],
        ["Total Requests", analytics.requestStats.total],
        ["Sent Requests", analytics.requestStats.sent],
        ["Received Requests", analytics.requestStats.received],
        ["Accepted Requests", analytics.requestStats.accepted],
        ["Pending Requests", analytics.requestStats.pending],
        ["", ""],
        ["Engagement Breakdown", ""],
        ["Likes", analytics.engagementOverview.likes],
        ["Comments", analytics.engagementOverview.comments],
        ["Shares", analytics.engagementOverview.shares],
        ["Impressions", analytics.engagementOverview.impressions]
      ];

      const csvContent = [headers, ...rows]
        .map(row => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `dashboard_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50/30">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="absolute inset-0 blur-lg bg-blue-600/10 animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1800px] mx-auto pb-10 px-4 md:px-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-8 border-b border-gray-100 pb-8">
        <div>
          <p className="text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">Welcome back, {user?.name || 'Partner'}!</p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Analytics</h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Monitor your campaign performance and platform growth.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select className="bg-white border border-gray-200 rounded-xl pl-10 pr-6 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last Year</option>
            </select>
          </div>
          
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-[#1A1A1A] text-white rounded-xl px-5 py-2.5 text-xs font-bold hover:bg-black transition-all shadow-sm"
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {[
          { label: "Total Spending", value: `$${analytics.totalSpending?.toLocaleString()}`, sub: "All time", icon: <Eye size={22} />, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Engagement Rate", value: analytics.avgEngagementRate, sub: "+2%", icon: <Heart size={22} />, color: "text-red-600", bg: "bg-red-50" },
          { label: "Active Campaigns", value: analytics.activeCampaigns, sub: "Live", icon: <Users size={22} />, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Collaborations", value: analytics.collaborationCount, sub: "Active", icon: <Handshake size={22} />, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Requests", value: analytics.requestStats.total, sub: `${analytics.requestStats.pending} Pending`, icon: <Send size={22} />, color: "text-orange-600", bg: "bg-orange-50" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3.5 ${stat.bg} ${stat.color} rounded-xl`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">{stat.sub}</span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
            <h2 className="text-2xl font-bold text-gray-900">{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* Engagement Overview & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Payments Overview */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900">Campaign Payments</h3>
            <TrendingUp size={18} className="text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mb-8">
            <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
               <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Funds in Escrow</p>
               <h4 className="text-2xl font-black text-gray-900">${(analytics.totalSpending * 0.3).toLocaleString()}</h4>
               <p className="text-[10px] text-gray-500 mt-2 font-medium">Secured for ongoing collaborations</p>
            </div>
            <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Released</p>
               <h4 className="text-2xl font-black text-gray-900">${(analytics.totalSpending * 0.7).toLocaleString()}</h4>
               <p className="text-[10px] text-gray-500 mt-2 font-medium">Successfully paid to influencers</p>
            </div>
          </div>

          <div className="space-y-4">
             <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-2">Recent Transactions</h4>
             {analytics.campaignPerformance?.slice(0, 3).map((item, idx) => (
               <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        <Calendar size={18} />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-gray-900">{item.name}</p>
                        <p className="text-[10px] text-gray-500">Service Payment</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-black text-gray-900">-${item.budget?.toLocaleString()}</p>
                     <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">Completed</p>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Top Creators */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top Performers</h3>
          <div className="space-y-3">
            {analytics.topPerformers.map((performer, idx) => (
              <div 
                key={idx} 
                onClick={() => navigate(`/brand/influencer/${performer.id || 'mock'}`)}
                className="flex items-center justify-between p-3.5 hover:bg-gray-50 rounded-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <img src={performer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(performer.name)}`} alt="" className="w-10 h-10 rounded-lg object-cover shadow-sm" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{performer.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{performer.reach} Earned</p>
                  </div>
                </div>
                <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                  {performer.engagement}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Performance Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Campaign Intelligence</h3>
          <button 
            onClick={() => navigate('/brand/collaborations/all')}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            View All Projects
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-8 py-4">Campaign</th>
                <th className="px-6 py-4">Reach</th>
                <th className="px-6 py-4">Engagement</th>
                <th className="px-6 py-4">ROI</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {analytics.campaignPerformance.map((campaign, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold text-gray-900 text-sm">{campaign.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active</p>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-600">{campaign.reach?.toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <span className="bg-gray-100 px-2 py-0.5 rounded-lg text-[10px] font-bold text-gray-600">{campaign.engagement}%</span>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-emerald-600">{campaign.roi}%</td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-600">${campaign.budget?.toLocaleString()}</td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => navigate(`/brand/campaigns`)}
                      className="text-[10px] font-bold text-gray-900 border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-all"
                    >
                      View Logic
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Statistics */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 ml-1">Channel Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Instagram", color: "text-pink-600", bg: "bg-pink-50/30", data: analytics.platformStats.instagram },
            { name: "YouTube", color: "text-red-600", bg: "bg-red-50/30", data: analytics.platformStats.youtube },
            { name: "TikTok", color: "text-black", bg: "bg-gray-50/50", data: analytics.platformStats.tiktok }
          ].map((platform, idx) => (
            <div key={idx} className={`p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all`}>
              <div className="flex items-center justify-between mb-6">
                <h4 className={`text-sm font-bold uppercase tracking-wider ${platform.color}`}>{platform.name}</h4>
                <Share2 size={16} className="text-gray-300" />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-wider">Posts</span>
                  <span className="font-bold text-gray-900">{platform.data.posts}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-wider">Reach</span>
                  <span className="font-bold text-gray-900">{(platform.data.reach / 1000).toFixed(1)}K</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-wider">Engagement</span>
                  <span className="font-bold text-emerald-600">%{platform.data.engagement}</span>
                </div>
                <div className="pt-2 border-t border-gray-50 mt-2">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Follower Gain</span>
                    <span className="text-xs font-bold text-blue-600">+{platform.data.followers?.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-50 h-1 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-[60%]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default BrandDashboard;