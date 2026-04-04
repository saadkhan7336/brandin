import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNavbar from '../components/layout/LandingNavbar';
import InfluButton  from '../components/common/InfluBtn';
import { Search, BookOpen, Video, FileText, Settings, Users, CreditCard, Shield, MessageSquare, TrendingUp, HelpCircle, ChevronRight } from 'lucide-react';

export default function HelpCenterPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    {
      icon: Users,
      title: 'Getting Started',
      description: 'Learn the basics of using Brandly',
      articles: 12,
      color: 'bg-[#eff6ff]',
      iconColor: 'text-[#3b82f6]',
    },
    {
      icon: Search,
      title: 'Finding Influencers',
      description: 'Search and discover perfect matches',
      articles: 8,
      color: 'bg-[#f0fdf4]',
      iconColor: 'text-[#10b981]',
    },
    {
      icon: TrendingUp,
      title: 'Campaign Management',
      description: 'Create and manage your campaigns',
      articles: 15,
      color: 'bg-[#fef3c7]',
      iconColor: 'text-[#f59e0b]',
    },
    {
      icon: CreditCard,
      title: 'Billing & Payments',
      description: 'Pricing, invoices, and transactions',
      articles: 10,
      color: 'bg-[#fae8ff]',
      iconColor: 'text-[#8b5cf6]',
    },
    {
      icon: Shield,
      title: 'Account & Security',
      description: 'Manage your profile and privacy',
      articles: 7,
      color: 'bg-[#fef2f2]',
      iconColor: 'text-[#ef4444]',
    },
    {
      icon: Settings,
      title: 'Settings & Features',
      description: 'Customize your experience',
      articles: 9,
      color: 'bg-[#f1f5f9]',
      iconColor: 'text-[#64748b]',
    },
  ];

  const popularArticles = [
    {
      title: 'How to create your first campaign',
      category: 'Getting Started',
      views: '5.2K views',
    },
    {
      title: 'Understanding influencer metrics and analytics',
      category: 'Campaign Management',
      views: '4.8K views',
    },
    {
      title: 'How to search for influencers using filters',
      category: 'Finding Influencers',
      views: '4.5K views',
    },
    {
      title: 'Setting up your payment method',
      category: 'Billing & Payments',
      views: '3.9K views',
    },
    {
      title: 'Getting verified on Brandly',
      category: 'Account & Security',
      views: '3.6K views',
    },
  ];

  const videoTutorials = [
    {
      title: 'Platform Overview & Quick Start Guide',
      duration: '5:32',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop',
    },
    {
      title: 'How to Find the Perfect Influencer',
      duration: '8:15',
      thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop',
    },
    {
      title: 'Creating Your First Campaign',
      duration: '12:40',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      {/* Hero Section with Search */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#eff6ff] to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3b82f6] rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-[#111827] mb-6">
            How can we help you?
          </h1>
          <p className="text-xl text-[#6b7280] mb-8">
            Search our knowledge base or browse categories below
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for articles, guides, and tutorials..."
              className="w-full pl-12 pr-4 py-4 border border-[#e5e7eb] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent text-lg"
            />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#111827] mb-12 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category.title)}
                className="p-6 bg-white border border-[#e5e7eb] rounded-xl hover:shadow-lg transition-all text-left group"
              >
                <div className={`${category.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className={`w-7 h-7 ${category.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-2 flex items-center justify-between">
                  {category.title}
                  <ChevronRight className="w-5 h-5 text-[#6b7280] group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-[#6b7280] mb-3">{category.description}</p>
                <p className="text-sm text-[#3b82f6] font-medium">{category.articles} articles</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20 px-6 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Articles List */}
            <div>
              <h2 className="text-3xl font-bold text-[#111827] mb-8">
                Popular Articles
              </h2>
              <div className="space-y-4">
                {popularArticles.map((article, index) => (
                  <button
                    key={index}
                    className="w-full p-4 bg-white border border-[#e5e7eb] rounded-xl hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#111827] mb-2 group-hover:text-[#3b82f6] transition-colors">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-[#6b7280]">
                          <span className="text-[#3b82f6]">{article.category}</span>
                          <span>•</span>
                          <span>{article.views}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#6b7280] flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Video Tutorials */}
            <div>
              <h2 className="text-3xl font-bold text-[#111827] mb-8 flex items-center gap-2">
                <Video className="w-7 h-7 text-[#3b82f6]" />
                Video Tutorials
              </h2>
              <div className="space-y-4">
                {videoTutorials.map((video, index) => (
                  <button
                    key={index}
                    className="w-full bg-white border border-[#e5e7eb] rounded-xl overflow-hidden hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-40 h-24 flex-shrink-0">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                            <div className="w-0 h-0 border-t-6 border-t-transparent border-l-10 border-l-[#3b82f6] border-b-6 border-b-transparent ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="flex-1 text-left p-4">
                        <h3 className="font-semibold text-[#111827] group-hover:text-[#3b82f6] transition-colors">
                          {video.title}
                        </h3>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#eff6ff] rounded-2xl">
              <BookOpen className="w-10 h-10 text-[#3b82f6] mb-4" />
              <h3 className="text-xl font-bold text-[#111827] mb-3">
                Documentation
              </h3>
              <p className="text-[#6b7280] mb-4">
                Detailed guides and API documentation for developers
              </p>
              <button className="text-[#3b82f6] font-medium flex items-center gap-2 hover:gap-3 transition-all">
                View Docs
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 bg-[#f0fdf4] rounded-2xl">
              <MessageSquare className="w-10 h-10 text-[#10b981] mb-4" />
              <h3 className="text-xl font-bold text-[#111827] mb-3">
                Community Forum
              </h3>
              <p className="text-[#6b7280] mb-4">
                Connect with other users and share experiences
              </p>
              <button className="text-[#10b981] font-medium flex items-center gap-2 hover:gap-3 transition-all">
                Join Forum
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 bg-[#fef3c7] rounded-2xl">
              <FileText className="w-10 h-10 text-[#f59e0b] mb-4" />
              <h3 className="text-xl font-bold text-[#111827] mb-3">
                API Reference
              </h3>
              <p className="text-[#6b7280] mb-4">
                Technical documentation for integrations
              </p>
              <button className="text-[#f59e0b] font-medium flex items-center gap-2 hover:gap-3 transition-all">
                Explore API
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6]">
        <div className="max-w-4xl mx-auto text-center">
          <MessageSquare className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">
            Still Need Help?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Our support team is here to assist you 24/7
          </p>
          <div className="flex items-center justify-center gap-4">
            <InfluButton 
              variant="outline"
              size="lg"
              onClick={() => navigate('/contact')}
              className="bg-white text-[#3b82f6] hover:bg-[#f9fafb] border-white"
            >
              Contact Support
            </InfluButton>
            <InfluButton 
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              Live Chat
            </InfluButton>
          </div>
        </div>
      </section>

      {/* Footer (Simplified) */}
      <footer className="py-12 border-t border-[#e5e7eb] px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#3b82f6]" />
            <span className="text-xl font-bold text-[#111827]">Brandly</span>
          </div>
          <div className="text-[#6b7280] text-sm">&copy; 2024 Brandly. All rights reserved.</div>
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
