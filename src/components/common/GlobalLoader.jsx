import React from 'react';
import { useSelector } from 'react-redux';

export default function GlobalLoader() {
  const { globalLoading } = useSelector((state) => state.ui);

  if (!globalLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[1000] h-1 overflow-hidden bg-transparent">
      <div 
        className="h-full bg-blue-600 w-1/3 rounded-r-full"
        style={{
          animation: 'global-progress 1.5s infinite linear'
        }}
      ></div>
      <style>{`
        @keyframes global-progress {
          0% { transform: translateX(-100%); width: 30%; }
          50% { width: 40%; }
          100% { transform: translateX(300%); width: 30%; }
        }
      `}</style>
    </div>
  );
}
