import React from "react";
import { Shield, Lock, Eye, FileText, Bell, HelpCircle } from "lucide-react";
import LandingNavbar from "../components/layout/LandingNavbar";

function PrivacyPolicyPage() {
  const lastUpdated = "February 21, 2026";

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <LandingNavbar />

      {/* Header with gradient background */}
      <div className="bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white py-12 sm:py-16 px-4 pt-32">
        <div className="max-w-4xl mx-auto text-center pt-10">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-2xl mb-4 sm:mb-6">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-white">
            Privacy Policy
          </h1>
          <p className="text-base sm:text-lg text-white/90">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-[#e5e7eb] p-6 sm:p-8 md:p-12 space-y-8 sm:space-y-10">
           <section>
            <div className="flex items-center gap-3 mb-4 ">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Shield className="w-6 h-6 text-[#3b82f6]" />
              </div>
              <h2 className="text-2xl font-bold text-[#111827]">1. Introduction</h2>
            </div>
            <p className="text-[#4b5563] leading-relaxed">
              Welcome to Brandly. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform to connect brands and influencers.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-[#3b82f6]" />
              </div>
              <h2 className="text-2xl font-bold text-[#111827]">2. Information We Collect</h2>
            </div>
            <div className="space-y-4">
              <p className="text-[#4b5563] leading-relaxed">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[#4b5563]">
                <li><strong>Account Information:</strong> Name, email address, password, and profile details.</li>
                <li><strong>Influencer Data:</strong> Social media handles, follower counts, niche categories, and content samples.</li>
                <li><strong>Brand Data:</strong> Company name, industry, marketing goals, and campaign details.</li>
                <li><strong>Communication:</strong> Messages exchanged between brands and influencers on our platform.</li>
              </ul>
            </div>
          </section>
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Lock className="w-6 h-6 text-[#3b82f6]" />
              </div>
              <h2 className="text-2xl font-bold text-[#111827]">3. How We Use Your Information</h2>
            </div>
            <p className="text-[#4b5563] leading-relaxed mb-4">
              We use the collected data to provide and improve our services, specifically:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex items-start gap-2 text-[#4b5563]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mt-2 flex-shrink-0" />
                Facilitating collaborations between brands and influencers.
              </li>
              <li className="flex items-start gap-2 text-[#4b5563]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mt-2 flex-shrink-0" />
                Personalizing your experience and recommendations.
              </li>
              <li className="flex items-start gap-2 text-[#4b5563]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mt-2 flex-shrink-0" />
                Processing transactions and maintaining account security.
              </li>
              <li className="flex items-start gap-2 text-[#4b5563]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mt-2 flex-shrink-0" />
                Sending platform updates and marketing communications.
              </li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Eye className="w-6 h-6 text-[#3b82f6]" />
              </div>
              <h2 className="text-2xl font-bold text-[#111827]">4. Data Sharing</h2>
            </div>
            <p className="text-[#4b5563] leading-relaxed">
              We do not sell your personal data. We only share information with third parties when necessary to provide our services, comply with the law, or protect our rights. This includes sharing profile information between brands and influencers to facilitate partnerships.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Bell className="w-6 h-6 text-[#3b82f6]" />
              </div>
              <h2 className="text-2xl font-bold text-[#111827]">5. Your Rights</h2>
            </div>
            <p className="text-[#4b5563] leading-relaxed mb-4">
              You have the right to:
            </p>
            <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm font-medium text-[#374151]">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[#e5e7eb] text-[#3b82f6]">1</div>
                Access your personal data
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-[#374151]">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[#e5e7eb] text-[#3b82f6]">2</div>
                Request data correction
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-[#374151]">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[#e5e7eb] text-[#3b82f6]">3</div>
                Request data deletion
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-[#374151]">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[#e5e7eb] text-[#3b82f6]">4</div>
                Object to data processing
              </div>
            </div>
          </section>

          <section className="pt-6 border-t border-[#e5e7eb]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <HelpCircle className="w-6 h-6 text-[#3b82f6]" />
              </div>
              <h2 className="text-2xl font-bold text-[#111827]">6. Contact Us</h2>
            </div>
            <p className="text-[#4b5563] leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@brandly.com" className="text-[#3b82f6] hover:underline font-medium">
                privacy@brandly.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
