import React, { useState, useEffect } from 'react';
import { X, Target, Loader2, DollarSign, Sparkles, ArrowRight, Layers } from 'lucide-react';
import campaignService from '../../services/campaignService';
import collaborationService from '../../services/collaborationService';

export default function CampaignSelectionModal({ isOpen, onClose, onSelect }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchCampaigns();
    }
  }, [isOpen]);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const [campaignData, collabData] = await Promise.all([
        campaignService.getCampaigns({ status: 'active', limit: 50 }),
        collaborationService.getAll({ limit: 100 })
      ]);

      const campaignsList = Array.isArray(campaignData) ? campaignData : (campaignData.campaigns || []);
      const collabsList = collabData.success && collabData.data ? (collabData.data.collaborations || []) : [];

      const activeCollabCampaignIds = collabsList
        .filter(c => ['active', 'in_progress', 'review', 'accepted', 'awaiting_funds', 'awaiting_onboarding', 'completed', 'suspended'].includes(c.status))
        .map(c => (c.campaign?.id || c.campaign?._id || c.campaign || c.campaignId?.id || c.campaignId?._id || c.campaignId || '').toString())
        .filter(Boolean);

      const filteredCampaigns = campaignsList.filter(camp => 
        !activeCollabCampaignIds.includes(camp._id.toString())
      );

      setCampaigns(filteredCampaigns);
    } catch (err) {
      console.error("Error fetching campaigns/collaborations:", err);
      setError("Failed to load active campaigns");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] border border-[#e2e8f0]">
        
        {/* Header */}
        <div className="p-6 sm:p-7 border-b border-[#e2e8f0] flex justify-between items-center bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1e293b] tracking-tight">AI Campaign Match</h2>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Select a campaign to discover precision-matched creators</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-[#f8fafc]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="relative">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <Sparkles className="w-4 h-4 text-indigo-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Analyzing Active Campaigns...</p>
            </div>
          ) : error ? (
            <div className="p-5 bg-rose-50 text-rose-600 rounded-2xl text-center text-xs font-bold border border-rose-100">
              {error}
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 bg-white shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#e2e8f0]">
                <Target className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-[#1e293b] mb-1">No Available Campaigns</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
                Create an active campaign first to let our AI engine match the ideal influencers for your brand.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Your Campaigns ({campaigns.length})</p>
              {campaigns.map(camp => (
                <div 
                  key={camp._id} 
                  onClick={() => onSelect(camp._id)}
                  className="p-4 rounded-2xl bg-white border border-[#e2e8f0] hover:border-blue-500 cursor-pointer transition-all hover:shadow-md group flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <h3 className="text-sm font-bold text-[#1e293b] group-hover:text-blue-600 transition-colors truncate mb-1">
                      {camp.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full border border-blue-100">
                        {camp.industry || camp.category || 'General'}
                      </span>
                      {camp.budget && (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                          <DollarSign className="w-3 h-3 mr-0.5" />
                          {camp.budget.max ? `Up to $${camp.budget.max}` : `$${camp.budget}`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-slate-50 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 flex items-center justify-center transition-all shrink-0">
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#e2e8f0] text-center">
          <p className="text-[11px] text-slate-400 font-semibold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            AI analyzes 50+ audience metrics for precision matching
          </p>
        </div>
      </div>
    </div>
  );
}
