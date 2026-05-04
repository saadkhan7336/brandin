import React, { useRef, useEffect } from 'react';
import { X, CheckCircle2, Info, AlertTriangle, CircleDollarSign, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } from '../../redux/slices/notificationSlice';
import { formatDistanceToNow } from 'date-fns';

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

export default function NotificationPanel({ isOpen, onClose }) {
  const panelRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: notifications, unreadCount, loading } = useSelector((state) => state.notifications);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNotifications({ limit: 5 }));
    }
  }, [isOpen, dispatch]);

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
      className="absolute right-16 top-[80px] w-[380px] bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-in"
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
      <div className="max-h-[360px] overflow-y-auto">
        {loading && notifications.length === 0 ? (
          <div className="py-10 text-center text-gray-500 text-sm">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="py-10 text-center text-gray-500 text-sm">No notifications found</div>
        ) : (
          notifications.map((notif) => {
            const cfg = typeConfig[notif.type] || typeConfig[notif.category] || typeConfig.info;
            const Icon = cfg.icon;
            return (
              <div
                key={notif._id}
                onClick={() => !notif.isRead && handleMarkRead(notif._id)}
                className={`group flex items-start gap-3 px-5 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer relative ${
                  !notif.isRead ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className={`w-9 h-9 rounded-full ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon className={`w-[18px] h-[18px] ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5 leading-snug">{notif.message || notif.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    {!notif.isRead && (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                    <button 
                        onClick={(e) => handleDelete(e, notif._id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100">
        <button 
          onClick={handleViewAll}
          className="w-full py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          View All Notifications
        </button>
      </div>
    </div>
  );
}

