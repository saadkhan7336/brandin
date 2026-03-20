import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../components/layout/LandingNavbar";
import {
  Shield,
  Search,
  Target,
  TrendingUp,
  Award,
  Users,
  CheckCircle,
  Zap,
  ArrowRight,
  BarChart3,
  MessageSquare,
  Lock,
  Globe,
  Bell,
  Calendar,
  FileText,
  Briefcase,
  Sparkles,
  Rocket,
  Eye,
  Settings,
} from "lucide-react";
import InfluBtn from "../components/common/InfluBtn";

export default function FeaturesPage() {
  const navigate = useNavigate();

  const mainFeatures = [
    {
      icon: Search,
      title: "Find Perfect Matches",
      description:
        "Advanced search filters to discover influencers that align with your brand values and target audience. Filter by niche, location, audience size, engagement rate, and more.",
      color: "bg-[#3b82f6]",
      gradient: "from-[#3b82f6] to-[#2563eb]",
      route: "/features/find-matches",
    },
    {
      icon: Target,
      title: "Campaign Management",
      description:
        "Streamlined tools to create, manage, and track your influencer campaigns all in one place. From planning to execution, handle everything seamlessly.",
      color: "bg-[#10b981]",
      gradient: "from-[#10b981] to-[#059669]",
      route: "/features/campaign-management",
    },
    {
      icon: TrendingUp,
      title: "Real-time Analytics",
      description:
        "Monitor campaign performance with comprehensive analytics and detailed reporting dashboards. Track ROI, engagement, reach, and conversion metrics.",
      color: "bg-[#f59e0b]",
      gradient: "from-[#f59e0b] to-[#d97706]",
      route: "/features/analytics",
    },
    {
      icon: Award,
      title: "Verified Profiles",
      description:
        "Work with confidence knowing all influencers are verified and authenticated by our team. Badges indicate verification status and credibility.",
      color: "bg-[#8b5cf6]",
      gradient: "from-[#8b5cf6] to-[#7c3aed]",
      route: "/features/verified-profiles",
    },
  ];

  const additionalFeatures = [
    {
      icon: MessageSquare,
      title: "Collaboration Requests",
      description:
        "Send, receive, and manage collaboration requests with detailed proposal templates and automated workflows.",
    },
    {
      icon: Briefcase,
      title: "Portfolio Management",
      description:
        "Showcase your work with customizable portfolios. Display past campaigns, media kits, and success stories.",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Stay updated with real-time notifications for new requests, campaign updates, and important milestones.",
    },
    {
      icon: Calendar,
      title: "Campaign Scheduling",
      description:
        "Plan and schedule your campaigns in advance with integrated calendar tools and timeline management.",
    },
    {
      icon: FileText,
      title: "Contract Templates",
      description:
        "Access professional contract templates and automated agreements to streamline your collaboration process.",
    },
    {
      icon: BarChart3,
      title: "Performance Reports",
      description:
        "Generate detailed performance reports with exportable data and visual insights for stakeholders.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Invite team members, assign roles, and collaborate efficiently with built-in permission management.",
    },
    {
      icon: Lock,
      title: "Secure Payments",
      description:
        "Handle payments securely with escrow protection, milestone-based releases, and transaction tracking.",
    },
    {
      icon: Globe,
      title: "Multi-Platform Support",
      description:
        "Connect multiple social media accounts and manage cross-platform campaigns from one dashboard.",
    },
    {
      icon: Eye,
      title: "Audience Demographics",
      description:
        "Access detailed audience insights including age, gender, location, interests, and behavior patterns.",
    },
    {
      icon: Settings,
      title: "Custom Workflows",
      description:
        "Create custom approval workflows, automated responses, and personalized campaign management processes.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Matching",
      description:
        "Leverage AI algorithms to get personalized influencer recommendations based on your brand profile.",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Save Time",
      description:
        "Reduce campaign setup time by 80% with automated workflows and smart tools.",
    },
    {
      icon: TrendingUp,
      title: "Boost ROI",
      description:
        "Increase campaign ROI by 3x with data-driven insights and perfect matches.",
    },
    {
      icon: CheckCircle,
      title: "Verified Quality",
      description:
        "Work with verified influencers and brands for authentic, safe collaborations.",
    },
    {
      icon: Rocket,
      title: "Scale Faster",
      description:
        "Manage multiple campaigns simultaneously and grow your influence network.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "50K+", label: "Campaigns Launched" },
    { value: "98%", label: "Success Rate" },
    { value: "24/7", label: "Support Available" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      {/* Hero seciton */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 bg-gradient-to-br from-[#eff6ff] via-white to-[#f0fdf4]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className=" inline-flex item-center gap-2 bg-[#dbeafe] text-[#3b82f6] px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6  ">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              All-in-One Collaboration Platform
            </div>
            <h1 className="text-3xl sm:text-4xl md:txt-5xl font-bold text-[#111827] mb-4 sm:mb-6 px-4">
              Powerful Features for <br className="hidden sm:block" />
              Modern Collborations
            </h1>
            <p className="text-base  sm:text-lg md:text-xl text-[#6b7280] max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              Everything you need to discover, connect, and collaborate with the
              perfect partners. From advanced search to real-time analytics,
              we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center px-4 ">
              <InfluBtn
                variant="primary"
                size="lg"
                onClick={() => navigate("/register")}
              >
                Get Started for Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </InfluBtn>
              <InfluBtn
                variant="outline"
                size="lg"
                onClick={() => navigate("/contact")}
                className="w-full sm:w-auto"
              >
                Contact Sales
              </InfluBtn>
            </div>
          </div>
          {/* Stats*/}
          <div className="grid grid-cols-2 lg:grid-cols-4  sm:gap-8 max-w-5xl mx-auto px-4 ">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl sm:rounded-2xlp-4 sm:p-6 text-center shadow-lg border border-[#e5e7eb] "
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3b82f6] mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-[#6b7280]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] mb-3 sm:mb-4">
              Core Platform Features
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[#6b7280] max-w-2xl mx-auto">
              The essential tools that make Brandly the leading influencer
              collaboration platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {mainFeatures.map((feature, index) => (
              <div
                key={index}
                onClick={() => navigate(feature.route)}
                className="group p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 border-[#e5e7eb] bg-white hover:border-transparent hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
                />
                <div className="relative">
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-[#111827] mb-2 sm:mb-3 group-hover:text-[#3b82f6] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#6b7280] mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-[#3b82f6] font-medium text-sm sm:text-base group-hover:gap-2 transition-all">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] mb-3 sm:mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[#6b7280] max-w-2xl mx-auto">
              Packed with powerful features designed for both brands and
              influencers
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {additionalFeatures.map((feature, index) => (
              <div
                key={index}
                className="p-5 sm:p-6 rounded-xl bg-white border border-[#e5e7eb] hover:shadow-lg transition-all group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#eff6ff] rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-[#3b82f6] transition-colors">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#3b82f6] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-[#111827] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-[#6b7280] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] mb-3 sm:mb-4">
              Why Choose Brandly?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[#6b7280] max-w-2xl mx-auto">
              Join thousands of brands and influencers who trust Brandly for
              their collaborations
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#eff6ff] to-white border border-[#e5e7eb] hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#3b82f6] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <benefit.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#111827] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm sm:text-base text-[#6b7280]">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] mb-3 sm:mb-4">
              Built for Everyone
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[#6b7280] max-w-2xl mx-auto">
              Specialized features for brands, influencers, and teams
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* For Brands */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-[#e5e7eb] hover:border-[#3b82f6] transition-all">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#111827] mb-3 sm:mb-4">
                For Brands
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-[#6b7280]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>Advanced influencer discovery</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>Campaign performance tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>Budget management tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>ROI analytics dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>Team collaboration workspace</span>
                </li>
              </ul>
              <InfluBtn
                variant="primary"
                className="w-full mt-6"
                onClick={() => navigate("/register")}
              >
                Start as a Brand
              </InfluBtn>
            </div>

            {/* For Influencers */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-[#e5e7eb] hover:border-[#8b5cf6] transition-all">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Award className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#111827] mb-3 sm:mb-4">
                For Influencers
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-[#6b7280]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>Browse collaboration opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>Customizable portfolio showcase</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>Verified profile badges</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>Analytics for your audience</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>Secure payment processing</span>
                </li>
              </ul>
              <InfluBtn
                variant="primary"
                className="w-full mt-6"
                onClick={() => navigate("/register")}
              >
                Start as an Influencer
              </InfluBtn>
            </div>

            {/* For Teams */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-[#e5e7eb] hover:border-[#10b981] transition-all">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#111827] mb-3 sm:mb-4">
                For Teams
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-[#6b7280]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>Multi-user account access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>Role-based permissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>Shared campaign workspace</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>Centralized reporting</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>Priority support access</span>
                </li>
              </ul>
              <InfluBtn
                variant="primary"
                className="w-full mt-6"
                onClick={() => navigate("/contact")}
              >
                Contact Sales
              </InfluBtn>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Transform Your Collaborations?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8">
            Join thousands of successful brands and influencers on Brandly
            today. Start your journey with a free account.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <InfluBtn
              variant="outline"
              size="lg"
              onClick={() => navigate("/register")}
              className="bg-white text-[#3b82f6] hover:bg-[#f9fafb] border-white w-full sm:w-auto"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </InfluBtn>
            <InfluBtn
              variant="outline"
              size="lg"
              onClick={() => navigate("/contact")}
              className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
            >
              Schedule a Demo
            </InfluBtn>
          </div>
        </div>
      </section>

       {/* Footer */}
      <footer className="bg-[#111827] text-white py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#3b82f6]" />
                <span className="text-base sm:text-lg font-bold">Brandly</span>
              </div>
              <p className="text-sm sm:text-base text-[#9ca3af]">
                Connecting brands with influencers for authentic collaborations.
              </p>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Product</h3>
              <ul className="space-y-2 text-sm sm:text-base text-[#9ca3af]">
                <li><button onClick={() => navigate('/features')} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => navigate('/case-studies')} className="hover:text-white transition-colors">Case Studies</button></li>
                <li><button onClick={() => navigate('/blog')} className="hover:text-white transition-colors">Blog</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Company</h3>
              <ul className="space-y-2 text-sm sm:text-base text-[#9ca3af]">
                <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors">About Us</button></li>
                <li><button onClick={() => navigate('/blog')} className="hover:text-white transition-colors">Blog</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Support</h3>
              <ul className="space-y-2 text-sm sm:text-base text-[#9ca3af]">
                <li><button onClick={() => navigate('/help-center')} className="hover:text-white transition-colors">Help Center</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contact Us</button></li>
                <li><button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#374151] pt-6 sm:pt-8 text-center text-xs sm:text-sm text-[#9ca3af]">
            <p>&copy; 2026 Brandly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
