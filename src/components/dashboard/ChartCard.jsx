import React from 'react';

export default function ChartCard({ 
  title, 
  subtitle, 
  headerAction = null,
  children,
  className = ""
}) {
  return (
    <div className={`bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#e2e8f0] flex flex-col ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between mb-8">
          <div>
             {title && <h3 className="text-lg font-bold text-[#1e293b]">{title}</h3>}
             {subtitle && <p className="text-xs font-medium text-slate-500 mt-1">{subtitle}</p>}
          </div>
          {headerAction && (
             <div>
               {headerAction}
             </div>
          )}
        </div>
      )}
      
      <div className="flex-1 w-full">
        {children}
      </div>
    </div>
  );
}
