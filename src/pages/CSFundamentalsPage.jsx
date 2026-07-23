import React, { useState, useMemo } from "react";
import { CS_FUNDAMENTALS_CATEGORIES } from "../data/csFundamentalsData";
import { 
  FaDatabase, 
  FaNetworkWired, 
  FaCode, 
  FaSitemap, 
  FaExternalLinkAlt, 
  FaSearch, 
  FaCheckCircle, 
  FaBookOpen,
  FaQuestionCircle,
  FaCopy
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const getCategoryIcon = (iconName) => {
  switch (iconName) {
    case "FaDatabase": return <FaDatabase className="h-5 w-5" />;
    case "FaNetworkWired": return <FaNetworkWired className="h-5 w-5" />;
    case "FaCode": return <FaCode className="h-5 w-5" />;
    case "FaSitemap": return <FaSitemap className="h-5 w-5" />;
    default: return <FaBookOpen className="h-5 w-5" />;
  }
};

const CSFundamentalsPage = () => {
  const [activeCategory, setActiveCategory] = useState("dbms");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [masteredTopics, setMasteredTopics] = useState({});
  const [copiedSnippetId, setCopiedSnippetId] = useState(null);

  const currentCategoryObj = useMemo(() => {
    return CS_FUNDAMENTALS_CATEGORIES.find((cat) => cat.id === activeCategory) || CS_FUNDAMENTALS_CATEGORIES[0];
  }, [activeCategory]);

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return currentCategoryObj.topics;
    const query = searchQuery.toLowerCase();
    return currentCategoryObj.topics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(query) ||
        topic.summary.toLowerCase().includes(query) ||
        topic.keyConcepts.some((c) => c.toLowerCase().includes(query))
    );
  }, [currentCategoryObj, searchQuery]);

  const toggleMastered = (topicId) => {
    setMasteredTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const copyCode = (snippet, topicId) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetId(topicId);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-800 text-white rounded-3xl p-8 sm:p-10 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold text-indigo-200 mb-4">
            <FaBookOpen className="h-3.5 w-3.5" />
            <span>Placement Core Curriculum</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            CS Fundamentals Master Sheet
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
            Ace technical interviews with concise concept breakdowns, GeeksforGeeks deep-dive references, key interview Q&As, and architecture snippets across DBMS, Networks, OOPs, and System Design.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href={currentCategoryObj.gfgHubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all duration-200"
            >
              <span>Explore {currentCategoryObj.shortName} on GeeksforGeeks</span>
              <FaExternalLinkAlt className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {CS_FUNDAMENTALS_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSearchQuery("");
              }}
              className={`flex items-center space-x-3 p-4 rounded-2xl border text-left transition-all duration-200 shadow-sm ${
                isActive
                  ? "bg-white border-indigo-600 ring-2 ring-indigo-600/20 text-indigo-700 shadow-md"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70"
              }`}
            >
              <div className={`p-2.5 rounded-xl ${isActive ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-500"}`}>
                {getCategoryIcon(cat.icon)}
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight">{cat.shortName}</h3>
                <p className="text-xs text-slate-400 font-medium">{cat.topics.length} Core Topics</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <FaSearch className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${currentCategoryObj.shortName} topics, concepts, or keywords...`}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Topic Cards List */}
      <div className="space-y-6">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic) => {
            const isTopicMastered = masteredTopics[topic.id];
            const isExpanded = expandedTopic === topic.id;

            return (
              <motion.div
                key={topic.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
                  isTopicMastered ? "border-emerald-300 bg-emerald-50/20" : "border-slate-200"
                }`}
              >
                <div className="p-6">
                  {/* Topic Top Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => toggleMastered(topic.id)}
                        className={`mt-0.5 text-lg transition-colors ${
                          isTopicMastered ? "text-emerald-600" : "text-slate-300 hover:text-slate-400"
                        }`}
                        title={isTopicMastered ? "Mark as Unmastered" : "Mark as Mastered"}
                      >
                        <FaCheckCircle />
                      </button>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">{topic.title}</h2>
                        <p className="text-slate-600 text-sm mt-1">{topic.summary}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <a
                        href={topic.gfgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-colors"
                      >
                        <span>GFG Article</span>
                        <FaExternalLinkAlt className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  {/* Key Concepts Badges */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                      Key Takeaways & Concept Rules
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {topic.keyConcepts.map((concept, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                          <span>{concept}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Code / Architecture Snippet Box */}
                  {topic.codeSnippet && (
                    <div className="mt-4 bg-slate-900 text-slate-200 rounded-xl p-4 text-xs font-mono relative overflow-x-auto">
                      <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800 text-slate-400 font-sans text-xs">
                        <span>Code / Architecture Illustration</span>
                        <button
                          onClick={() => copyCode(topic.codeSnippet, topic.id)}
                          className="flex items-center space-x-1 hover:text-white transition-colors"
                        >
                          <FaCopy className="h-3 w-3" />
                          <span>{copiedSnippetId === topic.id ? "Copied!" : "Copy"}</span>
                        </button>
                      </div>
                      <pre className="text-emerald-400 font-mono text-xs whitespace-pre-wrap">{topic.codeSnippet}</pre>
                    </div>
                  )}

                  {/* Interview Q&As Toggle */}
                  {topic.interviewQAs && topic.interviewQAs.length > 0 && (
                    <div className="mt-4">
                      <button
                        onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                        className="inline-flex items-center space-x-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        <FaQuestionCircle className="h-3.5 w-3.5" />
                        <span>{isExpanded ? "Hide Interview Q&As" : `View Top Interview Q&As (${topic.interviewQAs.length})`}</span>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 space-y-3 pt-3 border-t border-slate-100"
                          >
                            {topic.interviewQAs.map((qa, qIdx) => (
                              <div key={qIdx} className="bg-indigo-50/50 border border-indigo-100 p-3.5 rounded-xl text-xs space-y-1.5">
                                <p className="font-bold text-indigo-900">Q: {qa.q}</p>
                                <p className="text-slate-700 leading-relaxed">A: {qa.a}</p>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <FaBookOpen className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No matching topics found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or select another CS category above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSFundamentalsPage;
