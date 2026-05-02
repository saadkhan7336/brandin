import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  LayoutGrid,
  List,
  DollarSign
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
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    platform: 'instagram',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    allocatedBudget: 0
  });

  const [submissionLink, setSubmissionLink] = useState('');

  const handleOpenModal = (deliv = null) => {
    if (deliv) {
      setSelectedDeliverable(deliv);
      setFormData({
        title: deliv.title,
        platform: deliv.platform,
        description: deliv.description,
        dueDate: deliv.dueDate ? new Date(deliv.dueDate).toISOString().split('T')[0] : '',
        priority: deliv.priority || 'MEDIUM',
        allocatedBudget: deliv.allocatedBudget || 0
      });
    } else {
      setSelectedDeliverable(null);
      setFormData({
        title: '',
        platform: 'instagram',
        description: '',
        dueDate: '',
        priority: 'MEDIUM',
        allocatedBudget: 0
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

  const handleReview = async (delivId, status, extraData = {}) => {
    try {
      if (status === 'APPROVED' && !isPayoutModalOpen) {
        const deliv = collaboration.deliverables.find(d => d._id === delivId);
        setSelectedDeliverable(deliv);
        setIsPayoutModalOpen(true);
        return;
      }

      await collaborationService.reviewDeliverable(collaboration._id, delivId, { 
        status, 
        ...extraData 
      });
      
      toast.success(status === 'APPROVED' ? "Deliverable approved and payment released!" : "Status updated");
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Error updating status');
    }
  };

  const handleConfirmPayout = async (isFinal) => {
    await handleReview(selectedDeliverable._id, 'APPROVED', { isFinal });
    setIsPayoutModalOpen(false);
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
    } catch (err) {
      console.error("Board update error:", err);
      alert('Failed to update task status');
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
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={16} />
            Create New Task
          </button>
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
          handleStartDeliverable
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
             
             <form onSubmit={handleAddOrUpdate} className="p-6 space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Task Title</label>
                    <input 
                      required
                      type="text" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium transition-all text-sm"
                      placeholder="e.g. UNBOXING REEL"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Priority</label>
                      <select 
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Specifications</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, allocatedBudget: Number(e.target.value)})}
                        className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium transition-all text-sm"
                        placeholder="0"
                      />
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 mt-2 ml-1 uppercase tracking-widest">
                      Total Campaign Budget: ${collaboration.agreedBudget.toLocaleString()}
                    </p>
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
    </div>
  );
};

export default CollabTasksTab;
