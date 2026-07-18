import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNavbar from '../components/layout/LandingNavbar';
import LandingFooter from '../components/layout/LandingFooter';
import InfluButton from '../components/common/InfluBtn';
import { TrendingUp, Mail } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "Instant Payouts: Why Creator Liquidity is the New Standard",
    excerpt: "Financial friction is the silent killer of influencer campaigns. Discover how automated payment rails are...",
    image: "/images/blog/Blog Post.png",
    category: "BRAND GROWTH",
    author: "David Miller",
    authorAvatar: "/images/blog/Author.png",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Optimizing Your Profile for the AI Matchmaker",
    excerpt: "Learn how to curate your tags and portfolio to ensure you appear at the top of brand search results every single...",
    image: "/images/blog/Blog Post_1.png",
    category: "CREATOR TIPS",
    author: "Elena Rodriguez",
    authorAvatar: "/images/blog/Author_1.png",
    readTime: "12 min read",
  },
  {
    id: 3,
    title: "The Ethics of Synthetic Influencers in 2024",
    excerpt: "As virtual creators gain traction, where do we draw the line on transparency and authentic human connection?",
    image: "/images/blog/Blog Post_2.png",
    category: "AI & TECH",
    author: "Marcus Thorne",
    authorAvatar: "/images/blog/Author.png", // reusing avatar
    readTime: "10 min read",
  },
  {
    id: 4,
    title: "How 'Aura' Scaled to $10M Using 100% Micro-Influencers",
    excerpt: "A deep dive into the granular data of a breakout campaign that leveraged precision matching for massive ROI.",
    image: "/images/blog/Blog Post_3.png",
    category: "CASE STUDIES",
    author: "Jessica Wu",
    authorAvatar: "/images/blog/Author_3.png",
    readTime: "15 min read",
  },
  // Duplicates to show "Load More" working
  {
    id: 5,
    title: "The Future of B2B Influencer Marketing",
    excerpt: "Why LinkedIn creators are seeing 3x higher engagement rates than traditional ad spend in 2024.",
    image: "/images/blog/Blog Post.png",
    category: "BRAND GROWTH",
    author: "David Miller",
    authorAvatar: "/images/blog/Author.png",
    readTime: "8 min read",
  },
  {
    id: 6,
    title: "Mastering Short-Form Video Hooks",
    excerpt: "The first 3 seconds decide everything. Here are 5 hook templates that consistently go viral.",
    image: "/images/blog/Blog Post_1.png",
    category: "CREATOR TIPS",
    author: "Elena Rodriguez",
    authorAvatar: "/images/blog/Author_1.png",
    readTime: "6 min read",
  },
];

