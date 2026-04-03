import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setLoading,
  setError,
  setRequests,
  setFilters,
  updateRequestInState
} from '../../redux/slices/collaborationSlice';
import collaborationService from '../../services/collaborationService';
import InfluencerRequestCard from '../../components/influencer/InfluencerRequestCard';

const InfluencerRequests = () => {
  const dispatch = useDispatch();
  const { requests, loading, error, filters } = useSelector(
    (state) => state.collaboration
  );

  const fetchRequests = useCallback(async () => {
    try {
      dispatch(setLoading(true));

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

  const handleTabChange = (status) => {
    dispatch(setFilters({ status, page: 1 }));
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

  // Calculate counts dynamically from requests (if we had all requests preloaded)
  // For now, let's just make tabs visually toggleable
  const getCount = (status) => {
    return requests.filter(r => r.status === status).length;
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'New', count: getCount('pending') },
    { id: 'accepted', label: 'Accepted', count: getCount('accepted') },
    { id: 'rejected', label: 'Rejected', count: getCount('rejected') },
  ];

  return (
    <div className="max-w-[1000px] w-full pb-10 px-4 md:px-0">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">
          Collaboration Requests
        </h1>
        <p className="text-[14px] text-gray-500 mt-1">
          Manage collaboration requests from brands
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-[14px] text-red-700 mb-6 font-medium">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[14px] font-semibold transition-all border ${filters.status === tab.id
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[11px] leading-none ${filters.status === tab.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Request List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : requests.length > 0 ? (
          requests.map((request) => (
            <InfluencerRequestCard
              key={request._id}
              request={request}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))
        ) : (
          <div className="bg-white rounded-xl border border-dashed border-gray-200 py-16 flex flex-col items-center justify-center text-center">
            <h3 className="text-[16px] font-bold text-gray-900 mb-1">No requests found</h3>
            <p className="text-[14px] text-gray-500 max-w-xs mx-auto">
              You don't have any {filters.status !== 'all' ? filters.status : ''} collaboration requests at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfluencerRequests;
