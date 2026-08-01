import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function CtaBanner({
  badgeText = "GROW YOUR CAMPAIGNS & REVENUE",
  title = "Stop Managing Spreadsheets.",
  highlightTitle = "Start Scaling Deals.",
  description = "Join 2,500+ creators and brands closing verified collaborations with zero friction, instant escrow protection, and 10x faster execution.",
  primaryBtnText = "Get Started Free",
  primaryBtnLink = "/register",
  secondaryBtnText = "Explore Solutions",
  secondaryBtnLink = "/solutions",
  className = "",
}) {
  const navigate = useNavigate();

  return (
    <section className={`py-12 bg-slate-50/70 flex justify-center px-6 sm:px-8 border-t border-slate-200/60 ${className}`}>
      <div className="max-w-[1100px] w-full mx-auto">
        <div className="relative bg-slate-900 rounded-3xl p-8 sm:p-12 text-center overflow-hidden border border-slate-800 shadow-xl">
          
          {/* Ambient Background Lighting */}
          <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[320px] h-[320px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/3" />

          {/* Foreground Card Content */}
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            
            {/* Top Badge */}
            {badgeText && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-400/20 text-[11px] font-extrabold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>{badgeText}</span>
              </div>
            )}

            {/* Main Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug">
              <span className="block mb-2">{title}</span>
              {highlightTitle && (
                <span className="inline-block bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent font-black">
                  {highlightTitle}
                </span>
              )}
            </h2>

            {/* Description */}
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium pt-1">
              {description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-3">
              <button
                onClick={() => navigate(primaryBtnLink)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm tracking-wide shadow-[0_8px_20px_rgba(37,99,235,0.35)] hover:shadow-[0_12px_25px_rgba(37,99,235,0.45)] transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span className="tracking-wide">{primaryBtnText}</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              {secondaryBtnText && (
                <button
                  onClick={() => navigate(secondaryBtnLink)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl font-bold text-sm tracking-wide shadow-sm hover:shadow transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="tracking-wide">{secondaryBtnText}</span>
                </button>
              )}
            </div>

            {/* Trust Footer */}
            <div className="pt-2 flex items-center justify-center gap-4 text-slate-400 text-[11px] font-semibold">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>100% Escrow Protection</span>
              </div>
              <div className="w-1 h-1 bg-slate-700 rounded-full" />
              <span>Verified Profiles Only</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
