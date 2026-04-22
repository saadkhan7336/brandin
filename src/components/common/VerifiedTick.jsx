import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { checkVerification } from '../../utils/helper';

/**
 * Renders a premium verification tick if conditions are met.
 * @param {Object} user - The user object (from auth or search result)
 * @param {Object} roleProfile - The Brand/Influencer profile
 * @param {string} size - size of the tick (sm, md, lg)
 * @param {string} className - extra classes
 */
export default function VerifiedTick({ user, roleProfile, size = 'sm', className = '' }) {
  if (!user || !roleProfile) return null;
  
  const isVerified = checkVerification(user, roleProfile);
  if (!isVerified) return null;

  const sizeMetrics = {
    xs: 13,
    sm: 15,
    md: 18,
    lg: 22
  };

  const boxSize = sizeMetrics[size] || sizeMetrics.sm;

  return (
    <div 
      className={`inline-flex items-center justify-center ml-1.5 align-middle select-none transition-all duration-300 hover:scale-125 active:scale-95 ${className}`}
      title="Verified Account"
      style={{ width: boxSize, height: boxSize }}
    >
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.25)]"
      >
        <defs>
          <linearGradient id="verifiedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00A8FF" />
            <stop offset="100%" stopColor="#0066FF" />
          </linearGradient>
        </defs>
        <path 
          d="M10.5213 2.62368C11.3147 1.75287 12.6853 1.75287 13.4787 2.62368L14.4989 3.74339C14.8026 4.07681 15.2533 4.26315 15.7226 4.24927L17.2977 4.20259C18.522 4.1663 19.5085 5.15281 19.4722 6.37714L19.4255 7.95217C19.4116 8.42151 19.598 8.8722 19.9314 9.17585L21.0511 10.1961C21.9219 10.9895 21.9219 12.3601 21.0511 13.1534L19.9314 14.1737C19.598 14.4774 19.4116 14.9281 19.4255 15.3975L19.4722 16.9725C19.5085 18.1968 18.522 19.1833 17.2977 19.1471L15.7226 19.1004C15.2533 19.0865 14.8026 19.2728 14.4989 19.6063L13.4787 20.726C12.6853 21.5968 11.3147 21.5968 10.5213 20.726L9.5011 19.6063C9.19736 19.2728 8.74667 19.0865 8.27735 19.1004L6.70231 19.1471C5.47798 19.1833 4.49147 18.1968 4.52777 16.9725L4.57445 15.3975C4.58832 14.9281 4.40198 14.4774 4.06857 14.1737L2.94888 13.1534C2.07807 12.3601 2.07807 10.9895 2.94888 10.1961L4.06857 9.17585C4.40198 8.8722 4.58832 8.42151 4.57445 7.95217L4.52777 6.37714C4.49147 5.15281 5.47798 4.1663 6.70231 4.20259L8.27735 4.24927C8.74667 4.26315 9.19736 4.07681 9.5011 3.74339L10.5213 2.62368Z" 
          fill="url(#verifiedGradient)"
        />
        <path 
          d="M8.5 12.5L10.5 14.5L15.5 9.5" 
          stroke="white" 
          strokeWidth="2.8" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
