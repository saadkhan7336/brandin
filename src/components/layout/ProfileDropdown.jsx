import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';

export default function ProfileDropdown({ user, isOpen, onClose, onLogout }) {
  const panelRef = useRef(null);
  const navigate = useNavigate();

  const userName = user?.name || user?.brandName || user?.fullName || 'User';
  const userEmail = user?.email || 'user@example.com';
  const userRole = user?.role || 'brand';
  const initial = userName.charAt(0).toUpperCase();

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
      className="absolute right-4 top-[72px] w-[300px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
      style={{ animation: 'fadeSlideDown 0.2s ease-out' }}
    >
      {/* Blue gradient header */}
      <div className="relative h-24 bg-gradient-to-r from-blue-500 to-blue-600">
        {/* Avatar overlapping header */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-blue-500 border-[3px] border-white flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-white">{initial}</span>
            </div>
            {/* Green status dot */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="pt-12 pb-4 px-5 text-center">
        <h4 className="text-lg font-bold text-gray-900">{userName}</h4>
        <p className="text-sm text-blue-500 mt-0.5">{userEmail}</p>
      </div>

      {/* Status + Role cards */}
      <div className="px-5 pb-4 grid grid-cols-2 gap-3">
        <div className="border border-gray-200 rounded-xl p-3">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Status</p>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-semibold text-green-500">Active Now</span>
          </div>
        </div>
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
