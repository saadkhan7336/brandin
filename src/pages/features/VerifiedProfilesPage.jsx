import React from "react";
import { useNavigate } from "react-router-dom";
import InfluButton from "../../components/common/InfluBtn";
import LandingNavbar from "../../components/layout/LandingNavbar";
import {
  Shield,
  CheckCircle,
  Award,
  Lock,
  UserCheck,
  FileCheck,
  Search,
  ArrowRight,
} from "lucide-react";

export default function VerifiedProfilesPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: UserCheck,
      title: "Identity Verification",
      description:
        "All influencers undergo thorough identity verification to ensure authenticity.",
    },
    {
      icon: Award,
      title: "Quality Standards",
      description:
        "We maintain strict quality standards to ensure professional and reliable collaborations.",
    },
    {
      icon: FileCheck,
      title: "Portfolio Review",
      description:
        "Past work and performance metrics are reviewed to validate influencer capabilities.",
    },
    {
      icon: Lock,
      title: "Secure Platform",
      description:
        "Your data and transactions are protected with enterprise-grade security.",
    },
  ];

  const verificationSteps = [
    "Influencer submits profile application",
    "Identity verification and document review",
    "Social media account authentication",
    "Portfolio and content quality assessment",
    "Profile approved and verification badge awarded",
  ];

  const benefits = [
    "Work with trusted, verified creators",
    "Reduce fraud and fake follower risks",
    "Access detailed performance history",
    "Professional and reliable partnerships",
    "Safe and secure transactions",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <LandingNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#f3e8ff] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#8b5cf6] rounded-2xl mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-[#111827] mb-6">
              Verified Profiles You Can Trust
            </h1>
            <p className="text-xl text-[#6b7280] max-w-3xl mx-auto mb-8">
              Work with confidence knowing every influencer on Brandly is
              verified and authenticated. Our rigorous verification process
              ensures quality, authenticity, and professional standards.
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
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&h=600&fit=crop"
              alt="Verified profiles"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg max-w-sm border border-[#e5e7eb]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#8b5cf6] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-[#111827]">
                    100% Verified
                  </div>
                  <div className="text-sm text-[#6b7280]">
                    Trusted influencers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">
              Comprehensive Verification Process
            </h2>
            <p className="text-xl text-[#6b7280] max-w-2xl mx-auto">
              Our multi-step verification ensures you work with authentic,
              professional influencers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl border border-[#e5e7eb] bg-white hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-[#f3e8ff] rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-[#8b5cf6]" />
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

      {/* Verification Process */}
      <section className="py-20 px-6 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#111827] mb-6">
                Our Verification Process
              </h2>
              <p className="text-xl text-[#6b7280] mb-8">
                Every influencer goes through a rigorous five-step verification
                process before joining our platform.
              </p>
              <div className="space-y-4">
                {verificationSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-lg text-[#111827] pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="bg-white p-8 rounded-2xl border border-[#e5e7eb] shadow-lg">
                <h3 className="text-2xl font-bold text-[#111827] mb-6">
                  Why Verification Matters
                </h3>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-[#8b5cf6] flex-shrink-0 mt-0.5" />
                      <p className="text-[#111827]">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Work with Verified Influencers?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join Brandly and start collaborating with trusted, verified creators
            today.
          </p>
          <InfluButton
            variant="outline"
            size="lg"
            onClick={() => navigate("/register")}
            className="bg-white text-[#8b5cf6] hover:bg-[#f9fafb] border-white"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </InfluButton>
        </div>
      </section>
    </div>
  );
}
