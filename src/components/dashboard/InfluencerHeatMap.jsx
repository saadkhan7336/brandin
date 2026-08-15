import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { MapPin } from 'lucide-react';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const categoryColors = {
  fashion: '#ec4899',
  beauty: '#f43f5e',
  lifestyle: '#f59e0b',
  travel: '#10b981',
  tech: '#6366f1',
  technology: '#6366f1',
  gaming: '#06b6d4',
  fitness: '#22c55e',
  food: '#f97316',
  'food & beverage': '#f97316',
  entertainment: '#8b5cf6',
  music: '#a855f7',
  finance: '#0ea5e9',
  sports: '#14b8a6',
  other: '#64748b',
};

const categoryEmoji = {
  fashion: '👗',
  beauty: '💄',
  lifestyle: '🌿',
  travel: '🗺️',
  tech: '💻',
  technology: '💻',
  gaming: '🎮',
  fitness: '💪',
  food: '🍽️',
  'food & beverage': '🍽️',
  entertainment: '🎵',
  music: '🎵',
  finance: '📈',
  sports: '🏅',
  other: '✨',
};

const colorForCategory = (label = '') => categoryColors[label.toLowerCase()] || '#3b82f6';
const emojiForCategory = (label = '') => categoryEmoji[label.toLowerCase()] || '✨';

function projectionFor(markers) {
  if (!markers.length) return { scale: 420, center: [69, 30.5] };
  const lons = markers.map((m) => m.coordinates[0]);
  const lats = markers.map((m) => m.coordinates[1]);
  const center = [(Math.min(...lons) + Math.max(...lons)) / 2, (Math.min(...lats) + Math.max(...lats)) / 2];
  const span = Math.max(Math.max(...lons) - Math.min(...lons), Math.max(...lats) - Math.min(...lats), 0.8);
  const scale = span < 4 ? 900 : span < 12 ? 520 : span < 30 ? 240 : 110;
  return { scale, center };
}

export function HeatMap({ markers = [], categories = [], viewMode = 'density', locatedCount = 0, onMarkerClick }) {
  const [tooltip, setTooltip] = React.useState(null);
  const mapMarkers = Array.isArray(markers) ? markers.filter((m) => Array.isArray(m.coordinates) && m.coordinates.length === 2) : [];
  const maxCount = Math.max(1, ...mapMarkers.map((m) => m.count || 1));
  const getSize = (count) => 10 + (count / maxCount) * 22;

  if (viewMode === 'category') {
    const rows = [...(categories || [])].sort((a, b) => b.count - a.count);
    const total = rows.reduce((s, n) => s + n.count, 0);
    const top = rows[0];

    if (!rows.length || total === 0) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
          <p className="text-sm font-semibold text-slate-600">No influencer niches yet</p>
          <p className="text-xs text-slate-400 mt-1">When creators join, their categories land here.</p>
        </div>
      );
    }

    return (
      <div className="w-full h-full flex flex-col gap-1 overflow-y-auto px-1 pt-1 pb-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}>
        <div className="flex items-center gap-4 pb-2 mb-1 border-b border-slate-100 shrink-0">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Top niche</p>
            <p className="text-xs font-extrabold text-[#1e293b] truncate">{emojiForCategory(top.label)} {top.label}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Creators</p>
            <p className="text-xs font-extrabold text-[#1e293b]">{total}</p>
          </div>
        </div>
        {rows.map((niche) => {
          const pct = Math.round((niche.count / total) * 100);
          const color = colorForCategory(niche.label);
          return (
            <div key={niche.label} className="group flex items-center gap-3 px-2 py-2 rounded-2xl hover:bg-slate-50 transition-all duration-150">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm shadow-sm" style={{ backgroundColor: `${color}18`, border: `1.5px solid ${color}30` }}>
                {emojiForCategory(niche.label)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-[11px] font-bold text-[#1e293b] truncate leading-none">{niche.label}</p>
                  <span className="text-[11px] font-extrabold text-[#1e293b] ml-2 shrink-0">{pct}%</span>
                </div>
                <div className="relative h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{niche.count} influencer{niche.count === 1 ? '' : 's'}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const { scale, center } = projectionFor(mapMarkers);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-[#eef4ff] to-[#e8eef9]">
      <ComposableMap projection="geoMercator" projectionConfig={{ scale, center }} style={{ width: '100%', height: '100%' }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#dbe4f5"
                stroke="#c5d0e8"
                strokeWidth={0.4}
                style={{ default: { outline: 'none' }, hover: { outline: 'none', fill: '#c7d2fe' }, pressed: { outline: 'none' } }}
              />
            ))
          }
        </Geographies>

        {mapMarkers.map((marker) => {
          const size = getSize(marker.count);
          const color = colorForCategory(marker.topCategory);
          return (
            <Marker
              key={`${marker.name}-${marker.coordinates.join(',')}`}
              coordinates={marker.coordinates}
              onMouseEnter={() => setTooltip({ marker })}
              onMouseLeave={() => setTooltip(null)}
              onClick={() => onMarkerClick?.(marker)}
            >
              <circle r={size * 2.1} fill={color} opacity={0.08} />
              <circle r={size * 1.4} fill={color} opacity={0.2} />
              <circle r={size} fill={color} opacity={0.9} stroke="white" strokeWidth={1.5} style={{ cursor: 'pointer' }} />
              <text textAnchor="middle" dominantBaseline="central" style={{ fontSize: size > 16 ? '9px' : '8px', fontWeight: '800', fill: 'white', pointerEvents: 'none' }}>
                {marker.count}
              </text>
              <text textAnchor="middle" y={-(size * 1.8 + 4)} style={{ fontFamily: 'system-ui', fill: '#1e293b', fontSize: '8.5px', fontWeight: '700', pointerEvents: 'none' }}>
                {marker.name}
              </text>
            </Marker>
          );
        })}
      </ComposableMap>

      {!mapMarkers.length && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 bg-white/40 backdrop-blur-[1px]">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <MapPin className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No pins yet</p>
          <p className="text-xs text-slate-500 mt-1 max-w-[220px]">Influencers drop a live map pin in Settings. Those cities show up here.</p>
        </div>
      )}

      {tooltip && (
        <div className="absolute z-50 pointer-events-none" style={{ bottom: '12px', left: '50%', transform: 'translateX(-50%)' }}>
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 px-4 py-3 min-w-[200px]">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-sm font-bold text-[#1e293b]">{tooltip.marker.name}</p>
              {tooltip.marker.topCategory && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: colorForCategory(tooltip.marker.topCategory) }}>
                  {tooltip.marker.topCategory}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div>
                <p className="text-[10px] font-medium text-slate-400">Influencers</p>
                <p className="text-sm font-bold text-[#1e293b]">{tooltip.marker.count}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400">Avg rating</p>
                <p className="text-sm font-bold text-[#1e293b]">{tooltip.marker.avgRating ? `★ ${tooltip.marker.avgRating}` : '—'}</p>
              </div>
              {tooltip.marker.country && (
                <div className="col-span-2">
                  <p className="text-[10px] font-medium text-slate-400">Region</p>
                  <p className="text-xs font-semibold text-slate-600">{[tooltip.marker.city, tooltip.marker.country].filter(Boolean).join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-slate-100 shadow-sm">
        <p className="text-[9px] font-semibold text-slate-500">
          {locatedCount || mapMarkers.reduce((s, m) => s + (m.count || 0), 0)} pinned · size = count
        </p>
      </div>
    </div>
  );
}

export default HeatMap;
