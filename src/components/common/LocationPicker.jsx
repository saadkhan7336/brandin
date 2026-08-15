import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Search, X, Loader2, Plus, Minus } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const pinIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DEFAULT_CENTER = [30.3753, 69.3451];
const emptyPlace = () => ({ formatted: '', lat: null, lng: null, city: '', country: '' });

export default function LocationPicker({ value, onChange, placeholder = 'Search city, area, or address...' }) {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [query, setQuery] = useState(value?.formatted || '');
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [open, setOpen] = useState(false);
  const [geoError, setGeoError] = useState('');

  useEffect(() => {
    if (value?.formatted && value.formatted !== query && !open) {
      setQuery(value.formatted);
    }
  }, [value?.formatted]); // eslint-disable-line react-hooks/exhaustive-deps

  const setPin = useCallback((lat, lng) => {
    const map = mapRef.current;
    if (!map || !map._mapPane) return;
    if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
    else markerRef.current = L.marker([lat, lng], { icon: pinIcon, draggable: true }).addTo(map);
    map.setView([lat, lng], Math.max(map.getZoom(), 13), { animate: true });
  }, []);

  const applyPlace = useCallback((place, pan = true) => {
    const next = {
      lat: place.lat,
      lng: place.lng,
      city: place.city || '',
      country: place.country || '',
      formatted: place.formatted || [place.city, place.country].filter(Boolean).join(', '),
    };
    onChange?.(next);
    setQuery(next.formatted);
    setSuggestions([]);
    setOpen(false);
    if (pan && next.lat != null) setPin(next.lat, next.lng);
  }, [onChange, setPin]);

  useEffect(() => {
    const el = mapEl.current;
    if (!el) return;

    let cancelled = false;
    let map;
    delete el._leaflet_id;

    const start = value?.lat && value?.lng ? [value.lat, value.lng] : DEFAULT_CENTER;
    const zoom = value?.lat ? 13 : 5;
    map = L.map(el, {
      scrollWheelZoom: true,
      zoomControl: false,
      attributionControl: true,
    }).setView(start, zoom);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19,
    }).addTo(map);

    if (value?.lat && value?.lng) {
      markerRef.current = L.marker([value.lat, value.lng], { icon: pinIcon, draggable: true }).addTo(map);
    }

    map.on('click', async (e) => {
      if (cancelled) return;
      const { lat, lng } = e.latlng;
      setPin(lat, lng);
      try {
        const res = await api.get(ENDPOINTS.geo.reverse, { params: { lat, lng } });
        applyPlace(res.data?.data?.place || { lat, lng, formatted: `${lat.toFixed(4)}, ${lng.toFixed(4)}` }, false);
      } catch {
        applyPlace({ lat, lng, city: '', country: '', formatted: `${lat.toFixed(4)}, ${lng.toFixed(4)}` }, false);
      }
    });

    const onDragEnd = async (e) => {
      const { lat, lng } = e.target.getLatLng();
      try {
        const res = await api.get(ENDPOINTS.geo.reverse, { params: { lat, lng } });
        applyPlace(res.data?.data?.place || { lat, lng, formatted: `${lat.toFixed(4)}, ${lng.toFixed(4)}` }, false);
      } catch {
        applyPlace({ lat, lng, city: '', country: '', formatted: `${lat.toFixed(4)}, ${lng.toFixed(4)}` }, false);
      }
    };
    map.on('layeradd', (ev) => {
      if (ev.layer?.dragging) ev.layer.on('dragend', onDragEnd);
    });

    mapRef.current = map;

    return () => {
      cancelled = true;
      mapRef.current = null;
      markerRef.current = null;
      try {
        if (map && map._mapPane) map.remove();
      } catch (_) { /* already gone */ }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.off('dragend');
      markerRef.current.on('dragend', async (e) => {
        const { lat, lng } = e.target.getLatLng();
        try {
          const res = await api.get(ENDPOINTS.geo.reverse, { params: { lat, lng } });
          applyPlace(res.data?.data?.place || { lat, lng, formatted: `${lat.toFixed(4)}, ${lng.toFixed(4)}` }, false);
        } catch {
          applyPlace({ lat, lng, city: '', country: '', formatted: `${lat.toFixed(4)}, ${lng.toFixed(4)}` }, false);
        }
      });
    }
  }, [applyPlace, value?.lat, value?.lng]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return undefined;
    }
    if (value?.formatted && q === value.formatted) return undefined;
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get(ENDPOINTS.geo.search, { params: { q } });
        setSuggestions(res.data?.data?.places || []);
        setOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('This browser does not support current location.');
      return;
    }
    setGeoError('');
    setOpen(false);
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setPin(lat, lng);
        try {
          const res = await api.get(ENDPOINTS.geo.reverse, { params: { lat, lng } });
          applyPlace(res.data?.data?.place || { lat, lng, formatted: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
        } catch {
          applyPlace({ lat, lng, city: '', country: '', formatted: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        if (err?.code === 1) setGeoError('Location permission blocked. Allow it from the address-bar lock icon, then try again.');
        else if (err?.code === 3) setGeoError('Location timed out. Try again.');
        else setGeoError('Could not read your current location.');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const zoomBy = (delta) => {
    const map = mapRef.current;
    if (!map || !map._mapPane) return;
    map.setZoom(map.getZoom() + delta);
  };

  const clear = () => {
    onChange?.(emptyPlace());
    setQuery('');
    setSuggestions([]);
    if (markerRef.current && mapRef.current?._mapPane) {
      mapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative z-0 isolate overflow-hidden rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgba(15,23,42,0.08)] bg-[#e8eef4]">
        <div className="absolute z-20 left-3 right-14 top-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              className="w-full h-11 bg-white border-0 rounded-lg pl-10 pr-10 text-sm font-medium text-gray-800 placeholder:text-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            {(searching || query) && (
              <button type="button" onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {searching ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
              </button>
            )}
            {open && (
              <div className="absolute z-30 mt-1.5 w-full bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                <button
                  type="button"
                  onClick={useMyLocation}
                  disabled={locating}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-3 border-b border-gray-100"
                >
                  {locating ? <Loader2 size={14} className="text-blue-600 animate-spin shrink-0" /> : <Navigation size={14} className="text-blue-600 shrink-0" />}
                  <span className="text-xs font-semibold text-blue-700">Use current location</span>
                </button>
                {suggestions.map((place, i) => (
                  <button
                    key={`${place.lat}-${place.lng}-${i}`}
                    type="button"
                    onClick={() => applyPlace(place)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start gap-3 border-b border-gray-50 last:border-0"
                  >
                    <MapPin size={14} className="text-red-500 mt-0.5 shrink-0" />
                    <span className="text-xs font-medium text-gray-700 leading-snug">{place.formatted}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div ref={mapEl} className="relative z-0 w-full h-[340px]" />

        <div className="absolute z-20 right-3 top-[4.5rem] flex flex-col overflow-hidden rounded-md shadow-md border border-gray-200 bg-white">
          <button type="button" onClick={() => zoomBy(1)} className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-gray-50 border-b border-gray-200" title="Zoom in">
            <Plus size={15} />
          </button>
          <button type="button" onClick={() => zoomBy(-1)} className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-gray-50" title="Zoom out">
            <Minus size={15} />
          </button>
        </div>

        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          title="Use current location"
          className="absolute z-20 right-3 bottom-3 w-10 h-10 rounded-md bg-white shadow-md border border-gray-200 text-blue-600 hover:bg-blue-50 flex items-center justify-center disabled:opacity-50"
        >
          {locating ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-1">
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold disabled:opacity-50"
        >
          {locating ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
          Use current location
        </button>
        <div className="flex items-center gap-2">
          {geoError && <p className="text-[11px] text-red-500">{geoError}</p>}
          {!geoError && <p className="text-[11px] text-slate-500">Search, tap the map, or use GPS — then Save location.</p>}
        </div>
      </div>
    </div>
  );
}
