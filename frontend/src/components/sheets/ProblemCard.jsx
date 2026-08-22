import React from "react";
import { motion } from "framer-motion";
import {
  FaCheck,
  FaStar,
  FaRegStar,
  FaExternalLinkAlt,
  FaCode,
  FaBuilding,
  FaChevronRight
} from "react-icons/fa";
import { useSheetProgress } from "../../context/SheetProgressContext";

const ProblemCard = ({ problem, onSelectProblem, isSql = false }) => {
  const { isSolved, toggleSolved, isBookmarked, toggleBookmark } = useSheetProgress();
  const solved = isSolved(problem.id);
  const bookmarked = isBookmarked(problem.id);

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
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={`group relative bg-white border rounded-xl p-4 sm:p-5 transition-all duration-200 shadow-sm hover:shadow-md ${
        solved
          ? "border-emerald-200 bg-emerald-50/20"
          : "border-slate-200/80 hover:border-indigo-300"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left Side: Checkbox + Title */}
        <div className="flex items-start space-x-3.5 flex-1 min-w-0">
          <button
            onClick={() => toggleSolved(problem.id)}
            className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 shrink-0 ${
              solved
                ? "bg-emerald-500 border-emerald-500 text-white shadow-sm scale-105"
                : "border-slate-300 hover:border-emerald-500 bg-white"
            }`}
            title={solved ? "Mark as unsolved" : "Mark as solved"}
          >
            {solved && <FaCheck className="w-3 h-3 stroke-[3]" />}
          </button>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                onClick={() => onSelectProblem(problem)}
                className={`text-sm sm:text-base font-semibold cursor-pointer transition-colors line-clamp-1 ${
                  solved ? "text-slate-500 line-through" : "text-slate-900 hover:text-indigo-600"
                }`}
              >
                {problem.title}
              </h3>

              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDifficultyBadge(
                  problem.difficulty
                )}`}
              >
                {problem.difficulty}
              </span>
            </div>

            {/* Company Tags */}
            {problem.companies && problem.companies.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <FaBuilding className="w-3 h-3 text-slate-400 shrink-0" />
                {problem.companies.slice(0, 4).map((company) => (
                  <span
                    key={company}
                    className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[11px] font-medium border border-slate-200/60"
                  >
                    {company}
                  </span>
                ))}
                {problem.companies.length > 4 && (
                  <span className="text-[11px] text-slate-400 font-medium">
                    +{problem.companies.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => toggleBookmark(problem.id)}
            className={`p-2 rounded-lg transition-colors ${
              bookmarked
                ? "text-amber-500 bg-amber-50"
                : "text-slate-400 hover:text-amber-500 hover:bg-slate-100"
            }`}
            title={bookmarked ? "Remove Bookmark" : "Bookmark Problem"}
          >
            {bookmarked ? <FaStar className="w-4 h-4" /> : <FaRegStar className="w-4 h-4" />}
          </button>

          {problem.leetcodeUrl && (
            <a
              href={problem.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Practice on LeetCode"
            >
              <FaExternalLinkAlt className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            onClick={() => onSelectProblem(problem)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <FaCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isSql ? "View Query" : "Solution"}</span>
            <FaChevronRight className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProblemCard;
