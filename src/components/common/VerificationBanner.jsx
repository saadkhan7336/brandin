import React from 'react';
import { ShieldAlert, ShieldCheck, ChevronRight, Mail, Zap } from 'lucide-react';
import { cn, checkVerification } from '../../utils/helper';

export default function VerificationBanner({ user, roleProfile, onGoToSettings }) {
  if (!user || !roleProfile) return null;

  const isFullyVerified = checkVerification(user, roleProfile);
  if (isFullyVerified) return null;

  // Case 1: Email not verified
  if (!user.isVerified) {
    return (
      <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 shadow-sm group">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-50 group-hover:scale-110 transition-transform">
            <Mail size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-tight italic">Action Required: Verify Email</h4>
              <div className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[8px] font-black uppercase tracking-tighter">
                Critical
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Your account is not verified yet. Please verify your email <span className="text-amber-600 font-bold underline">{user.email}</span> to unlock all features.
            </p>
          </div>
        </div>
        
        <button 
          onClick={onGoToSettings}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-amber-500/10 active:scale-95"
        >
          Verify Email Now <ChevronRight size={14} />
        </button>
      </div>
    );
  }

  // Case 2: Email verified but Socials (OAuth) not verified
  let socialMedia = roleProfile.socialMedia || {};
  if (typeof socialMedia === 'string') {
    try { socialMedia = JSON.parse(socialMedia); } catch (e) { socialMedia = {}; }
  }
  const rawLinks = (socialMedia instanceof Map) ? Object.fromEntries(socialMedia) : socialMedia;
  const platforms = Object.entries(rawLinks)
    .filter(([_, val]) => typeof val === 'string')
    .map(([key]) => key.toLowerCase());

  // verifiedPlatforms is an Array from the backend
  const vpArray = Array.isArray(user.verifiedPlatforms) ? user.verifiedPlatforms : [];
  const vpMap = {};
  vpArray.forEach(p => {
    if (p.platform && p.verified) vpMap[p.platform.toLowerCase()] = p;
  });

  const unverified = platforms.filter(p => !vpMap[p]);
  const unverifiedList = unverified
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(', ');

  return (
    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 shadow-sm group">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50 group-hover:scale-110 transition-transform">
          <ShieldAlert size={24} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-tight italic">Boost Your Trust: OAuth Verification</h4>
            <div className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[8px] font-black uppercase tracking-tighter">
              Recommended
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            {platforms.length === 0 
              ? "Connect at least 3 social platforms via OAuth to get your Verified Badge."
              : `Your ${unverifiedList || 'social'} platforms are not verified yet via OAuth. Verify them to build brand trust.`}
          </p>
        </div>
      </div>
      
      <button 
        onClick={onGoToSettings}
        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-emerald-500/10 active:scale-95"
      >
        Complete Verification <ChevronRight size={14} />
      </button>
    </div>
  );
}