export default function BlogPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All Stories");
  
  const categories = [
    "All Stories",
    "Creator Tips",
    "Brand Growth",
    "Case Studies",
    "AI & Tech",
    "Platform News",
  ];



  const [visibleCount, setVisibleCount] = useState(4);

  const filteredPosts = useMemo(() => {
    let posts = activeCategory === "All Stories" 
      ? blogPosts 
      : blogPosts.filter(post => post.category.toLowerCase() === activeCategory.toLowerCase());
    return posts.slice(0, visibleCount);
  }, [activeCategory, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  // Reset visible count when changing categories
  React.useEffect(() => {
    setVisibleCount(4);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      {/* --- HERO SECTION: FEATURED STORY --- */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div 
            className="relative w-full rounded-[32px] overflow-hidden flex flex-col justify-end p-12 lg:p-16 aspect-[16/9] lg:aspect-[21/9]"
            style={{
              backgroundImage: `url('/images/blog/Featured Story.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
            
            <div className="relative z-10 max-w-2xl">
              <span className="inline-block bg-[#3b82f6] text-white text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
                FEATURED STORY
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Beyond Matching: How AI is Revolutionizing Influencer Selection
              </h1>
              <p className="text-lg text-white/90 mb-8 max-w-xl">
                Explore how our latest algorithmic updates are predicting brand affinity with 94% accuracy, ensuring every partnership is built on data-driven trust.
              </p>
              
              <div className="flex items-center gap-6">
                <InfluButton 
                  variant="primary" 
                  className="bg-white text-[#111827] hover:bg-[#f9fafb]"
                  onClick={() => navigate('/blog/1')}
                >
                  Read Full Story
                </InfluButton>
                <span className="text-white/80 text-sm">
                  8 min read • By Sarah Chen
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CATEGORIES --- */}
      <section className="py-6 border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-4 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${
                  activeCategory === category
                    ? "bg-[#3b82f6] text-white"
                    : "bg-[#f8fafc] text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#1e293b]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT: 2 COLUMN SPLIT --- */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Blog Grid (Span 8) */}
            <div className="lg:col-span-8">
              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                  {filteredPosts.map((post) => (
                    <article key={post.id} className="group cursor-pointer flex flex-col">
                      <div className="relative mb-6 overflow-hidden rounded-2xl aspect-[4/3] bg-[#f3f4f6]">
                        <img 
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <span className="text-xs font-bold text-[#3b82f6] mb-3 tracking-wider">
                          {post.category}
                        </span>
                        <h3 className="text-xl font-bold text-[#111827] mb-3 group-hover:text-[#3b82f6] transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-[#64748b] mb-6 line-clamp-3 text-sm leading-relaxed flex-1">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center gap-3">
                          <img src={post.authorAvatar} alt={post.author} className="w-8 h-8 rounded-full object-cover" />
                          <div className="text-sm text-[#64748b]">
                            <span className="font-semibold text-[#111827]">{post.author}</span> • {post.readTime}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center border border-dashed border-[#e5e7eb] rounded-2xl">
                  <h3 className="text-xl font-bold text-[#111827] mb-2">No articles found</h3>
                  <p className="text-[#64748b]">Check back soon for more content in this category.</p>
                </div>
              )}

              {filteredPosts.length >= visibleCount && visibleCount < blogPosts.length && (
                <div className="mt-16 text-center">
                  <button 
                    onClick={handleLoadMore}
                    className="bg-[#f8fafc] text-[#3b82f6] font-bold px-8 py-3 rounded-full hover:bg-[#f1f5f9] transition-colors"
                  >
                    Load More Articles
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Sidebar (Span 4) */}
            <div className="lg:col-span-4 space-y-10">
              
              {/* Trending Now */}
              <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
                <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-[#3b82f6]" />
                  Trending Now
                </h3>
                <div className="space-y-6">
                  {[
                    { num: "01", title: "New 'Escrow' Feature Secures Both Brands and Creators", category: "PAYMENTS" },
                    { num: "02", title: "Vertical Video Trends for Q4 2024: What's Next?", category: "STRATEGY" },
                    { num: "03", title: "The Perfect Brief: Template for 10x Response Rates", category: "COLLABORATION" },
                  ].map((trend, i) => (
                    <div key={i} className="flex gap-4 group cursor-pointer">
                      <span className="text-3xl font-bold text-[#e2e8f0] group-hover:text-[#3b82f6] transition-colors">
                        {trend.num}
                      </span>
                      <div>
                        <h4 className="font-bold text-[#111827] text-sm leading-tight mb-1 group-hover:text-[#3b82f6] transition-colors">
                          {trend.title}
                        </h4>
                        <span className="text-[10px] font-bold text-[#64748b] tracking-wider">{trend.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* The Weekly Pulse (Newsletter) */}
              <div className="bg-[#3b82f6] rounded-2xl p-8 text-white relative overflow-hidden">
                <Mail className="absolute -right-4 -top-4 w-32 h-32 text-white opacity-10" />
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">The Weekly Pulse</h3>
                  <p className="text-blue-100 text-sm leading-relaxed mb-6">
                    Join 25,000+ creators and brand managers getting the latest industry insights every Tuesday.
                  </p>
                  <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                    <input 
                      type="email" 
                      placeholder="your@email.com" 
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <button className="w-full bg-white text-[#3b82f6] font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors">
                      Subscribe Now
                    </button>
                  </form>
                  <p className="text-center text-xs text-blue-200 mt-4">
                    No spam. Only the good stuff. Unsubscribe anytime.
                  </p>
                </div>
              </div>

              {/* Expert Contributors */}
              <div className="p-2">
                <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-4">
                  EXPERT CONTRIBUTORS
                </h3>
                <div className="flex -space-x-4">
                  <img src="/images/blog/Author.png" alt="Author" className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm" />
                  <img src="/images/blog/Author_1.png" alt="Author" className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm" />
                  <img src="/images/blog/Author_3.png" alt="Author" className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm" />
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center font-bold text-sm shadow-sm z-10">
                    +12
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
