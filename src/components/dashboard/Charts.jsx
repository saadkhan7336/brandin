import React, { useState, useEffect, useRef } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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

// --- 2. Bar Chart for Brand Spending ---
export function StackedBarChart({ labels, dataset1, dataset2 }) {
  const chartData = {
    labels: labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Instagram',
        data: dataset1 || [4000, 3000, 2000, 2780, 1890, 2390, 3490],
        backgroundColor: '#3b82f6',
        borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 },
        barPercentage: 0.6,
        categoryPercentage: 0.8
      },
      {
        label: 'Facebook',
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
        stacked: true, 
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11, family: 'system-ui' } }
      },
      y: { 
        stacked: true, 
        grid: { color: '#f1f5f9' }, 
        border: { display: false },
        ticks: { 
          color: '#64748b', 
          font: { size: 11, family: 'system-ui' },
          callback: function(value) {
            return value.toLocaleString();
          }
        }
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

// --- 2b. Line version of Brand Spending (toggle) ---
export function SpendingLineChart({ labels, dataset1, dataset2 }) {
  const chartData = {
    labels: labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Instagram',
        data: dataset1 || [4000, 3000, 2000, 2780, 1890, 2390, 3490],
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
        label: 'Facebook',
        data: dataset2 || [2400, 1398, 9800, 3908, 4800, 3800, 4300],
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
          callback: (v) => v.toLocaleString()
        }
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

// --- 3. Doughnut Chart for Stats ---
export function StatsDoughnutChart({ data, labels, colors }) {
  const chartData = {
    labels: labels || ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        data: data || [300, 50, 100],
        backgroundColor: colors || ['#10b981', '#3b82f6', '#f59e0b'],
        borderWidth: 0,
        cutout: '75%',
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
          usePointStyle: false,
          boxWidth: 20,
          boxHeight: 8,
          font: { size: 11, family: 'system-ui' },
          color: '#475569',
          padding: 20
        }
      },
      tooltip: sharedTooltip,
    }
  };

  return <Doughnut data={chartData} options={options} />;
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

