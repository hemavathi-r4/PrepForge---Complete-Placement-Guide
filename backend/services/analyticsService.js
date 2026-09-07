/**
 * ─────────────────────────────────────────────────────────────
 * PrepForge — Analytics Service (B6)
 * ─────────────────────────────────────────────────────────────
 *
 * Provides all analytics-related database queries and calculations.
 * Uses MongoDB aggregation pipelines for efficiency.
 *
 * IMPORTANT:
 *   - All functions accept userId (from req.user._id via controller).
 *   - No userId is ever accepted from req.body / req.query / req.params.
 *   - Reuses B5 UserProgress, UserActivity, Question models.
 *   - Reuses B5 streak + activity logic via import (no duplication).
 *   - All percentages rounded to 2 decimal places; 0 guarded for division.
 * ─────────────────────────────────────────────────────────────
 */

import mongoose from 'mongoose';
import Question from '../models/Question.js';
import UserProgress from '../models/UserProgress.js';
import UserActivity from '../models/UserActivity.js';
import Company from '../models/Company.js';

// ── Shared helper: reuse B5 streak/activity logic ────────────
// Import directly to avoid code duplication
import {
  getStreakService,
  getActivityService
} from './progressService.js';

// ── Utility ──────────────────────────────────────────────────

/**
 * Get today's date in UTC as "YYYY-MM-DD".
 * Consistent with B5 implementation.
 */
const getTodayUTC = () => {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Subtract N days from a UTC date string "YYYY-MM-DD".
 */
const subtractDays = (dateStr, n) => {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
};

/**
 * Safe percentage rounded to 2 decimal places.
 * Returns 0 when total is 0 to avoid NaN/Infinity.
 */
const safePct = (solved, total) =>
  total > 0 ? Math.round((solved / total) * 10000) / 100 : 0;

// ── 1. OVERVIEW ───────────────────────────────────────────────

/**
 * Returns a dashboard-level summary for the authenticated user.
 *
 * Reuses B5 getStreakService for streak data (no duplication).
 * Computes todaySolved, thisWeekSolved, thisMonthSolved from UserActivity.
 *
 * @param {mongoose.Types.ObjectId} userId
 * @returns {object} overview data
 */
export const getOverviewService = async (userId) => {
  const today = getTodayUTC();
  const weekAgo = subtractDays(today, 6);   // 7-day window including today
  const monthAgo = subtractDays(today, 29); // 30-day window including today

  // Run streak + totals in parallel
  const [streakResult, totalQuestionsCount, solvedProgressCount, activityRecords] =
    await Promise.all([
      // Reuse B5 streak logic exactly
      getStreakService(userId),

      // Total questions in the system
      Question.countDocuments({}),

      // Total solved by this user
      UserProgress.countDocuments({ user: userId, solved: true }),

      // Fetch all activity to compute today/week/month solved counts
      UserActivity.find({ user: userId, questionsSolved: { $gt: 0 } })
        .select('date questionsSolved')
        .lean()
    ]);

  // Build activity lookup map: { "YYYY-MM-DD": questionsSolved }
  const activityMap = {};
  for (const rec of activityRecords) {
    activityMap[rec.date] = rec.questionsSolved;
  }

  const todaySolved = activityMap[today] || 0;

  let thisWeekSolved = 0;
  let thisMonthSolved = 0;

  for (const rec of activityRecords) {
    if (rec.date >= weekAgo && rec.date <= today) thisWeekSolved += rec.questionsSolved;
    if (rec.date >= monthAgo && rec.date <= today) thisMonthSolved += rec.questionsSolved;
  }

  const overallPercentage = safePct(solvedProgressCount, totalQuestionsCount);

  return {
    totalQuestions: totalQuestionsCount,
    totalSolved: solvedProgressCount,
    overallPercentage,
    currentStreak: streakResult.current,
    longestStreak: streakResult.longest,
    todaySolved,
    thisWeekSolved,
    thisMonthSolved
  };
};

// ── 2. CATEGORY ANALYTICS ─────────────────────────────────────

/**
 * Returns progress breakdown per question category for the authenticated user.
 * Uses the exact category values from the Question model enum: DSA, SQL, APTITUDE, CORE.
 *
 * Aggregation strategy:
 *   Step 1: Count total questions per category (Question collection).
 *   Step 2: Count solved questions per category for this user
 *           (UserProgress JOIN Question via $lookup).
 *
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Array} category analytics array
 */
export const getCategoryAnalyticsService = async (userId) => {
  const categories = ['DSA', 'SQL', 'APTITUDE', 'CORE'];

  const [totalCounts, solvedCounts] = await Promise.all([
    // Total questions grouped by category
    Question.aggregate([
      { $group: { _id: '$category', total: { $sum: 1 } } }
    ]),

    // Solved questions grouped by category for this user
    UserProgress.aggregate([
      // Filter: only this user's solved records
      { $match: { user: new mongoose.Types.ObjectId(userId), solved: true } },
      // Join question to get its category
      {
        $lookup: {
          from: 'questions',
          localField: 'question',
          foreignField: '_id',
          as: 'q'
        }
      },
      { $unwind: '$q' },
      // Group by category
      { $group: { _id: '$q.category', solved: { $sum: 1 } } }
    ])
  ]);

  // Build lookup maps
  const totalMap = Object.fromEntries(categories.map((c) => [c, 0]));
  const solvedMap = Object.fromEntries(categories.map((c) => [c, 0]));

  totalCounts.forEach((r) => { if (r._id in totalMap) totalMap[r._id] = r.total; });
  solvedCounts.forEach((r) => { if (r._id in solvedMap) solvedMap[r._id] = r.solved; });

  return categories.map((cat) => {
    const total = totalMap[cat];
    const solved = solvedMap[cat];
    return {
      category: cat,
      total,
      solved,
      unsolved: total - solved,
      percentage: safePct(solved, total)
    };
  });
};

// ── 3. TOPIC ANALYTICS ────────────────────────────────────────

/**
 * Returns progress breakdown per topic for the authenticated user.
 * Only returns topics that exist in the Question collection (no hard-coding).
 *
 * Aggregation strategy:
 *   Step 1: Get all distinct topics with total counts from Question.
 *   Step 2: Get solved count per topic for this user via UserProgress + $lookup.
 *   Step 3: Merge in JavaScript.
 *
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Array} topic analytics array sorted by total descending
 */
export const getTopicAnalyticsService = async (userId) => {
  const [topicTotals, topicSolved] = await Promise.all([
    // Total questions per topic
    Question.aggregate([
      { $group: { _id: '$topic', total: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]),

    // Solved per topic for this user
    UserProgress.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), solved: true } },
      {
        $lookup: {
          from: 'questions',
          localField: 'question',
          foreignField: '_id',
          as: 'q'
        }
      },
      { $unwind: '$q' },
      { $group: { _id: '$q.topic', solved: { $sum: 1 } } }
    ])
  ]);

  const solvedByTopic = {};
  topicSolved.forEach((r) => { solvedByTopic[r._id] = r.solved; });

  return topicTotals.map((r) => {
    const topic = r._id;
    const total = r.total;
    const solved = solvedByTopic[topic] || 0;
    return {
      topic,
      total,
      solved,
      unsolved: total - solved,
      percentage: safePct(solved, total)
    };
  });
};

