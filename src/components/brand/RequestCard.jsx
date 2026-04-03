import React from 'react';
import { 
  Instagram, 
  Youtube, 
  Twitter, 
  Linkedin, 
  MessageSquare, 
  Check, 
  X
} from 'lucide-react';

const RequestCard = ({ request, onAccept, onReject, onViewProfile }) => {
  const { influencerDetails, campaignDetails, status, note, createdAt, senderDetails } = request;
  
  // Influencer details logic
  const influencer = influencerDetails || {};
  const user = senderDetails || {};
  const username = influencer.username || user.fullname || 'Unknown Influencer';
  const avatar = user.profilePic || `https://ui-avatars.com/api/?name=${username}&background=random`;
  
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
    const base = "px-2 py-0.5 rounded text-[11px] font-semibold capitalize";
    switch (status) {
      case 'pending': return `${base} bg-orange-100 text-orange-600`;
      case 'accepted': return `${base} bg-green-100 text-green-600`;
      case 'rejected': return `${base} bg-red-100 text-red-600`;
      default: return `${base} bg-gray-100 text-gray-600`;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <img 
            src={avatar} 
            alt={username} 
            className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-50"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-[16px] font-bold text-gray-900 truncate">{username}</h3>
            <span className={getStatusBadge(status)}>{status}</span>
          </div>

          <div className="text-[14px] text-gray-600 font-medium mb-1">
            Campaign: <span className="text-gray-900">{campaignName}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-gray-500">
            <div className="flex items-center gap-1">
              {getPlatformIcon(platformName)}
              <span className="capitalize">{platformName}</span>
            </div>
            <span>•</span>
            <div className="font-medium">{followers} followers</div>
            <span>•</span>
            <div className="font-medium">4.5% engagement</div>
            <span>•</span>
            <div className="text-gray-400">Requested: {date}</div>
          </div>

          {note && (
            <div className="mt-3 bg-gray-50 rounded-lg p-3 text-[13px] text-gray-600 italic border-l-2 border-gray-200">
              "{note}"
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0 self-center md:self-start">
          <button
            onClick={() => onViewProfile && onViewProfile(influencerDetails?._id)}
            className="flex items-center px-3 py-1.5 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
          >
            View Profile
          </button>
          
          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
            <MessageSquare className="w-4 h-4" />
          </button>

          {status === 'pending' && (
            <>
              <button 
                onClick={() => onAccept(request._id)}
                className="flex items-center gap-1 px-3 py-1.5 text-[13px] font-semibold bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
              >
                <Check className="w-4 h-4" />
                Accept
              </button>
              
              <button 
                onClick={() => onReject(request._id)}
                className="flex items-center gap-1 px-3 py-1.5 text-[13px] font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
              >
                <X className="w-4 h-4" />
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
