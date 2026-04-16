import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  X,
  Calendar,
  DollarSign,
  Briefcase,
  ExternalLink,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

const InfluencerRequestCard = ({ request, type, onAccept, onReject, onResend }) => {
  const navigate = useNavigate();
  const { 
    brandDetails, 
    campaignDetails, 
    status, 
    createdAt, 
    senderDetails, 
    receiverDetails,
    note,
    proposedBudget,
    previouslyRejected,
    collaborationId 
  } = request;
  
  // Brand details logic
  const brand = brandDetails || {};
  const sender = senderDetails || {};
  
  const brandName = brand.brandname || sender.fullname || 'Premium Brand';
  const logo = brand.logo || sender.profilePic || (senderDetails?.role === 'brand' ? senderDetails.profilePic : null) || `https://ui-avatars.com/api/?name=${brandName}&background=random`;
  
  // Campaign details
  const campaignName = campaignDetails?.name || request.title || 'Unknown Campaign';
  const campaignId = campaignDetails?._id || request.campaign;
  
  const isSentRequest = senderDetails?.role === 'influencer';
  
  // Budget logic - Fix [object Object] and handle visibility
  const budgetValue = proposedBudget || (campaignDetails?.budget?.min ? `$${campaignDetails.budget.min}+` : '0');
  const showBudget = isSentRequest; 

  // Format Date
  const date = new Date(createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const getStatusStyles = (status) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-100',
          label: 'Pending'
        };
      case 'accepted':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-100',
          label: 'Accepted'
        };
      case 'rejected':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-100',
          label: 'Rejected'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-600',
          border: 'border-gray-200',
          label: status
        };
    }
  };

  const statusStyles = getStatusStyles(status);

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 p-5 md:p-6 mb-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.06)] hover:border-blue-100/50 group">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Brand Identity */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative shrink-0">
            <img 
              src={logo} 
              alt={brandName} 
              className="w-16 h-16 rounded-[20px] object-cover border-2 border-white shadow-sm ring-1 ring-gray-100"
            />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${status === 'pending' ? 'bg-amber-400' : status === 'accepted' ? 'bg-emerald-400' : 'bg-gray-300'}`}></div>
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <h3 className="text-[17px] font-bold text-gray-900 truncate tracking-tight">{brandName}</h3>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}>
                  {statusStyles.label}
                </span>
                {status === 'pending' && previouslyRejected && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-50 text-rose-500 border border-rose-100 uppercase tracking-tighter">
                    Prev. Rejected
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center text-[13px] text-gray-500 font-medium">
              <Briefcase className="w-3.5 h-3.5 mr-1 text-gray-400" />
              <span className="truncate">{brand.industry || 'Lifestyle & Fashion'}</span>
            </div>
          </div>
        </div>

        {/* Divider for mobile */}
        <div className="h-px bg-gray-50 md:hidden"></div>

        {/* Campaign Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <button 
            onClick={() => navigate(`/influencer/search/campaign/${campaignId}`)}
            className="flex items-center gap-1.5 text-blue-600 mb-1 group/link w-fit"
          >
            <span className="text-[15px] font-bold tracking-tight truncate group-hover/link:underline">{campaignName}</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
          </button>
          
          {note && (
            <div className="mt-1">
              <p className="text-[13px] text-gray-500 italic line-clamp-1">
                "{note}"
              </p>
            </div>
          )}
        </div>

        {/* Stats & Actions */}
        <div className="flex flex-col md:items-end gap-4 shrink-0">
          <div className="flex items-center gap-5">
            {showBudget && (
              <div className="flex flex-col items-start md:items-end">
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Budget</span>
                <div className="flex items-center text-[#10B981] font-bold text-[15px]">
                  <DollarSign className="w-3.5 h-3.5 mr-0.5" />
                  {typeof budgetValue === 'number' ? budgetValue.toLocaleString() : budgetValue}
                </div>
              </div>
            )}

            {request.attachments?.length > 0 && (
              <div className="flex flex-col items-start md:items-end">
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Portfolio</span>
                <a 
                  href={`https://docs.google.com/viewer?url=${encodeURIComponent(request.attachments[0])}&embedded=true`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 font-bold text-[13px] hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1" />
                  View Portfolio (Preview)
                </a>
              </div>
            )}
            
            <div className="flex flex-col items-start md:items-end">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                {type === 'sent' ? 'Sent' : 'Received'}
              </span>
              <div className="flex items-center text-gray-900 font-bold text-[15px]">
                <Calendar className="w-3.5 h-3.5 text-blue-500 mr-1" />
                {date}
              </div>
            </div>
          </div>

          {/* Conditional Actions */}
          <div className="flex items-center gap-2 mt-1">
            {status === 'accepted' && collaborationId ? (
              <button 
                onClick={() => navigate(`/influencer/collaborations`)}
                className="flex items-center justify-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold rounded-xl transition-all shadow-sm shadow-emerald-200"
              >
                Go to Collaboration
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : status === 'rejected' && isSentRequest ? (
              <button
                onClick={() => onResend && onResend(request)}
                className="px-5 py-2 text-[13px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border border-blue-100 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Resend Request
              </button>
            ) : status === 'pending' && !isSentRequest && (
              <>
                <button 
                  onClick={() => onAccept(request._id)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-all shadow-sm shadow-blue-200"
                >
                  <Check className="w-3.5 h-3.5" />
                  Accept
                </button>
                
                <button 
                  onClick={() => onReject(request._id)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-5 py-2 bg-white hover:bg-rose-50 text-gray-700 hover:text-rose-600 border border-gray-200 hover:border-rose-100 text-[13px] font-bold rounded-xl transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerRequestCard;
