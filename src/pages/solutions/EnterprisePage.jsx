import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../../components/layout/LandingNavbar";
import LandingFooter from "../../components/layout/LandingFooter";
import {
  Globe,
  Code2,
  ShieldAlert,
  HeadphonesIcon,
  Clock,
  ArrowRight
} from "lucide-react";

export default function EnterprisePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans selection:bg-blue-100">
      <LandingNavbar />

      <main className="pt-24 sm:pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-full mb-8 tracking-wide uppercase border border-slate-200 shadow-sm">
            <Clock className="w-4 h-4" />
            Future Vision
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-[#0f172a] tracking-tight leading-[1.1] mb-6">
            Enterprise-Grade <br />
            <span className="text-slate-800">
              Creator Infrastructure
            </span>
          </h1>

          <p className="text-[#64748b] text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            For large organizations requiring custom integrations, advanced security compliance, and dedicated strategic support. We are designing the enterprise tier for global scale.
          </p>

          <button 
            className="bg-slate-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            Contact Global Sales
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* DETAILED FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 max-w-5xl mx-auto opacity-90">
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex gap-6 items-start">
            <div className="w-14 h-14 bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Code2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-2">Custom API & Integrations</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Connect our creator network directly to your internal ERP, CRM, or marketing automation platforms. Build headless solutions using our GraphQL API architecture.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex gap-6 items-start">
            <div className="w-14 h-14 bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-2">Advanced Security & SSO</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Enterprise-grade data protection, SOC2 compliance roadmapping, and Single Sign-On (SAML/OAuth) to seamlessly manage internal employee access at scale.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex gap-6 items-start">
            <div className="w-14 h-14 bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center flex-shrink-0">
              <HeadphonesIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-2">Dedicated Account Manager</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Skip the standard support queue. Get a dedicated customer success manager to assist with onboarding, strategic campaign planning, and priority issue resolution.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex gap-6 items-start">
            <div className="w-14 h-14 bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Globe className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-2">Global Tax & Compliance</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Automated 1099 generation, cross-border payment handling, and comprehensive legal frameworks built in to ensure your campaigns are globally compliant.
              </p>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
