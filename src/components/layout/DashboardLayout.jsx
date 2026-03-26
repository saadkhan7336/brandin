import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import NotificationPanel from './NotificationPanel';
import ProfileDropdown from './ProfileDropdown';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useSelector((state) => state.auth);

  const userRole = user?.role || 'brand';

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
          notificationCount={3}
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
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onLogout={handleLogout}
        />
      </div>

      {/* Body: Sidebar + Main */}
      <div className="flex">
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
