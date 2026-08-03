import React, { useRef, useEffect } from 'react';
import { X, CheckCircle2, Info, AlertTriangle, CircleDollarSign, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } from '../../redux/slices/notificationSlice';
import { formatDistanceToNow } from 'date-fns';
import { useDashboardContext } from '../../context/DashboardContext';

const typeConfig = {
  success: { icon: CheckCircle2, bg: 'bg-green-50', color: 'text-green-500' },
  info: { icon: Info, bg: 'bg-blue-50', color: 'text-blue-500' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50', color: 'text-amber-500' },
  payment: { icon: CircleDollarSign, bg: 'bg-green-50', color: 'text-green-500' },
  payment_success: { icon: CheckCircle2, bg: 'bg-emerald-50', color: 'text-emerald-500' },
  payout_released: { icon: CircleDollarSign, bg: 'bg-green-50', color: 'text-green-500' },
  escrow_funded: { icon: Info, bg: 'bg-blue-50', color: 'text-blue-500' },
  application: { icon: Info, bg: 'bg-blue-50', color: 'text-blue-500' },
  collaboration: { icon: CheckCircle2, bg: 'bg-indigo-50', color: 'text-indigo-500' },
  system: { icon: AlertTriangle, bg: 'bg-gray-50', color: 'text-gray-500' },
};

export default function NotificationPanel() {
  const panelRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: notifications, unreadCount, loading } = useSelector((state) => state.notifications);
  
  const { isNotificationOpen: isOpen, closeAllDropdowns: onClose } = useDashboardContext();

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNotifications({ limit: 4 }));
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (e.target.closest('[data-dropdown-trigger]')) {
        return;
      }
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

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  const handleMarkRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatch(deleteNotification(id));
  };

  const handleViewAll = () => {
    onClose();
    navigate('/notifications');
  };

  return (
    <div
      ref={panelRef}
      className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-16 top-[76px] sm:top-[80px] w-auto sm:w-[380px] max-w-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-in"
      style={{ animation: 'fadeSlideDown 0.2s ease-out' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleMarkAllRead}
            className="text-sm text-blue-500 hover:text-blue-600 font-medium disabled:opacity-50"
            disabled={unreadCount === 0}
          >
            Mark all read
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Notifications list */}
      <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
        {loading && notifications.length === 0 ? (
          <div className="py-10 text-center text-gray-500 text-sm">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="py-10 text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Info className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.slice(0, 4).map((notif) => {
              const cfg = typeConfig[notif.type] || typeConfig[notif.category] || typeConfig.info;
              const Icon = cfg.icon;
              return (
                <div
                  key={notif._id}
                  onClick={() => !notif.isRead && handleMarkRead(notif._id)}
                  className={`group flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50/70 transition-colors cursor-pointer relative ${
                    !notif.isRead ? 'bg-blue-50/25' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-900 leading-snug">{notif.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">{notif.message || notif.description}</p>
                    <p className="text-[11px] text-gray-400 mt-1 font-medium">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2 ml-1">
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                    )}
                    <button
                      onClick={(e) => handleDelete(e, notif._id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100">
        <button
          onClick={handleViewAll}
          className="w-full py-2.5 text-[13px] font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all shadow-sm shadow-blue-100 flex items-center justify-center gap-1.5"
        >
          View All Notifications
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  );
}

