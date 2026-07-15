import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../../components/layout/LandingNavbar";
import LandingFooter from "../../components/layout/LandingFooter";
import {
  Sparkles,
  Target,
  BarChart3,
  MousePointerClick,
  CheckCircle,
  Users
} from "lucide-react";

export default function AIMatchingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans selection:bg-blue-100">
      <LandingNavbar />

      <main className="pt-24 sm:pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 text-xs font-bold rounded-full mb-8 tracking-wide uppercase">
            <Sparkles className="w-4 h-4" />
            Smart Discovery
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-[#0f172a] tracking-tight leading-[1.1] mb-6">
            Find Your Perfect Match <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Powered by AI
            </span>
          </h1>

          <p className="text-[#64748b] text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop guessing and start connecting. Our AI engine analyzes audience demographics, content style, and performance metrics to pair you with creators who drive real results.
          </p>

          <button 
            onClick={() => navigate('/register')}
            className="bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <MousePointerClick className="w-5 h-5" />
            Try AI Matching Free
          </button>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0f172a] mb-3">Audience Alignment</h3>
            <p className="text-gray-500 leading-relaxed">
              We match brands with creators whose audience demographics precisely fit your target customer profile.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0f172a] mb-3">Performance Prediction</h3>
            <p className="text-gray-500 leading-relaxed">
              Our models predict engagement rates and potential ROI based on historical campaign data and trends.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0f172a] mb-3">Niche Targeting</h3>
            <p className="text-gray-500 leading-relaxed">
              From micro-influencers in niche markets to global stars, find the right voice for your specific campaign.
            </p>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
