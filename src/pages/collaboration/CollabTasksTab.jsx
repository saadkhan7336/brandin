import React, { useState } from 'react';
import {
  Plus,
  X,
  LayoutGrid,
  List,
  DollarSign,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { useOutletContext, NavLink, Outlet } from 'react-router-dom';
import collaborationService from '../../services/collaborationService';
import paymentService from '../../services/paymentService';
import { toast } from 'sonner';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import PayoutConfirmationModal from '../../components/collaboration/PayoutConfirmationModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { Button } from '../../components/common/Button';

const cn = (...inputs) => twMerge(clsx(inputs));

const CollabTasksTab = () => {
  const { collaboration, userRole, user, onRefresh } = useOutletContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isSmartSetupOpen, setIsSmartSetupOpen] = useState(false);
  const [isAddOnMode, setIsAddOnMode] = useState(false);
  const [taskCount, setTaskCount] = useState(1);
  const [smartTasks, setSmartTasks] = useState([]);
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {}, variant: 'primary' });
  
  // Budget Exhaustion Logic
  const totalAllocated = collaboration.deliverables?.reduce((sum, d) => sum + (d.allocatedBudget || 0), 0) || 0;
  const remainingBudget = (collaboration.agreedBudget || 0) - totalAllocated;
  const isBudgetExhausted = remainingBudget <= 0;

  const [formData, setFormData] = useState({
    title: '',
    platform: 'instagram',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    allocatedBudget: '',
    isFinal: false
  });
  
  // Revision Modal State
  const [revisionModal, setRevisionModal] = useState({ isOpen: false, deliverableIds: [], notes: '' });

  const [submissionLinks, setSubmissionLinks] = useState({});
  const [tasksToSubmit, setTasksToSubmit] = useState([]);

  const handleOpenModal = (deliv = null) => {
    if (!collaboration.brandAgreed || !collaboration.influencerAgreed) {
      toast.error("Agreement must be signed by both parties before adding deliverables.");
      return;
    }
    if (!deliv && !collaboration.escrowFunded) {
      toast.error("Budget must be funded before adding deliverables. Please click 'Fund Escrow Now' first.", {
        duration: 5000,
        id: 'escrow-required'
      });
      return;
    }
    if (deliv) {
      setSelectedDeliverable(deliv);
      setFormData({
        title: deliv.title,
        platform: deliv.platform,
        description: deliv.description,
        dueDate: deliv.dueDate ? new Date(deliv.dueDate).toISOString().split('T')[0] : '',
        priority: deliv.priority || 'MEDIUM',
        allocatedBudget: deliv.allocatedBudget || 0,
        isFinal: deliv.isFinal || false
      });
    } else {
      setSelectedDeliverable(null);
      setFormData({
        title: '',
        platform: 'instagram',
        description: '',
        dueDate: '',
        priority: 'MEDIUM',
        allocatedBudget: '',
        isFinal: false
      });
    }
    setIsModalOpen(true);
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsActionLoading(true);
      // Basic Budget Check
      const otherTasksBudget = collaboration.deliverables
        ?.filter(d => d._id !== selectedDeliverable?._id)
        ?.reduce((sum, d) => sum + (d.allocatedBudget || 0), 0) || 0;

      if (otherTasksBudget + Number(formData.allocatedBudget) > collaboration.agreedBudget) {
        toast.error(`Cannot exceed total budget of $${collaboration.agreedBudget}`);
        return;
      }

      if (selectedDeliverable) {
        await collaborationService.updateDeliverable(collaboration._id, selectedDeliverable._id, formData);
      } else {
        await collaborationService.addDeliverable(collaboration._id, formData);
      }
      setIsModalOpen(false);
      onRefresh();
      toast.success("Task saved successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving deliverable');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = (delivId) => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete Deliverable?",
      message: "Are you sure you want to delete this task? This action cannot be undone.",
      variant: "danger",
      onConfirm: async () => {
        try {
          setIsActionLoading(true);
          await collaborationService.deleteDeliverable(collaboration._id, delivId);
          onRefresh();
          toast.success("Task deleted");
        } catch (err) {
          toast.error('Error deleting task');
        } finally {
          setIsActionLoading(false);
          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleOpenSubmitModal = (deliv) => {
    const tasks = Array.isArray(deliv) ? deliv : [deliv];
    setTasksToSubmit(tasks);
    const initialLinks = {};
    tasks.forEach(t => {
      initialLinks[t._id] = '';
    });
    setSubmissionLinks(initialLinks);
    setIsSubmitModalOpen(true);
  };

  const handleSubmitDeliverable = async (e) => {
    e.preventDefault();
    try {
      setIsActionLoading(true);
      if (!collaboration.brandAgreed || !collaboration.influencerAgreed) {
        toast.error("Agreement must be signed by both parties before work can begin");
        return;
      }
      if (!collaboration.escrowFunded) {
        toast.error("Escrow must be funded before submission");
        return;
      }
      if (!user?.stripeAccountId || !user?.stripeOnboardingComplete) {
        toast.error("Please connect your Stripe account in the dashboard before submitting tasks");
        return;
      }

      for (const task of tasksToSubmit) {
        const link = submissionLinks[task._id];
        if (!link) {
          toast.error(`Please provide a link for ${task.title}`);
          return;
        }
        await paymentService.submitDeliverable(task._id, {
          submissionFiles: [link]
        });
      }

      toast.success(`${tasksToSubmit.length} tasks submitted successfully`);
      setIsSubmitModalOpen(false);
      setSelectedTaskIds([]);
      onRefresh();
    } catch (err) {
      toast.error(err.message || 'Error submitting tasks');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleStartDeliverable = async (delivId) => {
    try {
      setIsActionLoading(true);
      if (!collaboration.brandAgreed || !collaboration.influencerAgreed) {
        toast.error("Agreement must be signed by both parties before starting tasks");
        return;
      }
      if (!collaboration.escrowFunded) {
        toast.error("Escrow must be funded before starting task");
        return;
      }
      if (!user?.stripeAccountId || !user?.stripeOnboardingComplete) {
        toast.error("Please connect your Stripe account in the dashboard before starting tasks");
        return;
      }
      await paymentService.startDeliverable(delivId);
      toast.success("Task started! Good luck.");
      onRefresh();
    } catch (err) {
      toast.error(err.message || "Failed to start task");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReview = async (deliverableId, status, extra = {}) => {
    try {
      setIsActionLoading(true);
      const ids = Array.isArray(deliverableId) ? deliverableId : [deliverableId];
      
      for (const id of ids) {
        await collaborationService.reviewDeliverable(collaboration._id, id, { 
          status, 
          ...extra 
        });
      }
      
      toast.success(status === 'APPROVED' ? `Successfully processed ${ids.length} tasks` : `Revision requested for ${ids.length} tasks`);
      onRefresh();
      setRevisionModal({ isOpen: false, deliverableIds: [], notes: '' });
      if (ids.length > 1) setSelectedTaskIds([]);
    } catch (error) {
      toast.error(error.message || 'Failed to review deliverable');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleConfirmPayout = async (isFinal) => {
    await handleReview(selectedDeliverable._id, 'APPROVED', { isFinal });
    setIsPayoutModalOpen(false);
  };

  const handleStartSmartSetup = () => {
    const existingBudget = collaboration.deliverables?.reduce((sum, d) => sum + (d.allocatedBudget || 0), 0) || 0;
    const remainingBudget = collaboration.agreedBudget - existingBudget;

    if (!isAddOnMode && remainingBudget <= 0) {
      toast.error("No budget remaining for smart setup.");
      return;
    }

    const equalBudget = isAddOnMode ? 0 : Math.floor(remainingBudget / taskCount);
    const tasks = Array.from({ length: taskCount }, (_, i) => ({
      title: `Deliverable ${i + 1}`,
      allocatedBudget: isAddOnMode ? 50 : (i === taskCount - 1 ? remainingBudget - (equalBudget * (taskCount - 1)) : equalBudget),
      platform: 'instagram',
      description: '',
      priority: 'MEDIUM',
      dueDate: new Date(Date.now() + (7 * (i + 1) * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      isFinal: !isAddOnMode && (i === taskCount - 1)
    }));
    setSmartTasks(tasks);
  };

  const handleSmartTaskChange = (index, field, value) => {
    const updated = [...smartTasks];
    updated[index][field] = value;
    setSmartTasks(updated);
  };

  const currentSmartTotal = smartTasks.reduce((sum, t) => sum + Number(t.allocatedBudget || 0), 0);

  const handleSaveSmartTasks = async () => {
    try {
      setIsActionLoading(true);
      
      if (isAddOnMode) {
        // Request additional tasks via actionRequest
        await collaborationService.requestAction(collaboration._id, {
          type: 'ADD_TASKS',
          reason: 'Requesting additional deliverables for the project.',
          proposedTasks: smartTasks.map(t => ({
            ...t,
            platform: 'instagram',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }))
        });
        toast.success("Additional tasks request sent to influencer!");
        setIsAddOnMode(false);
      } else {
        const existingBudget = collaboration.deliverables?.reduce((sum, d) => sum + (d.allocatedBudget || 0), 0) || 0;
        if (existingBudget + currentSmartTotal > collaboration.agreedBudget) {
          toast.error(`Total budget exceeded! You only have $${collaboration.agreedBudget - existingBudget} remaining.`);
          return;
        }
        if (!collaboration.escrowFunded) {
          toast.error("Escrow must be funded before finalize setup.");
          return;
        }
        for (const task of smartTasks) {
          await collaborationService.addDeliverable(collaboration._id, task);
        }
        toast.success(`${smartTasks.length} tasks created successfully`);
      }
      
      setIsSmartSetupOpen(false);
      setSmartTasks([]);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error processing tasks");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleOnDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    
    // Determine the set of tasks being dragged
    const isMultiDrag = selectedTaskIds.includes(draggableId);
    const tasksToMove = isMultiDrag ? selectedTaskIds : [draggableId];

    if (userRole === 'brand') {
      if (newStatus !== 'APPROVED' && newStatus !== 'REVISION_REQUESTED') {
        toast.error("Brands can only move tasks to Approved or Revision statuses.");
        return;
      }
      
      if (newStatus === 'REVISION_REQUESTED') {
        // Only open revision modal for the first one if doing bulk
        setRevisionModal({ isOpen: true, deliverableIds: tasksToMove, notes: isMultiDrag ? 'Bulk revision for selected tasks' : '' });
        return;
      }

      try {
        setIsActionLoading(true);
        for (const id of tasksToMove) {
          await collaborationService.reviewDeliverable(collaboration._id, id, { status: 'APPROVED' });
        }
        toast.success(`Successfully processed ${tasksToMove.length} tasks`);
        if (isMultiDrag) setSelectedTaskIds([]);
        onRefresh();
      } catch (error) {
        toast.error('Failed to process tasks');
      } finally {
        setIsActionLoading(false);
      }
      return;
    }

    // Influencer Logic
    if (newStatus === 'APPROVED' || newStatus === 'REVISION_REQUESTED') {
      toast.error("Only the brand can review and approve tasks.");
      return;
    }

    if (newStatus === 'SUBMITTED') {
      const task = collaboration.deliverables?.find(d => d._id === draggableId);
      if (task) {
        handleOpenSubmitModal(task);
      }
      return;
    }

    try {
      setIsActionLoading(true);
      // Bulk update tasks to IN_PROGRESS or PENDING sequentially
      for (const id of tasksToMove) {
        await collaborationService.updateDeliverable(collaboration._id, id, { status: newStatus });
      }
      toast.success(`Successfully updated ${tasksToMove.length} tasks`);
      if (isMultiDrag) setSelectedTaskIds([]);
      onRefresh();
    } catch (error) {
      console.error('Error adding/updating deliverable:', error);
      toast.error(error.message || 'Failed to process deliverable');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Bulk Selection Handlers
  const handleToggleTask = (taskId) => {
    setSelectedTaskIds(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedTaskIds.length === collaboration.deliverables?.length) {
      setSelectedTaskIds([]);
      return;
    }

    const statuses = new Set(collaboration.deliverables?.map(d => d.status));
    if (statuses.size > 1) {
      toast.error("Bulk selection is only allowed for tasks with the same status. Please select tasks manually.");
      return;
    }

    setSelectedTaskIds(collaboration.deliverables?.map(d => d._id) || []);
  };



  const handleBulkApprove = async () => {
    if (!window.confirm(`Approve and Pay for ${selectedTaskIds.length} tasks?`)) return;
    try {
      setIsActionLoading(true);
      for (const id of selectedTaskIds) {
        await collaborationService.reviewDeliverable(collaboration._id, id, { status: 'APPROVED' });
      }
      toast.success(`Successfully processed ${selectedTaskIds.length} tasks`);
      setSelectedTaskIds([]);
      onRefresh();
    } catch (err) {
      toast.error('Error processing bulk approvals');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleBulkDelete = () => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete Selected?",
      message: `Are you sure you want to delete ${selectedTaskIds.length} tasks? This action cannot be undone.`,
      variant: "danger",
      onConfirm: async () => {
        try {
          setIsActionLoading(true);
          for (const id of selectedTaskIds) {
            await collaborationService.deleteDeliverable(collaboration._id, id);
          }
          toast.success(`Successfully deleted ${selectedTaskIds.length} tasks`);
          setSelectedTaskIds([]);
          onRefresh();
        } catch (err) {
          toast.error('Error deleting tasks in bulk');
        } finally {
          setIsActionLoading(false);
          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleBulkStart = async () => {
    try {
      setIsActionLoading(true);
      for (const id of selectedTaskIds) {
        await paymentService.startDeliverable(id);
      }
      toast.success(`Successfully started ${selectedTaskIds.length} tasks`);
      setSelectedTaskIds([]);
      onRefresh();
    } catch (err) {
      toast.error('Error starting tasks in bulk');
    } finally {
      setIsActionLoading(false);
    }
  };

  const selectedDeliverablesData = (collaboration.deliverables || []).filter(d => selectedTaskIds.includes(d._id));
  const allSelectedPending = selectedDeliverablesData.length > 0 && selectedDeliverablesData.every(d => d.status === 'PENDING');
  const allSelectedSubmitted = selectedDeliverablesData.length > 0 && selectedDeliverablesData.every(d => 
    d.status === 'SUBMITTED' || (d.status === 'APPROVED' && d.paymentStatus === 'unpaid')
  );
  const allSelectedInProgressOrRevise = selectedDeliverablesData.length > 0 && selectedDeliverablesData.every(d => d.status === 'IN_PROGRESS' || d.status === 'REVISION_REQUESTED');
  const noneSelectedApprovedOrSubmitted = selectedDeliverablesData.length > 0 && selectedDeliverablesData.every(d => d.status !== 'APPROVED' && d.status !== 'SUBMITTED');

  return (
    <div className="space-y-6">
      {/* View Toggle & Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
          <NavLink
            to="list"
            className={({ isActive }) => cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
              isActive ? 'bg-[#0F172A] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'
            )}
          >
            <List size={14} />
            List
          </NavLink>
          <NavLink
            to="board"
            className={({ isActive }) => cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
              isActive ? 'bg-[#0F172A] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'
            )}
          >
            <LayoutGrid size={14} />
            Board
          </NavLink>
        </div>

        {userRole === 'brand' && collaboration?.status !== 'completed' && (
          <div className="flex gap-3">
            {collaboration.deliverables?.length === 0 && (
              <button
                onClick={() => setIsSmartSetupOpen(true)}
                disabled={!collaboration.brandAgreed || !collaboration.influencerAgreed}
                className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LayoutGrid size={16} />
                Smart Setup
              </button>
            )}
            <button 
              onClick={() => {
                if (isBudgetExhausted && !selectedDeliverable) {
                  setIsAddOnMode(true);
                  setIsSmartSetupOpen(true);
                  setSmartTasks([]);
                } else {
                  handleOpenModal();
                }
              }}
              disabled={(!collaboration.escrowFunded && !isBudgetExhausted) || !collaboration.brandAgreed || !collaboration.influencerAgreed}
              title={(!collaboration.escrowFunded && !isBudgetExhausted) || !collaboration.brandAgreed || !collaboration.influencerAgreed ? "Agreements and Escrow must be cleared first" : ""}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
            >
              <Plus size={16} />
              {isBudgetExhausted && !selectedDeliverable ? "Request Add-on Tasks" : "Create New Task"}
            </button>
          </div>
        )}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <Outlet context={{
          collaboration,
          userRole,
          onRefresh,
          handleReview,
          handleOpenModal,
          handleDelete,
          handleOpenSubmitModal,
          handleOnDragEnd,
          handleStartDeliverable,
          setRevisionModal,
          selectedTaskIds,
          handleToggleTask,
          handleToggleSelectAll
        }} />
      </div>

      {/* Floating Bulk Action Toolbar */}
      {selectedTaskIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-[#0F172A] text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 border border-gray-800">
             <div className="flex items-center gap-3 pr-6 border-r border-gray-700">
                <span className="flex items-center justify-center bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full">
                  {isActionLoading ? <Loader2 size={12} className="animate-spin" /> : selectedTaskIds.length}
                </span>
                <span className="text-sm font-bold uppercase tracking-widest text-gray-300">
                  {isActionLoading ? 'Processing...' : 'Selected'}
                </span>
             </div>
             
               <div className="flex items-center gap-3">
                {selectedTaskIds.length < (collaboration.deliverables?.length || 0) && (
                  <button 
                    onClick={() => setSelectedTaskIds(collaboration.deliverables.map(d => d._id))}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                  >
                    Select All
                  </button>
                )}
                {userRole === 'brand' && (
                  <>
                    {allSelectedSubmitted && (
                       <Button 
                         size="sm"
                         variant="success"
                         onClick={handleBulkApprove} 
                         isLoading={isActionLoading}
                         className="rounded-xl text-[10px] font-black uppercase tracking-widest"
                       >
                         Approve & Pay All
                       </Button>
                    )}
                    {allSelectedSubmitted && (
                       <Button 
                         size="sm"
                         variant="warning"
                         onClick={() => setRevisionModal({ isOpen: true, deliverableIds: selectedTaskIds, notes: 'Bulk revision for selected tasks' })} 
                         disabled={isActionLoading}
                         className="rounded-xl text-[10px] font-black uppercase tracking-widest"
                       >
                         Revise All
                       </Button>
                    )}
                    {noneSelectedApprovedOrSubmitted && (
                       <Button 
                         size="sm"
                         variant="danger"
                         onClick={handleBulkDelete} 
                         isLoading={isActionLoading}
                         className="rounded-xl text-[10px] font-black uppercase tracking-widest"
                       >
                         Delete All
                       </Button>
                    )}
                  </>
                )}
                {userRole === 'influencer' && (
                  <>
                     {allSelectedPending && (
                        <Button 
                          size="sm"
                          variant="primary"
                          onClick={handleBulkStart} 
                          isLoading={isActionLoading}
                          className="rounded-xl text-[10px] font-black uppercase tracking-widest"
                        >
                          Start All Tasks
                        </Button>
                     )}
                     {allSelectedInProgressOrRevise && (
                        <Button 
                          size="sm"
                          variant="primary"
                          onClick={() => handleOpenSubmitModal(selectedDeliverablesData)} 
                          isLoading={isActionLoading}
                          className="rounded-xl text-[10px] font-black uppercase tracking-widest"
                        >
                          Submit All
                        </Button>
                     )}
                  </>
                )}
                <button 
                  onClick={() => setSelectedTaskIds([])} 
                  disabled={isActionLoading}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all ml-2 disabled:opacity-50"
                >
                   <X size={16} />
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Modals Ported from DeliverablesPage */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">{selectedDeliverable ? 'Edit Strategy' : 'New Deliverable'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddOrUpdate} className="p-6 space-y-6">
              {isBudgetExhausted && !selectedDeliverable && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3">
                  <div className="bg-red-500 text-white p-1 rounded-lg mt-0.5">
                    <X size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-red-600 uppercase tracking-widest">Budget Exhausted</p>
                    <p className="text-[11px] font-bold text-red-500/80 leading-relaxed mt-1">
                      The total campaign budget of ${collaboration.agreedBudget.toLocaleString()} is already fully allocated. 
                      Please edit existing tasks to reduce their budget before adding a new one.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Task Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium transition-all text-sm"
                    placeholder="e.g. UNBOXING REEL"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium transition-all text-sm"
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Deadline</label>
                    <input
                      required
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Specifications</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium transition-all text-sm min-h-[120px]"
                    placeholder="Enter detailed requirements..."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Allocated Budget ($)</label>
                  <div className="relative">
                    <input
                      required
                      type="number"
                      min="1"
                      max={collaboration.agreedBudget}
                      value={formData.allocatedBudget}
                      onChange={(e) => setFormData({ ...formData, allocatedBudget: e.target.value === '' ? '' : Number(e.target.value) })}
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium transition-all text-sm"
                      placeholder="Enter amount (e.g. 500)"
                    />
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 mt-2 ml-1 uppercase tracking-widest">
                    Total Campaign Budget: ${collaboration.agreedBudget.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <input
                    type="checkbox"
                    id="isFinal"
                    checked={formData.isFinal}
                    onChange={(e) => setFormData({ ...formData, isFinal: e.target.checked })}
                    className="w-5 h-5 rounded-lg border-blue-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isFinal" className="text-xs font-bold text-blue-800 uppercase tracking-tight cursor-pointer">
                    Mark as Final Task (Releases all remaining escrow funds)
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-700 active:scale-95 transition-all shadow-sm">
                  {selectedDeliverable ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Project Submission</h2>
                <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-widest">Provide asset links for {tasksToSubmit.length} task(s)</p>
              </div>
              <button onClick={() => setIsSubmitModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-all text-gray-400 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitDeliverable} className="p-8 space-y-6">
              <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                {tasksToSubmit.map((task) => (
                  <div key={task._id} className="p-5 rounded-3xl bg-gray-50 border-2 border-gray-100 space-y-4 hover:border-blue-500/10 transition-all group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Asset Source</p>
                      </div>
                      <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-700 text-[9px] font-black uppercase tracking-widest">Required</span>
                    </div>
                    
                    <p className="font-black text-gray-900 text-sm uppercase tracking-tight">{task.title}</p>
                    
                    <div className="relative">
                      <input
                        required
                        type="url"
                        value={submissionLinks[task._id] || ''}
                        onChange={(e) => setSubmissionLinks(prev => ({ ...prev, [task._id]: e.target.value }))}
                        className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-gray-100 focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 font-bold transition-all text-sm placeholder:text-gray-300"
                        placeholder="Paste Google Drive or Content Link..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all"
                >
                  Confirm & Finalize Submissions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPayoutModalOpen && (
        <PayoutConfirmationModal
          isOpen={isPayoutModalOpen}
          onClose={() => setIsPayoutModalOpen(false)}
          onConfirm={handleConfirmPayout}
          deliverable={selectedDeliverable}
          remainingBudget={collaboration.agreedBudget - (collaboration.totalPaidAmount || 0)}
        />
      )}

      <ConfirmationModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        variant={confirmConfig.variant}
        isLoading={isActionLoading}
      />

      {/* Smart Setup Modal */}
      {isSmartSetupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">{isAddOnMode ? 'Request Additional Tasks' : 'Campaign Smart Setup'}</h2>
                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">
                  {isAddOnMode ? 'Define new tasks and their budget for influencer approval' : 'Auto-divide budget across multiple tasks'}
                </p>
              </div>
              <button onClick={() => {
                setIsSmartSetupOpen(false);
                setIsAddOnMode(false);
                setSmartTasks([]);
              }} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto">
              {smartTasks.length === 0 ? (
                <div className="space-y-6 text-center py-10">
                  <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <LayoutGrid size={32} className="text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">How many deliverables are in this campaign?</h3>
                  <div className="flex items-center justify-center gap-4">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={taskCount}
                      onChange={(e) => setTaskCount(Number(e.target.value))}
                      className="w-24 text-center px-4 py-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-emerald-500 focus:ring-0 font-black text-xl"
                    />
                  </div>
                  <button
                    onClick={handleStartSmartSetup}
                    className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100"
                  >
                    Initialize Budget Split
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    {smartTasks.map((task, idx) => (
                      <div key={idx} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Task Title</label>
                            <input
                              type="text"
                              value={task.title}
                              onChange={(e) => handleSmartTaskChange(idx, 'title', e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-emerald-500 font-bold text-sm"
                            />
                          </div>
                          <div className="w-32">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Budget ($)</label>
                            <input
                              type="number"
                              value={task.allocatedBudget}
                              onChange={(e) => handleSmartTaskChange(idx, 'allocatedBudget', e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-emerald-500 font-black text-sm text-emerald-600"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {smartTasks.length > 0 && (
              <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Allocated</p>
                  <p className={cn(
                    "text-xl font-black",
                    !isAddOnMode && currentSmartTotal > collaboration.agreedBudget ? "text-red-600" : "text-emerald-600"
                  )}>
                    ${currentSmartTotal.toLocaleString()} {!isAddOnMode && `/ ${collaboration.agreedBudget.toLocaleString()}`}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSmartTasks([])}
                    className="px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600"
                  >
                    Reset
                  </button>
                  <button
                    disabled={!isAddOnMode && currentSmartTotal > collaboration.agreedBudget}
                    onClick={handleSaveSmartTasks}
                    className="px-8 py-3 bg-[#0F172A] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-50"
                  >
                    {isAddOnMode ? 'Send Request' : 'Finalize Setup'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Revision Request Modal */}
      {revisionModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setRevisionModal({ ...revisionModal, isOpen: false })} />
          <div className="relative bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Request Revision</h3>
                  <p className="text-sm font-bold text-gray-500">Tell the influencer what needs to be changed</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">Revision Notes</label>
                  <textarea
                    rows={5}
                    value={revisionModal.notes}
                    onChange={(e) => setRevisionModal({ ...revisionModal, notes: e.target.value })}
                    className="w-full p-5 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-amber-500/20 focus:ring-4 focus:ring-amber-500/10 font-bold text-sm transition-all placeholder:text-gray-300 resize-none"
                    placeholder="Example: Please change the background music to something more upbeat and ensure the brand logo is visible for at least 3 seconds..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setRevisionModal({ ...revisionModal, isOpen: false })}
                    className="flex-1 px-8 py-4 bg-gray-100 text-gray-600 text-xs font-black rounded-2xl hover:bg-gray-200 transition-all uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReview(revisionModal.deliverableIds, 'REVISION_REQUESTED', { revisionNotes: revisionModal.notes })}
                    disabled={!revisionModal.notes.trim() || isActionLoading}
                    className="flex-[2] px-8 py-4 bg-amber-500 text-white text-xs font-black rounded-2xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30 uppercase tracking-widest disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {isActionLoading && <Loader2 size={12} className="animate-spin" />}
                    Send Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollabTasksTab;
