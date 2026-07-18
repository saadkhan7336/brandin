import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../../components/layout/LandingNavbar";
import LandingFooter from "../../components/layout/LandingFooter";
import {
  Star,
  ShieldCheck,
  MousePointerClick,
  Briefcase,
  TrendingUp
} from "lucide-react";

export default function ForCreatorsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans selection:bg-blue-100">
      <LandingNavbar />

      <main className="pt-24 sm:pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 text-xs font-bold rounded-full mb-8 tracking-wide uppercase">
            <Star className="w-4 h-4" />
            Solutions for Creators
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-[#0f172a] tracking-tight leading-[1.1] mb-6">
            Turn Your Influence <br />
            <span className="text-purple-600">
              Into a Business
            </span>
          </h1>

          <p className="text-[#64748b] text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Get verified, get matched with top-tier brands, and never chase an invoice again. Brandly provides the professional tools you need to grow your creator career.
          </p>

          <button 
            onClick={() => navigate('/register')}
            className="bg-purple-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-purple-700 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <MousePointerClick className="w-5 h-5" />
            Apply as a Creator
          </button>
        </div>

        {/* DETAILED FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 max-w-5xl mx-auto">
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col items-start">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#0f172a] mb-4">Guaranteed Payments</h3>
            <p className="text-gray-500 leading-relaxed mb-6">
              Say goodbye to Net-60 terms and chasing down unpaid invoices. Brands fund campaigns upfront into secure escrow, guaranteeing your payment the moment deliverables are approved.
            </p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col items-start">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
              <Star className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#0f172a] mb-4">Verified Profile Badge</h3>
            <p className="text-gray-500 leading-relaxed mb-6">
              Our manual verification process ensures that only legitimate, high-quality creators make it onto the platform. Earning your badge means brands know you're a professional.
            </p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col items-start">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#0f172a] mb-4">Professional Workflow</h3>
            <p className="text-gray-500 leading-relaxed mb-6">
              Manage all your brand deals in one organized dashboard. Track deadlines, review campaign briefs, and upload your content drafts directly to the platform.
            </p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col items-start">
            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#0f172a] mb-4">Smart Brand Matching</h3>
            <p className="text-gray-500 leading-relaxed mb-6">
              Let the opportunities come to you. Our AI matching engine actively pairs your profile with incoming brand campaigns that fit your niche, style, and audience demographics.
            </p>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
