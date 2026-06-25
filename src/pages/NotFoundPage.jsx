import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6">
      <div className="text-center">
        <h1 className="text-6xl sm:text-8xl font-bold text-[#3b82f6] mb-4">404</h1>
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#111827] mb-4">Page Not Found</h2>
        <p className="text-base sm:text-lg text-[#6b7280] max-w-md mx-auto mb-8">
          The page you are looking for doesn't exist or has been moved. We will design this page later on.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="bg-[#3b82f6] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2563eb] transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
