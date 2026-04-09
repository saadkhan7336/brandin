import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  MoreVertical, 
  Trash2, 
  Edit3,
  Check,
  X,
  Loader2,
  FileText,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Facebook,
  Globe
} from 'lucide-react';
import { useSelector } from 'react-redux';
import collaborationService from '../../services/collaborationService';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const DeliverablesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role;

  const [collaboration, setCollaboration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);
  
  // Form states for adding/editing
  const [formData, setFormData] = useState({
    title: '',
    platform: 'instagram',
    description: '',
    dueDate: ''
  });

  // Form state for submission
  const [submissionLink, setSubmissionLink] = useState('');

  const fetchCollaboration = useCallback(async () => {
    try {
      setLoading(true);
      const response = await collaborationService.getOne(id);
      setCollaboration(response.data);
    } catch (err) {
      console.error('Error fetching collaboration:', err);
      setError('Failed to load collaboration data.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCollaboration();
  }, [fetchCollaboration]);

  const handleOpenModal = (deliv = null) => {
    if (deliv) {
      setSelectedDeliverable(deliv);
      setFormData({
        title: deliv.title,
        platform: deliv.platform,
        description: deliv.description,
        dueDate: deliv.dueDate ? new Date(deliv.dueDate).toISOString().split('T')[0] : ''
      });
    } else {
      setSelectedDeliverable(null);
      setFormData({
        title: '',
        platform: 'instagram',
        description: '',
        dueDate: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (selectedDeliverable) {
        await collaborationService.updateDeliverable(id, selectedDeliverable._id, formData);
      } else {
        await collaborationService.addDeliverable(id, formData);
      }
      setIsModalOpen(false);
      fetchCollaboration();
    } catch (err) {
      alert('Error saving deliverable: ' + (err.message || err));
    }
  };

  const handleDelete = async (delivId) => {
    if (!window.confirm('Are you sure you want to delete this deliverable?')) return;
    try {
      await collaborationService.deleteDeliverable(id, delivId);
      fetchCollaboration();
    } catch (err) {
      alert('Error deleting deliverable');
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
      await collaborationService.submitDeliverable(id, selectedDeliverable._id, {
        submissionFiles: [submissionLink]
      });
      setIsSubmitModalOpen(false);
      fetchCollaboration();
    } catch (err) {
      alert('Error submitting deliverable');
    }
  };

  const handleReview = async (delivId, status) => {
    try {
      await collaborationService.reviewDeliverable(id, delivId, { status });
      fetchCollaboration();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'instagram': return <Instagram size={16} className="text-pink-600" />;
      case 'youtube': return <Youtube size={16} className="text-red-600" />;
      case 'twitter': return <Twitter size={16} className="text-blue-400" />;
      case 'linkedin': return <Linkedin size={16} className="text-blue-700" />;
      case 'facebook': return <Facebook size={16} className="text-blue-600" />;
      default: return <Globe size={16} className="text-gray-400" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'SUBMITTED': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'REVISION_REQUESTED': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'PENDING': return 'bg-gray-50 text-gray-600 border-gray-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-gray-500 font-bold">Loading deliverables...</p>
      </div>
    );
  }

  if (error || !collaboration) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-red-600">{error || 'Collaboration not found'}</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 font-semibold ring-1 ring-blue-600 px-4 py-2 rounded-lg">Go Back</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-20 px-4 md:px-8">
      {/* Header */}
      <div className="mb-8 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-fit mb-4"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3 mb-1">
             <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Project Deliverables</h1>
             <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase tracking-wider border border-blue-100">
                {collaboration.status}
             </span>
          </div>
          <p className="text-gray-500 font-medium text-[15px]">
            {collaboration.campaign?.title} • {userRole === 'brand' ? collaboration.influencer?.fullname : collaboration.brand?.fullname}
          </p>
        </div>

        {userRole === 'brand' && (
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus size={18} />
            Add Deliverable
          </button>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Tasks', value: collaboration.deliverables?.length || 0, icon: FileText, color: 'text-gray-600' },
          { label: 'Completed', value: collaboration.deliverables?.filter(d => d.status === 'APPROVED').length || 0, icon: CheckCircle, color: 'text-emerald-600' },
          { label: 'Pending', value: collaboration.deliverables?.filter(d => d.status === 'PENDING').length || 0, icon: Clock, color: 'text-blue-600' },
          { label: 'Revisions', value: collaboration.deliverables?.filter(d => d.status === 'REVISION_REQUESTED').length || 0, icon: AlertCircle, color: 'text-amber-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={cn("p-2.5 rounded-xl bg-gray-50", stat.color.replace('text', 'bg-opacity-10 text').replace('text', 'text'))}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 capitalize">{stat.label}</p>
              <p className={cn("text-xl font-black", stat.color)}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Deliverables List */}
      <div className="space-y-4">
        {collaboration.deliverables && collaboration.deliverables.length > 0 ? (
          collaboration.deliverables.map((deliv) => (
            <div key={deliv._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                
                {/* Left: Deliverable Info */}
                <div className="flex gap-4 items-start min-w-0">
                  <div className="p-3 bg-gray-50 rounded-xl shrink-0 group-hover:bg-blue-50 transition-colors">
                    {getPlatformIcon(deliv.platform)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[17px] font-bold text-[#0F172A] truncate">{deliv.title}</h3>
                      <span className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border tracking-wider uppercase',
                        getStatusStyle(deliv.status)
                      )}>
                        {deliv.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1 mb-2">{deliv.description || 'No description provided.'}</p>
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        Due: {new Date(deliv.dueDate).toLocaleDateString()}
                      </div>
                      {deliv.submissionFiles?.[0] && (
                        <a 
                          href={deliv.submissionFiles[0]} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1.5 text-blue-600 hover:underline"
                        >
                          <ExternalLink size={14} />
                          Submission View
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {userRole === 'brand' ? (
                    <>
                      {deliv.status === 'SUBMITTED' && (
                        <>
                          <button 
                            onClick={() => handleReview(deliv._id, 'APPROVED')}
                            className="p-2 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                            title="Approve"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => handleReview(deliv._id, 'REVISION_REQUESTED')}
                            className="p-2 text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                            title="Request Revision"
                          >
                            <ArrowLeft size={18} />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleOpenModal(deliv)}
                        className="p-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                         onClick={() => handleDelete(deliv._id)}
                        className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      {deliv.status !== 'APPROVED' && (
                        <button 
                          onClick={() => handleOpenSubmitModal(deliv)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                            deliv.status === 'SUBMITTED' || deliv.status === 'REVISION_REQUESTED' 
                              ? "bg-amber-50 text-amber-700 border border-amber-100" 
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          )}
                        >
                          {deliv.status === 'SUBMITTED' ? 'Resubmit' : 'Submit Now'}
                        </button>
                      )}
                      {deliv.status === 'APPROVED' && (
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                           <CheckCircle size={18} />
                           Completed
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
               <FileText className="text-gray-200" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No deliverables yet</h3>
            <p className="text-sm text-gray-500 max-w-[250px] mx-auto mb-6">
              {userRole === 'brand' 
                ? "Start by adding the tasks you need the influencer to complete." 
                : "Wait for the brand to assign tasks for this collaboration."}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">{selectedDeliverable ? 'Edit Deliverable' : 'Add New Deliverable'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddOrUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Title</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium" 
                  placeholder="e.g. 1 Instagram Post & 3 Stories"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Platform</label>
                  <select 
                    value={formData.platform}
                    onChange={(e) => setFormData({...formData, platform: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-gray-700 appearance-none bg-white"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Due Date</label>
                  <input 
                    required
                    type="date" 
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium min-h-[100px]" 
                  placeholder="Details about content, hashtags, or specific requirements..."
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-95">
                  {selectedDeliverable ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Submit Deliverable</h2>
              <button onClick={() => setIsSubmitModalOpen(false)} className="text-gray-400 hover:text-gray-900"><X size={20} /></button>
            </div>
             <form onSubmit={handleSubmitDeliverable} className="p-6 space-y-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-2">
                   <p className="text-sm font-bold text-blue-800 mb-1">{selectedDeliverable?.title}</p>
                   <p className="text-xs text-blue-600 font-medium opacity-80">Platform: <span className="capitalize">{selectedDeliverable?.platform}</span></p>
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Content Link / Portfolio Link</label>
                   <input 
                    required
                    type="url" 
                    value={submissionLink}
                    onChange={(e) => setSubmissionLink(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium text-sm" 
                    placeholder="https://..."
                  />
                  <p className="text-[10px] text-gray-400 mt-1.5 ml-1">Provide the direct link to the published content or a drive folder.</p>
                </div>
                <div className="pt-2 flex gap-3">
                  <button type="button" onClick={() => setIsSubmitModalOpen(false)} className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-500/20 active:scale-95">
                    Submit Content
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliverablesPage;
