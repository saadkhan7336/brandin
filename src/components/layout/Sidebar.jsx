import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  LayoutDashboard, Search, FileText, Settings, User,
  LogOut, Target, Handshake, Building2, MessageCircle, CreditCard,
  HelpCircle, ChevronDown, ChevronRight, Inbox, Calendar, Hash
} from "lucide-react";
import { clearPendingRequestCount, clearActiveCollabCount } from "../../redux/slices/collaborationSlice";
import { useDashboardContext } from "../../context/DashboardContext";
import { useAuth } from "../../hooks/useAuth";

// ─── Nav Definitions ────────────────────────────────────────────────────────
const brandNavItems = [
  {
    section: "Pages",
    items: [
      { icon: LayoutDashboard, label: "Dashboard",   path: "/brand/dashboard" },
      { icon: Search,          label: "Influencers", path: "/brand/influencer" },
      {
        icon: Target, label: "Campaigns", path: "/brand/campaigns",
        children: [
          { label: "All Campaigns", path: "/brand/campaigns" },
          { label: "Create New",    path: "/brand/campaigns/new" },
        ]
      },
      {
        icon: Handshake, label: "Collaborations", path: "/brand/collaborations",
        children: [
          { label: "Active",   path: "/brand/collaborations" },
          { label: "Requests", path: "/brand/requests" },
        ]
      },
      { icon: MessageCircle, label: "Messages", path: "/messages", badgeKey: "messages" },
      { icon: CreditCard,    label: "Payments",  path: "/brand/payments" },
    ]
  },
  {
    section: "More",
    items: [
      { icon: User,     label: "My Profile", path: "/brand/profile" },
      { icon: Settings, label: "Settings",   path: "/brand/settings" },
    ]
  }
];

const influencerNavItems = [
  {
    section: "Pages",
    items: [
      { icon: LayoutDashboard, label: "Dashboard",    path: "/influencer/dashboard" },
      { icon: Building2,       label: "Find Brands",  path: "/influencer/search/campaigns" },
      {
        icon: Handshake, label: "Collaborations", path: "/influencer/collaborations",
        children: [
          { label: "Active",   path: "/influencer/collaborations" },
          { label: "Requests", path: "/influencer/requests" },
        ]
      },
      { icon: MessageCircle, label: "Messages", path: "/messages", badgeKey: "messages" },
      { icon: CreditCard,    label: "Payments",  path: "/influencer/payments" },
    ]
  },
  {
    section: "More",
    items: [
      { icon: User,     label: "My Profile", path: "/influencer/profile" },
      { icon: Settings, label: "Settings",   path: "/influencer/settings" },
    ]
  }
];

const adminNavItems = [
  {
    section: "Pages",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
      { icon: Target,          label: "Campaigns", path: "/admin/campaigns" },
      { icon: Settings,        label: "Settings",  path: "/admin/settings" },
    ]
  }
];

// ─── Logo Component ──────────────────────────────────────────────────────────
// Removed as requested
function SidebarLogo({ isCollapsed }) {
  return null;
}

