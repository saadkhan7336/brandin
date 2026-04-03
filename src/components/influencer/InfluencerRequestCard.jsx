import React from 'react';
import { 
  Check, 
  X
} from 'lucide-react';

const InfluencerRequestCard = ({ request, onAccept, onReject }) => {
  const { brandDetails, campaignDetails, status, createdAt, senderDetails, note } = request;
  
  // Brand details logic
  // Fallback to senderDetails (User doc) if brandDetails isn't fully complete or missing
  const brand = brandDetails || {};
  const user = senderDetails || {};
  const brandName = brand.brandname || user.fullname || 'Unknown Brand';
  const logo = brand.logo || user.profilePic || `https://ui-avatars.com/api/?name=${brandName}&background=random`;
  
  // Campaign details
  const campaignName = campaignDetails?.name || request.title || 'Unknown Campaign';
  const description = campaignDetails?.description || 'No description provided';
  
  // Budget logic
  // The request usually contains a proposedBudget
  const budget = request.proposedBudget || campaignDetails?.budget || 0;
  
  // Format Date
  const date = new Date(createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-[12px] font-semibold capitalize tracking-wide";
    switch (status) {
      case 'pending': return `${base} bg-blue-50 text-blue-600 border border-blue-100`;
      case 'new': return `${base} bg-blue-50 text-blue-600 border border-blue-100`;
      case 'accepted': return `${base} bg-blue-600 text-white`;
      case 'rejected': return `${base} bg-gray-100 text-gray-500`;
      default: return `${base} bg-gray-100 text-gray-600`;
    }
  };

  // Convert 'pending' to 'new' visually as per screenshot
  const displayStatus = status === 'pending' ? 'new' : status;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4 shadow-sm transition-all hover:shadow-md flex flex-col md:flex-row md:items-start gap-5">
      {/* Brand Logo */}
      <img 
        src={logo} 
        alt={brandName} 
        className="w-16 h-16 rounded-[14px] object-cover border border-gray-100 shrink-0 shadow-sm"
      />

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-[18px] font-bold text-gray-900 truncate">{brandName}</h3>
          <span className={getStatusBadge(displayStatus)}>{displayStatus}</span>
        </div>

        <div className="text-[15px] font-semibold text-blue-600 mb-1">
          {campaignName}
        </div>
        
        <p className="text-[14px] text-gray-600 mb-4 line-clamp-2 italic">
          "{note}"
        </p>

        <div className="flex flex-wrap items-center gap-1.5 text-[13px] text-gray-500">
          <span className="font-medium text-gray-700">Budget:</span> 
          <span>${budget.toLocaleString()}</span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-gray-500">Received: {date}</span>
        </div>
      </div>

      {/* Actions */}
      {status === 'pending' && (
        <div className="flex items-center gap-3 shrink-0 self-center md:self-start mt-4 md:mt-0">
          <button 
            onClick={() => onAccept(request._id)}
            className="flex items-center gap-1.5 px-4 py-2 text-[14px] font-semibold text-gray-800 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100"
          >
            <Check className="w-4 h-4" />
            Accept
          </button>
          
          <button 
            onClick={() => onReject(request._id)}
            className="flex items-center gap-1.5 px-4 py-2 text-[14px] font-semibold text-gray-800 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
          >
            <X className="w-4 h-4" />
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default InfluencerRequestCard;
