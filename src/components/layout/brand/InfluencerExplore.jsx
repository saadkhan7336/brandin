import React, { useEffect, useState, useCallback } from "react";
import { 
  Search, Filter, Users, MapPin, Star, Instagram, 
  Send, CheckCircle, TrendingUp, DollarSign, X 
} from "lucide-react";
import api from "../../../services/api";

const InfluencerCard = ({ influencer, onSendRequest }) => {
  const name = influencer.userFullname || influencer.username || "Influencer";
  const profilePic = influencer.userProfilePic;
  const mainPlatform = influencer.platforms?.[0] || {};

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 p-5 space-y-4 flex flex-col h-full group">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {profilePic ? (
            <img src={profilePic} alt={name} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">
              {name[0]}
            </div>
          )}
          <div>
            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
              {name}
              {influencer.isVerified && (
                <CheckCircle size={14} fill="#3b82f6" stroke="white" />
              )}
            </h3>
            <p className="text-xs text-gray-500 font-medium capitalize">{influencer.category || "Content Creator"}</p>
          </div>
        </div>
      </div>

      {/* About */}
      <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
        {influencer.about || "Experienced influencer focused on high-quality content creation and authentic engagement."}
      </p>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-50">
        <div className="flex items-center gap-2 text-gray-600">
          <Users size={14} className="text-gray-400" />
          <span className="text-xs font-semibold">{(mainPlatform.followers || 0).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Star size={14} className="text-amber-500 fill-amber-500" />
          <span className="text-xs font-semibold">{influencer.averageRating || "4.5"}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={14} className="text-gray-400" />
          <span className="text-xs font-medium truncate">{influencer.location || "USA"}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign size={14} className="text-green-500" />
          <span className="text-xs font-semibold">From ${influencer.minPrice || "50"}</span>
        </div>
      </div>

      {/* Platform Tags */}
      <div className="flex flex-wrap gap-1.5">
        {influencer.platforms?.map((p, idx) => (
          <span key={idx} className="text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-500 px-2 py-0.5 rounded border border-gray-100 flex items-center gap-1">
            <Instagram size={10} /> {p.name}
          </span>
        ))}
      </div>

      {/* Footer Button */}
      <button 
        onClick={() => onSendRequest(influencer)}
        className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 mt-auto"
      >
        <Send size={15} />
        Send Collaboration Request
      </button>
    </div>
  );
};

const InfluencerExplore = () => {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const fetchInfluencers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: 1, limit: 12 });
      if (search) params.append("search", search);
      if (category !== "All") params.append("category", category);

      // Using the brand-facing endpoint
      const res = await api.get(`/brands/influencers?${params.toString()}`);
      setInfluencers(res.data.data.influencers || []);
    } catch (err) {
      setError("Failed to load influencers");
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    fetchInfluencers();
  }, [fetchInfluencers]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Find Influencers</h1>
          <p className="text-sm text-gray-500">Discover top creators for your next campaign</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or niche..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : influencers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-gray-900 font-bold mb-1">No influencers found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {influencers.map(influencer => (
            <InfluencerCard 
              key={influencer._id} 
              influencer={influencer} 
              onSendRequest={(inf) => console.log("Request to:", inf)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InfluencerExplore;
