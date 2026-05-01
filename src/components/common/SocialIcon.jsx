import React from 'react';

const SocialIcon = ({ platformName, className = "" }) => {
  const name = platformName?.toLowerCase() || '';
  const sizeClass = "w-5 h-5"; // 20x20

  if (name.includes('instagram')) {
    return (
      <div className={`rounded-full overflow-hidden ${sizeClass} ${className}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ig-grad" x1="2" y1="22" x2="22" y2="2">
              <stop stopColor="#fd5949" offset="0"/>
              <stop stopColor="#d6249f" offset="0.5"/>
              <stop stopColor="#285AEB" offset="1"/>
            </linearGradient>
          </defs>
          <rect width="24" height="24" fill="url(#ig-grad)"/>
          <path d="M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm0 7.4A2.9 2.9 0 1 1 12 9.1a2.9 2.9 0 0 1 0 5.8z" fill="#fff"/>
          <circle cx="16.5" cy="7.5" r="1.1" fill="#fff"/>
          <path d="M16.5 5h-9A4.5 4.5 0 0 0 3 9.5v5A4.5 4.5 0 0 0 7.5 19h9a4.5 4.5 0 0 0 4.5-4.5v-5A4.5 4.5 0 0 0 16.5 5zm2.9 9.5A2.9 2.9 0 0 1 16.5 17.4h-9A2.9 2.9 0 0 1 4.6 14.5v-5A2.9 2.9 0 0 1 7.5 6.6h9A2.9 2.9 0 0 1 19.4 9.5v5z" fill="#fff"/>
        </svg>
      </div>
    );
  }

  if (name.includes('twitter') || name.includes('x')) {
    return (
      <div className={`bg-black rounded-full flex items-center justify-center ${sizeClass} ${className}`}>
         <svg width="12" height="12" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
         </svg>
      </div>
    );
  }

  if (name.includes('linkedin')) {
    return (
      <div className={`rounded-full overflow-hidden ${sizeClass} ${className}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" fill="#0A66C2"/>
          <path d="M7 9.5h3v9H7v-9zM8.5 8.2a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4zM11.5 9.5h2.9v1.2h.1c.4-.8 1.4-1.6 2.9-1.6 3.1 0 3.6 2 3.6 4.7v4.7h-3v-4.2c0-1 0-2.3-1.4-2.3-1.4 0-1.6 1.1-1.6 2.2v4.3h-3v-9z" fill="#fff"/>
        </svg>
      </div>
    );
  }

  if (name.includes('tiktok')) {
    return (
      <div className={`bg-black rounded-full flex items-center justify-center ${sizeClass} ${className}`}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.81-.74-3.94-1.69-.01 2.57.01 5.13-.02 7.7-.08 3.39-2.32 6.51-5.65 7.13-3.08.63-6.52-.77-8.15-3.49-1.55-2.5-1.07-6.07 1.09-8.06 1.13-1.07 2.68-1.57 4.21-1.48v4.03c-.7-.07-1.44.11-2 .57-.9.7-.99 2.1-.21 2.95.78.85 2.23.82 2.93-.07.24-.34.36-.76.36-1.18V.02z"/>
        </svg>
      </div>
    );
  }

  // Default to YouTube
  return (
    <div className={`bg-[#FF0000] rounded-full flex items-center justify-center ${sizeClass} ${className}`}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.6 7.14a2.7 2.7 0 0 0-1.89-1.9C18 4.75 12 4.75 12 4.75s-6 0-7.71.49a2.7 2.7 0 0 0-1.89 1.9C2 8.87 2 12 2 12s0 3.13.4 4.86a2.7 2.7 0 0 0 1.89 1.9C6 19.25 12 19.25 12 19.25s6 0 7.71-.49a2.7 2.7 0 0 0 1.89-1.9C22 15.13 22 12 22 12s0-3.13-.4-4.86z" fill="currentColor"/>
        <path d="M9.9 15.11l5.24-3.1-5.24-3.11v6.21z" fill="#FF0000"/>
      </svg>
    </div>
  );
};

export default SocialIcon;
