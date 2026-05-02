import React, { useState } from 'react';
import { X, DollarSign, Send, MessageSquare } from 'lucide-react';

const CounterOfferModal = ({ request, onClose, onSubmit }) => {
  const [budget, setBudget] = useState(request.agreedBudget || '');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!budget || isNaN(budget) || Number(budget) <= 0) return;
    
    setLoading(true);
    await onSubmit({ newBudget: Number(budget), note });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Suggest New Budget</h2>
              <p className="text-gray-500 text-sm mt-1 font-medium">Negotiate the terms for this collaboration</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider ml-1">
                Your Proposed Budget (USD)
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <DollarSign className="w-4.5 h-4.5" />
                </div>
                <input
                  type="number"
                  required
                  min="0.5"
                  step="0.01"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 50.00"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider ml-1">
                Note to Brand (Optional)
              </label>
              <div className="relative">
                <div className="absolute left-4 top-4 text-gray-400 pointer-events-none">
                  <MessageSquare className="w-4.5 h-4.5" />
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Explain why you're suggesting this budget..."
                  rows="3"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400 resize-none"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3.5 border border-gray-200 rounded-2xl text-[14px] font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !budget}
                className="flex-[2] flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-2xl text-[14px] font-bold transition-all shadow-lg shadow-blue-200"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Counter Offer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CounterOfferModal;
