import React, { useState, useEffect } from "react";
import LandingNavbar from "./LandingNavbar";
import LandingFooter from "./LandingFooter";
import { useNavigate } from "react-router-dom";

export default function LegalLayout({ 
  titleBlack, 
  titleBlue, 
  description, 
  lastUpdated, 
  sections, 
  children 
}) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "");
  const navigate = useNavigate();

  // Handle scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(s => document.getElementById(s.id));
      let currentActive = sections[0]?.id;
      
      for (const el of sectionElements) {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            currentActive = el.id;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col font-sans">
      <LandingNavbar />

      <main className="flex-grow pt-32 pb-24 px-6 max-w-[1400px] w-full mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-32 h-fit">
          <div className="hidden lg:block mb-6">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">Sections</h3>
            <nav className="space-y-1">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? "bg-white text-blue-600 shadow-sm border border-gray-100" 
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                    }`}
                  >
                    <section.icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="hidden lg:block mt-12 text-xs text-gray-400">
            <p className="font-medium mb-1">Last updated:</p>
            <p className="font-bold text-gray-500">{lastUpdated}</p>
          </div>
        </aside>

        {/* Right Content */}
        <div className="flex-1 max-w-3xl">
          <header className="mb-16">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              <span className="text-[#0f172a] block">{titleBlack}</span>
              <span className="text-blue-600 block">{titleBlue}</span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl">
              {description}
            </p>
          </header>

          {/* Main Cards Content */}
          <div className="space-y-8">
            {children}
          </div>

          {/* Global CTA Bottom */}
          <div className="mt-16 bg-blue-600 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-blue-600/20">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-3">Have questions?</h2>
              <p className="text-blue-100 text-lg max-w-md">
                Our legal and support teams are here to clarify any aspect of how your data is handled.
              </p>
            </div>
            <button 
              onClick={() => navigate('/contact')}
              className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
            >
              Contact Legal Team
            </button>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
