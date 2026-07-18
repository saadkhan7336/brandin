import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../../components/layout/LandingNavbar";
import LandingFooter from "../../components/layout/LandingFooter";
import {
  Sparkles,
  Search,
  SlidersHorizontal,
  TrendingUp,
  LineChart,
  Users,
  ArrowRight,
  Activity,
  CheckCircle2,
  FileText,
  Target,
  Zap,
  Shield,
  ChevronRight,
  MousePointerClick
} from "lucide-react";

export default function FindMatchPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans selection:bg-blue-100">
      <LandingNavbar />

      <main className="pt-16 sm:pt-20 pb-12 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          
          {/* LEFT COLUMN: Header & Main Content */}
          <div className="lg:col-span-7 flex flex-col">
            
            {/* Header Content */}
            <div className="mb-6 mt-0">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Discovery Engine
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0f172a] tracking-tight leading-[1.1] mb-4">
                Precision Matchmaking <br />
                for <span className="text-[#2563eb]">Elite Creators.</span>
              </h1>

              <p className="text-[#64748b] text-base lg:text-lg max-w-xl leading-relaxed mb-6">
                Beyond basic filters. Our proprietary Digital Curator AI analyzes audience sentiment, historical conversion, and niche alignment to find your brand's perfect voice.
              </p>
            </div>

            {/* Search Bar Area (Visual Mockup Only) */}
            <div className="bg-white p-2 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col sm:flex-row gap-2 mb-6 pointer-events-none select-none opacity-90 relative">
              <div className="absolute -top-3 -right-3 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full border border-blue-200 z-10 shadow-sm">Dashboard Preview</div>
              <div className="flex-1 flex items-center bg-[#f8fafc] rounded-xl px-4 py-3 border border-transparent">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <div className="text-sm text-gray-400">Search by niche, platform, or creator name...</div>
              </div>
              <div className="flex items-center justify-center gap-2 bg-[#f8fafc] text-gray-500 px-6 py-3 rounded-xl font-medium text-sm border border-gray-50">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </div>
              <div className="flex items-center justify-center gap-2 bg-blue-100 text-blue-600 px-8 py-3 rounded-xl font-medium text-sm shadow-sm">
                <Sparkles className="w-4 h-4" />
                Find Matches
              </div>
            </div>

            {/* Match Cards */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              
              {/* Card 1 */}
              <div className="flex-1 bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border-l-4 border-l-blue-600 border-y border-r border-y-gray-100 border-r-gray-100 relative">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <img src="/images/login/Creator 1.png" alt="Alex Rivera" className="w-12 h-12 rounded-full object-cover bg-gray-100" onError={(e) => {e.target.src='https://ui-avatars.com/api/?name=Alex+Rivera&background=0D8ABC&color=fff'}} />
                    <div>
                      <h3 className="font-bold text-[#0f172a] text-lg">Alex Rivera</h3>
                      <p className="text-sm text-gray-500 mb-2">Tech & Lifestyle Vlogger</p>
                      <div className="flex gap-2">
                        <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded">YOUTUBE</span>
                        <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded">840K SUB</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-blue-600">98%</div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Match Score</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Audience Alignment</span>
                    <span className="font-bold text-green-600">High (92%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full w-[92%]"></div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <span className="text-xs text-gray-500 font-medium">Avg. CPM: $18.50</span>
                  <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700 transition-colors">
                    View Analytics <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex-1 bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border-l-4 border-l-purple-500 border-y border-r border-y-gray-100 border-r-gray-100 relative">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <img src="/images/login/Creator 2.png" alt="Elena Sofia" className="w-12 h-12 rounded-full object-cover bg-gray-100" onError={(e) => {e.target.src='https://ui-avatars.com/api/?name=Elena+Sofia&background=8B5CF6&color=fff'}} />
                    <div>
                      <h3 className="font-bold text-[#0f172a] text-lg">Elena Sofia</h3>
                      <p className="text-sm text-gray-500 mb-2">Sustainable Fashion</p>
                      <div className="flex gap-2">
                        <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded">INSTAGRAM</span>
                        <span className="text-[10px] font-bold px-2 py-1 bg-purple-50 text-purple-600 rounded">1.2M FOLLOWERS</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-purple-600">94%</div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Match Score</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Audience Alignment</span>
                    <span className="font-bold text-green-600">Exceptional (96%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full w-[96%]"></div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <span className="text-xs text-gray-500 font-medium">Avg. CPM: $24.20</span>
                  <button className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:text-purple-700 transition-colors">
                    View Analytics <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>

            {/* Why these matches section */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100">
              <h3 className="text-lg font-bold text-[#0f172a] mb-4">Why these matches?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3 text-blue-600 font-semibold">
                    <Activity className="w-5 h-5" />
                    <h4>Sentiment Sync</h4>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    The creator's audience consistently engages with values aligned to your brand sustainability mission.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3 text-blue-600 font-semibold">
                    <TrendingUp className="w-5 h-5" />
                    <h4>Velocity Score</h4>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Selected creators are showing a +12% growth in core engagement over the last 30 days.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3 text-blue-600 font-semibold">
                    <Users className="w-5 h-5" />
                    <h4>Overlap Analysis</h4>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Minimal overlap with your existing campaign partners ensures maximum unique reach.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sidebar Stats */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            {/* Main Sidebar Panel */}
            <div className="bg-[#f8fafc] rounded-3xl p-5 sm:p-6 border border-gray-100 h-full pt-10 sm:pt-12 relative mt-4 lg:mt-8">
              
              {/* Top Right Floating Stat */}
              <div className="absolute -top-8 right-4 sm:-right-4 bg-white p-4 rounded-2xl shadow-lg border border-gray-50 flex items-center gap-4 z-10 w-64">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                  <LineChart className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Search</div>
                  <div className="font-black text-[#0f172a] text-lg">14,204 Creators</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-bold text-[#0f172a]">Curation Sidebar</h3>
              </div>

              {/* Match Strength Chart Area */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-50 mb-6">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-6">Match Strength Distribution</h4>
                <div className="flex items-end justify-between h-24 gap-1 mb-2">
                  <div className="w-full bg-blue-100 rounded-t h-[30%]"></div>
                  <div className="w-full bg-blue-200 rounded-t h-[45%]"></div>
                  <div className="w-full bg-blue-300 rounded-t h-[60%]"></div>
                  <div className="w-full bg-blue-600 rounded-t h-[90%]"></div>
                  <div className="w-full bg-blue-300 rounded-t h-[50%]"></div>
                  <div className="w-full bg-blue-200 rounded-t h-[25%]"></div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                  <span>Low Fit</span>
                  <span>Optimal</span>
                  <span>Specific</span>
                </div>
              </div>

              {/* Audience Demographics */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-50 mb-8">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-6">Audience Demographics</h4>
                
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm font-semibold text-[#0f172a] mb-2">
                      <span>Gen Z (18-24)</span>
                      <span>62%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full w-[62%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-semibold text-[#0f172a] mb-2">
                      <span>Millennials (25-34)</span>
                      <span>28%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full w-[28%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors font-bold rounded-xl flex items-center justify-center gap-2 bg-transparent mb-5 text-sm">
                How Matching Works
              </button>

              {/* Testimonial Box */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-5 rounded-2xl text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <CheckCircle2 className="w-32 h-32" />
                </div>
                <p className="italic text-sm leading-relaxed mb-4 relative z-10 font-medium">
                  "Brandly Nexus cut our talent sourcing time by 80%. The match scores are incredibly accurate for our niche."
                </p>
                <div className="flex items-center gap-3 relative z-10">
                  <img src="https://ui-avatars.com/api/?name=Marcus+Chen&background=10B981&color=fff" alt="Marcus Chen" className="w-8 h-8 rounded-full border border-white/20" />
                  <div>
                    <div className="text-xs font-bold">Marcus Chen</div>
                    <div className="text-[9px] uppercase tracking-wider text-blue-200">Marketing Director, Velocity</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* --- ADDED MARKETING SECTIONS BELOW HERO --- */}
        
        {/* Value Proposition / Use Cases */}
        <section className="pt-8 pb-16 mt-4 border-t border-gray-100 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] mb-4">
              Why Brands Choose Smart AI Matching
            </h2>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto leading-relaxed">
              Stop guessing and start scaling. Our platform is designed to eliminate the trial and error of influencer marketing by connecting you with creators who actually drive results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">Hyper-Targeted Niches</h3>
              <p className="text-gray-500 leading-relaxed">
                Whether you're selling vegan skincare or enterprise software, our AI identifies creators whose audience perfectly overlaps with your ideal customer profile.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">Vetted for Authenticity</h3>
              <p className="text-gray-500 leading-relaxed">
                We automatically flag fake followers, bot engagement, and erratic growth spikes, ensuring your budget is only spent on genuine human attention.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">80% Faster Sourcing</h3>
              <p className="text-gray-500 leading-relaxed">
                Replace weeks of scrolling and manual spreadsheet tracking with instant, data-backed recommendations that are ready to collaborate.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 bg-[#f8fafc] rounded-[3rem] px-8 md:px-16 mb-20 border border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#0f172a] mb-4">
              From Search to Strategy in Minutes
            </h2>
            <p className="text-lg text-[#64748b]">A seamless workflow designed for modern marketing teams.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Set Criteria", desc: "Input your target demographics, budget, and campaign goals." },
              { step: "02", title: "AI Analysis", desc: "Our engine scans millions of profiles to find the highest-probability matches." },
              { step: "03", title: "Review Data", desc: "Analyze in-depth reports on audience overlap and predicted ROI." },
              { step: "04", title: "Connect", desc: "Send collaboration requests directly from the platform." }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="text-5xl font-black text-gray-200 mb-4 transition-colors group-hover:text-blue-100">{item.step}</div>
                <h4 className="text-lg font-bold text-[#0f172a] mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                {i < 3 && <ChevronRight className="hidden md:block absolute top-6 -right-6 w-8 h-8 text-gray-300" />}
              </div>
            ))}
          </div>
        </section>

        {/* Final Call to Action */}
        <section className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Ready to find your perfect match?
            </h2>
            <p className="text-gray-300 text-lg md:text-xl font-medium mb-10">
              Join leading brands who are already using Brandly's AI to scale their influencer marketing ROI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto bg-[#2563eb] text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-600 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <MousePointerClick className="w-5 h-5" />
                Start Sourcing Free
              </button>
            </div>
          </div>
        </section>

      </main>

      <LandingFooter />
    </div>
  );
}
