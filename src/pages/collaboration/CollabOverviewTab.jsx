import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  Target, 
  Users, 
  Globe, 
  Clock, 
  Smartphone, 
  FileText,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  TrendingUp,
  Link as LinkIcon,
  Mail,
  MapPin
} from 'lucide-react';

const getPlatformIcon = (name) => {
  switch (name?.toLowerCase()) {
    case 'instagram': return <Instagram size={20} className="text-pink-600" />;
    case 'youtube':   return <Youtube size={20} className="text-red-600" />;
    case 'twitter':   return <Twitter size={20} className="text-blue-400" />;
    case 'linkedin':  return <Linkedin size={20} className="text-blue-700" />;
    default:          return <Globe size={20} className="text-blue-600" />;
  }
};

const CollabOverviewTab = () => {
  const { collaboration, userRole } = useOutletContext();
  if (!collaboration) return null;

  const { campaign, deliverables = [] } = collaboration;
  
  // Logical Stats Fix
  const delivTotal = deliverables.length || 0;
  const delivCompleted = deliverables.filter(d => d.status === 'APPROVED').length || 0;
  const progress = delivTotal > 0 ? Math.round((delivCompleted / delivTotal) * 100) : 0;

  const partner = userRole === 'brand' ? collaboration.influencer : collaboration.brand;
  const partnerProfileLink = userRole === 'brand' 
    ? `/brand/influencer/${partner?._id}` 
    : `/influencer/search/brand/${partner?._id}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Project Details */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* About Project */}
        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
              <FileText size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Project Brief</h3>
          </div>
          <p className="text-gray-600 leading-relaxed font-medium">
            {campaign?.description || collaboration.description || "No description provided for this project."}
          </p>
        </section>

        {/* Deliverables & Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Objectives */}
          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
                <Target size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Objectives</h3>
            </div>
            <ul className="space-y-4">
              {(campaign?.goals || []).length > 0 ? campaign.goals.map((goal, i) => (
                <li key={i} className="flex items-start gap-3 group">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:scale-125 transition-transform" />
                  <span className="text-sm font-bold text-gray-600">{goal}</span>
                </li>
              )) : (
                <li className="text-gray-400 text-sm italic font-medium">No objectives listed.</li>
              )}
            </ul>
          </section>

          {/* Platforms */}
          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                <Smartphone size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Platforms</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {(campaign?.platform || []).map((p, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 hover:border-emerald-200 transition-all">
                  {getPlatformIcon(p)}
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700">{p}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Timeline & Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Audience */}
           <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-pink-50 rounded-xl text-pink-600">
                <Users size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Target Audience</h3>
            </div>
            <p className="text-sm font-bold text-gray-600 leading-relaxed">
              {campaign?.targetAudience || "General Audience"}
            </p>
          </section>

          {/* Content Types */}
          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Content Types</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(campaign?.contentTypes || ['Reels', 'Stories', 'Posts']).map((type, i) => (
                <span key={i} className="px-3 py-1.5 bg-indigo-50/50 text-indigo-700 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-indigo-100">
                  {type}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Right Column: Partner & Stats Sidebar */}
      <div className="space-y-8">
        {/* Progress Card */}
        <section className="bg-white border text-gray-900 border-gray-200 shadow-sm rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
             <div>
               <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Progress</p>
               <h3 className="text-3xl font-bold">{progress}%</h3>
             </div>
             <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
               <TrendingUp className="text-blue-600" size={24} />
             </div>
          </div>
          
          <div className="space-y-4">
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-200">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-1000" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <span>{delivCompleted} Completed</span>
              <span>{delivTotal} Total Tasks</span>
            </div>
          </div>
        </section>

        {/* Partner Info */}
        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 group-hover:bg-blue-50 transition-colors duration-500" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Partner Details</h3>
            </div>

            <div className="space-y-6">
              {/* Profile */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <img 
                  src={partner?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(partner?.fullname || 'User')}&background=random`} 
                  alt={partner?.fullname}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm capitalize">{partner?.fullname}</h4>
                  <p className="text-[10px] font-bold text-gray-400">@{partner?.username || 'user'}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                       <Mail size={14} />
                    </div>
                    <span className="text-xs font-bold text-gray-600">{partner?.email}</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                       <Globe size={14} />
                    </div>
                    <span className="text-xs font-bold text-gray-600">brandin.ai/profile/{partner?.username}</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                       <MapPin size={14} />
                    </div>
                    <span className="text-xs font-bold text-gray-600">Global / Remote</span>
                 </div>
              </div>

              {/* View Profile Button */}
              <Link 
                to={partnerProfileLink}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#1A1A1A] hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                Visit Partner Profile
                <LinkIcon size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Support Card */}
        <section className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4">
             <Clock className="text-emerald-600" size={24} />
          </div>
          <h4 className="text-sm font-bold text-emerald-900 mb-2">Need Assistance?</h4>
          <p className="text-xs font-bold text-emerald-700/70 mb-6">Our dedicated project managers are available to help you navigate this campaign.</p>
          <button className="text-xs font-bold text-emerald-600 hover:underline">
            Contact Support
          </button>
        </section>
      </div>
    </div>
  );
};

export default CollabOverviewTab;
