import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSheetProgress } from "../context/SheetProgressContext";
import { getProgressSummary, getStreak } from "../services/progressService";
import { PREP_MODULES, MOCK_TESTS } from "../data/mockQuestions";
import {
  FaCode, FaChartLine, FaNetworkWired, FaDatabase,
  FaUsers, FaFileAlt, FaArrowRight, FaClock, FaLock,
  FaCalculator, FaRobot, FaFire
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { motion } from "framer-motion";

const getIcon = (iconName) => {
  const cls = "h-5 w-5 text-indigo-600";
  switch (iconName) {
    case "code": return <FaCode className={cls} />;
    case "trending-up": return <FaChartLine className={cls} />;
    case "git-branch": return <FaNetworkWired className={cls} />;
    case "database": return <FaDatabase className={cls} />;
    case "users": return <FaUsers className={cls} />;
    case "document": return <FaFileAlt className={cls} />;
    case "calculator": return <FaCalculator className={cls} />;
    case "robot": return <FaRobot className={cls} />;
    default: return <FaCode className={cls} />;
  }
};

const statusColor = (status) => {
  switch (status) {
    case "Available": return "bg-green-50 text-green-700 border-green-100";
    case "In Progress": return "bg-amber-50 text-amber-700 border-amber-100";
    case "Completed": return "bg-slate-100 text-slate-600 border-slate-200";
    default: return "bg-gray-100 text-gray-600";
  }
};

/** Small skeleton shimmer used while backend data is loading */
const StatSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm animate-pulse">
    <div className="flex items-center justify-between">
      <div className="h-3 bg-slate-200 rounded w-24" />
      <div className="h-6 w-6 bg-slate-200 rounded-full" />
    </div>
    <div className="mt-3 h-8 bg-slate-200 rounded w-16" />
    <div className="mt-2 h-3 bg-slate-100 rounded w-20" />
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const { getInterviewStats } = useSheetProgress();
  const interviewStats = getInterviewStats();

  // ── Stage 5: Backend progress data ──────────────────────────
  const [progressSummary, setProgressSummary] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadBackendStats = async () => {
      const token = localStorage.getItem("prepforge_token");
      if (!token) {
        // Not authenticated: skip backend fetch, show zeros
        setStatsLoading(false);
        return;
      }

      setStatsLoading(true);
      try {
        const [summaryRes, streakRes] = await Promise.all([
          getProgressSummary(),
          getStreak()
        ]);

        if (isMounted) {
          if (summaryRes.success) setProgressSummary(summaryRes.summary);
          if (streakRes.success) setStreakData(streakRes.streak);
        }
      } catch (err) {
        console.error("Dashboard: failed to load backend stats", err);
      } finally {
        if (isMounted) setStatsLoading(false);
      }
    };

    loadBackendStats();
    return () => { isMounted = false; };
  }, []);

  // ── Derived display values ───────────────────────────────────
  const totalProblemsSolved = progressSummary
    ? progressSummary.totalSolved
    : 0;

  const overallPercentage = progressSummary
    ? progressSummary.overallPercentage
    : 0;

  const currentStreak = streakData ? streakData.current : 0;
  const longestStreak = streakData ? streakData.longest : 0;

  // Category breakdown for module progress bars (live from backend)
  const categoryMap = progressSummary?.categoryBreakdown || {};

  // Enrich PREP_MODULES with live backend percentages when available
  const enrichedModules = PREP_MODULES.map((mod) => {
    const categoryKey = mod.category?.toLowerCase();
    if (categoryKey && categoryMap[categoryKey]) {
      return {
        ...mod,
        completedPercentage: categoryMap[categoryKey].percentage,
        solvedCount: categoryMap[categoryKey].solved,
        totalCount: categoryMap[categoryKey].total
      };
    }
    return mod;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="bg-slate-50 min-h-full pb-16">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Welcome back, <span className="text-indigo-600">{user?.name?.split(" ")[0] || "Student"}</span> 👋
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Continue where you left off. Your preparation journey continues here.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Live streak badge from backend */}
              <div className="flex items-center space-x-2 bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl">
                <FaFire className="text-amber-500 h-4 w-4" />
                <div>
                  {statsLoading ? (
                    <div className="h-3 bg-amber-200 rounded w-16 animate-pulse" />
                  ) : (
                    <>
                      <p className="text-xs font-semibold text-amber-800">
                        {currentStreak > 0
                          ? `${currentStreak} Day Streak`
                          : longestStreak > 0
                            ? `Best: ${longestStreak} Days`
                            : "Start Your Streak!"}
                      </p>
                      <p className="text-[10px] text-amber-600">
                        {currentStreak > 0 ? "Keep it going!" : "Solve a problem today"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* AI Mock Interview Feature Spotlight Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden border border-indigo-100 shadow-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800" />
          <div className="relative px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold">
                <HiSparkles className="h-3.5 w-3.5" />
                <span>New Feature — AI Mock Interview</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Practice Real-Time Placement Interviews
              </h2>
              <p className="text-indigo-100 text-sm max-w-md">
                Simulate Technical and HR interview rounds with interactive evaluation, score breakdowns, and AI feedback.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                to="/ai-interview"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl shadow hover:bg-indigo-50 transition-all text-sm"
              >
                <FaRobot className="h-4 w-4" />
                <span>Start AI Interview</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Row — Live from Backend */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Your Progress</h2>
            {progressSummary && (
              <span className="text-xs text-gray-400 font-medium">
                Overall: <span className="font-bold text-indigo-600">{overallPercentage}%</span> complete
              </span>
            )}
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {statsLoading ? (
              [1, 2, 3, 4].map((n) => <StatSkeleton key={n} />)
            ) : (
              [
                {
                  label: "Problems Solved",
                  value: `${totalProblemsSolved}`,
                  icon: "🧩",
                  sub: `${overallPercentage}% overall`
                },
                {
                  label: "AI Interviews Done",
                  value: `${interviewStats.completed}`,
                  icon: "🤖",
                  sub: "completed"
                },
                {
                  label: "Current Streak",
                  value: currentStreak > 0 ? `${currentStreak}d` : "—",
                  icon: "🔥",
                  sub: longestStreak > 0 ? `Best: ${longestStreak} days` : "Start today!"
                },
                {
                  label: "Best AI Score",
                  value: interviewStats.completed > 0 ? `${interviewStats.bestScore}%` : "85%",
                  icon: "🏆",
                  sub: "top attempt"
                }
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                    <span className="text-xl">{stat.icon}</span>
                  </div>
                  <p className="mt-2 text-3xl font-extrabold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>

        {/* Category Breakdown (live from backend) */}
        {progressSummary && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-base font-bold text-gray-900 mb-5">Category Breakdown</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { key: "dsa", label: "DSA", emoji: "💻", color: "bg-indigo-500" },
                { key: "sql", label: "SQL", emoji: "🗄️", color: "bg-blue-500" },
                { key: "aptitude", label: "Aptitude", emoji: "🧮", color: "bg-amber-500" },
                { key: "core", label: "CS Fundamentals", emoji: "📚", color: "bg-emerald-500" }
              ].map(({ key, label, emoji, color }) => {
                const cat = categoryMap[key] || { solved: 0, total: 0, percentage: 0 };
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{emoji}</span>
                        <span className="text-sm font-semibold text-gray-700">{label}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-500">
                        {cat.solved}/{cat.total}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all duration-700`}
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 text-right">{cat.percentage}% complete</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Modules Grid */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Preparation Modules</h2>
            <Link to="/" className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1">
              Browse all <FaArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {enrichedModules.map((module) => (
              <motion.div
                key={module.id}
                variants={itemVariants}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 bg-indigo-50 rounded-xl">
                      {getIcon(module.icon)}
                    </div>
                    {module.popular && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full uppercase">
                        Popular
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{module.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{module.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-gray-500">
                      <span>Progress</span>
                      <span>{module.completedPercentage || 0}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${module.completedPercentage || 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <span className="text-xs text-gray-400 font-medium">
                      {module.solvedCount !== undefined
                        ? `${module.solvedCount}/${module.totalCount} solved`
                        : `${module.topicsCount} questions`}
                    </span>
                    <Link
                      to={module.path}
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      <span>Practice Now</span>
                      <FaArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mock Assessments Section */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Company Placement Mock Assessments</h2>
          </div>
          <div className="space-y-3">
            {MOCK_TESTS.map((test) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <FaClock className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{test.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {test.questionsCount} questions &bull; {test.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor(test.status)}`}>
                    {test.status}
                  </span>
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
                    <FaLock className="h-3 w-3" />
                    <span>Locked</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
