import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../../components/layout/LandingNavbar";
import LandingFooter from "../../components/layout/LandingFooter";
import {
  Shield,
  CheckCircle,
  BarChart3,
  UserCheck,
  Eye,
  ArrowRight,
  ShieldCheck,
  Lock,
  BadgeCheck,
  Activity
} from "lucide-react";

export default function VerifiedProfilesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans selection:bg-blue-100">
      <LandingNavbar />

      <main className="pt-24 lg:pt-32 pb-12 px-6 max-w-7xl mx-auto">
        
        {/* HERO SECTION */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 mb-24">
          <div className="flex-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-6">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase">Trust Redefined</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-[#0f172a] leading-[1.05] tracking-tight mb-6">
              The Gold Standard of <span className="text-blue-600">Authenticity.</span>
            </h1>
            <p className="text-lg text-[#64748b] leading-relaxed mb-8 max-w-xl">
              Brandly Verified Profiles utilize secure OAuth integrations and manual profile reviews to ensure that every creator and brand you partner with is authentic and verified.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/register')}
                className="bg-blue-600 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-blue-700 transition-colors shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5"
              >
                Get Verified Now
              </button>
              <button 
                onClick={() => {
                  document.getElementById('verification-process')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white text-[#0f172a] font-bold py-3.5 px-8 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors hover:shadow-sm">
                How Verification Works
              </button>
            </div>
          </div>

          <div className="flex-1 w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg bg-[#eef2ff] rounded-[3rem] p-8 md:p-12 aspect-square flex items-center justify-center">
              {/* Mockup Card */}
              <div className="bg-white rounded-3xl p-6 shadow-xl w-full relative z-10 hover:-translate-y-2 transition-transform duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <img src="https://ui-avatars.com/api/?name=Elena+Vance&background=fdf4ff&color=a21caf" alt="Elena Vance" className="w-16 h-16 rounded-full border-2 border-white shadow-sm" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-[#0f172a]">Elena Vance</h3>
                      <BadgeCheck className="w-5 h-5 text-blue-600 fill-blue-50" />
                    </div>
                    <p className="text-sm text-gray-500">Verified Oct, 2024</p>
                  </div>
                  <div className="ml-auto bg-green-50 text-green-700 font-bold text-xs px-2.5 py-1 rounded-full border border-green-200">
                    98.6% Health
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Reach</p>
                    <p className="text-2xl font-black text-[#0f172a]">1.2M</p>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Engagement</p>
                    <p className="text-2xl font-black text-blue-700">9.4%</p>
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 leading-relaxed text-center px-4">
                  Identity verified via connected social accounts. Audience health confirmed via engagement metrics.
                </p>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-2 md:right-4 bg-white px-5 py-3 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3 z-20 animate-bounce" style={{ animationDuration: '3s' }}>
                <Shield className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm font-bold text-[#0f172a]">Secure Partnership</p>
                  <p className="text-[10px] text-gray-500">Verified by Brandly System</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MIDDLE SECTION - The Verification Pillar */}
        <section id="verification-process" className="py-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] mb-6">The Verification Pillar</h2>
            <p className="text-lg text-[#64748b] leading-relaxed">
              We don't just hand out badges. Our 3-step verification protocol ensures every user on Brandly meets the highest industry standards for integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Left (Large) */}
            <div className="md:col-span-2 bg-white rounded-3xl p-10 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#0f172a] mb-4">Identity & Social Authentication</h3>
                <p className="text-gray-600 leading-relaxed max-w-lg mb-8">
                  Every verified profile undergoes a rigorous identity check. We use secure OAuth integrations to ensure that the profile belongs to a real, active creator with a genuine presence.
                </p>
              </div>
              <a href="#" className="text-blue-600 font-bold flex items-center gap-2 hover:text-blue-800 transition-colors w-fit">
                Learn about Security <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Top Right (Tall Blue) */}
            <div className="bg-[#1d4ed8] rounded-3xl p-10 shadow-lg text-white flex flex-col justify-between relative overflow-hidden hover:scale-[1.02] transition-transform">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-500/30 text-white rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-blue-400/50">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Audience Health Scoring</h3>
                <p className="text-blue-100 leading-relaxed text-sm">
                  We analyze engagement metrics to ensure creators have genuine interactions, real followers, and maintain high community standards. If they aren't real, they don't get the badge.
                </p>
              </div>
              <div className="mt-12 relative z-10">
                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Avg. Accuracy</p>
                <p className="text-4xl font-black">99.8%</p>
              </div>
            </div>

            {/* Bottom Left (Purple) */}
            <div className="bg-[#7c3aed] rounded-3xl p-10 shadow-lg text-white relative overflow-hidden hover:scale-[1.02] transition-transform">
              <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Manual Vetting</h3>
              <p className="text-purple-100 text-sm leading-relaxed">
                Beyond automated checks, our human curation team reviews connected accounts and profile completeness to guarantee brand safety.
              </p>
            </div>

            {/* Bottom Right (Wide White) */}
            <div className="md:col-span-2 bg-white rounded-3xl p-10 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-8 overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#0f172a] mb-4">Visual Credibility</h3>
                <p className="text-gray-600 leading-relaxed">
                  The Verified Badge isn't just a symbol—it's a metadata-rich certificate that appears across search, messaging, and contracting, signaling instant trust.
                </p>
              </div>
              <div className="flex-1 flex justify-center md:justify-end relative">
                {/* Visual mock of badge on a bar */}
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl w-full max-w-[240px] shadow-sm transform rotate-3 group-hover:rotate-0 transition-all duration-500 flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <BadgeCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="space-y-2 w-full">
                    <div className="h-2.5 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-2 bg-gray-100 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGOROUS SECTION */}
        <section className="py-24 border-t border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] leading-tight mb-12">
                Rigorous. Transparent. <br /><span className="text-blue-600">Reliable.</span>
              </h2>

              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center flex-shrink-0 mt-1">1</div>
                  <div>
                    <h4 className="text-xl font-bold text-[#0f172a] mb-2">Connect Your Ecosystem</h4>
                    <p className="text-gray-500 leading-relaxed">Sync your social accounts and business credentials through our secure OAuth integrations.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center flex-shrink-0 mt-1">2</div>
                  <div>
                    <h4 className="text-xl font-bold text-[#0f172a] mb-2">Platform Verification</h4>
                    <p className="text-gray-500 leading-relaxed">Our system checks for minimum follower and engagement requirements to maintain high platform quality.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center flex-shrink-0 mt-1">3</div>
                  <div>
                    <h4 className="text-xl font-bold text-[#0f172a] mb-2">Final Human Handshake</h4>
                    <p className="text-gray-500 leading-relaxed">A Brandly curation team member reviews the profile to ensure perfect alignment with community standards.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-[#111827] rounded-[2rem] p-6 shadow-2xl relative z-10 border border-gray-800">
                {/* Mockup Top Bar */}
                <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs font-mono text-gray-500">Verification Dashboard</div>
                </div>
                
                {/* Mockup content representing audit */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">OAuth Connection</span>
                    <span className="text-emerald-400 font-mono">SECURED</span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-emerald-500"></div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Engagement Analysis</span>
                    <span className="text-emerald-400 font-mono">PASSED</span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-emerald-500"></div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Manual Review Status</span>
                    <span className="text-blue-400 font-mono">APPROVED</span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-blue-500"></div>
                  </div>

                  {/* Fake chart */}
                  <div className="pt-4 mt-6 border-t border-gray-800 flex items-end gap-2 h-32 opacity-70">
                     {[40, 70, 45, 90, 65, 80, 100, 85, 60, 95].map((h, i) => (
                       <div key={i} className="flex-1 bg-gray-700 rounded-t-sm hover:bg-blue-500 transition-colors" style={{ height: `${h}%`}}></div>
                     ))}
                  </div>
                </div>
              </div>

              {/* Success floating badge */}
              <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 z-20">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-[#0f172a] text-sm">Audit Complete</p>
                  <p className="text-xs text-gray-500">Safety Rating: AAA</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION (Matching other feature pages) */}
        <section className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl mt-12 mb-12 group cursor-pointer">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-blue-500/30 transition-all duration-700"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none group-hover:bg-purple-500/30 transition-all duration-700"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
              Ready to prove your influence?
            </h2>
            <p className="text-gray-300 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
              Join 50,000+ verified creators and brands building authentic relationships on the world's most trusted marketplace.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto bg-[#2563eb] text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-500 transition-colors shadow-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                <ShieldCheck className="w-5 h-5" />
                Apply for Verification
              </button>
            </div>
            <p className="mt-8 text-xs text-gray-500">
              Typical verification process takes 24-48 hours. Terms apply.
            </p>
          </div>
        </section>

      </main>

      <LandingFooter />
    </div>
  );
}
