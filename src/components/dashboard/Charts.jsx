import React, { useState, useEffect, useRef } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  RadialLinearScale,
  PolarAreaController,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Radar, PolarArea } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- Shared tooltip style ---
const sharedTooltip = {
  backgroundColor: 'rgba(255, 255, 255, 0.97)',
  titleColor: '#1e293b',
  bodyColor: '#475569',
  borderColor: '#e2e8f0',
  borderWidth: 1,
  padding: 10,
  boxPadding: 4,
  cornerRadius: 8,
};

// --- 1. Social Media Performance Area Chart (Slow-mo Morphing Signal) ---
export function SocialMediaAreaChart({ mode }) {
  const numPoints = 60;
  
  // Mock metadata for each data point to show Collab and Task info
  const pointMetadata = Array.from({ length: numPoints }, (_, i) => {
    const collabs = ['Summer Glow 2024', 'Eco-home Series', 'Tech Launch Pro', 'Winter Collection'];
    const tasks = ['Instagram Reel - Review', 'TikTok Post - Unboxing', 'YouTube Shorts - Demo', 'Instagram Story - Link'];
    
    // Deterministic random-looking selection based on index
    const collabName = collabs[i % collabs.length];
    const taskName = tasks[(i * 3) % tasks.length];
    
    return {
      date: `Day ${i + 1}`,
      collab: collabName,
      task: taskName
    };
  });

  const labels = pointMetadata.map(meta => meta.date);

  // Generates a very smooth, simple wave (initial state)
  const generateSmooth = (base) => {
    return Array.from({ length: numPoints }, (_, i) => {
      return base + Math.sin(i * 0.1) * (base * 0.1);
    });
  };

  // Generates the complex, jagged crinkly wave (final state)
  const generateJagged = (base, volatility, phaseOffset) => {
    return Array.from({ length: numPoints }, (_, i) => {
      const wave = Math.sin((i + phaseOffset) * 0.3) * (base * 0.2);
      const highFreq = Math.sin((i + phaseOffset) * 1.5) * (base * 0.15);
      const noise = (Math.random() - 0.5) * volatility;
      return Math.max(10, base + wave + highFreq + noise); 
    });
  };

  // Keep references to our target states so they don't regenerate constantly
  const targets = useRef({
    series1: { smooth: generateSmooth(500), jagged: generateJagged(500, 200, 0) },
    series2: { smooth: generateSmooth(300), jagged: generateJagged(300, 150, 5) },
    series3: { smooth: generateSmooth(150), jagged: generateJagged(150, 80, 10) }
  });

  // Current displayed data, starts at smooth state
  const [currentData, setCurrentData] = useState({
    series1: targets.current.series1.smooth,
    series2: targets.current.series2.smooth,
    series3: targets.current.series3.smooth,
  });

  // Progress from 0 (smooth) to 1 (jagged)
  const [progress, setProgress] = useState(0);

  // Slow-mo morphing animation loop
  useEffect(() => {
    if (progress >= 1) return; // Stop when fully jagged

    const interval = setInterval(() => {
      setProgress(p => {
        const nextP = Math.min(p + 0.015, 1); // Slow increment
        
        // Lerp between smooth and jagged based on progress
        setCurrentData({
          series1: targets.current.series1.smooth.map((start, i) => {
            const end = targets.current.series1.jagged[i];
            return start + (end - start) * nextP;
          }),
          series2: targets.current.series2.smooth.map((start, i) => {
            const end = targets.current.series2.jagged[i];
            return start + (end - start) * nextP;
          }),
          series3: targets.current.series3.smooth.map((start, i) => {
            const end = targets.current.series3.jagged[i];
            return start + (end - start) * nextP;
          })
        });

        return nextP;
      });
    }, 40); // 40ms interval for smooth slow-mo (~25fps)

    return () => clearInterval(interval);
  }, [progress]);

  // Vibrant styling strictly matching index.css brand variables
  const datasetsMap = {
    engagement: [
      {
        label: 'Likes',
        data: currentData.series1,
        fill: true,
        backgroundColor: 'rgba(37, 99, 235, 0.1)', // Primary (#2563eb)
        borderColor: '#2563eb',
        tension: 0.4,
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: 'Comments',
        data: currentData.series2,
        fill: true,
        backgroundColor: 'rgba(139, 92, 246, 0.1)', // Accent (#8b5cf6)
        borderColor: '#8b5cf6',
        tension: 0.4,
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: 'Shares',
        data: currentData.series3,
        fill: true,
        backgroundColor: 'rgba(100, 116, 139, 0.1)', // Secondary (#64748b)
        borderColor: '#64748b',
        tension: 0.4,
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 4,
      }
    ],
    reach: [
      {
        label: 'Total Reach',
        data: currentData.series1.map(v => v * 10),
        fill: true,
        backgroundColor: 'rgba(37, 99, 235, 0.1)', // Primary (#2563eb)
        borderColor: '#2563eb',
        tension: 0.4,
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: 'Impressions',
        data: currentData.series2.map(v => v * 12),
        fill: true,
        backgroundColor: 'rgba(139, 92, 246, 0.1)', // Accent (#8b5cf6)
        borderColor: '#8b5cf6',
        tension: 0.4,
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 4,
      }
    ],
    content: [
      {
        label: 'Reels',
        data: currentData.series1,
        fill: true,
        backgroundColor: 'rgba(37, 99, 235, 0.1)', // Primary (#2563eb)
        borderColor: '#2563eb',
        tension: 0.4,
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: 'Stories',
        data: currentData.series2,
        fill: true,
        backgroundColor: 'rgba(139, 92, 246, 0.1)', // Accent (#8b5cf6)
        borderColor: '#8b5cf6',
        tension: 0.4,
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 4,
      }
    ]
  };

  const chartData = {
    labels,
    datasets: datasetsMap[mode] || datasetsMap['engagement'],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false, // Disable default chart.js animation since we are driving it via state for smoothness
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { 
        display: true, 
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          padding: 20,
          font: { size: 12, weight: '600', family: "'Inter', sans-serif" },
          color: '#64748b'
        }
      },
      tooltip: {
        ...sharedTooltip,
        callbacks: {
          title: function(context) {
            const index = context[0].dataIndex;
            const meta = pointMetadata[index];
            return `${meta.date} • ${meta.collab}`;
          },
          beforeBody: function(context) {
            const index = context[0].dataIndex;
            const meta = pointMetadata[index];
            return `Task: ${meta.task}\n`;
          },
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              const val = context.parsed.y;
              label += val >= 1000 ? (val / 1000).toFixed(1) + 'k' : Math.floor(val);
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: { 
        border: { display: false }, 
        grid: { color: '#f1f5f9', drawTicks: false }, 
        ticks: { 
          color: '#94a3b8', 
          font: { size: 11 },
          padding: 10,
          callback: function(value) {
            if (value >= 1000) return (value / 1000).toFixed(1) + 'k';
            return Math.floor(value);
          }
        },
        min: 0,
      },
      x: { 
        border: { display: false }, 
        grid: { display: false }, 
        ticks: { 
          color: '#94a3b8', 
          font: { size: 11 }, 
          padding: 10,
          maxTicksLimit: 8 // Don't show all 60 labels
        } 
      }
    }
  };

  return (
    <div className="w-full h-full">
      <Line data={chartData} options={options} />
    </div>
  );
}

