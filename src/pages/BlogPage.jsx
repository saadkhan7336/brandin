import React from "react";
import LandingNavbar from "../components/layout/LandingNavbar";
import InfluButton from "../components/common/InfluBtn";
import { Search, Calendar, User, ArrowRight, Shield } from "lucide-react";

export default function BlogPage() {
  const categories = [
    "All",
    "Influencer Tips",
    "Brand Strategy",
    "Case Studies",
    "Market Trends",
    "Platform Updates",
  ];

  const blogPosts = [
    {
      id: 1,
      title: "How to Build a Strong Influencer-Brand Partnership",
      excerpt:
        "Discover the key strategies for creating long-lasting and successful collaborations that benefit both parties.",
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop",
      category: "Brand Strategy",
      author: "Emma Wilson",
      date: "Mar 15, 2024",
    },
    {
      id: 2,
      title: "The Rise of Micro-Influencers in 2024",
      excerpt:
        "Why small audiences are delivering big results for brands in the current social media landscape.",
      image:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop",
      category: "Market Trends",
      author: "David Chen",
      date: "Mar 12, 2024",
    },
    {
      id: 3,
      title: "10 Essential Tools for Every Content Creator",
      excerpt:
        "Boost your productivity and content quality with these must-have tools for modern influencers.",
      image:
        "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=800&h=600&fit=crop",
      category: "Influencer Tips",
      author: "Sophie Miller",
      date: "Mar 10, 2024",
    },
    {
      id: 4,
      title: "Measuring ROI in Influencer Marketing",
      excerpt:
        "Learn how to accurately track and measure the success of your influencer campaigns.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      category: "Brand Strategy",
      author: "James Taylor",
      date: "Mar 8, 2024",
    },
    {
      id: 5,
      title: "Content Creation: From Idea to Viral Success",
      excerpt:
        "A step-by-step guide to creating engaging content that resonates with your audience.",
      image:
        "https://images.unsplash.com/photo-1496065187758-c818805aefe3?w=800&h=600&fit=crop",
      category: "Influencer Tips",
      author: "Alex Rivera",
      date: "Mar 5, 2024",
    },
    {
      id: 6,
      title: "Platform Spotlight: Maximizing Your Reach",
      excerpt:
        "Tips and tricks for mastering different social media platforms to grow your influence.",
      image:
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
      category: "Platform Updates",
      author: "Sarah Johnson",
      date: "Mar 2, 2024",
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
            Brandly Blog
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-[#111827] mb-6">
            Insights for the <br />
            <span className="text-[#3b82f6]">Modern Creator Economy</span>
          </h1>
          <p className="text-xl text-[#6b7280] max-w-2xl mx-auto mb-10">
            Expert advice, industry trends, and success stories to help you
            navigate the world of influencer marketing.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af] w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-full lg:w-1/2">
              <img
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                className="w-full h-[400px] object-cover rounded-2xl shadow-xl"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <div className="text-sm font-bold text-[#3b82f6] mb-4 uppercase tracking-wider">
                Featured Post
              </div>
              <h2 className="text-4xl font-bold text-[#111827] mb-6 leading-tight">
                {blogPosts[0].title}
              </h2>
              <p className="text-xl text-[#6b7280] mb-8">
                {blogPosts[0].excerpt}
              </p>
              <div className="flex items-center gap-6 mb-8 text-[#6b7280]">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{blogPosts[0].author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{blogPosts[0].date}</span>
                </div>
              </div>
              <InfluButton variant="primary" size="lg" onClick={() => {}}>
                Read More
                <ArrowRight className="w-5 h-5 ml-2" />
              </InfluButton>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 border-y border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
          <div className="flex items-center justify-between gap-4 min-w-max">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  index === 0
                    ? "bg-[#3b82f6] text-white"
                    : "text-[#6b7280] hover:bg-[#f3f4f6]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {blogPosts.map((post) => (
              <article key={post.id} className="group cursor-pointer">
                <div className="relative mb-6 overflow-hidden rounded-2xl aspect-[16/9]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-bold text-[#3b82f6]">
                    {post.category}
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4 text-[#6b7280] text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <div className="w-1 h-1 bg-[#d1d5db] rounded-full"></div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#111827] mb-4 group-hover:text-[#3b82f6] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-[#6b7280] mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-[#3b82f6] font-bold gap-2">
                  Read More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-20">
            <InfluButton variant="outline" size="lg">
              Load More Posts
            </InfluButton>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-6 bg-[#111827]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Stay Ahead of the Curve
          </h2>
          <p className="text-xl text-[#9ca3af] mb-10">
            Subscribe to our newsletter for the latest influencer marketing
            insights delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
            />
            <InfluButton
              variant="primary"
              size="lg"
              className="whitespace-nowrap"
            >
              Subscribe Now
            </InfluButton>
          </form>
          <p className="text-sm text-[#4b5563] mt-6">
            By subscribing, you agree to our Privacy Policy and Terms of
            Service.
          </p>
        </div>
      </section>

      {/* Footer (Simplified) */}
      <footer className="py-12 border-t border-[#e5e7eb] px-6">
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
            <button className="hover:text-[#3b82f6]">Twitter</button>
            <button className="hover:text-[#3b82f6]">LinkedIn</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
