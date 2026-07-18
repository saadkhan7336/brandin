import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../../components/layout/LandingNavbar";
import LandingFooter from "../../components/layout/LandingFooter";
import {
  ShieldCheck,
  CreditCard,
  Lock,
  Wallet,
  ArrowRight,
  CheckCircle2,
  ArrowDownToLine,
  RefreshCcw,
  Zap
} from "lucide-react";

export default function SecurePaymentsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans selection:bg-blue-100">
      <LandingNavbar />

      <main className="pt-24 lg:pt-32 pb-12 px-6 max-w-7xl mx-auto">
        
        {/* HERO SECTION */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 mb-24">
          <div className="flex-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full mb-6">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] font-bold tracking-wider text-emerald-600 uppercase">100% Secure Payments</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-[#0f172a] leading-[1.05] tracking-tight mb-6">
              Peace of Mind, <br/><span className="text-emerald-500">Guaranteed.</span>
            </h1>
            <p className="text-lg text-[#64748b] leading-relaxed mb-8 max-w-xl">
              Focus on creating and collaborating. Our Stripe-powered escrow system ensures brands only pay for approved work, and creators always get paid on time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/register')}
                className="bg-emerald-500 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-emerald-600 transition-colors shadow-[0_4px_14px_0_rgb(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5"
              >
                Start Collaborating
              </button>
              <button 
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white text-[#0f172a] font-bold py-3.5 px-8 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors hover:shadow-sm"
              >
                How Payments Work
              </button>
            </div>
          </div>

          <div className="flex-1 w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg bg-[#ecfdf5] rounded-[3rem] p-8 md:p-12 aspect-square flex items-center justify-center">
              {/* Mockup Card */}
              <div className="bg-white rounded-3xl p-6 shadow-xl w-full relative z-10 hover:-translate-y-2 transition-transform duration-500">
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0f172a]">Escrow Account</p>
                      <p className="text-xs text-gray-500">Campaign: Summer Launch</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-medium mb-1">Funded Amount</p>
                    <p className="text-xl font-black text-[#0f172a]">$4,500.00</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="text-sm font-bold text-[#0f172a]">Milestone 1: Content Draft</p>
                        <p className="text-xs text-gray-500">Approved by Brand</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#0f172a]">$1,500</span>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 border border-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.1)] flex justify-between items-center relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
                      <div>
                        <p className="text-sm font-bold text-emerald-700">Milestone 2: Final Post</p>
                        <p className="text-xs text-emerald-600/80">Awaiting payout release...</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-emerald-700">$3,000</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-[#f8fafc] p-3 rounded-xl border border-gray-100">
                   <div className="flex items-center gap-2">
                     <Lock className="w-4 h-4 text-gray-400" />
                     <span className="text-xs text-gray-500 font-medium">Secured by Stripe</span>
                   </div>
                   <div className="flex gap-1">
                     <div className="w-6 h-4 bg-blue-600 rounded-sm"></div>
                     <div className="w-6 h-4 bg-orange-500 rounded-sm"></div>
                   </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-2 md:right-4 bg-white px-5 py-3 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3 z-20 animate-bounce" style={{ animationDuration: '3.5s' }}>
                <Wallet className="w-6 h-6 text-emerald-500" />
                <div>
                  <p className="text-sm font-bold text-[#0f172a]">Funds Protected</p>
                  <p className="text-[10px] text-gray-500">Held securely until approval</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MIDDLE SECTION - How it works */}
        <section id="how-it-works" className="py-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] mb-6">A Fair Ecosystem for Everyone</h2>
            <p className="text-lg text-[#64748b] leading-relaxed">
              We eliminate the risk of non-payment for creators and incomplete work for brands. Our escrow system aligns incentives perfectly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Brands Side */}
            <div className="bg-white rounded-3xl p-10 border border-gray-200 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-700"></div>
               <h3 className="text-2xl font-black text-[#0f172a] mb-8 flex items-center gap-3">
                 <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                   <ShieldCheck className="w-5 h-5" />
                 </div>
                 For Brands
               </h3>
               
               <div className="space-y-8">
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center flex-shrink-0 text-sm">1</div>
                   <div>
                     <h4 className="font-bold text-[#0f172a] mb-1">Fund the Campaign</h4>
                     <p className="text-gray-500 text-sm">Deposit funds securely into the Brandly escrow account via credit card or ACH.</p>
                   </div>
                 </div>
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center flex-shrink-0 text-sm">2</div>
                   <div>
                     <h4 className="font-bold text-[#0f172a] mb-1">Review Deliverables</h4>
                     <p className="text-gray-500 text-sm">The creator submits their work. You review it to ensure it meets your guidelines.</p>
                   </div>
                 </div>
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center flex-shrink-0 text-sm">3</div>
                   <div>
                     <h4 className="font-bold text-[#0f172a] mb-1">Release Payment</h4>
                     <p className="text-gray-500 text-sm">Approve the milestone to instantly release the funds to the creator's wallet.</p>
                   </div>
                 </div>
               </div>
            </div>

            {/* Creators Side */}
            <div className="bg-white rounded-3xl p-10 border border-gray-200 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-700"></div>
               <h3 className="text-2xl font-black text-[#0f172a] mb-8 flex items-center gap-3">
                 <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                   <Zap className="w-5 h-5" />
                 </div>
                 For Creators
               </h3>
               
               <div className="space-y-8">
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center flex-shrink-0 text-sm">1</div>
                   <div>
                     <h4 className="font-bold text-[#0f172a] mb-1">Create with Confidence</h4>
                     <p className="text-gray-500 text-sm">Only start working once the brand has fully funded the escrow account.</p>
                   </div>
                 </div>
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center flex-shrink-0 text-sm">2</div>
                   <div>
                     <h4 className="font-bold text-[#0f172a] mb-1">Submit Your Work</h4>
                     <p className="text-gray-500 text-sm">Upload your content directly through the platform for the brand to review.</p>
                   </div>
                 </div>
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center flex-shrink-0 text-sm">3</div>
                   <div>
                     <h4 className="font-bold text-[#0f172a] mb-1">Get Paid Automatically</h4>
                     <p className="text-gray-500 text-sm">Once approved, funds are automatically transferred to your connected bank account.</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-24 border-t border-gray-100">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#f8fafc] p-8 rounded-3xl border border-gray-100">
                 <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                   <Lock className="w-6 h-6 text-gray-700" />
                 </div>
                 <h4 className="text-xl font-bold text-[#0f172a] mb-3">Enterprise Security</h4>
                 <p className="text-gray-500 text-sm leading-relaxed">All payments are processed through Stripe, utilizing bank-grade encryption to protect your sensitive financial data.</p>
              </div>

              <div className="bg-[#f8fafc] p-8 rounded-3xl border border-gray-100">
                 <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                   <ArrowDownToLine className="w-6 h-6 text-gray-700" />
                 </div>
                 <h4 className="text-xl font-bold text-[#0f172a] mb-3">Milestone Payouts</h4>
                 <p className="text-gray-500 text-sm leading-relaxed">Break large campaigns into smaller, manageable milestones. Release payments progressively as each stage is completed.</p>
              </div>

              <div className="bg-[#f8fafc] p-8 rounded-3xl border border-gray-100">
                 <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                   <RefreshCcw className="w-6 h-6 text-gray-700" />
                 </div>
                 <h4 className="text-xl font-bold text-[#0f172a] mb-3">Automated Refunds</h4>
                 <p className="text-gray-500 text-sm leading-relaxed">If a collaboration falls through or terms aren't met, our automated dispute system ensures rapid, fair refunds.</p>
              </div>
           </div>
        </section>

        {/* CTA SECTION (Matching other feature pages) */}
        <section className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl mt-12 mb-12 group cursor-pointer">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-blue-500/30 transition-all duration-700"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none group-hover:bg-emerald-500/30 transition-all duration-700"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
              Ready to collaborate securely?
            </h2>
            <p className="text-gray-300 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
              Join thousands of creators and brands who process millions of dollars safely on our platform every month.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto bg-[#2563eb] text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-500 transition-colors shadow-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                <ShieldCheck className="w-5 h-5" />
                Start Safe Transactions
              </button>
            </div>
            <p className="mt-8 text-xs text-gray-500">
              Payments are powered by Stripe. Bank-grade security guaranteed.
            </p>
          </div>
        </section>

      </main>

      <LandingFooter />
    </div>
  );
}
