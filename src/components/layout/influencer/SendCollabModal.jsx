import React, { useState, useEffect } from "react";
import { X, CheckCircle, ChevronDown } from "lucide-react";
import api from "../../../services/api";

/**
 * Universal Send Collaboration Request Modal
 *
 * Props:
 *   targetUser   - Object { _id, name } representing the person being sent the request
 *   targetType   - "brand" | "influencer" (who is RECEIVING the request)
 *   onClose      - callback to close the modal
 *   onSuccess    - callback after successful submission
 */
const SendCollabModal = ({ targetUser, targetType, onClose, onSuccess }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [fetchingCampaigns, setFetchingCampaigns] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setFetchingCampaigns(true);
      try {
        if (targetType === "influencer") {
          // A Brand is logged in and sending to an Influencer.
          // Fetch the Brand's own active campaigns.
          const res = await api.get('/campaigns?status=active');
          const comps = res.data?.data?.campaigns || [];
          setCampaigns(Array.isArray(comps) ? comps : []);
          if (comps.length === 1) setSelectedCampaignId(comps[0]._id);
        } else if (targetType === "brand") {
          // An Influencer is logged in and applying to a Brand.
          // Fetch the target Brand's active campaigns.
          const res = await api.get(`/brands/${targetUser._id}/public`);
          const comps = res.data?.data?.campaigns || [];
          setCampaigns(Array.isArray(comps) ? comps : []);
          if (comps.length === 1) setSelectedCampaignId(comps[0]._id);
        }
      } catch (err) {
        setCampaigns([]);
      } finally {
        setFetchingCampaigns(false);
      }
    };
    fetchCampaigns();
  }, [targetType, targetUser]);

  const handleSend = async () => {
    if (!selectedCampaignId || !note.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.post("/collaborations/request", {
        receiverId: targetUser._id,
        campaignId: selectedCampaignId,
        note: note.trim(),
        deliveryDays: "TBD", // Sending a default to pass validation gracefully
      });

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send request");
      setLoading(false);
    }
  };

  // ── Success State ──────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div
        className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onSuccess();
        }}
      >
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden text-center p-8">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <CheckCircle className="text-blue-600 w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Request Sent!</h2>
          <p className="text-sm text-gray-500 mb-6">
            Your collaboration request has been successfully sent to{" "}
            <span className="font-semibold text-gray-700">{targetUser?.name || "them"}</span>. They'll review it and get back to you soon.
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
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-[17px] font-bold text-gray-900">
            Send Collaboration Request
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-md transition-colors"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-[13px] rounded-lg px-4 py-2.5 font-medium">
              {error}
            </div>
          )}

          <p className="text-[14px] text-gray-600">
            Send a collaboration request to <span className="font-bold text-gray-900">{targetUser?.name}</span>
          </p>

          <div className="space-y-4">
            {/* Select Campaign */}
            <div>
              <label className="text-[13px] font-bold text-gray-700 flex items-center gap-1 mb-1.5">
                Select Campaign <span className="text-red-500">*</span>
              </label>
              {fetchingCampaigns ? (
                <div className="flex items-center gap-2 py-2 text-sm text-gray-400">
                  <span className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                  Loading campaigns...
                </div>
              ) : campaigns.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 text-[13px] rounded-lg px-4 py-3 font-medium">
                  {targetType === "influencer" 
                    ? "You have no active campaigns to send proposals formatting. Please create a campaign first." 
                    : "This brand has no active campaigns to apply to right now."}
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={selectedCampaignId}
                    onChange={(e) => setSelectedCampaignId(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white appearance-none cursor-pointer pr-10"
                  >
                    <option value="">— Choose a campaign —</option>
                    {campaigns.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} {c.budget?.min && c.budget?.max ? `($${c.budget.min.toLocaleString()} – $${c.budget.max.toLocaleString()})` : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="text-[13px] font-bold text-gray-700 flex items-center gap-1 mb-1.5">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => {
                  if (e.target.value.length <= 500) setNote(e.target.value);
                }}
                rows={4}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Write a message to the influencer..."
              />
              <div className="text-left text-[12px] text-gray-400 mt-1.5 font-medium">
                {note.length} / 500 characters
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-end gap-3 bg-gray-50/50 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-[14px] rounded-lg font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading || !selectedCampaignId || !note.trim()}
            className="px-6 py-2.5 text-[14px] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            {loading && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendCollabModal;
