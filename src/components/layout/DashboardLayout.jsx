import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import NotificationPanel from './NotificationPanel';
import ProfileDropdown from './ProfileDropdown';
import { fetchNotifications } from '../../redux/slices/notificationSlice';
import { fetchConversations } from '../../redux/slices/chatSlice';
import { setNotifCounts, fetchSidebarCounts } from '../../redux/slices/collaborationSlice';
import profileService from '../../services/profileService';
import collaborationService from '../../services/collaborationService';
import { setProfileData } from '../../redux/slices/Profileslice';
import { updateUserFields } from '../../redux/slices/authSlice';
import CompletionBanner from '../common/CompletionBanner';
import VerificationBanner from '../common/VerificationBanner';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const { user } = useSelector((state) => state.auth);
  const { roleProfile, completion } = useSelector((state) => state.profile);

  const userRole = user?.role || 'brand';
  const { unreadCount } = useSelector((state) => state.notifications);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications({ limit: 5 }));
    dispatch(fetchConversations());
    
    // Fetch profile completion status
    const fetchProfileData = async () => {
      try {
        const profileData = await profileService.getMe();
        dispatch(setProfileData(profileData));
        if (profileData.user) {
          dispatch(updateUserFields(profileData.user));
        }
      } catch (err) {
        console.error("Error fetching profile completion:", err);
      }
    };
    fetchProfileData();

    dispatch(fetchSidebarCounts());
  }, [dispatch, user?._id]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleToggleNotifications = () => {
    setIsNotificationOpen((prev) => !prev);
    setIsProfileOpen(false);
  };

  const handleToggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
    setIsNotificationOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Navbar — fixed top */}
      <div className="relative z-[60]">
        <Navbar
          userRole={userRole}
          user={user}
          roleProfile={roleProfile}
          notificationCount={unreadCount}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onToggleNotifications={handleToggleNotifications}
          onToggleProfile={handleToggleProfile}
        />

        {/* Dropdowns — positioned relative to navbar */}
        <NotificationPanel
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
        <ProfileDropdown
          user={user}
          roleProfile={roleProfile}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onLogout={handleLogout}
        />
      </div>

      {/* Body: Sidebar + Main */}
      <div className="flex h-[calc(100vh-80px)] overflow-hidden">
        <Sidebar
          userRole={userRole}
          isOpen={isSidebarOpen}
          isCollapsed={location.pathname === '/messages'}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
        />

        {/* Main content — dynamic pages via <Outlet> */}
        <main className={`flex-1 min-w-0 overflow-y-auto w-full ${location.pathname === '/messages' ? 'p-0' : 'p-4 sm:p-6 lg:p-8'}`}>
          {/* Social Verification Banner */}
          <VerificationBanner 
            user={user} 
            roleProfile={roleProfile} 
            onGoToSettings={() => navigate(user?.role === 'brand' ? '/brand/settings' : '/influencer/settings')}
          />

          {/* Global Completion Banner */}
          {completion && !completion.isComplete && (
            <div className="mb-8">
              <CompletionBanner 
                completion={completion} 
                onGoToSection={() => navigate(user?.role === 'brand' ? '/brand/settings' : '/influencer/settings')} 
              />
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
