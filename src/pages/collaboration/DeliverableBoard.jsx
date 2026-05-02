import React from 'react';
import { 
  ExternalLink,
  Calendar,
  Edit3,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useOutletContext } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const DeliverableBoard = () => {
  const { 
    collaboration, 
    userRole, 
    handleReview, 
    handleOpenSubmitModal, 
    handleOpenModal: handleEdit,
    handleDelete, 
    handleOnDragEnd: onDragEnd,
    handleStartDeliverable 
  } = useOutletContext();

  if (!collaboration) return null;
  const { deliverables = [] } = collaboration;

  const columns = [
    { id: 'PENDING', title: 'To Do', color: 'bg-gray-100', text: 'text-gray-900', border: 'border-gray-200' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-indigo-100', text: 'text-indigo-900', border: 'border-indigo-200' },
    { id: 'SUBMITTED', title: 'Delivered', color: 'bg-blue-100', text: 'text-blue-900', border: 'border-blue-200' },
    { id: 'REVISION_REQUESTED', title: 'Revision Request', color: 'bg-amber-100', text: 'text-amber-900', border: 'border-amber-200' },
    { id: 'APPROVED', title: 'Approved', color: 'bg-emerald-100', text: 'text-emerald-900', border: 'border-emerald-200' },
  ];

  const getDeliverablesByStatus = (status) => {
    return deliverables.filter(d => {
       // Map multiple statuses to columns if needed, but for now 1:1
       return d.status === status;
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto pb-6 -mx-4 px-4 h-[calc(100vh-420px)] min-h-[600px]">
        {columns.map((column, idx) => (
          <div key={column.id} className="flex-1 min-w-[350px] flex flex-col relative px-4 first:pl-0 last:pr-0">
            {/* Minimal Segregation Line */}
            {idx > 0 && (
              <div className="absolute left-0 top-0 bottom-10 w-[1px] bg-gray-100" />
            )}
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-3">
              <div className="flex items-center gap-2.5">
                <div className={cn("w-1.5 h-6 rounded-full", column.color)} />
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{column.title}</h3>
                <span className={cn(
                  "px-2 py-0.5 rounded-lg text-[10px] font-bold border",
                  column.color,
                  column.text,
                  column.border
                )}>
                  {getDeliverablesByStatus(column.id).length}
                </span>
              </div>
            </div>

            {/* Column Tasks (Droppable) */}
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn(
                    "flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-4 overflow-y-auto transition-colors",
                    snapshot.isDraggingOver && "bg-blue-50/50 border-blue-100"
                  )}
                >
                  {getDeliverablesByStatus(column.id).map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index} isDragDisabled={userRole === 'brand' || collaboration.status === 'completed'}>
                      {(provided, snapshot) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={cn(
                            "bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all group relative",
                            snapshot.isDragging && "shadow-lg ring-2 ring-blue-500/20 rotate-1 scale-[1.02] z-50",
                            task.status === 'APPROVED' && "border-emerald-100 bg-emerald-50/10"
                          )}
                        >
                          {/* CRUD Actions for Brands */}
                          {userRole === 'brand' && collaboration.status !== 'completed' && (
                            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleEdit(task); }}
                                className="p-2 bg-white/90 backdrop-blur-sm border border-gray-100 text-gray-400 hover:text-blue-600 rounded-lg shadow-sm transition-all"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(task._id); }}
                                className="p-2 bg-white/90 backdrop-blur-sm border border-gray-100 text-gray-400 hover:text-red-600 rounded-lg shadow-sm transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}

                          <div className="flex items-center justify-between mb-4">
                            <span className={cn(
                              "text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border",
                              task.priority === 'HIGH' ? "bg-red-50 text-red-600 border-red-100" : 
                              task.priority === 'LOW' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                              "bg-amber-50 text-amber-600 border-amber-100"
                            )}>
                              {task.priority || 'MEDIUM'}
                            </span>
                            {task.paymentStatus === 'paid' && (
                              <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                <CheckCircle size={10} />
                                Paid
                              </div>
                            )}
                            {task.status === 'SUBMITTED' && collaboration.status !== 'completed' && (
                              <div className="flex items-center gap-1.5 text-[9px] font-bold text-blue-500 uppercase tracking-wider animate-pulse">
                                <AlertCircle size={10} />
                                In Review
                              </div>
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-gray-900 capitalize mb-2 leading-tight tracking-tight">
                            {task.title}
                          </h4>
                          
                          <p className="text-[10px] font-bold text-gray-400 line-clamp-2 mb-5 leading-relaxed">
                            {task.description || "Creation and delivery of project core assets."}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-50/50">
                            <div className="flex items-center gap-2">
                               <div className="flex -space-x-2">
                                  <img 
                                    src={collaboration.influencer?.profilePic || "https://ui-avatars.com/api/?name=I&background=random"} 
                                    className="w-7 h-7 rounded-lg border-2 border-white shadow-sm object-cover" 
                                    alt="Influencer"
                                  />
                                  <img 
                                    src={collaboration.brand?.profilePic || "https://ui-avatars.com/api/?name=B&background=random"} 
                                    className="w-7 h-7 rounded-lg border-2 border-white shadow-sm object-cover" 
                                    alt="Brand"
                                  />
                               </div>
                            </div>
                            
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                              <Calendar size={12} className="text-gray-400" />
                              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>

                          {/* Primary Context Action */}
                          <div className="mt-4 flex flex-col gap-2">
                             {task.submissionFiles?.[0] && task.status !== 'PENDING' && task.status !== 'IN_PROGRESS' && (
                                <a 
                                  href={task.submissionFiles[0]} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="w-full py-2.5 bg-white border border-blue-100 text-blue-600 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-blue-50"
                                >
                                  <ExternalLink size={14} />
                                  View Submission
                                </a>
                             )}

                             {collaboration.status === 'completed' ? (
                               <div className="flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-xl uppercase tracking-wider border border-blue-100">
                                 <CheckCircle size={14} />
                                 Project Completed
                               </div>
                             ) : task.status === 'APPROVED' ? (
                               <div className="flex items-center justify-center gap-2 py-2.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-xl uppercase tracking-wider border border-emerald-100">
                                 <CheckCircle size={14} />
                                 Finalized
                               </div>
                             ) : userRole === 'brand' && task.status === 'SUBMITTED' ? (
                               <div className="flex gap-2">
                                 <button 
                                   onClick={(e) => { e.stopPropagation(); handleReview(task._id, 'APPROVED'); }}
                                   className="flex-1 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 hover:bg-emerald-700"
                                 >
                                   Approve & Pay
                                 </button>
                                 <button 
                                   onClick={(e) => { e.stopPropagation(); handleReview(task._id, 'REVISION_REQUESTED'); }}
                                   className="flex-1 py-2 bg-white border border-amber-200 text-amber-600 text-xs font-bold rounded-xl transition-all active:scale-95 hover:bg-amber-50"
                                 >
                                   Revise
                                 </button>
                                </div>
                             ) : userRole === 'influencer' ? (
                               <>
                                 {task.status === 'PENDING' && (
                                   <button 
                                      onClick={(e) => { e.stopPropagation(); handleStartDeliverable(task._id); }}
                                      disabled={!collaboration.escrowFunded}
                                      className={cn(
                                        "w-full py-2.5 text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2",
                                        !collaboration.escrowFunded ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"
                                      )}
                                   >
                                     <Calendar size={14} /> Start Task
                                   </button>
                                 )}
                                 {(task.status === 'IN_PROGRESS' || task.status === 'REVISION_REQUESTED') && (
                                   <button 
                                      onClick={(e) => { e.stopPropagation(); handleOpenSubmitModal(task); }}
                                      className="w-full py-2.5 bg-[#1A1A1A] text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 hover:bg-black"
                                   >
                                     Submit Now
                                   </button>
                                 )}
                                 {task.status === 'SUBMITTED' && (
                                    <div className="w-full py-2.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-blue-100">
                                       <AlertCircle size={14} /> In Review
                                    </div>
                                 )}
                               </>
                             ) : null}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default DeliverableBoard;
