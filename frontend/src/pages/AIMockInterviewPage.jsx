import React, { useState, useEffect } from "react";
import { INTERVIEW_MODES, INTERVIEW_QUESTIONS, evaluateInterview } from "../data/interviewQuestions";
import { useSheetProgress } from "../context/SheetProgressContext";
import { useAuth } from "../context/AuthContext";
import {
  FaRobot,
  FaUserTie,
  FaAward,
  FaCode,
  FaClock,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRedo,
  FaSignOutAlt,
  FaChartBar,
  FaSlidersH
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const getModeIcon = (icon) => {
  const cls = "h-6 w-6 text-indigo-600";
  switch (icon) {
    case "code": return <FaCode className={cls} />;
    case "user-check": return <FaUserTie className={cls} />;
    case "award": return <FaAward className={cls} />;
    default: return <FaRobot className={cls} />;
  }
};

const AIMockInterviewPage = () => {
  const { user } = useAuth();
  const { saveInterviewResult } = useSheetProgress();

  // Workflow steps: 'landing' | 'setup' | 'interview' | 'report'
  const [step, setStep] = useState("landing");
  const [selectedMode, setSelectedMode] = useState("technical");

  // Setup Form state
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [experienceLevel, setExperienceLevel] = useState("Fresher / 0-1 Year");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionsCount, setQuestionsCount] = useState(5);

  // Active Interview state
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [timerSeconds, setTimerSeconds] = useState(1200); // 20 mins default

  // Generated Report state
  const [report, setReport] = useState(null);

  // Live Timer countdown effect
  useEffect(() => {
    let interval = null;
    if (step === "interview" && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timerSeconds]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartSetup = (modeId) => {
    setSelectedMode(modeId);
    setStep("setup");
  };

  const handleLaunchInterview = () => {
    const questionsList = INTERVIEW_QUESTIONS[selectedMode] || INTERVIEW_QUESTIONS.technical;
    const selectedList = questionsList.slice(0, questionsCount);
    setActiveQuestions(selectedList);
    setCurrentQIndex(0);
    setUserAnswers({});
    setCurrentAnswer("");
    setTimerSeconds(selectedMode === "hr" ? 900 : selectedMode === "full" ? 1800 : 1200);
    setStep("interview");
  };

  const handleSubmitQuestionAnswer = () => {
    const qId = activeQuestions[currentQIndex].id;
    const updatedAnswers = {
      ...userAnswers,
      [qId]: currentAnswer
    };
    setUserAnswers(updatedAnswers);

    if (currentQIndex < activeQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setCurrentAnswer(updatedAnswers[activeQuestions[currentQIndex + 1]?.id] || "");
    } else {
      // Complete Interview & generate report
      const evaluatedReport = evaluateInterview({
        mode: selectedMode,
        role: targetRole,
        answers: updatedAnswers
      });
      setReport(evaluatedReport);
      saveInterviewResult({
        role: targetRole,
        mode: selectedMode === "technical" ? "Technical Interview" : selectedMode === "hr" ? "HR Interview" : "Full Mock Interview",
        overallScore: evaluatedReport.overallScore,
        date: evaluatedReport.date
      });
      setStep("report");
    }
  };

  const handleExitInterview = () => {
    if (window.confirm("Are you sure you want to exit the interview session? Progress will be lost.")) {
      setStep("landing");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* ── STEP 1: LANDING MODE SELECTION ────────────────────────── */}
      {step === "landing" && (
        <div>
          {/* Header Banner */}
          <div className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-xs font-semibold text-indigo-700">
                  <FaRobot className="h-3.5 w-3.5" />
                  <span>AI Powered Interview Coach</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                  AI Mock Interview
                </h1>
                <p className="text-base text-gray-500 max-w-2xl leading-relaxed">
                  Practice real-time technical and behavioral mock interviews with instant AI performance feedback.
                </p>
              </motion.div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {INTERVIEW_MODES.map((mode) => (
                <motion.div
                  key={mode.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-indigo-50 rounded-xl">
                        {getModeIcon(mode.icon)}
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {mode.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{mode.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{mode.description}</p>
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-semibold text-gray-400">
                      <FaClock className="h-3.5 w-3.5 text-gray-400" />
                      <span>{mode.duration}</span>
                    </div>

                    {/* Topics covered pill list */}
                    <div className="space-y-1.5 pt-2">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Topics Covered:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {mode.topics.map((t) => (
                          <span key={t} className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-50">
                    <button
                      onClick={() => handleStartSetup(mode.id)}
                      className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all"
                    >
                      <span>Start Interview</span>
                      <FaArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: SETUP SCREEN ──────────────────────────────────── */}
      {step === "setup" && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                  <FaSlidersH className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">Configure Your Interview</h2>
                  <p className="text-xs text-gray-500">Customize parameters for a realistic assessment experience</p>
                </div>
              </div>
              <button
                onClick={() => setStep("landing")}
                className="text-xs font-semibold text-gray-400 hover:text-gray-600"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Interview Type Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Interview Type</label>
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:border-indigo-600"
                >
                  <option value="technical">Technical Interview</option>
                  <option value="hr">HR / Behavioral Interview</option>
                  <option value="full">Full Mock Interview</option>
                </select>
              </div>

              {/* Target Role Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Target Role</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:border-indigo-600"
                >
                  <option value="Software Engineer">Software Engineer (SDE-1)</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Data Engineer">Data Engineer</option>
                </select>
              </div>

              {/* Experience Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:border-indigo-600"
                >
                  <option value="Fresher / 0-1 Year">Fresher / 0-1 Year</option>
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="3+ Years">3+ Years</option>
                </select>
              </div>

              {/* Difficulty */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Preferred Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:border-indigo-600"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Questions count */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Number of Questions</label>
              <div className="flex gap-3">
                {[5, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setQuestionsCount(num)}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                      questionsCount === num
                        ? "bg-indigo-50 border-indigo-600 text-indigo-700"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {num} Questions
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-3">
              <button
                onClick={handleLaunchInterview}
                className="flex items-center justify-center space-x-2 px-8 py-3 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-all"
              >
                <span>Start Interview</span>
                <FaArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── STEP 3: INTERVIEW LIVE SCREEN ────────────────────────── */}
      {step === "interview" && activeQuestions.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          {/* Top Status Header */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                <FaRobot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  AI {selectedMode === "technical" ? "Technical" : selectedMode === "hr" ? "HR" : "Full Mock"} Interview
                </h3>
                <p className="text-xs text-gray-400">Target Role: {targetRole}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-700">
                <FaClock className="h-3.5 w-3.5 text-slate-500" />
                <span>{formatTimer(timerSeconds)}</span>
              </div>
              <button
                onClick={handleExitInterview}
                className="flex items-center space-x-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <FaSignOutAlt className="h-3.5 w-3.5" />
                <span>Exit</span>
              </button>
            </div>
          </div>

          {/* Question Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-gray-500">
              <span>Question {currentQIndex + 1} of {activeQuestions.length}</span>
              <span>{Math.round(((currentQIndex + 1) / activeQuestions.length) * 100)}% Completed</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentQIndex + 1) / activeQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* AI Interviewer Speech Bubble Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-sm flex-shrink-0">
                <FaRobot className="h-6 w-6" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">AI Interviewer</span>
                  <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                    {activeQuestions[currentQIndex].topic}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <p className="text-base sm:text-lg font-bold text-gray-900 leading-relaxed">
                    "{activeQuestions[currentQIndex].question}"
                  </p>
                </div>
              </div>
            </div>

            {/* Candidate Answer Textarea */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Your Answer:</label>
              <textarea
                rows={6}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your response here... Be thorough and clear in your technical/behavioral reasoning."
                className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 leading-relaxed resize-y"
              />
            </div>

            {/* Next / Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSubmitQuestionAnswer}
                className="flex items-center justify-center space-x-2 px-8 py-3 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all"
              >
                <span>{currentQIndex < activeQuestions.length - 1 ? "Submit & Next Question" : "Finish Interview"}</span>
                <FaArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ── STEP 4: POST-INTERVIEW REPORT CARD ────────────────────── */}
      {step === "report" && report && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8">
            
            {/* Header Banner */}
            <div className="text-center space-y-3 pb-6 border-b border-gray-100">
              <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-100 px-4 py-1.5 rounded-full text-xs font-bold text-green-700">
                <FaCheckCircle className="h-4 w-4" />
                <span>Interview Complete 🎉</span>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                AI Assessment Report
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Evaluated for <span className="font-bold text-gray-800">{targetRole}</span> &bull; {report.date}
              </p>
            </div>

            {/* Score Highlights Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              
              {/* Overall Score Circle */}
              <div className="sm:col-span-4 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Overall Score</p>
                <div className="text-5xl font-extrabold text-indigo-600">
                  {report.overallScore}%
                </div>
                <span className="inline-block text-[11px] font-semibold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">
                  Placement Ready
                </span>
              </div>

              {/* Sub-Score Breakdown Bars */}
              <div className="sm:col-span-8 space-y-3">
                {[
                  { label: "Technical Knowledge", val: report.techScore },
                  { label: "Communication", val: report.commScore },
                  { label: "Clarity", val: report.clarityScore },
                  { label: "Confidence", val: report.confScore }
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-gray-600">
                      <span>{item.label}</span>
                      <span className="font-bold text-gray-900">{item.val}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${item.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Strengths & Improvements Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              
              {/* Strengths */}
              <div className="p-5 bg-green-50/40 border border-green-100 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-green-900 flex items-center space-x-2">
                  <FaCheckCircle className="h-4 w-4 text-green-600" />
                  <span>Key Strengths</span>
                </h4>
                <ul className="space-y-2 text-xs text-green-950 font-medium">
                  {report.strengths.map((s, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas to Improve */}
              <div className="p-5 bg-amber-50/40 border border-amber-100 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-amber-900 flex items-center space-x-2">
                  <FaExclamationTriangle className="h-4 w-4 text-amber-600" />
                  <span>Areas to Improve</span>
                </h4>
                <ul className="space-y-2 text-xs text-amber-950 font-medium">
                  {report.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Detailed AI Feedback Box */}
            <div className="p-6 bg-indigo-50/60 border border-indigo-100 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-indigo-900 font-bold text-sm">
                <FaRobot className="h-4 w-4 text-indigo-600" />
                <span>AI Interviewer Summary:</span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-950 leading-relaxed font-medium">
                "{report.aiFeedback}"
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => setStep("setup")}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all"
              >
                <FaRedo className="h-3.5 w-3.5" />
                <span>Retake Interview</span>
              </button>
              <button
                onClick={() => setStep("landing")}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
              >
                <span>Back to AI Interviews</span>
              </button>
            </div>

          </motion.div>

        </div>
      )}

    </div>
  );
};

export default AIMockInterviewPage;
