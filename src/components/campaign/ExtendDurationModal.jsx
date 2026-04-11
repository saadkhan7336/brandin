import React, { useState } from 'react';
import { Calendar, X, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

const ExtendDurationModal = ({ isOpen, onClose, onConfirm, campaign, loading }) => {
  const [newEndDate, setNewEndDate] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newEndDate) {
      setError('Please select a new end date');
      return;
    }

    const selectedDate = new Date(newEndDate);
    const now = new Date();
    
    if (selectedDate <= now) {
      setError('The new end date must be in the future');
      return;
    }

    onConfirm(campaign._id, newEndDate);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3 text-blue-600 font-display">
              <Calendar className="w-6 h-6" />
              <h2 className="text-xl font-bold">Reactivate Campaign</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-600 mb-6 font-medium">
            Extending the duration will set the campaign status back to <span className="text-emerald-600 font-bold">ACTIVE</span>, allowing influencers to see it and apply.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                New End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={newEndDate}
                  onChange={(e) => {
                    setNewEndDate(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-semibold"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-semibold">{error}</span>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-xl"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-xl shadow-lg shadow-blue-200"
                isLoading={loading}
              >
                Reactivate
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExtendDurationModal;
