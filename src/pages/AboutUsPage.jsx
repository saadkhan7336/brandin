import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingNavbar } from '../components/layout/LandingNavbar';
import { InfluButton } from '../components/common/InfluButton';
import { Shield, Target, Users, Heart, Zap, Globe, TrendingUp, Award, CheckCircle, ArrowRight, Search } from 'lucide-react';

export default function AboutUsPage() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Heart,
      title: 'Authenticity First',
      description: 'We believe in genuine connections that create meaningful partnerships between brands and influencers.',
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Every profile is verified to ensure secure and reliable collaborations for all our users.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We continuously improve our platform with cutting-edge features to simplify influencer marketing.',
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Connecting creators and brands worldwide to build partnerships without boundaries.',
    },
  ];

  const whatWeOffer = [
    {
      title: 'For Brands',
      description: 'Find the perfect influencers to amplify your message',
      features: [
        'Advanced search filters to discover ideal matches',
        'Campaign management tools for seamless collaboration',
        'Real-time analytics to track performance',
        'Verified influencer profiles for peace of mind',
      ],
      icon: Target,
      color: 'from-[#3b82f6] to-[#2563eb]',
    },
    {
      title: 'For Influencers',
      description: 'Connect with brands that align with your values',
      features: [
        'Access to thousands of collaboration opportunities',
        'Profile verification to build credibility',
        'Easy communication and negotiation tools',
        'Payment protection and transparent processes',
      ],
      icon: Users,
      color: 'from-[#10b981] to-[#059669]',
    },
  ];

  const whyBrandly = [
    {
      title: 'Simplified Discovery',
      description: 'Traditional influencer marketing is time-consuming and inefficient. Brandly uses smart algorithms to match brands with the right influencers instantly.',
      icon: Search,
    },
    {
      title: 'Complete Transparency',
      description: 'No hidden fees, no surprises. We provide clear pricing, verified metrics, and honest reviews so you can make informed decisions.',
      icon: CheckCircle,
    },
    {
      title: 'All-in-One Platform',
      description: 'From discovery to payment, manage your entire influencer marketing workflow in one place. No need for multiple tools or spreadsheets.',
      icon: Zap,
    },
    {
      title: 'Data-Driven Insights',
      description: 'Make decisions backed by real-time analytics and performance metrics. Track ROI, engagement, and campaign success effortlessly.',
      icon: TrendingUp,
    },
    {
      title: 'Verified Community',
      description: 'Work with confidence knowing every user is verified. Our rigorous authentication process ensures quality and authenticity.',
      icon: Award,
    },
    {
      title: 'Built for Scale',
      description: 'Whether you\'re running one campaign or managing hundreds, Brandly scales with your needs without compromising on quality.',
      icon: Globe,
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Active Influencers' },
    { value: '5,000+', label: 'Trusted Brands' },
    { value: '50,000+', label: 'Successful Campaigns' },
    { value: '98%', label: 'Satisfaction Rate' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#eff6ff] via-white to-[#f0fdf4]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#dbeafe] text-[#3b82f6] px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                About Brandly
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-[#111827] mb-6 leading-tight">
                Revolutionizing
                <span className="text-[#3b82f6]"> Influencer Marketing</span>
              </h1>
              <p className="text-xl text-[#6b7280] mb-8 leading-relaxed">
                We're on a mission to make influencer marketing accessible, transparent, and effective for everyone. 
                Brandly bridges the gap between brands and creators, fostering authentic partnerships that drive real results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <InfluButton variant="primary" size="lg" onClick={() => navigate('/register')}>
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </InfluButton>
                <InfluButton variant="outline" size="lg" onClick={() => navigate('/contact')}>
                  Contact Us
                </InfluButton>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                alt="Team collaboration"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 w-64 h-64 bg-[#3b82f6] rounded-2xl opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-[#9ca3af]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is Brandly */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111827] mb-6">
              What is Brandly?
            </h2>
            <p className="text-xl text-[#6b7280] leading-relaxed">
              Brandly is an all-in-one influencer marketing platform that connects brands with authentic creators. 
              We provide the tools, insights, and security needed to build successful partnerships that drive engagement, 
              increase brand awareness, and deliver measurable ROI.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-br from-[#eff6ff] to-white p-8 rounded-2xl border border-[#e5e7eb]">
              <h3 className="text-2xl font-bold text-[#111827] mb-4">Our Mission</h3>
              <p className="text-[#6b7280] text-lg leading-relaxed">
                To democratize influencer marketing by creating a transparent, efficient, and accessible platform where 
                brands of all sizes can connect with creators who share their values and vision. We believe that authentic 
                storytelling drives real results, and we're here to make those connections happen.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#f0fdf4] to-white p-8 rounded-2xl border border-[#e5e7eb]">
              <h3 className="text-2xl font-bold text-[#111827] mb-4">Our Vision</h3>
              <p className="text-[#6b7280] text-lg leading-relaxed">
                To become the world's most trusted influencer marketing platform, where every brand can find their 
                perfect creator match, and every influencer can access meaningful opportunities that align with their 
                personal brand and values.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Brandly */}
      <section className="py-20 px-6 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111827] mb-6">
              What Makes Brandly Different?
            </h2>
            <p className="text-xl text-[#6b7280] max-w-3xl mx-auto">
              We're not just another marketplace. Brandly brings innovation, transparency, and 
              authenticity to influencer marketing in ways that traditional platforms can't match.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyBrandly.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-[#e5e7eb] hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-[#eff6ff] rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-[#3b82f6]" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">{item.title}</h3>
                <p className="text-[#6b7280] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111827] mb-6">
              Built for Both Brands & Influencers
            </h2>
            <p className="text-xl text-[#6b7280]">
              Powerful features designed to meet the needs of everyone in the influencer marketing ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {whatWeOffer.map((offer, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden hover:shadow-xl transition-all"
              >
                <div className={`bg-gradient-to-r ${offer.color} p-8 text-white`}>
                  <offer.icon className="w-12 h-12 mb-4" />
                  <h3 className="text-3xl font-bold mb-2">{offer.title}</h3>
                  <p className="text-white/90 text-lg">{offer.description}</p>
                </div>
                <div className="p-8">
                  <ul className="space-y-4">
                    {offer.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-[#10b981] flex-shrink-0 mt-0.5" />
                        <span className="text-[#6b7280]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-6 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111827] mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-[#6b7280]">
              The principles that guide everything we do at Brandly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl text-center border border-[#e5e7eb] hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">{value.title}</h3>
                <p className="text-[#6b7280]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Join the Brandly Community Today
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Whether you're a brand looking for influencers or a creator seeking opportunities, 
            Brandly is the platform that brings your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <InfluButton 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-white text-[#3b82f6] hover:bg-[#f9fafb] border-white"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </InfluButton>
            <InfluButton 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/contact')}
              className="text-white border-white hover:bg-white/10"
            >
              Contact Us
            </InfluButton>
          </div>
        </div>
      </section>
    </div>
  );
}