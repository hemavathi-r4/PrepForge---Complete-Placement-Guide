import React, { useState, useEffect, useMemo } from "react";
import { APTITUDE_CATEGORIES, APTITUDE_QUESTIONS as LOCAL_APTITUDE_QUESTIONS } from "../data/aptitudeQuestions";
import { fetchQuestions } from "../services/questionService";
import { useSheetProgress } from "../context/SheetProgressContext";
import {
  FaCalculator,
  FaBrain,
  FaBookOpen,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaLightbulb
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const getCategoryIcon = (icon) => {
  const cls = "h-6 w-6 text-indigo-600";
  switch (icon) {
    case "calculator": return <FaCalculator className={cls} />;
    case "brain": return <FaBrain className={cls} />;
    case "book": return <FaBookOpen className={cls} />;
    default: return <FaCalculator className={cls} />;
  }
};

const AptitudePage = () => {
  const { toggleAptitudeSolved, isAptitudeSolved } = useSheetProgress();

  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTopic, setActiveTopic] = useState("all");

  const [aptitudeQuestions, setAptitudeQuestions] = useState(LOCAL_APTITUDE_QUESTIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Practice state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const loadBackendQuestions = async () => {
    setLoading(true);
    setError(null);
    const res = await fetchQuestions({ category: "APTITUDE", limit: 1000 });

    if (res.success && res.questions && res.questions.length > 0) {
      const formattedQuestions = res.questions.map((q) => ({
        id: q.customId || q._id,
        category: q.aptitudeCategory || "quantitative",
        topic: q.topic || "General Aptitude",
        question: q.statement || q.title,
        options: q.options || [],
        correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
        explanation: q.explanation || "",
        difficulty: q.difficulty || "Medium"
      }));
      setAptitudeQuestions(formattedQuestions);
    } else if (!res.success) {
      setError(res.error || "Failed to load aptitude questions from server.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBackendQuestions();
  }, []);

  // Filter questions based on category & topic
  const filteredQuestions = useMemo(() => {
    return aptitudeQuestions.filter((q) => {
      const matchCat = activeCategory === "all" || q.category === activeCategory;
      const matchTopic = activeTopic === "all" || q.topic === activeTopic;
      return matchCat && matchTopic;
    });
  }, [aptitudeQuestions, activeCategory, activeTopic]);

  const currentQuestion = filteredQuestions[currentQuestionIndex] || filteredQuestions[0];

  // Compute category progress stats
  const getCategoryProgress = (categoryId) => {
    const catQuestions = aptitudeQuestions.filter((q) => q.category === categoryId);
    if (catQuestions.length === 0) return 0;
    const solvedCount = catQuestions.filter((q) => isAptitudeSolved(q.id)).length;
    return Math.round((solvedCount / catQuestions.length) * 100);
  };

  const handleSelectOption = (idx) => {
    if (!isSubmitted) {
      setSelectedOption(idx);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption !== null && !isSubmitted && currentQuestion) {
      setIsSubmitted(true);
      if (selectedOption === currentQuestion.correctAnswer) {
        if (!isAptitudeSolved(currentQuestion.id)) {
          toggleAptitudeSolved(currentQuestion.id);
        }
      }
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setCurrentQuestionIndex(0);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Header Banner */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-xs font-semibold text-indigo-700">
              <FaCalculator className="h-3.5 w-3.5" />
              <span>Aptitude & Reasoning Mastery</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Aptitude Preparation
            </h1>
            <p className="text-base text-gray-500 max-w-2xl leading-relaxed">
              Build the speed, accuracy and reasoning skills required for placement assessments.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* ── Category Cards Row ───────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {APTITUDE_CATEGORIES.map((cat) => {
            const prog = getCategoryProgress(cat.id);
            return (
              <motion.div
                key={cat.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-indigo-50 rounded-xl">
                      {getCategoryIcon(cat.icon)}
                    </div>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                      {cat.topicsCount} Topics
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{cat.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{cat.description}</p>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-semibold text-gray-500">
                      <span>{cat.totalQuestions} Questions</span>
                      <span>Progress: {prog}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${prog}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-5">
                  <button
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setActiveTopic("all");
                      setCurrentQuestionIndex(0);
                      setSelectedOption(null);
                      setIsSubmitted(false);
                    }}
                    className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      activeCategory === cat.id
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                    }`}
                  >
                    <span>Practice Now</span>
                    <FaArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Filter Tabs & Practice Section ────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Category:</span>
            <button
              onClick={() => {
                setActiveCategory("all");
                setActiveTopic("all");
                setCurrentQuestionIndex(0);
                setSelectedOption(null);
                setIsSubmitted(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === "all"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Categories
            </button>
            {APTITUDE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveTopic("all");
                  setCurrentQuestionIndex(0);
                  setSelectedOption(null);
                  setIsSubmitted(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === cat.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="p-8 text-center animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 rounded w-1/3 mx-auto"></div>
              <div className="h-16 bg-slate-100 rounded w-full"></div>
              <div className="h-12 bg-slate-100 rounded w-full"></div>
            </div>
          ) : error ? (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-3 shadow-sm">
              <div className="text-3xl">⚠️</div>
              <h3 className="text-lg font-bold text-rose-800">Connection Error</h3>
              <p className="text-sm text-rose-600 max-w-md mx-auto">{error}</p>
              <button
                onClick={loadBackendQuestions}
                className="mt-2 inline-flex items-center px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm rounded-xl transition-all shadow"
              >
                Retry Loading
              </button>
            </div>
          ) : filteredQuestions.length > 0 && currentQuestion ? (
            /* Practice Question Card */
            <div className="space-y-6">
              
              {/* Question Header Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-md border border-indigo-100">
                    Question {currentQuestionIndex + 1} of {filteredQuestions.length}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">
                    Topic: <span className="text-gray-900 font-bold">{currentQuestion.topic}</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    currentQuestion.difficulty === "Easy" ? "bg-green-50 text-green-700" :
                    currentQuestion.difficulty === "Medium" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>

                {/* Question solved indicator */}
                {isAptitudeSolved(currentQuestion.id) && (
                  <span className="inline-flex items-center space-x-1 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                    <FaCheckCircle className="h-3.5 w-3.5" />
                    <span>Solved</span>
                  </span>
                )}
              </div>

              {/* Question Progress Bar */}
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text Box */}
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl">
                <h4 className="text-base sm:text-lg font-bold text-gray-900 leading-relaxed">
                  {currentQuestion.question}
                </h4>
              </div>

              {/* Multiple-Choice Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((opt, idx) => {
                  let optStyle = "bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/30";
                  
                  if (selectedOption === idx) {
                    optStyle = "bg-indigo-50 border-indigo-600 text-indigo-900 font-bold shadow-sm";
                  }

                  if (isSubmitted) {
                    if (idx === currentQuestion.correctAnswer) {
                      optStyle = "bg-green-50 border-green-500 text-green-900 font-bold";
                    } else if (selectedOption === idx && idx !== currentQuestion.correctAnswer) {
                      optStyle = "bg-red-50 border-red-500 text-red-900 font-bold";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-4 rounded-xl border transition-all text-sm flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && idx === currentQuestion.correctAnswer && (
                        <FaCheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {isSubmitted && selectedOption === idx && idx !== currentQuestion.correctAnswer && (
                        <FaTimesCircle className="h-4 w-4 text-red-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons & Feedback */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
                {!isSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      selectedOption !== null
                        ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    {selectedOption === currentQuestion.correctAnswer ? (
                      <span className="inline-flex items-center space-x-1.5 text-sm font-bold text-green-700 bg-green-50 border border-green-200 px-4 py-2 rounded-xl">
                        <FaCheckCircle className="h-4 w-4 text-green-600" />
                        <span>Correct Answer!</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 text-sm font-bold text-red-700 bg-red-50 border border-red-200 px-4 py-2 rounded-xl">
                        <FaTimesCircle className="h-4 w-4 text-red-600" />
                        <span>Incorrect</span>
                      </span>
                    )}
                  </div>
                )}

                {isSubmitted && (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all"
                  >
                    <span>Next Question</span>
                    <FaArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Explanation Card */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-5 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-2"
                  >
                    <div className="flex items-center space-x-2 text-indigo-900 font-bold text-sm">
                      <FaLightbulb className="h-4 w-4 text-amber-500" />
                      <span>Step-by-Step Explanation:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-indigo-950 leading-relaxed whitespace-pre-line font-medium">
                      {currentQuestion.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 space-y-2">
              <p className="text-sm font-medium">No questions found matching your filter criteria.</p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setActiveTopic("all");
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default AptitudePage;
