import React from "react";
import { useNavigate } from "react-router-dom";
import InfluButton from "../../components/common/InfluBtn";
import LandingNavbar from "../../components/layout/LandingNavbar";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  ArrowRight,
} from "lucide-react";

export default function AnalyticsPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: BarChart3,
      title: "Campaign Performance",
      description:
        "Track reach, impressions, engagement rates, and conversions for all your campaigns.",
    },
    {
      icon: PieChart,
      title: "Audience Analytics",
      description:
        "Understand audience demographics, interests, and behaviors across all collaborations.",
    },
    {
      icon: LineChart,
      title: "Trend Analysis",
      description:
        "Identify patterns and trends to optimize future campaigns and maximize ROI.",
    },
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description:
        "Watch your campaigns perform live with real-time data updates and alerts.",
    },
  ];

  const metrics = [
    { label: "Total Reach", value: "2.5M+", change: "+24%" },
    { label: "Engagement Rate", value: "4.8%", change: "+12%" },
    { label: "Conversions", value: "12.5K", change: "+18%" },
    { label: "ROI", value: "380%", change: "+32%" },
  ];

  const steps = [
    "Connect your campaign to start tracking",
    "Monitor real-time performance metrics",
    "Analyze audience insights and engagement",
    "Generate detailed reports for stakeholders",
    "Optimize based on data-driven recommendations",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <LandingNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#fef3c7] to-white">
        <div className="w-full max-w-[1800px] mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#f59e0b] rounded-2xl mb-6">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-[#111827] mb-6">
              Real-time Analytics & Insights
            </h1>
            <p className="text-xl text-[#6b7280] max-w-3xl mx-auto mb-8">
              Make data-driven decisions with comprehensive analytics. Track
              performance, measure ROI, and optimize your influencer marketing
              strategy with actionable insights.
            </p>
            <InfluButton
              variant="primary"
              size="lg"
              onClick={() => navigate("/register")}
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </InfluButton>
          </div>

          {/* Demo Image */}
          <div className="relative max-w-5xl mx-auto">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop"
              alt="Analytics dashboard"
              className="rounded-2xl shadow-2xl"
            />
            {/* Metrics Cards */}
            <div className="absolute -bottom-6 left-6 right-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl shadow-lg border border-[#e5e7eb]"
                >
                  <div className="text-sm text-[#6b7280] mb-1">
                    {metric.label}
                  </div>
                  <div className="text-2xl font-bold text-[#111827] mb-1">
                    {metric.value}
                  </div>
                  <div className="text-xs text-[#10b981] font-medium">
                    {metric.change}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6">
        <div className="w-full max-w-[1800px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">
              Powerful Analytics Tools
            </h2>
            <p className="text-xl text-[#6b7280] max-w-2xl mx-auto">
              Get complete visibility into your campaign performance with our
              comprehensive analytics suite.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl border border-[#e5e7eb] bg-white hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-[#fef3c7] rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-[#f59e0b]" />
                </div>
                <h3 className="text-2xl font-semibold text-[#111827] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#6b7280] text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-[#f9fafb]">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">
              How Analytics Work
            </h2>
            <p className="text-xl text-[#6b7280]">
              From setup to insights in five simple steps
            </p>
          </div>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-6 bg-white p-6 rounded-xl border border-[#e5e7eb] hover:shadow-lg transition-all"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-[#f59e0b] text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <p className="text-lg text-[#111827] pt-2">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#f59e0b] to-[#d97706]">
        <div className="w-full max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Unlock Powerful Insights?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Start tracking your campaign performance and make data-driven
            decisions today.
          </p>
          <InfluButton
            variant="outline"
            size="lg"
            onClick={() => navigate("/register")}
            className="bg-white text-[#f59e0b] hover:bg-[#f9fafb] border-white"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </InfluButton>
        </div>
      </section>
    </div>
  );
}
