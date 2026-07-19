import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGraduationCap, FaUser, FaEnvelope, FaLock,
  FaEye, FaEyeSlash, FaSpinner, FaArrowRight,
  FaCheck,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

// ── Password strength ─────────────────────────────────────────
const getStrength = (password) => {
  if (!password) return { level: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 6)                       score++;
  if (password.length >= 10)                      score++;
  if (/[A-Z]/.test(password))                     score++;
  if (/[0-9]/.test(password))                     score++;
  if (/[^A-Za-z0-9]/.test(password))              score++;

  if (score <= 1) return { level: 1, label: "Weak",   color: "bg-red-500"    };
  if (score <= 3) return { level: 2, label: "Fair",   color: "bg-amber-500"  };
  return           { level: 3, label: "Strong", color: "bg-green-500"  };
};

// ── Field-level validation ────────────────────────────────────
const validate = (fields) => {
  const { name, email, password, confirmPassword } = fields;
  const errs = {};
  if (!name.trim())
    errs.name = "Full name is required.";
  if (!email.trim())
    errs.email = "Email is required.";
  else if (!/\S+@\S+\.\S+/.test(email))
    errs.email = "Enter a valid email address.";
  if (!password)
    errs.password = "Password is required.";
  else if (password.length < 6)
    errs.password = "Password must be at least 6 characters.";
  if (!confirmPassword)
    errs.confirmPassword = "Please confirm your password.";
  else if (password !== confirmPassword)
    errs.confirmPassword = "Passwords do not match.";
  return errs;
};

// ── Benefits for left panel ───────────────────────────────────
const BENEFITS = [
  "Curated DSA, Aptitude & CS fundamentals",
  "AI-powered mock interviews with feedback",
  "Company-specific placement preparation",
  "Live leaderboards & progress tracking",
  "ATS resume builder & review",
];