// ─── NavItem Component ───────────────────────────────────────────────────────
function NavItem({ item, isCollapsed, badge, showCompletionWarning }) {
  const location = useLocation();
  const { closeSidebar: onClose } = useDashboardContext();

  const isParentActive = item.children
    ? item.children.some(c => location.pathname === c.path) || location.pathname === item.path
    : false;

  const [open, setOpen] = useState(isParentActive);

  const Icon = item.icon;
  const isProfilePage = item.path.includes("profile");
  const hasChildren = item.children && item.children.length > 0;

  // Active style classes (using brand colors)
  const activeClass = "bg-[#eff6ff] text-[#2563eb] font-semibold";
  const inactiveClass = "text-[#475569] hover:bg-[#eff6ff] hover:text-[#2563eb]";

  if (hasChildren && !isCollapsed) {
    return (
      <div>
        <button
          onClick={() => setOpen(o => !o)}
          className={`
            w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
            transition-all duration-200 cursor-pointer
            ${isParentActive ? activeClass : inactiveClass}
          `}
        >
          <Icon className="w-[18px] h-[18px] flex-shrink-0" />
          <span className="flex-1 text-left truncate">{item.label}</span>
          {open
            ? <ChevronDown className="w-4 h-4 text-current opacity-50" />
            : <ChevronRight className="w-4 h-4 text-current opacity-50" />
          }
        </button>

        {/* Sub-items */}
        {open && (
          <div className="mt-0.5 ml-9 flex flex-col gap-0.5">
            {item.children.map(child => (
              <NavLink
                key={child.path}
                to={child.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm transition-all duration-150
                  ${isActive
                    ? 'text-[#2563eb] font-semibold bg-[#eff6ff]'
                    : 'text-[#94a3b8] hover:text-[#2563eb] hover:bg-[#eff6ff] font-medium'
                  }`
                }
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      onClick={onClose}
      title={isCollapsed ? item.label : ""}
      className={({ isActive }) =>
        `relative flex items-center ${isCollapsed ? 'justify-center py-3' : 'gap-3 px-4 py-2.5'} rounded-xl text-sm font-medium
        transition-all duration-200
        ${isActive ? activeClass : inactiveClass}`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-[18px] h-[18px]'} flex-shrink-0`} />

          {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}

          {/* Rectangular badge */}
          {badge > 0 && !isCollapsed && (
            <span className="flex items-center justify-center min-w-[22px] h-[20px] px-1.5
              bg-[#2563eb] text-white text-[10px] font-bold rounded-md">
              {badge > 99 ? '99+' : badge}
            </span>
          )}

          {/* Collapsed badge dot */}
          {badge > 0 && isCollapsed && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#2563eb] rounded-full" />
          )}

          {/* Profile incomplete warning dot */}
          {isProfilePage && showCompletionWarning && !isCollapsed && (
            <span className="w-2 h-2 bg-red-500 rounded-full" />
          )}
        </>
      )}
    </NavLink>
  );
}

// ─── Main Sidebar ────────────────────────────────────────────────────────────
export default function Sidebar({ isCollapsed }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useSelector((state) => state.auth);
  const { conversations } = useSelector((state) => state.chat || { conversations: [] });
  const { pendingRequestCount, activeCollabCount } = useSelector(
    (state) => state.collaboration
  );

  const { isSidebarOpen: isOpen, closeSidebar: onClose } = useDashboardContext();
  const userRole = user?.role || 'brand';

  const location = useLocation();

  const unreadMessageCount = conversations.reduce((count, conv) => {
    if (conv.lastMessage && !conv.lastMessage.isRead) {
      const senderId = conv.lastMessage.sender?._id || conv.lastMessage.sender;
      if (String(senderId) !== String(user?._id)) return count + 1;
    }
    return count;
  }, 0);

  React.useEffect(() => {
    if (location.pathname.includes("/requests")) dispatch(clearPendingRequestCount());
    if (location.pathname.includes("/collaborations")) dispatch(clearActiveCollabCount());
  }, [location.pathname, dispatch]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navGroups =
    userRole === "brand"      ? brandNavItems :
    userRole === "influencer" ? influencerNavItems :
    adminNavItems;

  const showCompletionWarning = user && !user.profileComplete && userRole !== "admin" && !isCollapsed;

  const getBadge = (item) => {
    if (item.badgeKey === 'messages') return unreadMessageCount;
    return 0;
  };

  return (
    <>
      <aside
        className={`
          fixed lg:static left-0 z-30 bg-white border-r border-[#e2e8f0]
          flex flex-col transition-all duration-300 ease-in-out
          lg:translate-x-0 top-[80px] lg:top-0 h-[calc(100vh-80px)] lg:h-full
          ${isCollapsed ? "w-16" : "w-64 xl:w-72"}
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo Removed */}

        {/* Nav */}
        <nav className={`flex-1 flex flex-col ${isCollapsed ? 'px-2' : 'px-3'} py-4 space-y-5 overflow-y-auto overflow-x-hidden`}>
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="flex flex-col space-y-0.5">
              {/* Section Label */}
              {!isCollapsed && (
                <div className="px-4 pb-1.5 pt-1 text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">
                  {group.section}
                </div>
              )}
              {isCollapsed && groupIdx > 0 && (
                <div className="my-2 border-t border-[#e2e8f0]" />
              )}

              {group.items.map((item) => (
                <NavItem
                  key={item.path}
                  item={item}
                  isCollapsed={isCollapsed}
                  badge={getBadge(item)}
                  showCompletionWarning={showCompletionWarning}
                />
              ))}
            </div>
          ))}

          <div className="flex-1" />

          {/* Bottom Actions */}
          <div className="flex flex-col gap-1 mt-auto pt-4 border-t border-[#e2e8f0]">
            {userRole === 'brand' && !isCollapsed && (
              <button
                onClick={() => { onClose(); navigate('/brand/campaigns'); }}
                className="flex items-center justify-center py-2.5 px-4 mx-1 rounded-xl
                  bg-[#2563eb] hover:bg-blue-700
                  text-white font-semibold text-sm transition-all duration-200 mb-3 shadow-sm"
              >
                + Create Campaign
              </button>
            )}
            {userRole === 'brand' && isCollapsed && (
              <button
                onClick={() => { onClose(); navigate('/brand/campaigns'); }}
                title="Create Campaign"
                className="flex items-center justify-center p-2.5 mx-auto rounded-xl
                  bg-[#2563eb] hover:bg-blue-700
                  text-white transition-all duration-200 mb-3 shadow-sm"
              >
                <Target className="w-4 h-4" />
              </button>
            )}

            <NavLink
              to="/help-center"
              onClick={onClose}
              title={isCollapsed ? "Help Center" : ""}
              className={({ isActive }) =>
                `flex items-center ${isCollapsed ? 'justify-center py-3' : 'gap-3 px-4 py-2.5'} rounded-xl text-sm font-medium transition-all duration-200
                ${isActive ? "bg-[#eff6ff] text-[#2563eb]" : "text-[#64748b] hover:bg-[#eff6ff] hover:text-[#2563eb]"}`
              }
            >
              <HelpCircle className={`${isCollapsed ? 'w-5 h-5' : 'w-[18px] h-[18px]'} flex-shrink-0`} />
              {!isCollapsed && <span>Help Center</span>}
            </NavLink>

            <button
              onClick={handleLogout}
              title={isCollapsed ? "Sign Out" : ""}
              className={`flex items-center ${isCollapsed ? 'justify-center py-3' : 'gap-3 px-4 py-2.5'} rounded-xl text-sm font-medium text-[#64748b] hover:text-red-600 hover:bg-red-50 transition-colors duration-200`}
            >
              <LogOut className={`${isCollapsed ? 'w-5 h-5' : 'w-[18px] h-[18px]'} flex-shrink-0`} />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
    </>
  );
}