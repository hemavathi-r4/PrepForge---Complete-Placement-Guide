import mongoose from 'mongoose';
import Question from '../models/Question.js';
import Company from '../models/Company.js';

/**
 * Service to fetch questions with filtering, search, and pagination
 */
export const getQuestionsService = async (queryParams = {}) => {
  const {
    category,
    topic,
    difficulty,
    search,
    company,
    page = 1,
    limit = 10
  } = queryParams;

  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const filter = {};

  // Category filter (DSA, SQL, APTITUDE, CORE)
  if (category) {
    filter.category = category.toUpperCase().trim();
  }

  // Difficulty filter (Easy, Medium, Hard)
  if (difficulty && difficulty.toLowerCase() !== 'all') {
    // Capitalize first letter (e.g. easy -> Easy)
    const formattedDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
    filter.difficulty = formattedDiff;
  }

  // Topic filter
  if (topic && topic.toLowerCase() !== 'all') {
    filter.topic = { $regex: new RegExp(`^${topic.trim()}$`, 'i') };
  }

  // Company filter (by slug or name)
  if (company && company.toLowerCase() !== 'all') {
    const compSlug = company.toLowerCase().trim();
    // Find company to also support objectId lookup
    const compDoc = await Company.findOne({
      $or: [{ slug: compSlug }, { name: { $regex: new RegExp(`^${compSlug}$`, 'i') } }]
    });

    if (compDoc) {
      filter.$or = [
        { companySlugs: compSlug },
        { companies: compDoc._id }
      ];
    } else {
      filter.companySlugs = compSlug;
    }
  }

  // Search filter across title, topic, tags, statement
  if (search && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim(), 'i');
    const searchCondition = {
      $or: [
        { title: searchRegex },
        { topic: searchRegex },
        { tags: searchRegex },
        { statement: searchRegex },
        { customId: searchRegex }
      ]
    };

    if (filter.$or) {
      filter.$and = [{ $or: filter.$or }, searchCondition];
      delete filter.$or;
    } else {
      filter.$or = searchCondition.$or;
    }
  }

  const [questions, total] = await Promise.all([
    Question.find(filter)
      .populate('companies', 'name slug tier')
      .skip(skip)
      .limit(parsedLimit)
      .sort({ createdAt: 1 }),
    Question.countDocuments(filter)
  ]);

  return {
    questions,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(total / parsedLimit) || 1
    }
  };
};

/**
 * Service to fetch a single question by _id or customId
 */
export const getQuestionByIdService = async (id) => {
  if (!id) return null;

  let question = null;

  // Check if valid ObjectId
  if (mongoose.Types.ObjectId.isValid(id)) {
    question = await Question.findById(id).populate('companies', 'name slug tier');
  }

  // If not found by ObjectId, lookup by customId
  if (!question) {
    question = await Question.findOne({ customId: id }).populate('companies', 'name slug tier');
  }

  return question;
};
