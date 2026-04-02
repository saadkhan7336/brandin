import React from 'react';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/campaignHelpers';

const CampaignCard = ({ campaign, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusColors = {
    active: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    pending: 'text-amber-600 bg-amber-50 border-amber-100',
    completed: 'text-gray-600 bg-gray-50 border-gray-100',
    draft: 'text-gray-500 bg-gray-100 border-gray-200',
  };

  const status = campaign.status?.toLowerCase() || 'pending';

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group">
      <div className="absolute top-6 right-6" ref={menuRef}>
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
        >
          <MoreVertical className="w-5 h-5" />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => {
                onEdit(campaign);
                setShowMenu(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span className="font-semibold">Edit Campaign</span>
            </button>
            <button
              onClick={() => {
                onDelete(campaign._id);
                setShowMenu(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="font-semibold">Delete Campaign</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex items-start gap-6">
        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
          {campaign.image ? (
            <img src={campaign.image} alt={campaign.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 italic text-[10px] bg-gray-50 uppercase font-bold tracking-widest px-2 text-center">
              No Cover
            </div>
          )}
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold text-blue-600 uppercase tracking-tight mb-1">
              {campaign.name || 'Untitled Campaign'}
            </h3>
            <p className="text-xs text-gray-500">
              Created on {formatDate(campaign.createdAt)}
            </p>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[status] || statusColors.pending}`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'draft' ? 'bg-gray-400' : 'bg-current'}`}></span>
              {status}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Target</p>
            <p className="text-sm font-semibold text-gray-700">{campaign.industry || campaign.category || 'N/A'}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Platforms</p>
            <p className="text-sm font-semibold text-gray-700">
              {Array.isArray(campaign.platform) ? campaign.platform.join(', ') : (campaign.platform || 'N/A')}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Budget</p>
            <p className="text-sm font-bold text-gray-900">
              {campaign.budget?.min && campaign.budget?.max 
                ? `$${campaign.budget.min} - $${campaign.budget.max}`
                : campaign.budget ? `$${campaign.budget}` : 'Not set'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
