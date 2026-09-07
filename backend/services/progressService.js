import mongoose from 'mongoose';
import UserProgress from '../models/UserProgress.js';
import UserActivity from '../models/UserActivity.js';
import Question from '../models/Question.js';

/**
 * Get today's date string in UTC (YYYY-MM-DD).
 * Consistent server-side UTC-based date handling prevents timezone boundary bugs.
 */
const getTodayUTC = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Mark a question solved or unsolved for a user.
 * Also updates UserActivity for the current UTC day.
 */
export const markQuestionSolvedService = async (userId, questionId, solved) => {
  // Resolve question — questionId can be either MongoDB _id or customId
  let questionDoc = null;

  if (mongoose.Types.ObjectId.isValid(questionId)) {
    questionDoc = await Question.findById(questionId).select('_id customId category topic');
  }
  if (!questionDoc) {
    questionDoc = await Question.findOne({ customId: questionId }).select('_id customId category topic');
  }

  if (!questionDoc) {
    return { found: false };
  }

  const today = getTodayUTC();
  const wasAlreadySolved = await UserProgress.findOne({
    user: userId,
    question: questionDoc._id,
    solved: true
  });

  // Upsert the progress record atomically
  const progressDoc = await UserProgress.findOneAndUpdate(
    { user: userId, question: questionDoc._id },
    {
      $set: {
        user: userId,
        question: questionDoc._id,
        customId: questionDoc.customId,
        solved,
        solvedAt: solved ? new Date() : null
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Update daily activity: increment only when newly becoming solved today
  if (solved && !wasAlreadySolved) {
    await UserActivity.findOneAndUpdate(
      { user: userId, date: today },
      { $inc: { questionsSolved: 1 }, $setOnInsert: { user: userId, date: today } },
      { upsert: true, new: true }
    );
  }

  return {
    found: true,
    progress: {
      questionId: questionDoc.customId || questionDoc._id,
      solved: progressDoc.solved,
      solvedAt: progressDoc.solvedAt
    }
  };
};

/**
 * Get all progress records (solved + unsolved) for a user.
 */
export const getUserProgressService = async (userId) => {
  const progressRecords = await UserProgress.find({ user: userId })
    .populate('question', 'title topic category difficulty customId')
    .sort({ updatedAt: -1 });

  return progressRecords;
};

/**
 * Get progress status for a single specific question for a user.
 */
export const getQuestionProgressService = async (userId, questionId) => {
  let questionDoc = null;

  if (mongoose.Types.ObjectId.isValid(questionId)) {
    questionDoc = await Question.findById(questionId).select('_id customId');
  }
  if (!questionDoc) {
    questionDoc = await Question.findOne({ customId: questionId }).select('_id customId');
  }

  if (!questionDoc) {
    return { found: false };
  }

  const progress = await UserProgress.findOne({
    user: userId,
    question: questionDoc._id
  });

  return {
    found: true,
    progress: progress
      ? { questionId: questionDoc.customId, solved: progress.solved, solvedAt: progress.solvedAt }
      : { questionId: questionDoc.customId, solved: false, solvedAt: null }
  };
};

/**
 * Get progress summary for a user including overall and category-wise counts.
 * All values are computed dynamically from MongoDB — never stored.
 */
export const getProgressSummaryService = async (userId) => {
  const categories = ['DSA', 'SQL', 'APTITUDE', 'CORE'];

  // Fetch total question counts per category in parallel
  const totalCountsPromise = Question.aggregate([
    { $group: { _id: '$category', total: { $sum: 1 } } }
  ]);

  // Fetch solved counts per category for this user
  const solvedCountsPromise = UserProgress.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), solved: true } },
    {
      $lookup: {
        from: 'questions',
        localField: 'question',
        foreignField: '_id',
        as: 'questionData'
      }
    },
    { $unwind: '$questionData' },
    { $group: { _id: '$questionData.category', solved: { $sum: 1 } } }
  ]);

  const [totalCounts, solvedCounts] = await Promise.all([totalCountsPromise, solvedCountsPromise]);

  // Build lookup maps
  const totalMap = {};
  const solvedMap = {};

  for (const cat of categories) {
    totalMap[cat] = 0;
    solvedMap[cat] = 0;
  }

  totalCounts.forEach((t) => {
    if (totalMap[t._id] !== undefined) totalMap[t._id] = t.total;
  });
  solvedCounts.forEach((s) => {
    if (solvedMap[s._id] !== undefined) solvedMap[s._id] = s.solved;
  });

  const totalQuestions = categories.reduce((sum, cat) => sum + totalMap[cat], 0);
  const totalSolved = categories.reduce((sum, cat) => sum + solvedMap[cat], 0);
  const overallPercentage = totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100) : 0;

  const categoryBreakdown = {};
  for (const cat of categories) {
    const t = totalMap[cat];
    const s = solvedMap[cat];
    categoryBreakdown[cat.toLowerCase()] = {
      solved: s,
      total: t,
      percentage: t > 0 ? Math.round((s / t) * 100) : 0
    };
  }

  return {
    totalSolved,
    totalQuestions,
    overallPercentage,
    dsaSolved: solvedMap['DSA'],
    sqlSolved: solvedMap['SQL'],
    aptitudeSolved: solvedMap['APTITUDE'],
    coreSolved: solvedMap['CORE'],
    categoryBreakdown
  };
};

/**
 * Calculate current and longest streak for a user.
 * Strategy: UTC date strings ("YYYY-MM-DD"), consecutive active days.
 */
export const getStreakService = async (userId) => {
  const activities = await UserActivity.find({ user: userId, questionsSolved: { $gt: 0 } })
    .sort({ date: -1 })
    .select('date questionsSolved')
    .lean();

  if (activities.length === 0) {
    return { current: 0, longest: 0, todayActive: false };
  }

  const today = getTodayUTC();
  const todayActive = activities.some((a) => a.date === today);

  // Build a Set of active date strings for O(1) lookup
  const activeDates = new Set(activities.map((a) => a.date));

  // Current streak: count consecutive days backward from today (or yesterday if today not active)
  let currentStreak = 0;
  const startDate = new Date(today + 'T00:00:00Z');

  // If today is not active, streak already broken if yesterday also not active
  let cursor = new Date(startDate);
  while (true) {
    const dateStr = cursor.toISOString().slice(0, 10);
    if (activeDates.has(dateStr)) {
      currentStreak++;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    } else {
      break;
    }
  }

  // Longest streak: sort ascending and scan for consecutive days
  const sortedDates = [...activeDates].sort();
  let longestStreak = 0;
  let tempStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1] + 'T00:00:00Z');
    const curr = new Date(sortedDates[i] + 'T00:00:00Z');
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return {
    current: currentStreak,
    longest: longestStreak,
    todayActive
  };
};

/**
 * Get recent daily activity for a user.
 */
export const getActivityService = async (userId, days = 30) => {
  const maxDays = Math.min(Math.max(1, parseInt(days) || 30), 365);

  const activities = await UserActivity.find({
    user: userId,
    questionsSolved: { $gt: 0 }
  })
    .sort({ date: -1 })
    .limit(maxDays)
    .select('date questionsSolved')
    .lean();

  return activities.map((a) => ({
    date: a.date,
    questionsSolved: a.questionsSolved
  }));
};
