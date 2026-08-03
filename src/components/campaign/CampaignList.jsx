import React from 'react';
import CampaignCard from './CampaignCard';
import CampaignGridCard from './CampaignGridCard';
import { Button } from '../common/Button';

const CampaignList = ({ 
  campaigns = [], 
  loading, 
  error, 
  onPageChange, 
  page, 
  pages,
  onEdit,
  onDelete,
  onReactivate,
  viewMode = 'list'
}) => {
  if (loading && campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-[#e2e8f0] shadow-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-slate-500 font-medium text-sm">Loading campaigns...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 p-8 rounded-3xl border border-rose-100 text-center">
        <p className="text-rose-600 font-semibold mb-4 text-sm">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="bg-white p-12 sm:p-20 rounded-3xl border border-[#e2e8f0] shadow-sm text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
          <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-black text-[#1e293b] mb-1">No campaigns found</h3>
        <p className="text-sm text-slate-400 max-w-xs mx-auto">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {campaigns.map((campaign) => (
            <CampaignGridCard
              key={campaign._id}
              campaign={campaign}
              onEdit={onEdit}
              onDelete={onDelete}
              onReactivate={onReactivate}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-5">
          {campaigns.map((campaign) => (
            <CampaignCard 
              key={campaign._id} 
              campaign={campaign} 
              onEdit={onEdit}
              onDelete={onDelete}
              onReactivate={onReactivate}
            />
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center space-x-3 pt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <span className="text-xs font-bold text-slate-500">
            Page {page} of {pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === pages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default CampaignList;
