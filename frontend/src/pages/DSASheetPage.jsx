import React, { useState, useEffect, useMemo } from "react";
import SheetHeader from "../components/sheets/SheetHeader";
import FilterBar from "../components/sheets/FilterBar";
import TopicAccordionCard from "../components/sheets/TopicAccordionCard";
import ProblemDetailModal from "../components/sheets/ProblemDetailModal";
import { DSA_TOPICS as LOCAL_DSA_TOPICS } from "../data/dsaSheetData";
import { fetchQuestions } from "../services/questionService";
import { useSheetProgress } from "../context/SheetProgressContext";

const DSASheetPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [selectedProblem, setSelectedProblem] = useState(null);

  const [dsaTopics, setDsaTopics] = useState(LOCAL_DSA_TOPICS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isSolved, isBookmarked } = useSheetProgress();

  const loadBackendQuestions = async () => {
    setLoading(true);
    setError(null);
    const res = await fetchQuestions({ category: "DSA", limit: 1000 });

    if (res.success && res.questions && res.questions.length > 0) {
      // Map API questions into structured topic groups
      const topicMap = new Map();

      // Initialize with template metadata from local static topics if matching
      LOCAL_DSA_TOPICS.forEach((t) => {
        topicMap.set(t.name.toLowerCase(), {
          ...t,
          problems: []
        });
      });

      res.questions.forEach((q) => {
        const normalizedTopic = (q.topic || "Arrays").toLowerCase();
        const formattedProb = {
          id: q.customId || q._id,
          title: q.title,
          difficulty: q.difficulty || "Medium",
          companies: (q.companySlugs && q.companySlugs.length > 0)
            ? q.companySlugs.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            : (q.companies || []).map((c) => (typeof c === "object" ? c.name : c)),
          leetcodeUrl: q.externalLinks?.leetcode || "",
          gfgUrl: q.externalLinks?.gfg || "",
          statement: q.statement || "",
          approach: q.approach || "",
          complexity: q.complexity || { time: "", space: "" },
          code: q.code || { cpp: "", python: "" }
        };

        if (topicMap.has(normalizedTopic)) {
          topicMap.get(normalizedTopic).problems.push(formattedProb);
        } else {
          // Dynamic new topic
          topicMap.set(normalizedTopic, {
            id: `topic-${normalizedTopic}`,
            name: q.topic || "General DSA",
            icon: "FaLayerGroup",
            description: `Curated ${q.topic} problems.`,
            difficultySummary: "Beginner to Advanced",
            color: "from-blue-500 to-indigo-600",
            bgColor: "bg-blue-50 border-blue-200 text-blue-700",
            problems: [formattedProb]
          });
        }
      });

      const structuredTopics = Array.from(topicMap.values()).filter(
        (t) => t.problems.length > 0
      );
      setDsaTopics(structuredTopics);
    } else if (!res.success) {
      setError(res.error || "Failed to load DSA questions from server.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBackendQuestions();
  }, []);

  // Extract total problem count and solved count for DSA
  const allDsaProblems = useMemo(() => {
    return dsaTopics.flatMap((t) => t.problems || []);
  }, [dsaTopics]);

  const totalProblems = allDsaProblems.length;
  const solvedCount = allDsaProblems.filter((p) => isSolved(p.id)).length;
  const bookmarkedCount = allDsaProblems.filter((p) => isBookmarked(p.id)).length;

  // Filter topics and problems based on search & filters
  const filteredTopics = useMemo(() => {
    return dsaTopics
      .map((topic) => {
        const filteredProblems = (topic.problems || []).filter((problem) => {
          // Search Filter
          const matchesSearch =
            searchQuery === "" ||
            problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (problem.companies &&
              problem.companies.some((c) =>
                c.toLowerCase().includes(searchQuery.toLowerCase())
              ));

          // Difficulty Filter
          const matchesDifficulty =
            difficulty === "All" || problem.difficulty === difficulty;

          // Status Filter
          let matchesStatus = true;
          if (statusFilter === "Solved") matchesStatus = isSolved(problem.id);
          if (statusFilter === "Unsolved") matchesStatus = !isSolved(problem.id);
          if (statusFilter === "Bookmarked") matchesStatus = isBookmarked(problem.id);

          // Company Filter
          const matchesCompany =
            selectedCompany === "All" ||
            (problem.companies &&
              problem.companies.some(
                (c) => c.toLowerCase() === selectedCompany.toLowerCase()
              ));

          return (
            matchesSearch && matchesDifficulty && matchesStatus && matchesCompany
          );
        });

        return {
          ...topic,
          problems: filteredProblems
        };
      })
      .filter((topic) => topic.problems.length > 0);
  }, [
    dsaTopics,
    searchQuery,
    difficulty,
    statusFilter,
    selectedCompany,
    isSolved,
    isBookmarked
  ]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <SheetHeader
        title="DSA Master Roadmap"
        subtitle="Master core Data Structures & Algorithms topics with curated problems, optimal code solutions, and interview pattern breakdowns."
        badgeText="Structured Learning Track"
        totalProblems={totalProblems}
        solvedCount={solvedCount}
        bookmarkedCount={bookmarkedCount}
      />

      {/* Filter Controls */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        companiesList={[
          "Google",
          "Amazon",
          "Meta",
          "Microsoft",
          "Uber",
          "Apple",
          "Bloomberg"
        ]}
      />

      {/* Loading Skeleton State */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-pulse space-y-3"
            >
              <div className="h-6 bg-slate-200 rounded w-1/3"></div>
              <div className="h-4 bg-slate-100 rounded w-2/3"></div>
              <div className="h-10 bg-slate-100 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error State with Retry */
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-3 shadow-sm my-6">
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
      ) : (
        /* Topic Cards List */
        <div className="space-y-4">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => (
              <TopicAccordionCard
                key={topic.id}
                topic={topic}
                onSelectProblem={(prob) => setSelectedProblem(prob)}
                isSql={false}
                defaultExpanded={true}
              />
            ))
          ) : (
            /* Empty State */
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
              <div className="text-4xl">🔍</div>
              <h3 className="text-lg font-bold text-slate-800">
                No matching DSA problems found
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Try adjusting your search query, difficulty filters, or company selections to see more problems.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Problem Detail Modal */}
      {selectedProblem && (
        <ProblemDetailModal
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
          isSql={false}
        />
      )}
    </div>
  );
};

export default DSASheetPage;
