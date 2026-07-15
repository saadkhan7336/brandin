import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../../components/layout/LandingNavbar";
import LandingFooter from "../../components/layout/LandingFooter";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import {
  Download,
  Calendar,
  Banknote,
  Heart,
  Eye,
  MousePointerClick,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowRight,
  BarChart3,
  PieChart,
  BellRing
} from "lucide-react";

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Conversion");

  const influencers = [
    {
      name: "Sarah Jenkins",
      handle: "@sarah_style",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=fed7aa&color=c2410c",
      campaign: "Summer Glow '24",
      conversion: "12.4%",
      roi: "+$42,200",
      engagementRate: "8.5%",
      interactions: "124k",
      revenue: "$145k",
      cpa: "$12.40"
    },
    {
      name: "Marcus Chen",
      handle: "@marcus_tech",
      avatar: "https://ui-avatars.com/api/?name=Marcus+Chen&background=fed7aa&color=c2410c",
      campaign: "Tech Unboxed",
      conversion: "9.1%",
      roi: "+$28,900",
      engagementRate: "6.2%",
      interactions: "89k",
      revenue: "$92k",
      cpa: "$18.50"
    },
    {
      name: "Elena Rodriguez",
      handle: "@elena_creates",
      avatar: "https://ui-avatars.com/api/?name=Elena+Rodriguez&background=fed7aa&color=c2410c",
      campaign: "Creative Flow",
      conversion: "15.6%",
      roi: "+$35,400",
      engagementRate: "11.4%",
      interactions: "210k",
      revenue: "$180k",
      cpa: "$9.20"
    },
  ];

  const chartData = [
    { name: "Mon", Instagram: 4000, Facebook: 2400 },
    { name: "Tue", Instagram: 3000, Facebook: 1398 },
    { name: "Wed", Instagram: 2000, Facebook: 9800 },
    { name: "Thu", Instagram: 2780, Facebook: 3908 },
    { name: "Fri", Instagram: 1890, Facebook: 4800 },
    { name: "Sat", Instagram: 2390, Facebook: 3800 },
    { name: "Sun", Instagram: 3490, Facebook: 4300 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl">
          <p className="font-bold text-[#0f172a] mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-gray-500">{entry.name}:</span>
              <span className="font-bold text-[#0f172a]">{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans selection:bg-blue-100">
      <LandingNavbar />

      <main className="pt-16 sm:pt-20 pb-12 px-6 max-w-7xl mx-auto">
        {/* Header Content */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 mt-0">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md tracking-wide uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Live Data
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0f172a] tracking-tight leading-[1.1] mb-4">
              Campaign Analytics
            </h1>
            <p className="text-[#64748b] text-base lg:text-lg max-w-2xl leading-relaxed">
              Real-time performance intelligence across your entire creator ecosystem. Watch your data move and analyze every interaction.
            </p>
          </div>
          {/* Action Buttons (Visual Mockup Only) */}
          <div className="flex gap-3 pointer-events-none select-none opacity-90 relative">
            <div className="absolute -top-3 -right-3 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full border border-blue-200 z-10 shadow-sm whitespace-nowrap">Dashboard Preview</div>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-semibold text-gray-500 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              Last 30 Days
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 rounded-xl font-semibold text-white text-sm">
              <Download className="w-4 h-4" />
              Export Report
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { title: "Total ROI", value: "428%", trend: "+12.5%", icon: Banknote, color: "blue", border: "bg-blue-600", iconColor: "text-blue-600" },
            { title: "Engagement Rate", value: "8.42%", trend: "+2.1%", icon: Heart, color: "purple", border: "bg-purple-500", iconColor: "text-purple-500" },
            { title: "Total Reach", value: "1.2M", trend: "+18%", icon: Eye, color: "emerald", border: "bg-emerald-500", iconColor: "text-emerald-500" },
            { title: "Cost Per Click", value: "$0.42", trend: "-4.2%", icon: MousePointerClick, color: "red", border: "bg-blue-400", iconColor: "text-blue-400", down: true }
          ].map((stat, i) => (
            <div key={i} className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden cursor-pointer">
              <div className={`absolute top-0 left-0 w-1 h-full ${stat.border}`}></div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-gray-500 tracking-wider uppercase">{stat.title}</span>
                <div className={`p-2 rounded-lg bg-${stat.color}-50 group-hover:bg-${stat.color}-100 transition-colors`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="text-3xl font-black text-[#0f172a] mb-2">{stat.value}</div>
              <div className={`flex items-center text-sm font-semibold ${stat.down ? 'text-red-500' : 'text-green-600'}`}>
                {stat.down ? <TrendingDown className="w-4 h-4 mr-1" /> : <TrendingUp className="w-4 h-4 mr-1" />}
                {stat.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          
          {/* Engagement Trends - INTERACTIVE CHART */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] lg:col-span-2 group hover:shadow-xl transition-shadow cursor-crosshair">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
                  Engagement Trends
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Interactive</span>
                </h3>
                <p className="text-sm text-gray-500">Hover over the bars to see exact daily performance metrics</p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }} />
                  <Bar dataKey="Instagram" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} animationDuration={1500} />
                  <Bar dataKey="Facebook" stackId="a" fill="#a855f7" radius={[4, 4, 0, 0]} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Audience Growth */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#0f172a]">Audience Growth</h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-6 flex-1">
              {[
                { label: "Gen Z (18-24)", val: "42%", width: "w-[42%]", bg: "bg-blue-600", text: "text-blue-600" },
                { label: "Millennials (25-34)", val: "38%", width: "w-[38%]", bg: "bg-purple-400", text: "text-purple-500" },
                { label: "Gen X (35-44)", val: "15%", width: "w-[15%]", bg: "bg-emerald-400", text: "text-emerald-500" },
                { label: "Others", val: "5%", width: "w-[5%]", bg: "bg-gray-300", text: "text-gray-500" }
              ].map((item, i) => (
                <div key={i} className="group/bar cursor-default">
                  <div className="flex justify-between text-sm font-bold text-[#0f172a] mb-2">
                    <span>{item.label}</span>
                    <span className={`${item.text} transition-all`}>{item.val}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden relative">
                    <div className={`${item.bg} h-full ${item.width} rounded-full origin-left transition-transform duration-1000 ease-out group-hover/bar:brightness-110`}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-[#f8fafc] p-4 rounded-xl border border-gray-100 flex gap-3 hover:border-blue-200 transition-colors cursor-pointer group">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg h-fit group-hover:scale-110 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-blue-600 tracking-wider uppercase mb-1 flex items-center gap-1">
                  Growth Insight
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping absolute ml-24 mt-0.5"></span>
                </div>
                <p className="text-sm text-gray-600">Your audience in the 18-24 segment grew by 12% following the last campaign launch.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Influencers */}
        <div className="bg-[#f8fafc] rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-black text-[#0f172a] mb-1">Top Performing Influencers</h3>
              <p className="text-gray-500 text-sm">Performance metrics per creator</p>
            </div>
            <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
              {['Conversion', 'Engagement', 'Revenue'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Influencer</th>
                  <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Campaign</th>
                  {activeTab === 'Conversion' && (
                    <>
                      <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Conversion Rate</th>
                      <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Net ROI</th>
                    </>
                  )}
                  {activeTab === 'Engagement' && (
                    <>
                      <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Engagement Rate</th>
                      <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Interactions</th>
                    </>
                  )}
                  {activeTab === 'Revenue' && (
                    <>
                      <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Revenue Gen.</th>
                      <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">CPA</th>
                    </>
                  )}
                  <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {influencers.map((inf, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-white hover:shadow-[0_4px_15px_rgb(0,0,0,0.03)] transition-all cursor-pointer group">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img src={inf.avatar} alt={inf.name} className="w-10 h-10 rounded-full group-hover:ring-2 ring-blue-100 transition-all" />
                        <div>
                          <div className="font-bold text-[#0f172a] text-sm group-hover:text-blue-600 transition-colors">{inf.name}</div>
                          <div className="text-xs text-gray-500">{inf.handle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-gray-700">{inf.campaign}</span>
                    </td>

                    {activeTab === 'Conversion' && (
                      <>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {inf.conversion}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm font-bold text-green-600">{inf.roi}</span>
                        </td>
                      </>
                    )}

                    {activeTab === 'Engagement' && (
                      <>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
                            <Heart className="w-3 h-3 mr-1" />
                            {inf.engagementRate}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm font-bold text-[#0f172a]">{inf.interactions}</span>
                        </td>
                      </>
                    )}

                    {activeTab === 'Revenue' && (
                      <>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                            <Banknote className="w-3 h-3 mr-1" />
                            {inf.revenue}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm font-bold text-[#0f172a]">{inf.cpa}</span>
                        </td>
                      </>
                    )}

                    <td className="py-4 px-4 text-right">
                      <button className="text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MARKETING SECTIONS --- */}
        <section className="pt-24 pb-16 mt-8 border-t border-gray-100 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] mb-4">
              Insights That Drive Growth
            </h2>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto leading-relaxed">
              Stop guessing what works. Our advanced analytics suite gives you the actionable data you need to optimize campaigns and maximize your return on investment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BarChart3, title: "Real-time Tracking", desc: "Monitor campaign performance as it happens. Track views, clicks, and conversions in real-time across all active creator collaborations." },
              { icon: PieChart, title: "Audience Intelligence", desc: "Understand exactly who is engaging with your content. Break down your audience by age, location, and interests to refine targeting." },
              { icon: Activity, title: "Automated Reporting", desc: "Generate comprehensive PDF reports with one click. Share success metrics and ROI calculations effortlessly with your stakeholders." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all cursor-default">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0f172a] mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final Call to Action */}
        <section className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl mb-12 mt-12 group cursor-pointer">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-blue-500/30 transition-all duration-700"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Ready to scale with data?
            </h2>
            <p className="text-gray-300 text-lg md:text-xl font-medium mb-10">
              Join top brands using our analytics to drive better results and higher ROI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto bg-[#2563eb] text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-500 transition-colors shadow-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                <TrendingUp className="w-5 h-5" />
                Analyze Campaigns Free
              </button>
            </div>
          </div>
        </section>

      </main>

      <LandingFooter />
    </div>
  );
}
