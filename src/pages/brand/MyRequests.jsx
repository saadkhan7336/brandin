import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  updateRequestInState,
  setStats 
} from '../../redux/slices/collaborationSlice';
import collaborationService from '../../services/collaborationService';
import RequestCard from '../../components/brand/RequestCard';

const MyRequests = () => {
  const dispatch = useDispatch();
  const { requests, loading, error, filters, total, page, pages, stats } = useSelector(
    (state) => state.collaboration
  );

  const [localSearch, setLocalSearch] = useState(filters.search);

  const fetchRequests = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      
      // Clean up filters: if status is "all", don't send it to backend
      const cleanFilters = { ...filters };
      if (cleanFilters.status === 'all') {
        delete cleanFilters.status;
      }

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

  const handleTabChange = (status) => {
    dispatch(setFilters({ status, page: 1 }));
  };

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

  const tabs = [
    { id: 'all', label: 'All', count: total }, // Simplified count for now
    { id: 'pending', label: 'Pending', count: null },
    { id: 'accepted', label: 'Accepted', count: null },
    { id: 'rejected', label: 'Rejected', count: null },
  ];

  return (
    <div className="max-w-[1200px] mx-auto w-full pb-10 px-4 md:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Collaboration Requests
        </h1>
        <p className="text-gray-500 mt-1">
          Manage incoming collaboration requests from influencers.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center gap-3 text-red-700 mb-6 font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          {/* Filter Button */}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 mt-4 border-b border-gray-100 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`pb-3 text-sm font-semibold transition-all relative whitespace-nowrap px-1 ${
                filters.status === tab.id
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {tab.label}
                {tab.count !== null && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] leading-none ${
                    filters.status === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </div>
              {filters.status === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Request List */}
      <div className="space-y-4 min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading requests...</p>
          </div>
        ) : requests.length > 0 ? (
          <>
            {requests.map((request) => (
              <RequestCard 
                key={request._id} 
                request={request} 
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-2 border border-gray-200 rounded-lg enabled:hover:bg-gray-50 transition-colors disabled:opacity-40"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-semibold text-gray-700">
                  Page {page} of {pages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pages}
                  className="p-2 border border-gray-200 rounded-lg enabled:hover:bg-gray-50 transition-colors disabled:opacity-40"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No requests found</h3>
            <p className="text-gray-500 max-w-xs mx-auto">
              {filters.status === 'all' 
                ? "You haven't received any collaboration requests yet." 
                : `You don't have any ${filters.status} requests at the moment.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
