import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleNotifications = () => {
    setIsNotificationOpen((prev) => !prev);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
    setIsNotificationOpen(false);
  };

  const closeAllDropdowns = () => {
    setIsNotificationOpen(false);
    setIsProfileOpen(false);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const value = React.useMemo(() => ({
    isSidebarOpen,
    isNotificationOpen,
    isProfileOpen,
    toggleSidebar,
    toggleNotifications,
    toggleProfile,
    closeAllDropdowns,
    closeSidebar,
  }), [isSidebarOpen, isNotificationOpen, isProfileOpen]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
