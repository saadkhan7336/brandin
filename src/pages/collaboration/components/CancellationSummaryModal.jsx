import React from 'react';
import { 
  X, 
  CheckCircle2, 
  DollarSign, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import Modal from '../../../components/common/Modal';

const CancellationSummaryModal = ({ isOpen, onClose, summary, userRole }) => {
  if (!summary) return null;

  const isBrand = userRole === 'brand';
  const { refundedAmount, compensationPaid, reason } = summary;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Collaboration Cancelled"
      maxWidth="max-w-xl"
    >
      <div className="space-y-6 py-2">
        {/* Status Header */}
        <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 shadow-inner">
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-rose-500 shadow-xl shadow-rose-100 border border-rose-50 mb-4 animate-bounce-slow">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Project Terminated</h3>
          <p className="text-sm font-bold text-gray-400 mt-2 max-w-xs leading-relaxed uppercase tracking-widest">
            The collaboration has been successfully closed and funds have been processed.
          </p>
        </div>

        {/* Financial Breakdown */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Financial Settlement</h4>
          
          <div className="grid grid-cols-1 gap-3">
            {/* Refund Card (Only for Brand) */}
            {isBrand && (
              <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-between group hover:shadow-lg hover:shadow-emerald-100 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                    <RotateCcw size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">Refunded to You</p>
                    <p className="text-xl font-black text-gray-900">${refundedAmount?.toFixed(2)}</p>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <span className="text-[9px] font-black text-emerald-600 uppercase bg-white px-3 py-1 rounded-full border border-emerald-100">Original Method</span>
                </div>
              </div>
            )}

            {/* Compensation Card */}
            <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100 flex items-center justify-between group hover:shadow-lg hover:shadow-blue-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                  <DollarSign size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-0.5">
                    {isBrand ? 'Compensation Paid' : 'Compensation Received'}
                  </p>
                  <p className="text-xl font-black text-gray-900">${compensationPaid?.toFixed(2)}</p>
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-[9px] font-black text-blue-600 uppercase bg-white px-3 py-1 rounded-full border border-blue-100">50% Rule Applied</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reason Section */}
        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={14} className="text-gray-400" />
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cancellation Reason</h4>
          </div>
          <p className="text-sm font-bold text-gray-700 italic leading-relaxed">
            "{reason || "No reason provided."}"
          </p>
        </div>

        {/* Action Button */}
        <button 
          onClick={onClose}
          className="w-full py-5 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black active:scale-95 transition-all shadow-xl shadow-gray-200"
        >
          Acknowledge & Close
        </button>
      </div>
    </Modal>
  );
};

const FileText = ({ size, className }) => (
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
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export default CancellationSummaryModal;
