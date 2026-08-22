import React from "react";
import { FaSearch, FaTimes, FaFilter, FaBuilding } from "react-icons/fa";

const FilterBar = ({
  searchQuery,
  setSearchQuery,
  difficulty,
  setDifficulty,
  statusFilter,
  setStatusFilter,
  selectedCompany,
  setSelectedCompany,
  companiesList = ["Google", "Amazon", "Meta", "Microsoft", "Uber", "Apple"]
}) => {
  const isFiltered = searchQuery !== "" || difficulty !== "All" || statusFilter !== "All" || selectedCompany !== "All";

  const handleReset = () => {
    setSearchQuery("");
    setDifficulty("All");
    setStatusFilter("All");
    setSelectedCompany("All");
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FaSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems, topics, algorithms..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <FaTimes className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Difficulty Filter */}
        <div className="md:col-span-4 flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {["All", "Easy", "Medium", "Hard"].map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                difficulty === diff
                  ? diff === "Easy"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : diff === "Medium"
                    ? "bg-amber-500 text-white shadow-sm"
                    : diff === "Hard"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Company Dropdown & Status */}
        <div className="md:col-span-3 flex items-center space-x-2">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <FaBuilding className="w-3.5 h-3.5" />
            </div>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
            >
              <option value="All">All Companies</option>
              {companiesList.map((comp) => (
                <option key={comp} value={comp}>
                  {comp}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Secondary Row: Status tabs & reset button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="text-slate-500 font-medium flex items-center space-x-1 mr-2">
            <FaFilter className="w-3 h-3 text-slate-400" />
            <span>Status:</span>
          </span>
          {[
            { label: "All Problems", val: "All" },
            { label: "Solved", val: "Solved" },
            { label: "Unsolved", val: "Unsolved" },
            { label: "Bookmarked", val: "Bookmarked" }
          ].map((st) => (
            <button
              key={st.val}
              onClick={() => setStatusFilter(st.val)}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                statusFilter === st.val
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {isFiltered && (
          <button
            onClick={handleReset}
            className="flex items-center space-x-1 text-slate-500 hover:text-red-600 font-medium transition-colors"
          >
            <FaTimes className="w-3 h-3" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
