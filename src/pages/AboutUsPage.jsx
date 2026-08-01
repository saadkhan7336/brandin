import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../components/layout/LandingNavbar";
import LandingFooter from "../components/layout/LandingFooter";
import {
  Eye,
  TrendingUp,
  Heart,
  Users,
  ArrowRight,
  Sparkles,
  Search,
  ShieldCheck,
  BarChart3,
  CreditCard,
  MessageSquare,
  Zap,
  Layers,
  Server,
  Network,
  Cpu,
  ChevronDown,
  Plus
} from "lucide-react";

export default function AboutUsPage() {
  const navigate = useNavigate();
  const [expandedPhase, setExpandedPhase] = useState(null);

  const roadmapPhases = [
    {
      id: "mvp",
      title: "Current MVP",
      subtitle: "Foundational Layer",
      icon: Server,
      styles: {
        border: "border-blue-100",
        shadow: "shadow-blue-900/5",
        iconBg: "bg-blue-100",
        iconText: "text-blue-600",
        ring: "ring-blue-100",
        hoverBg: "group-hover:bg-blue-50",
        hoverText: "group-hover:text-blue-600",
        hoverBorder: "group-hover:border-blue-200",
        text: "text-blue-600",
        dot: "bg-blue-500"
      },
      features: [
        { name: "OAuth 2.0 & HttpOnly Cookies", desc: "Secure and verified authentication." },
        { name: "Socket.io Engine", desc: "Real-time sync for messaging and notifications." },
        { name: "Mongoose / MongoDB Atlas", desc: "Scalable database with detailed audit logs." },
        { name: "Stripe Connect Escrow", desc: "Trust layer for secure milestone payments." }
      ]
    },
    {
      id: "growth",
      title: "Strategic Growth",
      subtitle: "Data Flywheel",
      icon: Network,
      styles: {
        border: "border-purple-100",
        shadow: "shadow-purple-900/5",
        iconBg: "bg-purple-100",
        iconText: "text-purple-600",
        ring: "ring-purple-100",
        hoverBg: "group-hover:bg-purple-50",
        hoverText: "group-hover:text-purple-600",
        hoverBorder: "group-hover:border-purple-200",
        text: "text-purple-600",
        dot: "bg-purple-500"
      },
      features: [
        { name: "React Native Mobile Apps", desc: "Push notifications and mobility for creators on the go." },
        { name: "Social Media API Integrations", desc: "Fetching real-time social stats of influencers via API keys to validate collab work and audience metrics." },
        { name: "Global Marketplace", desc: "Multi-currency & FX support, localized discovery, and cross-border creator partnerships." },
        { name: "Agencies & Startups Solutions", desc: "Dedicated workflows and portals tailored for growing agencies and startups." }
      ]
    },
    {
      id: "enterprise",
      title: "Enterprise Ecosystem",
      subtitle: "Deep Deployment Layer",
      icon: Cpu,
      styles: {
        border: "border-emerald-100",
        shadow: "shadow-emerald-900/5",
        iconBg: "bg-emerald-100",
        iconText: "text-emerald-600",
        ring: "ring-emerald-100",
        hoverBg: "group-hover:bg-emerald-50",
        hoverText: "group-hover:text-emerald-600",
        hoverBorder: "group-hover:border-emerald-200",
        text: "text-emerald-600",
        dot: "bg-emerald-500"
      },
      features: [
        { name: "AI Moderation Self-Trained Model", desc: "Proprietary AI models for NLP threat detection, CV plagiarism checks, and advanced content governance." },
        { name: "Omnichannel Social Graph", desc: "FB, YT, TikTok, X, LinkedIn API firehose for real-time engagement analytics." },
        { name: "AI Content Matching", desc: "Deep neural networks analyzing creator content style and brand aesthetics for perfect editorial alignment." },
        { name: "Enterprise Solutions", desc: "Highly scalable, customized solutions for large-scale enterprise brand management." }
      ]
    }
  ];

  const currentSolutions = [
    {
      icon: Search,
      title: "Smart Discovery",
      description:
        "AI-powered search and matching algorithms that connect brands with the perfect creators based on niche, audience demographics, and engagement quality.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: ShieldCheck,
      title: "Verified Profiles",
      description:
        "Multi-layer verification system that authenticates every creator's identity, audience authenticity, and engagement metrics to eliminate fake influencers.",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: BarChart3,
      title: "Campaign Analytics",
      description:
        "Real-time dashboards tracking impressions, engagement rates, ROI, and conversion metrics across all active campaigns in one unified view.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description:
        "Escrow-based payment system with milestone payouts, automated invoicing, and complete financial transparency for both brands and creators.",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: MessageSquare,
      title: "Built-in Messaging",
      description:
        "Real-time chat with file sharing, contract negotiation tools, and collaboration workflows — all within the platform.",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: Layers,
      title: "Campaign Management",
      description:
        "End-to-end campaign tools from brief creation to content approval, deliverable tracking, and post-campaign reporting.",
      color: "bg-cyan-100 text-cyan-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans selection:bg-blue-100">
      <LandingNavbar />

      <main className="pt-24 lg:pt-32 pb-24">
        {/* HERO SECTION */}
        <section className="px-6 sm:px-8 max-w-[1440px] mx-auto mb-32">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Content */}
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-6">
                <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase">
                  Our Story
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#0f172a] leading-[1.05] tracking-tight mb-6">
                Humanizing
                <br />
                <span className="text-[#0f172a]">Digital </span>
                <span className="text-[#2563eb]">Influence.</span>
              </h1>
              <p className="text-lg text-gray-500 max-w-xl leading-relaxed">
                We bridge the gap between authentic creators and world-class
                brands. Brandly isn't just a platform; it's a digital gallery
                where models, vloggers, and YouTubers find their next big stage
                through transparency and data-driven empowerment.
              </p>
            </div>

            {/* Right - Hero Image */}
            <div className="w-full lg:w-1/2 relative">
              <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-[3rem] p-8 relative overflow-hidden">
                <img
                  src="/images/about/Creators meeting.png"
                  alt="Brandly Team"
                  className="w-full max-w-sm mx-auto rounded-2xl shadow-xl relative z-10"
                />
                {/* Floating AI Matching Card */}
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md border border-gray-200 p-3 rounded-xl flex items-center gap-3 z-20 shadow-lg">
                  <div className="w-8 h-8 bg-[#2563eb] rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      AI Matching
                    </p>
                    <p className="text-xs font-bold text-[#0f172a]">
                      Connecting creators based on genuine
                      <br />
                      brand affinity and target follower assets.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THE PILLARS OF BRANDLY */}
        <section className="px-6 sm:px-8 max-w-[1440px] mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tight">
              The Pillars of Brandly
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Radical Transparency */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-[#0f172a] rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black text-[#0f172a] mb-3">
                Radical Transparency
              </h3>
              <p className="text-gray-500 leading-relaxed">
                No hidden fees. No shadow bans. We believe the creator ecosystem
                thrives when every transaction and metric is clear to both
                parties.
              </p>
            </div>

            {/* Infinite Growth */}
            <div className="bg-[#2563eb] rounded-[2rem] p-8 shadow-lg hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">
                Infinite Growth
              </h3>
              <p className="text-blue-100 leading-relaxed">
                Track your first step to your 100th campaign. We provide the
                analytics to scale your influence exponentially.
              </p>
            </div>

            {/* Empowerment */}
            <div className="bg-[#10b981] rounded-[2rem] p-8 shadow-lg hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">
                Empowerment
              </h3>
              <p className="text-emerald-100 leading-relaxed">
                Creators own their data. Brands own their campaigns. We just
                build the tools that make magic happen.
              </p>
            </div>

            {/* Authentic Connection */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all group flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-black text-[#0f172a] mb-3">
                  Authentic Connection
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  We prioritise bloggers and YouTubers with a voice from the
                  heart. Subtlety is the only currency that feels true in the
                  creator economy.
                </p>
              </div>
              <div className="w-full md:w-40 h-40 bg-gradient-to-br from-purple-100 to-blue-50 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                  src="/images/about/Professional creator collaborating.png"
                  alt="Authentic Connection"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* PLATFORM SOLUTIONS */}
        <section className="px-6 sm:px-8 max-w-[1440px] mx-auto mb-32 py-16 bg-[#f8fafc] rounded-[3rem] border border-gray-100">
          <div className="text-center mb-16 px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-6">
              <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase">
                Platform Solutions
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tight mb-4">
              What We{" "}
              <span className="text-[#2563eb] italic">Build & Deliver</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              From intelligent discovery to secure transactions — everything you
              need to run successful influencer marketing campaigns, all in one
              place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto px-6">
            {currentSolutions.map((solution, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${solution.color}`}
                >
                  <solution.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-[#0f172a] mb-2">
                  {solution.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ROADMAP SECTION */}
        <section className="px-6 sm:px-8 max-w-[1440px] mx-auto mb-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-full mb-4">
              <span className="text-[10px] font-bold tracking-wider text-purple-600 uppercase">Roadmap</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tight mb-4">
              Future Ecosystem Architecture
            </h2>
            <p className="text-gray-500 text-lg max-w-3xl mx-auto leading-relaxed">
              Our journey from a robust foundational MVP to a highly intelligent, omnichannel enterprise ecosystem. 
              Here is how every layer connects to power the future of creator partnerships.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 relative">
            {/* Connecting Lines for Desktop */}
            <div className="hidden lg:block absolute top-[140px] left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>

            {roadmapPhases.map((phase, index) => {
              const isExpanded = expandedPhase === phase.id;
              const isLast = index === roadmapPhases.length - 1;
              return (
                <div 
                  key={phase.id}
                  onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                  className={`flex-1 bg-white rounded-3xl p-8 border ${phase.styles.border} shadow-xl ${phase.styles.shadow} relative group cursor-pointer transition-all duration-500 ease-in-out ${isExpanded ? 'scale-105 z-20 ring-4 ring-offset-4 ' + phase.styles.ring : 'hover:-translate-y-2 z-10'}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 ${phase.styles.iconBg} ${phase.styles.iconText} rounded-2xl flex items-center justify-center`}>
                      <phase.icon className="w-7 h-7" />
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 text-gray-400 ${phase.styles.hoverText} ${phase.styles.hoverBg} transition-colors`}>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-[#0f172a] mb-1">{phase.title}</h3>
                  <p className={`text-sm font-bold ${phase.styles.text} mb-6 tracking-wide uppercase`}>{phase.subtitle}</p>
                  
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-32 opacity-70'}`}>
                    <ul className="space-y-4">
                      {phase.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${phase.styles.dot} mt-2 flex-shrink-0`}></div>
                          <div>
                            <strong className="text-gray-900 block text-sm">{feature.name}</strong>
                            <div className={`grid transition-all duration-500 ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'}`}>
                              <div className="overflow-hidden">
                                <span className="text-xs text-gray-500">{feature.desc}</span>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Arrow linking to next */}
                  {!isLast && (
                    <div className={`hidden lg:flex absolute -right-6 top-[116px] w-12 h-12 bg-white rounded-full border border-gray-200 items-center justify-center shadow-sm text-gray-400 ${phase.styles.hoverText} ${phase.styles.hoverBorder} transition-all duration-300 ${isExpanded ? 'z-0 opacity-0 scale-90' : 'z-30 opacity-100 scale-100'}`}>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-12 bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 justify-center">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600 text-left">
              <strong className="text-[#0f172a]">The Data Flywheel Effect:</strong> As we expand our strategic growth avenues, the increased data ingestion fuels our AI learning and feedback loops, continuously enhancing our future enterprise ecosystem.
            </p>
          </div>
        </section>

        {/* MEET THE CURATORS */}
        <section className="px-6 sm:px-8 max-w-[1440px] mx-auto mb-32">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-black text-[#0f172a] mb-2">
                Meet the Curators
              </h2>
              <p className="text-gray-500 max-w-lg">
                A diverse team of engineers, marketers, and former creators
                building the future of digital influence.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl">
            {/* Founder 1 - Sami */}
            <div className="group cursor-pointer">
              <div className="bg-gray-100 rounded-[2rem] overflow-hidden aspect-[3/4] mb-6 relative">
                <img
                  src="/images/about/Rana Muhammad Sami.png"
                  alt="Rana Muhammad Sami"
                  className="w-full h-full object-cover grayscale group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <h3 className="text-xl font-black text-[#0f172a] mb-1">
                Rana Muhammad Sami
              </h3>
              <p className="text-gray-500 text-sm font-medium">
                Co-Founder & CEO
              </p>
            </div>

            {/* Founder 2 - Saad */}
            <div className="group cursor-pointer">
              <div className="bg-gray-100 rounded-[2rem] overflow-hidden aspect-[3/4] mb-6 relative">
                <img
                  src="/images/about/Saad Ahmad Khan.jpeg"
                  alt="Saad Ahmad Khan"
                  className="w-full h-full object-cover grayscale group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <h3 className="text-xl font-black text-[#0f172a] mb-1">
                Saad Ahmad Khan
              </h3>
              <p className="text-gray-500 text-sm font-medium">Co-Founder</p>
            </div>

            {/* Join Team Card */}
            <div 
              onClick={() => navigate("/contact")}
              className="group cursor-pointer flex flex-col items-center justify-center h-full min-h-[300px]"
            >
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] aspect-[3/4] mb-6 w-full flex flex-col items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-50 transition-all duration-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300 mb-4">
                  <Plus className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-gray-400 group-hover:text-blue-600 transition-colors">
                  Join the team
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="px-6 sm:px-8 max-w-[1440px] mx-auto mb-12">
          <div className="bg-[#2563eb] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 mix-blend-multiply"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                Ready to redefine influence?
              </h2>
              <p className="text-blue-100 text-lg font-medium mb-10 max-w-2xl mx-auto">
                Whether you're a YouTuber with a dedicated niche or a brand
                looking for real impact, Brandly is your home.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                  onClick={() => navigate("/register", { state: { defaultRole: 'creator' } })}
                  className="w-full sm:w-auto bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  I'm a Creator <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate("/register", { state: { defaultRole: 'brand' } })}
                  className="w-full sm:w-auto bg-white/10 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20 flex items-center justify-center gap-2"
                >
                  I'm a Brand <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
