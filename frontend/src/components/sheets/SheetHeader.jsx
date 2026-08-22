import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaFire, FaBookmark, FaChartPie } from "react-icons/fa";

const SheetHeader = ({ title, subtitle, badgeText, totalProblems, solvedCount, bookmarkedCount }) => {
  const percentage = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 md:p-10 shadow-xl border border-indigo-800/40 mb-8">
      {/* Background Glow Decorations */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Heading & Info */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase backdrop-blur-md">
            <FaChartPie className="w-3.5 h-3.5 text-indigo-400" />
            <span>{badgeText}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center space-x-2 bg-slate-800/70 border border-slate-700/60 px-3 py-1.5 rounded-xl">
              <FaCheckCircle className="text-emerald-400 w-4 h-4" />
              <span>
                <strong className="text-white font-semibold">{solvedCount}</strong> / {totalProblems} Solved
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-800/70 border border-slate-700/60 px-3 py-1.5 rounded-xl">
              <FaBookmark className="text-amber-400 w-4 h-4" />
              <span>
                <strong className="text-white font-semibold">{bookmarkedCount}</strong> Bookmarked
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-800/70 border border-slate-700/60 px-3 py-1.5 rounded-xl">
              <FaFire className="text-orange-400 w-4 h-4" />
              <span>
                <strong className="text-white font-semibold">Active Streak: 5 Days</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Progress Radial / Card */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
          <div className="w-full max-w-xs bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 backdrop-blur-md text-center space-y-4">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300 uppercase tracking-wider">
              <span>Overall Completion</span>
              <span className="text-indigo-400 font-bold">{percentage}%</span>
            </div>

            {/* Progress Bar Container */}
            <div className="relative w-full h-3 bg-slate-700/80 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/50 text-center">
              <div>
                <span className="block text-xs text-slate-400">Total</span>
                <span className="text-base font-bold text-white">{totalProblems}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400">Solved</span>
                <span className="text-base font-bold text-emerald-400">{solvedCount}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400">Left</span>
                <span className="text-base font-bold text-indigo-300">{totalProblems - solvedCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SheetHeader;
