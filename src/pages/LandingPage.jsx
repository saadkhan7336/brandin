import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNavbar from '../components/layout/LandingNavbar.jsx';
import LandingFooter from '../components/layout/LandingFooter';
import { Sparkles, UserSearch, CheckCircle2, BrainCircuit, TrendingUp, Lock, Briefcase, Smartphone, Check, Send, Star } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans bg-[#f9fafb]">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e0e7ff] text-[#1e3a8a] text-xs font-bold rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5" /> NOW LIVE
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#111827] leading-[1.05] tracking-tight mb-6">
              The pulse of <br />
              <span className="text-[#1d4ed8]">creator</span> <br />
              commerce.
            </h1>
            <p className="text-lg sm:text-xl text-[#475569] mb-8 max-w-lg leading-relaxed">
              The ultimate ecosystem where vloggers, models, and storytellers meet high-growth brands through hyper-precise AI orchestration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => navigate('/register')}
                className="bg-[#2563eb] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#1d4ed8] transition-all shadow-[0_8px_30px_rgb(37,99,235,0.3)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.5)] text-center text-sm sm:text-base"
              >
                Join the Movement
              </button>
              <button
                onClick={() => navigate('/features')}
                className="bg-[#f1f5f9] text-[#1e40af] px-8 py-3.5 rounded-xl font-semibold hover:bg-[#e2e8f0] transition-all text-center text-sm sm:text-base"
              >
                How it Works
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="/images/landing/Img_margin.png" alt="Creator" />
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="/images/landing/Img_margin-1.png" alt="Creator" />
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="/images/landing/img_margin-2.png" alt="Creator" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-[#64748b]">
                Trusted by <span className="font-bold text-[#334155]">2,500+</span> top-tier creators
              </p>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end pr-0 lg:pr-8">
            {/* Blurred background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[450px] h-[450px] bg-gradient-to-tr from-[#3b82f6]/20 via-[#8b5cf6]/20 to-transparent rounded-full blur-3xl z-0 pointer-events-none" />
            
            <img 
              src="/images/landing/Hero section Background.png" 
              alt="Creator setup with ring light" 
              className="w-full max-w-[500px] h-auto object-contain mix-blend-multiply relative z-10 right-0 lg:-right-10"
            />
            
            {/* Floating Card */}
            <div className="absolute -bottom-8 -left-4 sm:left-4 lg:-left-16 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-5 sm:p-6 w-[280px] sm:w-[320px] transform -rotate-3 z-20 border border-[#f1f5f9]">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-[#eff6ff] rounded-full flex items-center justify-center text-[#2563eb]">
                    <UserSearch className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1e293b]">Creator Match</h4>
                    <p className="text-[10px] sm:text-xs text-[#64748b]">98% Affinity Score</p>
                  </div>
                </div>
                <Sparkles className="w-5 h-5 text-[#8b5cf6]" />
              </div>
              
              {/* Skeleton lines */}
              <div className="space-y-2.5 mb-6">
                <div className="h-2.5 bg-[#f1f5f9] rounded-full w-full"></div>
                <div className="h-2.5 bg-[#f1f5f9] rounded-full w-5/6"></div>
                <div className="h-2.5 bg-[#f1f5f9] rounded-full w-4/6"></div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-shrink-0 w-12 h-10 bg-[#eff6ff] rounded-lg flex items-center justify-center text-[#2563eb] hover:bg-[#e0e7ff] transition-colors">
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <button className="flex-grow h-10 bg-[#2563eb] text-white rounded-lg text-sm font-semibold hover:bg-[#1d4ed8] transition-colors">
                  Accept Deal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engineered for Accuracy Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1e293b] mb-4">Engineered for Accuracy</h2>
            <p className="text-[#64748b] text-lg max-w-2xl mx-auto">
              We replaced manual searching with algorithmic precision. No more scrolling, just results.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1: AI-Powered Synergy (Takes up 2 columns on lg) */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-8 sm:p-10 lg:col-span-2 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-shadow duration-300 min-h-[340px]">
              {/* Text Content */}
              <div className="z-20 relative w-full md:w-1/2 md:pr-6">
                <div className="mb-6 w-14 h-14 bg-[#f8fafc] rounded-2xl border border-[#f1f5f9] flex items-center justify-center text-[#8b5cf6]">
                  <BrainCircuit className="w-7 h-7" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#1e293b] mb-4">AI-Powered Synergy</h3>
                <p className="text-[#64748b] text-base lg:text-lg leading-relaxed">
                  Our proprietary algorithm analyzes audience sentiment, historical conversion data, and brand aesthetic to find the perfect match in seconds.
                </p>
              </div>
              
              {/* Image Content */}
              <div className="w-full md:w-1/2 relative h-[200px] md:h-full md:absolute md:right-0 md:top-0 z-10 flex justify-end pointer-events-none">
                <img 
                  src="/images/landing/AI-powerd synergy.png" 
                  alt="AI Network" 
                  className="w-full h-full object-cover object-right opacity-40 mix-blend-multiply"
                  style={{ 
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 40%)', 
                    maskImage: 'linear-gradient(to right, transparent 0%, black 40%)' 
                  }}
                />
              </div>
            </div>

            {/* Card 2: Real-time ROI */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-shadow duration-300 min-h-[340px]">
              <div>
                <div className="mb-6 text-[#2563eb]">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#1e293b] mb-4">Real-time ROI</h3>
                <p className="text-[#64748b] text-base leading-relaxed mb-8">
                  Watch your campaign performance live. Track clicks, conversions, and viral reach in one dashboard.
                </p>
              </div>
              <div className="flex items-end gap-2 sm:gap-3 h-24 pt-4 mt-auto">
                <div className="w-full bg-[#3b82f6] rounded-t-md h-[40%] transition-all duration-500 hover:h-[45%]"></div>
                <div className="w-full bg-[#3b82f6] rounded-t-md h-[55%] transition-all duration-500 hover:h-[60%]"></div>
                <div className="w-full bg-[#0369a1] rounded-t-md h-[95%] transition-all duration-500 hover:h-[100%] shadow-[0_4px_20px_rgba(3,105,161,0.3)]"></div>
                <div className="w-full bg-[#3b82f6] rounded-t-md h-[50%] transition-all duration-500 hover:h-[55%]"></div>
                <div className="w-full bg-[#3b82f6] rounded-t-md h-[80%] transition-all duration-500 hover:h-[85%]"></div>
              </div>
            </div>

            {/* Card 3: Secure Payments */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-shadow duration-300 min-h-[340px]">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="w-4 h-4 text-[#475569]" />
                  <span className="text-[#475569] font-bold text-xs tracking-[0.15em] uppercase">Secure Escrow</span>
                </div>
                <h3 className="text-2xl font-bold text-[#1e293b] mb-4">Secure Payments</h3>
                <p className="text-[#64748b] text-base leading-relaxed mb-8">
                  Funds are held safely and released instantly upon content approval. Zero friction, total trust.
                </p>
              </div>
              <div className="bg-[#f8fafc] rounded-xl p-4 sm:p-5 flex items-center justify-between border border-[#e2e8f0] mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#22c55e] rounded-full flex items-center justify-center text-white">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-[#1e293b] sm:text-lg">$12,450.00</span>
                </div>
                <span className="text-[10px] sm:text-xs text-[#64748b] font-medium uppercase tracking-wide">Payout Complete</span>
              </div>
            </div>

            {/* Card 4: Global Reach (Takes up 2 columns on lg) */}
            <div className="bg-[#2a2f35] rounded-3xl p-8 sm:p-10 lg:col-span-2 relative overflow-hidden flex flex-col justify-center shadow-[0_8px_30px_rgb(0,0,0,0.15)] min-h-[340px]">
              <div className="relative z-10 max-w-md">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Global Reach, Local Impact</h3>
                <p className="text-[#94a3b8] text-base leading-relaxed mb-8">
                  Access a network of 50,000+ creators across 120 countries. Whether you're a startup or a Fortune 500, we scale with you.
                </p>
                <button className="bg-white text-[#1e293b] px-6 py-3 rounded-xl font-bold hover:bg-[#f1f5f9] transition-colors text-sm shadow-lg hover:shadow-xl">
                  Explore Network
                </button>
              </div>
              <img 
                src="/images/landing/Global reach.png" 
                alt="World Map" 
                className="absolute right-0 top-0 bottom-0 h-full w-auto object-cover opacity-50 mix-blend-screen mask-image-gradient"
                style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 30%)', maskImage: 'linear-gradient(to right, transparent, black 30%)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works & Chat Glimpse Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e293b] mb-4">How It Works</h2>
            <p className="text-lg text-[#64748b]">Get started in minutes and launch your first campaign today.</p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
            {/* Left: Steps */}
            <div className="w-full lg:w-1/2 space-y-12">
              <div className="flex gap-6 relative">
                <div className="flex-shrink-0">
                  <span className="text-5xl font-black text-[#eff6ff]">01</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1e293b] mb-2 mt-2">Create Your Profile</h3>
                  <p className="text-[#64748b] leading-relaxed">Sign up as a brand or influencer and complete your profile with your details and preferences.</p>
                </div>
              </div>
              
              <div className="flex gap-6 relative">
                <div className="flex-shrink-0">
                  <span className="text-5xl font-black text-[#eff6ff]">02</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1e293b] mb-2 mt-2">Connect & Discover</h3>
                  <p className="text-[#64748b] leading-relaxed">Use powerful search tools and our AI matching to find the perfect collaboration partners for your goals.</p>
                </div>
              </div>

              <div className="flex gap-6 relative">
                <div className="flex-shrink-0">
                  <span className="text-5xl font-black text-[#eff6ff]">03</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1e293b] mb-2 mt-2">Collaborate & Grow</h3>
                  <p className="text-[#64748b] leading-relaxed">Launch campaigns, chat in real-time, track progress, and build lasting partnerships that drive results.</p>
                </div>
              </div>
            </div>

            {/* Right: Real-time Chat Mockup */}
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-purple-50 rounded-[2.5rem] blur-2xl opacity-60 -z-10"></div>
              
              <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden">
                {/* Chat Header */}
                <div className="p-5 border-b border-[#f1f5f9] flex items-center justify-between bg-[#f8fafc]/50">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src="/images/landing/Img_margin-1.png" alt="Sarah" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1e293b]">Sarah Johnson</h4>
                      <p className="text-xs text-green-600 font-medium">Online now</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center shadow-sm">
                      <div className="w-1 h-1 bg-[#64748b] rounded-full mx-[1px]"></div>
                      <div className="w-1 h-1 bg-[#64748b] rounded-full mx-[1px]"></div>
                      <div className="w-1 h-1 bg-[#64748b] rounded-full mx-[1px]"></div>
                    </div>
                  </div>
                </div>
                
                {/* Chat Messages */}
                <div className="p-6 space-y-6 bg-[#f8fafc]/30 h-[280px] overflow-hidden relative">
                  {/* Message 1 */}
                  <div className="flex gap-4">
                    <img src="/images/landing/Img_margin-1.png" alt="Sarah" className="w-8 h-8 rounded-full object-cover mt-1 flex-shrink-0" />
                    <div className="bg-white border border-[#e2e8f0] p-4 rounded-2xl rounded-tl-sm shadow-sm max-w-[85%]">
                      <p className="text-sm text-[#334155]">Hi! I reviewed the campaign brief and I absolutely love the concept. The aesthetic perfectly matches my feed! ✨</p>
                      <span className="text-[10px] text-[#94a3b8] mt-2 block">10:42 AM</span>
                    </div>
                  </div>
                  
                  {/* Message 2 */}
                  <div className="flex gap-4 justify-end">
                    <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-sm shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] max-w-[85%] text-white">
                      <p className="text-sm">That's fantastic to hear, Sarah! We think you'd be the perfect fit for this launch. Are you available to shoot this weekend?</p>
                      <span className="text-[10px] text-blue-200 mt-2 block text-right">10:45 AM</span>
                    </div>
                  </div>
                  
                  {/* Typing indicator */}
                  <div className="flex gap-4 items-center">
                    <img src="/images/landing/Img_margin-1.png" alt="Sarah" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    <div className="bg-white border border-[#e2e8f0] py-3 px-4 rounded-full shadow-sm flex gap-1.5 items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                  
                  {/* Fade out bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent"></div>
                </div>
                
                {/* Chat Input */}
                <div className="p-4 bg-white border-t border-[#f1f5f9]">
                  <div className="bg-[#f1f5f9] rounded-xl p-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full hover:bg-[#e2e8f0] flex items-center justify-center cursor-pointer text-[#64748b] transition-colors">
                      <span className="text-lg">+</span>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Type your message..." 
                      className="bg-transparent flex-1 outline-none text-sm text-[#334155] placeholder-[#94a3b8]"
                      readOnly
                    />
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm cursor-pointer hover:bg-blue-700 transition-colors">
                      <Send className="w-4 h-4 ml-[-2px]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f8fafc] border-t border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e293b] mb-4">Loved by Creators & Brands</h2>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto">Join thousands of satisfied users who are growing their business with Brandly.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-3xl p-8 border border-[#e2e8f0] shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300">
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-[#f59e0b] text-[#f59e0b]" />
                ))}
              </div>
              <p className="text-[#334155] italic leading-relaxed mb-8">
                "Brandly has transformed how I collaborate with brands. The platform is intuitive and the opportunities are endless!"
              </p>
              <div className="flex items-center gap-4">
                <img src="/images/landing/Img_margin-1.png" alt="Sarah Johnson" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-[#1e293b] text-sm">Sarah Johnson</h4>
                  <p className="text-[#64748b] text-xs">Fashion Influencer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-3xl p-8 border border-[#e2e8f0] shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300">
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-[#f59e0b] text-[#f59e0b]" />
                ))}
              </div>
              <p className="text-[#334155] italic leading-relaxed mb-8">
                "Finding the right influencers has never been easier. Brandly saved us countless hours and delivered amazing results."
              </p>
              <div className="flex items-center gap-4">
                <img src="/images/landing/img_margin-2.png" alt="Michael Chen" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-[#1e293b] text-sm">Michael Chen</h4>
                  <p className="text-[#64748b] text-xs">Marketing Director at TechCorp</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-3xl p-8 border border-[#e2e8f0] shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300">
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-[#f59e0b] text-[#f59e0b]" />
                ))}
              </div>
              <p className="text-[#334155] italic leading-relaxed mb-8">
                "The best platform for managing collaborations. Professional, efficient, and genuinely cares about creators."
              </p>
              <div className="flex items-center gap-4">
                <img src="/images/landing/Img_margin.png" alt="Emma Davis" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-[#1e293b] text-sm">Emma Davis</h4>
                  <p className="text-[#64748b] text-xs">Lifestyle Creator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f8fafc] flex justify-center">
        <div className="max-w-4xl w-full bg-white rounded-[2rem] p-12 md:p-20 text-center shadow-xl border border-[#f1f5f9]">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#111827] mb-6">
            Ready to revolutionize <br /> your reach?
          </h2>
          <p className="text-lg text-[#64748b] mb-10 max-w-xl mx-auto">
            Join thousands of brands and creators already using Brandly to define the future of commerce.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/register')}
              className="bg-[#2563eb] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#1d4ed8] transition-all"
            >
              Join the Movement
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="bg-white text-[#1e293b] border border-[#cbd5e1] px-8 py-4 rounded-xl font-semibold hover:bg-[#f8fafc] transition-all shadow-sm"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}