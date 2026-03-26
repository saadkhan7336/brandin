import React, { useRef, useEffect } from 'react';
import { X, CheckCircle2, Info, AlertTriangle, CircleDollarSign } from 'lucide-react';

// Dummy notifications — replace with real data later
const dummyNotifications = [
  {
    id: 1,
    type: 'success',
    title: 'New Collaboration Request',
    description: 'You have received a collaboration request from FashionHub',
    time: '5 minutes ago',
    unread: true,
  },
  {
    id: 2,
    type: 'info',
    title: 'Campaign Update',
    description: 'Summer Collection Launch campaign has been updated',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 3,
    type: 'warning',
    title: 'Deliverable Due Soon',
    description: 'You have 2 deliverables due in 3 days',
    time: '1 day ago',
    unread: false,
  },
  {
    id: 4,
    type: 'success',
    title: 'Payment Received',
    description: 'Payment of $800 has been processed',
    time: '2 days ago',
    unread: false,
  },
];

const typeConfig = {
  success: { icon: CheckCircle2, bg: 'bg-green-50', color: 'text-green-500' },
  info: { icon: Info, bg: 'bg-blue-50', color: 'text-blue-500' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50', color: 'text-amber-500' },
  payment: { icon: CircleDollarSign, bg: 'bg-green-50', color: 'text-green-500' },
};

export default function NotificationPanel({ isOpen, onClose }) {
  const panelRef = useRef(null);

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

  const unreadCount = dummyNotifications.filter((n) => n.unread).length;

  return (
    <div
      ref={panelRef}
      className="absolute right-16 top-[72px] w-[380px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in"
      style={{ animation: 'fadeSlideDown 0.2s ease-out' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">
            Mark all read
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Notifications list */}
      <div className="max-h-[360px] overflow-y-auto">
        {dummyNotifications.map((notif) => {
          const cfg = typeConfig[notif.type] || typeConfig.info;
          const Icon = cfg.icon;
          return (
            <div
              key={notif.id}
              className={`flex items-start gap-3 px-5 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer ${
                notif.unread ? 'bg-blue-50/30' : ''
              }`}
            >
              <div className={`w-9 h-9 rounded-full ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon className={`w-[18px] h-[18px] ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                <p className="text-sm text-gray-500 mt-0.5 leading-snug">{notif.description}</p>
                <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
              </div>
              {notif.unread && (
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100">
        <button className="w-full py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          View All Notifications
        </button>
      </div>
    </div>
  );
}
