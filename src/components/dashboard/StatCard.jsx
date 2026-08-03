import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

export default function StatCard({ 
  title, 
  value, 
  change, 
  changeType = 'positive', // 'positive', 'negative', 'neutral'
  sparklineData = null,    // Array of numbers for the sparkline
  sparklineColor = '#3b82f6', // Default blue
  sparklineBgColor = 'rgba(59, 130, 246, 0.1)'
}) {
  
  // Format the change badge based on type
  const badgeColors = {
    positive: 'bg-emerald-50 text-emerald-600',
    negative: 'bg-red-50 text-red-600',
    neutral: 'bg-slate-100 text-slate-600'
  };

  const badgeColor = badgeColors[changeType] || badgeColors.neutral;

  // Setup sparkline if data is provided
  let chartData = null;
  let chartOptions = null;

  if (sparklineData && sparklineData.length > 0) {
    chartData = {
      labels: sparklineData.map((_, i) => i.toString()),
      datasets: [
        {
          data: sparklineData,
          borderColor: sparklineColor,
          backgroundColor: sparklineBgColor,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: true,
          tension: 0.4, // Smooth curve
        }
      ]
    };

    chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      scales: {
        x: { display: false },
        y: { display: false, min: Math.min(...sparklineData) * 0.9, max: Math.max(...sparklineData) * 1.1 }
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      layout: {
        padding: 0
      }
    };
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#e2e8f0] flex flex-col h-full relative overflow-hidden group hover:shadow-md transition-shadow min-h-[120px] sm:min-h-[140px]">
      
      <div className="flex justify-between items-start mb-1.5 sm:mb-2 relative z-10">
        <h4 className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest truncate mr-1">{title}</h4>
        {change && (
          <span className={`${badgeColor} text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shrink-0`}>
            {change}
          </span>
        )}
      </div>

      <div className="mt-0.5 sm:mt-1 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-black text-[#1e293b] tracking-tight">{value}</h2>
      </div>

      {/* Sparkline Container */}
      {sparklineData ? (
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-70 group-hover:opacity-100 transition-opacity">
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="mt-auto pt-4 relative z-10">
           {/* Fallback bar if no sparkline data is provided (e.g. standard metric) */}
           <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000 ease-out" 
                   style={{ width: '70%', backgroundColor: sparklineColor }} />
           </div>
        </div>
      )}
    </div>
  );
}
