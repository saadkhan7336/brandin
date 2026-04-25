import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Star, ChevronRight, AlertCircle,
  Inbox, Award, ClipboardList, CheckCircle2,
  Clock, Briefcase, Send, Download
} from 'lucide-react';
import api from '../../services/api';
import collaborationService from '../../services/collaborationService';
import { io } from 'socket.io-client';
import './InfluencerDashboard.css';

const ENDPOINT = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function InfluencerDashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Data State
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); 

  const fetchDashboardData = async (days = selectedPeriod) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(`/influencers/dashboard?days=${days}`);
      if (response.data?.success) {
        setDashboardData(response.data.data);
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        setError("Your influencer profile was not found. Please complete your profile in settings.");
      } else {
        console.error("Dashboard fetch error:", err);
        setError("An error occurred while loading the dashboard.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(selectedPeriod);
  }, [selectedPeriod]);

  useEffect(() => {
    const socket = io(ENDPOINT, {
      withCredentials: true,
    });

    if (user) {
      socket.emit('setup', user);
      
      socket.on('activity_created', (data) => {
        // Refresh dashboard for any relevant activity
        if (['collaboration', 'application', 'system'].includes(data.category)) {
          fetchDashboardData(selectedPeriod);
        }
      });
    }

    return () => {
      socket.off('activity_created');
      socket.disconnect();
    };
  }, [user, selectedPeriod]);

  // ── Accept / Decline handlers ──────────────────────────────
  const handleAccept = async (requestId) => {
    try {
      setActionLoading(requestId);
      const response = await collaborationService.acceptRequest(requestId);
      if (response.success) {
        // Refresh entire dashboard to get the new collaboration record and updated stats
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to accept request:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      setActionLoading(requestId);
      const response = await collaborationService.rejectRequest(requestId);
      if (response.success) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to reject request:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // ── Helpers ────────────────────────────────────────────────
  const firstName = user?.fullname?.split(' ')[0] || user?.name?.split(' ')[0] || 'Influencer';

  const formatBudget = (budget) => {
    if (!budget) return '—';
    if (typeof budget === 'string') return budget.startsWith('$') ? budget : `$${budget}`;
    return `$${Number(budget).toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'inf-dash__status--active';
      case 'in_progress': return 'inf-dash__status--progress';
      case 'review': return 'inf-dash__status--review';
      case 'completed': return 'inf-dash__status--completed';
      case 'cancelled': 
      case 'rejected': return 'inf-dash__status--cancelled';
      case 'accepted': return 'inf-dash__status--completed';
      case 'pending': return 'inf-dash__status--review';
      default: return '';
    }
  };

  // ── Loading Skeleton ──────────────────────────────────────
  if (isLoading && !dashboardData) {
    return (
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="animate-pulse space-y-8">
           <div className="h-10 bg-gray-200 rounded w-1/4"></div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
             {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-gray-200 rounded-2xl"></div>)}
           </div>
           <div className="h-32 bg-gray-200 rounded-2xl"></div>
           <div className="h-64 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const performance = dashboardData?.performance || {};
  const analytics = dashboardData?.analytics || {};
  const allRequests = dashboardData?.allRequests || [];
  const growth = analytics.growth || {};

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toLocaleString() || '0';
  };

  const renderGrowthBadge = (value) => {
    const isPositive = value >= 0;
    return (
      <span className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${
        isPositive ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'
      }`}>
        {isPositive ? '+' : ''}{value}%
      </span>
    );
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* ── Header ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Analytics & Insights</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Track your performance and earnings</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer"
          >
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>This Year</option>
          </select>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2 hover:bg-gray-50 transition-all shadow-sm">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-2 text-sm font-bold">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* ── Top Metric Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-40">
           <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                <Star size={20} />
              </div>
              {renderGrowthBadge(growth.reach || 0)}
           </div>
           <div>
             <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Reach</p>
             <h3 className="text-3xl font-black text-gray-900 tracking-tight">{formatNumber(analytics.totalReach || 0)}</h3>
           </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-40">
           <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                <Award size={20} />
              </div>
              {renderGrowthBadge(growth.engagement || 0)}
           </div>
           <div>
             <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Engagement Rate</p>
             <h3 className="text-3xl font-black text-gray-900 tracking-tight">{analytics.engagementRate || '0.0'}%</h3>
           </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-40">
           <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                <CheckCircle2 size={20} />
              </div>
              {renderGrowthBadge(growth.tasks || 0)}
           </div>
           <div>
             <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tasks Completed</p>
             <h3 className="text-3xl font-black text-gray-900 tracking-tight">
               {analytics.tasksCompleted?.completed || 0}
               <span className="text-xl text-gray-400">/{analytics.tasksCompleted?.total || 0}</span>
             </h3>
           </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-40">
           <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                <Briefcase size={20} />
              </div>
              {renderGrowthBadge(growth.collaborations || 0)}
           </div>
           <div>
             <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Collaborations</p>
             <h3 className="text-3xl font-black text-gray-900 tracking-tight">{analytics.collaborationCount || 0}</h3>
           </div>
        </div>
      </div>

      {/* ── Performance Overview ──────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Average Rating</div>
            <div className="text-2xl font-black text-violet-600 flex items-center gap-2">
              <Star size={24} className="fill-current text-violet-600" />
              {performance.averageRating || '0.0'}
            </div>
          </div>
        </div>
        <div className="bg-[#fdfde8] border border-yellow-100 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Completion Rate</div>
            <div className="text-2xl font-black text-yellow-600 flex items-center gap-2">
              <CheckCircle2 size={24} />
              {performance.completionRate || '0%'}
            </div>
          </div>
        </div>
        <div className="bg-[#fff1f2] border border-rose-100 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Avg. Response Time</div>
            <div className="text-2xl font-black text-rose-600 flex items-center gap-2">
              <Clock size={24} />
              {performance.averageResponseTime || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Dual Panel Layout ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* ── LEFT COLUMN (Engagement + Table) ── */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Engagement Overview */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 mb-6">Engagement Overview</h3>
            <div className="space-y-6">
              {[
                { label: 'Likes', value: analytics.engagementOverview?.likes || 0 },
                { label: 'Comments', value: analytics.engagementOverview?.comments || 0 },
                { label: 'Shares', value: analytics.engagementOverview?.shares || 0 },
                { label: 'Impressions', value: analytics.engagementOverview?.impressions || 0 },
              ].map((stat, i) => {
                const maxVal = Math.max(
                  analytics.engagementOverview?.impressions || 100, 
                  analytics.engagementOverview?.likes || 10,
                  100
                );
                const percentage = (stat.value / maxVal) * 100;
                return (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                      <span className="flex items-center gap-2"><Star size={12}/>{stat.label}</span>
                      <span className="text-gray-900">{stat.value.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min(percentage, 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Collaboration Performance Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-900">Collaboration Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Brand</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Reach</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Engagement</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Earnings</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Deliverables</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {analytics.collaborationPerformance?.length > 0 ? analytics.collaborationPerformance.map((collab, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => navigate(`/influencer/collaboration/${collab.id}`)}>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900">{collab.brand}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-600">{formatNumber(collab.reach)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">{collab.engagement}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-emerald-600">{formatBudget(collab.earnings)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-600">{collab.deliverablesCount} posts</span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/influencer/collaboration/${collab.id}`); }} 
                          className="text-xs font-bold flex flex-row items-center justify-center text-gray-700 border border-gray-200 bg-white px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-sm font-medium text-gray-400 italic">No collaboration records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN (Brands + Requests Sidebar) ── */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          {/* Top Brands */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
            <h3 className="text-base font-bold text-gray-900 mb-6">Top Brands</h3>
            <div className="space-y-5">
              {analytics.topBrands?.length > 0 ? analytics.topBrands.map((brand, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-blue-500/20">
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 shrink-0 rounded-xl overflow-hidden border border-gray-100">
                    <img src={brand.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}`} alt={brand.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{brand.name}</h4>
                    <p className="text-xs font-medium text-gray-500 truncate">{formatBudget(brand.earnings)} earned</p>
                  </div>
                  <div className="text-xs font-bold bg-gray-50 text-gray-600 px-2.5 py-1 rounded-lg border border-gray-100 shrink-0">
                    {brand.rate}%
                  </div>
                </div>
              )) : (
                <div className="text-sm text-gray-400 font-medium py-8 text-center italic border border-dashed border-gray-100 rounded-xl">No active brands yet</div>
              )}
            </div>
          </div>

          {/* Pending Requests Hub */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex-1">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                 <Inbox size={18} className="text-blue-500" />
                 Pending Requests
               </h3>
               <button onClick={() => navigate('/influencer/requests')} className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">
                 View All
               </button>
             </div>

             <div className="flex flex-col gap-4">
                {allRequests.filter(req => req.status === 'pending').length > 0 ? allRequests.filter(req => req.status === 'pending').slice(0, 4).map(request => (
                   <div 
                     key={request._id} 
                     onClick={() => navigate('/influencer/requests')}
                     className="border border-gray-100 bg-[#f8fafc] rounded-xl p-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
                   >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-bold text-gray-900">{request.campaign?.name || 'Collaboration'}</h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md border border-orange-100">
                          Pending
                        </span>
                      </div>
                      <p className="text-xs font-medium text-gray-500 mb-3">{request.brandDetails?.fullname || 'Brand'}</p>
                      
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-emerald-600">{formatBudget(request.proposedBudget)}</span>
                         {request.type === 'received' && (
                           <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                              <button 
                                onClick={() => handleAccept(request._id)}
                                disabled={actionLoading === request._id}
                                className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                              >
                                {actionLoading === request._id ? '...' : 'Accept'}
                              </button>
                              <button 
                                onClick={() => handleDecline(request._id)}
                                disabled={actionLoading === request._id}
                                className="text-xs font-bold bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                              >
                                Decline
                              </button>
                           </div>
                         )}
                      </div>
                   </div>
                )) : (
                  <div className="text-sm text-gray-400 font-medium py-8 text-center italic border border-dashed border-gray-100 rounded-xl">No pending requests</div>
                )}
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default InfluencerDashboard;
