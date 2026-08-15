import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  CheckCircle2, UserPlus, Star, ChevronDown, 
  MoreVertical, ArrowUpRight, ArrowRight, TrendingUp, Bell, RefreshCw,
  Megaphone, FileText, Send, XCircle, Handshake, DollarSign,
  CreditCard, UserCheck, PenTool, Package, BadgeCheck, Calendar, Check,
  Download, FileJson, FileSpreadsheet, Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fetchNotifications } from '../../redux/slices/notificationSlice';
import api from '../../services/api';
import UserAvatar from '../../components/common/UserAvatar';
import campaignService from '../../services/campaignService';
import collaborationService from '../../services/collaborationService';

import StatCard from '../../components/dashboard/StatCard';
import ChartCard from '../../components/dashboard/ChartCard';
import { AreaChart, StackedBarChart, SpendingLineChart, SpendingComboChart, StatsDoughnutChart, StatsList, CollabRadarChart, HeatMap, MultiLineChart, AreaFrequencyChart, MixedROIChart, SocialMediaAreaChart } from '../../components/dashboard/Charts';

const toIsoDate = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const daysAgoIso = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toIsoDate(d);
};

const prettyRange = (from, to) => {
  if (!from || !to) return 'All time';
  const opts = { month: 'short', day: 'numeric' };
  const s = new Date(`${from}T00:00:00`).toLocaleDateString('en-US', opts);
  const e = new Date(`${to}T00:00:00`).toLocaleDateString('en-US', opts);
  return `${s} – ${e}`;
};

const RANGE_PRESETS = [
  { id: '7d', label: 'Last 7 days', resolve: () => ({ from: daysAgoIso(6), to: toIsoDate(new Date()) }) },
  { id: '30d', label: 'Last 30 days', resolve: () => ({ from: daysAgoIso(29), to: toIsoDate(new Date()) }) },
  { id: '90d', label: 'Last 90 days', resolve: () => ({ from: daysAgoIso(89), to: toIsoDate(new Date()) }) },
  { id: 'year', label: 'This year', resolve: () => ({ from: `${new Date().getFullYear()}-01-01`, to: toIsoDate(new Date()) }) },
  { id: 'all', label: 'All time', resolve: () => ({ from: '', to: '' }) },
];

const csvEscape = (value) => {
  const text = String(value ?? '');
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
};

const toCsv = (headers, rows) => [headers, ...rows]
  .map((row) => row.map(csvEscape).join(','))
  .join('\n');

const downloadText = (content, filename, type = 'text/plain;charset=utf-8') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const stamp = () => toIsoDate(new Date());

