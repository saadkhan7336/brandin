import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function ProfileDropdown({ user, roleProfile, isOpen, onClose, onLogout }) {
  const panelRef = useRef(null);
  const navigate = useNavigate();
  const { updateStatus } = useAuth();

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

  const userEmail = user?.email || 'user@example.com';
  const initial = displayName.charAt(0).toUpperCase();

  // Dynamic avatars & cover
  const avatarUrl = isBrand ? (roleProfile?.logo || user?.profilePic) : (user?.profilePic);
  const coverUrl = user?.coverPic;

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const settingsPath = userRole === 'brand' ? '/brand/settings' : '/influencer/settings';

  return (
    <div
      ref={panelRef}
      className="absolute right-4 top-[80px] w-[300px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
      style={{ animation: 'fadeSlideDown 0.2s ease-out' }}
    >
      {/* Blue gradient header / Cover image */}
      <div className="relative h-24 bg-gradient-to-r from-blue-500 to-blue-600 overflow-hidden">
        {coverUrl && (
          <img src={coverUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/20" /> {/* Subtle overlay for contrast */}
      </div>

      {/* Avatar overlapping header - Moved outside to prevent overflow clipping */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-blue-500 border-[3px] border-white flex items-center justify-center shadow-lg overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-white">{initial}</span>
            )}
          </div>
          {/* Status dot */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            user?.status === 'offline' ? 'bg-gray-400' : 'bg-green-500'
          }`} />
        </div>
      </div>

      {/* User info */}
      <div className="pt-12 pb-4 px-5 text-center">
        <h4 className="text-lg font-bold text-gray-900 truncate px-2">{displayName}</h4>
        <p className="text-sm text-blue-500 mt-0.5 truncate">{userEmail}</p>
      </div>

      {/* Status + Role cards */}
      <div className="px-5 pb-4 grid grid-cols-2 gap-3">
        <button 
          onClick={() => updateStatus(user?.status === 'offline' ? 'active' : 'offline')}
          className="border border-gray-200 rounded-xl p-3 text-left hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
        >
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Status</p>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${user?.status === 'offline' ? 'bg-gray-400' : 'bg-green-500'}`} />
              <span className={`text-sm font-semibold ${user?.status === 'offline' ? 'text-gray-500' : 'text-green-500'}`}>
                {user?.status === 'offline' ? 'Offline' : 'Active Now'}
              </span>
            </div>
            {user?.status === 'offline' ? (
              <ToggleLeft className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" />
            ) : (
              <ToggleRight className="w-5 h-5 text-green-500 transition-colors" />
            )}
          </div>
        </button>
        <div className="border border-gray-200 rounded-xl p-3">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Role</p>
          <p className="text-sm font-semibold text-gray-900 mt-1 capitalize">{userRole}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-100 px-3 py-3 space-y-1">
        <button
          onClick={() => {
            onClose();
            navigate(settingsPath);
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <Settings className="w-[18px] h-[18px] text-blue-500" />
          </div>
          <div className="text-left">
            <p className="font-medium">Profile Settings</p>
            <p className="text-xs text-gray-400">Manage account details</p>
          </div>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
            <LogOut className="w-[18px] h-[18px] text-red-500" />
          </div>
          <div className="text-left">
            <p className="font-medium">Logout</p>
            <p className="text-xs text-gray-400">Sign out of session</p>
          </div>
        </button>
      </div>
    </div>
  );
}
