import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../../components/layout/LandingNavbar";
import LandingFooter from "../../components/layout/LandingFooter";
import {
  MessageSquare,
  Zap,
  FolderSync,
  MousePointerClick,
  Globe2,
  ShieldCheck
} from "lucide-react";

export default function RealTimeChatPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans selection:bg-blue-100">
      <LandingNavbar />

      <main className="pt-24 sm:pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-8 tracking-wide uppercase">
            <MessageSquare className="w-4 h-4" />
            Seamless Communication
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-[#0f172a] tracking-tight leading-[1.1] mb-6">
            Real-Time Chat for <br />
            <span className="text-blue-600">
              Faster Approvals
            </span>
          </h1>

          <p className="text-[#64748b] text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Keep your collaborations moving. Share feedback, approve content, and negotiate terms instantly without ever leaving the platform.
          </p>

          <button 
            onClick={() => navigate('/register')}
            className="bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <MousePointerClick className="w-5 h-5" />
            Start Chatting Now
          </button>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0f172a] mb-3">Instant Feedback</h3>
            <p className="text-gray-500 leading-relaxed">
              No more waiting on email threads. Review content drafts and provide immediate feedback to keep projects on track.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <FolderSync className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0f172a] mb-3">Asset Sharing</h3>
            <p className="text-gray-500 leading-relaxed">
              Securely share mood boards, briefs, and high-resolution deliverables directly within your conversation thread.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0f172a] mb-3">Secure & Centralized</h3>
            <p className="text-gray-500 leading-relaxed">
              All communications are logged and securely stored in one place, ensuring everyone is always on the same page.
            </p>
          </div>
        </div>

        {/* CHAT UI MOCKUP */}
        <div className="max-w-5xl mx-auto mb-24 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_rgb(0,0,0,0.05)] border border-gray-100 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 w-full relative">
            {/* Decorative background blur */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 bg-[#f8fafc] rounded-3xl border border-gray-100 overflow-hidden shadow-sm flex flex-col h-[400px]">
              <div className="bg-white p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src="https://ui-avatars.com/api/?name=Sarah+Miller&background=10B981&color=fff" alt="Creator" className="w-10 h-10 rounded-full" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0f172a] text-sm">Sarah Miller</h4>
                    <p className="text-xs text-green-600 font-medium">Online</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><FolderSync className="w-4 h-4"/></div>
                </div>
              </div>
              <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
                <div className="flex gap-3">
                  <img src="https://ui-avatars.com/api/?name=Sarah+Miller&background=10B981&color=fff" alt="Creator" className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm text-sm text-gray-700">
                    Hey team! Just uploaded the draft for the Instagram Reel. Let me know what you think about the pacing in the first 5 seconds.
                  </div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">You</div>
                  <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-sm text-sm">
                    Looks fantastic, Sarah! The hook is super strong. We're approving this now so you can go ahead and publish on schedule. 🚀
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 border-t border-gray-100">
                <div className="bg-[#f1f5f9] rounded-full p-2 flex items-center pr-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 mr-2 shadow-sm"><Zap className="w-4 h-4"/></div>
                  <input type="text" placeholder="Type your message..." className="bg-transparent border-none outline-none text-sm flex-1" disabled />
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm ml-2">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-black text-[#0f172a] mb-6">Built for Modern <br/>Brand Collaboration</h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              Context switching kills productivity. By integrating messaging directly into the collaboration workflow, your team can review assets, approve drafts, and negotiate deliverables without ever opening a new tab.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-700 font-medium">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                Directly linked to campaign deliverables
              </li>
              <li className="flex items-center gap-3 text-gray-700 font-medium">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                File sharing up to 2GB per message
              </li>
              <li className="flex items-center gap-3 text-gray-700 font-medium">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                Read receipts and online status tracking
              </li>
            </ul>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
