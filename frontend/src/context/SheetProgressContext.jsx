/**
 * ─────────────────────────────────────────────────────────────
 * PrepForge — SheetProgressContext (Stage 5 Upgrade)
 * ─────────────────────────────────────────────────────────────
 *
 * Stage 5 Changes:
 *   - On mount (when user is authenticated): fetches the user's full
 *     progress list from GET /api/progress and hydrates solvedIds.
 *   - On toggleSolved (when authenticated): calls PUT /api/progress/:id
 *     to persist the change to MongoDB in addition to localStorage.
 *   - All other state (bookmarks, notes, aptitude, interview history)
 *     remains localStorage-only (as before).
 *   - Unauthenticated users continue to work fully via localStorage.
 *
 * Architecture:
 *   localStorage acts as an optimistic local cache.
 *   MongoDB is the source of truth when the user is logged in.
 * ─────────────────────────────────────────────────────────────
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getUserProgress, markQuestionSolved } from "../services/progressService";

const SheetProgressContext = createContext();

export const SheetProgressProvider = ({ children }) => {
  // ── Solved IDs ──────────────────────────────────────────────
  const [solvedIds, setSolvedIds] = useState(() => {
    try {
      const saved = localStorage.getItem("prepforge_solved_ids");
      return saved ? JSON.parse(saved) : ["dsa-arr-1", "dsa-str-1", "sql-b-1"];
    } catch {
      return ["dsa-arr-1", "dsa-str-1", "sql-b-1"];
    }
  });

  // ── Bookmarked IDs ───────────────────────────────────────────
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem("prepforge_bookmarked_ids");
      return saved ? JSON.parse(saved) : ["dsa-arr-4", "sql-wf-1"];
    } catch {
      return ["dsa-arr-4", "sql-wf-1"];
    }
  });

  // ── Problem Notes ────────────────────────────────────────────
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("prepforge_problem_notes");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // ── Aptitude Solved IDs ──────────────────────────────────────
  const [solvedAptitudeIds, setSolvedAptitudeIds] = useState(() => {
    try {
      const saved = localStorage.getItem("prepforge_solved_aptitude_ids");
      return saved ? JSON.parse(saved) : ["apt-quant-1", "apt-logic-1"];
    } catch {
      return ["apt-quant-1", "apt-logic-1"];
    }
  });

  // ── AI Mock Interview History ────────────────────────────────
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

  // ── Stage 5: Backend sync state ──────────────────────────────
  const [backendSyncLoading, setBackendSyncLoading] = useState(false);
  const [backendSyncError, setBackendSyncError] = useState(null);

  // ── localStorage Synchronizers ───────────────────────────────
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

  // ── Stage 5: Hydrate solvedIds from backend on mount ─────────
  /**
   * Loads the authenticated user's progress from the backend and
   * merges it into solvedIds. Called once when the provider mounts.
   * Safely no-ops if no JWT token is present (unauthenticated).
   */
  const syncProgressFromBackend = useCallback(async () => {
    const token = localStorage.getItem("prepforge_token");
    if (!token) return; // Not authenticated — rely on localStorage only

    setBackendSyncLoading(true);
    setBackendSyncError(null);

    try {
      const res = await getUserProgress();
      if (res.success && Array.isArray(res.progress)) {
        // Extract customIds of all questions the user has solved on the server
        const backendSolvedIds = res.progress
          .filter((p) => p.solved)
          .map((p) => p.customId || (p.question && p.question.customId))
          .filter(Boolean);

        if (backendSolvedIds.length > 0) {
          setSolvedIds((prev) => {
            // Merge: union of localStorage + backend solved IDs (no duplicates)
            const merged = Array.from(new Set([...prev, ...backendSolvedIds]));
            return merged;
          });
        }
      }
    } catch (err) {
      console.error("SheetProgressContext: Failed to sync progress from backend.", err);
      setBackendSyncError("Could not sync progress from server. Local progress is still active.");
    } finally {
      setBackendSyncLoading(false);
    }
  }, []);

  // Trigger backend sync once on mount
  useEffect(() => {
    syncProgressFromBackend();
  }, [syncProgressFromBackend]);

  // ── Actions ──────────────────────────────────────────────────

  /**
   * Stage 5 Upgraded toggleSolved:
   *   1. Optimistically updates local state + localStorage immediately.
   *   2. If the user is authenticated, also persists to backend via
   *      PUT /api/progress/:questionId. Backend failure is non-fatal
   *      (local state remains updated — graceful degradation).
   */
  const toggleSolved = useCallback((id) => {
    let newSolvedState;

    setSolvedIds((prev) => {
      const alreadySolved = prev.includes(id);
      newSolvedState = !alreadySolved;
      return alreadySolved ? prev.filter((item) => item !== id) : [...prev, id];
    });

    // Fire-and-forget backend sync (authenticated users only)
    const token = localStorage.getItem("prepforge_token");
    if (token) {
      // Use a small timeout to let the state setter above settle its value
      setTimeout(() => {
        // Re-read from closure — newSolvedState is captured correctly
        markQuestionSolved(id, newSolvedState).catch((err) => {
          console.error("toggleSolved: Backend sync failed for question", id, err);
        });
      }, 0);
    }
  }, []);

  const toggleBookmark = useCallback((id) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const saveNote = useCallback((id, noteText) => {
    setNotes((prev) => ({
      ...prev,
      [id]: noteText
    }));
  }, []);

  const toggleAptitudeSolved = useCallback((id) => {
    setSolvedAptitudeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const saveInterviewResult = useCallback((reportData) => {
    const newRecord = {
      id: `int_${Date.now()}`,
      ...reportData
    };
    setInterviewHistory((prev) => [newRecord, ...prev]);
  }, []);

  // ── Selectors ────────────────────────────────────────────────
  const isSolved = useCallback((id) => solvedIds.includes(id), [solvedIds]);
  const isBookmarked = useCallback((id) => bookmarkedIds.includes(id), [bookmarkedIds]);
  const getNote = useCallback((id) => notes[id] || "", [notes]);
  const isAptitudeSolved = useCallback((id) => solvedAptitudeIds.includes(id), [solvedAptitudeIds]);

  const getInterviewStats = useCallback(() => {
    const total = interviewHistory.length;
    if (total === 0) return { completed: 0, avgScore: 0, bestScore: 0 };
    const sum = interviewHistory.reduce((acc, curr) => acc + (curr.overallScore || 0), 0);
    const best = Math.max(...interviewHistory.map((curr) => curr.overallScore || 0));
    return {
      completed: total,
      avgScore: Math.round(sum / total),
      bestScore: best
    };
  }, [interviewHistory]);

  return (
    <SheetProgressContext.Provider
      value={{
        // State
        solvedIds,
        bookmarkedIds,
        notes,
        solvedAptitudeIds,
        interviewHistory,
        // Stage 5 sync state
        backendSyncLoading,
        backendSyncError,
        // Actions
        toggleSolved,
        toggleBookmark,
        saveNote,
        toggleAptitudeSolved,
        saveInterviewResult,
        syncProgressFromBackend,
        // Selectors
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
