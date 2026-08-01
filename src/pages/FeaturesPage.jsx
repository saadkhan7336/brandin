import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../components/layout/LandingNavbar";
import LandingFooter from "../components/layout/LandingFooter";
import {
  Sparkles,
  BarChart3,
  Lock,
  Layers,
  Zap,
  Target,
  TrendingUp,
  Headphones,
  BadgeCheck
} from "lucide-react";

export default function FeaturesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fcfcfd] font-sans selection:bg-blue-100">
      <LandingNavbar />

      <main className="pt-24 sm:pt-32 pb-20 px-6 sm:px-8 max-w-[1440px] mx-auto">
        
        {/* HERO SECTION */}
        <div className="flex flex-col items-center text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#3b82f6] text-xs font-bold rounded-full mb-8 tracking-wide uppercase">
            <Sparkles className="w-4 h-4" />
            The future of creator partnerships
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] tracking-tight leading-[1.1] mb-6">
            Focus on the <span className="text-[#3b82f6]">Creative</span>.<br />
            We'll handle the <span className="text-[#a855f7]">Flow</span>.
          </h1>

          <p className="text-[#475569] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Brandly automates the manual friction of campaign management, payments, and creator discovery—so you can build authentic brand stories.
          </p>

          <div className="flex justify-center items-center mt-4">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img src="/images/login/Creator 1.png" alt="Creator" className="w-10 h-10 rounded-full border-[3px] border-white object-cover shadow-sm bg-gray-200" onError={(e) => {e.target.style.display='none'}}/>
                <img src="/images/login/Creator 2.png" alt="Creator" className="w-10 h-10 rounded-full border-[3px] border-white object-cover shadow-sm bg-gray-200" onError={(e) => {e.target.style.display='none'}}/>
                <img src="/images/login/Creator 3.png" alt="Creator" className="w-10 h-10 rounded-full border-[3px] border-white object-cover shadow-sm bg-[#fed7aa] z-10" onError={(e) => {e.target.style.display='none'}}/>
                <div className="w-10 h-10 rounded-full border-[3px] border-white bg-[#2563eb] flex items-center justify-center shadow-sm z-20 text-[11px] font-bold text-white">+2k</div>
              </div>
              <span className="text-sm font-semibold text-[#64748b]">Trusted by 2k+ High-Growth Brands</span>
            </div>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          
          {/* Card 1: Smart AI Matching */}
          <div 
            onClick={() => navigate('/features/find-matches')}
            className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all cursor-pointer group flex flex-col justify-between min-h-[300px] overflow-hidden relative"
          >
            <div className="absolute top-8 right-8 w-32 h-24 opacity-60">
               {/* Decorative lines */}
               <div className="w-full h-2 bg-purple-100 rounded-full mb-3"></div>
               <div className="w-3/4 h-2 bg-purple-200 rounded-full mb-3"></div>
               <div className="w-5/6 h-2 bg-blue-100 rounded-full"></div>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-[#0f172a] mb-3">Smart AI Matching</h3>
              <p className="text-[#64748b] font-medium max-w-sm leading-relaxed mb-8">
                Stop scrolling through endless profiles. Brandly's AI analyzes niche, audience demographics, and engagement quality to instantly match your brand with creators who actually convert.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-purple-50 text-purple-700 text-xs font-bold rounded-full">Audience Affinity: 88%</span>
              <span className="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">Trend Alignment: High</span>
              <span className="px-4 py-2 bg-gray-50 text-gray-700 text-xs font-bold rounded-full border border-gray-200">Niche: Eco-Tech</span>
            </div>
          </div>

          {/* Card 2: Verified Creator Network */}
          <div 
            onClick={() => navigate('/features/verified-profiles')}
            className="md:col-span-1 bg-[#f1f5f9] rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col min-h-[300px]"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
              <BadgeCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-[#0f172a] mb-3">Verified Creator Network</h3>
            <p className="text-[#64748b] font-medium leading-relaxed mb-8 flex-1">
              No bots. No fake followers. Every creator on Brandly passes identity verification and content quality review before earning their verified badge.
            </p>
            <div className="bg-white/60 p-4 rounded-2xl flex items-center justify-center gap-2">
              <img src="/images/login/Creator 1.png" alt="Creator" className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm bg-blue-100" onError={(e) => {e.target.style.display='none'}}/>
              <img src="/images/login/Creator 2.png" alt="Creator" className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm bg-indigo-100 -ml-4 relative z-10" onError={(e) => {e.target.style.display='none'}}/>
              <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white -ml-4 flex items-center justify-center text-[10px] font-bold text-blue-800 relative z-20 shadow-sm">+4k</div>
            </div>
          </div>

          {/* Card 3: Campaign Management Hub */}
          <div 
            onClick={() => navigate('/features/campaign-management')}
            className="md:col-span-1 bg-[#f1f5f9] rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col min-h-[300px]"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-2xl flex items-center justify-center mb-6 text-gray-700 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-[#0f172a] mb-3">Campaign Management Hub</h3>
            <p className="text-[#64748b] font-medium leading-relaxed mb-8 flex-1">
              Plan campaigns, send collaboration invites, share briefs, approve content, and message creators—all from one powerful dashboard.
            </p>
            <div className="space-y-3">
              <div className="bg-white px-4 py-3 rounded-xl flex justify-between items-center shadow-sm">
                <span className="text-sm font-bold text-gray-800">Spring Drop #2</span>
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">Active</span>
              </div>
              <div className="bg-white/60 px-4 py-3 rounded-xl flex justify-between items-center">
                <span className="text-sm font-bold text-gray-500">Influencer Kits</span>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">Draft</span>
              </div>
            </div>
          </div>

          {/* Card 4: Real-time Analytics */}
          <div 
            onClick={() => navigate('/features/analytics')}
            className="md:col-span-1 bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all cursor-pointer group flex flex-col min-h-[300px]"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-[#0f172a] mb-3">Real-time Analytics</h3>
            <p className="text-[#64748b] font-medium leading-relaxed mb-8 flex-1">
              Monitor campaign reach, engagement rates, and ROI as they happen. Data-driven decisions, zero guesswork.
            </p>
            <div className="flex items-end gap-2 h-16 pt-4 border-t border-gray-50">
               <div className="w-full bg-blue-100 rounded-t-md h-1/3"></div>
               <div className="w-full bg-blue-200 rounded-t-md h-1/2"></div>
               <div className="w-full bg-blue-400 rounded-t-md h-full"></div>
               <div className="w-full bg-blue-300 rounded-t-md h-2/3"></div>
               <div className="w-full bg-blue-500 rounded-t-md h-4/5"></div>
            </div>
          </div>

          {/* Card 5: Secure Instant Payments */}
          <div 
            onClick={() => navigate('/features/secure-payments')}
            className="md:col-span-1 bg-[#0f172a] rounded-3xl p-8 shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col min-h-[300px] text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform backdrop-blur-sm">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black mb-3 text-white">Secure Instant Payments</h3>
              <p className="text-gray-400 font-medium leading-relaxed mb-8">
                Protected milestone-based payments that release automatically when deliverables are approved. Brands pay confidently, creators get paid on time.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 tracking-wider uppercase mt-auto">
                <Lock className="w-3 h-3" />
                Secure Stripe Integration
              </div>
            </div>
          </div>

        </div>

        {/* GROWTH SECTION */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-3xl p-10 md:p-12 mb-24 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-50">
          <div className="mb-10 md:mb-0 max-w-md">
            <h2 className="text-3xl font-black text-[#0f172a] mb-4">Built for Speed and Scale</h2>
            <p className="text-[#64748b] font-medium leading-relaxed">
              We removed the friction so you can launch campaigns faster and scale your creator partnerships without adding headcount.
            </p>
          </div>
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-8 md:gap-12">
            <div className="flex flex-col items-center gap-3 text-center">
              <Zap className="w-8 h-8 text-[#475569]" strokeWidth={1.5} />
              <span className="text-[10px] font-bold text-[#64748b] tracking-wider uppercase">Fast Setup</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <Target className="w-8 h-8 text-[#475569]" strokeWidth={1.5} />
              <span className="text-[10px] font-bold text-[#64748b] tracking-wider uppercase">Precise Matching</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <TrendingUp className="w-8 h-8 text-[#475569]" strokeWidth={1.5} />
              <span className="text-[10px] font-bold text-[#64748b] tracking-wider uppercase">Scalable Growth</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <Headphones className="w-8 h-8 text-[#475569]" strokeWidth={1.5} />
              <span className="text-[10px] font-bold text-[#64748b] tracking-wider uppercase">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* CTA BANNER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-[2.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-xl">
          {/* Background Decorative Blurs */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-400/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-800/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Ready to scale your influence?</h2>
            <p className="text-blue-100 text-lg md:text-xl font-medium mb-10 max-w-xl mx-auto">
              Join thousands of brands and creators moving away from spreadsheets and into the flow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
              >
                Join Now
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="w-full sm:w-auto bg-blue-500/20 text-white border border-blue-400/30 font-bold px-8 py-4 rounded-xl hover:bg-blue-500/30 transition-colors"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>

      </main>

      <LandingFooter />
    </div>
  );
}
