// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import React from "react";
// import { useSelector } from "react-redux";

// // Auth pages
// import Login from "../pages/auth/Login";
// import Register from "../pages/auth/Register";
// import ForgotPassword from "../pages/auth/ForgotPassword";
// import VerifyOtp from "../pages/auth/VerifyOtp";
// import ResetPassword from "../pages/auth/ResetPassword";

// // Public pages
// import LandingPage from "../pages/LandingPage";
// import FeaturesPage from "../pages/FeaturesPage";
// import AnalyticsPage from "../pages/features/AnalyticsPage";
// import CampaignManagement from "../pages/features/CampaignManagement";
// import FindMatchPage from "../pages/features/FindMatchPage";
// import VerifiedProfilesPage from "../pages/features/VerifiedProfilesPage";
// import HelpCenterPage from "../pages/HelpCenterPage";
// import CaseStudiesPage from "../pages/CaseStudiesPage";
// import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
// import AboutUsPage from "../pages/AboutUsPage";
// import ContactPage from "../pages/ContactPage";
// import BlogPage from "../pages/BlogPage";

// // Layout & Route guards
// import DashboardLayout from "../components/layout/DashboardLayout";
// import ProtectedRoute, { getDashboardByRole } from "./ProtectedRoute";
// import PublicRoute from "./PublicRoute";

// // Dashboard pages
// import BrandDashboard from "../pages/dashboard/BrandDashboard";
// import CampaignHub from "../pages/campaign/CampaignHub";
// import Profile from "../pages/profile/ProfilesSetting";
// import SearchExplore from "../components/layout/influencer/SearchExplore";
// import CampaignDetail from "../components/layout/influencer/CampaignDetail";
// import BrandPublicProfile from "../components/layout/influencer/BrandPublicProfile";
// import InfluencerExplore from "../components/layout/brand/InfluencerExplore";

// /**
//  * Catch-all redirect component.
//  * If logged in → go to their dashboard. If not → go to login.
//  */
// function CatchAll() {
//   const { isAuthenticated, user } = useSelector((state) => state.auth);
//   if (isAuthenticated && user) {
//     return <Navigate to={getDashboardByRole(user.role)} replace />;
//   }
//   return <Navigate to="/login" replace />;
// }

// function AppRoutes() {
//   return (
//     <Router>
//       <Routes>
//         {/* ===== Public pages (accessible to everyone) ===== */}
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/features" element={<FeaturesPage />} />
//         <Route path="/features/analytics" element={<AnalyticsPage />} />
//         <Route
//           path="/features/campaign-management"
//           element={<CampaignManagement />}
//         />
//         <Route path="/features/find-matches" element={<FindMatchPage />} />
//         <Route
//           path="/features/verified-profiles"
//           element={<VerifiedProfilesPage />}
//         />
//         <Route path="/help-center" element={<HelpCenterPage />} />
//         <Route path="/case-studies" element={<CaseStudiesPage />} />
//         <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
//         <Route path="/about" element={<AboutUsPage />} />
//         <Route path="/contact" element={<ContactPage />} />
//         <Route path="/blog" element={<BlogPage />} />

//         {/* ===== Auth pages (PublicRoute: redirects if already logged in) ===== */}
//         <Route element={<PublicRoute />}>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/verify-otp" element={<VerifyOtp />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//         </Route>

//         {/* ===== Brand routes (role-protected) ===== */}
//         <Route element={<ProtectedRoute allowedRoles={["brand"]} />}>
//           <Route element={<DashboardLayout />}>
//             <Route path="/brand/dashboard" element={<BrandDashboard />} />
//             <Route path="/brand/search" element={<InfluencerExplore />} />
//             <Route path="/brand/requests" element={<BrandDashboard />} />
//             <Route path="/brand/collaborations" element={<BrandDashboard />} />
//             <Route path="/brand/campaigns" element={<CampaignHub />} />
//             <Route path="/brand/settings" element={<Profile />} />
//           </Route>
//         </Route>

//         {/* ===== Influencer routes (role-protected) ===== */}
//         <Route element={<ProtectedRoute allowedRoles={["influencer"]} />}>
//           <Route element={<DashboardLayout />}>
//             <Route path="/influencer/dashboard" element={<BrandDashboard />} />
//             <Route path="/influencer/search" element={<SearchExplore />} />
//             <Route path="/influencer/search/campaign/:campaignId" element={<CampaignDetail />} />
//             <Route path="/influencer/search/brand/:brandId" element={<BrandPublicProfile />} />

//             <Route path="/influencer/requests" element={<BrandDashboard />} />
//             <Route path="/influencer/collaborations" element={<BrandDashboard />} />
//             <Route path="/influencer/settings" element={<Profile />} />
//           </Route>
//         </Route>

//         {/* ===== Catch-all: unknown routes ===== */}
//         <Route path="*" element={<CatchAll />} />
//       </Routes>
//     </Router>
//   );
// }

// export default AppRoutes;


// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";

// Auth pages
import Login          from "../pages/auth/Login";
import Register       from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOtp      from "../pages/auth/VerifyOtp";
import ResetPassword  from "../pages/auth/ResetPassword";

