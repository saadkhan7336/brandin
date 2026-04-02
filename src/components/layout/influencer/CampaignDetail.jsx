import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Calendar, DollarSign, CheckCircle,
  Check, Send, Users, LayoutDashboard, Target, TrendingUp
} from "lucide-react";
import api from "../../../services/api";
import ApplyCampaignModal from "./ApplyCampaignModal";

const CampaignDetail = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApply, setShowApply] = useState(false);
  const [applied, setApplied] = useState(false);
  
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/campaigns/${campaignId}`);
        setCampaign(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Campaign not found");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [campaignId]);
 
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
 
  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500">{error || "Campaign not found"}</p>
        <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline">
          Go back
        </button>
      </div>
    );
  }
 
  const brandName = campaign.brandProfile?.brandname || campaign.brandUser?.fullname || "Brand";
  const brandLogo = campaign.brandProfile?.logo || campaign.brandUser?.profilePic;
 
  const startDate = campaign.campaignTimeline?.startDate
    ? new Date(campaign.campaignTimeline.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;
  const endDate = campaign.campaignTimeline?.endDate
    ? new Date(campaign.campaignTimeline.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  // Goals and Requirements from DB
  const goalsList = campaign.goals && campaign.goals.length > 0 
    ? campaign.goals 
    : [];
  
  const requirementsList = campaign.additionalRequirements 
    ? campaign.additionalRequirements.split(".").filter(Boolean)
    : [];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 pb-12">
      
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} /> Back to Search
          </button>
        </div>
      </div>
 
      {/* Hero Header Area */}
      <div className="w-full bg-slate-900 h-64 relative border-b border-gray-200">
        {campaign.image ? (
          <img src={campaign.image} alt={campaign.name} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-900 to-indigo-900 absolute inset-0"></div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative -mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 
          {/* ── Left: Campaign Details ─────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
 
            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm relative pt-12">
              {/* Floating Logo */}
              <div className="absolute -top-10 left-8">
                {brandLogo ? (
                  <img src={brandLogo} alt={brandName} className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-sm bg-white" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-sm flex items-center justify-center text-blue-600 font-bold text-3xl">
                    {brandName[0]}
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">{campaign.name}</h1>
                  <p className="text-gray-500 font-medium">by <span className="text-gray-900">{brandName}</span></p>
                </div>
                <div className="flex gap-2">
                  {campaign.status === "active" && (
                    <span className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full border border-blue-100 flex-shrink-0 h-fit">
                      Active
                    </span>
                  )}
                  {campaign.industry && (
                    <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full border border-gray-200 flex-shrink-0 h-fit">
                      {campaign.industry}
                    </span>
                  )}
                </div>
              </div>

              {campaign.description && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">About This Campaign</h2>
                  <p className="text-gray-600 leading-relaxed">{campaign.description}</p>
                </div>
              )}
            </div>

            {/* Campaign Goals */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Campaign Goals</h2>
              <ul className="space-y-3">
                {goalsList.map((goal, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 bg-green-100 text-green-600 p-0.5 rounded-full flex-shrink-0">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <span className="text-gray-700">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements & Deliverables */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-8">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Requirements</h2>
                <ol className="space-y-4">
                  {requirementsList.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="text-gray-700 leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {campaign.deliverables && (
                <div className="pt-8 border-t border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Expected Deliverables</h2>
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 whitespace-pre-line leading-relaxed">
                    {campaign.deliverables}
                  </div>
                </div>
              )}
            </div>
          </div>
 
          {/* ── Right: Sidebar ────────────────────────────────────── */}
          <div className="space-y-6 pt-12 lg:pt-0">
 
            {/* Action Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Ready to Apply?</h3>
              
              {applied ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <CheckCircle size={28} className="text-green-500 mx-auto mb-2" />
                  <p className="text-green-800 font-semibold text-sm">Application sent!</p>
                  <p className="text-green-600 text-xs mt-1">Check your dashboard for updates.</p>
                </div>
              ) : (
                <button
                  onClick={() => setShowApply(true)}
                  disabled={campaign.status !== "active"}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Send size={18} />
                  {campaign.status === "active" ? "Apply to Campaign" : "Not Accepting Applications"}
                </button>
              )}

              <div className="mt-6 pt-5 border-t border-gray-100 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Budget</p>
                    <p className="font-bold text-gray-900">
                      ${campaign.budget?.min?.toLocaleString()} - ${campaign.budget?.max?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Campaign Dates</p>
                    <p className="font-bold text-gray-900">
                      {startDate} - {endDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
 
            {/* Campaign Details Info List */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-5">Campaign Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <LayoutDashboard size={20} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Platforms</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {campaign.platform?.map((p) => (
                        <span key={p} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded capitalize font-medium">{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 pt-4 border-t border-gray-100">
                  <Target size={20} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Target Audience</p>
                    <p className="text-sm font-medium text-gray-800">{campaign.targetAudience || "General"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign Stats Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Campaign Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                  <Users size={24} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{campaign.applicantsCount || 0}</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">Applicants</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                  <TrendingUp size={24} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-900 mt-1">{campaign.competitionLevel || "Low"}</p>
                  <p className="text-xs text-gray-500 mt-2 font-medium">Competition</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
 
      {showApply && (
        <ApplyCampaignModal
          campaign={campaign}
          onClose={() => setShowApply(false)}
          onSuccess={() => {
            setShowApply(false);
            setApplied(true);
          }}
        />
      )}
    </div>
  );
};
 
export default CampaignDetail;