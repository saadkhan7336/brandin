import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { DollarSign, Wallet, TrendingUp, Clock, AlertCircle } from "lucide-react";
import PaymentSettings from "./PaymentSettings";
import { cn } from "../../utils/helper";
import paymentService from "../../services/paymentService";
import { toast } from "sonner";
import { useState, useEffect, useCallback } from "react";

function StatCard({ title, amount, icon: Icon, colorClass, subtitle }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4 hover:shadow-md transition-all group">
      <div className={cn("p-4 rounded-xl shrink-0 transition-colors", colorClass)}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{title}</p>
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">${amount.toFixed(2)}</h3>
        {subtitle && <p className="text-[10px] font-bold text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function PaymentsDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await paymentService.getPaymentHistory();
      const data = Array.isArray(res) ? res : (res?.data || []);
      setHistory(data);
    } catch (e) {
      console.warn("Failed to fetch history for stats:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const stats = useMemo(() => {
    let totalSpent = 0;
    let totalEarned = 0;
    let pending = 0;
    let failed = 0;

    history.forEach(tx => {
      const amt = Number(tx.amount) || 0;
      if (user.role === 'brand') {
        if (tx.status === 'completed' || tx.status === 'succeeded' || tx.status === 'paid') {
          totalSpent += amt;
        } else if (tx.status === 'pending' || tx.status === 'processing') {
          pending += amt;
        } else if (tx.status === 'failed' || tx.status === 'cancelled') {
          failed += amt;
        }
      } else if (user.role === 'influencer') {
        if (tx.status === 'completed' || tx.status === 'succeeded' || tx.status === 'paid') {
          totalEarned += amt;
        } else if (tx.status === 'pending' || tx.status === 'processing') {
          pending += amt;
        } else if (tx.status === 'failed' || tx.status === 'cancelled') {
          failed += amt;
        }
      }
    });

    return { totalSpent, totalEarned, pending, failed };
  }, [history, user.role]);

  if (loading) {
    return (
      <div className="w-full max-w-[1800px] mx-auto px-4 md:px-8 py-8 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-sm" />
        <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1800px] mx-auto space-y-8 pb-24 px-4 md:px-8 pt-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-gray-100 pb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Payments & Financials</h1>
        <p className="text-gray-500 font-medium text-sm">
          {user.role === 'brand' 
            ? "Manage your payment methods, escrow funds, and view transaction history." 
            : "Track your earnings, manage payout accounts, and view payment history."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {user.role === 'brand' ? (
          <>
            <StatCard 
              title="Total Spent" 
              amount={stats.totalSpent} 
              icon={DollarSign} 
              colorClass="bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" 
              subtitle="All time completed payments"
            />
            <StatCard 
              title="Funds in Escrow" 
              amount={stats.pending} 
              icon={Wallet} 
              colorClass="bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white" 
              subtitle="Held securely for active collaborations"
            />
            <StatCard 
              title="Failed Transactions" 
              amount={stats.failed} 
              icon={AlertCircle} 
              colorClass="bg-red-50 text-red-600 group-hover:bg-red-500 group-hover:text-white" 
              subtitle="Action may be required"
            />
          </>
        ) : (
          <>
            <StatCard 
              title="Total Earned" 
              amount={stats.totalEarned} 
              icon={TrendingUp} 
              colorClass="bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white" 
              subtitle="All time successful payouts"
            />
            <StatCard 
              title="Pending Clearance" 
              amount={stats.pending} 
              icon={Clock} 
              colorClass="bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white" 
              subtitle="Held in escrow by brands"
            />
            <StatCard 
              title="Failed Payouts" 
              amount={stats.failed} 
              icon={AlertCircle} 
              colorClass="bg-red-50 text-red-600 group-hover:bg-red-500 group-hover:text-white" 
              subtitle="Check your Stripe account"
            />
          </>
        )}
      </div>

      {/* Main Payment Settings Content */}
      <div className="pt-4">
        {/* We pass a key to force re-render if needed, though PaymentSettings handles its own state */}
        <PaymentSettings user={user} />
      </div>
    </div>
  );
}
