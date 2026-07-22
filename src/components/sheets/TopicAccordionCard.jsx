import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronDown,
  FaLayerGroup,
  FaFont,
  FaSearch,
  FaLink,
  FaDatabase,
  FaStream,
  FaTree,
  FaProjectDiagram,
  FaCoins,
  FaCogs,
  FaColumns,
  FaUndo,
  FaMemory,
  FaLock,
  FaObjectGroup,
  FaCalculator,
  FaSitemap,
  FaEye,
  FaChartLine,
  FaExchangeAlt,
  FaCubes
} from "react-icons/fa";
import ProblemCard from "./ProblemCard";
import { useSheetProgress } from "../../context/SheetProgressContext";

const ICON_MAP = {
  FaLayerGroup: FaLayerGroup,
  FaFont: FaFont,
  FaSearch: FaSearch,
  FaLink: FaLink,
  FaDatabase: FaDatabase,
  FaStream: FaStream,
  FaTree: FaTree,
  FaProjectDiagram: FaProjectDiagram,
  FaCoins: FaCoins,
  FaCogs: FaCogs,
  FaColumns: FaColumns,
  FaUndo: FaUndo,
  FaMemory: FaMemory,
  FaLock: FaLock,
  FaObjectGroup: FaObjectGroup,
  FaCalculator: FaCalculator,
  FaSitemap: FaSitemap,
  FaEye: FaEye,
  FaChartLine: FaChartLine,
  FaExchangeAlt: FaExchangeAlt,
  FaCubes: FaCubes
};

const TopicAccordionCard = ({ topic, onSelectProblem, isSql = false, defaultExpanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { isSolved } = useSheetProgress();

  const IconComponent = ICON_MAP[topic.icon] || FaLayerGroup;

  const totalProblems = topic.problems ? topic.problems.length : 0;
  const solvedCount = topic.problems
    ? topic.problems.filter((p) => isSolved(p.id)).length
    : 0;
  const progressPct = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow mb-5">
      {/* Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer bg-slate-50/70 hover:bg-slate-100/80 transition-colors border-b border-slate-100"
      >
        <div className="flex items-center space-x-3.5 flex-1 min-w-0 pr-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${topic.color || "from-indigo-500 to-purple-600"} text-white shadow-sm shrink-0`}>
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                {topic.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {solvedCount} / {totalProblems}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 line-clamp-1 mt-0.5">
              {topic.description}
            </p>
          </div>
        </div>

        {/* Right side: Progress Bar & Chevron */}
        <div className="flex items-center space-x-4 shrink-0">
          <div className="hidden md:flex flex-col items-end w-28 space-y-1">
            <span className="text-xs font-semibold text-slate-600">{progressPct}% Solved</span>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <FaChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </div>

      {/* Accordion Body */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="p-4 sm:p-5 bg-slate-50/30 space-y-3">
              {topic.problems && topic.problems.length > 0 ? (
                topic.problems.map((problem) => (
                  <ProblemCard
                    key={problem.id}
                    problem={problem}
                    onSelectProblem={onSelectProblem}
                    isSql={isSql}
                  />
                ))
              ) : (
                <div className="py-6 text-center text-slate-400 text-sm italic">
                  No matching problems in this topic.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopicAccordionCard;
