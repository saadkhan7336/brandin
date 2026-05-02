import React, { useState } from 'react';
import { X, ShieldCheck, AlertTriangle, DollarSign, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

/**
 * PayoutConfirmationModal asks the brand to confirm a payout and optionally mark it as final.
 * 
 * @param {boolean} isOpen
 * @param {function} onClose
 * @param {function} onConfirm
 * @param {object} deliverable
 * @param {number} remainingBudget
 */
const PayoutConfirmationModal = ({ isOpen, onClose, onConfirm, deliverable, remainingBudget }) => {
  const [isFinal, setIsFinal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(isFinal);
      onClose();
    } catch (err) {
      console.error("Confirmation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const payoutAmount = isFinal ? remainingBudget : (deliverable?.allocatedBudget || 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Confirm Payout</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Main Info */}
          <div className="text-center space-y-2">
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Releasing Funds For</p>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight truncate px-4">
              {deliverable?.title}
            </h3>
            <div className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-200 animate-bounce">
              <DollarSign size={20} strokeWidth={3} />
              <span className="text-2xl font-black">{payoutAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100" />

          {/* Options */}
          <div className="space-y-4">
            <label className={cn(
              "flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer group",
              isFinal ? "bg-blue-50 border-blue-600 shadow-md" : "bg-white border-gray-100 hover:border-blue-200"
            )}>
              <div className="pt-1">
                <input 
                  type="checkbox"
                  className="w-5 h-5 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-blue-600 transition-all cursor-pointer"
                  checked={isFinal}
                  onChange={(e) => setIsFinal(e.target.checked)}
                />
              </div>
              <div className="flex-1">
                <p className={cn(
                  "text-sm font-black uppercase tracking-tight transition-colors",
                  isFinal ? "text-blue-700" : "text-gray-900"
                )}>
                  Is this the final task?
                </p>
                <p className="text-xs font-bold text-gray-500 mt-0.5 leading-relaxed">
                  If checked, the entire remaining escrow balance of <b>${remainingBudget.toLocaleString()}</b> will be released to the influencer.
                </p>
              </div>
            </label>

            {/* Warning if NOT final and no budget left */}
            {!isFinal && remainingBudget <= (deliverable?.allocatedBudget || 0) && (
               <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 animate-pulse">
                  <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={16} />
                  <p className="text-[11px] font-bold text-amber-800 leading-tight">
                    This is the last of your funded budget. You should probably mark this as the final task to close the collaboration.
                  </p>
               </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            <button 
              disabled={isLoading}
              onClick={onClose} 
              className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-500 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              disabled={isLoading}
              onClick={handleConfirm}
              className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CheckCircle2 size={16} />
              )}
              {isFinal ? 'Release All' : 'Confirm Payout'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-emerald-600" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Payment Securely Released via Stripe
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayoutConfirmationModal;
