import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import { getDashboardByRole } from "../../routes/ProtectedRoute";

function LandingNavbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dashboardPath = user ? getDashboardByRole(user.role) : "/login";

  const navLinks = [
    { label: "Home", route: "/" },
    { label: "Features", route: "/features" },
    { label: "Solutions", route: "/solutions" },
    { label: "Case Studies", route: "/case-studies" },
    { label: "About", route: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span className="text-2xl font-bold text-[#3b82f6]">Brandly</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => navigate(link.route)}
                className="text-[#6b7280] hover:text-[#111827] text-sm font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={() => navigate(dashboardPath)}
                className="bg-[#3b82f6] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2563eb] transition-colors"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-[#6b7280] hover:text-[#111827] text-sm font-medium transition-colors px-4 py-2"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-[#3b82f6] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2563eb] transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-[#6b7280] hover:text-[#111827]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#e5e7eb] shadow-lg absolute w-full left-0 top-full pb-4">
          <div className="flex flex-col px-6 pt-4 pb-2 space-y-4">
            {navLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => {
                  navigate(link.route);
                  setMobileMenuOpen(false);
                }}
                className="text-left text-[#6b7280] hover:text-[#111827] font-medium py-2 transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4 border-t border-[#e5e7eb] flex flex-col gap-3">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    navigate(dashboardPath);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-[#3b82f6] text-white px-5 py-3 rounded-lg font-semibold text-center hover:bg-[#2563eb] transition-colors"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate('/login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full border border-[#e5e7eb] text-[#111827] px-5 py-3 rounded-lg font-semibold text-center hover:bg-[#f9fafb] transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate('/register');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-[#3b82f6] text-white px-5 py-3 rounded-lg font-semibold text-center hover:bg-[#2563eb] transition-colors"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default LandingNavbar;
