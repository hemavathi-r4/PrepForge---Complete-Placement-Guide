import React, { createContext, useContext, useState, useEffect } from "react";

const SheetProgressContext = createContext();

export const SheetProgressProvider = ({ children }) => {
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

  const isSolved = (id) => solvedIds.includes(id);
  const isBookmarked = (id) => bookmarkedIds.includes(id);
  const getNote = (id) => notes[id] || "";

  return (
    <SheetProgressContext.Provider
      value={{
        solvedIds,
        bookmarkedIds,
        notes,
        toggleSolved,
        toggleBookmark,
        saveNote,
        isSolved,
        isBookmarked,
        getNote
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
