import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  CheckCircle2, UserPlus, Star, ChevronDown, 
  MoreVertical, ArrowUpRight, TrendingUp, Bell, RefreshCw,
  Megaphone, FileText, Send, XCircle, Handshake, DollarSign,
  CreditCard, UserCheck, PenTool, Package, BadgeCheck, Calendar, Check
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getOptimizedImage } from '../../utils/imageOptimization';
import { fetchNotifications } from '../../redux/slices/notificationSlice';

import StatCard from '../../components/dashboard/StatCard';
import ChartCard from '../../components/dashboard/ChartCard';
import { AreaChart, StackedBarChart, SpendingLineChart, SpendingComboChart, StatsDoughnutChart, StatsList, CollabRadarChart, HeatMap, MultiLineChart, AreaFrequencyChart, MixedROIChart, SocialMediaAreaChart } from '../../components/dashboard/Charts';

// ─── Interactive Date Range Picker Component ─────────────────────────────────
function DateRangePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('Jul 26 - Aug 1');
  const [startDate, setStartDate] = useState('2026-07-26');
  const [endDate, setEndDate] = useState('2026-08-01');
  const pickerRef = React.useRef(null);

  const presets = [
    { label: 'Last 7 Days', value: 'Jul 26 - Aug 1', start: '2026-07-26', end: '2026-08-01' },
    { label: 'Last 30 Days', value: 'Jul 3 - Aug 1', start: '2026-07-03', end: '2026-08-01' },
    { label: 'Last 90 Days', value: 'May 3 - Aug 1', start: '2026-05-03', end: '2026-08-01' },
    { label: 'This Year', value: 'Jan 1 - Aug 1', start: '2026-01-01', end: '2026-08-01' },
  ];

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPreset = (preset) => {
    setSelectedLabel(preset.value);
    setStartDate(preset.start);
    setEndDate(preset.end);
    setIsOpen(false);
  };

  const handleApplyCustom = () => {
    if (startDate && endDate) {
      const s = new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const e = new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      setSelectedLabel(`${s} - ${e}`);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={pickerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-xl px-3.5 py-2 hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
      >
        <Calendar className="w-3.5 h-3.5 text-[#2563eb]" />
        <span className="text-xs font-semibold text-[#1e293b]">{selectedLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#e2e8f0] p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Select Date Range</p>

          {/* Quick Presets */}
          <div className="flex flex-col gap-1 mb-4">
            {presets.map((preset) => {
              const isSelected = selectedLabel === preset.value;
              return (
                <button
                  key={preset.label}
                  onClick={() => handleSelectPreset(preset)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isSelected ? 'bg-blue-50 text-[#2563eb] font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{preset.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#2563eb]" />}
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-3">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Custom Range</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-[10px] text-slate-400 font-semibold block mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#2563eb]"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold block mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#2563eb]"
                />
              </div>
            </div>

            <button
              onClick={handleApplyCustom}
              className="w-full bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors shadow-sm"
            >
              Apply Range
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Chart Toggle Button Group ────────────────────────────────────────────────
function ChartToggle({ options, value, onChange }) {
  return (
    <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-1">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all duration-200 ${
            value === opt.value
              ? 'bg-white text-[#1e293b] shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// --- MOCK DATA FOR STATIC UI ---
const mockMessages = [
  { id: 1, name: 'Sarah K.', desc: "I've just uploaded the draft content...", time: '2m ago', initial: 'S', color: 'bg-orange-100 text-orange-600', status: 'online' },
  { id: 2, name: 'Marcus R.', desc: "The contract looks great! Let's proceed.", time: '1h ago', initial: 'M', color: 'bg-blue-100 text-blue-600', status: 'online' },
  { id: 3, name: 'Elena V.', desc: "Can we discuss the eco-home brief?", time: '4h ago', initial: 'E', color: 'bg-emerald-100 text-emerald-600', status: 'online' },
  { id: 4, name: 'Jordan Lee', desc: "Thanks for the update!", time: 'Yesterday', initial: 'J', color: 'bg-gray-100 text-gray-600', status: 'offline' },
];

const mockCampaigns = [
  { id: 1, name: 'Summer Glow 2024', status: 'Live', progress: 75, color: 'bg-orange-100 text-orange-600' },
  { id: 2, name: 'Eco-home Series', status: 'Live', progress: 31, color: 'bg-emerald-100 text-emerald-600' },
];

// Helper: maps real backend notification `type` to an icon + color
const getActivityStyle = (type = '', title = '') => {
  const t = type?.toLowerCase() || '';
  const lowerTitle = title?.toLowerCase() || '';

  // --- Campaigns ---
  if (t === 'campaign_created')
    return { icon: <Megaphone className="w-4 h-4 text-blue-500" />, bg: 'bg-blue-50' };
  if (t === 'campaign_updated')
    return { icon: <PenTool className="w-4 h-4 text-amber-500" />, bg: 'bg-amber-50' };
  if (t === 'campaign_deleted' || t === 'campaign_cancelled')
    return { icon: <XCircle className="w-4 h-4 text-red-500" />, bg: 'bg-red-50' };

  // --- Collaboration Requests ---
  if (t === 'collaboration_request_sent' || t === 'collab_request_sent')
    return { icon: <Send className="w-4 h-4 text-indigo-500" />, bg: 'bg-indigo-50' };
  if (t === 'collaboration_accepted' || t === 'collab_request_accepted')
    return { icon: <UserCheck className="w-4 h-4 text-emerald-500" />, bg: 'bg-emerald-50' };
  if (t === 'collaboration_started')
    return { icon: <Handshake className="w-4 h-4 text-blue-600" />, bg: 'bg-blue-50' };
  if (t === 'collaboration_completed')
    return { icon: <BadgeCheck className="w-4 h-4 text-emerald-600" />, bg: 'bg-emerald-50' };
  if (t.includes('rejected') || t.includes('cancelled'))
    return { icon: <XCircle className="w-4 h-4 text-red-500" />, bg: 'bg-red-50' };

  // --- Deliverables ---
  if (t === 'deliverable_submitted')
    return { icon: <Package className="w-4 h-4 text-violet-500" />, bg: 'bg-violet-50' };
  if (t === 'deliverable_approved' || t === 'deliverable_approved_paid')
    return { icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, bg: 'bg-emerald-50' };
  if (t === 'deliverable_revision_requested' || t === 'deliverable_updated')
    return { icon: <FileText className="w-4 h-4 text-orange-500" />, bg: 'bg-orange-50' };

  // --- Payments ---
  if (t === 'payout_released' || t === 'escrow_funded' || t === 'escrow_funding')
    return { icon: <DollarSign className="w-4 h-4 text-emerald-600" />, bg: 'bg-emerald-50' };
  if (t === 'waterfall_refund')
    return { icon: <CreditCard className="w-4 h-4 text-red-500" />, bg: 'bg-red-50' };

  // --- Agreement ---
  if (t === 'agreement_signed')
    return { icon: <Handshake className="w-4 h-4 text-teal-500" />, bg: 'bg-teal-50' };

  // --- Profile / System ---
  if (t === 'profile_updated' || lowerTitle.includes('profile'))
    return { icon: <UserPlus className="w-4 h-4 text-blue-500" />, bg: 'bg-blue-50' };

  // --- Milestones (title-based fallback) ---
  if (lowerTitle.includes('milestone') || lowerTitle.includes('achieved'))
    return { icon: <Star className="w-4 h-4 text-purple-500" />, bg: 'bg-purple-50' };

  // --- Task assignment ---
  if (t.includes('task') || lowerTitle.includes('task'))
    return { icon: <CheckCircle2 className="w-4 h-4 text-sky-500" />, bg: 'bg-sky-50' };

  // --- Ultimate fallback ---
  return { icon: <Bell className="w-4 h-4 text-slate-500" />, bg: 'bg-slate-50' };
};

export default function BrandDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: notifications, loading: loadingNotifications } = useSelector((state) => state.notifications);

  // Chart view toggles
  const [spendingView, setSpendingView] = useState('combo');   // 'bar' | 'line' | 'combo'
  const [collabView,   setCollabView]   = useState('donut');  // 'donut' | 'list' | 'radar'
  const [flowView,     setFlowView]     = useState('multi');  // 'multi' | 'area'
  const [roiView,      setRoiView]      = useState('roi');    // 'roi' | 'channel' | 'trend'
  const [mapView,      setMapView]      = useState('density'); // 'density' | 'category'
  const [socialView,   setSocialView]   = useState('engagement'); // 'engagement' | 'reach' | 'content'

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const recentActivity = notifications?.slice(0, 3) || [];

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 flex flex-col gap-5">
      
      {/* Page Actions (Top Header - Unboxed & Sleek) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b] tracking-tight">Dashboard Overview</h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Track your campaigns, spending, and influencer performance.</p>
        </div>
        
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Interactive Date Range Picker */}
          <DateRangePicker />

          {/* Export Button */}
          <button className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white rounded-xl px-4 py-2 font-semibold text-xs transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Export
          </button>
        </div>
      </div>

      {/* Top Row: Active Campaigns List + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Social Media Analytics Chart (Replaces Active Campaigns) */}
        <div className="lg:col-span-8">
          <ChartCard
            title="Social Media Performance"
            subtitle="Track reach, engagement, and tasks from influencer collaborations"
            headerAction={
              <div className="flex items-center gap-3">
                {/* Chart-specific Date Picker */}
                <div className="hidden sm:flex items-center bg-slate-50 border border-[#e2e8f0] rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="text-xs font-semibold text-[#475569] mr-2">Last 30 Days</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                
                <ChartToggle
                  options={[
                    { label: 'Engagement', value: 'engagement' },
                    { label: 'Reach',      value: 'reach' },
                    { label: 'By Task',    value: 'content' },
                  ]}
                  value={socialView}
                  onChange={setSocialView}
                />
              </div>
            }
          >
            <div className="w-full h-[280px]">
              <SocialMediaAreaChart mode={socialView} />
            </div>
          </ChartCard>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#e2e8f0] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-[#1e293b] uppercase tracking-wider">Recent Activity</h3>
            <button 
               onClick={() => dispatch(fetchNotifications())}
               disabled={loadingNotifications}
               className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
               <RefreshCw className={`w-4 h-4 ${loadingNotifications ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="flex flex-col gap-5 flex-1 justify-center">
            {recentActivity.length > 0 ? (
              recentActivity.map(activity => {
                const style = getActivityStyle(activity.type);
                return (
                  <div key={activity._id || activity.id} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                      {style.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1e293b]">{activity.title}</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        {activity.message} • {formatDistanceToNow(new Date(activity.createdAt || Date.now()), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-slate-500 text-sm py-4">No recent activity</div>
            )}
          </div>
        </div>

      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
        <StatCard 
          title="Total Collabs" 
          value="1,248" 
          change="+12.5%" 
          changeType="positive"
          sparklineData={[30, 40, 35, 50, 49, 60, 70, 91, 125]}
          sparklineColor="#3b82f6"
          sparklineBgColor="rgba(59, 130, 246, 0.1)"
        />
        <StatCard 
          title="Total Spend" 
          value="$45.2k" 
          change="+8.2%" 
          changeType="positive"
          sparklineData={[10, 15, 20, 18, 25, 30, 45, 40, 50]}
          sparklineColor="#10b981"
          sparklineBgColor="rgba(16, 185, 129, 0.1)"
        />
        <StatCard 
          title="Total Tasks" 
          value="456" 
          change="-2.1%" 
          changeType="negative"
          sparklineData={[100, 90, 85, 95, 80, 75, 70, 60, 55]}
          sparklineColor="#f43f5e"
          sparklineBgColor="rgba(244, 63, 94, 0.1)"
        />
        <StatCard 
          title="Completion Rate" 
          value="94.2%" 
          change="+1.4%" 
          changeType="positive"
          sparklineData={[80, 85, 84, 88, 90, 92, 91, 93, 94]}
          sparklineColor="#8b5cf6"
          sparklineBgColor="rgba(139, 92, 246, 0.1)"
        />
        <StatCard 
          title="Avg. ROI" 
          value="3.2x" 
          change="+0.4x" 
          changeType="positive"
          sparklineData={[2.1, 2.3, 2.5, 2.4, 2.8, 2.9, 3.1, 3.0, 3.2]}
          sparklineColor="#f59e0b"
          sparklineBgColor="rgba(245, 158, 11, 0.1)"
        />
      </div>

      {/* Middle Row 1: Spending & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Brand Spending Bar Chart */}
        <div className="lg:col-span-8">
          <ChartCard 
            title="Brand Spending" 
            subtitle="Weekly breakdown across channels & ROI"
            headerAction={
              <div className="flex items-center gap-3">
                <ChartToggle
                  options={[
                    { label: 'Bar', value: 'bar' },
                    { label: 'Line', value: 'line' },
                    { label: 'Combo', value: 'combo' },
                  ]}
                  value={spendingView}
                  onChange={setSpendingView}
                />
                <button className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors border border-slate-200">
                  Last 7 Days <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            }
            className="h-full"
          >
            <div className="w-full h-[300px]">
              {spendingView === 'bar' && <StackedBarChart />}
              {spendingView === 'line' && <SpendingLineChart />}
              {spendingView === 'combo' && <SpendingComboChart />}
            </div>
          </ChartCard>
        </div>

        <div className="lg:col-span-4">
          <ChartCard 
            title="Collaboration Stats" 
            subtitle="Current status of all tasks"
            headerAction={
              <ChartToggle
                options={[
                  { label: 'Donut',  value: 'donut' },
                  { label: 'List',   value: 'list'  },
                  { label: 'Radial', value: 'radar' },
                ]}
                value={collabView}
                onChange={setCollabView}
              />
            }
            className="h-full"
          >
            <div className="w-full h-[250px] flex items-center justify-center">
              {collabView === 'donut' && <StatsDoughnutChart />}
              {collabView === 'list'  && <StatsList />}
              {collabView === 'radar' && <CollabRadarChart />}
            </div>
          </ChartCard>
        </div>

      </div>

      {/* Middle Row 2: Map & Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Enhanced Heat Map with toggle */}
        <div className="lg:col-span-6">
          <ChartCard 
            title="Influencer Map" 
            subtitle="Geographic distribution — hover for region stats"
            headerAction={
              <ChartToggle
                options={[{ label: 'Density', value: 'density' }, { label: 'Category', value: 'category' }]}
                value={mapView}
                onChange={setMapView}
              />
            }
            className="h-full"
          >
            <div className="w-full h-[300px] bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
              <HeatMap viewMode={mapView} />
            </div>
          </ChartCard>
        </div>

        {/* Campaigns Flow */}
        <div className="lg:col-span-6">
          <ChartCard 
            title="Campaigns Flow" 
            subtitle="Multi-channel performance over time"
            headerAction={
              <ChartToggle
                options={[{ label: 'Multi-line', value: 'multi' }, { label: 'Area', value: 'area' }]}
                value={flowView}
                onChange={setFlowView}
              />
            }
            className="h-full"
          >
            <div className="w-full h-[300px]">
              {flowView === 'multi' ? <MultiLineChart /> : <AreaFrequencyChart />}
            </div>
          </ChartCard>
        </div>

      </div>

      {/* Bottom Row: Messages & Campaigns Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Messages */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#e2e8f0] flex flex-col">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-[#1e293b] uppercase tracking-wider">Recent Messages</h3>
              <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
           </div>

           <div className="flex flex-col gap-5 flex-1">
             {mockMessages.map(msg => (
               <div key={msg.id} className="flex items-start gap-4 group cursor-pointer">
                  <div className="relative">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${msg.color}`}>
                        {msg.initial}
                     </div>
                     <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${msg.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-bold text-[#1e293b] truncate">{msg.name}</p>
                        <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap ml-2">{msg.time}</span>
                     </div>
                     <p className="text-xs font-medium text-slate-500 truncate">{msg.desc}</p>
                  </div>
               </div>
             ))}
           </div>
        </div>

        {/* Active Campaigns Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#e2e8f0] flex flex-col">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#1e293b]">Active Campaigns</h3>
              <button className="text-xs font-bold text-blue-600 hover:underline">Manage All</button>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="border-b border-[#e2e8f0]">
                   <tr>
                      <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Campaign Name</th>
                      <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-1/3">Budget</th>
                      <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                   {mockCampaigns.map(camp => (
                     <tr key={camp.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4">
                           <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${camp.color}`}>
                                 <TrendingUp className="w-4 h-4" />
                              </div>
                              <p className="text-sm font-bold text-[#1e293b]">{camp.name}</p>
                           </div>
                        </td>
                        <td className="py-4">
                           <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                              {camp.status}
                           </span>
                        </td>
                        <td className="py-4">
                           <div className="flex items-center gap-3">
                              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-500 rounded-full" style={{ width: `${camp.progress}%` }} />
                              </div>
                              <span className="text-[10px] font-bold text-slate-600 w-8">{camp.progress}%</span>
                           </div>
                        </td>
                        <td className="py-4 text-right">
                           <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                              <MoreVertical className="w-4 h-4" />
                           </button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>

      </div>

    </div>
  );
}