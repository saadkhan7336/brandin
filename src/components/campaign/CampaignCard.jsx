import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MoreVertical, Edit2, Trash2, X, Handshake,
  Calendar, DollarSign, ArrowRight, CheckCircle2, Sparkles
} from 'lucide-react';
import { formatDate } from '../../utils/campaignHelpers';
import { getOptimizedImage } from '../../utils/imageOptimization';
import SocialIcon from '../common/SocialIcon';

const STATUS_CFG = {
  active:      { dot: 'bg-emerald-500', pill: 'text-emerald-700 bg-emerald-50 border-emerald-200', label: 'Active',      border: '#10b981' },
  pending:     { dot: 'bg-amber-500',   pill: 'text-amber-700 bg-amber-50 border-amber-200',       label: 'Pending',     border: '#f59e0b' },
  completed:   { dot: 'bg-slate-400',   pill: 'text-slate-600 bg-slate-50 border-slate-200',       label: 'Completed',   border: '#64748b' },
  draft:       { dot: 'bg-slate-400',   pill: 'text-slate-500 bg-slate-100 border-slate-200',      label: 'Draft',       border: '#94a3b8' },
  cancelled:   { dot: 'bg-rose-500',    pill: 'text-rose-700 bg-rose-50 border-rose-200',          label: 'Cancelled',   border: '#f43f5e' },
  in_progress: { dot: 'bg-indigo-500',  pill: 'text-indigo-700 bg-indigo-50 border-indigo-200',    label: 'In Progress', border: '#6366f1' },
  review:      { dot: 'bg-purple-500',  pill: 'text-purple-700 bg-purple-50 border-purple-200',    label: 'Review',      border: '#a855f7' },
  paused:      { dot: 'bg-orange-500',  pill: 'text-orange-700 bg-orange-50 border-orange-200',    label: 'Paused',      border: '#f97316' },
};

const GRADS = [
  ['#6366f1','#8b5cf6'], ['#0ea5e9','#6366f1'], ['#10b981','#0ea5e9'],
  ['#f59e0b','#f97316'], ['#f43f5e','#a855f7'], ['#06b6d4','#3b82f6'],
];

const PLATFORM_COLOR = {
  instagram: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-600', border: 'border-fuchsia-200' },
  youtube:   { bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-200'     },
  tiktok:    { bg: 'bg-sky-50',     text: 'text-sky-600',     border: 'border-sky-200'     },
  twitter:   { bg: 'bg-sky-50',     text: 'text-sky-600',     border: 'border-sky-200'     },
  facebook:  { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200'    },
  linkedin:  { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200'    },
};

const CampaignCard = ({ campaign, onEdit, onDelete, onReactivate }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const status = campaign.status?.toLowerCase() || 'pending';
  const cfg = STATUS_CFG[status] || STATUS_CFG.pending;

  const platforms = Array.isArray(campaign.platform)
    ? campaign.platform
    : typeof campaign.platform === 'string'
      ? campaign.platform.split(',').map(s => s.trim()).filter(Boolean)
      : [];

  const budgetLabel = campaign.budget?.min && campaign.budget?.max
    ? `$${Number(campaign.budget.min).toLocaleString()} – $${Number(campaign.budget.max).toLocaleString()}`
    : campaign.budget
      ? `$${Number(campaign.budget).toLocaleString()}`
      : 'Negotiable';

  const initials = (campaign.name || 'CA').slice(0, 2).toUpperCase();
  const grad = GRADS[(campaign.name?.charCodeAt(0) || 0) % GRADS.length];
  const industry = campaign.industry || campaign.category || 'General';

  return (
    <div
      className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 group hover:-translate-y-0.5"
      style={{ borderLeft: `4px solid ${cfg.border}` }}
    >
      {/* Title & Status Header */}
      <div className="flex-1 min-w-0 w-full space-y-1">
        <div className="flex items-center justify-between sm:justify-start gap-2 flex-wrap">
          <h3 className="text-sm sm:text-[15px] font-black text-[#1e293b] group-hover:text-blue-600 transition-colors truncate max-w-full sm:max-w-[320px] leading-snug">
            {campaign.name || 'Untitled Campaign'}
          </h3>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border flex-shrink-0 ${cfg.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-[11px] text-slate-400 font-semibold flex-wrap">
          <span className="inline-flex items-center gap-1 uppercase tracking-wider text-slate-500 font-bold">{industry}</span>
          <span className="text-slate-200">·</span>
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDate(campaign.createdAt)}</span>
          <span className="text-slate-200">·</span>
          <span className="flex items-center gap-1 font-black text-blue-600"><DollarSign className="w-3.5 h-3.5" />{budgetLabel}</span>
        </div>
      </div>

      {/* Platform pills */}
      <div className="hidden md:flex items-center gap-1.5 flex-shrink-0 flex-wrap max-w-[200px]">
        {platforms.length > 0 ? (
          platforms.slice(0, 3).map((p, i) => {
            const clr = PLATFORM_COLOR[p.toLowerCase()] || { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' };
            return (
              <span key={i} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${clr.bg} ${clr.text} ${clr.border}`}>
                <SocialIcon platformName={p} size="xs" />
                {p.toUpperCase()}
              </span>
            );
          })
        ) : (
          <span className="text-[11px] font-medium text-slate-400">All Platforms</span>
        )}
        {platforms.length > 3 && (
          <span className="text-[10px] font-bold text-slate-400">+{platforms.length - 3}</span>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {campaign.ongoingCollaborationId ? (
          <button
            onClick={() => navigate('/brand/collaborations')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#0f172a] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wide rounded-xl shadow-sm transition-all group/btn"
          >
            <Handshake className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Collab</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </button>
        ) : (
          <button
            onClick={() => onEdit && onEdit(campaign)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#0f172a] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wide rounded-xl shadow-sm transition-all group/btn"
          >
            <span className="hidden sm:inline">View Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </button>
        )}

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-9 h-9 bg-white text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center justify-center transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50">
              <button
                onClick={() => { onEdit(campaign); setShowMenu(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <Edit2 className="w-4 h-4" /> Edit Campaign
              </button>
              <button
                onClick={() => { onDelete(campaign._id); setShowMenu(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                {status === 'active' ? (
                  <><X className="w-4 h-4" /> Cancel Campaign</>
                ) : status === 'completed' ? (
                  <div onClick={(e) => { e.stopPropagation(); onReactivate(campaign); setShowMenu(false); }}
                    className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" /> Reactivate
                  </div>
                ) : (
                  <><Trash2 className="w-4 h-4" /> Delete Campaign</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
