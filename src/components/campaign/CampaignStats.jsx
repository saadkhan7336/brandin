import React from 'react';
import { Users, CheckCircle, Clock, PieChart } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  </div>
);

const CampaignStats = ({ campaigns = [] }) => {
  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status?.toLowerCase() === 'active').length,
    pending: campaigns.filter(c => !c.status || c.status?.toLowerCase() === 'pending').length,
    completed: campaigns.filter(c => c.status?.toLowerCase() === 'completed').length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Total Campaigns" 
        value={stats.total} 
        icon={Users} 
        colorClass="bg-blue-500" 
      />
      <StatCard 
        title="Active" 
        value={stats.active} 
        icon={PieChart} 
        colorClass="bg-emerald-500" 
      />
      <StatCard 
        title="Pending" 
        value={stats.pending} 
        icon={Clock} 
        colorClass="bg-amber-500" 
      />
      <StatCard 
        title="Completed" 
        value={stats.completed} 
        icon={CheckCircle} 
        colorClass="bg-gray-500" 
      />
    </div>
  );
};

export default CampaignStats;
