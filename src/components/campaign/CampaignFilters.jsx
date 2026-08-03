import React from 'react';
import { Search, LayoutList, LayoutGrid } from 'lucide-react';

const CampaignFilters = ({ filters, onFilterChange, viewMode = 'list', onViewModeChange }) => {
  const tabs = [
    { label: 'All', value: '' },
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Drafts', value: 'draft' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="bg-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-[#e2e8f0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-6">
      {/* Pill tabs */}
      <div className="flex bg-[#f8fafc] p-1 rounded-xl sm:rounded-2xl border border-[#e2e8f0] overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = filters.status === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onFilterChange({ status: tab.value, page: 1 })}
              className={`px-3.5 sm:px-5 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-100'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        {/* Search */}
        <div className="relative flex-1 md:w-64 lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaign name..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl sm:rounded-2xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm text-[#1e293b] placeholder-slate-400 focus:outline-none transition-all"
          />
        </div>

        {/* View Mode Toggle Button Group */}
        {onViewModeChange && (
          <div className="flex items-center bg-[#f8fafc] p-1 rounded-xl border border-[#e2e8f0] flex-shrink-0">
            <button
              onClick={() => onViewModeChange('list')}
              title="List View"
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-100'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              title="Grid/Card View"
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-100'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignFilters;
