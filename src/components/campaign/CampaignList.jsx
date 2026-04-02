import React from 'react';
import CampaignCard from './CampaignCard';
import { Button } from '../common/Button';

const CampaignList = ({ 
  campaigns = [], 
  loading, 
  error, 
  onPageChange, 
  page, 
  pages,
  onEdit,
  onDelete
}) => {
  if (loading && campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading campaigns...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-8 rounded-2xl border border-red-100 text-center">
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="bg-white p-20 rounded-2xl border border-gray-100 shadow-sm text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">No campaigns found</h3>
        <p className="text-gray-500">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {campaigns.map((campaign) => (
          <CampaignCard 
            key={campaign._id} 
            campaign={campaign} 
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center space-x-4 pt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm font-medium text-gray-500">
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
