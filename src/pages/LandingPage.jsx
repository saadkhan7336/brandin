import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../components/layout/LandingNavbar.jsx";
import LandingFooter from "../components/layout/LandingFooter";
import TestimonialV2 from "../components/ui/testimonial-v2";
import { DotGlobeHero } from "../components/ui/globe-hero";
import CtaBanner from "../components/common/CtaBanner";
import { motion } from "framer-motion";
import {
  UserSearch,
  CheckCircle2,
  BrainCircuit,
  TrendingUp,
  Lock,
  Send,
  ArrowRight,
  Zap,
} from "lucide-react";

const testimonials = [
  {
    quote:
      "Brandly is a great tool for building high-performing creator campaigns. It's easy to use and has a lot of features. I've been using it for a while now and I'm really happy with the results.",
    name: "Alena Zhukova",
    role: "Software Engineer",
    avatar: "/images/landing/Img_margin-1.png",
  },
  {
    quote:
      "Finding authentic influencers used to take weeks. With Brandly's AI matching, we closed 15 creator partnerships in less than 48 hours.",
    name: "Michael Chen",
    role: "Marketing Director",
    avatar: "/images/landing/img_margin-2.png",
  },
  {
    quote:
      "The seamless escrow payments and real-time chat make running sponsorship deals completely stress-free for both creators and brands.",
    name: "Sarah Johnson",
    role: "Fashion Influencer",
    avatar: "/images/landing/Img_margin.png",
  },
  {
    quote:
      "The analytics dashboard gives us clear visibility into impression metrics and sales conversions. A game changer for digital commerce.",
    name: "David Kim",
    role: "Growth Engineer",
    avatar: "/images/landing/Img_margin-1.png",
  },
  {
    quote:
      "As a creator, receiving verified campaign proposals directly with escrow protection gives me 100% peace of mind. Highly recommended!",
    name: "Lisa Kemp",
    role: "Frontend Developer",
    avatar: "/images/landing/img_margin-2.png",
  },
  {
    quote:
      "Our marketing ROI increased by 140% in our very first month using Brandly's automated synergy matching engine.",
    name: "Marcus Vance",
    role: "Design Engineer",
    avatar: "/images/landing/Img_margin.png",
  },
];

