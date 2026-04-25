import React, { useEffect, useState } from "react";
import { getFilteredInfluencers } from "../../services/aiService";
import { Users, CheckCircle, Search, AlertCircle } from "lucide-react";

export default function FilteredInfluencers({ campaignId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getFilteredInfluencers(campaignId)
      .then((res) => {
        if (isMounted) {
          setData(res.data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to fetch top influencers.");
          setLoading(false);
        }
      });
      
    return () => { isMounted = false; };
  }, [campaignId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-2xl flex flex-col items-center">
        <AlertCircle className="w-8 h-8 mb-2 opacity-80" />
        <p className="font-semibold text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-white text-red-500 rounded-xl shadow-sm text-xs font-bold"
        >
          Retry Search
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-100">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-900 font-bold">No Influencers Found</p>
        <p className="text-gray-500 text-sm mt-1">Try relaxing your campaign budget bounds.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((inf) => (
        <div key={inf._id} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-indigo-50 flex items-center justify-center">
              {inf.coverImage ? (
                <img src={inf.coverImage} alt={inf.username} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-indigo-300">{inf.username.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 truncate max-w-[200px]">{inf.username}</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {inf.category || 'Creator'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 p-3 bg-gray-50 rounded-xl">
             <div className="text-center w-full">
               <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Followers</p>
               <p className="text-sm font-bold text-gray-900">
                  {inf.followersCount > 1000 ? (inf.followersCount / 1000).toFixed(1) + 'K' : inf.followersCount}
               </p>
             </div>
             <div className="w-px h-6 bg-gray-200 mx-2"></div>
             <div className="text-center w-full">
               <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Rating</p>
               <p className="text-sm font-bold text-gray-900">{inf.averageRating ? inf.averageRating.toFixed(1) : 'New'}</p>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}
