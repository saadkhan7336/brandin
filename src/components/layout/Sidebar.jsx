// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import {
//   LayoutDashboard,
//   Search,
//   FileText,
//   Settings,
//   LogOut,
//   Target,
//   Handshake,
//   Building2,
// } from 'lucide-react';

// const brandNavItems = [
//   { icon: LayoutDashboard, label: 'Dashboard', path: '/brand/dashboard' },
//   { icon: Search, label: 'Search Influencers', path: '/brand/search' },
//   { icon: FileText, label: 'My Requests', path: '/brand/requests' },
//   { icon: Handshake, label: 'Collaborations', path: '/brand/collaborations' },
//   { icon: Target, label: 'Campaigns', path: '/brand/campaigns' },
//   { icon: Settings, label: 'Profile Settings', path: '/brand/settings' },
// ];

// const influencerNavItems = [
//   { icon: LayoutDashboard, label: 'Dashboard', path: '/influencer/dashboard' },
//   { icon: Building2, label: 'Search Brands', path: '/influencer/search' },
//   { icon: FileText, label: 'Collaboration Requests', path: '/influencer/requests' },
//   { icon: Handshake, label: 'Collaborations', path: '/influencer/collaborations' },
//   { icon: Settings, label: 'Edit Profile', path: '/influencer/settings' },
// ];

// const adminNavItems = [
//   { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
//   { icon: Target, label: 'Campaigns', path: '/admin/campaigns' },
//   { icon: Settings, label: 'Settings', path: '/admin/settings' },
// ];

// export default function Sidebar({ userRole, isOpen, onClose, onLogout }) {
//   const navItems = 
//     userRole === 'brand' ? brandNavItems : 
//     userRole === 'influencer' ? influencerNavItems : 
//     adminNavItems;

//   return (
//     <>
//       {/* Sidebar */}
//       <aside
//         className={`
//           fixed lg:static inset-y-0 left-0 z-30 w-60 bg-white border-r border-gray-200
//           flex flex-col transition-transform duration-300 ease-in-out
//           lg:translate-x-0 top-[72px] lg:top-0 h-[calc(100vh-72px)] lg:h-screen
//           ${isOpen ? 'translate-x-0' : '-translate-x-full'}
//         `}
//       >
//         <nav className="flex-1 flex flex-col px-3 py-4 space-y-2 overflow-y-auto">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <NavLink
//                 key={item.path}
//                 to={item.path}
//                 onClick={onClose}
//                 className={({ isActive }) =>
//                   `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
//                   ${isActive
//                     ? 'bg-blue-50 text-blue-600'
//                     : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
//                   }`
//                 }
//               >
//                 <Icon className="w-[18px] h-[18px] flex-shrink-0" />
//                 <span>{item.label}</span>
//               </NavLink>
//             );
//           })}

//           {/* Logout */}
//           <button
//             onClick={onLogout}
//             className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-200 mt-auto"
//           >
//             <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
//             <span>Logout</span>
//           </button>
//         </nav>
//       </aside>

//       {/* Mobile overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-20 lg:hidden"
//           onClick={onClose}
//         />
//       )}
//     </>
//   );
// }


// src/components/layout/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard, Search, FileText, Settings,
  LogOut, Target, Handshake, Building2, AlertCircle,
} from "lucide-react";

const brandNavItems = [
  { icon: LayoutDashboard, label: "Dashboard",   path: "/brand/dashboard" },
  { icon: Search,          label: "Influencer",  path: "/brand/influencer" },
  { icon: FileText,        label: "My Requests", path: "/brand/requests" },
  { icon: Handshake,       label: "Collaborations",     path: "/brand/collaborations" },
  { icon: Target,          label: "Campaigns",          path: "/brand/campaigns" },
  { icon: Settings,        label: "My Profile",         path: "/brand/profile" },
];

const influencerNavItems = [
  { icon: LayoutDashboard, label: "Dashboard",              path: "/influencer/dashboard" },
  { icon: Building2,       label: "Search Brands",          path: "/influencer/search/campaigns" },
  { icon: FileText,        label: "Collaboration Requests", path: "/influencer/requests" },
  { icon: Handshake,       label: "Collaborations",         path: "/influencer/collaborations" },
  { icon: Settings,        label: "Edit Profile",           path: "/influencer/settings" },
];

const adminNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Target,          label: "Campaigns", path: "/admin/campaigns" },
  { icon: Settings,        label: "Settings",  path: "/admin/settings" },
];

export default function Sidebar({ userRole, isOpen, onClose, onLogout }) {
  const { user } = useSelector((state) => state.auth);
  const { completion } = useSelector((state) => state.profile);

  const navItems =
    userRole === "brand"      ? brandNavItems :
    userRole === "influencer" ? influencerNavItems :
    adminNavItems;

  const showCompletionWarning =
    user && !user.profileComplete && userRole !== "admin";
  const percent = completion?.percent ?? 0;

  return (
    <>
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-200
          flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 top-[80px] lg:top-0 h-[calc(100vh-80px)] lg:h-screen
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Profile completion warning */}
        {showCompletionWarning && (
          <div className="mx-3 mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-amber-800">Profile incomplete</p>
                <div className="mt-1.5 w-full bg-amber-200 rounded-full h-1.5">
                  <div
                    className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="text-xs text-amber-600 mt-1">{percent}% complete</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 flex flex-col px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isProfilePage = item.path.includes("profile");
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                <span>{item.label}</span>
                {/* Red dot on profile when profile incomplete */}
                {isProfilePage && showCompletionWarning && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </NavLink>
            );
          })}

          <div className="flex-1" />

          {/* Logout */}
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
              text-red-500 hover:bg-red-50 transition-colors duration-200"
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}