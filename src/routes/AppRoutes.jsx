import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ResetPassword from "../pages/auth/ResetPassword";

// Public pages
import LandingPage from "../pages/LandingPage";
import FeaturesPage from "../pages/FeaturesPage";
import AnalyticsPage from "../pages/features/AnalyticsPage";
import CampaignManagement from "../pages/features/CampaignManagement";
import FindMatchPage from "../pages/features/FindMatchPage";
import VerifiedProfilesPage from "../pages/features/VerifiedProfilesPage";
import HelpCenterPage from "../pages/HelpCenterPage";
import CaseStudiesPage from "../pages/CaseStudiesPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import AboutUsPage from "../pages/AboutUsPage";
import ContactPage from "../pages/ContactPage";
import BlogPage from "../pages/BlogPage";

// Layout & Route guards
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute, { getDashboardByRole } from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// Dashboard pages
import BrandDashboard from "../pages/dashboard/BrandDashboard";
import CreateCampaign from "../pages/campaign/CreateCampaign";
import CampaignHub from "../pages/campaign/CampaignHub";
import SearchInfluencers from "../pages/brand/SearchInfluencers";
import MyRequests from "../pages/brand/MyRequests";
import Profile from "../pages/profile/Profile";
import NotificationsPage from "../pages/notifications/NotificationsPage";

/**
 * Catch-all redirect component.
 * If logged in → go to their dashboard. If not → go to login.
 */
function CatchAll() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (isAuthenticated && user) {
    return <Navigate to={getDashboardByRole(user.role)} replace />;
  }
  return <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* ===== Public pages (accessible to everyone) ===== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/features/analytics" element={<AnalyticsPage />} />
        <Route
          path="/features/campaign-management"
          element={<CampaignManagement />}
        />
        <Route path="/features/find-matches" element={<FindMatchPage />} />
        <Route
          path="/features/verified-profiles"
          element={<VerifiedProfilesPage />}
        />
        <Route path="/help-center" element={<HelpCenterPage />} />
        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogPage />} />

        {/* ===== Auth pages (PublicRoute: redirects if already logged in) ===== */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* ===== Brand routes (role-protected) ===== */}
        <Route element={<ProtectedRoute allowedRoles={["brand"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/brand/dashboard" element={<BrandDashboard />} />
            <Route path="/brand/search" element={<SearchInfluencers />} />
            <Route path="/brand/requests" element={<MyRequests />} />
            <Route path="/brand/collaborations" element={<BrandDashboard />} />
            <Route path="/brand/campaigns" element={<CampaignHub />} />
            <Route path="/brand/settings" element={<Profile />} />
          </Route>
        </Route>

        {/* ===== Influencer routes (role-protected) ===== */}
        <Route element={<ProtectedRoute allowedRoles={["influencer"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/influencer/dashboard" element={<BrandDashboard />} />
            <Route
              path="/influencer/search-brands"
              element={<BrandDashboard />}
            />
            <Route path="/influencer/requests" element={<BrandDashboard />} />
            <Route
              path="/influencer/collaborations"
              element={<BrandDashboard />}
            />
            <Route path="/influencer/settings" element={<Profile />} />
          </Route>
        </Route>

        {/* ===== Admin routes (role-protected) ===== */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<BrandDashboard />} />
            <Route path="/admin/campaigns" element={<CampaignHub />} />
            <Route path="/admin/settings" element={<Profile />} />
          </Route>
        </Route>

        {/* ===== Common Protected Routes ===== */}
        <Route element={<ProtectedRoute allowedRoles={["brand", "influencer", "admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        {/* ===== Catch-all: unknown routes ===== */}
        <Route path="*" element={<CatchAll />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