// ─── Interactive Date Range Picker Component ─────────────────────────────────
function DateRangePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(value.from || daysAgoIso(29));
  const [endDate, setEndDate] = useState(value.to || toIsoDate(new Date()));
  const [dropAlign, setDropAlign] = useState('right');
  const pickerRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    setStartDate(value.from || daysAgoIso(29));
    setEndDate(value.to || toIsoDate(new Date()));
  }, [value.from, value.to]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownWidth = window.innerWidth < 640 ? 256 : 288;
      setDropAlign(rect.right >= dropdownWidth ? 'right' : 'left');
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelectPreset = (preset) => {
    const next = preset.resolve();
    onChange({ ...next, preset: preset.id });
    setIsOpen(false);
  };

  const handleApplyCustom = () => {
    if (!startDate || !endDate) return;
    onChange({ from: startDate, to: endDate, preset: 'custom' });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <button
        ref={triggerRef}
        onClick={handleToggle}
        className="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-xl px-3.5 py-2 hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
      >
        <Calendar className="w-3.5 h-3.5 text-[#2563eb]" />
        <span className="text-xs font-semibold text-[#1e293b]">{prettyRange(value.from, value.to)}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute mt-2 w-64 sm:w-72 bg-white rounded-2xl shadow-xl border border-[#e2e8f0] p-4 z-[220]"
          style={dropAlign === 'right' ? { right: 0 } : { left: 0 }}
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Select Date Range</p>
          <div className="flex flex-col gap-1 mb-4">
            {RANGE_PRESETS.map((preset) => {
              const isSelected = value.preset === preset.id;
              return (
                <button
                  key={preset.id}
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
                  max={endDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#2563eb]"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold block mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
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

function ExportMenu({ stats, dateRange }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState('');
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const period = prettyRange(dateRange.from, dateRange.to);

  const exportOverview = () => {
    const rows = [
      ['Period', period],
      ['Total campaigns', stats.totalCampaigns || 0],
      ['Active campaigns', stats.activeCampaigns || 0],
      ['Completed campaigns', stats.completedCampaigns || 0],
      ['Collaborations', stats.collabStats?.total || stats.totalRequests || 0],
      ['Active collaborations', stats.collabStats?.active || 0],
      ['Pending requests', stats.pendingRequests || 0],
      ['Influencers contacted', stats.totalInfluencersContacted || 0],
      ['Escrow funded (range)', stats.brandSpending?.totalFunded || 0],
      ['Paid to creators (range)', stats.brandSpending?.totalReleased || 0],
      ['Held in escrow', stats.brandSpending?.heldInEscrow || 0],
    ];
    downloadText(toCsv(['Metric', 'Value'], rows), `brandly-overview-${stamp()}.csv`, 'text/csv;charset=utf-8');
  };

  const exportSpending = () => {
    const spend = stats.brandSpending || {};
    const rows = (spend.labels || []).map((label, i) => [
      label,
      spend.funded?.[i] || 0,
      spend.released?.[i] || 0,
      spend.payoutRate?.[i] || 0,
    ]);
    downloadText(
      toCsv(['Month', 'Escrow funded', 'Paid to creators', 'Payout rate %'], rows),
      `brandly-spending-${stamp()}.csv`,
      'text/csv;charset=utf-8'
    );
  };

  const exportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      period,
      range: { from: dateRange.from || null, to: dateRange.to || null },
      stats,
    };
    downloadText(JSON.stringify(payload, null, 2), `brandly-dashboard-${stamp()}.json`, 'application/json');
  };

  const exportCollaborations = async () => {
    const res = await collaborationService.getAll({ limit: 100 });
    const list = res?.data?.collaborations || res?.collaborations || [];
    const rows = list.map((row) => [
      row._id,
      row.title || '',
      row.status || '',
      row.campaign?.name || '',
      row.influencer?.name || row.influencer?.username || '',
      row.agreedBudget || 0,
      row.totalPaidAmount || 0,
      row.createdAt ? new Date(row.createdAt).toISOString() : '',
    ]);
    downloadText(
      toCsv(['ID', 'Title', 'Status', 'Campaign', 'Creator', 'Budget', 'Paid', 'Created'], rows),
      `brandly-collaborations-${stamp()}.csv`,
      'text/csv;charset=utf-8'
    );
  };

  const exportCampaigns = async () => {
    const data = await campaignService.getCampaigns({ limit: 100 });
    const list = data?.campaigns || data?.docs || (Array.isArray(data) ? data : []);
    const rows = list.map((row) => [
      row._id,
      row.name || row.title || '',
      row.status || '',
      row.campaignTimeline?.startDate || '',
      row.campaignTimeline?.endDate || '',
      row.createdAt ? new Date(row.createdAt).toISOString() : '',
    ]);
    downloadText(
      toCsv(['ID', 'Name', 'Status', 'Start', 'End', 'Created'], rows),
      `brandly-campaigns-${stamp()}.csv`,
      'text/csv;charset=utf-8'
    );
  };

  const run = async (id, fn) => {
    setBusy(id);
    try {
      await fn();
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setBusy('');
    }
  };

  const options = [
    { id: 'overview', label: 'Overview CSV', icon: FileSpreadsheet, action: () => run('overview', exportOverview) },
    { id: 'spending', label: 'Spending CSV', icon: DollarSign, action: () => run('spending', exportSpending) },
    { id: 'collabs', label: 'Collaborations CSV', icon: FileText, action: () => run('collabs', exportCollaborations) },
    { id: 'campaigns', label: 'Campaigns CSV', icon: FileText, action: () => run('campaigns', exportCampaigns) },
    { id: 'json', label: 'JSON report', icon: FileJson, action: () => run('json', exportJson) },
  ];

  return (
    <div className="relative" ref={wrapRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 bg-[#2563eb] hover:bg-blue-700 text-white rounded-xl px-3 sm:px-4 py-2 font-semibold text-xs transition-colors shadow-sm"
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        <span>Export</span>
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#e2e8f0] py-2 z-[220]">
          {options.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={opt.action}
                disabled={!!busy}
                className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-left text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#2563eb] disabled:opacity-50"
              >
                {busy === opt.id ? <Loader2 size={14} className="animate-spin text-blue-500" /> : <Icon size={14} />}
                {opt.label}
              </button>
            );
          })}
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

// Decorative sparklines (chart look stays; numbers below are live)
const SPARK_COLLABS = [30, 40, 35, 50, 49, 60, 70, 91, 125];
const SPARK_SPEND = [10, 15, 20, 18, 25, 30, 45, 40, 50];
const SPARK_TASKS = [100, 90, 85, 95, 80, 75, 70, 60, 55];
const SPARK_RATE = [80, 85, 84, 88, 90, 92, 91, 93, 94];
const SPARK_ROI = [2.1, 2.3, 2.5, 2.4, 2.8, 2.9, 3.1, 3.0, 3.2];

const CAMP_COLORS = [
  'bg-orange-100 text-orange-600',
  'bg-emerald-100 text-emerald-600',
  'bg-blue-100 text-blue-600',
  'bg-violet-100 text-violet-600',
  'bg-amber-100 text-amber-600',
];

const campaignProgress = (camp) => {
  if (!camp) return 0;
  if (camp.status === 'completed') return 100;
  if (camp.status === 'draft' || camp.status === 'pending') return 0;
  const start = new Date(camp.campaignTimeline?.startDate || camp.createdAt);
  const end = new Date(camp.campaignTimeline?.endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return 0;
  return Math.min(100, Math.max(0, Math.round(((Date.now() - start.getTime()) / (end - start)) * 100)));
};

const statusBadgeClass = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'active') return 'bg-emerald-50 text-emerald-600';
  if (s === 'completed') return 'bg-blue-50 text-blue-600';
  if (s === 'pending') return 'bg-amber-50 text-amber-600';
  if (s === 'cancelled') return 'bg-rose-50 text-rose-600';
  return 'bg-slate-100 text-slate-600';
};

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
  const { conversations = [] } = useSelector((state) => state.chat || { conversations: [] });

  // Chart view toggles
  const [spendingView, setSpendingView] = useState('combo');   // 'bar' | 'line' | 'combo'
  const [collabView,   setCollabView]   = useState('donut');  // 'donut' | 'list' | 'radar'
  const [flowView,     setFlowView]     = useState('multi');  // 'multi' | 'area'
  const [roiView,      setRoiView]      = useState('roi');    // 'roi' | 'channel' | 'trend'
  const [mapView,      setMapView]      = useState('density'); // 'density' | 'category'
  const [socialView,   setSocialView]   = useState('engagement'); // 'engagement' | 'reach' | 'content'
  const [dateRange, setDateRange] = useState(() => ({
    from: '',
    to: '',
    preset: 'all',
  }));
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    completedCampaigns: 0,
    pendingCampaigns: 0,
    draftCampaigns: 0,
    totalRequests: 0,
    acceptedRequests: 0,
    pendingRequests: 0,
    totalInfluencersContacted: 0,
    recentCampaigns: [],
    campaignsFlow: {
      labels: [],
      campaigns: [],
      requests: [],
      completed: [],
      lastYearCampaigns: [],
    },
    influencerMap: { markers: [], categories: [], locatedCount: 0, totalInfluencers: 0 },
    brandSpending: {
      labels: [],
      funded: [],
      released: [],
      lastYearFunded: [],
      lastYearReleased: [],
      payoutRate: [],
      totalFunded: 0,
      totalReleased: 0,
      allTimeFunded: 0,
      allTimeReleased: 0,
      heldInEscrow: 0,
    },
    collabStats: {
      completed: 0,
      active: 0,
      inProgress: 0,
      pending: 0,
      closed: 0,
      total: 0,
      donut: { labels: ['Completed', 'Active', 'In Progress'], data: [0, 0, 0] },
      radar: { labels: ['Completed', 'Active', 'In Progress', 'Pending', 'Closed'], data: [0, 0, 0, 0, 0] },
    },
  });

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    let cancelled = false;
    const params = dateRange.from && dateRange.to ? { from: dateRange.from, to: dateRange.to } : {};
    api.get('/brands/dashboard', { params })
      .then((r) => {
        if (!cancelled && r.data?.success) setStats((prev) => ({ ...prev, ...r.data.data }));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [dateRange.from, dateRange.to]);

  const recentActivity = notifications?.slice(0, 4) || [];
  const mobileActivity = notifications?.slice(0, 2) || [];

  const otherParticipant = (participants) =>
    (participants || []).find((p) => p && typeof p === 'object' && String(p._id) !== String(user?._id));

  const recentMessages = (conversations || [])
    .slice()
    .sort((a, b) => new Date(b.lastMessage?.createdAt || b.updatedAt || 0) - new Date(a.lastMessage?.createdAt || a.updatedAt || 0))
    .slice(0, 4);

  const liveCampaigns = stats.recentCampaigns || [];
  const hasCampaigns = (stats.totalCampaigns || 0) > 0;
  const completionRate = hasCampaigns
    ? Math.round(((stats.completedCampaigns || 0) / stats.totalCampaigns) * 100)
    : 0;
  const collabStats = stats.collabStats || {};
  const donutLabels = collabStats.donut?.labels || ['Completed', 'Active', 'In Progress'];
  const donutData = collabStats.donut?.data || [0, 0, 0];
  const radarLabels = collabStats.radar?.labels || ['Completed', 'Active', 'In Progress', 'Pending', 'Closed'];
  const radarData = collabStats.radar?.data || [0, 0, 0, 0, 0];
  const liveDonut = (collabStats.total || 0) > 0 || donutData.some((n) => Number(n) > 0);
  const donutColors = ['#10b981', '#2563eb', '#f59e0b'];
  const campaignsFlow = stats.campaignsFlow || {};
  const flowLabels = campaignsFlow.labels || [];
  const flowHasData = [
    ...(campaignsFlow.campaigns || []),
    ...(campaignsFlow.requests || []),
    ...(campaignsFlow.completed || []),
    ...(campaignsFlow.lastYearCampaigns || []),
  ].some((n) => Number(n) > 0);
  const brandSpending = stats.brandSpending || {};
  const spendingLabels = brandSpending.labels || [];
  const spendingHasData = [
    ...(brandSpending.funded || []),
    ...(brandSpending.released || []),
    ...(brandSpending.lastYearFunded || []),
  ].some((n) => Number(n) > 0) || Number(brandSpending.allTimeFunded) > 0;
  const formatSpend = (n) => `$${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-6 lg:px-8 pt-3 pb-8 flex flex-col gap-4 sm:gap-5">
      
      {/* Page Actions (Top Header - Responsive) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1e293b] tracking-tight">Dashboard Overview</h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5 hidden sm:block">Track your campaigns, spending, and influencer performance.</p>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <ExportMenu stats={stats} dateRange={dateRange} />
        </div>
      </div>

      {/* Top Row: Social Media Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Social Media Analytics Chart */}
        <div className="lg:col-span-8">
          <ChartCard
            title="Social Media Performance"
            subtitle="Track reach, engagement, and tasks from influencer collaborations"
            headerAction={
              <div className="flex flex-wrap items-center gap-2">
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
            <div className="w-full h-[240px] sm:h-[280px]">
              <SocialMediaAreaChart mode={socialView} />
            </div>
          </ChartCard>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-[#e2e8f0] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-xs font-extrabold text-[#1e293b] uppercase tracking-wider">Recent Activity</h3>
              <button 
                 onClick={() => dispatch(fetchNotifications())}
                 disabled={loadingNotifications}
                 className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                 title="Refresh Activity"
              >
                 <RefreshCw className={`w-3.5 h-3.5 ${loadingNotifications ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="flex flex-col gap-2">
              {recentActivity.length > 0 ? (
                (window.innerWidth < 640 ? mobileActivity : recentActivity).map(activity => {
                  const style = getActivityStyle(activity.type);
                  const getActivityRoute = (act) => {
                    const t = (act.type || '').toLowerCase();
                    if (t.includes('collab') || act.collaborationId) return '/brand/collaborations';
                    if (t.includes('campaign') || act.campaignId) return '/brand/campaigns';
                    if (t.includes('request') || act.requestId) return '/brand/requests/sent';
                    if (t.includes('message') || t.includes('chat')) return '/messages';
                    if (t.includes('payment') || t.includes('escrow')) return '/brand/payments';
                    return '/brand/collaborations';
                  };

                  return (
                    <div 
                      key={activity._id || activity.id} 
                      onClick={() => navigate(getActivityRoute(activity))}
                      className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-md cursor-pointer transition-all group"
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${style.bg} group-hover:scale-105 transition-transform shadow-sm`}>
                        {style.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#1e293b] group-hover:text-blue-600 transition-colors truncate">{activity.title}</p>
                        <p className="text-[11px] font-medium text-slate-500 mt-0.5 line-clamp-1 leading-snug">
                          {activity.message} • {formatDistanceToNow(new Date(activity.createdAt || Date.now()), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-slate-400 text-xs py-8">No recent activity</div>
              )}
            </div>
          </div>

          {/* View All Activity Link */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-center">
            <button
              onClick={() => navigate('/notifications')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1.5 transition-all"
            >
              View All Notifications & Activity <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
        <StatCard 
          title="Total Campaigns" 
          value={String(stats.totalCampaigns || 0)} 
          change={`${stats.activeCampaigns || 0} active`}
          changeType="positive"
          sparklineData={SPARK_COLLABS}
          sparklineColor="#3b82f6"
          sparklineBgColor="rgba(59, 130, 246, 0.1)"
        />
        <StatCard 
          title="Collaborations" 
          value={String(stats.acceptedRequests || 0)} 
          change={`${stats.pendingRequests || 0} pending`}
          changeType="positive"
          sparklineData={SPARK_SPEND}
          sparklineColor="#10b981"
          sparklineBgColor="rgba(16, 185, 129, 0.1)"
        />
        <StatCard 
          title="Influencers" 
          value={String(stats.totalInfluencersContacted || 0)} 
          change={`${stats.totalRequests || 0} requests`}
          changeType="neutral"
          sparklineData={SPARK_TASKS}
          sparklineColor="#f43f5e"
          sparklineBgColor="rgba(244, 63, 94, 0.1)"
        />
        <StatCard 
          title="Completion Rate" 
          value={`${completionRate}%`} 
          change={`${stats.completedCampaigns || 0} done`}
          changeType="positive"
          sparklineData={SPARK_RATE}
          sparklineColor="#8b5cf6"
          sparklineBgColor="rgba(139, 92, 246, 0.1)"
        />
        <StatCard 
          title="Active Now" 
          value={String(stats.activeCampaigns || 0)} 
          change={`${stats.pendingCampaigns || 0} upcoming`}
          changeType="positive"
          sparklineData={SPARK_ROI}
          sparklineColor="#f59e0b"
          sparklineBgColor="rgba(245, 158, 11, 0.1)"
        />
      </div>

      {/* Middle Row 1: Spending & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Brand Spending Bar Chart */}
        <div className="lg:col-span-8">
          <ChartCard 
            title="Brand Spending" 
            subtitle={
              spendingHasData
                ? `${formatSpend(brandSpending.totalFunded)} funded · ${formatSpend(brandSpending.totalReleased)} paid · ${formatSpend(brandSpending.heldInEscrow)} in escrow`
                : "Escrow funded vs paid to creators — last 12 months"
            }
            headerAction={
              <div className="flex flex-wrap items-center gap-2">
                <ChartToggle
                  options={[
                    { label: 'Bar', value: 'bar' },
                    { label: 'Line', value: 'line' },
                    { label: 'Combo', value: 'combo' },
                  ]}
                  value={spendingView}
                  onChange={setSpendingView}
                />
              </div>
            }
            className="h-full"
          >
            <div className="w-full h-[260px] sm:h-[300px]">
              {!spendingHasData ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <p className="text-sm font-semibold text-slate-600">No escrow spend yet</p>
                  <p className="text-xs text-slate-400 mt-1">Fund a collaboration to see real spending here.</p>
                  <button
                    onClick={() => navigate('/brand/collaborations')}
                    className="mt-3 text-xs font-bold text-blue-600 hover:underline"
                  >
                    Go to collaborations
                  </button>
                </div>
              ) : spendingView === 'bar' ? (
                <StackedBarChart
                  labels={spendingLabels}
                  dataset1={brandSpending.funded}
                  dataset2={brandSpending.released}
                  label1="Escrow funded"
                  label2="Paid to creators"
                  stacked={false}
                />
              ) : spendingView === 'line' ? (
                <SpendingLineChart
                  labels={spendingLabels}
                  dataset1={brandSpending.funded}
                  dataset2={brandSpending.released}
                  label1="Escrow funded"
                  label2="Paid to creators"
                />
              ) : (
                <SpendingComboChart
                  labels={spendingLabels}
                  funded={brandSpending.funded}
                  released={brandSpending.released}
                  payoutRate={brandSpending.payoutRate}
                />
              )}
            </div>
          </ChartCard>
        </div>

        <div className="lg:col-span-4">
          <ChartCard 
            title="Collaboration Stats" 
            subtitle={liveDonut ? `${collabStats.total || 0} collabs in ${prettyRange(dateRange.from, dateRange.to).toLowerCase()}` : 'Status of collaborations in this period'}
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
            <div className="w-full h-[250px] sm:h-[280px] flex items-center justify-center">
              {!liveDonut ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <p className="text-sm font-semibold text-slate-600">No collaborations yet</p>
                  <p className="text-xs text-slate-400 mt-1">Invite a creator to see status here.</p>
                  <button
                    onClick={() => navigate('/brand/collaborations')}
                    className="mt-3 text-xs font-bold text-blue-600 hover:underline"
                  >
                    Go to collaborations
                  </button>
                </div>
              ) : collabView === 'donut' ? (
                <StatsDoughnutChart
                  data={donutData}
                  labels={donutLabels}
                  colors={donutColors}
                  centerLabel="Collabs"
                />
              ) : collabView === 'list' ? (
                <StatsList
                  data={donutData}
                  labels={donutLabels}
                  colors={donutColors}
                />
              ) : (
                <CollabRadarChart data={radarData} labels={radarLabels} />
              )}
            </div>
          </ChartCard>
        </div>

      </div>

      {/* Middle Row 2: Map & Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Enhanced Heat Map with toggle */}
        <div className="lg:col-span-6">
          <ChartCard 
            title="Influencer Map" 
            subtitle={
              mapView === 'density'
                ? `${stats.influencerMap?.locatedCount || 0} creators pinned on the map`
                : `${stats.influencerMap?.totalInfluencers || 0} creators by niche`
            }
            headerAction={
              <ChartToggle
                options={[{ label: 'Density', value: 'density' }, { label: 'Category', value: 'category' }]}
                value={mapView}
                onChange={setMapView}
              />
            }
            className="h-full"
          >
            <div className="w-full h-[280px] sm:h-[320px] bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
              <HeatMap
                viewMode={mapView}
                markers={stats.influencerMap?.markers || []}
                categories={stats.influencerMap?.categories || []}
                locatedCount={stats.influencerMap?.locatedCount || 0}
                onMarkerClick={(marker) => {
                  const q = marker.city || marker.name;
                  if (q) navigate(`/brand/influencer?q=${encodeURIComponent(q)}`);
                }}
              />
            </div>
          </ChartCard>
        </div>

        {/* Campaigns Flow */}
        <div className="lg:col-span-6">
          <ChartCard 
            title="Campaigns Flow" 
            subtitle="Campaigns created, collab requests, and completions — last 12 months"
            headerAction={
              <ChartToggle
                options={[{ label: 'Multi-line', value: 'multi' }, { label: 'Area', value: 'area' }]}
                value={flowView}
                onChange={setFlowView}
              />
            }
            className="h-full"
          >
            <div className="w-full h-[260px] sm:h-[300px]">
              {!flowHasData ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <p className="text-sm font-semibold text-slate-600">No campaign activity yet</p>
                  <p className="text-xs text-slate-400 mt-1">Create a campaign or send a request to see this chart.</p>
                  <button
                    onClick={() => navigate('/brand/campaigns')}
                    className="mt-3 text-xs font-bold text-blue-600 hover:underline"
                  >
                    Go to campaigns
                  </button>
                </div>
              ) : flowView === 'multi' ? (
                <MultiLineChart
                  labels={flowLabels}
                  campaigns={campaignsFlow.campaigns}
                  requests={campaignsFlow.requests}
                  completed={campaignsFlow.completed}
                />
              ) : (
                <AreaFrequencyChart
                  labels={flowLabels}
                  thisPeriod={campaignsFlow.campaigns}
                  lastPeriod={campaignsFlow.lastYearCampaigns}
                />
              )}
            </div>
          </ChartCard>
        </div>

      </div>

      {/* Bottom Row: Messages & Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Recent Messages */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-[#e2e8f0] flex flex-col">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#1e293b] uppercase tracking-wider">Recent Messages</h3>
              <button onClick={() => navigate('/messages')} className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">View All</button>
           </div>

           {recentMessages.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
               <p className="text-sm font-semibold text-slate-600">No messages yet</p>
               <button onClick={() => navigate('/messages')} className="mt-2 text-xs font-bold text-blue-600 hover:underline">Open inbox</button>
             </div>
           ) : (
             <>
           <div className="flex sm:hidden flex-col gap-3 flex-1">
             {recentMessages.slice(0, 2).map((conv) => {
               const other = otherParticipant(conv.participants);
               const name = other?.fullname || other?.username || 'Unknown';
               const when = conv.lastMessage?.createdAt
                 ? formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: true })
                 : '';
               const isOnline = other?.status === 'active' || other?.status === 'online';
               return (
               <div 
                 key={conv._id} 
                 onClick={() => navigate('/messages', { state: { userName: name } })} 
                 className="flex items-start gap-3 group cursor-pointer hover:bg-slate-50 p-1.5 rounded-xl transition-colors"
               >
                  <div className="relative">
                     <UserAvatar src={other?.profilePic} name={name} className="w-9 h-9 rounded-full" textClassName="text-sm" imageType="chat" />
                     <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-bold text-[#1e293b] group-hover:text-blue-600 transition-colors truncate">{name}</p>
                        <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap ml-2">{when}</span>
                     </div>
                     <p className="text-xs font-medium text-slate-500 truncate">{conv.lastMessage?.text || 'New conversation'}</p>
                  </div>
               </div>
               );
             })}
           </div>

           <div className="hidden sm:flex flex-col gap-5 flex-1">
             {recentMessages.map((conv) => {
               const other = otherParticipant(conv.participants);
               const name = other?.fullname || other?.username || 'Unknown';
               const when = conv.lastMessage?.createdAt
                 ? formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: true })
                 : '';
               const isOnline = other?.status === 'active' || other?.status === 'online';
               return (
               <div 
                 key={conv._id} 
                 onClick={() => navigate('/messages', { state: { userName: name } })} 
                 className="flex items-start gap-3 group cursor-pointer hover:bg-slate-50 p-1.5 rounded-xl transition-colors"
               >
                  <div className="relative">
                     <UserAvatar src={other?.profilePic} name={name} className="w-9 h-9 rounded-full" textClassName="text-sm" imageType="chat" />
                     <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-bold text-[#1e293b] group-hover:text-blue-600 transition-colors truncate">{name}</p>
                        <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap ml-2">{when}</span>
                     </div>
                     <p className="text-xs font-medium text-slate-500 truncate">{conv.lastMessage?.text || 'New conversation'}</p>
                  </div>
               </div>
               );
             })}
           </div>
             </>
           )}
        </div>

        {/* Active Campaigns - Table on desktop, cards on mobile */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-[#e2e8f0] flex flex-col">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-[#1e293b]">Active Campaigns</h3>
              <button onClick={() => navigate('/brand/campaigns')} className="text-xs font-bold text-blue-600 hover:underline">Manage All</button>
           </div>
           
           {liveCampaigns.length === 0 ? (
             <div className="py-12 text-center">
               <p className="text-sm font-semibold text-slate-600 mb-1">No campaigns yet</p>
               <button onClick={() => navigate('/brand/campaigns/new')} className="text-xs font-bold text-blue-600 hover:underline">Create Campaign</button>
             </div>
           ) : (
             <>
           <div className="flex flex-col gap-3 sm:hidden">
             {liveCampaigns.map((camp, i) => {
               const progress = campaignProgress(camp);
               return (
               <div key={camp._id} onClick={() => navigate(`/brand/campaigns/${camp._id}/edit`)} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
                 <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${CAMP_COLORS[i % CAMP_COLORS.length]}`}>
                   <TrendingUp className="w-4 h-4" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <div className="flex items-center justify-between gap-2 mb-1.5">
                     <p className="text-sm font-bold text-[#1e293b] truncate">{camp.name}</p>
                     <span className={`${statusBadgeClass(camp.status)} text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex-shrink-0`}>{camp.status}</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
                     </div>
                     <span className="text-[10px] font-bold text-slate-500">{progress}%</span>
                   </div>
                 </div>
               </div>
               );
             })}
           </div>

           <div className="hidden sm:block overflow-x-auto">
             <table className="w-full text-left">
                <thead className="border-b border-[#e2e8f0]">
                   <tr>
                      <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Campaign Name</th>
                      <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-1/3">Progress</th>
                      <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                   {liveCampaigns.map((camp, i) => {
                     const progress = campaignProgress(camp);
                     return (
                     <tr key={camp._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4">
                           <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${CAMP_COLORS[i % CAMP_COLORS.length]}`}>
                                 <TrendingUp className="w-4 h-4" />
                              </div>
                              <p className="text-sm font-bold text-[#1e293b]">{camp.name}</p>
                           </div>
                        </td>
                        <td className="py-4">
                           <span className={`${statusBadgeClass(camp.status)} text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider`}>
                              {camp.status}
                           </span>
                        </td>
                        <td className="py-4">
                           <div className="flex items-center gap-3">
                              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
                              </div>
                              <span className="text-[10px] font-bold text-slate-600 w-8">{progress}%</span>
                           </div>
                        </td>
                        <td className="py-4 text-right">
                           <button onClick={() => navigate(`/brand/campaigns/${camp._id}/edit`)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                              <MoreVertical className="w-4 h-4" />
                           </button>
                        </td>
                     </tr>
                     );
                   })}
                </tbody>
             </table>
           </div>
             </>
           )}
        </div>

      </div>

    </div>
  );
}