// --- 2. Line/Area Chart for Campaigns Flow ---
export function AreaChart({ data, labels }) {
  const chartData = {
    labels: labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Campaign Requests',
        data: data || [65, 59, 80, 81, 56, 55, 40],
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
        borderColor: '#6366f1',
        pointRadius: 0,
        pointHoverRadius: 5,
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: sharedTooltip,
    },
    scales: {
      y: { border: { display: false }, grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8', font: { size: 11 } } },
      x: { border: { display: false }, grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } }
    }
  };

  return <Line data={chartData} options={options} />;
}

const moneyTick = (value) => {
  const n = Number(value) || 0;
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${Math.round(n)}`;
};

// --- 2. Bar Chart for Brand Spending ---
export function StackedBarChart({ labels, dataset1, dataset2, label1, label2, stacked = true }) {
  const chartData = {
    labels: labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: label1 || 'Instagram',
        data: dataset1 || [4000, 3000, 2000, 2780, 1890, 2390, 3490],
        backgroundColor: '#3b82f6',
        borderRadius: { topLeft: stacked ? 0 : 4, topRight: stacked ? 0 : 4, bottomLeft: 0, bottomRight: 0 },
        barPercentage: 0.6,
        categoryPercentage: 0.8
      },
      {
        label: label2 || 'Facebook',
        data: dataset2 || [2400, 1398, 9800, 3908, 4800, 3800, 4300],
        backgroundColor: '#a855f7',
        borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
        barPercentage: 0.6,
        categoryPercentage: 0.8
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom',
        labels: {
          usePointStyle: false,
          boxWidth: 24,
          boxHeight: 8,
          font: { size: 11, family: 'system-ui' },
          color: '#64748b'
        }
      },
      tooltip: sharedTooltip,
    },
    scales: {
      x: { 
        stacked, 
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11, family: 'system-ui' } }
      },
      y: { 
        stacked, 
        grid: { color: '#f1f5f9' }, 
        border: { display: false },
        ticks: { 
          color: '#64748b', 
          font: { size: 11, family: 'system-ui' },
          callback: moneyTick
        }
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

// --- 2b. Line version of Brand Spending (toggle) ---
export function SpendingLineChart({ labels, dataset1, dataset2, label1, label2 }) {
  const chartData = {
    labels: labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: label1 || 'Funded',
        data: dataset1 || [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6',
        pointHoverRadius: 6,
        borderWidth: 2,
      },
      {
        label: label2 || 'Released',
        data: dataset2 || [],
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.06)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#a855f7',
        pointHoverRadius: 6,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          font: { size: 11 },
          color: '#64748b'
        }
      },
      tooltip: sharedTooltip,
    },
    scales: {
      x: { 
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } }
      },
      y: { 
        grid: { color: '#f1f5f9' }, 
        border: { display: false },
        ticks: { 
          color: '#64748b', 
          font: { size: 11 },
          callback: moneyTick
        }
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

// --- 2c. Combo Bar+Line version of Brand Spending (toggle) ---
export function SpendingComboChart({ labels, funded, released, payoutRate }) {
  const chartLabels = labels || [];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        type: 'bar',
        label: 'Escrow funded',
        data: funded || [],
        backgroundColor: 'rgba(37, 99, 235, 0.75)',
        borderRadius: { topLeft: 4, topRight: 4 },
        barPercentage: 0.55,
        categoryPercentage: 0.8,
        yAxisID: 'y',
        order: 2,
      },
      {
        type: 'bar',
        label: 'Paid to creators',
        data: released || [],
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderRadius: { topLeft: 4, topRight: 4 },
        barPercentage: 0.55,
        categoryPercentage: 0.8,
        yAxisID: 'y',
        order: 2,
      },
      {
        type: 'line',
        label: 'Payout rate %',
        data: payoutRate || [],
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.08)',
        borderWidth: 2.5,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#f97316',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        fill: false,
        yAxisID: 'y1',
        order: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          font: { size: 11 },
          color: '#64748b',
          padding: 16,
        }
      },
      tooltip: sharedTooltip,
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
      y: {
        type: 'linear',
        position: 'left',
        grid: { color: '#f1f5f9' },
        border: { display: false },
        ticks: {
          color: '#64748b',
          font: { size: 11 },
          callback: moneyTick,
        },
      },
      y1: {
        type: 'linear',
        position: 'right',
        grid: { drawOnChartArea: false },
        border: { display: false },
        ticks: {
          color: '#f97316',
          font: { size: 11 },
          callback: (v) => v + '%',
        },
        min: 0,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

// --- 3. Doughnut Chart for Stats ---
export function StatsDoughnutChart({ data, labels, colors, centerLabel = 'Collabs' }) {
  const chartValues = (data && data.length ? data : [0]).map((n) => Number(n) || 0);
  const chartLabels = labels && labels.length ? labels : ['None'];
  const chartColors = colors || ['#10b981', '#3b82f6', '#f59e0b', '#94a3b8'];
  const total = chartValues.reduce((a, b) => a + b, 0);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: total > 0 ? chartValues : [1],
        backgroundColor: total > 0 ? chartColors.slice(0, chartValues.length) : ['#e2e8f0'],
        borderWidth: 4,
        borderColor: '#ffffff',
        hoverBorderWidth: 4,
        hoverOffset: 6,
        cutout: '74%',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        ...sharedTooltip,
        enabled: total > 0,
        callbacks: {
          label: (context) => {
            const val = context.raw || 0;
            const pct = total > 0 ? ((val / total) * 100).toFixed(0) : '0';
            return ` ${context.label}: ${val} (${pct}%)`;
          }
        }
      },
    }
  };

  return (
    <div className="w-full h-full flex items-center gap-2 min-h-0">
      <div className="relative flex-1 min-w-0 h-full">
        <Doughnut data={chartData} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl sm:text-[26px] font-black text-[#0f172a] leading-none tabular-nums">{total}</span>
          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 mt-1">{centerLabel}</span>
        </div>
      </div>
      <div className="w-[46%] shrink-0 flex flex-col justify-center gap-3 pr-1">
        {chartLabels.map((label, i) => {
          const val = chartValues[i] || 0;
          const pct = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0';
          return (
            <div key={label} className="flex items-start gap-2.5">
              <span className="w-3.5 h-2 rounded-[2px] mt-1 shrink-0" style={{ backgroundColor: chartColors[i] }} />
              <div className="min-w-0 leading-tight">
                <p className="text-[11px] font-semibold text-slate-600 truncate">{label}</p>
                <p className="text-[11px] font-bold text-slate-800 tabular-nums">{pct}% ({val})</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- 3b. List view for Collab Stats (toggle) ---
export function StatsList({ data, labels, colors }) {
  const vals = data || [300, 50, 100];
  const lbls = labels || ['Completed', 'In Progress', 'Pending'];
  const clrs = colors || ['#10b981', '#3b82f6', '#f59e0b'];
  const total = vals.reduce((s, v) => s + v, 0);

  return (
    <div className="flex flex-col gap-4 w-full px-2 py-2">
      {lbls.map((label, i) => {
        const pct = total > 0 ? Math.round((vals[i] / total) * 100) : 0;
        return (
          <div key={label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold text-[#1e293b] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: clrs[i] }} />
                {label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1e293b]">{vals[i].toLocaleString()}</span>
                <span className="text-[10px] font-semibold text-slate-400">({pct}%)</span>
              </div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: clrs[i] }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- 3c. Radial Gradient / Polar Area Chart for Collab Stats (toggle option) ---
export function CollabRadialGradientChart({ data, labels }) {
  const vals = (data && data.length ? data : [0, 0, 0, 0, 0]).map((n) => Number(n) || 0);
  const lbls = labels && labels.length ? labels : ['Completed', 'Active', 'Review', 'Pending', 'Closed'];
  const chartData = {
    labels: lbls,
    datasets: [
      {
        label: 'Collaborations',
        data: vals,
        backgroundColor: [
          'rgba(16, 185, 129, 0.75)',
          'rgba(37, 99, 235, 0.75)',
          'rgba(139, 92, 246, 0.75)',
          'rgba(245, 158, 11, 0.75)',
          'rgba(100, 116, 139, 0.75)',
        ],
        borderColor: ['#10b981', '#2563eb', '#8b5cf6', '#f59e0b', '#64748b'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: { size: 11, family: 'system-ui' },
          color: '#475569',
          padding: 14,
        }
      },
      tooltip: sharedTooltip,
    },
    scales: {
      r: {
        grid: { color: '#f1f5f9' },
        angleLines: { color: '#e2e8f0' },
        ticks: { display: false },
      }
    }
  };

  return <PolarArea data={chartData} options={options} />;
}

// Alias for backwards compatibility
export const CollabRadarChart = CollabRadialGradientChart;

// --- 4. Multi-Line Frequency Chart (real campaign pipeline) ---
export function MultiLineChart({ labels = [], campaigns = [], requests = [], completed = [] }) {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Campaigns',
        data: campaigns,
        borderColor: '#6366f1',
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
      {
        label: 'Requests',
        data: requests,
        borderColor: '#38bdf8',
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
      {
        label: 'Completed',
        data: completed,
        borderColor: '#34d399',
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          font: { size: 11 },
          color: '#64748b',
          padding: 16
        }
      },
      tooltip: {
        ...sharedTooltip,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 10 }, maxRotation: 0 }
      },
      y: {
        border: { display: false },
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: {
          color: '#94a3b8',
          font: { size: 10 },
          precision: 0,
          stepSize: 1,
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
}

// --- 5. Area Frequency Chart (this year vs last year campaigns) ---
export function AreaFrequencyChart({ labels = [], thisPeriod = [], lastPeriod = [] }) {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'This year',
        data: thisPeriod,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2.5,
      },
      {
        label: 'Last year',
        data: lastPeriod,
        borderColor: '#cbd5e1',
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
        borderDash: [],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          font: { size: 11 },
          color: '#64748b',
          padding: 16
        }
      },
      tooltip: {
        ...sharedTooltip,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 10 }, maxRotation: 0 }
      },
      y: {
        border: { display: false },
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: {
          color: '#94a3b8',
          font: { size: 10 },
          precision: 0,
          stepSize: 1,
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
}

export { HeatMap } from './InfluencerHeatMap';

// --- 7. Complex Mixed ROI/Performance Chart ---
// 3 toggle modes: ROI Overview (bar+line mixed), By Channel (grouped bar), Trend Analysis (multi-area)
export function MixedROIChart({ mode = 'roi' }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

  // Mode 1: ROI Overview — Bar (Spend) + Line (ROI %) mixed
  const roiData = {
    labels: months,
    datasets: [
      {
        type: 'bar',
        label: 'Ad Spend ($)',
        data: [12000, 19000, 15000, 22000, 18000, 25000, 21000, 28000],
        backgroundColor: 'rgba(99, 102, 241, 0.75)',
        borderRadius: 6,
        yAxisID: 'yLeft',
        order: 2,
        barPercentage: 0.55,
      },
      {
        type: 'bar',
        label: 'Revenue ($)',
        data: [38000, 62000, 49000, 78000, 58000, 89000, 74000, 102000],
        backgroundColor: 'rgba(16, 185, 129, 0.65)',
        borderRadius: 6,
        yAxisID: 'yLeft',
        order: 2,
        barPercentage: 0.55,
      },
      {
        type: 'line',
        label: 'ROI %',
        data: [3.2, 3.3, 3.3, 3.5, 3.2, 3.6, 3.5, 3.6],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        borderWidth: 2.5,
        yAxisID: 'yRight',
        order: 1,
      },
    ],
  };

  // Mode 2: By Channel — Grouped bars (Instagram, TikTok, YouTube)
  const channelData = {
    labels: months,
    datasets: [
      {
        label: 'Instagram',
        data: [4200, 7800, 5600, 9200, 6800, 11000, 8900, 13200],
        backgroundColor: '#6366f1',
        borderRadius: 5,
        barPercentage: 0.8,
        categoryPercentage: 0.65,
      },
      {
        label: 'TikTok',
        data: [3100, 5200, 4100, 6800, 5200, 8300, 6600, 9800],
        backgroundColor: '#06b6d4',
        borderRadius: 5,
        barPercentage: 0.8,
        categoryPercentage: 0.65,
      },
      {
        label: 'YouTube',
        data: [2200, 3900, 3100, 5100, 3900, 6200, 5000, 7400],
        backgroundColor: '#f43f5e',
        borderRadius: 5,
        barPercentage: 0.8,
        categoryPercentage: 0.65,
      },
    ],
  };

  // Mode 3: Trend Analysis — 3 filled area lines (Impressions, Clicks, Conversions)
  const trendData = {
    labels: months,
    datasets: [
      {
        label: 'Impressions (K)',
        data: [180, 220, 195, 280, 240, 320, 295, 380],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: 'white',
        pointBorderWidth: 1.5,
        borderWidth: 2.5,
      },
      {
        label: 'Clicks (K)',
        data: [22, 28, 24, 36, 30, 42, 38, 50],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: 'white',
        pointBorderWidth: 1.5,
        borderWidth: 2.5,
      },
      {
        label: 'Conversions',
        data: [1.8, 2.3, 2.0, 2.9, 2.4, 3.4, 3.1, 4.1],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: 'white',
        pointBorderWidth: 1.5,
        borderWidth: 2.5,
      },
    ],
  };

  const roiOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 8, font: { size: 11 }, color: '#64748b', padding: 16 }
      },
      tooltip: {
        ...sharedTooltip,
        callbacks: {
          label: (ctx) => {
            if (ctx.dataset.label === 'ROI %') return ` ROI: ${ctx.parsed.y}x`;
            return ` ${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } },
      yLeft: {
        type: 'linear', position: 'left',
        border: { display: false },
        grid: { color: '#f1f5f9' },
        ticks: { color: '#94a3b8', font: { size: 10 }, callback: (v) => `$${(v/1000).toFixed(0)}K` }
      },
      yRight: {
        type: 'linear', position: 'right',
        border: { display: false },
        grid: { drawOnChartArea: false },
        ticks: { color: '#f59e0b', font: { size: 10, weight: '600' }, callback: (v) => `${v}x` }
      },
    },
  };

  const channelOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 8, font: { size: 11 }, color: '#64748b', padding: 16 }
      },
      tooltip: {
        ...sharedTooltip,
        callbacks: { label: (ctx) => ` ${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString()}` }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } },
      y: {
        border: { display: false },
        grid: { color: '#f1f5f9' },
        ticks: { color: '#94a3b8', font: { size: 10 }, callback: (v) => `$${(v/1000).toFixed(0)}K` }
      },
    },
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 8, font: { size: 11 }, color: '#64748b', padding: 16 }
      },
      tooltip: sharedTooltip,
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } },
      y: {
        border: { display: false },
        grid: { color: '#f1f5f9' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      },
    },
  };

  if (mode === 'channel') return <Bar data={channelData} options={channelOptions} />;
  if (mode === 'trend')   return <Line data={trendData} options={trendOptions} />;
  return <Bar data={roiData} options={roiOptions} />;
}
