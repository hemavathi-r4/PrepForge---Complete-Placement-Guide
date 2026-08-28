import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../services/userService";
import {
  FaUserGraduate,
  FaEnvelope,
  FaUniversity,
  FaGithub,
  FaLinkedin,
  FaCode,
  FaEdit,
  FaSave,
  FaTimes,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaShieldAlt,
  FaUserCircle
} from "react-icons/fa";
import {
  SiLeetcode,
  SiCodeforces,
  SiCodechef,
  SiGeeksforgeeks
} from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";

const ProfilePage = () => {
  const { user: authUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    college: "",
    bio: "",
    avatar: "",
    github: "",
    linkedin: "",
    leetcode: "",
    codeforces: "",
    codechef: "",
    geeksforgeeks: ""
  });

  // Fetch fresh profile data on component mount
  useEffect(() => {
    let isMounted = true;

    const fetchUserProfile = async () => {
      setLoading(true);
      setError("");
      const res = await getProfile();

      if (isMounted) {
        if (res.success && res.user) {
          setProfile(res.user);
          setFormData({
            name: res.user.name || "",
            college: res.user.college || "",
            bio: res.user.bio || "",
            avatar: res.user.avatar || "",
            github: res.user.github || "",
            linkedin: res.user.linkedin || "",
            leetcode: res.user.leetcode || "",
            codeforces: res.user.codeforces || "",
            codechef: res.user.codechef || "",
            geeksforgeeks: res.user.geeksforgeeks || ""
          });
        } else {
          setError(res.error || "Failed to load profile details.");
        }
        setLoading(false);
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditOpen = () => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        college: profile.college || "",
        bio: profile.bio || "",
        avatar: profile.avatar || "",
        github: profile.github || "",
        linkedin: profile.linkedin || "",
        leetcode: profile.leetcode || "",
        codeforces: profile.codeforces || "",
        codechef: profile.codechef || "",
        geeksforgeeks: profile.geeksforgeeks || ""
      });
    }
    setError("");
    setSuccessMessage("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError("");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.name.trim()) {
      setError("Name is required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    const res = await updateProfile(formData);

    if (res.success && res.user) {
      setProfile(res.user);
      updateUser(res.user);
      setSuccessMessage(res.message || "Profile updated successfully!");
      setIsEditing(false);
    } else {
      setError(res.error || "Failed to update profile.");
    }
    setSaving(false);
  };

  const codingHandles = [
    {
      id: "leetcode",
      label: "LeetCode",
      value: profile?.leetcode,
      icon: <SiLeetcode className="h-5 w-5 text-amber-500" />,
      url: profile?.leetcode
        ? profile.leetcode.startsWith("http")
          ? profile.leetcode
          : `https://leetcode.com/u/${profile.leetcode}`
        : null
    },
    {
      id: "codeforces",
      label: "Codeforces",
      value: profile?.codeforces,
      icon: <SiCodeforces className="h-5 w-5 text-blue-500" />,
      url: profile?.codeforces
        ? profile.codeforces.startsWith("http")
          ? profile.codeforces
          : `https://codeforces.com/profile/${profile.codeforces}`
        : null
    },
    {
      id: "codechef",
      label: "CodeChef",
      value: profile?.codechef,
      icon: <SiCodechef className="h-5 w-5 text-amber-800" />,
      url: profile?.codechef
        ? profile.codechef.startsWith("http")
          ? profile.codechef
          : `https://www.codechef.com/users/${profile.codechef}`
        : null
    },
    {
      id: "geeksforgeeks",
      label: "GeeksforGeeks",
      value: profile?.geeksforgeeks,
      icon: <SiGeeksforgeeks className="h-5 w-5 text-green-600" />,
      url: profile?.geeksforgeeks
        ? profile.geeksforgeeks.startsWith("http")
          ? profile.geeksforgeeks
          : `https://auth.geeksforgeeks.org/user/${profile.geeksforgeeks}`
        : null
    }
  ];

  const socialLinks = [
    {
      id: "github",
      label: "GitHub",
      value: profile?.github,
      icon: <FaGithub className="h-5 w-5 text-gray-800" />,
      url: profile?.github
        ? profile.github.startsWith("http")
          ? profile.github
          : `https://github.com/${profile.github}`
        : null
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: profile?.linkedin,
      icon: <FaLinkedin className="h-5 w-5 text-blue-600" />,
      url: profile?.linkedin
        ? profile.linkedin.startsWith("http")
          ? profile.linkedin
          : `https://linkedin.com/in/${profile.linkedin}`
        : null
    }
  ];

  const formattedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      })
    : "Recently";

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Profile Header Banner */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center space-x-5">
              <div className="relative">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "";
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-indigo-100">
                    {profile?.name
                      ? profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()
                      : "U"}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white w-4 h-4 rounded-full" title="Active Account"></div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    {profile?.name || authUser?.name || "Student"}
                  </h1>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    Candidate
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <FaEnvelope className="text-gray-400" />
                    {profile?.email || authUser?.email}
                  </span>
                  {profile?.college && (
                    <span className="flex items-center gap-1.5">
                      <FaUniversity className="text-gray-400" />
                      {profile.college}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <FaCalendarAlt className="text-gray-400" />
                    Joined {formattedDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleEditOpen}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-200"
              >
                <FaEdit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
              <Link
                to="/settings"
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
              >
                <FaShieldAlt className="h-4 w-4 text-gray-400" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Success / Error Alerts */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <FaCheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium">{successMessage}</span>
              </div>
              <button
                onClick={() => setSuccessMessage("")}
                className="text-green-600 hover:text-green-800 text-sm font-bold ml-4"
              >
                &times;
              </button>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <FaExclamationCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
              <button
                onClick={() => setError("")}
                className="text-red-600 hover:text-red-800 text-sm font-bold ml-4"
              >
                &times;
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Profile Form Modal / Section */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-2xl border border-indigo-100 shadow-md p-6 sm:p-8"
            >
              <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Edit Profile Information</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Update your personal information and competitive programming handles.
                  </p>
                </div>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Basic Details Grid */}
                <div>
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your full name"
                        className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Email Address (Read-only)
                      </label>
                      <input
                        type="email"
                        value={profile?.email || ""}
                        disabled
                        className="w-full px-3.5 py-2.5 text-sm bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        College / University
                      </label>
                      <input
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleInputChange}
                        placeholder="e.g. National Institute of Technology"
                        className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Avatar Image URL
                      </label>
                      <input
                        type="url"
                        name="avatar"
                        value={formData.avatar}
                        onChange={handleInputChange}
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Bio / About Yourself
                    </label>
                    <textarea
                      name="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Brief summary of your background, career goals, or placement prep..."
                      className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Social & Professional Grid */}
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4">
                    Social & Professional Profiles
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        GitHub Username or URL
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <FaGithub className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          name="github"
                          value={formData.github}
                          onChange={handleInputChange}
                          placeholder="e.g. johndoe"
                          className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        LinkedIn Username or URL
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <FaLinkedin className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleInputChange}
                          placeholder="e.g. johndoe"
                          className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coding Profiles Grid */}
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4">
                    Coding & Competitive Programming Profiles
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        LeetCode Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <SiLeetcode className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          name="leetcode"
                          value={formData.leetcode}
                          onChange={handleInputChange}
                          placeholder="e.g. johndoe_lc"
                          className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Codeforces Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <SiCodeforces className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          name="codeforces"
                          value={formData.codeforces}
                          onChange={handleInputChange}
                          placeholder="e.g. johndoe_cf"
                          className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        CodeChef Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <SiCodechef className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          name="codechef"
                          value={formData.codechef}
                          onChange={handleInputChange}
                          placeholder="e.g. johndoe_cc"
                          className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        GeeksforGeeks Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <SiGeeksforgeeks className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          name="geeksforgeeks"
                          value={formData.geeksforgeeks}
                          onChange={handleInputChange}
                          placeholder="e.g. johndoe_gfg"
                          className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
                  >
                    <FaSave className="h-4 w-4" />
                    <span>{saving ? "Saving Changes..." : "Save Profile"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Bio & Academic Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* About Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                About Me
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {profile?.bio || (
                  <span className="italic text-gray-400">
                    No bio added yet. Click &quot;Edit Profile&quot; to write a brief summary about your placement goals.
                  </span>
                )}
              </p>
            </div>

            {/* Academic Information Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Academic Details
              </h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 mt-0.5">
                    <FaUniversity className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400">College / Institution</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {profile?.college || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 mt-0.5">
                    <FaEnvelope className="text-indigo-600 h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400">Registered Email</p>
                    <p className="text-sm font-semibold text-gray-800">{profile?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Social Profiles
              </h2>
              <div className="space-y-2.5">
                {socialLinks.map((social) => (
                  <div
                    key={social.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      {social.icon}
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{social.label}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[150px]">
                          {social.value || "Not linked"}
                        </p>
                      </div>
                    </div>
                    {social.url ? (
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                        title={`Visit ${social.label}`}
                      >
                        <FaExternalLinkAlt className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-gray-400 font-medium">—</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Coding Platforms & Account Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Coding Profiles Showcase */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Coding & Competitive Programming Profiles
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Connected problem solving handles across competitive platforms.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {codingHandles.map((handle) => (
                  <div
                    key={handle.id}
                    className="p-4 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-gray-50 transition-colors flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 bg-white rounded-lg shadow-2xs border border-gray-100">
                          {handle.icon}
                        </div>
                        <span className="text-sm font-bold text-gray-800">{handle.label}</span>
                      </div>
                      {handle.value && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
                          Connected
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                      <span className="text-xs text-gray-600 font-medium truncate max-w-[170px]">
                        {handle.value ? handle.value : "No handle added"}
                      </span>
                      {handle.url ? (
                        <a
                          href={handle.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                          <span>Profile</span>
                          <FaExternalLinkAlt className="h-2.5 w-2.5" />
                        </a>
                      ) : (
                        <button
                          onClick={handleEditOpen}
                          className="text-xs font-medium text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation Journey Card */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-850 to-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-200 uppercase tracking-wider">
                    Preparation Hub
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">Ready to crush your next interview?</h3>
                  <p className="text-xs text-indigo-200 mt-1 max-w-lg">
                    Track your DSA sheets, take AI Mock Interviews, and review company-specific interview archives.
                  </p>
                </div>
              </div>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/dsa-sheet"
                  className="px-4 py-2 bg-white text-indigo-900 font-bold rounded-xl text-xs hover:bg-indigo-50 transition-colors"
                >
                  Solve DSA Questions
                </Link>
                <Link
                  to="/ai-interview"
                  className="px-4 py-2 bg-indigo-700/60 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors border border-indigo-500/30"
                >
                  AI Mock Interview
                </Link>
                <Link
                  to="/settings"
                  className="px-4 py-2 bg-transparent text-indigo-200 hover:text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  Account Settings &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
