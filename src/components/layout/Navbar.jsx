import { Bell, Menu, X, Shield, MessageCircle, Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import VerifiedTick from '../common/VerifiedTick';
import { useDashboardContext } from '../../context/DashboardContext';
import { getOptimizedImage } from '../../utils/imageOptimization';

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const { roleProfile } = useSelector((state) => state.profile);
  const { unreadCount: notificationCount } = useSelector((state) => state.notifications);
  
  const {
    isSidebarOpen,
    toggleSidebar,
    toggleNotifications,
    toggleProfile,
  } = useDashboardContext();

  const userRole = user?.role || 'brand';
  const isBrand = userRole === 'brand';
  const isInfluencer = userRole === 'influencer';

  // Dynamic names
  const brandName = roleProfile?.brandname;
  const influencerName = roleProfile?.username;
  const fullName = user?.fullname;

  const displayName = 
    isBrand ? (brandName || fullName || 'Brand') : 
    isInfluencer ? (influencerName || fullName || 'Influencer') : 
    (fullName || 'User');

  const userEmail = user?.email || '';
  const initial = displayName.charAt(0).toUpperCase();

  const navigate = useNavigate();
  // removed messages logic from here

  // Dynamic avatars
  const avatarUrl = user?.profilePic || (isBrand ? roleProfile?.logo : roleProfile?.profilePicture);
  
  const roleLabel = 
    userRole === 'admin' ? 'ADMIN' : 
    userRole === 'brand' ? 'BRAND' : 
    'INFLUENCER';

  const roleTitle = 
    userRole === 'admin' ? 'Admin Panel' : 
    userRole === 'brand' ? 'Brand Dashboard' : 
    'Influencer Dashboard';

  const roleBgColor = 
    userRole === 'admin' ? 'bg-indigo-500' : 
    userRole === 'brand' ? 'bg-blue-500' : 
    'bg-emerald-500';

  return (
    <header className="bg-white border-b border-[#e2e8f0] shadow-sm sticky top-0 z-40 h-[80px]">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Left: hamburger + logo + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-[#64748b] hover:text-[#1e293b] p-1 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/')}>
            {/* Mobile View: Just B */}
            <span className="text-2xl font-bold text-[#3b82f6] sm:hidden">B</span>
            
            {/* Desktop View: Full Brandly */}
            <span className="text-2xl font-bold text-[#3b82f6] hidden sm:block">Brandly</span>
            
            {/* Dashboard Role Badge */}
            <span className="hidden lg:flex items-center px-2 py-0.5 ml-2 text-[10px] uppercase tracking-wider font-bold text-[#64748b] bg-slate-100 rounded-md border border-[#e2e8f0]">
              {roleTitle}
            </span>
          </div>
        </div>

        {/* Middle: Search Bar (Hidden on small screens) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-[#94a3b8]" />
            </div>
            <input
              type="text"
              className="block w-full py-2.5 pl-10 pr-4 text-sm text-[#1e293b] bg-[#f1f5f9] border-transparent rounded-full focus:ring-blue-500 focus:border-blue-500 placeholder-[#94a3b8] focus:bg-white focus:outline-none transition-colors"
              placeholder="Search campaigns, influencers..."
            />
          </div>
        </div>

        {/* Right: Actions + Profile */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Dark Mode */}
          <button className="p-2 text-[#64748b] hover:text-[#1e293b] hover:bg-slate-50 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          </button>

          {/* Language Selector (Flag placeholder) */}
          <button className="p-2 text-[#64748b] hover:text-[#1e293b] hover:bg-slate-50 rounded-full transition-colors flex items-center justify-center">
            <span className="text-lg leading-none">🇬🇧</span>
          </button>

          {/* Notification bell */}
          <button
            onClick={toggleNotifications}
            className="relative p-2 text-[#64748b] hover:text-[#1e293b] hover:bg-slate-50 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] bg-[#f97316] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* Shortcuts Grid */}
          <button className="p-2 text-[#64748b] hover:text-[#1e293b] hover:bg-slate-50 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
          </button>


          {/* Profile trigger */}
          <div className="flex items-center ml-2 bg-slate-50 rounded-full pr-4 pl-1 py-1 cursor-pointer border border-[#e2e8f0] hover:bg-slate-100 transition-colors" onClick={toggleProfile}>
            {/* Avatar */}
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center overflow-hidden shrink-0">
                {avatarUrl ? (
                  <img loading="lazy" decoding="async" src={getOptimizedImage(avatarUrl, 'chat')} alt={displayName} className="w-full h-full object-cover" width="32" height="32" />
                ) : (
                  <span className="text-[#64748b] font-semibold text-sm">{initial}</span>
                )}
              </div>
              {/* Status dot */}
              <div className={`absolute top-0 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                user?.status === 'offline' ? 'bg-gray-400' : 'bg-green-500'
              }`} />
            </div>

            {/* Name + role */}
            <div className="hidden md:block text-left ml-2">
              <div className="flex items-center gap-1">
                <p className="text-sm font-semibold text-[#1e293b] leading-tight">{displayName}</p>
                <VerifiedTick user={user} roleProfile={roleProfile} size="xs" />
              </div>
              <p className="text-[11px] text-[#64748b] leading-tight">
                {roleLabel === 'ADMIN' ? 'Admin' : roleLabel === 'BRAND' ? 'Brand' : 'Influencer'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
