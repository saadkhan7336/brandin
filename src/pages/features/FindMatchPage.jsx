import React from "react";
import { useNavigate } from "react-router-dom";
import InfluButton from "../../components/common/InfluBtn";
import LandingNavbar from "../../components/layout/LandingNavbar";
import {
  Search,
  Filter,
  Users,
  Star,
  MapPin,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

function FindMatchPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Filter,
      title: "Advanced Filters",
      description:
        "Search by niche, audience size, engagement rate, location, and more to find your perfect match.",
    },
    {
      icon: Users,
      title: "Audience Insights",
      description:
        "View detailed demographics and interests of each influencer's audience before reaching out.",
    },
    {
      icon: Star,
      title: "Performance Metrics",
      description:
        "Compare influencers based on past campaign performance and engagement statistics.",
    },
    {
      icon: MapPin,
      title: "Location Targeting",
      description:
        "Find influencers in specific cities, regions, or countries to reach your target market.",
    },
  ];

  const steps = [
    "Set your campaign criteria and budget",
    "Use advanced filters to narrow down candidates",
    "Review influencer profiles and audience insights",
    "Send collaboration requests to your top picks",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <LandingNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#dbeafe] to-white">
        <div className="w-full max-w-[1800px] mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#3b82f6] rounded-2xl mb-6">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-[#111827] mb-6">
              Find Perfect Matches
            </h1>
            <p className="text-xl text-[#6b7280] max-w-3xl mx-auto mb-8">
              Discover the ideal influencers for your brand using our powerful
              search and filtering tools. Connect with creators who share your
              values and resonate with your target audience.
            </p>
            <InfluButton
              variant="primary"
              size="lg"
              onClick={() => navigate("/register")}
            >
              Get Started
            </InfluButton>
          </div>
          {/* Demo Image */}
          <div className="relative max-w-5xl mx-auto">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop"
              alt="Team searching"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg max-w-sm border border-[#e5e7eb]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#10b981] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-[#111827]">
                    156 Matches Found
                  </div>
                  <div className="text-sm text-[#6b7280]">
                    Based on your criteria
                  </div>
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
              Smart Search, Better Results
            </h2>
            <p className="text-xl text-[#6b7280] max-w-2xl mx-auto">
              Our intelligent matching system helps you find influencers who are
              the perfect fit for your campaigns.
            </p>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl border border-[#e5e7eb] bg-white hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-[#eff6ff] rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-[#3b82f6]" />
                </div>
                <h3 className="text-2xl font-semibold text-[#111827] mb-3">{feature.title}</h3>
                <p className="text-[#6b7280] text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6  bg-[#f9fafb]">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">
              How it Works
            </h2>
            <p className="text-xl text-[#6b7280]">
              Finding the right influencers is simple with Brandly
            </p>
          </div>
          <div className="space-y-6">
            {steps.map((step, index)=>(
              <div 
                key={index}
                className="flex items-start gap-6 bg-white p-6 rounded-xl border border-[#e5e7eb] hover:shadow-lg transition-all"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-[#3b82f6] text-white rounded-full flex items-center justify-center font-bold ">
                  {index + 1}
                </div>
                <p className="text-lg text-[#111827] pt-2">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className=" py-20 px-6 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6]">
        <div className="w-full max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl  text-white/90 mb-8 ">
            Start discovering influencers who can help grow your brand today.
          </p>
          <InfluButton
            variant="outline"
            size='lg'
            onClick={() => navigate('/register')}
            className="bg-white text-[#3b82f6] hover:bg-[#f9fafb] border-white" 
          >
            Get Started free
            <ArrowRight className="w-5 h-5 ml-2" />
          </InfluButton>
        </div>
      </section>
    </div>
  );
}

export default FindMatchPage;
