import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Instagram, Youtube, Twitter, Linkedin, Globe,
  MapPin, Calendar, ShieldCheck, Users, ExternalLink,
  MessageSquare, Send, AlertCircle, Image as ImageIcon
} from 'lucide-react';
import api from '../../services/api';
import SendCollabModal from '../../components/layout/influencer/SendCollabModal';

// ── Helpers ────────────────────────────────────────────────────────────────────

const formatFollowers = (n) => {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
};

const formatJoinDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const PlatformIcon = ({ name, className = 'w-4 h-4' }) => {
  const n = name?.toLowerCase() || '';
  if (n.includes('instagram')) return <Instagram className={className} />;
  if (n.includes('youtube'))   return <Youtube   className={className} />;
  if (n.includes('twitter'))   return <Twitter   className={className} />;
  if (n.includes('linkedin'))  return <Linkedin  className={className} />;
  return <Users className={className} />;
};

// ── Skeleton ───────────────────────────────────────────────────────────────────

const ProfileSkeleton = () => (
  <div className="max-w-[1100px] mx-auto w-full pb-10 animate-pulse">
    {/* Banner */}
    <div className="h-52 bg-gray-200 rounded-2xl mb-0" />

    <div className="flex gap-6 mt-[-40px] px-6">
      {/* Avatar placeholder */}
      <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white shrink-0" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-5 px-6">
      {/* Left card */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-3 bg-gray-100 rounded w-full" />
          ))}
        </div>
      </div>

      {/* Right area */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="h-4 bg-gray-200 rounded w-40 mb-3" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-5/6" />
            <div className="h-3 bg-gray-100 rounded w-4/6" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="h-4 bg-gray-200 rounded w-32 mb-4" />
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────

const InfluencerProfile = () => {
  const { influencerId } = useParams();
  const navigate = useNavigate();

  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/brands/influencers/${influencerId}`);
        if (res.data?.success) {
          setData(res.data.data);
        } else {
          setError('Failed to load influencer profile.');
        }
      } catch (err) {
        console.error('Error loading influencer profile:', err);
        setError(err.response?.data?.message || 'Failed to load influencer profile.');
      } finally {
        setLoading(false);
      }
    };
    if (influencerId) load();
  }, [influencerId]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-[1100px] mx-auto w-full pb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <ProfileSkeleton />
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="max-w-[1100px] mx-auto w-full pb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex items-start gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const { influencer, totalFollowers } = data || {};
  const user = influencer?.user || {};

  // Derive display values
  const username      = influencer?.username || user?.fullname || 'Influencer';
  const avatar        = influencer?.profilePicture || user?.profilePic
                        || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&size=200`;
  const about         = influencer?.about || '';
  const category      = influencer?.category || '';
  const location      = influencer?.location || '';
  const joinedDate    = formatJoinDate(user?.createdAt || influencer?.createdAt);
  const platforms     = influencer?.platforms || [];
  const mainPlatform  = platforms[0] || null;
  const portfolio     = influencer?.portfolio || '';

  // Banner display — use coverImage (influencer model), else coverPic (user model), 
  // else portfolio (if image), else gradient
  const isImageUrl = (url) => /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?.*)?$/i.test(url);
  const bannerImage = influencer?.coverImage 
                    || user?.coverPic 
                    || (portfolio && isImageUrl(portfolio) ? portfolio : null);
  
  const bannerStyle = bannerImage
    ? { backgroundImage: `url(${bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: 'linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 40%, #ddd6fe 100%)' };

  // Placeholder post tiles
  const placeholderPosts = [
    { id: 1, label: 'Post 1' },
    { id: 2, label: 'Post 2' },
    { id: 3, label: 'Post 3' },
    { id: 4, label: 'Post 4' },
  ];

  return (
    <div className="max-w-[1100px] mx-auto w-full pb-10">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* ── BANNER ──────────────────────────────────────────────────────────── */}
      <div
        className="relative h-52 rounded-2xl overflow-hidden"
        style={bannerStyle}
      >
        {/* Action buttons — top-right of banner */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            title="Message (coming soon)"
            className="flex items-center gap-2 bg-white/90 hover:bg-white text-gray-700 border border-gray-200 text-[13px] font-semibold px-4 py-2 rounded-lg shadow-sm transition-all backdrop-blur-sm"
          >
            <MessageSquare className="w-4 h-4" />
            Message
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white text-[13px] font-semibold px-4 py-2 rounded-lg shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
            Send Collab Request
          </button>
        </div>
      </div>

      {/* ── AVATAR (overlapping banner) ──────────────────────────────────────── */}
      <div className="px-6 mt-[-40px] mb-4 flex items-end gap-4">
        <div className="relative shrink-0">
          <img
            src={avatar}
            alt={username}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
          />
          {/* Verified badge */}
          <span className="absolute bottom-1 right-1 flex items-center bg-white rounded-full px-1.5 py-0.5 shadow text-[9px] font-bold text-green-700 border border-green-100 gap-0.5">
            <ShieldCheck className="w-3 h-3 text-green-600" />
            Verified
          </span>
        </div>
      </div>

      {/* ── TWO-COLUMN BODY ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-0">

        {/* ── LEFT SIDEBAR ─────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Info card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

            {/* Username */}
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-gray-400 shrink-0" />
              <h2 className="text-[15px] font-bold text-gray-900">{username}</h2>
            </div>

            <div className="space-y-3 text-[13px] text-gray-600">
              {/* Platform */}
              {mainPlatform && (
                <div className="flex items-center gap-2.5">
                  <PlatformIcon name={mainPlatform.name} className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <span className="text-gray-400 text-[11px] font-medium uppercase tracking-wide mr-1.5">Platform</span>
                    <span className="capitalize font-medium text-gray-800">{mainPlatform.name}</span>
                    {mainPlatform.followers > 0 && (
                      <span className="ml-1.5 text-gray-400">· {formatFollowers(mainPlatform.followers)} followers</span>
                    )}
                  </div>
                </div>
              )}

              {/* Niche / Category */}
              {category && (
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 flex items-center justify-center shrink-0">
                    <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-[11px] font-medium uppercase tracking-wide mr-1.5">Niche</span>
                    <span className="capitalize font-medium text-gray-800">{category}</span>
                  </div>
                </div>
              )}

              {/* Location */}
              {location && (
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <span className="text-gray-400 text-[11px] font-medium uppercase tracking-wide mr-1.5">Location</span>
                    <span className="font-medium text-gray-800">{location}</span>
                  </div>
                </div>
              )}

              {/* Joined date */}
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <span className="text-gray-400 text-[11px] font-medium uppercase tracking-wide mr-1.5">Joined</span>
                  <span className="font-medium text-gray-800">{joinedDate}</span>
                </div>
              </div>
            </div>

            {/* External Links */}
            {(portfolio || platforms.some(p => p.profileUrl)) && (
              <div className="mt-5 pt-4 border-t border-gray-50">
                <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide mb-3">External Links</p>
                <div className="flex flex-wrap gap-2">
                  {/* Platform profile links */}
                  {platforms.map((p, i) => p.profileUrl ? (
                    <a
                      key={i}
                      href={p.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[12px] text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg px-2.5 py-1 transition-all"
                    >
                      <PlatformIcon name={p.name} className="w-3.5 h-3.5" />
                      <span className="capitalize">{p.name} Profile</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  ) : null)}

                  {/* Portfolio / Media Kit */}
                  {portfolio && !isImageUrl(portfolio) && (
                    <a
                      href={portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[12px] text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg px-2.5 py-1 transition-all"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Media Kit
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* All Platforms card (if multiple) */}
          {platforms.length > 1 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide mb-3">All Platforms</p>
              <div className="space-y-3">
                {platforms.map((p, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[13px] text-gray-700">
                      <PlatformIcon name={p.name} className="w-4 h-4 text-gray-400" />
                      <span className="capitalize font-medium">{p.name}</span>
                    </div>
                    <span className="text-[12px] font-semibold text-gray-500">
                      {formatFollowers(p.followers)} followers
                    </span>
                  </div>
                ))}
              </div>

              {/* Total followers */}
              {totalFollowers > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-[13px]">
                  <span className="text-gray-500 font-medium">Total Reach</span>
                  <span className="font-bold text-gray-900">{formatFollowers(totalFollowers)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT CONTENT ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">

          {/* About card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-gray-400" />
              <h3 className="text-[15px] font-bold text-gray-900">About {username}</h3>
            </div>
            {about ? (
              <p className="text-[13.5px] text-gray-600 leading-relaxed">{about}</p>
            ) : (
              <p className="text-[13px] text-gray-400 italic">No bio provided yet.</p>
            )}
          </div>

          {/* Services card — show if any platform has services */}
          {platforms.some(p => p.services && p.services.length > 0) && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-[14px] font-bold text-gray-900 mb-4">Services & Pricing</h3>
              <div className="space-y-4">
                {platforms.filter(p => p.services && p.services.length > 0).map((platform, pi) => (
                  <div key={pi}>
                    <div className="flex items-center gap-2 mb-2">
                      <PlatformIcon name={platform.name} className="w-4 h-4 text-gray-500" />
                      <span className="text-[13px] font-semibold text-gray-700 capitalize">{platform.name}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {platform.services.map((svc, si) => (
                        <div
                          key={si}
                          className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 border border-gray-100"
                        >
                          <span className="text-[13px] text-gray-700 font-medium">{svc.contentType}</span>
                          <span className="text-[13px] font-bold text-[#1A73E8]">${svc.price?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Content card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-bold text-gray-900">Recent Content</h3>
              <button
                title="Coming soon"
                className="text-[13px] font-semibold text-[#1A73E8] hover:text-[#1557B0] transition-colors"
              >
                View all posts
              </button>
            </div>

            {/* Placeholder tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {placeholderPosts.map((post) => (
                <div
                  key={post.id}
                  className="aspect-square rounded-xl bg-gray-100 border border-gray-100 flex flex-col items-center justify-center text-gray-300 hover:bg-gray-150 transition-colors cursor-pointer overflow-hidden"
                >
                  <ImageIcon className="w-8 h-8 mb-1.5 text-gray-300" />
                  <span className="text-[11px] font-medium text-gray-300">{post.label}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-gray-400 mt-3 text-center">
              Recent posts will appear here once the influencer connects their content feed.
            </p>
          </div>

        </div>
      </div>

      {showModal && (
        <SendCollabModal 
          targetType="influencer"
          targetUser={{ _id: user?._id || data?.influencer?.user?._id || influencerId, name: username }}
          onClose={() => setShowModal(false)}
          onSuccess={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default InfluencerProfile;
