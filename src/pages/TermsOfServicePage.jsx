import React from "react";
import { FileText, Users, DollarSign, AlertCircle, ArrowRight } from "lucide-react";
import LegalLayout from "../components/layout/LegalLayout";

export default function TermsOfServicePage() {
  const sections = [
    { id: "user-conduct", label: "User Conduct", icon: Users },
    { id: "content-ownership", label: "Content Ownership", icon: FileText },
    { id: "fees-payments", label: "Fees & Payments", icon: DollarSign },
    { id: "termination", label: "Termination", icon: AlertCircle },
  ];

  return (
    <LegalLayout
      titleBlack="Terms of Service,"
      titleBlue="Clearly Defined."
      description="These Terms of Service govern your use of the Brandly platform. We believe in clear, fair rules that protect both creators and brands while fostering successful collaborations."
      lastUpdated="October 24, 2024"
      sections={sections}
    >
      {/* 1. User Conduct */}
      <section id="user-conduct" className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100 scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#0f172a]">User Conduct</h2>
        </div>
        
        <p className="text-gray-500 leading-relaxed mb-8">
          By joining Brandly, you agree to maintain a professional standard of communication and collaboration. This includes honoring campaign agreements, meeting deadlines, and respecting the intellectual property of others.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-[#0f172a] mb-2">For Brands</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Provide clear campaign briefs, respond to creator inquiries promptly, and process payments as agreed upon in the platform escrow system.
            </p>
          </div>
          <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-50/50">
            <h3 className="font-bold text-[#0f172a] mb-2">For Creators</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Deliver authentic content that aligns with the brand's guidelines, disclose sponsorships per FTC regulations, and maintain the agreed-upon post duration.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Content Ownership */}
      <section id="content-ownership" className="bg-[#f5f3ff] rounded-[2rem] p-8 md:p-10 border border-purple-100 scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-white text-purple-600 shadow-sm rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#0f172a]">Content Ownership</h2>
        </div>

        <p className="text-gray-600 leading-relaxed mb-8">
          Clear rights management is essential. Brandly facilitates standard licensing agreements, but the default terms are as follows unless specifically modified in a campaign brief:
        </p>

        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-white text-purple-600 shadow-sm flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-[#0f172a]">Creator Rights:</strong> Creators retain the original copyright to their content.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-white text-purple-600 shadow-sm flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-[#0f172a]">Brand License:</strong> Brands receive a non-exclusive, worldwide license to reshare the content organically on their owned channels for 12 months.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-white text-purple-600 shadow-sm flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-[#0f172a]">Paid Ads:</strong> Whitelisting or using content for paid advertising requires a separate usage fee negotiated on the platform.
            </p>
          </li>
        </ul>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 3. Fees & Payments */}
        <section id="fees-payments" className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 scroll-mt-32">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-black text-[#0f172a]">Fees & Payments</h2>
          </div>
          
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Brandly utilizes an escrow system. Brands deposit funds upon campaign approval. Funds are released to the creator once the deliverables are submitted and approved.
          </p>

          <div className="bg-emerald-50 text-emerald-700 text-sm font-bold px-4 py-3 rounded-xl flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Standard 10% Platform Fee
          </div>
        </section>

        {/* 4. Termination */}
        <section id="termination" className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 scroll-mt-32">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-black text-[#0f172a]">Termination</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
              <span className="text-sm font-bold text-gray-700">Violation of Terms</span>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-red-500 transition-colors" />
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
              <span className="text-sm font-bold text-gray-700">Fraudulent Activity</span>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-red-500 transition-colors" />
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
              <span className="text-sm font-bold text-gray-700">Inactivity (12+ Months)</span>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-red-500 transition-colors" />
            </div>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