// ── 4. DIFFICULTY ANALYTICS ───────────────────────────────────

/**
 * Returns progress breakdown per difficulty level for the authenticated user.
 * Uses the actual difficulty values in the Question collection (not hard-coded).
 *
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Array} difficulty analytics array
 */
export const getDifficultyAnalyticsService = async (userId) => {
  // Use the Question model enum order for consistent output
  const difficultyOrder = ['Easy', 'Medium', 'Hard'];

  const [diffTotals, diffSolved] = await Promise.all([
    // Total per difficulty
    Question.aggregate([
      { $group: { _id: '$difficulty', total: { $sum: 1 } } }
    ]),

    // Solved per difficulty for this user
    UserProgress.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), solved: true } },
      {
        $lookup: {
          from: 'questions',
          localField: 'question',
          foreignField: '_id',
          as: 'q'
        }
      },
      { $unwind: '$q' },
      { $group: { _id: '$q.difficulty', solved: { $sum: 1 } } }
    ])
  ]);

  const totalByDiff = {};
  diffTotals.forEach((r) => { totalByDiff[r._id] = r.total; });

  const solvedByDiff = {};
  diffSolved.forEach((r) => { solvedByDiff[r._id] = r.solved; });

  // Use enum order; fall back to whatever exists in DB
  const allDifficulties = [
    ...new Set([...difficultyOrder, ...Object.keys(totalByDiff)])
  ].filter((d) => totalByDiff[d] !== undefined);

  return allDifficulties.map((diff) => {
    const total = totalByDiff[diff] || 0;
    const solved = solvedByDiff[diff] || 0;
    return {
      difficulty: diff,
      total,
      solved,
      unsolved: total - solved,
      percentage: safePct(solved, total)
    };
  });
};

