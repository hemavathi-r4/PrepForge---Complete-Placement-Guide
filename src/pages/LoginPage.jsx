import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGraduationCap, FaEnvelope, FaLock, FaEye, FaEyeSlash,
  FaSpinner, FaCheckCircle, FaArrowRight, FaCode, FaChartLine, FaUsers,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

// ── Field-level validation ────────────────────────────────────
const validate = ({ email, password }) => {
  const errs = {};
  if (!email.trim())              errs.email    = "Email is required.";
  else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email address.";
  if (!password)                  errs.password = "Password is required.";
  else if (password.length < 6)   errs.password = "Password must be at least 6 characters.";
  return errs;
};

// ── Left branding panel data ──────────────────────────────────
const FEATURES = [
  { icon: <FaCode />,      label: "Coding & DSA",        desc: "120+ curated problem sets" },
  { icon: <FaChartLine />, label: "Aptitude & Reasoning", desc: "Smart performance analytics" },
  { icon: <FaUsers />,     label: "AI Mock Interviews",   desc: "Real-time feedback engine" },
];

const TESTIMONIAL = {
  quote: "PrepForge helped me crack Google SDE-1 in just 3 months. The structured paths are incredible.",
  name:  "Priya Sharma",
  role:  "SDE-1 @ Google · Class of 2025",
};

// ── ForgotPassword Modal ──────────────────────────────────────
const ForgotPasswordModal = ({ onClose, forgotPassword }) => {
  const [email,   setEmail]   = useState("");
  const [status,  setStatus]  = useState("idle"); // idle | loading | sent
  const [msg,     setMsg]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setMsg("Please enter your email."); return; }
    setStatus("loading");
    const res = await forgotPassword({ email });
    setMsg(res.message);
    setStatus("sent");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{   opacity: 0, scale: 0.95, y: 10  }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full space-y-5"
      >
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-gray-900">Reset your password</h2>
          <p className="text-sm text-gray-500">
            Enter your account email and we'll send you a reset link.
          </p>
        </div>

        {status === "sent" ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <FaCheckCircle className="h-10 w-10 text-green-500" />
            <p className="text-sm text-gray-700 font-medium">{msg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setMsg(""); }}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {msg && <p className="text-xs text-red-600 mt-1">{msg}</p>}
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {status === "loading" && <FaSpinner className="animate-spin h-4 w-4" />}
              Send Reset Link
            </button>
          </form>
        )}

        <button
          onClick={onClose}
          className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          {status === "sent" ? "Close" : "Cancel"}
        </button>
      </motion.div>
    </motion.div>
  );
};

