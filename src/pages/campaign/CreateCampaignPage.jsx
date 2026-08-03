import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft, ArrowRight, Check, Sparkles,
  Target, DollarSign, Calendar, Users,
  Instagram, Youtube, Twitter, Facebook, Linkedin,
  Globe, Zap, ShoppingCart, BarChart2, PenTool,
  Upload, X, FileText, ChevronRight, Rocket,
  Save, Eye, AlertCircle
} from 'lucide-react';
import campaignService from '../../services/campaignService';
import { addCampaign } from '../../redux/slices/campaignSlice';
import { compressImage } from '../../utils/imageCompression';

// ─── Constants ────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Basics',    icon: FileText,   desc: 'Name, industry & description' },
  { id: 2, label: 'Budget',    icon: DollarSign, desc: 'Budget range & timeline' },
  { id: 3, label: 'Targeting', icon: Target,     desc: 'Platforms & campaign goals' },
  { id: 4, label: 'Review',    icon: Eye,        desc: 'Review & publish' },
];

const INDUSTRIES = [
  'Technology','Fashion','Health','Food','Travel',
  'Education','Beauty','Fitness','Gaming','Lifestyle','Finance','Entertainment'
];

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', bg: 'bg-rose-50',   border: 'border-rose-200',   text: 'text-rose-600',    Icon: Instagram },
  { id: 'youtube',   label: 'YouTube',   bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-600',     Icon: Youtube   },
  { id: 'twitter',   label: 'Twitter/X', bg: 'bg-sky-50',    border: 'border-sky-200',    text: 'text-sky-600',     Icon: Twitter   },
  { id: 'facebook',  label: 'Facebook',  bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',    Icon: Facebook  },
  { id: 'linkedin',  label: 'LinkedIn',  bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700',  Icon: Linkedin  },
  { id: 'tiktok',    label: 'TikTok',    bg: 'bg-slate-50',  border: 'border-slate-200',  text: 'text-slate-800',   Icon: Globe     },
];

const GOALS = [
  { id: 'awareness',    label: 'Brand Awareness & Reach',   Icon: Globe,        desc: 'Maximize impressions & brand exposure',  color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  { id: 'conversions',  label: 'Direct Sales & Tracked Conversions', Icon: ShoppingCart, desc: 'Drive affiliate sales & promo code uses', color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-200'},
  { id: 'launch',       label: 'New Product Launch',         Icon: Zap,          desc: 'Create viral hype for product release',  color: 'text-rose-600',   bg: 'bg-rose-50',   border: 'border-rose-200'  },
  { id: 'ugc_content',  label: 'UGC Content Licensing',     Icon: PenTool,      desc: 'High-res content for brand ad campaigns', color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200' },
  { id: 'app_installs', label: 'App Installs & Signups',    Icon: BarChart2,    desc: 'Promote mobile app downloads & trials', color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200'  },
  { id: 'engagement',   label: 'Audience Trust & Engagement',Icon: Users,       desc: 'Deep comments, reviews & unboxings',      color: 'text-teal-600',   bg: 'bg-teal-50',   border: 'border-teal-200'  },
];

// ─── Step Progress Bar ─────────────────────────────────────────────────────────
function StepProgress({ current }) {
  return (
    <div className="flex items-center justify-between w-full py-1 px-1">
      {STEPS.map((step, idx) => {
        const done   = current > step.id;
        const active = current === step.id;
        const Icon   = step.icon;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-2xl flex items-center justify-center border-2 transition-all duration-300 font-black text-xs sm:text-sm
                ${done   ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200'
                : active ? 'bg-blue-50 border-blue-600 text-blue-600 shadow-sm scale-105'
                :          'bg-slate-50 border-slate-200 text-slate-400'}`}>
                {done ? <Check className="w-3.5 h-3.5 sm:w-5 sm:h-5" /> : (
                  <>
                    <span className="xs:hidden text-[11px] font-bold">{step.id}</span>
                    <Icon className="hidden xs:block w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </>
                )}
              </div>
              <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-300
                ${active ? 'text-blue-600 font-black' : done ? 'text-slate-600' : 'text-slate-400'}`}>
                <span className="hidden xs:inline">{step.label}</span>
                <span className="xs:hidden text-[8px]">{step.id}</span>
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 min-w-[6px] sm:min-w-[32px] h-0.5 mx-1 sm:mx-2 mb-3.5 sm:mb-4 rounded-full transition-all duration-500
                ${current > step.id ? 'bg-blue-600' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Step 1: Basics ───────────────────────────────────────────────────────────
function Step1({ data, onChange, errors }) {
  const fileRef = useRef();

  const handleImage = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const compressed = await compressImage(f, 'normal');
      onChange('imageFile', compressed);
      const reader = new FileReader();
      reader.onloadend = () => onChange('imagePreview', reader.result);
      reader.readAsDataURL(compressed);
    } catch {
      onChange('imageFile', f);
      const reader = new FileReader();
      reader.onloadend = () => onChange('imagePreview', reader.result);
      reader.readAsDataURL(f);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Campaign Cover Image</label>
        <div
          onClick={() => fileRef.current.click()}
          className={`relative w-full h-36 rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all group
            ${data.imagePreview ? 'border-blue-300 bg-blue-50/30' : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/30'}`}
        >
          {data.imagePreview ? (
            <>
              <img src={data.imagePreview} alt="cover" className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-80" />
              <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-1.5 text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" /> Change Image
              </div>
              <button type="button"
                onClick={(e) => { e.stopPropagation(); onChange('imageFile', null); onChange('imagePreview', null); }}
                className="absolute top-2 right-2 z-20 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center text-slate-500 hover:text-red-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="text-center">
              <Upload className="w-7 h-7 text-slate-300 mx-auto mb-2 group-hover:text-blue-400 transition-colors" />
              <p className="text-sm font-semibold text-slate-400 group-hover:text-blue-500 transition-colors">Click to upload cover</p>
              <p className="text-[11px] text-slate-300 mt-0.5">PNG, JPG up to 5MB</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
        </div>
      </div>

      {/* Campaign Name */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Campaign Name <span className="text-rose-500">*</span></label>
        <input type="text" value={data.name} onChange={e => onChange('name', e.target.value)}
          placeholder="e.g. Summer Lifestyle Collection 2025"
          className={`w-full px-4 py-3 text-sm text-slate-800 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all placeholder-slate-300
            ${errors.name ? 'border-rose-300 focus:ring-rose-100' : 'border-slate-200 focus:border-blue-400 focus:ring-blue-100'}`} />
        {errors.name && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.name}</p>}
      </div>

      {/* Industry */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Industry <span className="text-rose-500">*</span></label>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map(ind => (
            <button key={ind} type="button" onClick={() => onChange('industry', ind)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold border transition-all duration-200
                ${data.industry === ind
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'}`}>
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Campaign Description <span className="text-rose-500">*</span></label>
        <textarea rows={4} value={data.description} onChange={e => onChange('description', e.target.value)}
          placeholder="Describe your campaign — goals, what you're looking for in creators, and key messages..."
          className={`w-full px-4 py-3 text-sm text-slate-800 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all resize-none placeholder-slate-300
            ${errors.description ? 'border-rose-300 focus:ring-rose-100' : 'border-slate-200 focus:border-blue-400 focus:ring-blue-100'}`} />
        {errors.description && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.description}</p>}
      </div>
    </div>
  );
}

// ─── Step 2: Budget & Timeline ─────────────────────────────────────────────────
function Step2({ data, onChange, errors }) {
  const fmt = (n) => n ? `$${Number(n).toLocaleString()}` : '—';

  return (
    <div className="space-y-6">
      {/* Budget card */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Budget Range <span className="text-rose-500">*</span></label>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Minimum</p>
              <p className="text-xl sm:text-2xl font-black text-blue-600">{fmt(data.minBudget)}</p>
            </div>
            <div className="flex-1 mx-3 sm:mx-4 h-px bg-blue-200" />
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Maximum</p>
              <p className="text-xl sm:text-2xl font-black text-indigo-600">{fmt(data.maxBudget)}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Min Budget (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                <input type="number" min="0" value={data.minBudget} onChange={e => onChange('minBudget', e.target.value)} placeholder="500"
                  className={`w-full pl-7 pr-4 py-2.5 text-sm text-slate-800 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all
                    ${errors.minBudget ? 'border-rose-300 focus:ring-rose-100' : 'border-blue-100 focus:border-blue-400 focus:ring-blue-100'}`} />
              </div>
              {errors.minBudget && <p className="text-xs text-rose-500 mt-1">{errors.minBudget}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Max Budget (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                <input type="number" min="0" value={data.maxBudget} onChange={e => onChange('maxBudget', e.target.value)} placeholder="5000"
                  className={`w-full pl-7 pr-4 py-2.5 text-sm text-slate-800 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all
                    ${errors.maxBudget ? 'border-rose-300 focus:ring-rose-100' : 'border-blue-100 focus:border-blue-400 focus:ring-blue-100'}`} />
              </div>
              {errors.maxBudget && <p className="text-xs text-rose-500 mt-1">{errors.maxBudget}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Presets</p>
        <div className="flex flex-wrap gap-2">
          {[['Starter', 500, 2000], ['Growth', 2000, 7500], ['Pro', 7500, 20000], ['Enterprise', 20000, 100000]].map(([label, min, max]) => (
            <button key={label} type="button"
              onClick={() => { onChange('minBudget', min); onChange('maxBudget', max); }}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold border transition-all
                ${Number(data.minBudget) === min && Number(data.maxBudget) === max
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'}`}>
              {label} <span className="opacity-60">${(min/1000).toFixed(0)}k–${(max/1000).toFixed(0)}k</span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Campaign Timeline <span className="text-rose-500">*</span></label>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="date" value={data.startDate} min={new Date().toISOString().split('T')[0]} onChange={e => onChange('startDate', e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 text-sm text-slate-800 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all
                  ${errors.startDate ? 'border-rose-300 focus:ring-rose-100' : 'border-slate-200 focus:border-blue-400 focus:ring-blue-100'}`} />
            </div>
            {errors.startDate && <p className="text-xs text-rose-500 mt-1">{errors.startDate}</p>}
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="date" value={data.endDate} min={data.startDate || new Date().toISOString().split('T')[0]} onChange={e => onChange('endDate', e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 text-sm text-slate-800 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all
                  ${errors.endDate ? 'border-rose-300 focus:ring-rose-100' : 'border-slate-200 focus:border-blue-400 focus:ring-blue-100'}`} />
            </div>
            {errors.endDate && <p className="text-xs text-rose-500 mt-1">{errors.endDate}</p>}
          </div>
        </div>
        {data.startDate && data.endDate && new Date(data.endDate) > new Date(data.startDate) && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
            <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span className="text-[12px] font-semibold text-emerald-700">
              Campaign duration: {Math.ceil((new Date(data.endDate) - new Date(data.startDate)) / (1000*60*60*24))} days
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 3: Platforms & Goals ─────────────────────────────────────────────────
function Step3({ data, onChange, errors }) {
  const togglePlatform = (id) => {
    const curr = data.platforms || [];
    onChange('platforms', curr.includes(id) ? curr.filter(p => p !== id) : [...curr, id]);
  };
  const toggleGoal = (id) => {
    const curr = data.goals || [];
    onChange('goals', curr.includes(id) ? curr.filter(g => g !== id) : [...curr, id]);
  };

  return (
    <div className="space-y-7">
      {/* Platforms */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Platforms <span className="text-rose-500">*</span></label>
          {(data.platforms || []).length > 0 && (
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">{data.platforms.length} selected</span>
          )}
        </div>
        {errors.platforms && <p className="text-xs text-rose-500 mb-2 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.platforms}</p>}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {PLATFORMS.map(p => {
            const active = (data.platforms || []).includes(p.id);
            const PIcon  = p.Icon;
            return (
              <button key={p.id} type="button" onClick={() => togglePlatform(p.id)}
                className={`relative flex items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border-2 font-semibold text-xs sm:text-sm transition-all duration-200 group
                  ${active ? `${p.bg} ${p.border} ${p.text} shadow-sm scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'}`}>
                <PIcon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${active ? p.text : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className="truncate">{p.label}</span>
                {active && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Goals */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Campaign Goals</label>
          {(data.goals || []).length > 0 && (
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">{data.goals.length} selected</span>
          )}
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {GOALS.map(g => {
            const active = (data.goals || []).includes(g.id);
            const GIcon  = g.Icon;
            return (
              <button key={g.id} type="button" onClick={() => toggleGoal(g.id)}
                className={`relative flex flex-col items-start gap-1 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 text-left group
                  ${active ? `${g.bg} ${g.border} shadow-sm` : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                <div className="flex items-center justify-between w-full">
                  <GIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${active ? g.color : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {active && <Check className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${g.color}`} />}
                </div>
                <span className={`text-[11px] sm:text-[12px] font-bold mt-1 leading-snug ${active ? g.color : 'text-slate-600'}`}>{g.label}</span>
                <span className="text-[10px] text-slate-400 leading-snug line-clamp-2">{g.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Audience */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Target Audience</label>
        <textarea rows={2} value={data.targetAudience} onChange={e => onChange('targetAudience', e.target.value)}
          placeholder="e.g. Women aged 18-35 interested in fitness and wellness..."
          className="w-full px-4 py-3 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all resize-none placeholder-slate-300" />
      </div>
    </div>
  );
}

// ─── Step 4: Review ───────────────────────────────────────────────────────────
function Step4({ data, onChange, errors }) {
  const fmt     = (n) => n ? `$${Number(n).toLocaleString()}` : '—';
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <div className="space-y-5">
      {/* Hero preview */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-5 text-white relative overflow-hidden">
        {data.imagePreview && (
          <img src={data.imagePreview} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        )}
        <div className="relative">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200 block mb-1">{data.industry || 'Campaign'}</span>
          <h2 className="text-xl font-black leading-tight mb-2">{data.name || 'Untitled Campaign'}</h2>
          <p className="text-sm text-blue-100 line-clamp-2 leading-relaxed">{data.description || 'No description'}</p>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Budget</p>
          <p className="text-sm font-bold text-slate-700">{fmt(data.minBudget)} – {fmt(data.maxBudget)}</p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Timeline</p>
          <p className="text-sm font-bold text-slate-700">{fmtDate(data.startDate)} → {fmtDate(data.endDate)}</p>
        </div>
      </div>

      {/* Platforms */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Platforms</p>
        <div className="flex flex-wrap gap-2">
          {!(data.platforms || []).length ? <span className="text-sm text-slate-400">None selected</span>
            : (data.platforms || []).map(id => {
                const p = PLATFORMS.find(x => x.id === id);
                if (!p) return null;
                const PIcon = p.Icon;
                return (
                  <span key={id} className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${p.bg} ${p.text} ${p.border} border rounded-xl text-[12px] font-bold`}>
                    <PIcon className="w-3.5 h-3.5" />{p.label}
                  </span>
                );
              })}
        </div>
      </div>

      {/* Goals */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Goals</p>
        <div className="flex flex-wrap gap-2">
          {!(data.goals || []).length ? <span className="text-sm text-slate-400">None selected</span>
            : (data.goals || []).map(id => {
                const g = GOALS.find(x => x.id === id);
                if (!g) return null;
                const GIcon = g.Icon;
                return (
                  <span key={id} className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${g.bg} ${g.color} ${g.border} border rounded-xl text-[12px] font-bold`}>
                    <GIcon className="w-3.5 h-3.5" />{g.label}
                  </span>
                );
              })}
        </div>
      </div>

      {/* Target audience */}
      {data.targetAudience && (
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Target Audience</p>
          <p className="text-sm text-slate-600">{data.targetAudience}</p>
        </div>
      )}

      {/* Deliverables */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Deliverables</label>
        <textarea rows={2} value={data.deliverables} onChange={e => onChange('deliverables', e.target.value)}
          placeholder="e.g. 2x Instagram posts, 1x Reel, 3x Stories..."
          className="w-full px-4 py-3 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all resize-none placeholder-slate-300" />
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-[12px] text-amber-700 font-medium leading-snug">
          Once published, your campaign will be reviewed and visible to matched influencers. You can edit it anytime from Campaign Hub.
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function CreateCampaignPage() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const [step, setStep]           = useState(1);
  const [dir, setDir]             = useState('forward');
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [errors, setErrors]       = useState({});

  const [formData, setFormData] = useState({
    name: '', industry: 'Technology', description: '',
    minBudget: '', maxBudget: '', startDate: '', endDate: '',
    platforms: [], goals: [], targetAudience: '',
    deliverables: '', additionalRequirements: '',
    imageFile: null, imagePreview: null,
  });

  const onChange = (key, val) => {
    setFormData(p => ({ ...p, [key]: val }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: '' }));
    setGlobalError('');
  };

  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (!formData.name.trim()) e.name = 'Campaign name is required';
      if (!formData.description.trim()) e.description = 'Description is required';
    }
    if (s === 2) {
      if (!formData.minBudget) e.minBudget = 'Enter minimum budget';
      if (!formData.maxBudget) e.maxBudget = 'Enter maximum budget';
      if (formData.minBudget && formData.maxBudget && Number(formData.minBudget) > Number(formData.maxBudget))
        e.maxBudget = 'Max must be \u2265 min budget';
      if (!formData.startDate) e.startDate = 'Start date required';
      if (!formData.endDate)   e.endDate   = 'End date required';
      if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate))
        e.endDate = 'End date must be after start';
    }
    if (s === 3) {
      if (!formData.platforms.length) e.platforms = 'Select at least one platform';
    }
    return e;
  };

  const goNext = () => {
    const e = validate(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setDir('forward');
    setStep(p => p + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setDir('backward');
    setStep(p => p - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const buildPayload = (asDraft = false) => {
    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('industry', formData.industry);
    fd.append('description', formData.description);
    fd.append('deliverables', formData.deliverables || '');
    fd.append('targetAudience', formData.targetAudience || '');
    fd.append('additionalRequirements', formData.additionalRequirements || '');
    fd.append('budget[min]', Number(formData.minBudget) || 0);
    fd.append('budget[max]', Number(formData.maxBudget) || 0);
    fd.append('campaignTimeline[startDate]', formData.startDate);
    fd.append('campaignTimeline[endDate]', formData.endDate);
    formData.platforms.forEach(p => fd.append('platform[]', p));
    formData.goals.forEach(g => fd.append('goals[]', g));
    fd.append('status', asDraft ? 'draft' : 'pending');
    if (formData.imageFile) fd.append('image', formData.imageFile);
    return fd;
  };

  const handleSaveDraft = async () => {
    if (!formData.name.trim()) { setErrors({ name: 'Enter a name to save draft' }); setStep(1); return; }
    try {
      setSubmitting(true);
      const data = await campaignService.createCampaign(buildPayload(true));
      dispatch(addCampaign(data));
      navigate('/brand/campaigns');
    } catch (err) {
      setGlobalError(err.response?.data?.message || 'Failed to save draft');
    } finally { setSubmitting(false); }
  };

  const handlePublish = async () => {
    const allErrors = { ...validate(1), ...validate(2), ...validate(3) };
    if (Object.keys(allErrors).length) {
      setGlobalError('Please complete all required fields before publishing.');
      return;
    }
    try {
      setSubmitting(true);
      const data = await campaignService.createCampaign(buildPayload(false));
      dispatch(addCampaign(data));
      navigate('/brand/campaigns');
    } catch (err) {
      setGlobalError(err.response?.data?.message || 'Failed to create campaign');
    } finally { setSubmitting(false); }
  };

  const TIPS = [
    'Use a specific, descriptive name. Campaigns with detailed descriptions get 3x more applications.',
    'Set a realistic budget range. Influencers can see your budget and decide if it fits their rates.',
    'Select all platforms where you want content. Multi-platform campaigns perform 40% better.',
    'Review carefully. Once published, your campaign is visible to matched influencers within minutes.',
  ];

  return (
    <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-4 md:px-6 pb-16 pt-2">
      {/* Page header */}
      <div className="flex items-center justify-between gap-2 mb-4 sm:mb-8">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/brand/campaigns')}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs sm:text-sm font-medium transition-colors group shrink-0">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Back to Campaigns</span>
            <span className="sm:hidden">Back</span>
          </button>
          <div className="w-px h-4 bg-slate-200 hidden sm:block" />
          <h1 className="text-base sm:text-2xl font-black text-slate-900 leading-none">
            Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Campaign</span>
          </h1>
        </div>

        <button type="button" disabled={submitting} onClick={handleSaveDraft}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-[13px] font-semibold text-slate-600 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-sm shrink-0 disabled:opacity-50">
          <Save className="w-3.5 h-3.5" />
          <span>Save Draft</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 sm:gap-6 items-start">
        {/* ── Main form card ── */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          {/* Progress */}
          <div className="px-3 sm:px-8 pt-4 sm:pt-8 pb-3 sm:pb-6 border-b border-slate-50">
            <StepProgress current={step} />
          </div>

          {/* Step content */}
          <div className="px-3 sm:px-8 py-4 sm:py-7" key={step}
            style={{ animation: `${dir === 'forward' ? 'slideInRight' : 'slideInLeft'} 0.28s cubic-bezier(0.4,0,0.2,1)` }}>
            {/* Step header */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              {(() => { const s = STEPS[step-1]; const Icon = s.icon; return (
                <>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md shadow-blue-200 flex-shrink-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-lg font-black text-slate-900 leading-none">Step {step}: {s.label}</h2>
                    <p className="text-[11px] sm:text-[12px] text-slate-400 mt-0.5">{s.desc}</p>
                  </div>
                </>
              ); })()}
            </div>

            {/* Global error */}
            {globalError && (
              <div className="mb-5 flex items-center gap-3 px-4 py-3 bg-rose-50 border border-rose-100 rounded-xl">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <p className="text-sm font-semibold text-rose-700 flex-1">{globalError}</p>
                <button onClick={() => setGlobalError('')} className="text-rose-400 hover:text-rose-600"><X className="w-4 h-4" /></button>
              </div>
            )}

            {/* Step components */}
            {step === 1 && <Step1 data={formData} onChange={onChange} errors={errors} />}
            {step === 2 && <Step2 data={formData} onChange={onChange} errors={errors} />}
            {step === 3 && <Step3 data={formData} onChange={onChange} errors={errors} />}
            {step === 4 && <Step4 data={formData} onChange={onChange} errors={errors} />}
          </div>

          {/* Navigation footer */}
          <div className="px-3 sm:px-8 py-3 sm:py-5 border-t border-slate-50 flex items-center justify-between bg-slate-50/40 gap-2">
            <button type="button" onClick={goBack} disabled={step === 1}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 bg-white rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Back</span>
            </button>

            {/* Step dots */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {STEPS.map(s => (
                <div key={s.id}
                  className={`rounded-full transition-all duration-300 ${step === s.id ? 'w-5 sm:w-6 h-1.5 sm:h-2 bg-blue-600' : step > s.id ? 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-300' : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-slate-200'}`} />
              ))}
            </div>

            {step < 4 ? (
              <button type="button" onClick={goNext}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-200 transition-all">
                <span className="hidden xs:inline">Continue</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            ) : (
              <button type="button" onClick={handlePublish} disabled={submitting}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-200 transition-all disabled:opacity-60">
                {submitting
                  ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span className="hidden xs:inline"> Publishing...</span></>
                  : <><Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span className="hidden xs:inline"> Publish</span><span className="xs:hidden">Go</span></>}
              </button>
            )}
          </div>
        </div>

        {/* ── Sidebar overview — hidden on mobile, shown on lg ── */}
        <div className="hidden lg:block sticky top-6 space-y-4">
          {/* Steps list */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-5">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Steps Overview</h3>
            <div className="space-y-2">
              {STEPS.map(s => {
                const done   = step > s.id;
                const active = step === s.id;
                const Icon   = s.icon;
                return (
                  <div key={s.id}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                      ${active ? 'bg-blue-50 border border-blue-100' : done ? 'opacity-70' : 'opacity-40'}`}>
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0
                      ${done ? 'bg-emerald-500' : active ? 'bg-blue-600' : 'bg-slate-100'}`}>
                      {done ? <Check className="w-3.5 h-3.5 text-white" /> : <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-slate-400'}`} />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-[12px] font-bold ${active ? 'text-blue-700' : done ? 'text-slate-600' : 'text-slate-400'}`}>{s.label}</p>
                      <p className="text-[10px] text-slate-400">{s.desc}</p>
                    </div>
                    {active && <ChevronRight className="w-4 h-4 text-blue-400" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live preview */}
          {(formData.name || formData.industry !== 'Technology') && (
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white overflow-hidden relative">
              {formData.imagePreview && (
                <img src={formData.imagePreview} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
              )}
              <div className="relative">
                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">{formData.industry}</p>
                <h4 className="text-sm font-black leading-snug mb-2 line-clamp-2">{formData.name || 'Your Campaign'}</h4>
                {formData.minBudget && formData.maxBudget && (
                  <p className="text-[12px] text-blue-200 font-semibold">${Number(formData.minBudget).toLocaleString()} – ${Number(formData.maxBudget).toLocaleString()}</p>
                )}
                {(formData.platforms || []).length > 0 && (
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {formData.platforms.slice(0, 3).map(id => (
                      <span key={id} className="px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-lg capitalize">{id}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pro tip */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Pro Tip</p>
            </div>
            <p className="text-[12px] text-amber-700 leading-relaxed">{TIPS[step - 1]}</p>
          </div>
        </div>

        {/* ── Mobile-only pro tip strip ── */}
        <div className="lg:hidden">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-700 leading-relaxed">{TIPS[step - 1]}</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
