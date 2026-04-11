import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, NavLink } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Loader2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  Inbox
} from 'lucide-react';
import { 
  setLoading, 
  setError, 
  setRequests, 
  setFilters, 
  updateRequestInState
} from '../../redux/slices/collaborationSlice';
import collaborationService from '../../services/collaborationService';
import InfluencerRequestCard from '../../components/influencer/InfluencerRequestCard';
import ApplyCampaignModal from '../../components/layout/influencer/ApplyCampaignModal';

const InfluencerRequests = () => {
  const dispatch = useDispatch();
  const { type, status } = useParams();
  const { requests, loading, error, filters, total, page, pages, counts } = useSelector(
    (state) => state.collaboration
  );

  const [localSearch, setLocalSearch] = useState(filters.search);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [resendingRequest, setResendingRequest] = useState(null);

  // Sync URL params to Redux filters
  useEffect(() => {
    if (type && (type !== filters.type || status !== filters.status)) {
      dispatch(setFilters({ type, status: status || 'all', page: 1 }));
    }
  }, [type, status, dispatch, filters.type, filters.status]);

  const fetchRequests = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      
      const cleanFilters = { ...filters };
      if (cleanFilters.status === 'all') delete cleanFilters.status;
      if (cleanFilters.platform === 'all') delete cleanFilters.platform;

      const response = await collaborationService.getRequests(cleanFilters);
      if (response.success) {
        dispatch(setRequests(response.data));
      }
    } catch (err) {
      dispatch(setError(err.message || 'Failed to fetch requests'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, filters]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Handle Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({ search: localSearch, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, dispatch]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      dispatch(setFilters({ page: newPage }));
    }
  };

  const handleAccept = async (id) => {
    try {
      const response = await collaborationService.acceptRequest(id);
      if (response.success) {
        dispatch(updateRequestInState({ _id: id, status: 'accepted' }));
      }
    } catch (err) {
      console.error('Failed to accept request:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await collaborationService.rejectRequest(id);
      if (response.success) {
        dispatch(updateRequestInState({ _id: id, status: 'rejected' }));
      }
    } catch (err) {
      console.error('Failed to reject request:', err);
    }
  };

  const handleResend = (request) => {
    setResendingRequest(request);
  };

  const mainTabs = [
    { id: 'sent', label: 'Requests Sent', count: counts.sent },
    { id: 'received', label: 'Requests Received', count: counts.received },
  ];

  const statusTabs = [
    { id: 'all', label: 'All', count: total }, 
    { id: 'pending', label: 'Pending', count: null },
    { id: 'accepted', label: 'Accepted', count: null },
    { id: 'rejected', label: 'Rejected', count: null },
  ];

  return (
    <div className="w-full max-w-[1800px] mx-auto pb-10 px-4 md:px-8">
      {/* Header */}
      <div className="mb-8 pt-6">
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
          Collaboration Requests
        </h1>
        <p className="text-gray-500 mt-1 font-medium text-[15px]">
          Manage and track all collaboration requests
        </p>
      </div>

      {/* Main Category Tabs */}
      <div className="flex items-center gap-10 border-b border-gray-200 mb-8 overflow-x-auto scrollbar-hide">
        {mainTabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={`/influencer/requests/${tab.id}`}
            className={({ isActive }) => `pb-4 text-[14px] font-bold transition-all relative whitespace-nowrap px-1 flex items-center gap-2 ${
              isActive
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-[11px] font-semibold ${filters.type === tab.id ? 'text-blue-600' : 'text-gray-400'}`}>
                {tab.count}
              </span>
            )}
            {filters.type === tab.id && (
              <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-blue-600 rounded-t-full" />
            )}
          </NavLink>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 text-red-700 mb-6 font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Search & Secondary Filters Container */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.03)] border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-[15px] placeholder:text-gray-400"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          {/* Filter Button */}
          <div className="relative">
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`flex items-center gap-2 px-5 py-3 border rounded-xl transition-all text-[14px] font-bold shadow-sm ${
                showFilterMenu || filters.platform !== 'all'
                  ? 'border-blue-200 bg-blue-50 text-blue-600'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
              {filters.platform !== 'all' && (
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              )}
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-[60] animate-in fade-in zoom-in duration-200">
                <div className="px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">
                  Platform
                </div>
                {['all', 'instagram', 'youtube', 'tiktok', 'twitter'].map((plat) => (
                  <button
                    key={plat}
                    onClick={() => {
                      dispatch(setFilters({ platform: plat, page: 1 }));
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-[13px] font-bold capitalize transition-colors ${
                      filters.platform === plat 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {plat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status Sub-Tabs */}
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
          {statusTabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={`/influencer/requests/${type || filters.type}/${tab.id}`}
              className={({ isActive }) => `px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={`text-[11px] font-bold ${
                  filters.status === tab.id ? 'text-blue-500' : 'text-gray-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Request List */}
      <div className="space-y-4 min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-9 h-9 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 font-bold text-[15px]">Loading requests...</p>
          </div>
        ) : requests.length > 0 ? (
          <>
            <div className="space-y-4">
              {requests.map((request) => (
                <InfluencerRequestCard 
                  key={request._id} 
                  request={request}
                  type={filters.type}
                  onAccept={() => handleAccept(request._id)}
                  onReject={() => handleReject(request._id)}
                  onResend={() => handleResend(request)}
                />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-2 border border-gray-200 rounded-lg enabled:hover:bg-gray-50 transition-colors disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-gray-700">
                    Page {page}
                  </span>
                  <span className="text-[14px] font-medium text-gray-400">
                    of {pages}
                  </span>
                </div>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pages}
                  className="p-2 border border-gray-200 rounded-lg enabled:hover:bg-gray-50 transition-colors disabled:opacity-30"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-32 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Inbox className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-[20px] font-bold text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-500 max-w-[280px] mx-auto text-[15px] font-medium leading-relaxed">
              {filters.status === 'all' 
                ? `You haven't ${filters.type === 'sent' ? 'sent' : 'received'} any collaboration requests yet.` 
                : `You don't have any ${filters.status} requests at the moment.`}
            </p>
          </div>
        )}
      </div>

      {resendingRequest && (
        <ApplyCampaignModal 
          targetType="campaign"
          campaign={resendingRequest.campaignDetails || { _id: resendingRequest.campaign }}
          brand={resendingRequest.brandDetails || { _id: resendingRequest.receiver }}
          initialNote={resendingRequest.note}
          initialBudget={resendingRequest.proposedBudget?.toString()}
          onClose={() => setResendingRequest(null)}
          onSuccess={() => {
            setResendingRequest(null);
            fetchRequests(); // Refresh to see the new pending card
          }}
        />
      )}
    </div>
  );
};

export default InfluencerRequests;