// ── Main Signup Page ──────────────────────────────────────────
const SignupPage = () => {
  const { signup, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    name: "", email: "", password: "", confirmPassword: "",
  });
  const [errors,     setErrors]     = useState({});
  const [touched,    setTouched]    = useState({});
  const [showPass,   setShowPass]   = useState(false);
  const [showConf,   setShowConf]   = useState(false);
  const [loading,    setLoading]    = useState(false);

  const strength = getStrength(fields.password);

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
    setErrors(validate({ ...fields }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setTouched({ name: true, email: true, password: true, confirmPassword: true });
      return;
    }
    setLoading(true);
    const ok = await signup({ name: fields.name, email: fields.email, password: fields.password });
    setLoading(false);
    if (ok) navigate("/dashboard", { replace: true });
  };

  const fieldCls = (name) =>
    `block w-full pl-10 pr-10 py-2.5 text-sm border rounded-lg bg-white placeholder-gray-400
     focus:outline-none focus:ring-2 transition-all duration-150
     ${errors[name] && touched[name]
       ? "border-red-400 focus:ring-red-300"
       : "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"}`;

  return (
    <div className="flex-grow flex min-h-[calc(100vh-64px)]">

      {/* ── LEFT — Branding Panel ──────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "linear-gradient(135deg, #312e81 0%, #4338ca 50%, #4f46e5 100%)" }}
      >
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-28 -left-16 w-72 h-72 rounded-full bg-white/5" />

        {/* Brand */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5 text-white">
            <FaGraduationCap className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight">PrepForge</span>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-semibold">
              <HiSparkles className="h-3.5 w-3.5" />
              <span>Free — no credit card needed</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white leading-snug">
              Join 50,000+ students forging their careers.
            </h1>
            <p className="text-indigo-200 text-sm leading-relaxed max-w-sm">
              PrepForge gives you everything you need to crack coding rounds, aptitude tests, and interviews — completely free.
            </p>
          </div>

          {/* Benefits list */}
          <ul className="space-y-3">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-3">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-400/20 flex items-center justify-center">
                  <FaCheck className="h-2.5 w-2.5 text-green-400" />
                </div>
                <span className="text-sm text-indigo-100">{b}</span>
              </li>
            ))}
          </ul>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15">
            {[
              { v: "50K+", l: "Students"      },
              { v: "95%",  l: "Placement Rate" },
              { v: "180+", l: "Companies"      },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-xl font-extrabold text-white">{s.v}</p>
                <p className="text-[10px] text-indigo-300 font-medium">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="relative z-10 text-xs text-indigo-300">
          PrepForge &copy; {new Date().getFullYear()} &nbsp;·&nbsp; Built for campus placement success
        </p>
      </div>

      {/* ── RIGHT — Form Panel ─────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-slate-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-6"
        >
          {/* Mobile logo */}
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
            <h2 className="text-2xl font-extrabold text-gray-900">Create your account</h2>
            <p className="text-sm text-gray-500">
              Start your placement preparation — it's completely free.
            </p>
          </div>

          {/* Auth-level error */}
          <AnimatePresence>
            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
              >
                <span className="mt-0.5 flex-shrink-0">⚠️</span>
                <span>{authError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                <input
                  id="name" name="name" type="text" autoComplete="name"
                  value={fields.name} onChange={handleChange} onBlur={handleBlur}
                  placeholder="John Doe" disabled={loading}
                  className={fieldCls("name")}
                />
              </div>
              <AnimatePresence>
                {errors.name && touched.name && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="mt-1.5 text-xs text-red-600">{errors.name}</motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                <input
                  id="email" name="email" type="email" autoComplete="email"
                  value={fields.email} onChange={handleChange} onBlur={handleBlur}
                  placeholder="name@example.com" disabled={loading}
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
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                <input
                  id="password" name="password" type={showPass ? "text" : "password"}
                  autoComplete="new-password"
                  value={fields.password} onChange={handleChange} onBlur={handleBlur}
                  placeholder="Min 6 characters" disabled={loading}
                  className={fieldCls("password")}
                />
                <button type="button" onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPass ? "Hide password" : "Show password"}>
                  {showPass ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                </button>
              </div>

              {/* Strength indicator */}
              {fields.password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((lvl) => (
                      <div key={lvl}
                        className={`h-1 flex-1 rounded-full transition-all duration-300
                          ${strength.level >= lvl ? strength.color : "bg-gray-200"}`}
                      />
                    ))}
                  </div>
                  <p className={`text-[10px] font-semibold ${
                    strength.level === 1 ? "text-red-500"
                    : strength.level === 2 ? "text-amber-500"
                    : "text-green-600"
                  }`}>
                    {strength.label} password
                  </p>
                </div>
              )}

              <AnimatePresence>
                {errors.password && touched.password && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="mt-1.5 text-xs text-red-600">{errors.password}</motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                <input
                  id="confirmPassword" name="confirmPassword"
                  type={showConf ? "text" : "password"} autoComplete="new-password"
                  value={fields.confirmPassword} onChange={handleChange} onBlur={handleBlur}
                  placeholder="Re-enter password" disabled={loading}
                  className={fieldCls("confirmPassword")}
                />
                <button type="button" onClick={() => setShowConf((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showConf ? "Hide password" : "Show password"}>
                  {showConf ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                </button>
              </div>

              {/* Match indicator */}
              {fields.confirmPassword && fields.password && (
                <p className={`mt-1.5 text-[10px] font-semibold ${
                  fields.password === fields.confirmPassword ? "text-green-600" : "text-red-500"
                }`}>
                  {fields.password === fields.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}

              <AnimatePresence>
                {errors.confirmPassword && touched.confirmPassword && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="mt-1.5 text-xs text-red-600">{errors.confirmPassword}</motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl
                         text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700
                         shadow-sm hover:shadow-md transition-all duration-200 mt-2
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                         disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><FaSpinner className="animate-spin h-4 w-4" /> Creating account…</>
              ) : (
                <><span>Create Account</span><FaArrowRight className="h-3.5 w-3.5" /></>
              )}
            </button>
          </form>

          {/* Sign in link */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

    </div>
  );
};

export default SignupPage;
