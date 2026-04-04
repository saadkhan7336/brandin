import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Instagram, 
  Youtube, 
  Twitter, 
  Linkedin, 
  MessageSquare, 
  Check, 
  X,
  ExternalLink,
  ChevronRight,
  DollarSign,
  RotateCcw
} from 'lucide-react';

const RequestCard = ({ request, onAccept, onReject, onViewProfile, onResend }) => {
  const navigate = useNavigate();
  const { 
    influencerDetails, 
    campaignDetails, 
    status, 
    note, 
    createdAt, 
    senderDetails, 
    receiverDetails,
    proposedBudget,
    previouslyRejected,
    collaborationId 
  } = request;
  
  // Logic to determine if I am the sender or receiver
  // In the brand dashboard, usually we check if we are the brand
  // But more simply: if it's in 'Sent' tab, we are the sender.
  // The backend 'getRequests' populates 'receiverDetails' if we are the sender.
  
  const isSentRequest = request.senderDetails?.role === 'brand'; // Simple heuristic
  
  // Influencer details logic
  const influencer = influencerDetails || {};
  const otherParty = isSentRequest ? (receiverDetails || {}) : (senderDetails || {});
  
  const username = influencer.username || otherParty.fullname || influencer.userData?.fullname || 'Unknown Influencer';
  const avatar = otherParty.profilePic || influencer.userData?.profilePic || `https://ui-avatars.com/api/?name=${username}&background=random`;
  
  // Campaign details
  const campaignName = campaignDetails?.name || request.title || 'Unknown Campaign';
  
  // Platform logic
  const platform = influencer.platforms?.[0] || {};
  const platformName = platform.name?.toLowerCase() || 'instagram';
  const followers = platform.followers ? `${(platform.followers / 1000).toFixed(1)}K` : '0';
  
  // Format Date
  const date = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  const getPlatformIcon = (name) => {
    switch (name) {
      case 'instagram': return <Instagram className="w-4 h-4 text-pink-600" />;
      case 'youtube': return <Youtube className="w-4 h-4 text-red-600" />;
      case 'twitter': return <Twitter className="w-4 h-4 text-blue-400" />;
      case 'linkedin': return <Linkedin className="w-4 h-4 text-blue-700" />;
      default: return <Instagram className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-2 py-0.5 rounded text-[11px] font-bold capitalize";
    switch (status) {
      case 'pending': return `${base} bg-[#F1F5F9] text-gray-500`;
      case 'accepted': return `${base} bg-emerald-50 text-green-600`;
      case 'rejected': return `${base} bg-red-50 text-red-600`;
      case 'cancelled': return `${base} bg-gray-50 text-gray-400`;
      default: return `${base} bg-gray-50 text-gray-500`;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] group">
      <div className="flex flex-col md:flex-row md:items-start gap-5">
        {/* Avatar */}
        <div className="relative shrink-0">
          <img 
            src={avatar} 
            alt={username} 
            className="w-[60px] h-[60px] rounded-full object-cover ring-4 ring-white shadow-sm"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-[17px] font-bold text-[#0F172A] truncate tracking-tight">{username}</h3>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={getStatusBadge(status)}>{status}</span>
              {status === 'pending' && previouslyRejected && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-500 border border-rose-100 uppercase tracking-tight">
                  Previously Rejected
                </span>
              )}
            </div>
          </div>

          <div className="text-[14px] text-gray-500 font-bold mb-3 flex items-center gap-1.5 flex-wrap">
            <span className="text-gray-400 font-medium">Campaign:</span> 
            <button 
              onClick={() => navigate('/brand/campaigns')} // Assuming Hub for now as per plan
              className="text-[#2563EB] hover:underline flex items-center gap-0.5 group/link"
            >
              {campaignName}
              <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] text-gray-500 font-medium">
            <div className="flex items-center gap-1.5">
              {getPlatformIcon(platformName)}
              <span className="capitalize text-gray-600">{platformName}</span>
            </div>
            <span className="text-gray-300">•</span>
            <div><span className="text-gray-600">{followers}</span> followers</div>
            <span className="text-gray-300">•</span>
            <div><span className="text-gray-600">4.5%</span> engagement</div>
            <span className="text-gray-300">•</span>
            <div className="text-gray-400 font-normal italic">Requested: {date}</div>
            {proposedBudget && (
              <>
                <span className="text-gray-300">•</span>
                <div className="text-emerald-600 font-bold flex items-center gap-0.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  {proposedBudget.toLocaleString()}
                </div>
              </>
            )}
            {request.attachments?.length > 0 && (
              <>
                <span className="text-gray-300">•</span>
                <a 
                  href={`https://docs.google.com/viewer?url=${encodeURIComponent(request.attachments[0])}&embedded=true`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Portfolio/Resume (Preview)
                </a>
              </>
            )}
          </div>

          {note && (
            <div className="mt-4 bg-[#F8FAFC] rounded-xl p-4 text-[13px] text-[#475569] leading-relaxed border border-[#F1F5F9]">
              {note}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 shrink-0 self-center md:self-start">
          {status === 'accepted' && collaborationId ? (
            <button
              onClick={() => navigate(`/brand/collaborations`)} // Redirect to collaborations hub
              className="px-5 py-2 text-[13px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-100 flex items-center gap-1.5"
            >
              Go to Collaboration
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : status === 'rejected' && isSentRequest ? (
            <button
              onClick={() => onResend && onResend(request)}
              className="px-5 py-2 text-[13px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border border-blue-100 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Resend Request
            </button>
          ) : (
            <>
              <button
                onClick={() => onViewProfile && onViewProfile(influencer?._id || otherParty?._id)}
                className="px-5 py-2 text-[13px] font-bold text-[#334155] bg-white hover:bg-gray-50 rounded-xl transition-all border border-gray-200 shadow-sm"
              >
                View Profile
              </button>
              
              <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all border border-gray-200">
                <MessageSquare className="w-4.5 h-4.5" />
              </button>

              {status === 'pending' && !isSentRequest && (
                <div className="flex items-center gap-2 ml-1">
                  <button 
                    onClick={() => onAccept(request._id)}
                    className="flex items-center gap-1.5 px-5 py-2 text-[13px] font-bold bg-[#2563EB] text-white hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-100"
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </button>
                  
                  <button 
                    onClick={() => onReject(request._id)}
                    className="flex items-center gap-1.5 px-5 py-2 text-[13px] font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all border border-red-100"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
