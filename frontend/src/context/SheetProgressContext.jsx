import React, { createContext, useContext, useState, useEffect } from "react";

const SheetProgressContext = createContext();

export const SheetProgressProvider = ({ children }) => {
  // Existing DSA & SQL solved state
  const [solvedIds, setSolvedIds] = useState(() => {
    try {
      const saved = localStorage.getItem("prepforge_solved_ids");
      return saved ? JSON.parse(saved) : ["dsa-arr-1", "dsa-str-1", "sql-b-1"];
    } catch {
      return ["dsa-arr-1", "dsa-str-1", "sql-b-1"];
    }
  });

  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem("prepforge_bookmarked_ids");
      return saved ? JSON.parse(saved) : ["dsa-arr-4", "sql-wf-1"];
    } catch {
      return ["dsa-arr-4", "sql-wf-1"];
    }
  });

  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("prepforge_problem_notes");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Aptitude solved state
  const [solvedAptitudeIds, setSolvedAptitudeIds] = useState(() => {
    try {
      const saved = localStorage.getItem("prepforge_solved_aptitude_ids");
      return saved ? JSON.parse(saved) : ["apt-quant-1", "apt-logic-1"];
    } catch {
      return ["apt-quant-1", "apt-logic-1"];
    }
  });

  // AI Mock Interview history state
  const [interviewHistory, setInterviewHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("prepforge_interview_history");
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: "int-1",
              role: "Software Engineer",
              mode: "Technical Interview",
              overallScore: 78,
              date: "Aug 18, 2026"
            }
          ];
    } catch {
      return [];
    }
  });

  // Persistent storage synchronizers
  useEffect(() => {
    try {
      localStorage.setItem("prepforge_solved_ids", JSON.stringify(solvedIds));
    } catch (e) {
      console.error("Failed saving solved state", e);
    }
  }, [solvedIds]);

  useEffect(() => {
    try {
      localStorage.setItem("prepforge_bookmarked_ids", JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error("Failed saving bookmarked state", e);
    }
  }, [bookmarkedIds]);

  useEffect(() => {
    try {
      localStorage.setItem("prepforge_problem_notes", JSON.stringify(notes));
    } catch (e) {
      console.error("Failed saving notes state", e);
    }
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem("prepforge_solved_aptitude_ids", JSON.stringify(solvedAptitudeIds));
    } catch (e) {
      console.error("Failed saving aptitude solved state", e);
    }
  }, [solvedAptitudeIds]);

  useEffect(() => {
    try {
      localStorage.setItem("prepforge_interview_history", JSON.stringify(interviewHistory));
    } catch (e) {
      console.error("Failed saving interview history state", e);
    }
  }, [interviewHistory]);

  // Actions
  const toggleSolved = (id) => {
    setSolvedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleBookmark = (id) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const saveNote = (id, noteText) => {
    setNotes((prev) => ({
      ...prev,
      [id]: noteText
    }));
  };

  const toggleAptitudeSolved = (id) => {
    setSolvedAptitudeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const saveInterviewResult = (reportData) => {
    const newRecord = {
      id: `int_${Date.now()}`,
      ...reportData
    };
    setInterviewHistory((prev) => [newRecord, ...prev]);
  };

  const isSolved = (id) => solvedIds.includes(id);
  const isBookmarked = (id) => bookmarkedIds.includes(id);
  const getNote = (id) => notes[id] || "";
  const isAptitudeSolved = (id) => solvedAptitudeIds.includes(id);

  const getInterviewStats = () => {
    const total = interviewHistory.length;
    if (total === 0) return { completed: 0, avgScore: 0, bestScore: 0 };
    const sum = interviewHistory.reduce((acc, curr) => acc + (curr.overallScore || 0), 0);
    const best = Math.max(...interviewHistory.map((curr) => curr.overallScore || 0));
    return {
      completed: total,
      avgScore: Math.round(sum / total),
      bestScore: best
    };
  };

  return (
    <SheetProgressContext.Provider
      value={{
        solvedIds,
        bookmarkedIds,
        notes,
        solvedAptitudeIds,
        interviewHistory,
        toggleSolved,
        toggleBookmark,
        saveNote,
        toggleAptitudeSolved,
        saveInterviewResult,
        isSolved,
        isBookmarked,
        getNote,
        isAptitudeSolved,
        getInterviewStats
      }}
    >
      {children}
    </SheetProgressContext.Provider>
  );
};

export const useSheetProgress = () => {
  const context = useContext(SheetProgressContext);
  if (!context) {
    throw new Error("useSheetProgress must be used within a SheetProgressProvider");
  }
  return context;
};
