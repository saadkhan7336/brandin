import React, { useState } from 'react';
import {
  Plus,
  X,
  LayoutGrid,
  List,
  DollarSign,
  Trash2,
  Edit3,
  Check,
  ChevronRight,
  Calendar,
  Layout,
  Clock,
  AlertCircle,
  RotateCcw,
  MessageSquare
} from 'lucide-react';
import { useOutletContext, NavLink, Outlet } from 'react-router-dom';
import collaborationService from '../../services/collaborationService';
import paymentService from '../../services/paymentService';
import { toast } from 'sonner';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import PayoutConfirmationModal from '../../components/collaboration/PayoutConfirmationModal';

const cn = (...inputs) => twMerge(clsx(inputs));

const CollabTasksTab = () => {
  const { collaboration, userRole, user, onRefresh } = useOutletContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isSmartSetupOpen, setIsSmartSetupOpen] = useState(false);
  const [taskCount, setTaskCount] = useState(1);
  const [smartTasks, setSmartTasks] = useState([]);
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);
  
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
  const [revisionModal, setRevisionModal] = useState({
    isOpen: false,
    deliverableId: null,
    notes: ''
  });

  const [submissionLink, setSubmissionLink] = useState('');

  const handleOpenModal = (deliv = null) => {
    if (!deliv && !collaboration.escrowFunded) {
      toast.error("You must fund the escrow before adding deliverables");
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
    }
  };

  const handleDelete = async (delivId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await collaborationService.deleteDeliverable(collaboration._id, delivId);
      onRefresh();
    } catch (err) {
      alert('Error deleting task');
    }
  };

  const handleOpenSubmitModal = (deliv) => {
    setSelectedDeliverable(deliv);
    setSubmissionLink('');
    setIsSubmitModalOpen(true);
  };

  const handleSubmitDeliverable = async (e) => {
    e.preventDefault();
    try {
      if (!collaboration.escrowFunded) {
        toast.error("Escrow must be funded before submission");
        return;
      }
      if (!user?.stripeAccountId || !user?.stripeOnboardingComplete) {
        toast.error("Please connect your Stripe account in the dashboard before submitting tasks");
        return;
      }
      await paymentService.submitDeliverable(selectedDeliverable._id, {
        submissionFiles: [submissionLink]
      });
      toast.success("Deliverable submitted for review");
      setIsSubmitModalOpen(false);
      onRefresh();
    } catch (err) {
      toast.error(err.message || 'Error submitting task');
    }
  };

  const handleStartDeliverable = async (delivId) => {
    try {
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
    }
  };

  const handleReview = async (deliverableId, status, extra = {}) => {
    try {
      await collaborationService.reviewDeliverable(collaboration._id, deliverableId, { 
        status, 
        ...extra 
      });
      toast.success(status === 'APPROVED' ? 'Deliverable approved!' : 'Revision requested');
      onRefresh();
      setRevisionModal({ isOpen: false, deliverableId: null, notes: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to review deliverable');
    }
  };

  const handleConfirmPayout = async (isFinal) => {
    await handleReview(selectedDeliverable._id, 'APPROVED', { isFinal });
    setIsPayoutModalOpen(false);
  };

  const handleStartSmartSetup = () => {
    const equalBudget = Math.floor(collaboration.agreedBudget / taskCount);
    const tasks = Array.from({ length: taskCount }, (_, i) => ({
      title: `Deliverable ${i + 1}`,
      allocatedBudget: i === taskCount - 1 ? collaboration.agreedBudget - (equalBudget * (taskCount - 1)) : equalBudget,
      platform: 'instagram',
      description: '',
      dueDate: new Date(Date.now() + (7 * (i + 1) * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      isFinal: i === taskCount - 1 // Last task is automatically the final one
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
    if (currentSmartTotal > collaboration.agreedBudget) {
      toast.error("Total budget exceeded!");
      return;
    }
    try {
      for (const task of smartTasks) {
        await collaborationService.addDeliverable(collaboration._id, task);
      }
      setIsSmartSetupOpen(false);
      onRefresh();
      toast.success(`${smartTasks.length} tasks created successfully`);
    } catch (err) {
      toast.error("Error creating tasks");
    }
  };

  const handleOnDragEnd = async (result) => {
    if (userRole === 'brand') return;

    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;

    if (newStatus === 'APPROVED' || newStatus === 'REVISION_REQUESTED') {
      alert("Only the brand can review and approve tasks.");
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
      await collaborationService.updateDeliverable(collaboration._id, draggableId, { status: newStatus });
      onRefresh();
    } catch (error) {
      console.error('Error adding/updating deliverable:', error);
      toast.error(error.message || 'Failed to process deliverable');
    }
  };

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
                className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
              >
                <LayoutGrid size={16} />
                Smart Setup
              </button>
            )}
            <button
              onClick={() => handleOpenModal()}
              disabled={!collaboration.escrowFunded || (isBudgetExhausted && !selectedDeliverable)}
              title={
                !collaboration.escrowFunded ? "Fund escrow to add tasks" : 
                isBudgetExhausted ? "Budget fully allocated. Edit existing tasks to free up budget." : ""
              }
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
            >
              <Plus size={16} />
              {isBudgetExhausted && !selectedDeliverable ? "Budget Completed" : "Create New Task"}
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
          setRevisionModal
        }} />
      </div>

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Project Submission</h2>
              <button onClick={() => setIsSubmitModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitDeliverable} className="p-6 space-y-6">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Active Deliverable</p>
                <p className="font-bold text-gray-900 uppercase">{selectedDeliverable?.title}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1.5 block">Content Asset Link</label>
                <input
                  required
                  type="url"
                  value={submissionLink}
                  onChange={(e) => setSubmissionLink(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium transition-all text-sm"
                  placeholder="https://drive.google.com/..."
                />
                <p className="text-[10px] font-bold text-gray-400 mt-2 p-2 border-l-2 border-blue-200 bg-gray-50 rounded-r-lg">Provide a link to your content files, drive, or final live post link here.</p>
              </div>

              <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-blue-700 active:scale-95 transition-all">
                Finalize Submission
              </button>
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

      {/* Smart Setup Modal */}
      {isSmartSetupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Campaign Smart Setup</h2>
                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Auto-divide budget across multiple tasks</p>
              </div>
              <button onClick={() => setIsSmartSetupOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900">
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
                    currentSmartTotal > collaboration.agreedBudget ? "text-red-600" : "text-emerald-600"
                  )}>
                    ${currentSmartTotal.toLocaleString()} / ${collaboration.agreedBudget.toLocaleString()}
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
                    disabled={currentSmartTotal > collaboration.agreedBudget}
                    onClick={handleSaveSmartTasks}
                    className="px-8 py-3 bg-[#0F172A] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-50"
                  >
                    Finalize Setup
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
                    onClick={() => handleReview(revisionModal.deliverableId, 'REVISION_REQUESTED', { revisionNotes: revisionModal.notes })}
                    disabled={!revisionModal.notes.trim()}
                    className="flex-[2] px-8 py-4 bg-amber-500 text-white text-xs font-black rounded-2xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30 uppercase tracking-widest disabled:opacity-50 disabled:shadow-none"
                  >
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
