import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Star, ChevronRight, AlertCircle,
  Inbox, Award, ClipboardList, CheckCircle2,
  Clock, Briefcase, Send, Download
} from 'lucide-react';
import api from '../../services/api';
import collaborationService from '../../services/collaborationService';
import paymentService from '../../services/paymentService';
import { useSocket } from '../../context/SocketContext';
import { toast } from 'sonner';
import './InfluencerDashboard.css';

const ENDPOINT = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function InfluencerDashboard() {
  const { user } = useSelector((state) => state.auth);
  console.log("InfluencerDashboard User State:", {
    id: user?._id,
    stripeAccountId: user?.stripeAccountId,
    stripeOnboardingComplete: user?.stripeOnboardingComplete
  });
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

  const socket = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    const handleRefresh = (data) => {
      // Refresh dashboard for any relevant activity
      if (['collaboration', 'application', 'system', 'escrow_funded', 'payout_released'].includes(data.category || data.type)) {
        fetchDashboardData(selectedPeriod);
      }
    };

    socket.on('activity_created', handleRefresh);
    socket.on('notification_received', handleRefresh);

    return () => {
      socket.off('activity_created', handleRefresh);
      socket.off('notification_received', handleRefresh);
    };
  }, [socket, selectedPeriod]);

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

  const handleOnboardStripe = async () => {
    try {
      const res = await paymentService.onboardConnect();
      // res = ApiResponse: { statusCode, data: { url }, ... } OR direct { url }
      const url = res?.data?.url || res?.url;
      if (url) {
        window.location.href = url;
      } else {
        console.error("Onboard response shape:", res);
        toast.error("Onboarding link not received. Please try again.");
      }
    } catch (err) {
      console.error("Stripe onboard error:", err);
      toast.error(err?.message || "Failed to start onboarding");
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

      {(!user?.stripeAccountId || !user?.stripeOnboardingComplete) && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16 pointer-events-none"></div>
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
               <Briefcase size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Set up your payouts to get paid</h2>
              <p className="text-blue-100 text-sm font-medium opacity-90 max-w-md">Connect your Stripe account to receive secure escrow payments from brands automatically.</p>
            </div>
          </div>
          
          <button 
            onClick={handleOnboardStripe}
            className="bg-white text-blue-600 px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-blue-50 transition-all shadow-lg active:scale-95 shrink-0 relative z-10"
          >
            Connect Stripe
          </button>
        </div>
      )}

      {/* ── Top Metric Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-40">
           <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                <Award size={20} />
              </div>
              {renderGrowthBadge(growth.earnings || 0)}
           </div>
           <div>
             <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Earnings</p>
             <h3 className="text-3xl font-black text-gray-900 tracking-tight">{formatBudget(analytics.totalEarnings || 0)}</h3>
             <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">All time: {formatBudget(analytics.allTimeEarnings || 0)}</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
      </div>

      {/* ── Dual Panel Layout ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* ── LEFT COLUMN (Engagement + Table) ── */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Payment Overview */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-gray-900">Payment Overview</h3>
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-xs font-bold">
                 <CheckCircle2 size={14} />
                 Verified Payouts
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Available for Payout</p>
                <h4 className="text-2xl font-black text-gray-900">{formatBudget(analytics.availablePayout || 0)}</h4>
                <p className="text-[10px] text-gray-500 mt-2 font-medium">Ready to be transferred to your bank</p>
              </div>
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending Clearance</p>
                <h4 className="text-2xl font-black text-gray-400">{formatBudget(analytics.pendingClearance || 0)}</h4>
                <p className="text-[10px] text-gray-500 mt-2 font-medium">Currently in verification/escrow</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Recent Activity</h4>
              {analytics.recentTransactions?.length > 0 ? analytics.recentTransactions.map((transaction, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
                      <img src={transaction.brandPic || `https://ui-avatars.com/api/?name=Brand`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{transaction.campaignName}</p>
                      <p className="text-[10px] font-medium text-gray-400">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-emerald-600">+{formatBudget(transaction.amount)}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">{transaction.status}</p>
                  </div>
                </div>
              )) : (
                <p className="text-xs text-gray-500">No recent transactions.</p>
              )}
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
                    <p className="text-xs font-medium text-gray-500 truncate">{formatBudget(brand.totalSpending)} spent</p>
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