// ── Main Login Page ───────────────────────────────────────────
const LoginPage = () => {
  const { login, error: authError, clearError, forgotPassword } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const [fields,      setFields]      = useState({ email: "", password: "" });
  const [errors,      setErrors]      = useState({});
  const [touched,     setTouched]     = useState({});
  const [showPass,    setShowPass]    = useState(false);
  const [rememberMe,  setRememberMe]  = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [showForgot,  setShowForgot]  = useState(false);

  // Clear context-level error when user edits fields
  useEffect(() => { clearError(); }, [fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, ...validate({ ...fields, [name]: value }) }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, ...validate(fields) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setTouched({ email: true, password: true });
      return;
    }
    setLoading(true);
    const ok = await login({ ...fields, rememberMe });
    setLoading(false);
    if (ok) navigate(redirectTo, { replace: true });
  };

  // Autofill demo account (creates it if missing)
  const autofill = () => {
    const DEMO = { email: "demo@prepforge.com", password: "password123", name: "Demo Student" };
    const users = JSON.parse(localStorage.getItem("prepforge_users") || "[]");
    if (!users.some((u) => u.email === DEMO.email)) {
      users.push({ id: "usr_demo", ...DEMO, role: "student", joinedAt: new Date().toISOString() });
      localStorage.setItem("prepforge_users", JSON.stringify(users));
    }
    setFields({ email: DEMO.email, password: DEMO.password });
    setErrors({});
    clearError();
  };

  const fieldCls = (name) =>
    `block w-full pl-10 pr-10 py-2.5 text-sm border rounded-lg bg-white placeholder-gray-400
     focus:outline-none focus:ring-2 transition-all duration-150
     ${errors[name] && touched[name]
       ? "border-red-400 focus:ring-red-300"
       : "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"}`;

  return (
    <>
      {/* Forgot-password modal */}
      <AnimatePresence>
        {showForgot && (
          <ForgotPasswordModal
            onClose={() => setShowForgot(false)}
            forgotPassword={forgotPassword}
          />
        )}
      </AnimatePresence>

      <div className="flex-grow flex min-h-[calc(100vh-64px)]">

        {/* ── LEFT — Branding Panel ─────────────────────────── */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-indigo-600 flex-col justify-between p-12">
          {/* Background radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#6366f1_0%,_#4338ca_50%,_#312e81_100%)]" />
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-white/5" />

          {/* Top brand */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2.5 text-white">
              <FaGraduationCap className="h-8 w-8" />
              <span className="text-xl font-bold tracking-tight">PrepForge</span>
            </Link>
          </div>

          {/* Center content */}
          <div className="relative z-10 space-y-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-semibold">
                <HiSparkles className="h-3.5 w-3.5" />
                <span>Your placement companion</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white leading-snug">
                Everything you need to land your dream role.
              </h1>
              <p className="text-indigo-200 text-sm leading-relaxed max-w-sm">
                Structured learning paths, mock tests, AI-powered interview prep, and real-time analytics — all in one place.
              </p>
            </div>

            <ul className="space-y-4">
              {FEATURES.map((f) => (
                <li key={f.label} className="flex items-start gap-4">
                  <div className="p-2.5 bg-white/10 rounded-xl text-white flex-shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{f.label}</p>
                    <p className="text-xs text-indigo-300">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial */}
          <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/15">
            <p className="text-sm text-indigo-100 italic leading-relaxed">
              "{TESTIMONIAL.quote}"
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-indigo-400 flex items-center justify-center text-white text-sm font-bold">
                {TESTIMONIAL.name[0]}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{TESTIMONIAL.name}</p>
                <p className="text-[10px] text-indigo-300">{TESTIMONIAL.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT — Form Panel ────────────────────────────── */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-slate-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md space-y-7"
          >
            {/* Mobile logo (hidden on desktop — panel shows it) */}
            <div className="lg:hidden text-center">
              <Link to="/" className="inline-flex items-center gap-2 text-indigo-600">
                <FaGraduationCap className="h-7 w-7" />
                <span className="text-xl font-bold text-gray-900">
                  Prep<span className="text-indigo-600">Forge</span>
                </span>
              </Link>
            </div>

            {/* Heading */}
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-gray-900">Welcome back</h2>
              <p className="text-sm text-gray-500">
                Sign in to continue your preparation journey.
              </p>
            </div>

            {/* Context-level auth error */}
            <AnimatePresence>
              {authError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0  }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
                >
                  <span className="mt-0.5 flex-shrink-0">⚠️</span>
                  <span>{authError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={fields.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="name@example.com"
                    disabled={loading}
                    className={fieldCls("email")}
                  />
                </div>
                <AnimatePresence>
                  {errors.email && touched.email && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="mt-1.5 text-xs text-red-600">{errors.email}</motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="text-xs font-semibold text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                  <input
                    id="password"
                    name="password"
                    type={showPass ? "text" : "password"}
                    autoComplete="current-password"
                    value={fields.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    disabled={loading}
                    className={fieldCls("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.password && touched.password && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="mt-1.5 text-xs text-red-600">{errors.password}</motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={rememberMe}
                  id="rememberMe"
                  onClick={() => setRememberMe((v) => !v)}
                  className={`h-5 w-5 rounded flex items-center justify-center border-2 transition-all duration-150 flex-shrink-0
                    ${rememberMe
                      ? "bg-indigo-600 border-indigo-600"
                      : "bg-white border-gray-300 hover:border-indigo-400"}`}
                >
                  {rememberMe && (
                    <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer select-none"
                  onClick={() => setRememberMe((v) => !v)}>
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl
                           text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700
                           shadow-sm hover:shadow-md transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                           disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><FaSpinner className="animate-spin h-4 w-4" /> Signing in…</>
                ) : (
                  <><span>Sign In</span><FaArrowRight className="h-3.5 w-3.5" /></>
                )}
              </button>

              {/* Demo autofill */}
              <button
                type="button"
                onClick={autofill}
                className="w-full py-2 px-3 border border-dashed border-indigo-300 rounded-xl
                           text-xs font-semibold text-indigo-600 bg-indigo-50/60 hover:bg-indigo-50
                           transition-colors"
              >
                🔑 Autofill Demo Credentials
              </button>
            </form>

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                Create one free
              </Link>
            </p>
          </motion.div>
        </div>

      </div>
    </>
  );
};

export default LoginPage;