// Public pages
import LandingPage         from "../pages/LandingPage";
import FeaturesPage        from "../pages/FeaturesPage";
import AnalyticsPage       from "../pages/features/AnalyticsPage";
import CampaignManagement  from "../pages/features/CampaignManagement";
import FindMatchPage       from "../pages/features/FindMatchPage";
import VerifiedProfilesPage from "../pages/features/VerifiedProfilesPage";
import HelpCenterPage      from "../pages/HelpCenterPage";
import CaseStudiesPage     from "../pages/CaseStudiesPage";
import PrivacyPolicyPage   from "../pages/PrivacyPolicyPage";
import AboutPage           from "../pages/AboutUsPage";
import ContactPage         from "../pages/ContactPage";
import BlogPage            from "../pages/BlogPage";

// Layout & guards
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute, { getDashboardByRole } from "./ProtectedRoute";
import PublicRoute     from "./PublicRoute";

// Dashboard / brand pages
import BrandDashboard from "../pages/dashboard/BrandDashboard";
import Campaign        from "../pages/campaign/CampaignHub";
import CampaignHub     from "../pages/campaign/CampaignHub";

// Profile settings (shared page, role-aware)
import ProfileSettings from "../pages/profile/ProfilesSetting";

// Influencer-specific pages
import SearchExplore       from "../components/layout/influencer/SearchExplore";
import CampaignDetail      from "../components/layout/influencer/CampaignDetail";
import BrandPublicProfile  from "../components/layout/influencer/BrandPublicProfile";

function CatchAll() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (isAuthenticated && user) {
    return <Navigate to={getDashboardByRole(user.role)} replace />;
  }
  return <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Router>
      <Routes>

        {/* ── Public (no auth needed) ────────────────────────────────── */}
        <Route path="/"                          element={<LandingPage />} />
        <Route path="/features"                  element={<FeaturesPage />} />
        <Route path="/features/analytics"        element={<AnalyticsPage />} />
        <Route path="/features/campaign-management" element={<CampaignManagement />} />
        <Route path="/features/find-matches"     element={<FindMatchPage />} />
        <Route path="/features/verified-profiles" element={<VerifiedProfilesPage />} />
        <Route path="/help-center"               element={<HelpCenterPage />} />
        <Route path="/case-studies"              element={<CaseStudiesPage />} />
        <Route path="/privacy-policy"            element={<PrivacyPolicyPage />} />
        <Route path="/about"                     element={<AboutPage />} />
        <Route path="/contact"                   element={<ContactPage />} />
        <Route path="/blog"                      element={<BlogPage />} />

        {/* ── Auth (redirect if already logged in) ──────────────────── */}
        <Route element={<PublicRoute />}>
          <Route path="/login"          element={<Login />} />
          <Route path="/register"       element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp"     element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* ── Brand routes ──────────────────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={["brand"]} />}>
          <Route element={<DashboardLayout />}>
            {/*
              requireComplete on most pages means incomplete brands
              are redirected to /brand/settings automatically.
              Settings itself has no requireComplete so they can edit.
            */}
            <Route element={<ProtectedRoute allowedRoles={["brand"]} requireComplete />}>
              <Route path="/brand/dashboard"      element={<BrandDashboard />} />
              <Route path="/brand/search"         element={<BrandDashboard />} />
              <Route path="/brand/requests"       element={<BrandDashboard />} />
              <Route path="/brand/collaborations" element={<BrandDashboard />} />
              <Route path="/brand/campaigns"      element={<CampaignHub />} />
            </Route>

            {/* Settings — always accessible, even if incomplete */}
            <Route path="/brand/settings" element={<ProfileSettings />} />
          </Route>
        </Route>

        {/* ── Influencer routes ─────────────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={["influencer"]} />}>
          <Route element={<DashboardLayout />}>
            <Route element={<ProtectedRoute allowedRoles={["influencer"]} requireComplete />}>
              <Route path="/influencer/dashboard"      element={<BrandDashboard />} />
              <Route path="/influencer/requests"       element={<BrandDashboard />} />
              <Route path="/influencer/collaborations" element={<BrandDashboard />} />
              <Route path="/influencer/search"         element={<Navigate to="/influencer/search/campaigns" replace />} />
              <Route path="/influencer/search/:tab"   element={<SearchExplore />} />
              <Route path="/influencer/search/campaign/:campaignId" element={<CampaignDetail />} />
              <Route path="/influencer/search/brand/:brandId"       element={<BrandPublicProfile />} />
            </Route>

            {/* Settings — always accessible */}
            <Route path="/influencer/settings" element={<ProfileSettings />} />
          </Route>
        </Route>

        {/* ── Admin routes ───────────────────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<BrandDashboard />} />
            <Route path="/admin/campaigns" element={<Campaign />} />
            <Route path="/admin/settings"  element={<ProfileSettings />} />
          </Route>
        </Route>

        <Route path="*" element={<CatchAll />} />
      </Routes>
    </Router>
  );
}