// --- 4. Multi-Line Frequency Chart (new) ---
// Matches the "3 colored lines" screenshot
export function MultiLineChart({ labels }) {
  const months = labels || [
    'Dec 22', 'Feb 23', 'Apr 23', 'Jun 23', 'Aug 23', 'Oct 23', 'Dec 23',
    'Feb 24', 'Apr 24', 'Jun 24', 'Aug 24', 'Oct 24', 'Dec 24'
  ];

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Instagram',
        data: [180, 140, 370, 120, 130, 140, 150, 280, 100, 200, 250, 120, 340],
        borderColor: '#6366f1',
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
      {
        label: 'Facebook',
        data: [70, 120, 110, 140, 150, 120, 100, 130, 100, 140, 200, 290, 130],
        borderColor: '#38bdf8',
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
      {
        label: 'TikTok',
        data: [150, 100, 130, 160, 200, 180, 160, 120, 200, 100, 130, 230, 250],
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
          label: (ctx) => ` ${ctx.dataset.label}: $${ctx.parsed.y}`
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
        grid: { color: '#f1f5f9' },
        ticks: {
          color: '#94a3b8',
          font: { size: 10 },
          callback: (v) => `$${v}`
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
}

// --- 5. Area Frequency Chart (new) ---
// Matches the filled purple + gray comparison line screenshot
export function AreaFrequencyChart({ labels }) {
  const months = labels || [
    'Dec 22', 'Mar 23', 'Jun 23', 'Sep 23', 'Dec 23', 'Mar 24', 'Jun 24', 'Sep 24', 'Dec 24'
  ];

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'This Period',
        data: [5000, 9000, 11000, 10000, 21000, 8000, 10000, 15000, 17000],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2.5,
      },
      {
        label: 'Last Period',
        data: [7000, 5000, 9000, 12000, 7000, 13000, 8000, 11000, 10000],
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
          label: (ctx) => ` ${ctx.dataset.label}: ${(ctx.parsed.y / 1000).toFixed(1)}K`
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
        grid: { color: '#f1f5f9' },
        ticks: {
          color: '#94a3b8',
          font: { size: 10 },
          callback: (v) => v >= 1000 ? `${v / 1000}K` : v
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
}

// --- 6. Enhanced Interactive Heat Map ---
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Rich marker data with influencer stats per region
const defaultMarkerData = [
  {
    name: "New York",       coordinates: [-74.006, 40.7128],   count: 128, avgRating: 4.8,
    topCategory: "Fashion",  growth: "+12%",  spend: "$24.5k",  markerOffset: -22, category: "fashion"
  },
  {
    name: "London",         coordinates: [-0.1276, 51.5072],   count: 95,  avgRating: 4.7,
    topCategory: "Lifestyle", growth: "+8%",  spend: "$18.2k", markerOffset: -22, category: "lifestyle"
  },
  {
    name: "Dubai",          coordinates: [55.2708, 25.2048],   count: 72,  avgRating: 4.9,
    topCategory: "Luxury",   growth: "+22%", spend: "$31.0k",  markerOffset: -22, category: "luxury"
  },
  {
    name: "Mumbai",         coordinates: [72.8777, 19.0760],   count: 110, avgRating: 4.6,
    topCategory: "Tech",     growth: "+18%", spend: "$12.8k",  markerOffset: 30,  category: "tech"
  },
  {
    name: "Tokyo",          coordinates: [139.6917, 35.6895],  count: 88,  avgRating: 4.8,
    topCategory: "Gaming",   growth: "+15%", spend: "$19.4k",  markerOffset: 30,  category: "gaming"
  },
  {
    name: "São Paulo",      coordinates: [-46.6333, -23.5505], count: 64,  avgRating: 4.5,
    topCategory: "Beauty",   growth: "+9%",  spend: "$9.6k",   markerOffset: 30,  category: "beauty"
  },
  {
    name: "Sydney",         coordinates: [151.2093, -33.8688], count: 51,  avgRating: 4.7,
    topCategory: "Travel",   growth: "+11%", spend: "$14.1k",  markerOffset: 30,  category: "travel"
  },
  {
    name: "Berlin",         coordinates: [13.4050, 52.5200],   count: 43,  avgRating: 4.6,
    topCategory: "Music",    growth: "+6%",  spend: "$8.3k",   markerOffset: -22, category: "music"
  },
];

const categoryColors = {
  fashion:   '#ec4899',
  lifestyle: '#f59e0b',
  luxury:    '#a855f7',
  tech:      '#6366f1',
  gaming:    '#06b6d4',
  beauty:    '#f43f5e',
  travel:    '#10b981',
  music:     '#8b5cf6',
};

export function HeatMap({ markers, viewMode = 'density' }) {
  const [tooltip, setTooltip] = React.useState(null); // { x, y, data }
  const mapMarkers = markers || defaultMarkerData;

  // Bubble size based on count
  const maxCount = Math.max(...mapMarkers.map(m => m.count));
  const getSize = (count) => 6 + (count / maxCount) * 18;

  const getColor = (marker) => {
    if (viewMode === 'category') return categoryColors[marker.category] || '#6366f1';
    // Density: indigo with intensity
    const intensity = marker.count / maxCount;
    if (intensity > 0.8) return '#4f46e5';
    if (intensity > 0.5) return '#6366f1';
    if (intensity > 0.3) return '#818cf8';
    return '#a5b4fc';
  };

  return (
    <div className="relative w-full h-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 100, center: [10, 20] }}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#e8eaf6"
                stroke="#c5cae9"
                strokeWidth={0.4}
                style={{
                  default: { outline: "none" },
                  hover:   { outline: "none", fill: "#d1d5db" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {mapMarkers.map((marker) => {
          const size = getSize(marker.count);
          const color = getColor(marker);
          return (
            <Marker
              key={marker.name}
              coordinates={marker.coordinates}
              onMouseEnter={(e) => {
                setTooltip({ marker });
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              {/* Outer pulse ring */}
              <circle r={size + 5} fill={color} opacity={0.15} />
              {/* Main bubble */}
              <circle
                r={size}
                fill={color}
                opacity={0.85}
                stroke="white"
                strokeWidth={1.5}
                style={{ cursor: 'pointer', transition: 'r 0.2s' }}
              />
              {/* Count label inside bubble */}
              {size > 14 && (
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{ fontSize: '8px', fontWeight: 'bold', fill: 'white', pointerEvents: 'none' }}
                >
                  {marker.count}
                </text>
              )}
              {/* Region name label */}
              <text
                textAnchor="middle"
                y={marker.markerOffset}
                style={{
                  fontFamily: "system-ui",
                  fill: "#1e293b",
                  fontSize: "9px",
                  fontWeight: "700",
                  pointerEvents: 'none',
                  textShadow: '0 0 3px white'
                }}
              >
                {marker.name}
              </text>
            </Marker>
          );
        })}
      </ComposableMap>

      {/* Tooltip Popup */}
      {tooltip && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{ bottom: '12px', left: '50%', transform: 'translateX(-50%)' }}
        >
          <div className="bg-white rounded-xl shadow-xl border border-[#e2e8f0] px-4 py-3 min-w-[220px]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-[#1e293b]">{tooltip.marker.name}</p>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white capitalize"
                style={{ backgroundColor: categoryColors[tooltip.marker.category] || '#6366f1' }}
              >
                {tooltip.marker.topCategory}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <div>
                <p className="text-[10px] font-medium text-slate-400">Influencers</p>
                <p className="text-sm font-bold text-[#1e293b]">{tooltip.marker.count}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400">Avg Rating</p>
                <p className="text-sm font-bold text-[#1e293b]">⭐ {tooltip.marker.avgRating}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400">Total Spend</p>
                <p className="text-sm font-bold text-emerald-600">{tooltip.marker.spend}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400">Growth</p>
                <p className="text-sm font-bold text-blue-600">{tooltip.marker.growth}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Legend (only in category mode) */}
      {viewMode === 'category' && (
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 border border-slate-100 shadow-sm">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Categories</p>
          <div className="flex flex-col gap-1">
            {Object.entries(categoryColors).map(([cat, color]) => (
              <div key={cat} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[9px] font-medium text-slate-600 capitalize">{cat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Density Legend (density mode) */}
      {viewMode === 'density' && (
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-slate-100 shadow-sm">
          <p className="text-[9px] font-semibold text-slate-400 mb-1">Bubble size = influencer count</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#a5b4fc]" />
              <span className="text-[9px] text-slate-500">Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#6366f1]" />
              <span className="text-[9px] text-slate-500">Mid</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-[#4f46e5]" />
              <span className="text-[9px] text-slate-500">High</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
