import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNavbar from '../components/layout/LandingNavbar';
import LandingFooter from '../components/layout/LandingFooter';
import InfluButton from '../components/common/InfluBtn';
import { 
  Search, Rocket, Building2, UserCircle, Banknote, Brain, 
  ArrowRight, HeadphonesIcon, MessageSquare, PlayCircle
} from 'lucide-react';

// --- DUMMY DATA FOR SEARCH ---
const DUMMY_ARTICLES = [
  { id: 1, title: 'How to setup your Creator Profile for maximum visibility', category: 'Getting Started' },
  { id: 2, title: 'Connecting your social media accounts securely', category: 'Getting Started' },
  { id: 3, title: 'Understanding the AI Matching Algorithm', category: 'AI Matching Insights' },
  { id: 4, title: 'How to interpret your Match Score', category: 'AI Matching Insights' },
  { id: 5, title: 'Best practices for reaching out to brands', category: 'For Creators' },
  { id: 6, title: 'Managing multiple brand deals at once', category: 'For Creators' },
  { id: 7, title: 'How to set up direct deposit for instant payouts', category: 'Payments & Billing' },
  { id: 8, title: 'Understanding platform fees and tax forms', category: 'Payments & Billing' },
  { id: 9, title: 'Creating an effective brand campaign brief', category: 'For Brands' },
  { id: 10, title: 'How to track ROI on your influencer campaigns', category: 'For Brands' },
  { id: 11, title: 'Inviting team members to your Brand account', category: 'For Brands' },
  { id: 12, title: 'Resolving disputes with creators', category: 'Payments & Billing' },
  { id: 13, title: 'How to pause or cancel a campaign', category: 'For Brands' },
  { id: 14, title: 'What to do if your social metrics aren\'t updating', category: 'Getting Started' },
  { id: 15, title: 'Upgrading your subscription plan', category: 'Payments & Billing' },
];

const QUICK_FILTERS = [
  { id: 'q1', title: 'How AI Matching Works?', answer: 'Our AI Matching Algorithm uses machine learning to analyze your profile metrics, past campaign performances, and audience demographics. It then compares this data against brand requirements to suggest the most optimal partnerships with the highest predicted ROI.' },
  { id: 'q2', title: 'How to get Instant Payouts?', answer: 'To enable instant payouts, go to your Account Settings > Billing & Payments. Add a verified bank account and complete the KYC process. Once approved, payments for completed campaigns will be deposited within 24 hours.' },
  { id: 'q3', title: 'Resolving disputes with brands', answer: 'If you have a disagreement regarding deliverables or payment, please open a support ticket with the campaign ID. Our moderation team will review the brief, submitted content, and communications to mediate a fair resolution within 3-5 business days.' },
  { id: 'q4', title: 'Inviting team members', answer: 'Brand accounts can invite team members by navigating to Settings > Team. Enter their email addresses and assign them roles (Admin, Editor, or Viewer). They will receive an email invitation to join your workspace.' }
];

