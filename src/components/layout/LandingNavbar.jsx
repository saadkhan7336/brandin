import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import { getDashboardByRole } from "../../routes/ProtectedRoute";

export default function LandingNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dashboardPath = user ? getDashboardByRole(user.role) : "/login";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", route: "/" },
    { label: "Features", route: "/features" },
    { label: "Solutions", route: "/solutions" },
    { label: "Case Studies", route: "/case-studies" },
    { label: "About", route: "/about" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <nav
        className={`pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[width,margin,padding,background-color] ${
          isScrolled
            ? "mt-3 w-[95%] sm:w-[92%] max-w-5xl px-5 sm:px-8 py-2.5 bg-white/50 backdrop-blur-md border border-white/80 shadow-lg shadow-slate-900/5 rounded-full"
            : "mt-0 w-full max-w-[1440px] px-6 sm:px-8 py-5 bg-transparent border-b border-transparent rounded-none"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className={`flex items-center gap-2 cursor-pointer transition-transform duration-300 ease-out ${
              isScrolled ? "translate-x-2 sm:translate-x-4" : "translate-x-0"
            }`}
            onClick={() => navigate("/")}
          >
            <span className="text-2xl font-bold text-primary">Brandly</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 bg-white/40 p-1 rounded-full border border-white/60 backdrop-blur-md shadow-sm">
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.route;
              return (
                <button
                  key={index}
                  onClick={() => navigate(link.route)}
                  className={`px-4 sm:px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-white text-blue-600 shadow-sm border border-slate-200/80"
                      : "text-slate-700 hover:text-slate-950 hover:bg-white/60"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Desktop Auth / Action Buttons */}
          <div
            className={`hidden lg:flex items-center gap-3 transition-transform duration-300 ease-out ${
              isScrolled ? "-translate-x-2 sm:-translate-x-4" : "translate-x-0"
            }`}
          >
            {isAuthenticated ? (
              <button
                onClick={() => navigate(dashboardPath)}
                className="bg-blue-600 text-white px-5 py-2 rounded-full text-[15px] font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-slate-600 hover:text-slate-900 text-[15px] font-semibold px-3 py-2 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full text-[15px] font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => {
                    navigate(link.route);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-slate-700 hover:text-blue-600 font-semibold py-1.5 text-sm transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      navigate(dashboardPath);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-xl text-xs font-semibold text-center"
                  >
                    Go to Dashboard
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate("/login");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-slate-700 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-center"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => {
                        navigate("/register");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-blue-600 text-white py-2 rounded-xl text-xs font-semibold text-center"
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
    </header>
  );
}
