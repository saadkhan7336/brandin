import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Calendar, DollarSign, CheckCircle,
  Check, Send, Users, LayoutDashboard, Target, TrendingUp
} from "lucide-react";
import api from "../../../services/api";
import collaborationService from "../../../services/collaborationService";
import ApplyCampaignModal from "./ApplyCampaignModal";

const CampaignDetail = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApply, setShowApply] = useState(false);
  const [applied, setApplied] = useState(false);
  const [activeCollab, setActiveCollab] = useState(null);
  
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [campaignRes, requestsRes, collabsRes] = await Promise.all([
          api.get(`/campaigns/${campaignId}`),
          collaborationService.getRequests({ type: "sent", limit: 100 }),
          collaborationService.getAll({ status: "active", limit: 100 })
        ]);

        setCampaign(campaignRes.data.data);

        // Check if applied
        if (requestsRes.success) {
          const hasApplied = requestsRes.data.requests?.some(
            r => (r.campaign?._id || r.campaign) === campaignId
          );
          setApplied(hasApplied);
        }

        // Check if active collaboration
        if (collabsRes.success) {
          const collab = collabsRes.data.collaborations?.find(
            c => (c.campaign?._id || c.campaign) === campaignId
          );
          setActiveCollab(collab);
        }
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
 
  const brandName = campaign.brandProfile?.brandname || campaign.brand?.fullname || "Brand";
  const brandLogo = campaign.brandProfile?.logo || campaign.brand?.profilePic;
 
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
      
      {/* Hero Header Area - Brand Cover Image with Back Button Overlay */}
      <div className="relative w-full h-48 sm:h-64 overflow-hidden bg-slate-900">
        {campaign.brand?.coverPic ? (
          <img 
            src={campaign.brand.coverPic} 
            alt="Brand Cover" 
            className="w-full h-full object-cover opacity-70" 
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
        )}
        
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        {/* Floating Back Button Overlay */}
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-semibold hover:bg-white/20 transition-all border border-white/20 shadow-lg"
          >
            <ArrowLeft size={18} /> 
            <span className="hidden sm:inline">Back to Search</span>
          </button>
        </div>

        {/* Gradient Bottom Fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
      </div>

      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 relative -mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 
          {/* ── Left: Campaign Details ─────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
 
            {/* Header Card */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm relative pt-24 sm:pt-28">
              {/* Floating Campaign/Brand Card - Primary Visual Focus */}
              <div className="absolute -top-20 left-8">
                <div className="w-40 h-40 rounded-3xl bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden transition-transform hover:scale-[1.02] duration-300">
                  {campaign.image || brandLogo ? (
                    <img 
                      src={campaign.image || brandLogo} 
                      alt={campaign.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-5xl">{brandName[0]}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-3 tracking-tight">
                    {campaign.name}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-sm">by</span>
                    <button 
                      onClick={() => navigate(`/influencer/search/brand/${campaign.brand?._id}`)}
                      className="font-bold text-gray-900 border-b-2 border-blue-500/20 hover:border-blue-500 transition-colors cursor-pointer text-left"
                    >
                      {brandName}
                    </button>
                    <CheckCircle size={14} className="text-blue-500" fill="currentColor" stroke="white" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2 md:pt-0">
                  {campaign.status === "active" && (
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  )}
                  {campaign.industry && (
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-blue-100 shadow-sm">
                      {campaign.industry}
                    </span>
                  )}
                </div>
              </div>

              {campaign.description && (
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <LayoutDashboard size={18} className="text-blue-500" />
                    <h2 className="text-lg font-bold text-gray-900">About This Campaign</h2>
                  </div>
                  <p className="text-gray-600 leading-7 text-[15px] max-w-none">{campaign.description}</p>
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
              
              {activeCollab ? (
                <button
                  onClick={() => navigate(`/influencer/collaboration/${activeCollab._id}`)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-100"
                >
                  <LayoutDashboard size={18} />
                  Go to Collaboration
                </button>
              ) : applied ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold mb-1">
                    <CheckCircle size={20} className="text-emerald-500" />
                    <span>Application Sent</span>
                  </div>
                  <p className="text-emerald-600 text-[11px] leading-tight">
                    The brand is currently reviewing your profile. You'll be notified of any updates.
                  </p>
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