export default function HelpCenterPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);

  // Search filter logic
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return DUMMY_ARTICLES.filter(
      article => 
        article.title.toLowerCase().includes(query) || 
        article.category.toLowerCase().includes(query)
    ).slice(0, 5); // Limit dropdown results to 5
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <LandingNavbar />

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#111827] mb-8 tracking-tight">
            How can we help you <span className="text-[#3b82f6]">grow?</span>
          </h1>
          
          <div className="relative max-w-2xl mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9ca3af] z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Search for guides, tutorials, or FAQs..."
              className="w-full pl-12 pr-32 py-4 bg-[#eff6ff] border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[#3b82f6] text-[#111827] placeholder-[#9ca3af] text-lg relative z-10"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
              <InfluButton variant="primary" className="rounded-full px-6 py-2">
                Search
              </InfluButton>
            </div>

            {/* --- SEARCH DROPDOWN --- */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#e5e7eb] overflow-hidden z-50 text-left">
                {/* Ask AI Option */}
                <div className="p-4 border-b border-[#e5e7eb] hover:bg-[#eff6ff] cursor-pointer flex items-center gap-3 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#3b82f6] to-[#a855f7] rounded-full flex items-center justify-center shrink-0">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111827]">Ask AI Support</h4>
                    <p className="text-sm text-[#6b7280]">Let our AI solve: "{searchQuery}"</p>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-auto text-[#9ca3af]" />
                </div>

                {/* Article Results */}
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Suggested Articles</div>
                    {searchResults.map(article => (
                      <div 
                        key={article.id} 
                        className="px-4 py-3 hover:bg-[#f9fafb] cursor-pointer flex items-center gap-3"
                        onClick={() => {
                          setSelectedFilter({
                            id: article.id,
                            title: article.title,
                            answer: `Detailed guide for "${article.title}". This is a placeholder for the actual article content. You can connect this to your database or CMS later.`
                          });
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                      >
                        <Search className="w-4 h-4 text-[#9ca3af]" />
                        <span className="text-[#111827] flex-1 truncate">{article.title}</span>
                        <span className="text-xs text-[#6b7280]">{article.category}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center text-[#6b7280]">
                    No articles found. Try asking the AI above!
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-sm text-[#6b7280]">
            Popular:{' '}
            <button onClick={() => setSelectedFilter(QUICK_FILTERS[0])} className="underline hover:text-[#3b82f6] mx-1">AI Matching</button>,{' '}
            <button onClick={() => setSelectedFilter(QUICK_FILTERS[1])} className="underline hover:text-[#3b82f6] mx-1">Payouts</button>,{' '}
            <button onClick={() => setSelectedFilter(QUICK_FILTERS[3])} className="underline hover:text-[#3b82f6] mx-1">Team Setup</button>
          </div>
        </div>
      </section>

      {/* --- CONTENT AREA WITH SIDEBAR --- */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          
          {/* --- SIDEBAR --- */}
          <div className="w-full md:w-72 shrink-0">
            <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 sticky top-24 shadow-sm">
              <h3 className="font-bold text-[#111827] mb-4 flex items-center gap-2">
                <Search className="w-4 h-4 text-[#3b82f6]"/> Quick Answers
              </h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setSelectedFilter(null)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${!selectedFilter ? 'bg-[#eff6ff] text-[#3b82f6]' : 'text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#111827]'}`}
                  >
                    All Help Topics
                  </button>
                </li>
                {QUICK_FILTERS.map(filter => (
                  <li key={filter.id}>
                    <button 
                      onClick={() => setSelectedFilter(filter)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${selectedFilter?.id === filter.id ? 'bg-[#eff6ff] text-[#3b82f6]' : 'text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#111827]'}`}
                    >
                      {filter.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* --- MAIN CONTENT --- */}
          <div className="flex-1">
            {selectedFilter ? (
              <div className="bg-white border border-[#e5e7eb] rounded-[24px] p-8 md:p-12 shadow-sm animate-fade-in">
                <div className="w-12 h-12 bg-[#eff6ff] rounded-xl flex items-center justify-center mb-6">
                  <Brain className="w-6 h-6 text-[#3b82f6]" />
                </div>
                <h2 className="text-3xl font-bold text-[#111827] mb-6">{selectedFilter.title}</h2>
                <div className="text-[#4b5563] leading-relaxed text-lg">
                  {selectedFilter.answer}
                </div>
                <div className="mt-12 pt-8 border-t border-[#e5e7eb] flex items-center justify-between">
                  <span className="text-[#6b7280] text-sm font-medium">Was this article helpful?</span>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-lg border border-[#e5e7eb] text-[#4b5563] text-sm font-semibold hover:bg-[#f9fafb] transition-colors">Yes</button>
                    <button className="px-4 py-2 rounded-lg border border-[#e5e7eb] text-[#4b5563] text-sm font-semibold hover:bg-[#f9fafb] transition-colors">No</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-12 w-full">
                {/* --- BENTO BOX LAYOUT --- */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
                  {/* Getting Started (Left Column - Spans 2 rows equivalent) */}
                  <div className="md:col-span-5 bg-white border border-[#e5e7eb] rounded-[24px] p-8 flex flex-col justify-between group cursor-pointer hover:shadow-lg transition-all min-h-[320px]">
                <div>
                  <div className="w-12 h-12 bg-[#eff6ff] rounded-xl flex items-center justify-center mb-6">
                    <Rocket className="w-6 h-6 text-[#3b82f6]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#111827] mb-4">Getting Started</h2>
                  <p className="text-[#6b7280] leading-relaxed">
                    Everything you need to know to set up your profile and launch your first collaboration in under 10 minutes.
                  </p>
                </div>
                <div className="mt-8 flex items-center text-[#3b82f6] font-bold gap-2">
                  Explore basics
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Brands & Creators Stack (Right Column Top) */}
              <div className="md:col-span-7 flex flex-col gap-6">
                <div className="bg-white border border-[#e5e7eb] rounded-[24px] p-6 flex items-start gap-6 cursor-pointer hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-[#f3e8ff] rounded-xl flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-[#a855f7]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#111827] mb-2">For Brands</h3>
                    <p className="text-[#6b7280]">Scale your influencer marketing with data-driven workflows.</p>
                  </div>
                </div>

                <div className="bg-white border border-[#e5e7eb] rounded-[24px] p-6 flex items-start gap-6 cursor-pointer hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-[#f1f5f9] rounded-xl flex items-center justify-center shrink-0">
                    <UserCircle className="w-6 h-6 text-[#64748b]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#111827] mb-2">For Creators</h3>
                    <p className="text-[#6b7280]">Monetize your content and manage brand deals seamlessly.</p>
                  </div>
                </div>
              </div>

              {/* Payments (Left Column Bottom) */}
              <div className="md:col-span-6 bg-white border border-[#e5e7eb] rounded-[24px] p-6 flex justify-between items-center cursor-pointer hover:shadow-md transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-[#dcfce7] rounded-xl flex items-center justify-center shrink-0">
                    <Banknote className="w-6 h-6 text-[#10b981]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#111827] mb-1">Payments & Billing</h3>
                    <p className="text-[#6b7280] text-sm">Invoices, direct deposits, and tax documentation.</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#9ca3af] group-hover:text-[#111827] group-hover:translate-x-1 transition-all shrink-0 ml-4" />
              </div>

              {/* AI Insights (Right Column Bottom) */}
              <div className="md:col-span-6 bg-[#0f172a] rounded-[24px] p-8 flex justify-between items-end relative overflow-hidden cursor-pointer hover:shadow-xl transition-all group">
                <div className="relative z-10 w-3/4">
                  <span className="inline-block bg-[#3b82f6] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                    NEW FEATURE
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">AI Matching Insights</h3>
                  <p className="text-[#94a3b8] text-sm">
                    Understand how our algorithm pairs you with the perfect partners.
                  </p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">
                  <Brain className="w-32 h-32 text-white" />
                </div>
              </div>
              </div>

              {/* --- FEATURED ARTICLES --- */}
              <div>
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-[#111827] mb-2">Featured Articles</h2>
                    <p className="text-[#6b7280]">Hand-picked guides from our editorial team to help you succeed.</p>
                  </div>
                  <button className="text-[#3b82f6] font-bold flex items-center gap-2 hover:gap-3 transition-all">
                    View all articles
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] cursor-pointer group hover:shadow-lg transition-all flex flex-col h-full">
                  <div className="aspect-video w-full bg-[#f3f4f6] relative overflow-hidden">
                    <img src="/images/help-center/AB6AXuCsSagk-Na-6dBv6_ZtGqmXay4JzzvOGm_xsj89S1HDVh4MYNz8YOMH-Kd6ZLo93BmQYl3LC1xBzAC5UZpdJOVT77PVNccd13X85xg0W1VSyfYtOcRRe2mL01SDytwRIX2BFIKxbfyA5jJ-QjJcjGFCldCQmfmiBcM0WDsnolPFzua8WNaPQSRXaI1FYx_TEFyDuctCAF8pLdLKfB2X2v1Tc8JWt7cbXr94kNcVl0ses2FyvFwi.png" alt="Algorithm" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-xs font-bold text-[#3b82f6] mb-2 uppercase tracking-wider">Algorithm</span>
                    <h3 className="font-bold text-[#111827] mb-2 line-clamp-2">How AI Matching Works</h3>
                    <p className="text-[#6b7280] text-sm line-clamp-2 flex-1">Learn the science behind our precision pairing system and how you can benefit from it.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] cursor-pointer group hover:shadow-lg transition-all flex flex-col h-full">
                  <div className="aspect-video w-full bg-[#f3f4f6] relative overflow-hidden">
                    <img src="/images/help-center/AB6AXuBMgm_2jHxUtEadyBxA55mPPNYOzpKWG7PGUvLy1sFns5IP7EMdEpqs9fyCl-4sILxYESv1iLP_WB-Dvr3nzIM5Io92FYSN2t24XVgHevKJdONrhUNq-dCkJl9f5clLMdbALEOidHi1obgbE8rz_e2MfMDDPlcY8sIXqjNX2QzzWz_XepYJN8kajQFogt5EcAdgLcEEqaBUW0tlD8Iy3-Mvb4kcL5PTslD3UygBakfP95SRhGlt.png" alt="Optimization" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-xs font-bold text-[#a855f7] mb-2 uppercase tracking-wider">Optimization</span>
                    <h3 className="font-bold text-[#111827] mb-2 line-clamp-2">Setting Up Your Creator Profile</h3>
                    <p className="text-[#6b7280] text-sm line-clamp-2 flex-1">Stand out to brands by highlighting your best content and audience demographics.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] cursor-pointer group hover:shadow-lg transition-all flex flex-col h-full">
                  <div className="aspect-video w-full bg-[#f3f4f6] relative overflow-hidden">
                    <img src="/images/help-center/AB6AXuAv00BkFsUWLT11Lvi0OT-r04LG23A20Qdnd3YLidY3zB5kkZm_Mgz0SAAVgY5KcMSZ0p3CCIp60nQdcHyGeDrtCxLhAYV6Cj3siWIWeF5-Rz8ipO54_Na-5SA4qQHC3hZ5KEmS1Ou0bc3UuhiNutqdbh9ujonowOM4Un4o9Y0mB9lhJUrAXVJ9DJ8rA_lslQAx-Lg5GZ2HV90Y2d8xWxiszsbC9cHqJ9a_ZrtxrVOMNScDaW6U.png" alt="Strategy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-xs font-bold text-[#10b981] mb-2 uppercase tracking-wider">Strategy</span>
                    <h3 className="font-bold text-[#111827] mb-2 line-clamp-2">Brand Collaboration Best Practices</h3>
                    <p className="text-[#6b7280] text-sm line-clamp-2 flex-1">Tips for long-term partnerships and professional communication.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] cursor-pointer group hover:shadow-lg transition-all flex flex-col h-full">
                  <div className="aspect-video w-full bg-[#f3f4f6] relative overflow-hidden">
                    <img src="/images/help-center/AB6AXuBAowNuKAzaBsAPexjaCDYMn_QEXlSncO_Latv8JfYrakhfooHYVlu2IzVamq9v5P5aSwKyhUxQi94XShJ2hqLwM2eLhJpuDi79qfIb8CfjsH4Jfyne31rI0orz_0SeIPnzJ3b_zeCVq8oVABcpxGrK9OCEkXHLbrF8EjKh2Ehu7fvkWzWMZgVk-NA-U8-JTy_ygt8ZpVLlXGeJLOclYlRtMkXkK-4ZNhiVUGfV8bb0UDc5TuBi.png" alt="Finance" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-xs font-bold text-[#3b82f6] mb-2 uppercase tracking-wider">Finance</span>
                    <h3 className="font-bold text-[#111827] mb-2 line-clamp-2">Secure Instant Payouts Guide</h3>
                    <p className="text-[#6b7280] text-sm line-clamp-2 flex-1">How to verify your bank details and get paid within 24 hours of completing a campaign.</p>
                  </div>
                </div>

                </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

{/* --- STILL NEED A HAND? (Footer Cards) --- */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#111827] mb-12">Still need a hand?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            
            <div className="bg-white border border-[#e5e7eb] rounded-2xl p-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-[#eff6ff] rounded-full flex items-center justify-center mb-6">
                <HeadphonesIcon className="w-8 h-8 text-[#3b82f6]" />
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-3">Contact Support</h3>
              <p className="text-[#6b7280] mb-8 text-sm leading-relaxed max-w-[200px]">
                Our dedicated team is here 24/7 to solve your complex issues.
              </p>
              <InfluButton variant="outline" className="w-full mt-auto" onClick={() => navigate('/contact')}>
                Chat with us
              </InfluButton>
            </div>

            <div className="bg-white border border-[#e5e7eb] rounded-2xl p-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-[#f3e8ff] rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="w-8 h-8 text-[#a855f7]" />
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-3">Community Forum</h3>
              <p className="text-[#6b7280] mb-8 text-sm leading-relaxed max-w-[200px]">
                Join thousands of creators and brands sharing tips and success stories.
              </p>
              <InfluButton variant="outline" className="w-full mt-auto">
                Visit Community
              </InfluButton>
            </div>

            <div className="bg-white border border-[#e5e7eb] rounded-2xl p-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-[#dcfce7] rounded-full flex items-center justify-center mb-6">
                <PlayCircle className="w-8 h-8 text-[#10b981]" />
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-3">Video Tutorials</h3>
              <p className="text-[#6b7280] mb-8 text-sm leading-relaxed max-w-[200px]">
                Visual learner? Watch our step-by-step masterclasses on YouTube.
              </p>
              <InfluButton variant="outline" className="w-full mt-auto">
                Watch Now
              </InfluButton>
            </div>

          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
