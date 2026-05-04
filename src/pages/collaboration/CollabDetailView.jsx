import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Outlet, NavLink, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageCircle, 
  LayoutDashboard, 
  ClipboardList, 
  Loader2,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  XCircle,
  CheckCircle2,
  Star,
  RefreshCw,
  Clock
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import collaborationService from '../../services/collaborationService';
import { chatService } from '../../services/chatService';
import { setActiveConversation } from '../../redux/slices/chatSlice';
import Modal from '../../components/common/Modal';
import { cn } from '../../utils/helper';
import { useSocket } from '../../context/SocketContext';
import paymentService from '../../services/paymentService';
import PaymentModal from '../../components/payment/PaymentModal';
import { toast } from 'sonner';

const ENDPOINT = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const CollabDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);
  const [collaboration, setCollaboration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal States
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isInfluencerReviewOpen, setIsInfluencerReviewOpen] = useState(false);
  const [influencerRating, setInfluencerRating] = useState(0);
  const [influencerComment, setInfluencerComment] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const fetchCollaboration = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await collaborationService.getOne(id);
      setCollaboration(response?.data || response);
    } catch (err) {
      console.error('Error fetching collaboration details:', err);
      setError('Failed to load collaboration details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCollaboration();
  }, [fetchCollaboration]);

  const socket = useSocket();

  useEffect(() => {
    if (socket && user) {
      socket.on('activity_created', (data) => {
        // Refresh if the activity is related to this specific collaboration
        if (data.relatedId === id || (['collaboration', 'system'].includes(data.category))) {
          fetchCollaboration();
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('activity_created');
      }
    };
  }, [user, id, fetchCollaboration, socket]);

  const handleAction = async (actionType, payload = {}) => {
    try {
      setActionLoading(true);
      let res;
      
      switch(actionType) {
        case 'SUSPEND':
          res = await collaborationService.suspend(id);
          break;
        case 'REQUEST_CANCEL':
          res = await collaborationService.requestAction(id, { type: 'CANCEL', reason: cancelReason });
          setIsCancelModalOpen(false);
          setCancelReason("");
          break;
        case 'REQUEST_COMPLETE':
          res = await collaborationService.requestAction(id, { type: 'COMPLETE', reason: "Work finished, ready for completion." });
          break;
        case 'APPROVE_REQUEST':
          res = await collaborationService.handleAction(id, { decision: 'APPROVED', reviewData: payload.reviewData });
          setIsCompleteModalOpen(false);
          break;
        case 'REJECT_REQUEST':
          res = await collaborationService.handleAction(id, { decision: 'REJECTED' });
          break;
        case 'COMPLETE':
          res = await collaborationService.complete(id, payload.reviewData);
          setIsCompleteModalOpen(false);
          break;
        case 'CANCEL':
          res = await collaborationService.requestAction(id, { type: 'CANCEL', reason: cancelReason }); // Direct cancel for brand is also a request for consistency or use updateStatus
          // Let's use requestAction with approval if influencer, or direct cancel for brand
          if (user.role === 'brand') {
          }
          break;
        case 'INFLUENCER_REVIEW':
          res = await collaborationService.submitInfluencerReview(id, { rating: influencerRating, comment: influencerComment });
          setIsInfluencerReviewOpen(false);
          setInfluencerRating(0);
          setInfluencerComment("");
          break;
        default:
          break;
      }
      
      await fetchCollaboration();
    } catch (err) {
      console.error(`Action ${actionType} failed:`, err);
      alert(err.message || "Action failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFundEscrow = async () => {
    try {
      setActionLoading(true);
      const res = await paymentService.fundEscrow(id);
      const data = res?.data || res;

      if (data.alreadyFunded) {
        toast.success("Project is already funded!");
        fetchCollaboration();
        return;
      }

      const secret = data.clientSecret;
      if (!secret) {
        throw new Error("Failed to initialize payment: No client secret received.");
      }

      setClientSecret(secret);
      setIsPaymentModalOpen(true);
    } catch (err) {
      console.error("Failed to initialize escrow funding:", err);
      toast.error(err.message || "Failed to start payment process");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePaymentSuccess = useCallback(async () => {
    setIsPaymentModalOpen(false);
    toast.success("Escrow funded successfully! Updating project status...");
    
    try {
      // Manually trigger a sync in case webhooks are slow
      await paymentService.syncEscrowStatus(id);
    } catch (err) {
      console.warn("Sync failed, falling back to delay refresh:", err);
    }

    // Small delay to allow backend to process webhook/sync before refresh
    setTimeout(() => {
      fetchCollaboration();
    }, 1500);
  }, [fetchCollaboration, id]);

  // Handle redirect back from Stripe (e.g. 3DS or other redirects)
  useEffect(() => {
    if (searchParams.get('payment_success') === 'true') {
      // Clear the param from URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('payment_success');
      setSearchParams(newParams, { replace: true });
      
      handlePaymentSuccess();
    }
  }, [searchParams, setSearchParams, handlePaymentSuccess]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600 w-12 h-12 mb-4" />
        <p className="text-gray-500 font-black uppercase tracking-widest text-sm">Loading Project...</p>
      </div>
    );
  }

  if (error || !collaboration) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 bg-white">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <AlertCircle className="text-red-500 w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-gray-900 uppercase">Oops! Project Not Found</h2>
        <p className="text-gray-500 mt-2 max-w-sm mx-auto font-bold">{error || "This collaboration might have been moved or deleted."}</p>
        <button 
          onClick={() => navigate(user.role === 'brand' ? '/brand/collaborations' : '/influencer/collaborations')}
          className="mt-6 px-8 py-3 bg-[#0F172A] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all"
        >
          Back to list
        </button>
      </div>
    );
  }

  const { campaign, influencer, brand, status, deliverables = [], actionRequest, agreedBudget } = collaboration;
  const partner = user.role === 'brand' ? influencer : brand;
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner?.fullname || 'User')}&background=random&size=150`;

  // Progress logic
  const delivTotal = deliverables.length;
  const delivCompleted = deliverables.filter(d => ['APPROVED', 'DELIVERED'].includes(d.status)).length;
  const progress = delivTotal > 0 ? Math.round((delivCompleted / delivTotal) * 100) : 0;
  const canComplete = delivTotal > 0 && delivCompleted === delivTotal;

  // Timeline & Advanced Status Logic
  const endDate = new Date(collaboration.endDate || Date.now());
  const now = new Date();
  const diffTime = endDate - now;
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const hasRevisionRequested = deliverables.some(d => d.status === 'REVISION_REQUESTED');
  const hasSubmitted = deliverables.some(d => d.status === 'SUBMITTED');
  const isInfluencer = user.role === 'influencer';

  const handleChatClick = async () => {
    try {
      const partnerId = partner?._id || partner?.id;
      if (!partnerId) return;
      const res = await chatService.createOrGetConversation(partnerId);
      dispatch(setActiveConversation(res.data || res));
      navigate('/messages');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto pb-10 px-4 md:px-8">
      {/* Back Button & Top Meta */}
      <div className="flex items-center justify-between mb-8 pt-6">
        <button
          onClick={() => navigate(user.role === 'brand' ? '/brand/collaborations' : '/influencer/collaborations')}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
           <button 
             onClick={handleChatClick}
             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-black text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
             <MessageCircle size={14} className="text-blue-500" />
             Chat with Partner
           </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-white border border-gray-200 rounded-2xl px-8 py-10 shadow-sm mb-8 relative overflow-hidden">
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
               <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                 Campaign Project
               </span>
                <span className={cn(
                  "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border flex items-center gap-2",
                  (status === 'active' || status === 'in_progress' || (status === 'awaiting_funds' && collaboration.escrowFunded)) ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                  status === 'awaiting_funds' ? "bg-blue-50 text-blue-600 border-blue-100" :
                  status === 'suspended' ? "bg-red-50 text-red-600 border-red-100" :
                  status === 'completed' ? "bg-blue-50 text-blue-600 border-blue-100" :
                  "bg-gray-50 text-gray-600 border-gray-100"
                )}>
                  { (status === 'awaiting_funds' && collaboration.escrowFunded) ? 'ACTIVE' : 
                    (hasRevisionRequested && status === 'active') ? 'REVISION IN PROGRESS' :
                    (hasSubmitted && status === 'active') ? (isInfluencer ? 'IN REVIEW' : 'PENDING YOUR REVIEW') :
                    (status?.replace(/_/g, ' ') || 'ONGOING') 
                  }
                  {status === 'awaiting_funds' && !collaboration.escrowFunded && (
                    <RefreshCw 
                      size={10} 
                      className={cn("cursor-pointer hover:rotate-180 transition-all duration-500", loading && "animate-spin")}
                      onClick={(e) => {
                        e.stopPropagation();
                        fetchCollaboration();
                      }}
                      title="Sync Payment Status"
                    />
                  )}
                </span>
               
               {actionRequest && actionRequest.status === 'PENDING' && status !== 'completed' && (
                 <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-purple-100 animate-pulse">
                   PENDING {actionRequest.type} REQUEST
                 </span>
               )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-4 capitalize">
              {campaign?.name || collaboration.title || 'Untitled Project'}
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="flex items-center gap-3 text-gray-600 bg-gray-50/50 p-3 rounded-2xl">
                <Calendar size={16} className="text-gray-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Timeline</p>
                  <p className="text-xs font-bold truncate">{new Date(collaboration.startDate).toLocaleDateString()} - {new Date(collaboration.endDate || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600 bg-gray-50/50 p-3 rounded-2xl">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shadow-sm border border-blue-100/50 shrink-0">
                  <DollarSign size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Funded</p>
                  <p className="text-base font-black text-gray-900">${collaboration.escrowFunded ? collaboration.agreedBudget?.toLocaleString() : '0'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600 bg-gray-50/50 p-3 rounded-2xl">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100/50 shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Paid</p>
                  <p className="text-base font-black text-gray-900">${(collaboration.totalPaidAmount || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600 bg-gray-50/50 p-3 rounded-2xl">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-100/50 shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Balance</p>
                  <p className="text-base font-black text-gray-900">${((collaboration.agreedBudget || 0) - (collaboration.totalPaidAmount || 0)).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <img 
              src={partner?.profilePic || fallbackAvatar} 
              alt={partner?.fullname}
              className="w-14 h-14 rounded-xl object-cover border border-gray-200"
            />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Partner</p>
              <h4 className="font-bold text-gray-900 truncate max-w-[150px] capitalize text-[15px]">{partner?.fullname}</h4>
              <button 
                onClick={() => navigate(user.role === 'brand' ? `/brand/influencer/${partner._id}` : `/influencer/search/brand/${partner._id}`)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-all mt-1 inline-flex items-center gap-1"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Reason Banner */}
      {status === 'cancelled' && (
        <div className="mb-8 bg-rose-50 border border-rose-100 rounded-3xl p-6 flex items-start gap-5 shadow-sm">
           <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center shrink-0">
              <XCircle size={24} className="text-rose-600" />
           </div>
           <div>
              <h2 className="text-lg font-bold text-rose-900">Collaboration Cancelled</h2>
              <p className="text-rose-700 text-sm font-medium mt-1 leading-relaxed">
                This project was cancelled by <span className="font-bold">{collaboration.cancelledBy?.fullname || (collaboration.cancelledBy === brand?._id ? 'the Brand' : 'the Influencer')}</span>.
                <br/>
                <span className="font-bold">Reason:</span> "{collaboration.cancellationReason || 'No reason provided.'}"
              </p>
           </div>
        </div>
      )}

      {/* Review Summary (Visible after completion) */}
      {status === 'completed' && (
        <div className="space-y-4 mb-8">
          {/* Brand's Review of Influencer */}
          {collaboration.review && (
            <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 border border-amber-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
              <div className="absolute -top-2 -right-2 opacity-5 rotate-12">
                <Star size={80} className="fill-amber-400 text-amber-400" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {[1,2,3,4,5].map((s) => (
                        <Star 
                          key={s} 
                          size={14} 
                          className={cn(s <= collaboration.review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200")} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Brand's Review</span>
                  </div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">
                    {new Date(collaboration.review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 font-bold italic text-xs leading-relaxed max-w-2xl">
                  "{collaboration.review.comment || 'No comment provided.'}"
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-amber-500" />
                  <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest">Verified Review</span>
                </div>
              </div>
            </div>
          )}

          {/* Influencer's Review of Brand */}
          {collaboration.influencerReview && (
            <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border border-blue-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
              <div className="absolute -top-2 -right-2 opacity-5 rotate-12">
                <Star size={80} className="fill-blue-400 text-blue-400" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {[1,2,3,4,5].map((s) => (
                        <Star 
                          key={s} 
                          size={14} 
                          className={cn(s <= collaboration.influencerReview.rating ? "fill-blue-400 text-blue-400" : "text-gray-200")} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Influencer's Review</span>
                  </div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">
                    {new Date(collaboration.influencerReview.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 font-bold italic text-xs leading-relaxed max-w-2xl">
                  "{collaboration.influencerReview.comment || 'No comment provided.'}"
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-blue-500" />
                  <span className="text-[9px] font-black text-blue-700 uppercase tracking-widest">Verified Review</span>
                </div>
              </div>
            </div>
          )}

          {/* Rate Brand CTA for Influencer */}
          {user.role === 'influencer' && !collaboration.influencerReview && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-dashed border-indigo-200 rounded-2xl p-8 text-center">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star size={24} className="text-indigo-600" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Rate this Brand</h3>
              <p className="text-sm text-gray-500 font-medium mb-5 max-w-md mx-auto">
                Share your experience working with {brand?.fullname || 'this brand'}. Your feedback helps other influencers make informed decisions.
              </p>
              <button
                onClick={() => setIsInfluencerReviewOpen(true)}
                className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
              >
                Leave a Review
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── ACTION GUIDANCE BANNERS ──────────────────────────────── */}
      {status === 'awaiting_funds' && user.role === 'brand' && !collaboration.escrowFunded && (
        <div className="mb-8 bg-blue-600 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500">
           <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                 <DollarSign size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Escrow Funding Required</h2>
                <p className="text-blue-100 text-sm font-medium opacity-90 max-w-md">
                  To activate this collaboration and allow the influencer to start tasks, you must fund the agreed budget of <b>${agreedBudget.toLocaleString()}</b> into escrow.
                </p>
              </div>
           </div>
           <button 
             disabled={actionLoading}
             onClick={handleFundEscrow}
             className="bg-white text-blue-600 px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-blue-50 transition-all shadow-lg active:scale-95 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {actionLoading ? "Initializing..." : "Fund Escrow Now"}
           </button>
        </div>
      )}

      {status === 'active' && user.role === 'influencer' && !collaboration.escrowFunded && (
        <div className="mb-8 bg-amber-500 rounded-3xl p-6 text-white shadow-xl flex items-center gap-5">
           <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <AlertCircle size={24} />
           </div>
           <div>
              <h2 className="text-lg font-bold">Waiting for Escrow</h2>
              <p className="text-amber-50 text-sm font-medium opacity-90">The brand has accepted your request, but tasks cannot be started until the escrow is funded.</p>
           </div>
        </div>
      )}

      {user.role === 'influencer' && (!user.stripeAccountId || !user.stripeOnboardingComplete) && (
        <div className="mb-8 bg-gradient-to-r from-rose-600 to-red-700 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
           <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                 <AlertCircle size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Payment Method Required</h2>
                <p className="text-rose-100 text-sm font-medium opacity-90 max-w-md">
                  You haven't set up your payouts yet. <b>You cannot start or submit tasks</b> until your Stripe account is connected.
                </p>
              </div>
           </div>
           <button 
             onClick={() => navigate('/influencer/dashboard')}
             className="bg-white text-rose-600 px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-rose-50 transition-all shadow-lg active:scale-95 shrink-0 relative z-10"
           >
             Set Up Payouts
           </button>
        </div>
      )}

      {/* Action Bar (Contextual) */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           {/* BRAND ACTIONS */}
           {user.role === 'brand' && status !== 'completed' && status !== 'cancelled' && (
             <>
               {status === 'awaiting_funds' && !collaboration.escrowFunded && (
                 <button 
                   disabled={actionLoading}
                   onClick={handleFundEscrow}
                   className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 hover:scale-105 transition-all shadow-lg shadow-blue-200"
                 >
                   <DollarSign size={14} /> Fund Escrow
                 </button>
               )}
               
               {(status === 'active' || status === 'in_progress') && (
                  <button 
                    disabled={actionLoading}
                    onClick={() => handleAction('SUSPEND')}
                    className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all"
                  >
                    <AlertCircle size={14} /> Suspend
                  </button>
                )}

               {canComplete && (
                 <button 
                   disabled={actionLoading}
                   onClick={() => setIsCompleteModalOpen(true)}
                   className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 hover:scale-105 transition-all shadow-lg shadow-blue-200"
                 >
                   <CheckCircle2 size={14} /> Complete Project
                 </button>
               )}
             </>
           )}

           {/* INFLUENCER ACTIONS */}
           {user.role === 'influencer' && status !== 'completed' && status !== 'cancelled' && (
             <>
               {status === 'suspended' && (
                  <div className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 mb-4">
                    <AlertCircle size={12} /> Project Suspended
                  </div>
                )}
               {canComplete && (
                 <button 
                   disabled={actionLoading || (actionRequest?.type === 'COMPLETE' && actionRequest.status === 'PENDING')}
                   onClick={() => handleAction('REQUEST_COMPLETE')}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg",
                      (actionRequest?.type === 'COMPLETE' && actionRequest.status === 'PENDING') 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none" 
                        : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-blue-200"
                    )}
                 >
                    { (actionRequest?.type === 'COMPLETE' && actionRequest.status === 'PENDING') ? (
                      <><Clock size={14} /> Completion Requested</>
                    ) : (
                      <><CheckCircle2 size={14} /> Request Completion</>
                    )}
                 </button>
               )}
             </>
           )}
        </div>

        <div className="flex items-center gap-3">
          {status !== 'completed' && status !== 'cancelled' && user.role === 'brand' && (
            <button 
              disabled={actionLoading || (actionRequest?.type === 'CANCEL' && actionRequest.status === 'PENDING')}
              onClick={() => setIsCancelModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 text-red-500 hover:bg-red-50 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
            >
              <XCircle size={14} /> Cancel Project
            </button>
          )}
        </div>
      </div>

      {/* Incoming Requests Notification Section */}
      {actionRequest && actionRequest.status === 'PENDING' && actionRequest.requestedBy !== user._id && status !== 'completed' && status !== 'cancelled' && (
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl p-4 sm:p-3 px-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-indigo-500/10 border border-white/10 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
              <AlertCircle size={16} />
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
              <h4 className="text-[11px] font-black uppercase tracking-tight whitespace-nowrap">{actionRequest.type} REQUEST</h4>
              <p className="text-[10px] font-bold text-indigo-50/80 leading-tight line-clamp-1">
                The partner requested to {actionRequest.type.toLowerCase()} this project. 
                <span className="ml-2 italic opacity-60 font-medium">Reason: "{actionRequest.reason}"</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
             <button 
               disabled={actionLoading}
               onClick={() => handleAction('REJECT_REQUEST')}
               className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
             >
               Reject
             </button>
             <button 
               disabled={actionLoading}
               onClick={() => {
                 if (actionRequest.type === 'COMPLETE' && user.role === 'brand') {
                   setIsCompleteModalOpen(true);
                 } else {
                   handleAction('APPROVE_REQUEST');
                 }
               }}
               className="px-5 py-1.5 bg-white text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
             >
               Approve
             </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 w-fit">
        <NavLink
          to="overview"
          className={({ isActive }) => `flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
            isActive 
              ? 'bg-white text-blue-600 shadow-sm border border-gray-200' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
          }`}
        >
          <LayoutDashboard size={16} />
          Overview
        </NavLink>
        <NavLink
          to="tasks"
          className={({ isActive }) => `flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
            isActive 
              ? 'bg-white text-blue-600 shadow-sm border border-gray-200' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
          }`}
        >
          <ClipboardList size={16} />
          Deliverables
        </NavLink>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300">
        <Outlet context={{ collaboration, userRole: user.role, user, onRefresh: fetchCollaboration }} />
      </div>

      {/* --- MODALS --- */}

      {/* Cancel Modal */}
      <Modal 
        isOpen={isCancelModalOpen} 
        onClose={() => setIsCancelModalOpen(false)} 
        title={user.role === 'brand' ? "Cancel Project" : "Request Cancellation"}
      >
        <div className="space-y-6">
          <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
             <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Confirm Project</p>
             <p className="text-sm font-bold text-gray-900">{campaign?.name || "This Collaboration"}</p>
          </div>

          {collaboration.escrowFunded && user.role === 'brand' && (
             <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3">
               <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
               <div>
                 <p className="text-xs font-bold text-amber-900 mb-1 uppercase tracking-tight">Escrow & Refund Policy</p>
                 <p className="text-[11px] font-medium text-amber-800 leading-relaxed">
                   Tasks in progress for over 24 hours will incur a <b>50% deduction</b> to compensate the influencer. 
                   All remaining unallocated funds will be <b>automatically refunded</b> to your original payment method.
                 </p>
               </div>
             </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Reason for cancellation</label>
            <textarea 
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Please explain why you want to cancel this collaboration..."
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none h-32"
            />
          </div>

          <button 
            disabled={!cancelReason || actionLoading}
            onClick={() => handleAction(user.role === 'brand' ? 'REQUEST_CANCEL' : 'REQUEST_CANCEL')} // Using request cancel flow for both for now per prompt
            className="w-full py-4 bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-700 disabled:opacity-50 transition-all"
          >
            {actionLoading ? "Processing..." : (user.role === 'brand' ? "Cancel Collaboration" : "Submit Cancellation Request")}
          </button>
        </div>
      </Modal>



      {/* Complete Modal (with Review) */}
      <Modal 
        isOpen={isCompleteModalOpen} 
        onClose={() => setIsCompleteModalOpen(false)} 
        title="Complete Project & Leave Review"
        maxWidth="max-w-xl"
      >
        <div className="space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {[1,2,3,4,5].map((star) => (
                <button 
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 active:scale-95"
                >
                  <Star 
                    size={40} 
                    className={cn(
                      "transition-colors",
                      star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
                    )} 
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-bold text-gray-500">How was your experience with {partner?.fullname}?</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Public Feedback</label>
            <textarea 
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share your feedback about the influencer's work and professionalism..."
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none h-32"
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
             <div className="flex gap-3">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                   <AlertCircle size={10} className="text-white" />
                </div>
                <p className="text-xs font-medium text-blue-700 leading-relaxed">
                   By completing this project, you confirm that all deliverables have been received and approved. This action cannot be undone.
                </p>
             </div>
          </div>

          <button 
            disabled={actionLoading || rating === 0}
            onClick={() => {
               const payload = { reviewData: { rating, comment: reviewComment } };
               if (actionRequest?.type === 'COMPLETE') {
                 handleAction('APPROVE_REQUEST', payload);
               } else {
                 handleAction('COMPLETE', payload);
               }
            }}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200"
          >
            {actionLoading ? "Finalizing..." : "Complete Collaboration"}
          </button>
        </div>
      </Modal>

      {/* Influencer Review Modal */}
      <Modal 
        isOpen={isInfluencerReviewOpen} 
        onClose={() => setIsInfluencerReviewOpen(false)} 
        title="Leave a Review for Brand"
        maxWidth="max-w-xl"
      >
        <div className="space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {[1,2,3,4,5].map((star) => (
                <button 
                  key={star}
                  onClick={() => setInfluencerRating(star)}
                  className="p-1 transition-transform hover:scale-110 active:scale-95"
                >
                  <Star 
                    size={40} 
                    className={cn(
                      "transition-colors",
                      star <= influencerRating ? "fill-amber-400 text-amber-400" : "text-gray-200"
                    )} 
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-bold text-gray-500">How was your experience with {brand?.fullname}?</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Public Feedback</label>
            <textarea 
              value={influencerComment}
              onChange={(e) => setInfluencerComment(e.target.value)}
              placeholder="Share your feedback about the brand's communication and project..."
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none h-32"
            />
          </div>

          <button 
            disabled={actionLoading || influencerRating === 0}
            onClick={() => handleAction('INFLUENCER_REVIEW')}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-gray-200"
          >
            {actionLoading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </Modal>

      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          clientSecret={clientSecret}
          collaborationId={id}
          onPaymentSuccess={handlePaymentSuccess}
          amount={collaboration?.agreedBudget}
        />
      )}
    </div>
  );
};

export default CollabDetailView;
