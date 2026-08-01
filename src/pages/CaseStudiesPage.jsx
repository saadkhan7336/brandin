import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../components/layout/LandingNavbar";
import LandingFooter from "../components/layout/LandingFooter";
import { 
  ArrowRight, 
  BarChart3, 
  TrendingUp,
  Target,
  ShieldCheck,
  CheckCircle2,
  Users
} from "lucide-react";

export default function CaseStudiesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All Cases");

  const tabs = ["All Cases", "SaaS", "Fashion", "Tech", "Lifestyle"];

  const caseStudies = [
    {
      id: 1,
      title: "Velvet & Vine Launch",
      category: "FASHION",
      description: "\"We drove quick sales in 72 hours through strategic influencer drops.\"",
      metricLabel: "+320% Growth",
      image: "/images/case-studies/Fashion Campaign.png",
      color: "text-emerald-500",
      bgBadge: "bg-purple-100 text-purple-700"
    },
    {
      id: 2,
      title: "CloudSync Growth",
      category: "SAAS",
      description: "\"Strategic B2B influencer partnerships that converted high-value enterprise leads.\"",
      metricLabel: "12k New Trials",
      image: "/images/case-studies/SaaS Collaboration.png",
      color: "text-emerald-500",
      bgBadge: "bg-blue-100 text-blue-700"
    },
    {
      id: 3,
      title: "Titan Gear Pro",
      category: "TECH",
      description: "\"Scaling a new hardware launch across YouTube & TikTok with live-video assets.\"",
      metricLabel: "4.5M Views",
      image: "/images/case-studies/Tech Product.png",
      color: "text-emerald-500",
      bgBadge: "bg-orange-100 text-orange-700"
    }
  ];

  const filteredStudies = activeTab === "All Cases" 
    ? caseStudies 
    : caseStudies.filter(study => study.category.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans selection:bg-blue-100">
      <LandingNavbar />

      <main className="pt-24 lg:pt-32 pb-24">
        
        {/* HEADER */}
        <section className="px-6 sm:px-8 max-w-[1440px] mx-auto mb-16 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-6">
            <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase">Case Studies</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#0f172a] leading-[1.05] tracking-tight mb-6 max-w-4xl">
            Success Stories:<br/> <span className="text-[#2563eb]">Curated Results</span> that Matter.
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
            Explore how Brandly empowers global brands to navigate the creator economy with precision, turning digital influence into measurable commercial impact.
          </p>
        </section>

        {/* FEATURED CASE STUDY */}
        <section className="px-6 sm:px-8 max-w-[1440px] mx-auto mb-32">
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-4 md:p-8 border border-gray-100 shadow-xl flex flex-col lg:flex-row items-center gap-12 cursor-pointer hover:shadow-2xl transition-shadow" onClick={() => navigate('/case-studies/featured')}>
            {/* Image Side */}
            <div className="w-full lg:w-1/2 bg-[#2d5c4c] rounded-[2rem] p-8 relative overflow-hidden flex justify-center items-center aspect-square lg:aspect-auto h-full min-h-[400px]">
               <img src="/images/case-studies/Neobank Interface.png" alt="Neobank Interface" className="w-3/4 max-w-sm rounded-xl shadow-2xl relative z-10 hover:-translate-y-2 transition-transform duration-500" />
               <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 z-20">
                 <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                   <ShieldCheck className="w-6 h-6 text-[#2d5c4c]" />
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Client Spotlight</p>
                   <p className="text-sm font-bold text-white">The Neobank Experience</p>
                 </div>
               </div>
            </div>

            {/* Content Side */}
            <div className="w-full lg:w-1/2 p-4 md:p-8">
              <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] mb-6 leading-tight">
                Disrupting Fintech through Lifestyle Storytelling
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-10">
                To scale their user base, we moved beyond typical financial influencers. Our Digital Curator AI identified "lifestyle tech" creators whose audiences were ready for a frictionless banking revolution.
              </p>

              <div className="flex flex-wrap gap-8 mb-10">
                 <div>
                   <p className="text-3xl font-black text-[#2563eb] mb-1">14.2x</p>
                   <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">Customer ROI</p>
                 </div>
                 <div>
                   <p className="text-3xl font-black text-[#0f172a] mb-1">1.2M</p>
                   <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">Total Reach</p>
                 </div>
                 <div>
                   <p className="text-3xl font-black text-[#0f172a] mb-1">840k</p>
                   <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">Engagement</p>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 font-bold text-lg">
                    E
                  </div>
                  <div>
                    <p className="font-bold text-[#0f172a] text-sm">Elena Thorne</p>
                    <p className="text-xs text-gray-500">Lead Creator Partner</p>
                  </div>
                </div>
                <button className="w-full sm:w-auto bg-[#2563eb] text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-600 transition-colors shadow-md">
                  Read Full Study
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* MARKET VERTICALS */}
        <section className="px-6 sm:px-8 max-w-[1440px] mx-auto mb-32">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b border-gray-200 pb-6">
            <div>
              <h2 className="text-3xl font-black text-[#0f172a] mb-2">Market Verticals</h2>
              <p className="text-gray-500">Filtered results across our most successful implementation sectors.</p>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStudies.map((study) => (
              <div 
                key={study.id} 
                className="bg-white rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-xl transition-all group cursor-pointer overflow-hidden flex flex-col"
                onClick={() => navigate(`/case-studies/${study.id}`)}
              >
                <div className="h-64 overflow-hidden relative bg-gray-50">
                  <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${study.bgBadge}`}>
                    {study.category}
                  </div>
                  <img src={study.image} alt={study.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-[#0f172a] mb-3">{study.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">{study.description}</p>
                  
                  <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                    <span className={`font-bold text-sm flex items-center gap-2 ${study.color}`}>
                       <TrendingUp className="w-4 h-4" />
                       {study.metricLabel}
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#2563eb] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* THE CURATOR ENGINE */}
        <section className="px-6 sm:px-8 max-w-[1440px] mx-auto mb-32 py-16 bg-[#f8fafc] rounded-[3rem] border border-gray-100">
           <div className="flex flex-col lg:flex-row gap-16 items-center px-6 lg:px-16">
              {/* Cards Grid */}
              <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                 <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                      <Target className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-[#0f172a] text-sm mb-2">Neural Matching</h4>
                    <p className="text-xs text-gray-500">Analyzing 1,000+ data points per profile.</p>
                 </div>

                 <div className="bg-[#2563eb] p-6 rounded-3xl shadow-lg hover:-translate-y-1 transition-transform sm:translate-y-8">
                    <div className="w-10 h-10 bg-white/20 text-white rounded-xl flex items-center justify-center mb-4">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-white text-sm mb-2">Precision ROI</h4>
                    <p className="text-xs text-blue-100">Predictive modeling for campaign performance.</p>
                 </div>

                 <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 shadow-sm hover:-translate-y-1 transition-transform">
                    <div className="w-10 h-10 bg-white text-blue-600 rounded-xl flex items-center justify-center mb-4">
                      <Users className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-[#0f172a] text-sm mb-2">Sentiment Sync</h4>
                    <p className="text-xs text-gray-500">Ensuring brand tone aligns with creator voice perfectly.</p>
                 </div>

                 <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform sm:translate-y-8">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-[#0f172a] text-sm mb-2">Vetting Pro</h4>
                    <p className="text-xs text-gray-500">Automated authenticity check for follower quality.</p>
                 </div>
              </div>

              {/* Text Content */}
              <div className="w-full lg:w-1/2">
                <p className="text-xs font-bold tracking-wider text-purple-600 uppercase mb-4">The Curator Engine</p>
                <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] mb-6 leading-tight">
                  AI That Thinks Like a <br/><span className="text-purple-600 italic">Digital Curator</span>
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed mb-8">
                  Most platforms use generic keyword matching. Brandly uses deep neural networks to understand the editorial nuances of a creator's feed. We don't just find followers; we find the perfect aesthetic match for your brand identity.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-[#0f172a] text-sm">98% Curator-Rated Compatibility Score</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-[#0f172a] text-sm">Automated Content Style Classification</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-[#0f172a] text-sm">Real-time Demographic Alignment Updates</span>
                  </li>
                </ul>
              </div>
           </div>
        </section>

        {/* CTA SECTION */}
        <section className="px-6 sm:px-8 max-w-[1440px] mx-auto mb-12">
          <div className="bg-[#2563eb] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 mix-blend-multiply"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                Ready to redefine your influence?
              </h2>
              <p className="text-blue-100 text-lg font-medium mb-10 max-w-2xl mx-auto">
                Join the elite circle of brands using Curator AI to dominate their market through human-centric, data-driven creator partnerships.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button 
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
                >
                  Start a Project
                </button>
                <button 
                  onClick={() => {
                    document.getElementById('grid-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto bg-white/10 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20"
                >
                  See All Success Stories
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
