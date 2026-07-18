import React from "react";
import { Lock, Server, Shield, Cloud, ArrowRight } from "lucide-react";
import LegalLayout from "../components/layout/LegalLayout";

export default function SecurityPage() {
  const sections = [
    { id: "infrastructure", label: "Infrastructure", icon: Server },
    { id: "data-protection", label: "Data Protection", icon: Lock },
    { id: "compliance", label: "Compliance", icon: Shield },
    { id: "availability", label: "Availability", icon: Cloud },
  ];

  return (
    <LegalLayout
      titleBlack="Enterprise-Grade"
      titleBlue="Security."
      description="Trust is built on security. Brandly employs industry-leading practices to protect your campaigns, communications, and financial data at every layer of our platform."
      lastUpdated="October 24, 2024"
      sections={sections}
    >
      {/* 1. Infrastructure */}
      <section id="infrastructure" className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100 scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Server className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#0f172a]">Infrastructure</h2>
        </div>
        
        <p className="text-gray-500 leading-relaxed mb-8">
          Our platform is hosted on Amazon Web Services (AWS), utilizing their highly secure data centers. We employ strict network segregation, firewalls, and continuous monitoring to detect and prevent unauthorized access.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-[#0f172a] mb-2">Network Security</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Virtual Private Clouds (VPCs) with strict routing rules and DDoS mitigation via Cloudflare.
            </p>
          </div>
          <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-50/50">
            <h3 className="font-bold text-[#0f172a] mb-2">Access Control</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Role-Based Access Control (RBAC) and Multi-Factor Authentication (MFA) required for all internal engineering access.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Data Protection */}
      <section id="data-protection" className="bg-[#f5f3ff] rounded-[2rem] p-8 md:p-10 border border-purple-100 scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-white text-purple-600 shadow-sm rounded-xl flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#0f172a]">Data Protection</h2>
        </div>

        <p className="text-gray-600 leading-relaxed mb-8">
          Your data is encrypted both at rest and in transit using industry-standard protocols to ensure maximum confidentiality and integrity.
        </p>

        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-white text-purple-600 shadow-sm flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-[#0f172a]">In Transit:</strong> All traffic is encrypted using TLS 1.3 (HTTPS).
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-white text-purple-600 shadow-sm flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-[#0f172a]">At Rest:</strong> Databases and backups are encrypted using AES-256 block-level encryption.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-white text-purple-600 shadow-sm flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-[#0f172a]">Secrets Management:</strong> API keys and OAuth tokens are hashed and stored in secure AWS KMS vaults.
            </p>
          </li>
        </ul>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 3. Compliance */}
        <section id="compliance" className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 scroll-mt-32">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-black text-[#0f172a]">Compliance</h2>
          </div>
          
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            We regularly audit our systems to ensure we meet or exceed global regulatory standards for data privacy and security.
          </p>

          <div className="bg-emerald-50 text-emerald-700 text-sm font-bold px-4 py-3 rounded-xl flex items-center gap-2">
            <Shield className="w-4 h-4" />
            GDPR & CCPA Compliant
          </div>
        </section>

        {/* 4. Availability */}
        <section id="availability" className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 scroll-mt-32">
          <div className="flex items-center gap-3 mb-6">
            <Cloud className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-black text-[#0f172a]">Availability</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
              <span className="text-sm font-bold text-gray-700">99.9% Uptime SLA</span>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
              <span className="text-sm font-bold text-gray-700">Multi-Region Backups</span>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
              <span className="text-sm font-bold text-gray-700">Disaster Recovery Plan</span>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
