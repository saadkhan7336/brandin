import React from 'react';
import { Target, PieChart, Clock, CheckCircle2 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, bg, text, border }) => (
  <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#e2e8f0] shadow-sm p-4 sm:p-5 flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
    <div>
      <p className="text-[11px] sm:text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-2xl sm:text-3xl font-black text-[#1e293b] leading-none">{value}</h3>
    </div>
    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center ${bg} ${text} border ${border} flex-shrink-0 shadow-sm`}>
      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
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
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <StatCard 
        title="Total Campaigns" 
        value={stats.total} 
        icon={Target} 
        bg="bg-blue-50"
        text="text-blue-600"
        border="border-blue-100"
      />
      <StatCard 
        title="Active" 
        value={stats.active} 
        icon={PieChart} 
        bg="bg-emerald-50"
        text="text-emerald-600"
        border="border-emerald-100"
      />
      <StatCard 
        title="Pending Approval" 
        value={stats.pending} 
        icon={Clock} 
        bg="bg-amber-50"
        text="text-amber-600"
        border="border-amber-100"
      />
      <StatCard 
        title="Completed" 
        value={stats.completed} 
        icon={CheckCircle2} 
        bg="bg-indigo-50"
        text="text-indigo-600"
        border="border-indigo-100"
      />
    </div>
  );
};

export default CampaignStats;
