import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const CancelCampaignModal = ({ campaign, onClose, onConfirm, loading }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(campaign._id, reason);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-rose-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Cancel Campaign</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="px-8 pb-8">
          <p className="text-gray-500 text-[15px] mb-6 leading-relaxed">
            Are you sure you want to cancel <span className="font-bold text-gray-900">"{campaign.name}"</span>? 
            Influencers who have already been accepted will be notified.
          </p>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Reason for Cancellation
            </label>
            <textarea
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Campaign objectives have changed..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 transition-all text-[15px] min-h-[120px] resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading || !reason.trim()}
              className="flex-1 px-6 py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-bold rounded-2xl transition-all shadow-lg shadow-rose-200 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Cancel Campaign'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelCampaignModal;
