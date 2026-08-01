import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingFooter() {
  const navigate = useNavigate();

  return (
    <footer className="bg-primary text-white py-16 border-t border-blue-600/30">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-white tracking-tight">Brandly</span>
            </div>
            <p className="text-sm text-blue-100 leading-relaxed mb-6">
              The elite matching platform for creators and global brands. Engineered for the next generation of digital commerce.
            </p>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-semibold cursor-pointer transition-colors">X</div>
              <div className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-semibold cursor-pointer transition-colors">in</div>
              <div className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-semibold cursor-pointer transition-colors">ig</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-blue-100/90">
              <li><button onClick={() => navigate('/features')} className="hover:text-white transition-colors">Features</button></li>
              <li><button onClick={() => navigate('/features/find-matches')} className="hover:text-white transition-colors">Smart AI Matching</button></li>
              <li><button onClick={() => navigate('/real-time-chat')} className="hover:text-white transition-colors">Real-time Chat</button></li>
              <li><button onClick={() => navigate('/integrations')} className="hover:text-white transition-colors">Integrations</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Solutions</h4>
            <ul className="space-y-3 text-sm text-blue-100/90">
              <li><button onClick={() => navigate('/solutions/for-brands')} className="hover:text-white transition-colors">For Brands</button></li>
              <li><button onClick={() => navigate('/solutions/for-creators')} className="hover:text-white transition-colors">For Creators</button></li>
              <li><button onClick={() => navigate('/solutions/agencies')} className="hover:text-white transition-colors">Agencies</button></li>
              <li><button onClick={() => navigate('/solutions/enterprise')} className="hover:text-white transition-colors">Enterprise</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-blue-100/90">
              <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => navigate('/careers')} className="hover:text-white transition-colors">Careers</button></li>
              <li><button onClick={() => navigate('/case-studies')} className="hover:text-white transition-colors">Case Studies</button></li>
              <li><button onClick={() => navigate('/blog')} className="hover:text-white transition-colors">Blog</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-blue-100/90">
              <li><button onClick={() => navigate('/help-center')} className="hover:text-white transition-colors">Help Center</button></li>
              <li><button onClick={() => navigate('/terms-of-service')} className="hover:text-white transition-colors">Terms of Service</button></li>
              <li><button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => navigate('/security')} className="hover:text-white transition-colors">Security</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-blue-400/30 flex flex-col md:flex-row justify-between items-center text-xs text-blue-200/80">
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
