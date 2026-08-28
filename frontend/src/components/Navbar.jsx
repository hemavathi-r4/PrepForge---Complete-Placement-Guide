import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaGraduationCap, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "DSA Sheet", path: "/dsa-sheet" },
    { name: "SQL Sheet", path: "/sql-sheet" },
    { name: "Aptitude", path: "/aptitude" },
    { name: "CS Fundamentals", path: "/cs-fundamentals" },
    { name: "Company Sheets", path: "/company-sheets" },
    { name: "AI Mock Interview", path: "/ai-interview" },
    ...(user ? [{ name: "Dashboard", path: "/dashboard" }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-indigo-650 hover:opacity-90 transition-opacity">
              <FaGraduationCap className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold tracking-tight text-gray-900">
                Prep<span className="text-indigo-600">Forge</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-indigo-600 font-bold"
                      : "text-gray-600 hover:text-indigo-600"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop User Info / Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                  title="View Profile"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-6 w-6 rounded-full object-cover border border-indigo-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "";
                      }}
                    />
                  ) : (
                    <FaUserCircle className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-sm font-semibold">{user.name?.split(" ")[0]}</span>
                </Link>
                <Link
                  to="/settings"
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                  title="Account Settings"
                >
                  <span className="text-xs font-medium">Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
                  title="Sign Out"
                >
                  <FaSignOutAlt className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-750 px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none transition-colors"
            >
              {isOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-gray-150 bg-white"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="pt-4 pb-4 border-t border-gray-100 px-5">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FaUserCircle className="h-8 w-8 text-gray-400" />
                    <div>
                      <div className="text-base font-medium text-gray-800">{user.name}</div>
                      <div className="text-sm font-medium text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center px-2.5 py-2 border border-gray-200 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center px-2.5 py-2 border border-gray-200 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center px-2.5 py-2 border border-gray-200 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      Settings
                    </Link>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
