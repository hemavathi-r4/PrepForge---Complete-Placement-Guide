import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaCheckCircle,
  FaCopy,
  FaCheck,
  FaLightbulb,
  FaCode,
  FaExternalLinkAlt,
  FaStickyNote,
  FaClock,
  FaMemory,
  FaBuilding
} from "react-icons/fa";
import { useSheetProgress } from "../../context/SheetProgressContext";

const ProblemDetailModal = ({ problem, onClose, isSql = false }) => {
  const [activeTab, setActiveTab] = useState("solution");
  const [codeLang, setCodeLang] = useState("cpp");
  const [copied, setCopied] = useState(false);

  const { isSolved, toggleSolved, getNote, saveNote } = useSheetProgress();
  const [userNote, setUserNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    if (problem) {
      setUserNote(getNote(problem.id));
    }
  }, [problem]);

  if (!problem) return null;

  const solved = isSolved(problem.id);

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNote = () => {
    saveNote(problem.id, userNote);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const activeCodeSnippet = isSql
    ? problem.solutionQuery
    : problem.code?.[codeLang] || problem.code?.cpp || "";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Top Bar Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/80 flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    problem.difficulty === "Easy"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : problem.difficulty === "Medium"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {problem.difficulty}
                </span>

                {problem.companies && problem.companies.map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 bg-white text-slate-600 rounded-md text-[11px] font-medium border border-slate-200"
                  >
                    {c}
                  </span>
                ))}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {problem.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 border-b border-slate-200 px-6 bg-slate-50/40 text-sm font-semibold">
            {[
              { id: "solution", label: isSql ? "SQL Solution" : "Optimal Solution", icon: FaCode },
              { id: "statement", label: "Statement & Approach", icon: FaLightbulb },
              { id: "notes", label: "My Notes", icon: FaStickyNote }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-3 px-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Modal Content Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
            {activeTab === "solution" && (
              <div className="space-y-4">
                {/* Language Switcher for DSA */}
                {!isSql && problem.code && (
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex space-x-2">
                      {["cpp", "python"].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setCodeLang(lang)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                            codeLang === lang
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {lang === "cpp" ? "C++" : "Python 3"}
                        </button>
                      ))}
                    </div>

                    {problem.complexity && (
                      <div className="flex items-center space-x-3 text-xs font-medium text-slate-500">
                        <span className="flex items-center space-x-1">
                          <FaClock className="text-indigo-500" />
                          <span>Time: {problem.complexity.time}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <FaMemory className="text-purple-500" />
                          <span>Space: {problem.complexity.space}</span>
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* SQL Schema if SQL problem */}
                {isSql && problem.schema && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Database Schema Context
                    </span>
                    <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap">
                      {problem.schema}
                    </pre>
                  </div>
                )}

                {/* Code Block Container */}
                <div className="relative rounded-xl overflow-hidden bg-slate-900 text-slate-100 border border-slate-800 shadow-inner">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 text-xs text-slate-400 border-b border-slate-800">
                    <span>{isSql ? "PostgreSQL / MySQL" : codeLang === "cpp" ? "C++ Solution" : "Python Solution"}</span>
                    <button
                      onClick={() => handleCopyCode(activeCodeSnippet)}
                      className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
                    >
                      {copied ? <FaCheck className="text-emerald-400" /> : <FaCopy />}
                      <span>{copied ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>

                  <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-indigo-200">
                    <code>{activeCodeSnippet}</code>
                  </pre>
                </div>

                {/* Explanation text */}
                {(problem.approach || problem.explanation) && (
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 space-y-1">
                    <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider flex items-center space-x-1">
                      <FaLightbulb className="w-3.5 h-3.5" />
                      <span>Key Approach & Logic</span>
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {problem.approach || problem.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "statement" && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Problem Statement
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                    {problem.statement}
                  </p>
                </div>

                {problem.approach && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Optimal Approach & Intuition
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                      {problem.approach}
                    </p>
                  </div>
                )}

                {problem.leetcodeUrl && (
                  <div className="pt-2">
                    <a
                      href={problem.leetcodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <span>Practice Problem on LeetCode</span>
                      <FaExternalLinkAlt className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {activeTab === "notes" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-900">
                    Personal Revision Notes
                  </label>
                  <p className="text-xs text-slate-500">
                    Jot down key takeaways, edge cases, or tricks for fast revision before interviews.
                  </p>
                </div>

                <textarea
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  placeholder="e.g. Remember to handle negative numbers or empty array boundary conditions..."
                  rows={6}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-sans"
                />

                <div className="flex items-center justify-between">
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                  >
                    Save Notes
                  </button>

                  {noteSaved && (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
                      <FaCheck className="w-3 h-3" />
                      <span>Notes Saved Successfully!</span>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              onClick={() => toggleSolved(problem.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                solved
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              <FaCheckCircle className={solved ? "text-emerald-600" : "text-slate-400"} />
              <span>{solved ? "Completed (Click to undo)" : "Mark as Solved"}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProblemDetailModal;
