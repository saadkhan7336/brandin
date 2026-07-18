import React from "react";
import { useParams, Link } from "react-router-dom";
import LandingNavbar from "../components/layout/LandingNavbar";
import LandingFooter from "../components/layout/LandingFooter";
import { ArrowLeft, BarChart3, TrendingUp, Users } from "lucide-react";

export default function CaseStudyDetail() {
  const { id } = useParams();

  // In a real app, you would fetch the case study data based on the ID.
  // We use dummy data for now.
  const caseStudy = {
    title: "Disrupting Fintech through Lifestyle Storytelling",
    client: "The Neobank Experience",
    heroImage: "/images/case-studies/Neobank Interface.png",
    metrics: [
      { label: "CUSTOMER ROI", value: "14.2x", icon: <TrendingUp className="w-5 h-5 text-blue-500" /> },
      { label: "TOTAL REACH", value: "1.2M", icon: <Users className="w-5 h-5 text-blue-500" /> },
      { label: "ENGAGEMENT", value: "840k", icon: <BarChart3 className="w-5 h-5 text-blue-500" /> },
    ],
    content: [
      {
        heading: "The Challenge",
        text: "To scale their user base, the client needed to move beyond typical financial influencers. They wanted to connect with audiences on a deeper, lifestyle-oriented level, showing how their neobank fits seamlessly into everyday life."
      },
      {
        heading: "Our Approach",
        text: "Our Digital Curator AI identified 'lifestyle tech' creators whose audiences were ready for a frictionless banking revolution. We didn't just look for high follower counts; we analyzed aesthetic compatibility, audience sentiment, and authentic engagement."
      },
      {
        heading: "The Results",
        text: "The campaign dramatically outperformed expectations, driving a 14.2x ROI. By treating financial services as a lifestyle enabler rather than just a utility, the content resonated profoundly, leading to massive reach and unprecedented engagement rates."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans selection:bg-blue-100">
      <LandingNavbar />
      
      <main className="pt-24 lg:pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <Link to="/case-studies" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to all Case Studies
        </Link>
        
        <header className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-6">
            <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase">Client Spotlight</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0f172a] leading-tight tracking-tight mb-6">
            {caseStudy.title}
          </h1>
          <p className="text-xl text-gray-500 font-medium">
            {caseStudy.client}
          </p>
        </header>

        <div className="rounded-3xl overflow-hidden shadow-2xl mb-16 aspect-[16/9] bg-gray-100 border border-gray-200">
          <img 
            src={caseStudy.heroImage} 
            alt={caseStudy.title} 
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {caseStudy.metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
               <div className="p-3 bg-blue-50 rounded-xl">
                 {metric.icon}
               </div>
               <div>
                 <p className="text-3xl font-black text-[#0f172a] mb-1">{metric.value}</p>
                 <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">{metric.label}</p>
               </div>
            </div>
          ))}
        </div>

        <article className="prose prose-lg prose-slate max-w-none">
          {caseStudy.content.map((section, index) => (
            <div key={index} className="mb-12">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">{section.heading}</h2>
              <p className="text-gray-600 leading-relaxed">{section.text}</p>
            </div>
          ))}
        </article>
      </main>

      <LandingFooter />
    </div>
  );
}
