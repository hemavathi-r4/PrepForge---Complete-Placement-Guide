import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaGraduationCap, FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Invalid credentials. If you haven't registered, sign up first.");
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill button for testing convenience
  const handlePrefill = (role) => {
    setErrorMsg("");
    // If there is no user in localStorage yet, we register a demo user
    const users = JSON.parse(localStorage.getItem("prepforge_users") || "[]");
    const demoEmail = "demo@prepforge.com";
    const demoPassword = "password123";
    
    if (!users.some(u => u.email.toLowerCase() === demoEmail)) {
      users.push({
        id: "user_demo",
        name: "Demo Student",
        email: demoEmail,
        password: demoPassword,
        joinedAt: new Date().toISOString()
      });
      localStorage.setItem("prepforge_users", JSON.stringify(users));
    }
    
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Logo and title */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2 text-indigo-650">
            <FaGraduationCap className="h-9 w-9 text-indigo-600" />
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              Prep<span className="text-indigo-600">Forge</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-gray-950">Welcome back</h2>
          <p className="text-xs text-gray-500">
            Enter your credentials to access your dashboard.
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FaEnvelope className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-150"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FaLock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-150"
                  disabled={loading}
                />
              </div>
            </div>

          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-750 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <FaSpinner className="animate-spin h-5 w-5 mr-2" />
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        {/* Demo login shortcut for ease of testing */}
        <div className="pt-2">
          <button
            onClick={() => handlePrefill("student")}
            className="w-full text-center py-1.5 px-3 border border-dashed border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 rounded-lg text-xs font-semibold transition-colors"
          >
            🔑 Autofill Demo Credentials
          </button>
        </div>

        {/* Footer link to Sign Up */}
        <div className="text-center pt-2 border-t border-gray-50 text-xs">
          <span className="text-gray-500">Don't have an account? </span>
          <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
