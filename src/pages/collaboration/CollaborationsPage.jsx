import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Loader2, Inbox } from 'lucide-react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
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
  const { tab: activeTab = 'all' } = useParams();

  const { user } = useSelector((state) => state.auth);
  const { collaborations, collaborationsLoading, collaborationsError } = useSelector(
    (state) => state.collaboration
  );

  const [searchQuery, setSearchQuery] = useState('');

  const fetchCollaborations = useCallback(async () => {
    try {
      dispatch(setCollaborationsLoading(true));
      dispatch(setCollaborationsError(null));
      const response = await collaborationService.getAll();
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
    fetchCollaborations();
  }, [fetchCollaborations]);

  const userRole = user?.role;
  const baseUrl = userRole === 'influencer' ? '/influencer/collaborations' : '/brand/collaborations';

  // Tabs configuration matching Screenshot 5
  const tabs = useMemo(() => {
    const counts = {
      all: collaborations.length,
      ongoing: collaborations.filter(c => c.status?.toLowerCase() === 'active' || c.status?.toLowerCase() === 'ongoing').length,
      completed: collaborations.filter(c => c.status?.toLowerCase() === 'completed').length,
      pending: collaborations.filter(c => c.status?.toLowerCase() === 'pending').length,
    };

    return [
      { id: 'all', label: 'All', count: counts.all },
      { id: 'ongoing', label: 'Ongoing', count: counts.ongoing },
      { id: 'completed', label: 'Completed', count: counts.completed },
      { id: 'pending', label: 'Pending', count: counts.pending },
    ];
  }, [collaborations]);

  const filteredCollaborations = useMemo(() => {
    return collaborations.filter((collab) => {
      const partnerName = (userRole === 'brand' 
        ? collab.influencerId?.fullName || collab.influencerId?.name 
        : collab.brandId?.name || collab.brandId?.fullName
      )?.toLowerCase() || '';
      
      const campaignTitle = (collab.title || collab.campaignId?.title || '').toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch = partnerName.includes(query) || campaignTitle.includes(query);
      
      const collabStatus = collab.status?.toLowerCase();
      const mappedStatus = collabStatus === 'active' ? 'ongoing' : collabStatus;

      const matchesTab = activeTab === 'all' || mappedStatus === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [collaborations, searchQuery, activeTab, userRole]);

  const handleReset = () => {
    setSearchQuery('');
    navigate(`${baseUrl}/all`);
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto pb-10 px-4 md:px-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pt-8 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Collaborations</h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">
            Monitor and manage your active projects and task updates.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search collaborations..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold placeholder:text-gray-400 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex items-center gap-1 mb-10 bg-gray-50/50 p-1 rounded-2xl w-fit border border-gray-100">
        {tabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={`${baseUrl}/${tab.id}`}
            className={({ isActive }) => `
              flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider
              ${isActive
                ? 'bg-white text-blue-600 shadow-sm border border-gray-100' 
                : 'text-gray-500 hover:text-gray-700'}
            `}
          >
            {tab.label}
            <span className={`
              px-1.5 py-0.5 rounded text-[9px] font-bold
              ${activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'bg-gray-200 text-gray-500'}
            `}>
              {tab.count}
            </span>
          </NavLink>
        ))}
      </div>

      {/* Error Banner */}
      {collaborationsError && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-red-700 font-bold mb-6 text-sm flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {collaborationsError}
        </div>
      )}

      {/* Collaboration List */}
      {collaborationsLoading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="relative">
            <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
            <div className="absolute inset-0 blur-lg bg-blue-600/20 animate-pulse rounded-full" />
          </div>
          <p className="text-gray-500 font-black text-sm mt-6 uppercase tracking-widest">Refreshing Data...</p>
        </div>
      ) : filteredCollaborations.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredCollaborations.map((collab) => (
            <CollaborationCard
              key={collab._id}
              collaboration={collab}
              userRole={userRole}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-dashed border-gray-200 py-32 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-gray-50 rounded-[30px] flex items-center justify-center mb-8 rotate-3 shadow-inner">
            <Inbox className="w-12 h-12 text-gray-200 -rotate-3" />
          </div>
          <h3 className="text-[22px] font-black text-gray-900 mb-2 uppercase tracking-tight">Vibe Search Failed</h3>
          <p className="text-gray-500 max-w-[320px] mx-auto text-sm font-bold leading-relaxed">
            {searchQuery || activeTab !== 'all'
              ? "We couldn't find any collaborations matching those filters. Try adjusting your search."
              : "Looks like the spotlight is waiting for you. Start your first collaboration to see it here!"}
          </p>
          {(searchQuery || activeTab !== 'all') && (
            <button
              onClick={handleReset}
              className="mt-8 px-8 py-3 bg-[#0F172A] text-white text-xs font-black rounded-2xl hover:scale-105 transition-all shadow-lg uppercase tracking-widest"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CollaborationsPage;