// Live Animated Chat Simulation Component
function LiveChatPreview() {
  const [messages, setMessages] = React.useState([]);
  const [isTyping, setIsTyping] = React.useState(false);
  const [typingUser, setTypingUser] = React.useState("Sarah");
  const chatScrollRef = React.useRef(null);

  const fullConversation = React.useMemo(
    () => [
      {
        id: 1,
        sender: "creator",
        name: "Sarah Johnson",
        avatar: "/images/landing/Img_margin-1.png",
        text: "Hey Alex! I just uploaded the raw video draft for Deliverable #1 (Unboxing Reel) to our campaign workspace! 🎬",
        time: "11:15 AM",
      },
      {
        id: 2,
        sender: "brand",
        name: "Alex (Brand Lead)",
        avatar: "/images/landing/Img_margin.png",
        text: "Awesome work Sarah! Visuals look crisp. Could you just boost the background audio track slightly around 0:30? 🎧",
        time: "11:18 AM",
      },
      {
        id: 3,
        sender: "creator",
        name: "Sarah Johnson",
        avatar: "/images/landing/Img_margin-1.png",
        text: "Got it! Audio revision updated & re-submitted for approval. ✨",
        time: "11:22 AM",
      },
      {
        id: 4,
        sender: "brand",
        name: "Alex (Brand Lead)",
        avatar: "/images/landing/Img_margin.png",
        text: "Looks perfect! Deliverable approved. Releasing your $2,500 escrow milestone payout now! 💳",
        time: "11:25 AM",
      },
      {
        id: 5,
        sender: "system",
        text: "✅ Deliverable Approved — $2,500 Escrow Payout Released",
      },
    ],
    []
  );

  React.useEffect(() => {
    let timeoutIds = [];
    let currentIndex = 0;

    const playSequence = () => {
      setMessages([]);
      currentIndex = 0;

      const addNextMessage = () => {
        if (currentIndex >= fullConversation.length) {
          // Restart loop after 4 seconds pause
          timeoutIds.push(setTimeout(playSequence, 4000));
          return;
        }

        const currentMsg = fullConversation[currentIndex];

        if (currentMsg.sender === "system") {
          setIsTyping(false);
          setMessages((prev) => [...prev, currentMsg]);
          currentIndex++;
          timeoutIds.push(setTimeout(addNextMessage, 3000));
        } else {
          // Show typing indicator
          setTypingUser(currentMsg.sender === "creator" ? "Sarah" : "Alex");
          setIsTyping(true);

          timeoutIds.push(
            setTimeout(() => {
              setIsTyping(false);
              setMessages((prev) => [...prev, currentMsg]);
              currentIndex++;
              timeoutIds.push(setTimeout(addNextMessage, 1800));
            }, 1400)
          );
        }
      };

      addNextMessage();
    };

    playSequence();

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [fullConversation]);

  // Auto scroll chat to bottom when messages update
  React.useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-b border-[#f1f5f9] flex items-center justify-between bg-[#f8fafc]/60">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src="/images/landing/Img_margin-1.png"
              alt="Sarah"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-[#1e293b]">
                Sarah Johnson
              </h4>
              <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                Verified Creator
              </span>
            </div>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live Escrow Chat
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/60">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[11px] font-bold text-slate-700">Encrypted</span>
        </div>
      </div>

      {/* Dynamic Animated Chat Messages Body */}
      <div
        ref={chatScrollRef}
        className="p-5 space-y-4 bg-slate-50/40 h-[310px] overflow-y-auto scroll-smooth relative"
      >
        {messages.map((msg) => {
          if (msg.sender === "system") {
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="my-3 text-center"
              >
                <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
                  {msg.text}
                </span>
              </motion.div>
            );
          }

          const isBrand = msg.sender === "brand";

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${isBrand ? "justify-end" : "justify-start"}`}
            >
              {!isBrand && (
                <img
                  src={msg.avatar}
                  alt={msg.name}
                  className="w-7 h-7 rounded-full object-cover mt-1 flex-shrink-0"
                />
              )}
              <div
                className={`p-3.5 rounded-2xl max-w-[82%] text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isBrand
                    ? "bg-blue-600 text-white rounded-tr-xs shadow-blue-500/20"
                    : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs"
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`text-[10px] mt-1.5 block font-medium ${
                    isBrand ? "text-blue-100 text-right" : "text-slate-400"
                  }`}
                >
                  {msg.time}
                </span>
              </div>
              {isBrand && (
                <img
                  src={msg.avatar}
                  alt={msg.name}
                  className="w-7 h-7 rounded-full object-cover mt-1 flex-shrink-0"
                />
              )}
            </motion.div>
          );
        })}

        {/* Live Typing Dots Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-2 ${
              typingUser === "Alex" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="bg-white border border-slate-200/80 px-3 py-2 rounded-full shadow-sm flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500 mr-1">
                {typingUser} is typing
              </span>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Chat Footer Mock Input */}
      <div className="p-3.5 bg-white border-t border-[#f1f5f9]">
        <div className="bg-[#f1f5f9] rounded-xl p-1.5 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full hover:bg-slate-200/60 flex items-center justify-center cursor-pointer text-slate-500 transition-colors text-sm font-bold">
            +
          </div>
          <input
            type="text"
            placeholder="Type contract message..."
            className="bg-transparent flex-1 outline-none text-xs text-slate-700 placeholder-slate-400"
            readOnly
          />
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Send className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans bg-[#f9fafb]">
      <LandingNavbar />

      {/* Integrated Light Mode Interactive Particle Network Hero Section */}
      <DotGlobeHero className="pt-20 pb-10">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-8 text-center space-y-6 relative z-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-5 max-w-4xl mx-auto pointer-events-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
              The pulse of{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent font-black">
                  creator
                </span>

                {/* Animated Line with Starting Oval/Drop Node */}
                <div className="absolute -bottom-2 -left-4 sm:-left-6 right-0 flex items-center pointer-events-none">
                  {/* Sleek Non-Blinking Oval/Drop Starting Node */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="relative flex items-center justify-center flex-shrink-0 z-20"
                  >
                    <div className="w-4 h-2.5 bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.7)] border border-white/80" />
                  </motion.div>

                  {/* Left-to-Right Animated Gradient Line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: 1.3,
                      delay: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ transformOrigin: "left" }}
                    className="h-2 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-400 rounded-r-full shadow-[0_4px_14px_rgba(37,99,235,0.4)] ml-[-3px]"
                  />
                </div>
              </span>
              <br />
              commerce.
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium pt-2">
              The ultimate ecosystem where vloggers, models, and storytellers
              meet high-growth brands — on one seamless platform.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2 pointer-events-auto"
          >
            <button
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base shadow-[0_10px_30px_rgba(37,99,235,0.35)] hover:shadow-[0_15px_35px_rgba(37,99,235,0.45)] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>Join the Movement</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                const section = document.getElementById("how-it-works");
                if (section) {
                  section.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/90 hover:bg-white text-slate-800 border border-slate-300/80 rounded-xl font-bold text-base shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>How It Works</span>
            </button>
          </motion.div>
        </div>
      </DotGlobeHero>

      {/* Engineered for Accuracy Section - Redesigned & Compact */}
      <section className="py-12 bg-slate-50/70 border-b border-slate-200/50">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-8">
          <div className="text-center mb-8 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Why Brandly
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineered for Precision & Speed
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
              Replaced manual searching with algorithmic matching. Built for modern brands and creators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Feature 1: AI Synergy */}
            <div className="group relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  AI-Powered Synergy
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Proprietary algorithms match creator aesthetic, audience sentiment, and ROI history instantly.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                  99.4% Match Rate
                </span>
              </div>
            </div>

            {/* Feature 2: Real-Time ROI */}
            <div className="group relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Real-time Analytics
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Live dashboard tracking engagement, conversion funnel, clicks, and sales in real-time.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Live Metrics
                </span>
              </div>
            </div>

            {/* Feature 3: Escrow Payments */}
            <div className="group relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Secure Escrow
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Zero-friction payment protection. Funds are safely held and released upon deliverable approval.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  100% Protected
                </span>
              </div>
            </div>

            {/* Feature 4: Global Network */}
            <div className="group relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <UserSearch className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Global Creator Pool
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Access 50,000+ verified creators and storytellers across 120+ countries instantly.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  50k+ Creators
                </span>
              </div>
            </div>
          </div>

          {/* View All Features Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/features")}
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl border border-slate-300/80 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <span>Explore All Features</span>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works & Live Interactive Chat Section */}
      <section id="how-it-works" className="py-16 bg-white relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e293b] tracking-tight">
              How Brandly Works
            </h2>
            <p className="text-base sm:text-lg text-[#64748b] max-w-xl mx-auto">
              From instant discovery to verified escrow payouts — launch campaigns seamlessly.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-14">
            {/* Left: Defined Steps */}
            <div className="w-full lg:w-1/2 space-y-8">
              {/* Step 1 */}
              <div className="flex gap-5 relative group p-4 rounded-2xl transition-colors hover:bg-slate-50/80 border border-transparent hover:border-slate-100">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 font-black text-xl flex items-center justify-center border border-blue-100 shadow-sm group-hover:scale-105 transition-transform">
                    01
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#1e293b]">
                      Create Your Verified Profile
                    </h3>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-md">
                      Brand & Creator
                    </span>
                  </div>
                  <p className="text-sm text-[#64748b] leading-relaxed">
                    Set up your profile in under 2 minutes. Sync social metrics, niche preferences, and brand aesthetic guidelines effortlessly.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-5 relative group p-4 rounded-2xl transition-colors hover:bg-slate-50/80 border border-transparent hover:border-slate-100">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 font-black text-xl flex items-center justify-center border border-purple-100 shadow-sm group-hover:scale-105 transition-transform">
                    02
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#1e293b]">
                      Discover & AI Match
                    </h3>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-md">
                      Smart Synergy
                    </span>
                  </div>
                  <p className="text-sm text-[#64748b] leading-relaxed">
                    Our AI evaluates audience demographics and ROI potential to instantly recommend high-impact creator partnerships.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-5 relative group p-4 rounded-2xl transition-colors hover:bg-slate-50/80 border border-transparent hover:border-slate-100">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-black text-xl flex items-center justify-center border border-emerald-100 shadow-sm group-hover:scale-105 transition-transform">
                    03
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#1e293b]">
                      Collaborate, Revise & Payout
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                      Active Workspace
                    </span>
                  </div>
                  <p className="text-sm text-[#64748b] leading-relaxed">
                    Once matched, unlock your dedicated collaboration chat. Share campaign assets, submit video revisions, track task milestones, and release escrow payouts safely.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Live Interactive Chat Animation */}
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 via-indigo-50 to-purple-100 rounded-[2.5rem] blur-2xl opacity-70 -z-10" />
              <LiveChatPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Vertical Infinite Scroll */}
      <TestimonialV2 />

      {/* Reusable Modern CTA Banner Section */}
      <CtaBanner />

      <LandingFooter />
    </div>
  );
}
