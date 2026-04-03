import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import NotificationPanel from './NotificationPanel';
import ProfileDropdown from './ProfileDropdown';
import { fetchNotifications } from '../../redux/slices/notificationSlice';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const { user } = useSelector((state) => state.auth);
  const { roleProfile } = useSelector((state) => state.profile);

  const userRole = user?.role || 'brand';
  const { unreadCount } = useSelector((state) => state.notifications);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications({ limit: 5 }));
  }, [dispatch]);

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
      <div className="relative">
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
      <div className="flex h-[calc(100vh-72px)] overflow-hidden">
        <Sidebar
          userRole={userRole}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
        />

        {/* Main content — dynamic pages via <Outlet> */}
        <main className="flex-1 p-5 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
