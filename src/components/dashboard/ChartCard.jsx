import React from 'react';

export default function ChartCard({ 
  title, 
  subtitle, 
  headerAction = null,
  children,
  className = ""
}) {
  return (
    <div className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-[#e2e8f0] flex flex-col ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-8">
          <div>
             {title && <h3 className="text-base sm:text-lg font-bold text-[#1e293b]">{title}</h3>}
             {subtitle && <p className="text-xs font-medium text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && (
             <div className="self-start sm:self-auto overflow-x-auto max-w-full py-0.5">
               {headerAction}
             </div>
          )}
        </div>
      )}
      
      <div className="flex-1 w-full min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
