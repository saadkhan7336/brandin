import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingFooter() {
  const navigate = useNavigate();

  return (
    <footer className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-t border-[#e2e8f0]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-[#3b82f6]">Brandly</span>
            </div>
            <p className="text-sm text-[#64748b] leading-relaxed mb-6">
              The elite matching platform for creators and global brands. Engineered for the next generation of digital commerce.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-[#f1f5f9] rounded-full flex items-center justify-center text-[#64748b] hover:bg-[#e2e8f0] cursor-pointer">X</div>
              <div className="w-8 h-8 bg-[#f1f5f9] rounded-full flex items-center justify-center text-[#64748b] hover:bg-[#e2e8f0] cursor-pointer">in</div>
              <div className="w-8 h-8 bg-[#f1f5f9] rounded-full flex items-center justify-center text-[#64748b] hover:bg-[#e2e8f0] cursor-pointer">ig</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#1e293b] mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-[#64748b]">
              <li><button onClick={() => navigate('/features')} className="hover:text-[#2563eb]">Features</button></li>
              <li><button onClick={() => navigate('/features/find-matches')} className="hover:text-[#2563eb]">Smart AI Matching</button></li>
              <li><button onClick={() => navigate('/real-time-chat')} className="hover:text-[#2563eb]">Real-time Chat</button></li>
              <li><button onClick={() => navigate('/integrations')} className="hover:text-[#2563eb]">Integrations</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1e293b] mb-4">Solutions</h4>
            <ul className="space-y-3 text-sm text-[#64748b]">
              <li><button onClick={() => navigate('/solutions/for-brands')} className="hover:text-[#2563eb]">For Brands</button></li>
              <li><button onClick={() => navigate('/solutions/for-creators')} className="hover:text-[#2563eb]">For Creators</button></li>
              <li><button onClick={() => navigate('/solutions/agencies')} className="hover:text-[#2563eb]">Agencies</button></li>
              <li><button onClick={() => navigate('/solutions/enterprise')} className="hover:text-[#2563eb]">Enterprise</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1e293b] mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-[#64748b]">
              <li><button onClick={() => navigate('/about')} className="hover:text-[#2563eb]">About Us</button></li>
              <li><button onClick={() => navigate('/careers')} className="hover:text-[#2563eb]">Careers</button></li>
              <li><button onClick={() => navigate('/case-studies')} className="hover:text-[#2563eb]">Case Studies</button></li>
              <li><button onClick={() => navigate('/blog')} className="hover:text-[#2563eb]">Blog</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1e293b] mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-[#64748b]">
              <li><button onClick={() => navigate('/help-center')} className="hover:text-[#2563eb]">Help Center</button></li>
              <li><button onClick={() => navigate('/terms-of-service')} className="hover:text-[#2563eb]">Terms of Service</button></li>
              <li><button onClick={() => navigate('/privacy-policy')} className="hover:text-[#2563eb]">Privacy Policy</button></li>
              <li><button onClick={() => navigate('/security')} className="hover:text-[#2563eb]">Security</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#e2e8f0] flex flex-col md:flex-row justify-between items-center text-xs text-[#94a3b8]">
          <p>© 2026 Brandly Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>Secure Payment Processing by Stripe</span>
            <span>A Premium Digital Experience</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
