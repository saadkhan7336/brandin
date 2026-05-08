import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full h-full">
      <Loader2 className="animate-spin text-blue-600 w-10 h-10 mb-4" />
      <p className="text-gray-500 font-bold uppercase tracking-widest text-sm animate-pulse">Loading...</p>
    </div>
  );
};

export default LoadingFallback;
