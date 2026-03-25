import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../components/layout/LandingNavbar";
import InfluButton from "../components/common/InfluBtn";
import { Shield, ArrowRight, BarChart3, Users, Zap, Star } from "lucide-react";

export default function CaseStudiesPage() {
  const navigate = useNavigate();

  const caseStudies = [
    {
      id: 1,
      brand: "Glow Beauty",
      title: "Increasing Brand Awareness by 300% with Micro-Influencers",
      metrics: [
        { label: "Reach", value: "2.5M+" },
        { label: "Engagement", value: "8.4%" },
        { label: "ROI", value: "4.2x" },
      ],
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?w=800&h=600&fit=crop",
      category: "Health & Beauty",
    },
    {
      id: 2,
      brand: "TechGear",
      title: "Scaling Product Launch to $1M in Revenue in 30 Days",
      metrics: [
        { label: "Sales", value: "$1.2M" },
        { label: "Reach", value: "5.8M+" },
        { label: "Conversion", value: "3.2%" },
      ],
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
      category: "Consumer Electronics",
    },
    {
      id: 3,
      brand: "FitLife",
      title: "Building a Loyal Community of 100K Fitness Enthusiasts",
      metrics: [
        { label: "New Users", value: "100K+" },
        { label: "Retention", value: "65%" },
        { label: "Cost/User", value: "$0.45" },
      ],
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
      category: "Fitness & Wellness",
    },
    {
      id: 4,
      brand: "EcoHome",
      title: "Driving Sustainable Living with Authentic Storytelling",
      metrics: [
        { label: "Reach", value: "1.8M" },
        { label: "Engagement", value: "9.2%" },
        { label: "Sentiment", value: "Positive" },
      ],
      image:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=600&fit=crop",
      category: "Home & Lifestyle",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#eff6ff] via-white to-[#f0fdf4]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#dbeafe] text-[#3b82f6] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Case Studies
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-[#111827] mb-6">
            Real Stories, <br />
            <span className="text-[#3b82f6]">Unreal Results</span>
          </h1>
          <p className="text-xl text-[#6b7280] max-w-2xl mx-auto">
            Discover how leading brands are leveraging Brandly to transform
            their influencer marketing strategy and achieve record-breaking
            growth.
          </p>
        </div>
      </section>

      {/* Featured Metric */}
      <section className="py-12 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                4.5x
              </div>
              <div className="text-[#9ca3af]">Average ROI Across Campaigns</div>
            </div>
            <div className="border-x border-white/10 px-8">
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                500M+
              </div>
              <div className="text-[#9ca3af]">Total Reach Generated</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                92%
              </div>
              <div className="text-[#9ca3af]">Brand Partnership Retention</div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {caseStudies.map((study) => (
              <div key={study.id} className="group cursor-pointer">
                <div className="relative rounded-3xl overflow-hidden mb-8 lg:aspect-[16/10]">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="text-[#3b82f6] font-bold text-sm uppercase tracking-wider mb-2">
                      {study.category}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {study.brand}: {study.title}
                    </h3>
                    <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
                      {study.metrics.map((metric, idx) => (
                        <div key={idx}>
                          <div className="text-xl font-bold text-white">
                            {metric.value}
                          </div>
                          <div className="text-xs text-white/60 uppercase">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-[#111827] font-bold gap-2 group-hover:text-[#3b82f6] transition-colors">
                  Read Full Case Study
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-6 bg-[#f9fafb]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-6 h-6 fill-[#f59e0b] text-[#f59e0b]" />
            ))}
          </div>
          <h2 className="text-3xl font-bold text-[#111827] mb-8 leading-relaxed italic">
            "Brandly has revolutionized how we approach influencer
            collaborations. The data-driven insights and verified profiles have
            given us the confidence to scale our campaigns globally."
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-2xl font-bold">
              SJ
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-[#111827]">
                Sarah Jenkins
              </div>
              <div className="text-[#6b7280]">
                Marketing Director at Glow Beauty
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 px-6 border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#111827] mb-16">
            Why Leading Brands Scale with Brandly
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-[#eff6ff] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-[#3b82f6]" />
              </div>
              <h3 className="text-xl font-bold text-[#111827]">
                Deep Influencer Analytics
              </h3>
              <p className="text-[#6b7280] leading-relaxed">
                Access verified audience demographics, engagement rates, and
                historical performance metrics to ensure the perfect brand
                match.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-[#f0fdf4] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-[#10b981]" />
              </div>
              <h3 className="text-xl font-bold text-[#111827]">
                Conversion Tracking
              </h3>
              <p className="text-[#6b7280] leading-relaxed">
                Track every click, conversion, and dollar earned through our
                advanced attribution modeling and pixel integration.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-[#fefce8] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-[#f59e0b]" />
              </div>
              <h3 className="text-xl font-bold text-[#111827]">
                Automated Workflows
              </h3>
              <p className="text-[#6b7280] leading-relaxed">
                Streamline communication, contracts, and payments with
                automation that saves your team hundreds of hours per month.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#111827] to-[#1f2937] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#3b82f6] opacity-10 blur-[128px] -mr-48 -mt-48"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            Ready to write your success story?
          </h2>
          <p className="text-xl text-[#9ca3af] mb-10">
            Join the hundreds of brands that are scaling their growth with
            data-driven influencer marketing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <InfluButton
              variant="primary"
              size="lg"
              onClick={() => navigate("/register")}
            >
              Request Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </InfluButton>
            <InfluButton
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate("/contact")}
            >
              Contact Sales
            </InfluButton>
          </div>
        </div>
      </section>

      {/* Footer (Simplified) */}
      <footer className="py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#3b82f6]" />
            <span className="text-xl font-bold text-[#111827]">Brandly</span>
          </div>
          <div className="text-[#6b7280] text-sm">
            &copy; 2024 Brandly. All rights reserved.
          </div>
          <div className="flex gap-8 text-sm font-medium text-[#6b7280]">
            <button className="hover:text-[#3b82f6]">Privacy Policy</button>
            <button className="hover:text-[#3b82f6]">Terms of Service</button>
            <button className="hover:text-[#3b82f6]">Status</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
