import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy } from "react";

// Layout & guards (eagerly loaded)
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import LoadingFallback from "../components/common/LoadingFallback";
import OAuthCallbackPage from "../pages/auth/OAuthCallbackPage";
import GoogleLoginCallback from "../pages/auth/GoogleLoginCallback";
import ScrollToTop from "../components/common/ScrollToTop";

// Auth pages (lazy loaded)
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const VerifyOtp = lazy(() => import("../pages/auth/VerifyOtp"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));

// Public pages (lazy loaded)
const LandingPage = lazy(() => import("../pages/LandingPage"));
const FeaturesPage = lazy(() => import("../pages/FeaturesPage"));
const AnalyticsPage = lazy(() => import("../pages/features/AnalyticsPage"));
const CampaignManagement = lazy(
  () => import("../pages/features/CampaignManagement"),
);
const FindMatchPage = lazy(() => import("../pages/features/FindMatchPage"));
const VerifiedProfilesPage = lazy(
  () => import("../pages/features/VerifiedProfilesPage"),
);
const SecurePaymentsPage = lazy(
  () => import("../pages/features/SecurePaymentsPage"),
);
const RealTimeChatPage = lazy(
  () => import("../pages/features/RealTimeChatPage"),
);
const IntegrationsPage = lazy(
  () => import("../pages/features/IntegrationsPage"),
);
const ForBrandsPage = lazy(() => import("../pages/solutions/ForBrandsPage"));
const ForCreatorsPage = lazy(
  () => import("../pages/solutions/ForCreatorsPage"),
);
const AgenciesPage = lazy(() => import("../pages/solutions/AgenciesPage"));
const EnterprisePage = lazy(() => import("../pages/solutions/EnterprisePage"));
const SolutionsPage = lazy(() => import("../pages/SolutionsPage"));
const HelpCenterPage = lazy(() => import("../pages/HelpCenterPage"));
const CaseStudiesPage = lazy(() => import("../pages/CaseStudiesPage"));
const CaseStudyDetail = lazy(() => import("../pages/CaseStudyDetail"));
const PrivacyPolicyPage = lazy(() => import("../pages/PrivacyPolicyPage"));
const AboutPage = lazy(() => import("../pages/AboutUsPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const BlogPage = lazy(() => import("../pages/BlogPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const TermsOfServicePage = lazy(() => import("../pages/TermsOfServicePage"));
const SecurityPage = lazy(() => import("../pages/SecurityPage"));

// Dashboard / brand pages (lazy loaded)
const BrandDashboard = lazy(() => import("../pages/dashboard/BrandDashboard"));
const CampaignHub = lazy(() => import("../pages/campaign/CampaignHub"));
const CreateCampaignPage = lazy(() => import("../pages/campaign/CreateCampaignPage"));
const Influencers = lazy(() => import("../pages/brand/Influencers"));
const MyRequests = lazy(() => import("../pages/brand/MyRequests"));
const InfluencerProfile = lazy(
  () => import("../pages/brand/InfluencerProfile"),
);
const MyProfileView = lazy(() => import("../pages/brand/MyProfileView"));
const NotificationsPage = lazy(
  () => import("../pages/notifications/NotificationsPage"),
);
const CollaborationsPage = lazy(
  () => import("../pages/collaboration/CollaborationsPage"),
);
const CollabDetailView = lazy(
  () => import("../pages/collaboration/CollabDetailView"),
);
const CollabOverviewTab = lazy(
  () => import("../pages/collaboration/CollabOverviewTab"),
);
const CollabTasksTab = lazy(
  () => import("../pages/collaboration/CollabTasksTab"),
);
const DeliverableListTab = lazy(
  () => import("../pages/collaboration/DeliverableListTab"),
);
const DeliverableBoard = lazy(
  () => import("../pages/collaboration/DeliverableBoard"),
);

// Profile settings (lazy loaded)
const ProfileSettings = lazy(() => import("../pages/profile/ProfilesSetting"));
const PaymentsDashboard = lazy(
  () => import("../pages/payments/PaymentsDashboard"),
);

// Messages (lazy loaded)
const MessagesPage = lazy(() => import("../pages/MessagesPage"));

// Influencer-specific pages (lazy loaded)
const InfluencerDashboard = lazy(
  () => import("../pages/dashboard/InfluencerDashboard"),
);
const MyProfileViewInfluencer = lazy(
  () => import("../pages/influencer/MyProfileView"),
);
const SearchExplore = lazy(
  () => import("../components/layout/influencer/SearchExplore"),
);
const CampaignDetail = lazy(
  () => import("../components/layout/influencer/CampaignDetail"),
);
const BrandPublicProfile = lazy(
  () => import("../components/layout/influencer/BrandPublicProfile"),
);
const InfluencerRequests = lazy(
  () => import("../pages/influencer/InfluencerRequests"),
);

export default function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* ── Public & Auth (redirect to dashboard if already logged in) ───── */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
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
            <Route
              path="/features/secure-payments"
              element={<SecurePaymentsPage />}
            />
            <Route path="/real-time-chat" element={<RealTimeChatPage />} />
            <Route path="/integrations" element={<IntegrationsPage />} />
            <Route path="/solutions/for-brands" element={<ForBrandsPage />} />
            <Route path="/solutions/for-creators" element={<ForCreatorsPage />} />
            <Route path="/solutions/agencies" element={<AgenciesPage />} />
            <Route path="/solutions/enterprise" element={<EnterprisePage />} />
            <Route path="/help-center" element={<HelpCenterPage />} />
            <Route path="/case-studies" element={<CaseStudiesPage />} />
            <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/security" element={<SecurityPage />} />

            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* OAuth Callback — must be public, no auth required */}
          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
          <Route path="/oauth/google/callback" element={<GoogleLoginCallback />} />

          {/* Register — outside PublicRoute so Step 2 onboarding works after auto-login */}
          <Route path="/register" element={<Register />} />

          {/* ── Brand routes ──────────────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={["brand"]} />}>
            <Route element={<DashboardLayout />}>
              <Route
                element={
                  <ProtectedRoute allowedRoles={["brand"]} requireComplete />
                }
              >
                <Route path="/brand/dashboard" element={<BrandDashboard />} />
                <Route path="/brand/influencer" element={<Influencers />} />
                <Route
                  path="/brand/search"
                  element={<Navigate to="/brand/influencer" replace />}
                />
                <Route
                  path="/brand/requests"
                  element={<Navigate to="/brand/requests/received" replace />}
                />
                <Route path="/brand/requests/:type" element={<MyRequests />}>
                  <Route path=":status" element={<MyRequests />} />
                </Route>

                <Route
                  path="/brand/collaborations"
                  element={<Navigate to="/brand/collaborations/all" replace />}
                />
                <Route
                  path="/brand/collaborations/:tab"
                  element={<CollaborationsPage />}
                />

                <Route
                  path="/brand/collaboration/:id"
                  element={<CollabDetailView />}
                >
                  <Route index element={<Navigate to="overview" replace />} />
                  <Route path="overview" element={<CollabOverviewTab />} />
                  <Route path="tasks" element={<CollabTasksTab />}>
                    <Route index element={<Navigate to="list" replace />} />
                    <Route path="list" element={<DeliverableListTab />} />
                    <Route path="board" element={<DeliverableBoard />} />
                  </Route>
                </Route>
                <Route path="/brand/campaigns" element={<CampaignHub />} />
                <Route path="/brand/campaigns/new" element={<CreateCampaignPage />} />
                <Route path="/brand/campaigns/:id/edit" element={<CreateCampaignPage />} />
                <Route
                  path="/brand/influencer/:influencerId"
                  element={<InfluencerProfile />}
                />
              </Route>
              {/* Always accessible for brands */}
              <Route path="/brand/profile" element={<MyProfileView />} />
              <Route path="/brand/settings" element={<ProfileSettings />} />
              <Route path="/brand/payments" element={<PaymentsDashboard />} />
            </Route>
          </Route>

          {/* ── Influencer routes ─────────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={["influencer"]} />}>
            <Route element={<DashboardLayout />}>
              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={["influencer"]}
                    requireComplete
                  />
                }
              >
                <Route
                  path="/influencer/dashboard"
                  element={<InfluencerDashboard />}
                />

                <Route
                  path="/influencer/requests"
                  element={
                    <Navigate to="/influencer/requests/received" replace />
                  }
                />
                <Route
                  path="/influencer/requests/:type"
                  element={<InfluencerRequests />}
                >
                  <Route path=":status" element={<InfluencerRequests />} />
                </Route>

                <Route
                  path="/influencer/collaborations"
                  element={
                    <Navigate to="/influencer/collaborations/all" replace />
                  }
                />
                <Route
                  path="/influencer/collaborations/:tab"
                  element={<CollaborationsPage />}
                />

                <Route
                  path="/influencer/collaboration/:id"
                  element={<CollabDetailView />}
                >
                  <Route index element={<Navigate to="overview" replace />} />
                  <Route path="overview" element={<CollabOverviewTab />} />
                  <Route path="tasks" element={<CollabTasksTab />}>
                    <Route index element={<Navigate to="list" replace />} />
                    <Route path="list" element={<DeliverableListTab />} />
                    <Route path="board" element={<DeliverableBoard />} />
                  </Route>
                </Route>
                <Route
                  path="/influencer/search"
                  element={
                    <Navigate to="/influencer/search/campaigns" replace />
                  }
                />
                <Route
                  path="/influencer/search/:tab"
                  element={<SearchExplore />}
                />
                <Route
                  path="/influencer/search/campaign/:campaignId"
                  element={<CampaignDetail />}
                />
                <Route
                  path="/influencer/search/brand/:brandId"
                  element={<BrandPublicProfile />}
                />
              </Route>

              {/* Always accessible for influencers */}
              <Route
                path="/influencer/profile"
                element={<MyProfileViewInfluencer />}
              />
              <Route
                path="/influencer/settings"
                element={<ProfileSettings />}
              />
              <Route
                path="/influencer/payments"
                element={<PaymentsDashboard />}
              />
            </Route>
          </Route>

          {/* ── Admin routes ───────────────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin/dashboard" element={<BrandDashboard />} />
              <Route path="/admin/campaigns" element={<CampaignHub />} />
              <Route path="/admin/settings" element={<ProfileSettings />} />
            </Route>
          </Route>

          {/* ===== Common Protected Routes ===== */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["brand", "influencer", "admin"]} />
            }
          >
            <Route element={<DashboardLayout />}>
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/messages" element={<MessagesPage />} />
            </Route>
          </Route>

          {/* ===== Catch-all: unknown routes ===== */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
