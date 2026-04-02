import React, { useState, useRef, useEffect } from "react";
import { X, UploadCloud, File, CheckCircle, ChevronDown } from "lucide-react";
import api from "../../../services/api";

/**
 * Universal Apply / Send Request Modal.
 *
 * Props:
 *   campaign   – (optional) campaign object when opened from a campaign card
 *   brand      – (optional) { _id, brandname, logo, campaigns[] } when opened from a brand card/profile
 *   targetType – "campaign" | "brand"  (defaults to "campaign" when campaign prop is given)
 *   onClose    – callback to close the modal
 *   onSuccess  – callback after successful submission
 */
const ApplyCampaignModal = ({ campaign, brand, targetType: propTargetType, onClose, onSuccess }) => {
  // Determine target type automatically
  const targetType = propTargetType || (brand ? "brand" : "campaign");

  const [note, setNote] = useState("");
  const [proposedBudget, setProposedBudget] = useState("");
  const [portfolio, setPortfolio] = useState(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaign?._id || "");

  // Brand campaigns list (fetched when targetType === brand)
  const [brandCampaigns, setBrandCampaigns] = useState([]);
  const [fetchingCampaigns, setFetchingCampaigns] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef(null);

  // Derive display info
  const brandName =
    (targetType === "brand"
      ? brand?.brandname
      : campaign?.brandProfile?.brandname || campaign?.brandUser?.fullname) || "Brand";

  const brandLogo =
    targetType === "brand"
      ? brand?.logo
      : campaign?.brandProfile?.logo || campaign?.brandUser?.profilePic;

  // If opened from a brand, fetch that brand's active campaigns
  useEffect(() => {
    if (targetType === "brand" && brand?._id) {
      setFetchingCampaigns(true);
      api
        .get(`/brands/${brand._id}/public`)
        .then((res) => {
          const campaigns = res.data?.data?.campaigns || [];
          setBrandCampaigns(campaigns);
          // Auto-select first if only one
          if (campaigns.length === 1) setSelectedCampaignId(campaigns[0]._id);
        })
        .catch(() => setBrandCampaigns([]))
        .finally(() => setFetchingCampaigns(false));
    }
  }, [targetType, brand]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPortfolio(e.target.files[0]);
    }
  };

  const handleApply = async () => {
    // Determine the campaign to apply to
    const applyCampaignId = targetType === "brand" ? selectedCampaignId : campaign?._id;
    if (!applyCampaignId) {
      setError("Please select a campaign to apply to.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("note", note);
      if (proposedBudget) formData.append("proposedBudget", proposedBudget);
      if (portfolio) formData.append("portfolio", portfolio);

      await api.post(`/campaigns/${applyCampaignId}/apply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send application");
      setLoading(false);
    }
  };

  // ── Success State ──────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div
        className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onSuccess();
        }}
      >
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden text-center p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600 w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {targetType === "brand" ? "Request Sent!" : "Application Submitted!"}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {targetType === "brand"
              ? `Your collaboration request has been sent to ${brandName}. They'll review your request and get back to you soon.`
              : "Your campaign application has been successfully submitted. The brand will review your application and get back to you soon."}
          </p>
          <button
            onClick={onSuccess}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // ── Main Modal ─────────────────────────────────────────────────────────────
  const selectedCampaignObj = brandCampaigns.find((c) => c._id === selectedCampaignId);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {targetType === "brand" ? "Send Collaboration Request" : "Apply to Campaign"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Context Box */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex gap-4 items-center">
            {brandLogo ? (
              <img
                src={brandLogo}
                alt={brandName}
                className="w-12 h-12 rounded-lg object-cover bg-white"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                {brandName[0]}
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 mb-0.5">
                {targetType === "brand" ? "Sending request to" : "Applying to"} {brandName}
              </p>
              {targetType === "campaign" && campaign?.name && (
                <p className="font-semibold text-sm text-gray-900 line-clamp-1">
                  {campaign.name}
                </p>
              )}
              {targetType === "brand" && selectedCampaignObj && (
                <p className="font-semibold text-sm text-gray-900 line-clamp-1">
                  {selectedCampaignObj.name}
                </p>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Campaign Selector (brand mode only) */}
            {targetType === "brand" && (
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
                  Select Campaign <span className="text-red-500">*</span>
                </label>
                {fetchingCampaigns ? (
                  <div className="flex items-center gap-2 py-2 text-sm text-gray-400">
                    <span className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                    Loading campaigns...
                  </div>
                ) : brandCampaigns.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3">
                    This brand has no active campaigns to apply to right now.
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={selectedCampaignId}
                      onChange={(e) => setSelectedCampaignId(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white appearance-none cursor-pointer pr-10"
                    >
                      <option value="">— Choose a campaign —</option>
                      {brandCampaigns.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name} {c.budget ? `($${c.budget.min?.toLocaleString()} – $${c.budget.max?.toLocaleString()})` : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Proposed Budget */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
                Proposed Budget <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={proposedBudget}
                onChange={(e) => setProposedBudget(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="$ 1,000 - 2,500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your proposed rate or budget range.
              </p>
            </div>

            {/* Portfolio Upload */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
                Portfolio or Resume <span className="text-red-500">*</span>
              </label>

              <div
                className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {!portfolio ? (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                      <UploadCloud size={24} />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      Click to upload PDF, DOC, DOCX or TXT
                    </p>
                    <p className="text-xs text-gray-400">(Max. 10MB)</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg max-w-xs mx-auto">
                    <File size={20} className="text-blue-600 flex-shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <p className="text-sm font-medium text-blue-900 truncate">
                        {portfolio.name}
                      </p>
                      <p className="text-xs text-blue-500 truncate">
                        {(portfolio.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPortfolio(null);
                      }}
                      className="p-1 text-blue-400 hover:text-blue-600 rounded-full hover:bg-blue-100"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
                Message or Note <span className="text-red-500">*</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => {
                  if (e.target.value.length <= 500) setNote(e.target.value);
                }}
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Tell the brand why you're interested and what makes you a great fit..."
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {note.length}/500 characters
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-sm rounded-lg font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={
              loading ||
              !note ||
              (!portfolio && !proposedBudget) ||
              (targetType === "brand" && !selectedCampaignId)
            }
            className="px-6 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {targetType === "brand" ? "Send Request" : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyCampaignModal;
