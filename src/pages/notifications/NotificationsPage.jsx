import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  CheckCheck,
  Trash2,
  Bell,
  Briefcase,
  Handshake,
  MessageSquare,
  Settings,
  CheckCircle2,
  CircleDollarSign,
  Info
} from 'lucide-react';
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } from '../../redux/slices/notificationSlice';
import { formatDistanceToNow } from 'date-fns';

const categories = [
  { id: 'all', label: 'All', icon: Bell },
  { id: 'application', label: 'Applications', icon: Briefcase },
  { id: 'collaboration', label: 'Collaborations', icon: Handshake },
  { id: 'message', label: 'Messages', icon: MessageSquare },
  { id: 'system', label: 'System', icon: Settings },
];

const typeConfig = {
  payment_success: { icon: CheckCircle2, bg: 'bg-green-50', color: 'text-green-500', actionLabel: 'View Payment' },
  payout_released: { icon: CircleDollarSign, bg: 'bg-emerald-50', color: 'text-emerald-500', actionLabel: 'View Earnings' },
  escrow_funded: { icon: Info, bg: 'bg-blue-50', color: 'text-blue-500', actionLabel: 'View Escrow' },
  application: { icon: Briefcase, bg: 'bg-blue-50', color: 'text-blue-500', actionLabel: 'View Application' },
  collaboration: { icon: Handshake, bg: 'bg-indigo-50', color: 'text-indigo-500', actionLabel: 'View Collaboration' },
  collaboration_request: { icon: Handshake, bg: 'bg-amber-50', color: 'text-amber-500', actionLabel: 'View Request' },
  collaboration_accepted: { icon: CheckCircle2, bg: 'bg-green-50', color: 'text-green-500', actionLabel: 'View Collab' },
  message: { icon: MessageSquare, bg: 'bg-purple-50', color: 'text-purple-500', actionLabel: 'View Message' },
  system: { icon: Settings, bg: 'bg-gray-50', color: 'text-gray-500', actionLabel: 'View Details' },
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: notifications, unreadCount, loading, pagination } = useSelector((state) => state.notifications);

  const [activeTab, setActiveTab] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications({
      category: activeTab,
      unreadOnly: showUnreadOnly,
      limit: 20
    }));
  }, [dispatch, activeTab, showUnreadOnly]);

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  const handleMarkRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleDelete = (id) => {
    dispatch(deleteNotification(id));
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded-full">
                {unreadCount} unread notifications
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
        >
          <CheckCheck className="w-4 h-4" />
          Mark All as Read
        </button>
      </div>

      {/* Filters & Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 px-2 py-1 border-l border-gray-100 pl-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showUnreadOnly}
              onChange={() => setShowUnreadOnly(!showUnreadOnly)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-600">Show unread only</span>
          </label>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {loading && notifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full mb-4"></div>
              <div className="h-4 bg-gray-100 rounded w-48 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-32"></div>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No notifications found</h3>
            <p className="text-gray-500 max-w-xs mx-auto">
              {showUnreadOnly
                ? "You've read all your notifications in this category. Great job!"
                : "When you receive notifications, they'll appear here."}
            </p>
          </div>
        ) : (
          notifications.map((notif) => {
            const cfg = typeConfig[notif.type] || typeConfig[notif.category] || typeConfig.system;
            const Icon = cfg.icon;

            return (
              <div
                key={notif._id}
                className={`group relative bg-white rounded-xl border transition-all hover:shadow-md ${!notif.isRead ? 'border-blue-200 ring-1 ring-blue-50' : 'border-gray-100'
                  }`}
              >
                <div className="p-5 sm:p-6 flex gap-4 sm:gap-6">
                  {/* Category Icon */}
                  <div className={`hidden sm:flex w-12 h-12 rounded-xl ${cfg.bg} items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${cfg.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                          {notif.type || notif.category}
                        </span>
                        {!notif.isRead && (
                          <span className="bg-blue-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 font-medium">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-gray-900 mb-1 leading-tight group-hover:text-blue-600 transition-colors">
                      {notif.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                      {notif.message || notif.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">


                      {!notif.isRead && (
                        <button
                          onClick={() => handleMarkRead(notif._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold transition-all shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          Mark as Read
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(notif._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination (Simplified for now) */}
      {pagination.pages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {/* ... Pagination UI ... */}
        </div>
      )}
    </div>
  );
}
