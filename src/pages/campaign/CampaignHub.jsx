import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';

import CampaignStats from '../../components/campaign/CampaignStats';
import CampaignFilters from '../../components/campaign/CampaignFilters';
import CampaignList from '../../components/campaign/CampaignList';
import { Button } from '../../components/common/Button';
import CreateCampaign from './CreateCampaign';
import DeleteConfirmationModal from '../../components/campaign/DeleteConfirmationModal';
import CancelCampaignModal from '../../components/campaign/CancelCampaignModal';
import ExtendDurationModal from '../../components/campaign/ExtendDurationModal';

import campaignService from '../../services/campaignService';
import { 
  setLoading, 
  setError, 
  setCampaigns, 
  setFilters 
} from '../../redux/slices/campaignSlice';

const CampaignHub = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { 
    campaigns, 
    loading, 
    error, 
    filters,
    page,
    pages
  } = useSelector((state) => state.campaign);

  const [view, setView] = React.useState('hub'); // 'hub' or 'create'
  const [viewMode, setViewMode] = React.useState(() => localStorage.getItem('campaigns_view_mode') || 'list');
  const [editData, setEditData] = React.useState(null);
  const [deleteModal, setDeleteModal] = React.useState({ open: false, campaign: null });
  const [cancelModal, setCancelModal] = React.useState({ open: false, campaign: null });
  const [extendModal, setExtendModal] = React.useState({ open: false, campaign: null });

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('campaigns_view_mode', mode);
  };

  const handleDelete = (campaignId) => {
    const campaign = campaigns.find(c => c._id === campaignId);
    
    // If campaign is active, it must be cancelled, not deleted
    if (campaign.status === 'active') {
      setCancelModal({ open: true, campaign });
    } else {
      setDeleteModal({ open: true, campaign });
    }
  };

  const handleReactivate = (campaign) => {
    setExtendModal({ open: true, campaign });
  };

  const confirmExtend = async (campaignId, newEndDate) => {
    try {
      dispatch(setLoading(true));
      await campaignService.extendCampaignDuration(campaignId, newEndDate);
      fetchCampaigns();
      setExtendModal({ open: false, campaign: null });
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to reactivate campaign'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const confirmCancel = async (campaignId, reason) => {
    try {
      dispatch(setLoading(true));
      await campaignService.cancelCampaign(campaignId, reason);
      fetchCampaigns();
      setCancelModal({ open: false, campaign: null });
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to cancel campaign'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.campaign) return;
    
    try {
      dispatch(setLoading(true));
      await campaignService.deleteCampaign(deleteModal.campaign._id);
      fetchCampaigns();
      setDeleteModal({ open: false, campaign: null });
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to delete campaign'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEdit = (campaign) => {
    setEditData(campaign);
    setView('create');
  };

  const fetchCampaigns = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const data = await campaignService.getCampaigns(filters);
      dispatch(setCampaigns({
        campaigns: data.campaigns,
        total: data.total,
        page: data.page,
        pages: data.pages
      }));
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to fetch campaigns'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, filters]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handlePageChange = (newPage) => {
    dispatch(setFilters({ page: newPage }));
  };

  if (view === 'create') {
    return (
      <CreateCampaign 
        onCancel={() => {
          setView('hub');
          setEditData(null);
        }} 
        campaign={editData}
        onSuccess={() => {
          setView('hub');
          setEditData(null);
          fetchCampaigns();
        }} 
      />
    );
  }

  return (
    <div className="w-full max-w-[1800px] mx-auto pb-10 px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pt-2 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1e293b] tracking-tight mb-1">
            Campaign <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Hub</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage, track, and optimize all your brand marketing campaigns in one place.
          </p>
        </div>
        <button
          onClick={() => navigate('/brand/campaigns/new')}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-200 transition-all shrink-0 group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          Create Campaign
        </button>
      </div>

        <CampaignStats campaigns={campaigns} />
        
        <CampaignFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />

        <CampaignList 
          campaigns={campaigns}
          loading={loading}
          error={error}
          page={page}
          pages={pages}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReactivate={handleReactivate}
          viewMode={viewMode}
        />

        <DeleteConfirmationModal 
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, campaign: null })}
          onConfirm={confirmDelete}
          campaignName={deleteModal.campaign?.name}
          loading={loading}
        />

        {cancelModal.open && (
          <CancelCampaignModal
            campaign={cancelModal.campaign}
            onClose={() => setCancelModal({ open: false, campaign: null })}
            onConfirm={confirmCancel}
            loading={loading}
          />
        )}

        <ExtendDurationModal
          isOpen={extendModal.open}
          campaign={extendModal.campaign}
          onClose={() => setExtendModal({ open: false, campaign: null })}
          onConfirm={confirmExtend}
          loading={loading}
        />
    </div>
  );
};

export default CampaignHub;
