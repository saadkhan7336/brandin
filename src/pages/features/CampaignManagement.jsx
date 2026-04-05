import React from "react";
import { useNavigate } from "react-router-dom";
import InfluButton from "../../components/common/InfluBtn";
import LandingNavbar from "../../components/layout/LandingNavbar";
import {
  Target,
  Calendar,
  Users,
  BarChart,
  MessageSquare,
  Clock,
  ArrowRight,
} from "lucide-react";

function CampaignManagement() {
  const navigate = useNavigate();
  const features = [
    {
      icon: Calendar,
      title: "Campaign Planning",
      description:
        "Create detailed campaign briefs, set timelines, and define deliverables all in one place.",
    },
    {
      icon: Users,
      title: "Collaboration Hub",
      description:
        "Communicate with influencers, share assets, and manage approvals seamlessly.",
    },
    {
      icon: BarChart,
      title: "Progress Tracking",
      description:
        "Monitor campaign milestones, deliverables, and track real-time progress.",
    },
    {
      icon: MessageSquare,
      title: "Built-in Messaging",
      description:
        "Keep all campaign communications organized in one centralized inbox.",
    },
  ];

  const steps = [
    "Define your campaign goals and requirements",
    "Select influencers and send collaboration invites",
    "Share campaign briefs and creative assets",
    "Monitor progress and approve content submissions",
    "Track performance and measure campaign success",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <LandingNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#d1fae5] to-white">
        <div className="w-full max-w-[1800px] mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#10b981] rounded-2xl mb-6">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-[#111827] mb-6">
              Campaign Management Made Simple
            </h1>
            <p className="text-xl text-[#6b7280] max-w-3xl mx-auto mb-8">
              Streamline your influencer campaigns from start to finish. Create, manage, and track 
              all your collaborations in one powerful dashboard designed for efficiency.
            </p>
            <InfluButton variant="primary" size="lg" onClick={() => navigate('/register')}>
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </InfluButton>
          </div>

          {/* Demo Image */}
          <div className="relative max-w-5xl mx-auto">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop"
              alt="Campaign dashboard"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg max-w-sm border border-[#e5e7eb]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#10b981] rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-[#111827]">3 Active Campaigns</div>
                  <div className="text-sm text-[#6b7280]">All on schedule</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="w-full max-w-[1800px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-[#6b7280] max-w-2xl mx-auto">
              Manage every aspect of your influencer campaigns with intuitive tools designed for success.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl border border-[#e5e7eb] bg-white hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-[#d1fae5] rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-[#10b981]" />
                </div>
                <h3 className="text-2xl font-semibold text-[#111827] mb-3">{feature.title}</h3>
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
              How Campaign Management Works
            </h2>
            <p className="text-xl text-[#6b7280]">
              Launch and manage successful campaigns in five simple steps
            </p>
          </div>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-6 bg-white p-6 rounded-xl border border-[#e5e7eb] hover:shadow-lg transition-all">
                <div className="flex-shrink-0 w-10 h-10 bg-[#10b981] text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <p className="text-lg text-[#111827] pt-2">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#10b981] to-[#059669]">
        <div className="w-full max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Streamline Your Campaigns?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of brands managing successful influencer campaigns with Brandly.
          </p>
          <InfluButton 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/register')}
            className="bg-white text-[#10b981] hover:bg-[#f9fafb] border-white"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </InfluButton>
        </div>
      </section>
    </div>
  )
}

export default CampaignManagement;
