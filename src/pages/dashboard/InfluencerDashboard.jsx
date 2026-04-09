import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Star, ChevronRight, AlertCircle,
  Inbox, Award, ClipboardList, CheckCircle2,
  Clock, Briefcase, Send, Download
} from 'lucide-react';
import api from '../../services/api';
import collaborationService from '../../services/collaborationService';
import './InfluencerDashboard.css';

function InfluencerDashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Data State
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); 

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/influencers/dashboard');
      if (response.data?.success) {
        setDashboardData(response.data.data);
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        setError("Your influencer profile was not found. Please complete your profile in settings.");
      } else {
        console.error("Dashboard fetch error:", err);
        setError("An error occurred while loading the dashboard.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ── Accept / Decline handlers ──────────────────────────────
  const handleAccept = async (requestId) => {
    try {
      setActionLoading(requestId);
      const response = await collaborationService.acceptRequest(requestId);
      if (response.success) {
        // Refresh entire dashboard to get the new collaboration record and updated stats
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to accept request:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      setActionLoading(requestId);
      const response = await collaborationService.rejectRequest(requestId);
      if (response.success) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to reject request:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // ── Helpers ────────────────────────────────────────────────
  const firstName = user?.fullname?.split(' ')[0] || user?.name?.split(' ')[0] || 'Influencer';

  const formatBudget = (budget) => {
    if (!budget) return '—';
    if (typeof budget === 'string') return budget.startsWith('$') ? budget : `$${budget}`;
    return `$${Number(budget).toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'inf-dash__status--active';
      case 'in_progress': return 'inf-dash__status--progress';
      case 'review': return 'inf-dash__status--review';
      case 'completed': return 'inf-dash__status--completed';
      case 'cancelled': 
      case 'rejected': return 'inf-dash__status--cancelled';
      case 'accepted': return 'inf-dash__status--completed';
      case 'pending': return 'inf-dash__status--review';
      default: return '';
    }
  };

  // ── Loading Skeleton ──────────────────────────────────────
  if (isLoading) {
    return (
      <div className="inf-dash">
        <div className="inf-dash__welcome">
          <h1>Welcome back! <span className="wave">👋</span></h1>
          <p>Loading your dashboard...</p>
        </div>
        <div className="inf-dash__stats">
          {[1, 2, 3].map((i) => (
            <div key={i} className="inf-dash__skeleton inf-dash__skel-stat" />
          ))}
        </div>
        <div className="inf-dash__grid">
          <div className="inf-dash__skeleton inf-dash__skel-section" />
          <div className="inf-dash__skeleton inf-dash__skel-section" />
        </div>
        <div className="inf-dash__perf-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="inf-dash__skeleton inf-dash__skel-perf" />
          ))}
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const performance = dashboardData?.performance || {};
  const allRequests = dashboardData?.allRequests || [];
  const collaborations = dashboardData?.collaborations || [];

  return (
    <div className="inf-dash">
      {/* ── Welcome Header ──────────────────────────────────── */}
      <div className="inf-dash__welcome">
        <h1>
          Welcome back, {firstName}! <span className="wave">👋</span>
        </h1>
        <p>Here's a quick overview of your collaborations.</p>
      </div>

      {/* ── Error Banner ────────────────────────────────────── */}
      {error && (
        <div className="inf-dash__error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* ── Stats Cards ─────────────────────────────────────── */}
      <div className="inf-dash__stats">
        {/* Collaborations */}
        <div className="inf-dash__stat-card">
          <div className="inf-dash__stat-icon inf-dash__stat-icon--campaigns">
            <Award size={22} />
          </div>
          <span className="inf-dash__stat-label">Collaborations</span>
          <span className="inf-dash__stat-value">{collaborations.length || 0}</span>
        </div>

        {/* Requests Hub */}
        <div className="inf-dash__stat-card">
          <div className="inf-dash__stat-icon inf-dash__stat-icon--pending">
            <ClipboardList size={22} />
          </div>
          <span className="inf-dash__stat-label">Requests</span>
          <span className="inf-dash__stat-value">{stats.totalRequests || 0}</span>
        </div>

        {/* Completed */}
        <div className="inf-dash__stat-card">
          <div className="inf-dash__stat-icon inf-dash__stat-icon--completed">
            <CheckCircle2 size={22} />
          </div>
          <span className="inf-dash__stat-label">Completed</span>
          <span className="inf-dash__stat-value">{stats.completedCollaborations || 0}</span>
        </div>
      </div>

      {/* ── Two-Column: Collaborations + Requests Hub ── */}
      <div className="inf-dash__grid">
        {/* Left: Collaborations */}
        <div className="inf-dash__section">
          <div className="inf-dash__section-header">
            <h3 className="inf-dash__section-title">Collaborations</h3>
            <button
              className="inf-dash__view-all"
              onClick={() => navigate('/influencer/collaborations')}
            >
              View All <ChevronRight size={14} />
            </button>
          </div>

          {collaborations.length > 0 ? (
            <div className="inf-dash__list">
              {collaborations.map((collab) => {
                const brandName = collab.brand?.fullname || 'Brand';
                const avatar = collab.brand?.profilePic
                  || `https://ui-avatars.com/api/?name=${encodeURIComponent(brandName)}&background=random&bold=true`;
                const progress = collab.progress || 0;
                
                return (
                  <div 
                    key={collab._id} 
                    className="inf-dash__card inf-dash__collab-card"
                    onClick={() => navigate(`/influencer/collaborations`)} 
                  >
                    <div className="inf-dash__card-top">
                      <div className="inf-dash__card-brand">
                        <img src={avatar} alt={brandName} className="inf-dash__card-avatar" />
                        <div className="inf-dash__card-info">
                          <h4>{collab.title || collab.campaign?.name || 'Untitled'}</h4>
                          <p>{brandName}</p>
                        </div>
                      </div>
                      <span className={`inf-dash__badge ${getStatusColor(collab.status)}`}>
                        {collab.status?.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="inf-dash__card-progress">
                      <div className="inf-dash__progress-header">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="inf-dash__progress-track">
                        <div 
                          className="inf-dash__progress-thumb" 
                          style={{ width: `${progress}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="inf-dash__empty">
              <div className="inf-dash__empty-icon">
                <Briefcase size={20} />
              </div>
              <p>No collaborations yet</p>
            </div>
          )}
        </div>

        {/* Right: Requests hub */}
        <div className="inf-dash__section">
          <div className="inf-dash__section-header">
            <h3 className="inf-dash__section-title">Requests</h3>
            <button
              className="inf-dash__view-all"
              onClick={() => navigate('/influencer/requests')}
            >
              View All <ChevronRight size={14} />
            </button>
          </div>

          {allRequests.length > 0 ? (
            <div className="inf-dash__list">
              {allRequests.map((request) => {
                const brandName = request.brandDetails?.fullname || 'Brand';
                const avatar = request.brandDetails?.profilePic
                  || `https://ui-avatars.com/api/?name=${encodeURIComponent(brandName)}&background=random&bold=true`;
                const campaignName = request.campaign?.name || 'Collaboration';
                const isActioning = actionLoading === request._id;
                const showButtons = request.type === 'received' && request.status === 'pending';

                return (
                  <div 
                    key={request._id} 
                    className="inf-dash__card inf-dash__req-card"
                    onClick={() => navigate('/influencer/requests')}
                  >
                    <div className="inf-dash__card-top">
                      <div className="inf-dash__card-brand">
                        <img src={avatar} alt={brandName} className="inf-dash__card-avatar" />
                        <div className="inf-dash__card-info">
                          <h4 className="inf-dash__card-title-flex">
                            {campaignName}
                            <span className={`inf-dash__type-badge inf-dash__type-badge--${request.type}`}>
                              {request.type === 'sent' ? <Send size={10} /> : <Download size={10} />}
                              {request.type}
                            </span>
                          </h4>
                          <p>{brandName}</p>
                        </div>
                      </div>
                      <span className={`inf-dash__badge ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>

                    <div className="inf-dash__card-footer">
                       <span className="inf-dash__card-budget">{formatBudget(request.proposedBudget)}</span>
                       
                       {showButtons && (
                        <div className="inf-dash__card-actions" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="inf-dash__btn inf-dash__btn--accept"
                            onClick={() => handleAccept(request._id)}
                            disabled={isActioning}
                          >
                            {isActioning ? '...' : 'Accept'}
                          </button>
                          <button
                            className="inf-dash__btn inf-dash__btn--decline"
                            onClick={() => handleDecline(request._id)}
                            disabled={isActioning}
                          >
                            Decline
                          </button>
                        </div>
                       )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="inf-dash__empty">
              <div className="inf-dash__empty-icon">
                <Inbox size={20} />
              </div>
              <p>No requests right now</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Performance Overview ──────────────── */}
      <div className="inf-dash__performance">
        <h3 className="inf-dash__performance-title">Performance Overview</h3>
        <div className="inf-dash__perf-grid">
          {/* Average Rating */}
          <div className="inf-dash__perf-card inf-dash__perf-card--rating">
            <div className="inf-dash__perf-value">
              <Star size={20} fill="currentColor" />
              {performance.averageRating || '0.0'}
            </div>
            <div className="inf-dash__perf-label">Average Rating</div>
          </div>

          {/* Completion Rate */}
          <div className="inf-dash__perf-card inf-dash__perf-card--completion">
            <div className="inf-dash__perf-value">{performance.completionRate || '0%'}</div>
            <div className="inf-dash__perf-label">Completion Rate</div>
          </div>

          {/* Avg. Response Time */}
          <div className="inf-dash__perf-card inf-dash__perf-card--response">
            <div className="inf-dash__perf-value">
              <Clock size={18} />
              {performance.averageResponseTime || 'N/A'}
            </div>
            <div className="inf-dash__perf-label">Avg. Response Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfluencerDashboard;
