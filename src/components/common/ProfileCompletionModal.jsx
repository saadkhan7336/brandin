import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Settings, AlertCircle } from 'lucide-react';
import { Button } from './Button'; // Assuming you have a standard Button component

function getSettingsByRole(role) {
  switch (role) {
    case "brand":
      return "/brand/settings";
    case "influencer":
      return "/influencer/settings";
    default:
      return "/login";
  }
}

function getDashboardByRole(role) {
  switch (role) {
    case "brand":
      return "/brand/dashboard";
    case "influencer":
      return "/influencer/dashboard";
    default:
      return "/login";
  }
}

export default function ProfileCompletionModal() {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  // Do not show if loading, not authenticated, or profile is complete
  if (loading || !isAuthenticated || !user || user.profileComplete) {
    return null;
  }

  // Do not show if they are already on the settings page or dashboard
  const settingsPath = getSettingsByRole(user.role);
  const dashboardPath = getDashboardByRole(user.role);
  
  if (location.pathname === settingsPath || location.pathname === dashboardPath) {
    return null;
  }

  const handleGoToSettings = () => {
    navigate(settingsPath);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/40 backdrop-blur-sm">
      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl bg-white rounded-xl shadow-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300 border-l-4 border-blue-500">
        <div className="flex items-center gap-4 text-left">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Profile Incomplete</h2>
            <p className="text-gray-600 text-sm">
              Please complete your profile to unlock all features.
            </p>
          </div>
        </div>
        
        <Button 
          onClick={handleGoToSettings} 
          variant="primary" 
          className="flex-shrink-0 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Settings className="w-4 h-4" />
          Complete Profile
        </Button>
      </div>
    </div>
  );
}
