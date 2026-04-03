import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Shield,
  ChevronDown,
  Search,
  Target,
  TrendingUp,
  Award,
  Users,
  Briefcase,
  BookOpen,
  HelpCircle,
  FileText,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import InfluBtn from "../common/InfluBtn";

function LandingNavbar() {
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isAuth = isAuthenticated && user;

  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(null);

  const handleMouseEnter = (menu) => {
    setOpenDropdown(menu);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  const ToggleMobileMenu = (menu) => {
    setMobileDropdownOpen(mobileDropdownOpen === menu ? null : menu);
  };

  const MobileNavigate = (route) => {
    navigate(route);
    setMobileDropdownOpen(null);
    setMobileMenuOpen(false);
  };

  const ForBrandMenu = [
    {
      icon: Search,
      label: "Find Influencer",
      description: "Discover perfect match",
      route: "/features/find-matches",
    },
    {
      icon: Target,
      label: "Campaign Management",
      description: "Manage your campaigns",
      route: "/features/campaign-management",
    },
    {
      icon: TrendingUp,
      label: "Analytics",
      description: "Track performance",
      route: "/features/analytics",
    },
  ];

  const ForInfluencerMenu = [
    {
      icon: Briefcase,
      label: "Find Opportunities",
      description: "Browse brand collaborations",
      route: "/register",
    },
    {
      icon: Award,
      label: "Get Verified",
      description: "Build your credibility",
      route: "/features/verified-profiles",
    },
    {
      icon: Users,
      label: "Grow Your Brand",
      description: "Expand your reach",
      route: "/register",
    },
  ];

  const featuresMenu = [
    {
      icon: Search,
      label: "Find Perfect Matches",
      route: "/features/find-matches",
    },
    {
      icon: Target,
      label: "Campaign Management",
      route: "/features/campaign-management",
    },
    {
      icon: TrendingUp,
      label: "Real-time Analytics",
      route: "/features/analytics",
    },
    {
      icon: Award,
      label: "Verified Profiles",
      route: "/features/verified-profiles",
    },
  ];

  const resourcesMenu = [
    { icon: BookOpen, label: "Blog", route: "/blog" },
    { icon: HelpCircle, label: "Help Center", route: "/help-center" },
    { icon: FileText, label: "Case Studies", route: "/case-studies" },
    { icon: Users, label: "About Us", route: "/about" },
    { icon: Shield, label: "Privacy Policy", route: "/privacy-policy" },
    { icon: HelpCircle, label: "Contact Us", route: "/contact" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-[#e5e7eb] z-50 ">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <Shield className="w-8 h-8 text-[#3b82f6]" />
              <span className="text-xl font-bold text-[#111827]">Brandly</span>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center gap-1">
                <div
                  className="relative"
                  onMouseEnter={() => handleMouseEnter('brands')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="flex items-center gap-1 px-4 py-2 text-[#6b7280] hover:text-[#111827] font-medium transition-colors">
                    For Brands
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'brands' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'brands' && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[#e5e7eb] p-2">
                      {ForBrandMenu.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => navigate(item.route)}
                          className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-[#f9fafb] transition-colors text-left"
                        >
                          <div className="w-10 h-10 bg-[#eff6ff] rounded-lg flex items-center justify-center flex-shrink-0">
                            <item.icon className="w-5 h-5 text-[#3b82f6]" />
                          </div>
                          <div>
                            <div className="font-semibold text-[#111827] mb-1">{item.label}</div>
                            <div className="text-sm text-[#6b7280]">{item.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  className="relative"
                  onMouseEnter={() => handleMouseEnter('influencers')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="flex items-center gap-1 px-4 py-2 text-[#6b7280] hover:text-[#111827] font-medium transition-colors">
                    For Influencers
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'influencers' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'influencers' && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[#e5e7eb] p-2">
                      {ForInfluencerMenu.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => navigate(item.route)}
                          className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-[#f9fafb] transition-colors text-left"
                        >
                          <div className="w-10 h-10 bg-[#eff6ff] rounded-lg flex items-center justify-center flex-shrink-0">
                            <item.icon className="w-5 h-5 text-[#3b82f6]" />
                          </div>
                          <div>
                            <div className="font-semibold text-[#111827] mb-1">{item.label}</div>
                            <div className="text-sm text-[#6b7280]">{item.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  className="relative"
                  onMouseEnter={() => handleMouseEnter('features')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="flex items-center gap-1 px-4 py-2 text-[#6b7280] hover:text-[#111827] font-medium transition-colors">
                    Features
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'features' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'features' && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-[#e5e7eb] p-2">
                      {featuresMenu.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => navigate(item.route)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#f9fafb] transition-colors text-left"
                        >
                          <item.icon className="w-5 h-5 text-[#3b82f6]" />
                          <span className="font-medium text-[#111827]">{item.label}</span>
                        </button>
                      ))}
                      <div className="border-t border-[#e5e7eb] my-2" />
                      <button
                        onClick={() => navigate('/features')}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg hover:bg-[#eff6ff] transition-colors text-[#3b82f6] font-semibold"
                      >
                        <span>View All Features</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div
                  className="relative"
                  onMouseEnter={() => handleMouseEnter('resources')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="flex items-center gap-1 px-4 py-2 text-[#6b7280] hover:text-[#111827] font-medium transition-colors">
                    Resources
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'resources' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'resources' && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#e5e7eb] p-2">
                      {resourcesMenu.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => navigate(item.route)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#f9fafb] transition-colors text-left"
                        >
                          <item.icon className="w-5 h-5 text-[#6b7280]" />
                          <span className="font-medium text-[#111827]">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <InfluBtn variant="primary" onClick={() => navigate('/dashboard')}>
                    Go to Dashboard
                  </InfluBtn>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/login')}
                      className="text-[#6b7280] hover:text-[#111827] font-medium transition-colors"
                    >
                      Log in
                    </button>
                    <InfluBtn variant="primary" onClick={() => navigate('/register')}>
                      Join now
                    </InfluBtn>
                  </>
                )}
              </div>
            </div>
            </div>
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-[#6b7280] hover:text-[#111827]"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
        </div>
      </nav>
    </>
  );
}

export default LandingNavbar;
