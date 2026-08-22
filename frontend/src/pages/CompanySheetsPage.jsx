import React, { useState, useMemo } from "react";
import { COMPANY_DSA_LIST } from "../data/companyDsaData";
import { 
  FaBuilding, 
  FaExternalLinkAlt, 
  FaSearch, 
  FaCode, 
  FaTimes, 
  FaCopy, 
  FaCheckCircle, 
  FaFire,
  FaFilter
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useSheetProgress } from "../context/SheetProgressContext";

const CompanySheetsPage = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState("google");
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [activeCodeTab, setActiveCodeTab] = useState("cpp");
  const [copiedCode, setCopiedCode] = useState(false);

  const { isSolved, toggleSolved } = useSheetProgress();

  const currentCompany = useMemo(() => {
    return COMPANY_DSA_LIST.find((c) => c.id === selectedCompanyId) || COMPANY_DSA_LIST[0];
  }, [selectedCompanyId]);

  const filteredProblems = useMemo(() => {
    return currentCompany.problems.filter((prob) => {
      const matchesSearch =
        !searchQuery.trim() ||
        prob.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prob.topic.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty =
        difficultyFilter === "All" || prob.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });
  }, [currentCompany, searchQuery, difficultyFilter]);

  const copyToClipboard = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case "Easy":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Hard":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold text-indigo-200 mb-4">
            <FaBuilding className="h-3.5 w-3.5" />
            <span>Targeted Interview Preparation</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Company-Wise DSA Question Sheets
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
            Practice high-frequency interview questions tagged by top recruiters (Google, Amazon, Microsoft, TCS, Infosys, Meta). Complete with optimal solutions, C++/Python snippets, and GeeksforGeeks reference guides.
          </p>
        </div>
      </div>

      {/* Company Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
        {COMPANY_DSA_LIST.map((comp) => {
          const isSelected = selectedCompanyId === comp.id;
          return (
            <button
              key={comp.id}
              onClick={() => {
                setSelectedCompanyId(comp.id);
                setSearchQuery("");
                setDifficultyFilter("All");
              }}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 shadow-sm flex flex-col justify-between ${
                isSelected
                  ? "bg-white border-indigo-600 ring-2 ring-indigo-600/20 text-indigo-900 shadow-md scale-[1.02]"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-base tracking-tight">{comp.name}</span>
                  {isSelected && <FaCheckCircle className="text-indigo-600 h-4 w-4" />}
                </div>
                <p className="text-xs text-slate-400 font-medium">{comp.tier}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{comp.problems.length} Questions</span>
                <FaFire className="text-amber-500 h-3 w-3" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Company Header & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-slate-900">{currentCompany.name} DSA Sheet</h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {currentCompany.tier}
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1">{currentCompany.description}</p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-medium text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 shrink-0">
            <span>Total Questions: <strong className="text-slate-800">{currentCompany.problems.length}</strong></span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FaSearch className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${currentCompany.name} questions or topics (e.g. Graph, LRU)...`}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="sm:col-span-4 flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 shrink-0">
              <FaFilter />
              <span>Difficulty:</span>
            </div>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problems Table / Cards */}
      <div className="space-y-3">
        {filteredProblems.length > 0 ? (
          filteredProblems.map((prob) => {
            const solved = isSolved(prob.id);
            return (
              <div
                key={prob.id}
                className={`bg-white rounded-2xl border p-5 transition-all duration-150 shadow-sm hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  solved ? "border-emerald-300 bg-emerald-50/10" : "border-slate-200"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleSolved(prob.id)}
                    className={`mt-1 text-base transition-colors ${
                      solved ? "text-emerald-600" : "text-slate-300 hover:text-slate-400"
                    }`}
                    title={solved ? "Mark as Unsolved" : "Mark as Solved"}
                  >
                    <FaCheckCircle />
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-slate-900">{prob.title}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyBadge(prob.difficulty)}`}>
                        {prob.difficulty}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {prob.topic}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">{prob.frequency}</p>
                  </div>
                </div>

                {/* External Action Links */}
                <div className="flex items-center space-x-2 shrink-0">
                  {prob.gfgUrl && (
                    <a
                      href={prob.gfgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-colors"
                    >
                      <span>GFG Link</span>
                      <FaExternalLinkAlt className="h-2.5 w-2.5" />
                    </a>
                  )}

                  {prob.leetcodeUrl && (
                    <a
                      href={prob.leetcodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors"
                    >
                      <span>LeetCode</span>
                      <FaExternalLinkAlt className="h-2.5 w-2.5" />
                    </a>
                  )}

                  <button
                    onClick={() => setSelectedProblem(prob)}
                    className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 shadow-sm transition-all"
                  >
                    <FaCode className="h-3 w-3" />
                    <span>View Solution</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <FaBuilding className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No matching company questions</h3>
            <p className="text-xs text-slate-500 mt-1">Try switching difficulty filters or searching another term.</p>
          </div>
        )}
      </div>

      {/* Problem Detail Solution Modal */}
      <AnimatePresence>
        {selectedProblem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyBadge(selectedProblem.difficulty)}`}>
                      {selectedProblem.difficulty}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      {selectedProblem.topic}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedProblem.title}</h2>
                </div>

                <button
                  onClick={() => setSelectedProblem(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/50 transition-colors"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
                {/* Statement */}
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Problem Statement</h4>
                  <p className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
                    {selectedProblem.statement}
                  </p>
                </div>

                {/* Approach */}
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Optimal Approach</h4>
                  <p className="bg-indigo-50/50 text-indigo-900 p-3.5 rounded-xl border border-indigo-150 leading-relaxed font-medium">
                    {selectedProblem.approach}
                  </p>
                </div>

                {/* Complexity */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Time Complexity</span>
                    <span className="font-bold text-slate-800 text-xs">{selectedProblem.complexity.time}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Space Complexity</span>
                    <span className="font-bold text-slate-800 text-xs">{selectedProblem.complexity.space}</span>
                  </div>
                </div>

                {/* Solution Code Editor */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setActiveCodeTab("cpp")}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                          activeCodeTab === "cpp" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        C++
                      </button>
                      <button
                        onClick={() => setActiveCodeTab("python")}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                          activeCodeTab === "python" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        Python
                      </button>
                    </div>

                    <button
                      onClick={() => copyToClipboard(selectedProblem.code[activeCodeTab])}
                      className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 font-semibold text-xs transition-colors"
                    >
                      <FaCopy className="h-3 w-3" />
                      <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                    </button>
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                    <pre className="text-emerald-400 whitespace-pre-wrap">{selectedProblem.code[activeCodeTab]}</pre>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
                {selectedProblem.gfgUrl && (
                  <a
                    href={selectedProblem.gfgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center space-x-1.5"
                  >
                    <span>GeeksforGeeks Article</span>
                    <FaExternalLinkAlt className="h-3 w-3" />
                  </a>
                )}
                <button
                  onClick={() => setSelectedProblem(null)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompanySheetsPage;