// ── 5. ACTIVITY ANALYTICS ─────────────────────────────────────

/**
 * Returns daily activity for the authenticated user over the requested window.
 * Fills in zero-activity days so the frontend chart has a continuous timeline.
 *
 * Reuses B5 getActivityService for the raw activity data, then pads missing days.
 *
 * @param {mongoose.Types.ObjectId} userId
 * @param {number} days  - Number of days (1–365), default 30
 * @returns {Array<{ date: string, questionsSolved: number }>}
 */
export const getActivityAnalyticsService = async (userId, days = 30) => {
  const maxDays = Math.min(Math.max(1, parseInt(days) || 30), 365);
  const today = getTodayUTC();

  // Fetch only active days from DB (reuses B5 UserActivity model)
  const activeRecords = await UserActivity.find({
    user: userId,
    questionsSolved: { $gt: 0 }
  })
    .select('date questionsSolved')
    .lean();

  // Build lookup map of active days
  const activityMap = {};
  activeRecords.forEach((r) => { activityMap[r.date] = r.questionsSolved; });

  // Generate a full continuous date range (oldest → newest)
  const result = [];
  for (let i = maxDays - 1; i >= 0; i--) {
    const dateStr = subtractDays(today, i);
    result.push({
      date: dateStr,
      questionsSolved: activityMap[dateStr] || 0
    });
  }

  return result;
};

// ── 6. COMPANY ANALYTICS ─────────────────────────────────────

/**
 * Returns per-company progress for the authenticated user.
 * Uses Question.companySlugs (string array) to associate questions with companies.
 * Only returns companies that have at least one question.
 *
 * Aggregation strategy:
 *   Step 1: Count total questions per company slug via $unwind + $group on companySlugs.
 *   Step 2: Get the display name per slug from the Company collection.
 *   Step 3: For each slug, count solved questions for this user via $lookup + $match.
 *
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Array} company analytics array sorted by total descending
 */
export const getCompanyAnalyticsService = async (userId) => {
  // Step 1: Total questions per company slug
  const companyTotals = await Question.aggregate([
    // Only include questions that belong to at least one company
    { $match: { companySlugs: { $exists: true, $ne: [] } } },
    // Flatten companySlugs array: one document per slug
    { $unwind: '$companySlugs' },
    // Group by slug and count
    { $group: { _id: '$companySlugs', total: { $sum: 1 } } },
    { $sort: { total: -1 } }
  ]);

  if (companyTotals.length === 0) return [];

  const slugs = companyTotals.map((r) => r._id);

  // Step 2: Solved questions per company slug for this user
  // Strategy: get all solved question ObjectIds for the user, then join via companySlugs
  const solvedQuestionIds = await UserProgress.find({
    user: userId,
    solved: true
  })
    .select('question')
    .lean()
    .then((docs) => docs.map((d) => d.question));

  let solvedBySlug = {};

  if (solvedQuestionIds.length > 0) {
    const solvedCounts = await Question.aggregate([
      // Only the user's solved questions
      { $match: { _id: { $in: solvedQuestionIds }, companySlugs: { $in: slugs } } },
      { $unwind: '$companySlugs' },
      { $match: { companySlugs: { $in: slugs } } },
      { $group: { _id: '$companySlugs', solved: { $sum: 1 } } }
    ]);
    solvedCounts.forEach((r) => { solvedBySlug[r._id] = r.solved; });
  }

  // Step 3: Get display names from Company collection
  const companyDocs = await Company.find({ slug: { $in: slugs } })
    .select('slug name')
    .lean();

  const nameBySlug = {};
  companyDocs.forEach((c) => { nameBySlug[c.slug] = c.name; });

  return companyTotals.map((r) => {
    const slug = r._id;
    const total = r.total;
    const solved = solvedBySlug[slug] || 0;
    return {
      company: nameBySlug[slug] || slug.charAt(0).toUpperCase() + slug.slice(1),
      slug,
      total,
      solved,
      unsolved: total - solved,
      percentage: safePct(solved, total)
    };
  });
};
