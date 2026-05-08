import React from 'react';
import { 
  ShieldCheck, 
  DollarSign, 
  Calendar, 
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import Modal from '../../../components/common/Modal';

const AgreementModal = ({ isOpen, onClose, onAgree, collaboration, userRole, isLoading }) => {
  if (!collaboration) return null;

  const isBrand = userRole === 'brand';
  const hasAgreed = isBrand ? collaboration.brandAgreed : collaboration.influencerAgreed;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Collaboration Agreement"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-8 py-2">
        {/* Header Intro */}
        <div className="flex items-start gap-4 p-5 bg-blue-50 rounded-3xl border border-blue-100">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-blue-900 uppercase tracking-tight">Standard Collaboration Contract</h3>
            <p className="text-sm font-bold text-blue-700/70 mt-1 uppercase tracking-widest leading-tight">
              Review and accept the terms of engagement to unlock project execution.
            </p>
          </div>
        </div>

        {/* Contract Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 1: Payment Flow */}
          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-blue-200 transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50">
                <DollarSign size={16} />
              </div>
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Payment & Escrow</h4>
            </div>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 text-[11px] font-bold text-gray-500 leading-relaxed">
                <ArrowRight size={10} className="mt-1 text-blue-500 shrink-0" />
                Funds are held securely in escrow by the platform until approval.
              </li>
              <li className="flex items-start gap-2 text-[11px] font-bold text-gray-500 leading-relaxed">
                <ArrowRight size={10} className="mt-1 text-blue-500 shrink-0" />
                Payout is triggered immediately upon brand's task approval.
              </li>
            </ul>
          </div>

          {/* Section 2: Task Execution */}
          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-blue-200 transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-50">
                <Calendar size={16} />
              </div>
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Task Flow</h4>
            </div>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 text-[11px] font-bold text-gray-500 leading-relaxed">
                <ArrowRight size={10} className="mt-1 text-blue-500 shrink-0" />
                Influencer must provide proof of work/links via the submission portal.
              </li>
              <li className="flex items-start gap-2 text-[11px] font-bold text-gray-500 leading-relaxed">
                <ArrowRight size={10} className="mt-1 text-blue-500 shrink-0" />
                Tasks cannot be edited or deleted once started by the influencer.
              </li>
            </ul>
          </div>

          {/* Section 3: Cancellation Policy */}
          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-red-200 transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-rose-600 shadow-sm border border-rose-50">
                <AlertCircle size={16} />
              </div>
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Cancellation</h4>
            </div>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 text-[11px] font-bold text-gray-500 leading-relaxed">
                <ArrowRight size={10} className="mt-1 text-blue-500 shrink-0" />
                Cancellation within 12 hours of task start is free of charge.
              </li>
              <li className="flex items-start gap-2 text-[11px] font-bold text-gray-500 leading-relaxed">
                <ArrowRight size={10} className="mt-1 text-blue-500 shrink-0" />
                Cancellation after 12 hours incurs a 50% payout to the influencer.
              </li>
            </ul>
          </div>

          {/* Section 4: Completion */}
          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-emerald-200 transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50">
                <CheckCircle2 size={16} />
              </div>
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Completion</h4>
            </div>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 text-[11px] font-bold text-gray-500 leading-relaxed">
                <ArrowRight size={10} className="mt-1 text-blue-500 shrink-0" />
                Mutual approval is required to finalize and close the project.
              </li>
              <li className="flex items-start gap-2 text-[11px] font-bold text-gray-500 leading-relaxed">
                <ArrowRight size={10} className="mt-1 text-blue-500 shrink-0" />
                Ratings and reviews can be exchanged once the project is closed.
              </li>
            </ul>
          </div>
        </div>

        {/* Agreement Status */}
        <div className="p-6 bg-[#0F172A] text-white rounded-3xl border border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Lock size={18} className="text-blue-400" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Execution Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${collaboration.brandAgreed && collaboration.influencerAgreed ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {collaboration.brandAgreed && collaboration.influencerAgreed ? 'FULLY SIGNED' : 'AWAITING SIGNATURES'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className={`p-4 rounded-2xl border transition-all ${collaboration.brandAgreed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800/50 border-slate-700 text-slate-500'}`}>
                <div className="flex items-center gap-2 mb-1">
                   {collaboration.brandAgreed ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                   <span className="text-[10px] font-black uppercase tracking-widest">Brand</span>
                </div>
                <p className="text-xs font-bold">{collaboration.brandAgreed ? 'Agreed' : 'Pending'}</p>
             </div>
             <div className={`p-4 rounded-2xl border transition-all ${collaboration.influencerAgreed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800/50 border-slate-700 text-slate-500'}`}>
                <div className="flex items-center gap-2 mb-1">
                   {collaboration.influencerAgreed ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                   <span className="text-[10px] font-black uppercase tracking-widest">Influencer</span>
                </div>
                <p className="text-xs font-bold">{collaboration.influencerAgreed ? 'Agreed' : 'Pending'}</p>
             </div>
          </div>
        </div>

        {/* Footer Action */}
        {!hasAgreed ? (
           <button 
             onClick={onAgree}
             disabled={isLoading}
             className="w-full py-5 bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
           >
             {isLoading ? 'Processing...' : (
               <>
                 <ShieldCheck size={18} />
                 I Accept the Collaboration Terms
               </>
             )}
           </button>
        ) : (
          <div className="flex items-center justify-center gap-2 py-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
             <CheckCircle2 size={18} />
             <span className="text-xs font-black uppercase tracking-widest">You have agreed to these terms</span>
          </div>
        )}
      </div>
    </Modal>
  );
};

const Clock = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default React.memo(AgreementModal);
