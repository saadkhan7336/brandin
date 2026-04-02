import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';

import CampaignStats from '../../components/campaign/CampaignStats';
import CampaignFilters from '../../components/campaign/CampaignFilters';
import CampaignList from '../../components/campaign/CampaignList';
import { Button } from '../../components/common/Button';
import CreateCampaign from './CreateCampaign';
import DeleteConfirmationModal from '../../components/campaign/DeleteConfirmationModal';

import campaignService from '../../services/campaignService';
import { 
  setLoading, 
  setError, 
  setCampaigns, 
  setFilters 
} from '../../redux/slices/campaignSlice';

const CampaignHub = () => {
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
  const [editData, setEditData] = React.useState(null);
  const [deleteModal, setDeleteModal] = React.useState({ open: false, campaign: null });

  const handleDelete = (campaignId) => {
    const campaign = campaigns.find(c => c._id === campaignId);
    setDeleteModal({ open: true, campaign });
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
    <div className="w-full py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">Campaign Hub</h1>
            <p className="text-gray-500 font-medium">Manage and track your brand's marketing campaigns.</p>
          </div>
          <Button 
            className="flex items-center space-x-2"
            onClick={() => setView('create')}
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span>Create Campaign</span>
          </Button>
        </div>

        <CampaignStats campaigns={campaigns} />
        
        <CampaignFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
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
        />

        <DeleteConfirmationModal 
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, campaign: null })}
          onConfirm={confirmDelete}
          campaignName={deleteModal.campaign?.name}
          loading={loading}
        />
    </div>
  );
};

export default CampaignHub;
