import React from 'react';
import { Search } from 'lucide-react';

const CampaignFilters = ({ filters, onFilterChange }) => {
  const tabs = [
    { label: 'All', value: '' },
    { label: 'Drafts', value: 'draft' },
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex bg-gray-50 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onFilterChange({ status: tab.value, page: 1 })}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              filters.status === tab.value
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search campaigns..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
    </div>
  );
};

export default CampaignFilters;
