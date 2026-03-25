import React from 'react';
import { useNavigate } from 'react-router-dom';
import  InfluButton  from '../components/common/InfluBtn.jsx';
import  LandingNavbar  from '../components/layout/LandingNavbar.jsx';
import { Shield,   Target, TrendingUp, Search, Star, Zap, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Search,
      title: 'Find Perfect Matches',
      description: 'Advanced search filters to discover influencers that align with your brand values and target audience.',
      color: 'bg-[#3b82f6]',
      route: '/features/find-matches',
    },
    {
      icon: Target,
      title: 'Campaign Management',
      description: 'Streamlined tools to create, manage, and track your influencer campaigns all in one place.',
      color: 'bg-[#10b981]',
      route: '/features/campaign-management',
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Monitor campaign performance with comprehensive analytics and detailed reporting dashboards.',
      color: 'bg-[#f59e0b]',
      route: '/features/analytics',
    },
    {
      icon: Shield,
      title: 'Verified Profiles',
      description: 'Work with confidence knowing all influencers are verified and authenticated by our team.',
      color: 'bg-[#8b5cf6]',
      route: '/features/verified-profiles',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      description: 'Sign up as a brand or influencer and complete your profile with your details and preferences.',
    },
    {
      number: '02',
      title: 'Connect & Discover',
      description: 'Use powerful search tools to find the perfect collaboration partners for your goals.',
    },
    {
      number: '03',
      title: 'Collaborate & Grow',
      description: 'Launch campaigns, track progress, and build lasting partnerships that drive results.',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Influencers' },
    { value: '5K+', label: 'Trusted Brands' },
    { value: '50K+', label: 'Successful Campaigns' },
    { value: '98%', label: 'Satisfaction Rate' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Fashion Influencer',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      quote: 'Brandly has transformed how I collaborate with brands. The platform is intuitive and the opportunities are endless!',
    },
    {
      name: 'Michael Chen',
      role: 'Marketing Director at TechCorp',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      quote: 'Finding the right influencers has never been easier. Brandly saved us countless hours and delivered amazing results.',
    },
    {
      name: 'Emma Davis',
      role: 'Lifestyle Creator',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      quote: 'The best platform for managing collaborations. Professional, efficient, and genuinely cares about creators.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <LandingNavbar />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 bg-gradient-to-br from-[#eff6ff] via-white to-[#f0fdf4]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#dbeafe] text-[#3b82f6] px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                Trusted by 10,000+ Creators & Brands
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#111827] mb-4 sm:mb-6 leading-tight">
                Connect Brands with Influencers
                <span className="text-[#3b82f6]"> Seamlessly</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-[#6b7280] mb-6 sm:mb-8">
                The ultimate platform for authentic brand-influencer collaborations. 
                Discover, connect, and grow your business with powerful tools and insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <InfluButton 
                  variant="primary" 
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto"
                >
                  Start Free Today
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </InfluButton>
                <InfluButton 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto"
                >
                  Sign In
                </InfluButton>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-6 sm:mt-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] border-2 border-white"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-[#f59e0b] text-[#f59e0b]" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#6b7280]">Rated 4.9/5 by users</p>
                </div>
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop"
                  alt="Team collaboration"
                  className="rounded-2xl shadow-2xl w-full"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 sm:w-64 sm:h-64 bg-[#3b82f6] rounded-2xl opacity-20 blur-3xl"></div>
              <div className="absolute -top-4 -left-4 w-32 h-32 sm:w-64 sm:h-64 bg-[#10b981] rounded-2xl opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-sm sm:text-base text-[#9ca3af]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111827] mb-3 sm:mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-[#6b7280] max-w-2xl mx-auto px-4">
              Powerful features designed to make influencer marketing simple, effective, and measurable.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={() => navigate(feature.route)}
                className="p-4 sm:p-6 rounded-2xl border border-[#e5e7eb] hover:border-[#3b82f6] hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className={`${feature.color} w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#111827] mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-[#6b7280] mb-3 sm:mb-4">{feature.description}</p>
                <div className="flex items-center text-[#3b82f6] text-sm sm:text-base font-medium group-hover:gap-2 transition-all">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 sm:mt-12">
            <InfluButton 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/features')}
              className="inline-flex"
            >
              View All Features
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </InfluButton>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111827] mb-3 sm:mb-4">
              How It Works
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-[#6b7280] max-w-2xl mx-auto px-4">
              Get started in minutes and launch your first campaign today.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#eff6ff] mb-3 sm:mb-4">{step.number}</div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-[#111827] mb-2 sm:mb-3">{step.title}</h3>
                  <p className="text-sm sm:text-base text-[#6b7280]">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-[#e5e7eb]"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111827] mb-3 sm:mb-4">
              Loved by Creators & Brands
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-[#6b7280] max-w-2xl mx-auto px-4">
              Join thousands of satisfied users who are growing their business with Brandly.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e5e7eb] shadow-sm">
                <div className="flex items-center gap-1 mb-3 sm:mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-[#f59e0b] text-[#f59e0b]" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-[#6b7280] mb-4 sm:mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm sm:text-base font-semibold text-[#111827]">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-[#6b7280]">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Ready to Transform Your Collaborations?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 px-4">
            Join Brandly today and start building meaningful partnerships that drive real results.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <InfluButton 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-white text-[#3b82f6] hover:bg-[#f9fafb] border-white w-full sm:w-auto"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </InfluButton>
            <InfluButton 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/login')}
              className="text-white border-white hover:bg-white/10 w-full sm:w-auto"
            >
              Sign In
            </InfluButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111827] text-white py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#3b82f6]" />
                <span className="text-base sm:text-lg font-bold">Brandly</span>
              </div>
              <p className="text-sm sm:text-base text-[#9ca3af]">
                Connecting brands with influencers for authentic collaborations.
              </p>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Product</h3>
              <ul className="space-y-2 text-sm sm:text-base text-[#9ca3af]">
                <li><button onClick={() => navigate('/features')} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => navigate('/case-studies')} className="hover:text-white transition-colors">Case Studies</button></li>
                <li><button onClick={() => navigate('/blog')} className="hover:text-white transition-colors">Blog</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Company</h3>
              <ul className="space-y-2 text-sm sm:text-base text-[#9ca3af]">
                <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors">About Us</button></li>
                <li><button onClick={() => navigate('/blog')} className="hover:text-white transition-colors">Blog</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Support</h3>
              <ul className="space-y-2 text-sm sm:text-base text-[#9ca3af]">
                <li><button onClick={() => navigate('/help-center')} className="hover:text-white transition-colors">Help Center</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contact Us</button></li>
                <li><button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#374151] pt-6 sm:pt-8 text-center text-xs sm:text-sm text-[#9ca3af]">
            <p>&copy; 2024 Brandly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}