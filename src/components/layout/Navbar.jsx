import { Bell, Menu, X, Shield, MessageCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import VerifiedTick from '../common/VerifiedTick';

export default function Navbar({
  userRole,
  user,
  roleProfile,
  notificationCount,
  isSidebarOpen,
  onToggleSidebar,
  onToggleNotifications,
  onToggleProfile,
}) {
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
  const avatarUrl = isBrand 
    ? (roleProfile?.logo || user?.profilePic) 
    : (roleProfile?.profilePicture || user?.profilePic);
  
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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 h-[80px]">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Left: hamburger + logo + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden text-gray-500 hover:text-gray-900 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <Shield className="w-7 h-7 text-blue-500" />
            <h1 className="text-lg font-bold text-gray-900 hidden sm:block">
              {roleTitle}
            </h1>
          </div>
        </div>

        {/* Right: notifications + profile */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button
            onClick={onToggleNotifications}
            className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>


          {/* Profile trigger */}
          <button
            onClick={onToggleProfile}
            className="flex items-center gap-2.5 pl-3 border-l border-gray-200 hover:opacity-80 transition-opacity"
          >
            {/* Avatar */}
            <div className="relative">
              <div className={`w-9 h-9 rounded-full ${roleBgColor} flex items-center justify-center overflow-hidden`}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-semibold text-sm">{initial}</span>
                )}
              </div>
              {/* Status dot */}
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                user?.status === 'offline' ? 'bg-gray-400' : 'bg-green-500'
              }`} />
            </div>

            {/* Name + role + email */}
            <div className="hidden md:block text-left">
              <div className="flex items-center gap-1">
                <p className="text-sm font-semibold text-gray-900 leading-tight">{displayName}</p>
                <VerifiedTick user={user} roleProfile={roleProfile} size="xs" />
              </div>
              <p className="text-xs text-gray-400 leading-tight">
                <span className={`font-bold ${userRole === 'brand' ? 'text-blue-500' : 'text-emerald-500'}`}>
                  {roleLabel}
                </span>
                {userEmail && (
                  <>
                    {' '}
                    <span className="text-gray-400">
                      {userEmail.length > 16
                        ? userEmail.substring(0, 16) + '...'
                        : userEmail}
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Chevron */}
            <svg className="w-4 h-4 text-gray-400 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
