import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { changePassword } from "../services/userService";
import {
  FaKey,
  FaShieldAlt,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationCircle,
  FaUserCircle,
  FaInfoCircle
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const SettingsPage = () => {
  const { user } = useAuth();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    // Validation
    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation password do not match.");
      return;
    }

    setLoading(true);

    const res = await changePassword({ currentPassword, newPassword });

    if (res.success) {
      setSuccessMessage(res.message || "Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } else {
      setError(res.error || "Failed to change password.");
    }

    setLoading(false);
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      })
    : "Active Member";

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
                <FaShieldAlt className="h-3.5 w-3.5" />
                <span>Account &amp; Security</span>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Account Settings
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Manage your credentials, security preferences, and account details.
              </p>
            </div>
            <Link
              to="/profile"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors self-start sm:self-auto"
            >
              <FaUser className="h-3.5 w-3.5" />
              <span>View Profile</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Alerts */}
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

        {/* Account Information Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-gray-900">Account Information</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Overview of your registered identity and verification status.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
              <FaCheckCircle className="h-3 w-3" />
              <span>Verified Account</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-400 font-medium">Registered Name</span>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">{user?.name || "Student"}</p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-400 font-medium">Primary Email</span>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">{user?.email || "user@example.com"}</p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-400 font-medium">Account Created</span>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">{formattedDate}</p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-400 font-medium">Authentication Type</span>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">JWT / Password Hash (bcrypt)</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-amber-700 bg-amber-50/70 p-3 rounded-xl border border-amber-100">
            <FaInfoCircle className="h-4 w-4 flex-shrink-0 text-amber-600" />
            <span>
              Registered email is permanently bound to this candidate profile and is read-only.
            </span>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-7 shadow-sm space-y-6">
          <div className="pb-4 border-b border-gray-100">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <FaLock className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Change Password</h2>
            </div>
            <p className="text-xs text-gray-500 mt-1.5 ml-9">
              Ensure your account is using a long, random password to stay secure.
            </p>
          </div>

          <form onSubmit={handleSubmitPassword} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
              >
                <FaKey className="h-3.5 w-3.5" />
                <span>{loading ? "Updating Password..." : "Update Password"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
