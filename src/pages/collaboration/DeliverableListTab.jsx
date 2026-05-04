import React from 'react';
import { 
  Clock, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  ExternalLink,
  CheckCircle,
  ClipboardList,
  RefreshCw,
  DollarSign
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const DeliverableListTab = () => {
  const { 
    collaboration, 
    userRole, 
    handleReview, 
    handleOpenModal,
    handleDelete, 
    handleOpenSubmitModal,
    handleStartDeliverable,
    setRevisionModal
  } = useOutletContext();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'SUBMITTED': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'REVISION_REQUESTED': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  if (!collaboration) return null;

  return (
    <div className="space-y-4">
      {collaboration.deliverables?.length > 0 ? (
        collaboration.deliverables.map((deliv) => (
          <div key={deliv._id} className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              
              <div className="flex gap-5 items-start flex-1 min-w-0">
                <div className="p-4 bg-gray-50 rounded-2xl shrink-0 group-hover:bg-blue-50 transition-all">
                   <ClipboardList className="text-gray-400 group-hover:text-blue-600" size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-[17px] font-black text-[#0F172A] tracking-tight truncate uppercase">{deliv.title}</h3>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                      getStatusBadge(deliv.status)
                    )}>
                      {deliv.status?.replace('_', ' ')}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-black rounded uppercase">
                      {deliv.priority || 'MEDIUM'}
                    </span>
                    {deliv.paymentStatus === 'paid' && (
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-full uppercase tracking-widest flex items-center gap-1">
                        <Check size={10} strokeWidth={3} />
                        Paid
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-black rounded-full uppercase tracking-widest flex items-center gap-1">
                      <DollarSign size={10} strokeWidth={3} />
                      Budget: ${deliv.allocatedBudget?.toLocaleString() || 0}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-400 line-clamp-1 mb-3">{deliv.description || 'Deliver project assets as specified in the brief.'}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-gray-300" />
                      Due: {new Date(deliv.dueDate).toLocaleDateString()}
                    </div>
                    {deliv.submissionFiles?.[0] && (
                      <a href={deliv.submissionFiles[0]} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline">
                        <ExternalLink size={14} />
                        View Assets
                      </a>
                    )}
                  </div>

                  {/* Revision Notes for everyone */}
                  {deliv.status === 'REVISION_REQUESTED' && deliv.revisionNotes && (
                    <div className="mt-4 p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
                      <div className="bg-amber-100 text-amber-600 p-1.5 rounded-lg shrink-0">
                        <RefreshCw size={14} className="animate-spin-slow" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Brand Feedback</p>
                        <p className="text-xs font-bold text-amber-700/80 leading-relaxed italic">
                          "{deliv.revisionNotes}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center">
                {collaboration.status === 'completed' ? (
                  <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
                    <CheckCircle size={16} />
                    Project Completed
                  </div>
                ) : userRole === 'brand' ? (
                  <>
                    {deliv.status === 'SUBMITTED' && (
                        <div className="flex items-center gap-2 mr-4 pr-4 border-r border-gray-100">
                           <button 
                             onClick={() => handleReview(deliv._id, 'APPROVED')} 
                             className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                           >
                              <Check size={14} />
                              Approve & Pay
                           </button>
                           <button 
                             onClick={() => setRevisionModal({ isOpen: true, deliverableId: deliv._id, notes: '' })} 
                             className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                           >
                              <RefreshCw size={14} />
                              Revise
                           </button>
                        </div>
                    )}
                    {deliv.status === 'APPROVED' && deliv.paymentStatus === 'unpaid' && (
                       <button 
                         onClick={() => handleReview(deliv._id, 'APPROVED')} 
                         className="flex items-center gap-2 px-4 py-2 mr-4 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl hover:bg-amber-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest group/retry"
                       >
                         <RefreshCw size={14} className="group-hover/retry:rotate-180 transition-transform duration-500" />
                         Retry Payout
                       </button>
                    )}
                    <button onClick={() => handleOpenModal(deliv)} className="p-2.5 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-xl transition-all">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => handleDelete(deliv._id)} className="p-2.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </>
                ) : (
                  deliv.status === 'APPROVED' ? (
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                      <CheckCircle size={16} />
                      Finalized
                    </div>
                  ) : userRole === 'influencer' ? (
                    <>
                      {deliv.status === 'PENDING' && (
                        <button 
                          onClick={() => handleStartDeliverable(deliv._id)}
                          disabled={!collaboration.escrowFunded}
                          className={cn(
                            "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95",
                            !collaboration.escrowFunded ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
                          )}
                        >
                          Start Task
                        </button>
                      )}
                      {(deliv.status === 'IN_PROGRESS' || deliv.status === 'REVISION_REQUESTED') && (
                        <button 
                          onClick={() => handleOpenSubmitModal(deliv)}
                          className="px-6 py-2.5 bg-[#0F172A] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
                        >
                          Submit Now
                        </button>
                      )}
                      {deliv.status === 'SUBMITTED' && (
                        <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
                           <Clock size={16} className="animate-pulse" />
                           In Review
                        </div>
                      )}
                    </>
                  ) : null
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-[40px] border border-dashed border-gray-200 py-32 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-[25px] flex items-center justify-center mb-6">
            <ClipboardList className="text-gray-200" size={32} />
          </div>
          <h3 className="text-lg font-black text-gray-900 uppercase">No Tasks Active</h3>
          <p className="text-gray-500 font-bold text-sm max-w-xs mx-auto mt-2">
            Project pipeline is clear. Start by adding deliverables for this project.
          </p>
        </div>
      )}
    </div>
  );
};

export default DeliverableListTab;
