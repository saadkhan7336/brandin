import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../../components/layout/LandingNavbar";
import LandingFooter from "../../components/layout/LandingFooter";
import {
  Lock,
  Settings,
  Plus,
  Check,
  UserPlus,
  Wand2,
  UploadCloud,
  Send,
  MessageSquare,
  ShieldCheck,
  Image as ImageIcon,
  Video,
  FileText,
  DollarSign,
  Activity,
  ArrowRight,
  MousePointerClick
} from "lucide-react";

export default function CampaignManagement() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans selection:bg-blue-100">
      <LandingNavbar />

      <main className="pt-16 sm:pt-20 pb-12 px-6 max-w-7xl mx-auto">
        {/* Header Content */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 mt-0">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-md tracking-wide uppercase">
                Active Campaign
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-500 font-medium">
                <Lock className="w-3.5 h-3.5" />
                Secure End-to-End Workflow
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0f172a] tracking-tight leading-[1.1] mb-4">
              Summer Essentials 2024
            </h1>

            <p className="text-[#64748b] text-base lg:text-lg max-w-2xl leading-relaxed">
              Streamline your 1-on-1 collaboration. Track milestones, manage deliverables, and communicate securely in one central workspace.
            </p>
          </div>
          {/* Action Buttons (Visual Mockup Only) */}
          <div className="flex gap-3 pointer-events-none select-none opacity-90 relative">
            <div className="absolute -top-3 -right-3 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full border border-blue-200 z-10 shadow-sm whitespace-nowrap">Dashboard Preview</div>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-semibold text-gray-500 shadow-sm text-sm">
              <Settings className="w-4 h-4" />
              Manage
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 rounded-xl font-semibold text-white shadow-sm text-sm">
              <Plus className="w-4 h-4" />
              New Collaboration
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* LEFT COLUMN: Workflow & Approvals */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Workflow Timeline Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-bold text-[#0f172a]">Workflow Timeline</h3>
                <span className="text-blue-600 font-bold text-sm">65% Complete</span>
              </div>
              
              <div className="relative flex justify-between items-start">
                {/* Connecting Lines */}
                <div className="absolute top-5 left-[10%] w-[80%] h-[2px] bg-gray-100 z-0"></div>
                <div className="absolute top-5 left-[10%] w-[55%] h-[2px] bg-blue-600 z-0"></div>
                
                {/* Step 1 */}
                <div className="flex flex-col items-center gap-3 relative z-10 bg-white px-2">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    <Check className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900 text-sm">Briefing</div>
                    <div className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-1">Completed</div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center gap-3 relative z-10 bg-white px-2">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900 text-sm">Contract</div>
                    <div className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-1">Completed</div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center gap-3 relative z-10 bg-white px-2">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-600 text-sm">Creative Review</div>
                    <div className="text-[10px] text-blue-600 font-bold tracking-wider uppercase mt-1">In Progress</div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center gap-3 relative z-10 bg-white px-2">
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-400 text-sm">Execution</div>
                    <div className="text-[10px] text-gray-300 font-bold tracking-wider uppercase mt-1">Pending</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Approvals Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
              <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase mb-6">Pending Approvals</h3>
              
              <div className="space-y-4">
                <div className="bg-[#f8fafc] rounded-2xl p-4 flex items-center gap-4 border border-gray-50">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0f172a] text-sm">Summer Lookbook Video</h4>
                    <p className="text-sm text-gray-500">Creator: Alex Chen • Draft v2</p>
                  </div>
                </div>

                <div className="bg-[#f8fafc] rounded-2xl p-4 flex items-center gap-4 border border-gray-50">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0f172a] text-sm">Lifestyle Carousel (5 Slides)</h4>
                    <p className="text-sm text-gray-500">Creator: Alex Chen • Final Assets</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Chat */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] h-full flex flex-col overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white z-10">
                <h3 className="font-bold text-[#0f172a]">Live Chat</h3>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              
              <div className="flex-1 p-6 bg-[#f8fafc] flex flex-col gap-6 overflow-y-auto">
                <div className="flex items-start gap-3">
                  <img src="https://ui-avatars.com/api/?name=Alex+Chen&background=10B981&color=fff" className="w-8 h-8 rounded-full" alt="Alex Chen" />
                  <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 text-sm text-gray-700 leading-relaxed">
                    <span className="font-bold text-blue-600 text-xs block mb-1">Alex Chen</span>
                    Uploaded the final lifestyle shots. Let me know if the color grading fits the mood board!
                  </div>
                </div>

                <div className="flex items-start gap-3 flex-row-reverse">
                  <img src="/images/login/Creator 1.png" onError={(e)=>e.target.src='https://ui-avatars.com/api/?name=Brand&background=0f172a&color=fff'} className="w-8 h-8 rounded-full" alt="You" />
                  <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-sm shadow-sm text-sm text-white leading-relaxed">
                    <span className="font-bold text-blue-200 text-xs block mb-1">You</span>
                    Looking great, Alex. Just checking the brand safety tags now.
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border-t border-gray-50">
                <div className="bg-[#f8fafc] rounded-full px-4 py-2 flex items-center border border-gray-100">
                  <input type="text" placeholder="Type a message..." className="bg-transparent border-none outline-none flex-1 text-sm text-gray-700" />
                  <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-5">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500 mb-1">Budget Managed</div>
              <div className="text-2xl font-black text-[#0f172a]">$24,500.00</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-5">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500 mb-1">Assets Delivered</div>
              <div className="text-2xl font-black text-[#0f172a]">148 Units</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-5">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500 mb-1">Compliance Rate</div>
              <div className="text-2xl font-black text-[#0f172a]">100% Secure</div>
            </div>
          </div>
        </div>

        {/* Deliverables Task Board (Replacing Creator Partnerships) */}
        <div className="bg-[#f8fafc] rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] mt-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-black text-[#0f172a] mb-2">Collaboration Tasks & Deliverables</h3>
              <p className="text-gray-500">Track the end-to-end progress of your 1-on-1 collaboration.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[#0f172a] mb-1">Sign Contract</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-green-600 mb-4">Completed</p>
              <p className="text-sm text-gray-500">Terms agreed and digitally signed by both parties.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <UploadCloud className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[#0f172a] mb-1">Product Shipped</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-green-600 mb-4">Completed</p>
              <p className="text-sm text-gray-500">Products tracking #1Z999 delivered to creator.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-blue-200 shadow-sm ring-2 ring-blue-50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Video className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[#0f172a] mb-1">Draft Submission</h4>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-4">In Review</p>
              <p className="text-sm text-gray-500">2 TikTok drafts uploaded. Waiting for brand approval.</p>
            </div>

            <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
              <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center mb-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-gray-500 mb-1">Release Payment</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-4">Locked</p>
              <p className="text-sm text-gray-500">Funds held in escrow. Released upon final approval.</p>
            </div>
          </div>
        </div>

        {/* --- ADDED MARKETING SECTIONS BELOW HERO --- */}
        
        {/* Value Proposition / Use Cases */}
        <section className="pt-24 pb-16 mt-8 border-t border-gray-100 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] mb-4">
              Everything in One Place
            </h2>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto leading-relaxed">
              Ditch the endless email threads, scattered Google Drive links, and messy spreadsheets. Manage your collaboration from brief to payment seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">Structured Approvals</h3>
              <p className="text-gray-500 leading-relaxed">
                Approve concepts, drafts, and final assets with clear revision tracking. Never lose track of which version is the final one.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">Centralized Chat</h3>
              <p className="text-gray-500 leading-relaxed">
                Communicate directly with your creator partner. Share feedback, mood boards, and references instantly without leaving the platform.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">Escrow Payments</h3>
              <p className="text-gray-500 leading-relaxed">
                Funds are held securely and released automatically when deliverables are met. Total peace of mind for both brands and creators.
              </p>
            </div>
          </div>
        </section>

        {/* Final Call to Action */}
        <section className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl mb-12 mt-12">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Ready to streamline your workflow?
            </h2>
            <p className="text-gray-300 text-lg md:text-xl font-medium mb-10">
              Manage your collaborations like a pro and scale your brand's story.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto bg-[#2563eb] text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-600 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <MousePointerClick className="w-5 h-5" />
                Start Managing Free
              </button>
            </div>
          </div>
        </section>

      </main>

      <LandingFooter />
    </div>
  );
}
