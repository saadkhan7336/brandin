import { useState, useRef, useEffect } from 'react';
import { Bell, Menu, X, Shield, MessageCircle, Search, Megaphone, Users, CreditCard, Clock, Settings, User, FolderKanban, LayoutGrid } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import VerifiedTick from '../common/VerifiedTick';
import { useDashboardContext } from '../../context/DashboardContext';
import { getOptimizedImage } from '../../utils/imageOptimization';
import { getDashboardByRole } from '../../routes/ProtectedRoute';

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const { roleProfile } = useSelector((state) => state.profile);
  const { unreadCount: notificationCount } = useSelector((state) => state.notifications);
  
  const {
    isSidebarOpen,
    toggleSidebar,
    toggleNotifications,
    toggleProfile,
    closeAllDropdowns,
  } = useDashboardContext();

  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const shortcutsRef = useRef(null);

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

  // Dynamic avatars
  const avatarUrl = user?.profilePic || (isBrand ? roleProfile?.logo : roleProfile?.profilePicture);
  
  const roleLabel = 
    userRole === 'admin' ? 'ADMIN' : 
    userRole === 'brand' ? 'BRAND' : 
    'INFLUENCER';

  // Shortcuts menu data tailored by role
  const brandShortcuts = [
    { title: 'Campaigns', sub: 'Manage campaigns', route: '/brand/campaigns', icon: Megaphone, color: 'text-blue-500 bg-blue-50' },
    { title: 'Chat', sub: 'New messages', route: '/messages', icon: MessageCircle, color: 'text-indigo-500 bg-indigo-50' },
    { title: 'Find Influencers', sub: 'Discover talent', route: '/brand/influencer', icon: Users, color: 'text-purple-500 bg-purple-50' },
    { title: 'My Requests', sub: 'Track proposals', route: '/brand/requests/sent', icon: Clock, color: 'text-amber-500 bg-amber-50' },
  ];

  const influencerShortcuts = [
    { title: 'Explore', sub: 'Browse campaigns', route: '/influencer/explore', icon: Search, color: 'text-blue-500 bg-blue-50' },
    { title: 'Chat', sub: 'New messages', route: '/messages', icon: MessageCircle, color: 'text-indigo-500 bg-indigo-50' },
    { title: 'My Requests', sub: 'Manage invites', route: '/influencer/requests', icon: Clock, color: 'text-amber-500 bg-amber-50' },
    { title: 'Collaborations', sub: 'Active deliverables', route: '/brand/collaborations', icon: FolderKanban, color: 'text-purple-500 bg-purple-50' },
  ];

  const shortcutsList = isBrand ? brandShortcuts : influencerShortcuts;

  const toggleShortcuts = () => {
    closeAllDropdowns();
    setIsShortcutsOpen((prev) => !prev);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (e.target.closest('[data-dropdown-trigger="shortcuts"]')) return;
      if (shortcutsRef.current && !shortcutsRef.current.contains(e.target)) {
        setIsShortcutsOpen(false);
      }
    }
    if (isShortcutsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isShortcutsOpen]);

  const handleShortcutClick = (route) => {
    setIsShortcutsOpen(false);
    navigate(route);
  };

  return (
    <header className="bg-white border-b border-[#e2e8f0] shadow-sm sticky top-0 z-40 h-[72px] sm:h-[80px]">
      <div className="flex items-center justify-between h-full px-2.5 sm:px-6">
        {/* Left: hamburger + logo */}
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
          <div 
            className="flex items-center cursor-pointer select-none" 
            onClick={() => navigate(user ? getDashboardByRole(user.role) : '/')}
          >
          {/* Logo — always show full Brandly */}
            <span className="text-2xl font-bold text-[#3b82f6] tracking-tight">Brandly</span>
          </div>
        </div>

        {/* Middle: Search Bar (Hidden on small screens) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Search className="w-4 h-4 text-[#94a3b8]" />
            </div>
            <input
              type="text"
              className="block w-full py-2 pl-10 pr-4 text-sm text-[#1e293b] bg-[#f1f5f9] border border-slate-200 rounded-full placeholder-[#94a3b8] focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
              placeholder="Search campaigns, influencers..."
            />
          </div>
        </div>

        {/* Right: Actions + Profile */}
        <div className="flex items-center gap-1 sm:gap-2 relative">
          
          {/* Dark Mode */}
          <button className="hidden sm:flex p-2 text-[#64748b] hover:text-[#1e293b] hover:bg-slate-50 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          </button>

          {/* Language Selector */}
          <button className="hidden sm:flex p-2 text-[#64748b] hover:text-[#1e293b] hover:bg-slate-50 rounded-full transition-colors items-center justify-center">
            <span className="text-lg leading-none">🇬🇧</span>
          </button>

          {/* Notification bell */}
          <button
            data-dropdown-trigger="notifications"
            onClick={() => {
              setIsShortcutsOpen(false);
              toggleNotifications();
            }}
            className="relative p-2 text-[#64748b] hover:text-[#1e293b] hover:bg-slate-50 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] bg-[#f97316] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* Shortcuts Grid Trigger */}
          <div className="relative" ref={shortcutsRef}>
            <button 
              data-dropdown-trigger="shortcuts"
              onClick={toggleShortcuts}
              className={`p-2 rounded-full transition-colors ${
                isShortcutsOpen ? 'bg-blue-50 text-blue-600' : 'text-[#64748b] hover:text-[#1e293b] hover:bg-slate-50'
              }`}
              title="Quick Shortcuts"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>

            {/* Shortcuts Dropdown Popover */}
            {isShortcutsOpen && (
              <div className="absolute -right-12 sm:right-0 mt-3 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 p-3.5 sm:p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 px-1">
                  <h4 className="text-sm font-bold text-[#1e293b] flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-blue-500" />
                    Shortcuts
                  </h4>
                  <span className="text-[11px] font-medium text-slate-400">Quick Access</span>
                </div>

                <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                  {shortcutsList.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.title}
                        onClick={() => handleShortcutClick(item.route)}
                        className="flex flex-col text-left p-4 hover:bg-slate-50 transition-colors group"
                      >
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${item.color} group-hover:scale-105 transition-transform`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-bold text-[#1e293b] leading-tight group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 leading-tight">
                          {item.sub}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Profile trigger */}
          <div 
            data-dropdown-trigger="profile"
            className="flex items-center ml-1 sm:ml-2 bg-slate-50 rounded-full pr-1 md:pr-4 pl-1 py-1 cursor-pointer border border-[#e2e8f0] hover:bg-slate-100 transition-colors" 
            onClick={() => {
              setIsShortcutsOpen(false);
              toggleProfile();
            }}
          >
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

