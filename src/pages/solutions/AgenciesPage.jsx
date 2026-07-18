import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../../components/layout/LandingNavbar";
import LandingFooter from "../../components/layout/LandingFooter";
import {
  Users,
  FolderKanban,
  FileSpreadsheet,
  Lock,
  Clock,
  ArrowRight
} from "lucide-react";

export default function AgenciesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans selection:bg-blue-100">
      <LandingNavbar />

      <main className="pt-24 sm:pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 text-xs font-bold rounded-full mb-8 tracking-wide uppercase border border-amber-100 shadow-sm">
            <Clock className="w-4 h-4" />
            Coming Soon: Q4 2024
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-[#0f172a] tracking-tight leading-[1.1] mb-6">
            Scale Your <br />
            <span className="text-amber-500">
              Agency Operations
            </span>
          </h1>

          <p className="text-[#64748b] text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            We are building the ultimate workspace for marketing agencies. Manage multiple clients, collaborate with your team, and run hundreds of creator campaigns simultaneously.
          </p>

          <button 
            className="bg-amber-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-amber-600 transition-colors shadow-lg flex items-center justify-center gap-2"
            onClick={() => navigate('/contact')}
          >
            Join the Waitlist
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* DETAILED FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 max-w-5xl mx-auto opacity-90">
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col items-start relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-[120px] text-gray-50 opacity-50 pointer-events-none font-black">1</div>
            <div className="w-14 h-14 bg-gray-50 text-gray-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
              <FolderKanban className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#0f172a] mb-4 relative z-10">Multi-Brand Workspaces</h3>
            <p className="text-gray-500 leading-relaxed mb-6 relative z-10">
              Keep your clients separate but your workflow centralized. Seamlessly switch between brand profiles, budgets, and campaigns without logging out.
            </p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col items-start relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-[120px] text-gray-50 opacity-50 pointer-events-none font-black">2</div>
            <div className="w-14 h-14 bg-gray-50 text-gray-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#0f172a] mb-4 relative z-10">Team Collaboration</h3>
            <p className="text-gray-500 leading-relaxed mb-6 relative z-10">
              Invite your account managers, strategists, and clients to the platform. Set granular role-based permissions to control who can view, edit, or approve content.
            </p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col items-start relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-[120px] text-gray-50 opacity-50 pointer-events-none font-black">3</div>
            <div className="w-14 h-14 bg-gray-50 text-gray-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#0f172a] mb-4 relative z-10">Consolidated Reporting</h3>
            <p className="text-gray-500 leading-relaxed mb-6 relative z-10">
              Generate beautiful, white-labeled ROI reports across multiple campaigns and clients in seconds. Export to PDF or share via a secure client portal link.
            </p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col items-start relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-[120px] text-gray-50 opacity-50 pointer-events-none font-black">4</div>
            <div className="w-14 h-14 bg-gray-50 text-gray-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#0f172a] mb-4 relative z-10">Agency Master Billing</h3>
            <p className="text-gray-500 leading-relaxed mb-6 relative z-10">
              Fund escrow accounts using a centralized agency billing profile. Easily invoice your clients while ensuring creators are paid on time automatically.
            </p>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
