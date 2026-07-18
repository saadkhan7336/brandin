import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../../components/layout/LandingNavbar";
import LandingFooter from "../../components/layout/LandingFooter";
import {
  Search,
  ShieldCheck,
  BarChart3,
  MousePointerClick,
  MessageSquare,
  Building2
} from "lucide-react";

export default function ForBrandsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans selection:bg-blue-100">
      <LandingNavbar />

      <main className="pt-24 sm:pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-8 tracking-wide uppercase">
            <Building2 className="w-4 h-4" />
            Solutions for Brands
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-[#0f172a] tracking-tight leading-[1.1] mb-6">
            Scale Your Brand with <br />
            <span className="text-blue-600">
              Authentic Creators
            </span>
          </h1>

          <p className="text-[#64748b] text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop relying on manual spreadsheets and DMs. Brandly provides an end-to-end platform to discover verified creators, manage campaigns, and track ROI in real-time.
          </p>

          <button 
            onClick={() => navigate('/register')}
            className="bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <MousePointerClick className="w-5 h-5" />
            Start Hiring Creators
          </button>
        </div>

        {/* DETAILED FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 max-w-5xl mx-auto">
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col items-start">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#0f172a] mb-4">AI-Powered Discovery</h3>
            <p className="text-gray-500 leading-relaxed mb-6">
              Find creators whose audience perfectly matches your target demographic. Our Smart AI Matching analyzes engagement quality and niche relevance so you don't have to guess.
            </p>
            <button onClick={() => navigate('/features/find-matches')} className="text-purple-600 font-bold hover:underline mt-auto">Learn about AI Matching &rarr;</button>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col items-start">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#0f172a] mb-4">Secure Escrow Payments</h3>
            <p className="text-gray-500 leading-relaxed mb-6">
              Funds are held securely via Stripe and only released when you approve the final deliverables. Protect your budget and ensure accountability on every campaign.
            </p>
            <button onClick={() => navigate('/features/secure-payments')} className="text-green-600 font-bold hover:underline mt-auto">View Payment Security &rarr;</button>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col items-start">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#0f172a] mb-4">Centralized Management</h3>
            <p className="text-gray-500 leading-relaxed mb-6">
              Communicate, share briefs, and review drafts directly in your dashboard. Our integrated chat and milestone tracking keeps every collaboration organized.
            </p>
            <button onClick={() => navigate('/features/campaign-management')} className="text-blue-600 font-bold hover:underline mt-auto">Explore Campaign Hub &rarr;</button>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col items-start">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#0f172a] mb-4">Real-time Analytics</h3>
            <p className="text-gray-500 leading-relaxed mb-6">
              Track reach, engagement rates, and ROI across all your active campaigns. Export beautiful reports to share with your team or stakeholders.
            </p>
            <button onClick={() => navigate('/features/analytics')} className="text-indigo-600 font-bold hover:underline mt-auto">See Analytics Tools &rarr;</button>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
