import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Instagram, 
  Youtube, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Save,
  Rocket,
  Users,
  Calendar,
  Image as ImageIcon,
  Upload
} from 'lucide-react';

import { Input, Select, Textarea } from '../../components/common/FormComponents';
import { Button } from '../../components/common/Button';
import campaignService from '../../services/campaignService';
import { setLoading, setError, addCampaign } from '../../redux/slices/campaignSlice';

const CreateCampaign = ({ onCancel, onSuccess, campaign }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.campaign);

  const isEdit = !!campaign;

  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    industry: campaign?.industry || 'Technology',
    minBudget: campaign?.budget?.min || '',
    maxBudget: campaign?.budget?.max || '',
    description: campaign?.description || '',
    startDate: campaign?.campaignTimeline?.startDate ? new Date(campaign.campaignTimeline.startDate).toISOString().split('T')[0] : '',
    endDate: campaign?.campaignTimeline?.endDate ? new Date(campaign.campaignTimeline.endDate).toISOString().split('T')[0] : '',
    platforms: campaign?.platform || [],
    goals: campaign?.goals || [],
    deliverables: campaign?.deliverables || '',
    targetAudience: campaign?.targetAudience || '',
    additionalRequirements: campaign?.additionalRequirements || '',
    status: campaign?.status || 'pending'
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(campaign?.image || null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const requiredFields = ['name', 'industry', 'minBudget', 'maxBudget', 'description', 'startDate', 'endDate'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        dispatch(setError(`Please fill in all required fields: ${field} is missing`));
        return false;
      }
    }
    if (Number(formData.minBudget) > Number(formData.maxBudget)) {
      dispatch(setError('Minimum budget cannot be greater than maximum budget'));
      return false;
    }
    if (formData.platforms.length === 0) {
      dispatch(setError('Please select at least one platform'));
      return false;
    }
    return true;
  };

  const industries = [
    { value: 'Technology', label: 'Technology' },
    { value: 'Fashion', label: 'Fashion' },
    { value: 'Health', label: 'Health' },
    { value: 'Food', label: 'Food' },
    { value: 'Travel', label: 'Travel' },
    { value: 'Education', label: 'Education' }
  ];

  const platformList = [
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#E4405F' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: '#FF0000' },
    { id: 'tiktok', label: 'TikTok', icon: (props) => (
      <svg {...props} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.21 1.8-.07.42-.05.85.01 1.27.14.77.67 1.43 1.3 1.89.65.48 1.48.67 2.27.59.86-.05 1.66-.46 2.18-1.15.46-.77.56-1.7.55-2.58-.02-3.96-.01-7.91-.01-11.87z"/>
      </svg>
    ), color: '#000000' },
    { id: 'twitter', label: 'Twitter/X', icon: Twitter, color: '#1DA1F2' },
    { id: 'facebook', label: 'Facebook', icon: Facebook, color: '#1877F2' },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0077B5' }
  ];
  
  const goalList = [
    { id: 'awareness', label: 'Awareness' },
    { id: 'sales', label: 'Sales & Conversion' },
    { id: 'traffic', label: 'Web Traffic' },
    { id: 'creation', label: 'Content Creation' }
  ];



  const togglePlatform = (platformId) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  const toggleGoal = (goalId) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const handleSaveDraft = (e) => {
    if (e) e.preventDefault();
    if (!formData.name) {
      dispatch(setError('Please enter at least a campaign title to save as draft'));
      return;
    }
    handleSubmit(e, true);
  };

  const handleSubmit = async (e, asDraft = false) => {
    if (e) e.preventDefault();
    if (!asDraft && !validateForm()) return;

    try {
      dispatch(setLoading(true));
      
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('industry', formData.industry);
      submitData.append('description', formData.description);
      submitData.append('deliverables', formData.deliverables);
      submitData.append('targetAudience', formData.targetAudience);
      submitData.append('additionalRequirements', formData.additionalRequirements);
      
      // Nested objects
      submitData.append('budget[min]', Number(formData.minBudget));
      submitData.append('budget[max]', Number(formData.maxBudget));
      
      submitData.append('campaignTimeline[startDate]', formData.startDate);
      submitData.append('campaignTimeline[endDate]', formData.endDate);
      
      formData.platforms.forEach(p => submitData.append('platform[]', p));
      formData.goals.forEach(g => submitData.append('goals[]', g));

      if (asDraft) {
        submitData.append('status', 'draft');
      } else if (campaign?.status === 'draft') {
        // If it was a draft and we are submitting (Publishing), let it calculate status
        // or explicitly set to pending
        submitData.append('status', 'pending');
      }

      if (imageFile) {
        submitData.append('image', imageFile);
      }

      if (isEdit) {
        await campaignService.updateCampaign(campaign._id, submitData);
      } else {
        const data = await campaignService.createCampaign(submitData);
        dispatch(addCampaign(data));
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/brand/campaigns');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to create campaign';
      dispatch(setError(msg));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-full py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">
              {isEdit 
                ? (campaign.status === 'draft' ? 'Publish Campaign' : 'Update Campaign') 
                : 'Create New Campaign'}
            </h1>
            <p className="text-gray-500 font-medium">Define your campaign requirements and find the perfect influencer</p>
          </div>
          <Button variant="outline" className="text-gray-500 flex items-center space-x-2 border-gray-200 hover:bg-gray-50 bg-white" onClick={onCancel}>
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Visuals */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 font-display">Campaign Banner</h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-48 h-32 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 group relative">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-sm font-bold text-gray-700 mb-1">Campaign Cover Image</h3>
                <p className="text-xs text-gray-400 mb-4 text-balance">This image will be shown on your campaign card and to influencers.</p>
                <button 
                  type="button"
                  onClick={() => document.getElementById('campaign-image-input')?.click()}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors inline-flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {imageFile ? 'Change Image' : 'Select Image'}
                </button>
                <input
                  id="campaign-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </section>

          {/* Campaign Information */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 font-display">Campaign Details</h2>
            <div className="grid grid-cols-1 gap-6">
              <Input
                label="Campaign Title"
                name="name"
                placeholder="e.g., Summer Product Launch 2024"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Category"
                  name="industry"
                  options={industries}
                  value={formData.industry}
                  onChange={handleInputChange}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Min Budget ($)"
                    name="minBudget"
                    type="number"
                    placeholder="1000"
                    value={formData.minBudget}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Max Budget ($)"
                    name="maxBudget"
                    type="number"
                    placeholder="2500"
                    value={formData.maxBudget}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <Textarea
                label="Campaign Description"
                name="description"
                placeholder="Describe your campaign goals, brand message, and what you're looking for..."
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
          </section>

          {/* Target Platforms */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Target Platforms</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {platformList.map((platform) => (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => togglePlatform(platform.id)}
                  className={`flex items-center space-x-3 p-4 border rounded-xl transition-all ${
                    formData.platforms.includes(platform.id)
                      ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                      : 'border-gray-100 hover:border-blue-200 bg-white'
                  }`}
                >
                  <platform.icon 
                    className="w-5 h-5 flex-shrink-0" 
                    style={{ color: formData.platforms.includes(platform.id) ? platform.color : '#94a3b8' }} 
                  />
                  <span className={`text-sm font-semibold ${
                    formData.platforms.includes(platform.id) ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {platform.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Campaign Goals */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-2 font-display">Campaign Goals</h2>
            <p className="text-xs text-gray-500 mb-6 italic">Select the primary objectives of this campaign for better AI matching</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {goalList.map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => toggleGoal(goal.id)}
                  className={`flex items-center justify-center p-4 border rounded-xl transition-all ${
                    formData.goals.includes(goal.id)
                      ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500'
                      : 'border-gray-100 hover:border-emerald-200 bg-white'
                  }`}
                >
                  <span className={`text-xs font-bold uppercase tracking-tight ${
                    formData.goals.includes(goal.id) ? 'text-emerald-700' : 'text-gray-500'
                  }`}>
                    {goal.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Campaign Requirements */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Campaign Requirements</h2>
            <div className="space-y-6">
              <Textarea
                label="Deliverables"
                name="deliverables"
                placeholder="e.g., 2 Instagram posts, 1 YouTube video, 10 Stories..."
                value={formData.deliverables}
                onChange={handleInputChange}
              />
              <Textarea
                label="Target Audience"
                name="targetAudience"
                placeholder="Describe your ideal audience demographics, interests, and characteristics..."
                value={formData.targetAudience}
                onChange={handleInputChange}
              />
              <Textarea
                label="Additional Requirements"
                name="additionalRequirements"
                placeholder="Any specific requirements, brand guidelines, or preferences..."
                value={formData.additionalRequirements}
                onChange={handleInputChange}
              />
            </div>
          </section>

          {/* Campaign Summary */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Campaign Summary</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-gray-50/50 flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg"><Rocket className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Category</p>
                  <p className="text-xs font-bold text-gray-900">{formData.industry}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50/50 flex items-center space-x-3">
                <div className="bg-emerald-100 p-2 rounded-lg"><Save className="w-5 h-5 text-emerald-600" /></div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Budget Range</p>
                  <p className="text-xs font-bold text-gray-900">
                    {formData.minBudget && formData.maxBudget 
                      ? `$${formData.minBudget} - $${formData.maxBudget}` 
                      : 'Not set'}
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50/50 flex items-center space-x-3">
                <div className="bg-amber-100 p-2 rounded-lg"><Calendar className="w-5 h-5 text-amber-600" /></div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Start Date</p>
                  <p className="text-xs font-bold text-gray-900">{formData.startDate || 'Not set'}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50/50 flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg"><Users className="w-5 h-5 text-purple-600" /></div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Platforms</p>
                  <p className="text-xs font-bold text-gray-900">{formData.platforms.length} selected</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-8 space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                className="px-10 border-blue-200 font-bold"
                onClick={handleSaveDraft}
                disabled={loading}
              >
                Save as Draft
              </Button>
              <Button type="submit" isLoading={loading} className="px-10 font-bold">
                {isEdit 
                  ? (campaign.status === 'draft' ? 'Publish Campaign' : 'Update Campaign') 
                  : 'Create Campaign'}
              </Button>
            </div>
          </section>
        </form>
    </div>
  );
};

export default CreateCampaign;
