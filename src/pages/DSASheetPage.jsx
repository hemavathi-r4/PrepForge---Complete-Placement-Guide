import React, { useState, useMemo } from "react";
import SheetHeader from "../components/sheets/SheetHeader";
import FilterBar from "../components/sheets/FilterBar";
import TopicAccordionCard from "../components/sheets/TopicAccordionCard";
import ProblemDetailModal from "../components/sheets/ProblemDetailModal";
import { DSA_TOPICS } from "../data/dsaSheetData";
import { useSheetProgress } from "../context/SheetProgressContext";

const DSASheetPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [selectedProblem, setSelectedProblem] = useState(null);

  const { isSolved, isBookmarked } = useSheetProgress();

  // Extract total problem count and solved count for DSA
  const allDsaProblems = useMemo(() => {
    return DSA_TOPICS.flatMap((t) => t.problems || []);
  }, []);

  const totalProblems = allDsaProblems.length;
  const solvedCount = allDsaProblems.filter((p) => isSolved(p.id)).length;
  const bookmarkedCount = allDsaProblems.filter((p) => isBookmarked(p.id)).length;

  // Filter topics and problems based on search & filters
  const filteredTopics = useMemo(() => {
    return DSA_TOPICS.map((topic) => {
      const filteredProblems = (topic.problems || []).filter((problem) => {
        // Search Filter
        const matchesSearch =
          searchQuery === "" ||
          problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (problem.companies &&
            problem.companies.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())));

        // Difficulty Filter
        const matchesDifficulty = difficulty === "All" || problem.difficulty === difficulty;

        // Status Filter
        let matchesStatus = true;
        if (statusFilter === "Solved") matchesStatus = isSolved(problem.id);
        if (statusFilter === "Unsolved") matchesStatus = !isSolved(problem.id);
        if (statusFilter === "Bookmarked") matchesStatus = isBookmarked(problem.id);

        // Company Filter
        const matchesCompany =
          selectedCompany === "All" ||
          (problem.companies && problem.companies.includes(selectedCompany));

        return matchesSearch && matchesDifficulty && matchesStatus && matchesCompany;
      });

      return {
        ...topic,
        problems: filteredProblems
      };
    }).filter((topic) => {
      // Keep topic if it has matching problems, or if search is empty and no restrictive filters active
      return topic.problems.length > 0;
    });
  }, [searchQuery, difficulty, statusFilter, selectedCompany, isSolved, isBookmarked]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <SheetHeader
        title="DSA Master Roadmap"
        subtitle="Master 13 core Data Structures & Algorithms topics with curated problems, optimal code solutions, and interview pattern breakdowns."
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
        companiesList={["Google", "Amazon", "Meta", "Microsoft", "Uber", "Apple", "Bloomberg"]}
      />

      {/* Topic Cards List */}
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
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
            <div className="text-4xl">🔍</div>
            <h3 className="text-lg font-bold text-slate-800">No matching DSA problems found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Try adjusting your search query, difficulty filters, or company selections to see more problems.
            </p>
          </div>
        )}
      </div>

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
