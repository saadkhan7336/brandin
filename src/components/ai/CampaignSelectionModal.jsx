import React, { useState, useEffect } from 'react';
import { X, Target, Loader2, DollarSign, Sparkles } from 'lucide-react';
import campaignService from '../../services/campaignService';

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
      const data = await campaignService.getCampaigns({ status: 'active', limit: 50 });
      const list = Array.isArray(data) ? data : (data.campaigns || []);
      setCampaigns(list);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setError("Failed to load active campaigns");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] border border-gray-100">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <div className="p-1.5 bg-blue-50 rounded-lg">
                  <Sparkles className="w-5 h-5 text-blue-600" />
               </div>
               <h2 className="text-2xl font-bold text-gray-900 tracking-tight">AI Matching</h2>
            </div>
            <p className="text-sm text-gray-500 font-medium">Select a campaign to find your ideal partners</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-2xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
               <div className="relative">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                  <Sparkles className="w-4 h-4 text-blue-400 absolute -top-1 -right-1 animate-pulse" />
               </div>
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Fetching Campaigns</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 text-red-600 rounded-3xl text-center text-sm font-bold border border-red-100">
              {error}
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-16 px-8">
              <div className="w-20 h-20 bg-white shadow-sm rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-50">
                 <Target className="w-10 h-10 text-gray-200" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Campaigns</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                You need an active campaign to use AI Matching. Please create one in the Campaigns Hub.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map(camp => (
                <div 
                  key={camp._id} 
                  onClick={() => onSelect(camp._id)}
                  className="p-5 rounded-[24px] bg-white border border-gray-100 hover:border-blue-400 cursor-pointer transition-all hover:shadow-xl hover:shadow-blue-500/5 group flex items-start justify-between"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">{camp.name}</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black tracking-widest uppercase bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                        {camp.industry || camp.category || 'General'}
                      </span>
                      {camp.budget && (
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                          <DollarSign className="w-3 h-3 mr-0.5" />
                          {camp.budget.max ? `Up to $${camp.budget.max}` : `$${camp.budget}`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 group-hover:bg-blue-600 flex items-center justify-center transition-all shadow-inner">
                     <Target className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-6 bg-white border-t border-gray-100 italic text-[11px] text-gray-400 text-center font-medium">
           AI models analyze over 50 data points to ensure perfect brand alignment.
        </div>
      </div>
    </div>
  );
}
