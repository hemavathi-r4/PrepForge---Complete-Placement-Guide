import React, { useState, useMemo } from "react";
import SheetHeader from "../components/sheets/SheetHeader";
import FilterBar from "../components/sheets/FilterBar";
import TopicAccordionCard from "../components/sheets/TopicAccordionCard";
import ProblemDetailModal from "../components/sheets/ProblemDetailModal";
import { SQL_TOPICS } from "../data/sqlSheetData";
import { useSheetProgress } from "../context/SheetProgressContext";

const SQLSheetPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [selectedProblem, setSelectedProblem] = useState(null);

  const { isSolved, isBookmarked } = useSheetProgress();

  // Extract total problem count and solved count for SQL
  const allSqlProblems = useMemo(() => {
    return SQL_TOPICS.flatMap((t) => t.problems || []);
  }, []);

  const totalProblems = allSqlProblems.length;
  const solvedCount = allSqlProblems.filter((p) => isSolved(p.id)).length;
  const bookmarkedCount = allSqlProblems.filter((p) => isBookmarked(p.id)).length;

  // Filter topics and problems based on search & filters
  const filteredTopics = useMemo(() => {
    return SQL_TOPICS.map((topic) => {
      const filteredProblems = (topic.problems || []).filter((problem) => {
        // Search Filter
        const matchesSearch =
          searchQuery === "" ||
          problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (problem.keyConcept && problem.keyConcept.toLowerCase().includes(searchQuery.toLowerCase())) ||
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
      return topic.problems.length > 0;
    });
  }, [searchQuery, difficulty, statusFilter, selectedCompany, isSolved, isBookmarked]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <SheetHeader
        title="SQL & Database Sheet"
        subtitle="Master 10 essential SQL topics ranging from basic queries to advanced CTEs, Window Functions, and Database Normalization."
        badgeText="Database Mastery Track"
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
        companiesList={["Amazon", "Google", "Meta", "Microsoft", "Oracle", "Goldman Sachs", "Uber"]}
      />

      {/* Topic Cards List */}
      <div className="space-y-4">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic) => (
            <TopicAccordionCard
              key={topic.id}
              topic={topic}
              onSelectProblem={(prob) => setSelectedProblem(prob)}
              isSql={true}
              defaultExpanded={true}
            />
          ))
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
            <div className="text-4xl">💾</div>
            <h3 className="text-lg font-bold text-slate-800">No matching SQL challenges found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Try adjusting your search query or filter settings to view SQL queries and topics.
            </p>
          </div>
        )}
      </div>

      {/* Problem Detail Modal */}
      {selectedProblem && (
        <ProblemDetailModal
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
          isSql={true}
        />
      )}
    </div>
  );
};

export default SQLSheetPage;
