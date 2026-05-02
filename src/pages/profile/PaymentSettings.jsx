import React, { useState, useEffect, useCallback } from "react";
import {
  CreditCard,
  History,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Loader2,
} from "lucide-react";
import paymentService from "../../services/paymentService";
import { toast } from "sonner";
import { cn } from "../../utils/helper";

const PaymentSettings = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [cards, setCards] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPaymentData = useCallback(async () => {
    // Safely extract array data from ApiResponse wrapper
    const extractArray = (res) => {
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.data)) return res.data;
      return [];
    };

    try {
      setLoading(true);

      // Fetch history for all roles
      let historyData = [];
      try {
        const historyRes = await paymentService.getPaymentHistory();
        historyData = extractArray(historyRes);
      } catch (e) {
        console.warn("History fetch failed:", e);
      }

      // Fetch cards only for brands
      let cardsData = [];
      if (user.role === "brand") {
        try {
          const cardsRes = await paymentService.getPaymentMethods();
          cardsData = extractArray(cardsRes);
        } catch (e) {
          console.warn("Cards fetch failed:", e);
        }
      }

      setHistory(historyData);
      setCards(cardsData);
    } catch (err) {
      console.error("Payment data fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user.role]);

  useEffect(() => {
    fetchPaymentData();
  }, [fetchPaymentData, user._id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPaymentData();
    setRefreshing(false);
  };

  const handleRemoveCard = async (cardId) => {
    if (!window.confirm("Remove this payment method?")) return;
    try {
      await paymentService.removePaymentMethod(cardId);
      toast.success("Card removed");
      setCards((prev) => prev.filter((c) => c.id !== cardId));
    } catch (err) {
      toast.error("Failed to remove card");
    }
  };

  const handleOnboardStripe = async () => {
    try {
      const res = await paymentService.onboardConnect();
      // res = ApiResponse: { statusCode, data: { url }, message, success }
      const url = res?.data?.url || res?.url;
      if (url) {
        window.location.href = url;
      } else {
        console.error("Onboard response:", res);
        toast.error("Onboarding link not received");
      }
    } catch (err) {
      console.error("Onboard error:", err);
      toast.error(err?.message || "Failed to start onboarding");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
      case "completed":
      case "succeeded":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "pending":
      case "processing":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "failed":
      case "cancelled":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Loading Payment Data...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stripe Connect Section for Influencers */}
      {user.role === "influencer" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                  Payout Account
                </h3>
              </div>
              <p className="text-sm font-medium text-gray-500 max-w-md">
                Connect your bank account or debit card via Stripe to receive
                payments for completed tasks.
              </p>
            </div>

            {user.stripeAccountId && user.stripeOnboardingComplete ? (
              <div className="flex items-center gap-4 px-6 py-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">
                    Active & Verified
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    Stripe Connected
                  </p>
                </div>
                <button
                  onClick={handleOnboardStripe}
                  className="ml-4 p-2 hover:bg-emerald-100 rounded-lg text-emerald-600 transition-all"
                  title="Update Stripe Account"
                >
                  <ExternalLink size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleOnboardStripe}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-200 active:scale-95"
              >
                Setup Payout Account
              </button>
            )}
          </div>
        </div>
      )}

      {/* Card Management for Brands */}
      {user.role === "brand" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <CreditCard size={18} />
              </div>
              <h2 className="text-base font-bold text-gray-900">
                Payment Methods
              </h2>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Securely managed by Stripe
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(cards) &&
                cards.map((card) => (
                  <div
                    key={card.id}
                    className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                        <CreditCard
                          className="text-gray-400 group-hover:text-blue-600"
                          size={20}
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveCard(card.id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        •••• •••• •••• {card.card?.last4}
                      </p>
                      <div className="flex justify-between items-end">
                        <p className="text-sm font-black text-gray-900 uppercase">
                          {card.card?.brand}
                        </p>
                        <p className="text-[11px] font-bold text-gray-500">
                          Exp: {card.card?.exp_month}/{card.card?.exp_year}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

              <button
                onClick={() =>
                  toast.info(
                    "To add a card, initiate an escrow payment for any collaboration.",
                  )
                }
                className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 hover:border-blue-200 hover:bg-blue-50/30 hover:text-blue-500 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Plus size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Add New Method
                </span>
              </button>
            </div>

            <div className="mt-6 flex items-center gap-2 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <AlertCircle size={14} className="text-blue-500 shrink-0" />
              <p className="text-[10px] font-bold text-blue-700 leading-tight">
                Cards are automatically saved when you first fund a campaign. We
                do not store your full card details on our servers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <History size={18} />
            </div>
            <h2 className="text-base font-bold text-gray-900">
              Transaction History
            </h2>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-all"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Transaction
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Reference
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Date
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                  Amount
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!Array.isArray(history) || history.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-gray-50 rounded-2xl">
                        <History size={24} className="text-gray-200" />
                      </div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        No transactions recorded yet.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                history.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                            tx.status === "completed"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-blue-50 text-blue-600",
                          )}
                        >
                          {tx.status === "completed" ? (
                            <ArrowUpRight size={18} />
                          ) : (
                            <ArrowDownLeft size={18} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 uppercase">
                            {tx.status === "completed"
                              ? "Payout Release"
                              : "Payment"}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                            ID:{" "}
                            {(
                              tx.stripeTransferId ||
                              tx.stripePaymentIntentId ||
                              tx._id
                            )?.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <p className="text-xs font-bold text-gray-900 uppercase truncate max-w-[150px]">
                          {tx.campaign?.name ||
                            tx.collaboration?.title ||
                            "Project"}
                        </p>
                        <p className="text-[10px] font-medium text-gray-400">
                          {tx.deliverable ? "Task Completion" : "Payment"}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-xs font-bold text-gray-900 uppercase">
                          {new Date(tx.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400">
                          <Clock size={10} />
                          {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <p
                        className={cn(
                          "text-sm font-black",
                          tx.status === "completed"
                            ? "text-emerald-600"
                            : "text-gray-900",
                        )}
                      >
                        ${tx.amount?.toFixed(2) || "0.00"}
                      </p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        {tx.currency || "USD"}
                      </p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                          getStatusBadge(tx.status),
                        )}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;
