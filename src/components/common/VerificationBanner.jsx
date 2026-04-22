import React from 'react';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/helper';

export default function VerificationBanner({ user, roleProfile, onGoToSettings }) {
  if (!user || !roleProfile) return null;

  const socialMedia = roleProfile.socialMedia || {};
  // Handle both Map and Object
  const rawLinks = (socialMedia instanceof Map) 
    ? Object.fromEntries(socialMedia) 
    : socialMedia;

  const platforms = Object.entries(rawLinks)
    .filter(([_, val]) => typeof val === 'string')
    .map(([key]) => key.toLowerCase());

  if (platforms.length === 0) return null;

  // verifiedPlatforms is an Array from the backend
  const vpArray = Array.isArray(user.verifiedPlatforms) ? user.verifiedPlatforms : [];
  const vpMap = {};
  vpArray.forEach(p => {
    if (p.platform && p.verified) vpMap[p.platform.toLowerCase()] = p;
  });

  const unverified = platforms.filter(p => !vpMap[p]);
  const verifiedCount = platforms.length - unverified.length;

  let needsVerification = false;
  
  if (platforms.length < 3) {
    // If < 3 platforms, all must be verified
    needsVerification = unverified.length > 0;
  } else {
    // If >= 3 platforms, at least 3 must be verified
    needsVerification = verifiedCount < 3;
  }

  if (!needsVerification) return null;

  const unverifiedList = unverified
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(', ');
  
  return (
    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-tight italic">Action Required: Verification</h4>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Your <span className="text-emerald-600 font-bold underline">{unverifiedList}</span> platforms are not verified yet via OAuth.
          </p>
        </div>
      </div>
      
      <button 
        onClick={onGoToSettings}
        className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-emerald-500/10 active:scale-95"
      >
        Verify Now <ChevronRight size={12} />
      </button>
    </div>
  );
}
