import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function LandingFooter() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#111827] text-white py-8 sm:py-12 px-4 sm:px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#3b82f6]" />
              <span className="text-base sm:text-lg font-bold">Brandly</span>
            </div>
            <p className="text-sm sm:text-base text-[#9ca3af]">
              Connecting brands with influencers for authentic collaborations.
            </p>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Product</h3>
            <ul className="space-y-2 text-sm sm:text-base text-[#9ca3af]">
              <li><button onClick={() => navigate('/features')} className="hover:text-white transition-colors">Features</button></li>
              <li><button onClick={() => navigate('/case-studies')} className="hover:text-white transition-colors">Case Studies</button></li>
              <li><button onClick={() => navigate('/blog')} className="hover:text-white transition-colors">Blog</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Company</h3>
            <ul className="space-y-2 text-sm sm:text-base text-[#9ca3af]">
              <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => navigate('/blog')} className="hover:text-white transition-colors">Blog</button></li>
              <li><button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contact</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Support</h3>
            <ul className="space-y-2 text-sm sm:text-base text-[#9ca3af]">
              <li><button onClick={() => navigate('/help-center')} className="hover:text-white transition-colors">Help Center</button></li>
              <li><button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contact Us</button></li>
              <li><button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#374151] pt-6 sm:pt-8 text-center text-xs sm:text-sm text-[#9ca3af]">
          <p>&copy; 2024 Brandly. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
