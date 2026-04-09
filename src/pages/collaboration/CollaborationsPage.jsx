import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, ArrowLeft, Loader2, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CollaborationCard from '../../components/common/CollaborationCard';
import collaborationService from '../../services/collaborationService';
import {
  setCollaborations,
  setCollaborationsLoading,
  setCollaborationsError,
} from '../../redux/slices/collaborationSlice';

const CollaborationsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get current user role from Redux auth
  const { user } = useSelector((state) => state.auth);
  const { collaborations, collaborationsLoading, collaborationsError } = useSelector(
    (state) => state.collaboration
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchCollaborations = useCallback(async () => {
    try {
      dispatch(setCollaborationsLoading(true));
      dispatch(setCollaborationsError(null));
      const response = await collaborationService.getAll();
      // API returns { success, data: { collaborations, total, ... } }
      const items = response?.data?.collaborations ?? response?.data ?? response ?? [];
      dispatch(setCollaborations(Array.isArray(items) ? items : []));
    } catch (error) {
      console.error('Error fetching collaborations:', error);
      dispatch(setCollaborationsError('Failed to load collaborations.'));
    } finally {
      dispatch(setCollaborationsLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    // ── Diagnostics ──────────────────────────────────────────────────────────
    const runDiagnostics = async () => {
      try {
        const pingRes = await collaborationService.api.get('/ping');
        console.log('Backend Diagnostic Status:', pingRes.data);
      } catch (err) {
        console.error('Backend Connectivity Error:', err);
      }
    };
    runDiagnostics();
    // ────────────────────────────────────────────────────────────────────────
    fetchCollaborations();
  }, [fetchCollaborations]);

  const userRole = user?.role; // 'brand' | 'influencer'

  // Compute the "partner" name and campaign title for search filtering
  const getPartnerName = (collab) => {
    if (userRole === 'brand') {
      return collab.influencer?.name || '';
    }
    return collab.brand?.name || '';
  };

  const getCampaignTitle = (collab) => collab.campaign?.title || '';

  const filteredCollaborations = collaborations.filter((collab) => {
    const partnerName = getPartnerName(collab).toLowerCase();
    const campaignTitle = getCampaignTitle(collab).toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = partnerName.includes(query) || campaignTitle.includes(query);
    // Backend status for accepted collaborations might be 'active' or 'completed'
    const collabStatus = collab.status?.toLowerCase();
    const mappedStatus =
      collabStatus === 'active' ? 'ongoing' : collabStatus === 'completed' ? 'completed' : collabStatus;

    const matchesStatus = statusFilter === 'all' || mappedStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full max-w-[1800px] mx-auto pb-10 px-4 md:px-8">
      {/* Header */}
      <div className="mb-8 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-fit mb-4"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Collaborations</h1>
        <p className="text-gray-500 mt-1 font-medium text-[15px]">
          Track and manage your active collaborations
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search collaborations..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-[15px] placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select
              className="appearance-none pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 cursor-pointer text-sm font-bold text-gray-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
            <Filter
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {collaborationsError && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-700 font-medium mb-6">
          {collaborationsError}
        </div>
      )}

      {/* Collaboration List */}
      {collaborationsLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
          <p className="text-gray-500 font-bold text-[15px]">Loading collaborations...</p>
        </div>
      ) : filteredCollaborations.length > 0 ? (
        <div className="space-y-4">
          {filteredCollaborations.map((collab) => (
            <CollaborationCard
              key={collab._id}
              collaboration={collab}
              userRole={userRole}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-32 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <Inbox className="w-10 h-10 text-gray-200" />
          </div>
          <h3 className="text-[20px] font-bold text-gray-900 mb-2">No collaborations found</h3>
          <p className="text-gray-500 max-w-[280px] mx-auto text-[15px] font-medium leading-relaxed">
            {searchQuery || statusFilter !== 'all'
              ? "No collaborations match your current filters."
              : "You don't have any active collaborations yet."}
          </p>
          {(searchQuery || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="mt-4 text-blue-600 font-semibold hover:underline text-sm"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CollaborationsPage;
