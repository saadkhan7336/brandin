import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../components/layout/LandingNavbar";
import LandingFooter from "../components/layout/LandingFooter";
import {
  Building2,
  Star,
  Layers,
  Globe,
  ArrowRight,
  ShieldCheck,
  Search,
  MessageSquare,
  BarChart3,
  CreditCard,
  CheckCircle,
  Clock
} from "lucide-react";

export default function SolutionsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fcfcfd] font-sans selection:bg-blue-100">
      <LandingNavbar />

      <main className="pt-24 sm:pt-32 pb-20 px-6 max-w-7xl mx-auto">

        {/* ── HERO ─────────────────────────────────── */}
        <div className="flex flex-col items-center text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-8 tracking-wide uppercase">
            <Layers className="w-4 h-4" />
            Who We Serve
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-[#0f172a] tracking-tight leading-[1.1] mb-6">
            One Platform. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Every Use Case.
            </span>
          </h1>

          <p className="text-[#64748b] text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you're a growing brand, an independent creator, a marketing agency, or a global enterprise — Brandly has a tailored solution designed for your workflow.
          </p>
        </div>

        {/* ── MAIN SOLUTION CARDS ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">

          {/* FOR BRANDS */}
          <div
            onClick={() => navigate('/solutions/for-brands')}
            className="group cursor-pointer bg-white p-10 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgb(59,130,246,0.1)] hover:border-blue-200 transition-all duration-300 flex flex-col"
          >
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-7 group-hover:scale-105 transition-transform duration-300">
              <Building2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-[#0f172a] mb-3">For Brands</h2>
            <p className="text-gray-500 leading-relaxed mb-8 flex-1">
              Stop guessing. Find verified creators who genuinely align with your brand identity. Manage campaigns, secure payments, and measure real ROI — all in one place.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                AI-powered creator discovery & matching
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                Secure escrow payments via Stripe
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                Real-time campaign analytics dashboard
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                Centralized campaign management hub
              </div>
            </div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm group-hover:gap-4 transition-all duration-300">
              Explore Brand Solutions <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* FOR CREATORS */}
          <div
            onClick={() => navigate('/solutions/for-creators')}
            className="group cursor-pointer bg-white p-10 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgb(168,85,247,0.1)] hover:border-purple-200 transition-all duration-300 flex flex-col"
          >
            <div className="w-16 h-16 bg-purple-600 text-white rounded-2xl flex items-center justify-center mb-7 group-hover:scale-105 transition-transform duration-300">
              <Star className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-[#0f172a] mb-3">For Creators</h2>
            <p className="text-gray-500 leading-relaxed mb-8 flex-1">
              Get matched with brands that fit your niche. Work professionally with clear briefs, secure contracts, and guaranteed payments. Focus on content — we handle the business side.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                Get matched to relevant brand campaigns
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                Guaranteed payment — brands pay upfront into escrow
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                Verified profile badge to stand out
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                Manage all collaborations in one dashboard
              </div>
            </div>
            <div className="flex items-center gap-2 text-purple-600 font-bold text-sm group-hover:gap-4 transition-all duration-300">
              Explore Creator Solutions <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* AGENCIES */}
          <div
            onClick={() => navigate('/solutions/agencies')}
            className="group cursor-pointer bg-white p-10 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgb(245,158,11,0.1)] hover:border-amber-200 transition-all duration-300 flex flex-col"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl flex items-center justify-center mb-7 group-hover:scale-105 transition-transform duration-300 relative">
              <Layers className="w-8 h-8" />
              <div className="absolute -top-2 -right-2 bg-amber-100 text-amber-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">Soon</div>
            </div>
            <h2 className="text-2xl font-black text-[#0f172a] mb-3">For Agencies</h2>
            <p className="text-gray-500 leading-relaxed mb-8 flex-1">
              Run influencer marketing at scale for multiple clients. Multi-brand workspaces, team collaboration, and consolidated reporting are coming to give agencies an unfair advantage.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>Multi-client brand workspaces <span className="text-amber-500 font-semibold">(Coming Soon)</span></span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>Team roles & permissions <span className="text-amber-500 font-semibold">(Coming Soon)</span></span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>White-labeled client reporting <span className="text-amber-500 font-semibold">(Coming Soon)</span></span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm group-hover:gap-4 transition-all duration-300">
              View Agency Vision <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* ENTERPRISE */}
          <div
            onClick={() => navigate('/solutions/enterprise')}
            className="group cursor-pointer bg-[#0f172a] p-10 rounded-3xl border border-slate-800 shadow-[0_4px_20px_rgb(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.2)] transition-all duration-300 flex flex-col"
          >
            <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-7 group-hover:scale-105 transition-transform duration-300 relative">
              <Globe className="w-8 h-8 text-slate-300" />
              <div className="absolute -top-2 -right-2 bg-slate-700 text-slate-200 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">Vision</div>
            </div>
            <h2 className="text-2xl font-black text-white mb-3">Enterprise</h2>
            <p className="text-slate-400 leading-relaxed mb-8 flex-1">
              For global organizations that need custom integrations, dedicated account management, advanced compliance controls, and infrastructure built for massive scale.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Clock className="w-5 h-5 text-slate-500 flex-shrink-0" />
                <span>Custom API & ERP integrations <span className="text-slate-300 font-semibold">(Planned)</span></span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Clock className="w-5 h-5 text-slate-500 flex-shrink-0" />
                <span>SSO & advanced security <span className="text-slate-300 font-semibold">(Planned)</span></span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Clock className="w-5 h-5 text-slate-500 flex-shrink-0" />
                <span>Dedicated account manager <span className="text-slate-300 font-semibold">(Planned)</span></span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-300 font-bold text-sm group-hover:gap-4 transition-all duration-300">
              Explore Enterprise Vision <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* ── COMPARISON / QUICK OVERVIEW ─────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-10 mb-20">
          <h2 className="text-2xl font-black text-[#0f172a] mb-2 text-center">What's Available Today</h2>
          <p className="text-gray-400 text-center mb-10 text-sm">Features currently live on the platform for brands and creators.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-4 pr-8 text-gray-500 font-semibold w-1/3">Feature</th>
                  <th className="text-center py-4 px-6 text-blue-600 font-bold">Brands</th>
                  <th className="text-center py-4 px-6 text-purple-600 font-bold">Creators</th>
                  <th className="text-center py-4 px-6 text-amber-500 font-bold">Agencies</th>
                  <th className="text-center py-4 px-6 text-slate-600 font-bold">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { feature: "AI-powered creator/brand matching", brand: true, creator: true, agency: false, enterprise: false },
                  { feature: "Verified profile badge", brand: true, creator: true, agency: false, enterprise: false },
                  { feature: "Secure escrow payments (Stripe)", brand: true, creator: true, agency: false, enterprise: false },
                  { feature: "In-platform messaging", brand: true, creator: true, agency: false, enterprise: false },
                  { feature: "Campaign & collaboration dashboard", brand: true, creator: true, agency: false, enterprise: false },
                  { feature: "Analytics & reporting", brand: true, creator: false, agency: false, enterprise: false },
                  { feature: "Multi-brand workspaces", brand: false, creator: false, agency: "Soon", enterprise: "Planned" },
                  { feature: "Team roles & permissions", brand: false, creator: false, agency: "Soon", enterprise: "Planned" },
                  { feature: "Custom API integrations", brand: false, creator: false, agency: false, enterprise: "Planned" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 pr-8 text-gray-700 font-medium">{row.feature}</td>
                    {[row.brand, row.creator, row.agency, row.enterprise].map((val, j) => (
                      <td key={j} className="text-center py-4 px-6">
                        {val === true && <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full"><CheckCircle className="w-4 h-4 text-green-600" /></span>}
                        {val === false && <span className="text-gray-200 text-lg">—</span>}
                        {val === "Soon" && <span className="text-[10px] font-black bg-amber-100 text-amber-600 px-2 py-1 rounded-full uppercase tracking-wide">Soon</span>}
                        {val === "Planned" && <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase tracking-wide">Planned</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── CTA ─────────────────────────────────── */}
        <div className="text-center">
          <h2 className="text-3xl font-black text-[#0f172a] mb-4">Ready to Get Started?</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Join the platform where creators and brands connect with confidence.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
            >
              Create Free Account
            </button>
            <button
              onClick={() => navigate('/features')}
              className="bg-white text-gray-700 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
            >
              Explore Features
            </button>
          </div>
        </div>

      </main>

      <LandingFooter />
    </div>
  );
}
