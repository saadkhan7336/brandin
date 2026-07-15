import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../../components/layout/LandingNavbar";
import LandingFooter from "../../components/layout/LandingFooter";
import {
  Link,
  CreditCard,
  LineChart,
  MousePointerClick,
  ShieldCheck,
  RefreshCw
} from "lucide-react";

export default function IntegrationsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans selection:bg-blue-100">
      <LandingNavbar />

      <main className="pt-24 sm:pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full mb-8 tracking-wide uppercase">
            <Link className="w-4 h-4" />
            Connected Workflow
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-[#0f172a] tracking-tight leading-[1.1] mb-6">
            Works With Your <br />
            <span className="text-indigo-600">
              Existing Tools
            </span>
          </h1>

          <p className="text-[#64748b] text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Brandly integrates with the tools you already rely on to ensure payments, analytics, and communications flow seamlessly across your entire stack.
          </p>

          <button 
            onClick={() => navigate('/register')}
            className="bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <MousePointerClick className="w-5 h-5" />
            Get Started Free
          </button>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex gap-6 items-start">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-2">Secure Payments by Stripe</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Our deep integration with Stripe enables secure escrow payments, instant payouts to creators, and seamless invoicing for brands.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex gap-6 items-start">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <LineChart className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-2">Social Analytics API</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                We connect directly with major social platforms to pull real-time engagement data, ensuring your campaign metrics are always accurate.
              </p>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
