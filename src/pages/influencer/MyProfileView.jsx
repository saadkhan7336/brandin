import { useDispatch } from "react-redux";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Globe,
  MapPin,
  Briefcase,
  CheckCircle,
  Users,
  TrendingUp,
  Edit3,
  Save,
  Camera,
  FileText,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Star,
  ExternalLink,
} from "lucide-react";
import api from "../../services/api";
import profileService from "../../services/profileService";
import { setProfileData } from "../../redux/slices/Profileslice";
import {
  updateUserFields,
  updateProfileComplete,
} from "../../redux/slices/authSlice";
import { cn } from "../../utils/helper";

// Platform Icon Helper
const SocialIcon = ({ name, size = 16, className }) => {
  const map = {
    instagram: Instagram,
    tiktok: ({ size, className }) => (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
    twitter: Twitter,
    linkedin: Linkedin,
    youtube: Youtube,
  };
  const Icon = map[name?.toLowerCase()] || Globe;
  return <Icon size={size} className={className} />;
};

const INDUSTRIES = [
  "Fashion",
  "Technology",
  "Food & Beverage",
  "Beauty",
  "Lifestyle",
  "Fitness",
  "Travel",
  "Gaming",
  "Entertainment",
  "Finance",
  "Healthcare",
  "Art & Design",
  "Sports",
  "Other",
];

// ── Shared Input Components ──
const InlineInput = ({
  value,
  onChange,
  placeholder,
  type = "text",
  label,
}) => (
  <div className="space-y-1.5 w-full">
    {label && (
      <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 ml-1">
        {label}
      </p>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-50 border-0 border-b-2 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 text-sm font-bold transition-all py-2.5 px-3"
    />
  </div>
);

const InlineTextarea = ({ value, onChange, placeholder, label }) => (
  <div className="space-y-2">
    {label && (
      <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 ml-1">
        {label}
      </p>
    )}
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
      className="w-full bg-slate-50 border-0 border-b-2 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 text-sm font-medium transition-all py-3 px-4 resize-none"
    />
  </div>
);

const SectionHeader = ({ title, icon: Icon, color = "blue" }) => (
  <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tight">
    <div
      className={cn(
        "w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200",
        `bg-${color}-600`,
      )}
    >
      <Icon size={16} />
    </div>
    {title}
  </h3>
);

export default function MyProfileView() {
  const dispatch = useDispatch();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [editedUser, setEditedUser] = useState({});

  const [files, setFiles] = useState({
    profilePic: null,
    coverPic: null,
    resume: null,
  });
  const [previews, setPreviews] = useState({
    profilePic: null,
    coverPic: null,
  });
  const fileRefs = {
    profilePic: useRef(),
    coverPic: useRef(),
    resume: useRef(),
  };

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/influencers/profile");
      const profileData = res.data.data;
      setData(profileData);

      setEditedProfile({
        username: profileData.username || "",
        category: profileData.category || "",
        about: profileData.about || "",
        location: profileData.location || "",
        portfolio: profileData.portfolio || "",
        resume: profileData.resume || "",
        instagram: profileData.socialMedia?.instagram || "",
        tiktok: profileData.socialMedia?.tiktok || "",
        twitter: profileData.socialMedia?.twitter || "",
        linkedin: profileData.socialMedia?.linkedin || "",
        youtube: profileData.socialMedia?.youtube || "",
      });
      setEditedUser({
        fullname: profileData.user?.fullname || "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFileChange = (type, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFiles((prev) => ({ ...prev, [type]: file }));
    if (type !== "resume") {
      setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // User info update
      const userFd = new FormData();
      userFd.append("fullname", editedUser.fullname);
      if (files.profilePic) userFd.append("profilePic", files.profilePic);
      const userRes = await profileService.updateUserInfo(userFd);

      // Influencer info update
      const infFd = new FormData();
      infFd.append("username", editedProfile.username);
      infFd.append("category", editedProfile.category);
      infFd.append("about", editedProfile.about);
      infFd.append("location", editedProfile.location);
      infFd.append("portfolio", editedProfile.portfolio);

      // Social Media
      infFd.append("socialMedia[instagram]", editedProfile.instagram);
      infFd.append("socialMedia[tiktok]", editedProfile.tiktok);
      infFd.append("socialMedia[twitter]", editedProfile.twitter);
      infFd.append("socialMedia[linkedin]", editedProfile.linkedin);
      infFd.append("socialMedia[youtube]", editedProfile.youtube);

      if (files.coverPic) infFd.append("coverImage", files.coverPic);
      if (files.profilePic) infFd.append("profilePicture", files.profilePic);
      if (files.resume) infFd.append("resume", files.resume);

      const infRes = await profileService.updateInfluencerProfile(infFd);

      dispatch(updateUserFields(userRes.user));
      dispatch(updateProfileComplete(infRes.completion?.isComplete));
      dispatch(
        setProfileData({
          roleProfile: infRes.influencer,
          completion: infRes.completion,
        }),
      );

      await fetchProfile();
      setIsEditing(false);
      setFiles({ profilePic: null, coverPic: null, resume: null });
      setPreviews({ profilePic: null, coverPic: null });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest animate-pulse">
          Synchronizing Data...
        </p>
      </div>
    );

  if (!data) return <div className="text-center py-20">Profile not found.</div>;

  const name = isEditing
    ? editedUser.fullname
    : data.user?.fullname || data.username || "Influencer";
  const avatar =
    previews.profilePic ||
    data.profilePicture ||
    data.user?.profilePic ||
    `https://ui-avatars.com/api/?name=${name}`;
  const cover =
    previews.coverPic ||
    data.coverImage ||
    data.user?.coverPic ||
    "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=2000";

  return (
    <div className="w-full max-w-[1800px] mx-auto space-y-10 pb-24 animate-in fade-in duration-700">
      {/* ── HEADER ACTIONS ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Influencer Public Profile
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            This is how <span className="text-blue-600 font-bold">Brands</span>{" "}
            and{" "}
            <span className="text-slate-900 font-bold">Talent Managers</span>{" "}
            see your portfolio.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl flex items-center gap-2.5 active:scale-95 transition-all"
              >
                {saving ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 border-none flex items-center gap-2.5"
            >
              <Edit3 size={14} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* ── HERO BANNER ── */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden group/card relative">
        <div className="h-80 bg-slate-100 relative group/cover cursor-default">
          <img
            src={cover}
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover transition-transform group-hover/card:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
          {isEditing && (
            <button
              onClick={() => fileRefs.coverPic.current.click()}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover/cover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-black uppercase tracking-widest"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-1">
                <Camera size={18} />
              </div>
              Change Cover
            </button>
          )}
          <input
            ref={fileRefs.coverPic}
            type="file"
            className="hidden"
            onChange={(e) => handleFileChange("coverPic", e)}
          />
        </div>

        <div className="px-12 pb-12">
          <div className="flex flex-col md:flex-row items-end gap-12 -mt-16 relative z-10">
            <div className="relative group/logo">
              <img
                src={avatar}
                alt="Avatar"
                className="w-44 h-44 rounded-[2.5rem] object-cover border-[10px] border-white shadow-2xl bg-white"
              />
              {isEditing && (
                <button
                  onClick={() => fileRefs.profilePic.current.click()}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover/logo:opacity-100 rounded-[2.5rem] text-white flex flex-col items-center justify-center text-[10px] font-black uppercase tracking-widest"
                >
                  Change Avatar
                </button>
              )}
              <input
                ref={fileRefs.profilePic}
                type="file"
                className="hidden"
                onChange={(e) => handleFileChange("profilePic", e)}
              />
            </div>

            <div className="flex-1 pb-4 space-y-6">
              {isEditing ? (
                <div className="flex gap-4 w-full max-w-2xl">
                  <InlineInput
                    value={editedUser.fullname}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, fullname: e.target.value })
                    }
                    label="FULL NAME"
                  />
                  <InlineInput
                    value={editedProfile.username}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        username: e.target.value,
                      })
                    }
                    label="USERNAME"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">
                    {name}
                  </h2>
                  {data.user?.isVerified && (
                    <div className="bg-blue-600 p-1.5 rounded-full text-white shadow-lg shadow-blue-200">
                      <CheckCircle
                        size={14}
                        fill="currentColor"
                        stroke="white"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-10 pt-8">
                {/* Location */}
                <div className="flex items-center gap-3.5 group/info">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 transition-all group-hover/info:scale-110 shadow-sm border border-blue-100/50">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">
                      Location
                    </p>
                    <div className="text-sm font-black text-slate-800">
                      {isEditing ? (
                        <input
                          value={editedProfile.location}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              location: e.target.value,
                            })
                          }
                          className="bg-transparent border-b border-slate-200 p-0 w-24 text-sm font-bold focus:ring-0"
                          placeholder="City, Country"
                        />
                      ) : (
                        data.location || "Earth"
                      )}
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-center gap-3.5 group/info">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 transition-all group-hover/info:scale-110 shadow-sm border border-orange-100/50">
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">
                      Niche
                    </p>
                    <div className="text-sm font-black text-slate-800 text-left">
                      {isEditing ? (
                        <select
                          value={
                            INDUSTRIES.includes(editedProfile.category)
                              ? editedProfile.category
                              : editedProfile.category
                                ? "Other"
                                : ""
                          }
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              category: e.target.value,
                            })
                          }
                          className="bg-white border text-slate-700 border-slate-200 text-xs font-bold py-1.5 px-2 rounded-xl shadow-sm focus:ring-0"
                        >
                          <option value="" disabled>
                            Select Niche...
                          </option>
                          {INDUSTRIES.map((i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </select>
                      ) : (
                        data.category || "-"
                      )}
                    </div>
                  </div>
                </div>

                {/* Media Kit */}
                <div className="flex items-center gap-3.5 group/info">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 transition-all group-hover/info:scale-110 shadow-sm border border-emerald-100/50">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">
                      Media Kit
                    </p>
                    <div className="text-sm font-black text-slate-800 text-left">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => fileRefs.resume.current.click()}
                            className="text-blue-600 font-medium text-xs border border-blue-200 bg-blue-50 px-2 py-1 rounded-md"
                          >
                            {files.resume ? files.resume.name : "Upload PDF"}
                          </button>
                          <input
                            ref={fileRefs.resume}
                            type="file"
                            className="hidden"
                            accept=".pdf"
                            onChange={(e) => handleFileChange("resume", e)}
                          />
                        </div>
                      ) : data.resume ? (
                        <a
                          href={data.resume}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-gray-400 italic font-medium">
                          None
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">
        {/* LEFT COLUMN: STATS & SOCIALS */}
        <div className="lg:col-span-4 space-y-8 animate-in slide-in-from-left-4 duration-1000">
          {/* CORE METRICS */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-2xl shadow-slate-200/30 space-y-10 group">
            <h3 className="text-sm font-black text-slate-900 tracking-widest uppercase flex items-center gap-3">
              <TrendingUp size={16} className="text-blue-600" /> Influence Stats
            </h3>
            <div className="space-y-8">
              <div className="flex items-center gap-6 group/stat">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 bg-blue-50 group-hover/stat:scale-110 transition-all duration-500 shadow-sm">
                  <Users size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">
                    Total Reach
                  </p>
                  <p className="text-lg font-black text-slate-900 tracking-tight italic">
                    {(data.followersCount || 0).toLocaleString()}+
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 group/stat">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-orange-600 bg-orange-50 group-hover/stat:scale-110 transition-all duration-500 shadow-sm">
                  <Star size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">
                    Avg Rating
                  </p>
                  <p className="text-lg font-black text-slate-900 tracking-tight italic">
                    {data.averageRating || "0.0"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 group/stat">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600 bg-emerald-50 group-hover/stat:scale-110 transition-all duration-500 shadow-sm">
                  <CheckCircle size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">
                    Collaborations
                  </p>
                  <p className="text-lg font-black text-slate-900 tracking-tight italic">
                    {data.collaborationCount || "0"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SOCIAL HANDLINGS */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-2xl shadow-slate-200/30 space-y-8">
            <h3 className="text-sm font-black text-slate-900 tracking-widest uppercase flex items-center gap-3">
              <Globe size={16} className="text-emerald-600" /> Digital Ecosystem
            </h3>
            <div className="flex flex-col gap-4">
              {[
                {
                  id: "instagram",
                  label: "Instagram",
                  name: "INSTAGRAM",
                  color: "pink",
                },
                {
                  id: "tiktok",
                  label: "TikTok",
                  name: "TIKTOK",
                  color: "slate",
                },
                {
                  id: "twitter",
                  label: "Twitter",
                  name: "TWITTER",
                  color: "blue",
                },
                {
                  id: "youtube",
                  label: "YouTube",
                  name: "YOUTUBE",
                  color: "red",
                },
                {
                  id: "linkedin",
                  label: "LinkedIn",
                  name: "LINKEDIN",
                  color: "indigo",
                },
              ].map((social) => (
                <div
                  key={social.id}
                  className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all group/soc"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={cn(
                        `w-9 h-9 rounded-xl flex items-center justify-center bg-white shadow-sm transition-transform group-hover/soc:rotate-6`,
                        `text-${social.color}-600`,
                      )}
                    >
                      <SocialIcon name={social.id} size={16} />
                    </div>
                    <div className="text-left">
                      {isEditing ? (
                        <input
                          value={editedProfile[social.id]}
                          onChange={(e) =>
                            setEditedProfile((prev) => ({
                              ...prev,
                              [social.id]: e.target.value,
                            }))
                          }
                          className="bg-transparent border-0 border-b border-slate-200 p-0 focus:ring-0 text-xs font-bold w-24"
                          placeholder={`@username`}
                        />
                      ) : (
                        <>
                          <p className="text-[10px] font-black text-slate-400 tracking-widest leading-none mb-1.5 uppercase">
                            {social.name}
                          </p>
                          <p className="text-xs font-bold text-slate-600">
                            {data.socialMedia?.[social.id]
                              ? `@${data.socialMedia[social.id]}`
                              : "Not linked"}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  {!isEditing && data.socialMedia?.[social.id] && (
                    <button className="w-8 h-8 rounded-lg bg-slate-200/50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all border-none">
                      <ExternalLink size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTENT AREAS */}
        <div className="lg:col-span-8 space-y-8 animate-in slide-in-from-right-4 duration-1000">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/30 overflow-hidden flex flex-col h-full">
            <div className="border-b border-slate-50 px-10 flex gap-12 bg-slate-50/10">
              {["about", "collaborations", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "py-6 text-xs font-black uppercase tracking-[0.2em] border-b-[3px] transition-all relative outline-none",
                    activeTab === tab
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-600",
                  )}
                >
                  {tab === "about"
                    ? "Story"
                    : tab === "collaborations"
                      ? "Collaborations"
                      : "Reviews"}
                </button>
              ))}
            </div>

            <div className="p-12 flex-1">
              {activeTab === "about" && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                  <SectionHeader title="My Narrative" icon={Edit3} />
                  {isEditing ? (
                    <InlineTextarea
                      value={editedProfile.about}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          about: e.target.value,
                        })
                      }
                      placeholder="Biography, goals, style..."
                    />
                  ) : (
                    <p className="text-slate-600 leading-relaxed font-medium pl-6 border-l-4 border-slate-100 whitespace-pre-wrap text-left">
                      {data.about || "No story shared yet."}
                    </p>
                  )}
                </div>
              )}

              {activeTab === "collaborations" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between">
                    <SectionHeader
                      title="Active Collaborations"
                      icon={Briefcase}
                      color="blue"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                    {(data.activeCollaborations || []).map((collab, idx) => (
                      <div
                        key={idx}
                        className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] group hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className="space-y-1 text-left">
                            <p className="text-[10px] font-black text-blue-600 tracking-widest uppercase leading-none">
                              Live Campaign
                            </p>
                            <h4 className="text-xl font-black text-slate-900 tracking-tight italic uppercase leading-tight">
                              {collab.campaign?.name || "Untitled"}
                            </h4>
                            <p className="text-xs font-bold text-slate-400 italic">
                              With {collab.sender?.fullname || "Brand Partner"}
                            </p>
                          </div>
                          <span className="text-[8px] font-black uppercase tracking-widest bg-emerald-500 text-white px-3 py-1.5 rounded-xl shadow-lg shadow-emerald-200">
                            ACTIVE
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium line-clamp-3 text-left">
                          {collab.campaign?.description || "Ongoing collaboration details..."}
                        </p>
                      </div>
                    ))}
                    {(data.activeCollaborations || []).length === 0 && (
                      <div className="col-span-full py-20 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-black uppercase text-xs tracking-widest italic">
                          No active collaborations right now.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <SectionHeader
                    title="Brand Feedback"
                    icon={Star}
                    color="yellow"
                  />
                  <div className="space-y-6">
                    {(data.reviews || []).map((review, i) => (
                      <div
                        key={i}
                        className="p-8 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] flex flex-col md:flex-row gap-6 items-start group hover:bg-white hover:shadow-2xl transition-all duration-500"
                      >
                        <img
                          src={
                            review.reviewer?.profilePic ||
                            `https://ui-avatars.com/api/?name=${review.reviewer?.fullname}`
                          }
                          className="w-14 h-14 rounded-2xl object-cover border-4 border-white shadow-lg"
                          alt="Reviewer"
                        />
                        <div className="flex-1 text-left space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-black text-slate-900 uppercase italic tracking-tight">
                              {review.reviewer?.fullname}
                            </h4>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, idx) => (
                                <Star
                                  key={idx}
                                  size={12}
                                  className={cn(
                                    idx < review.rating
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-slate-200",
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-600 font-medium leading-relaxed italic text-sm">
                            "{review.comment}"
                          </p>
                          <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase pt-2">
                            Verified Brand Partner
                          </p>
                        </div>
                      </div>
                    ))}
                    {(!data.reviews || data.reviews.length === 0) && (
                      <div className="py-20 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-black uppercase text-xs tracking-widest italic">
                          No reviews yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
