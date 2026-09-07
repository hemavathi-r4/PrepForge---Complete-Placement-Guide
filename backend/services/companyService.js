import mongoose from 'mongoose';
import Company from '../models/Company.js';
import Question from '../models/Question.js';

/**
 * Service to fetch all companies
 */
export const getAllCompaniesService = async () => {
  const companies = await Company.find({}).sort({ name: 1 });
  return companies;
};

/**
 * Service to fetch a single company by _id or slug
 */
export const getCompanyByIdService = async (companyId) => {
  if (!companyId) return null;

  let company = null;
  const normalizedId = companyId.toLowerCase().trim();

  if (mongoose.Types.ObjectId.isValid(companyId)) {
    company = await Company.findById(companyId);
  }

  if (!company) {
    company = await Company.findOne({ slug: normalizedId });
  }

  if (!company) {
    company = await Company.findOne({ name: { $regex: new RegExp(`^${normalizedId}$`, 'i') } });
  }

  return company;
};

/**
 * Service to fetch questions associated with a specific company
 */
export const getCompanyQuestionsService = async (companyId, queryParams = {}) => {
  const companyDoc = await getCompanyByIdService(companyId);

  if (!companyDoc) {
    return { company: null, questions: [], pagination: null };
  }

  const {
    topic,
    difficulty,
    search,
    page = 1,
    limit = 10
  } = queryParams;

  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (parsedPage - 1) * parsedLimit;

  // Filter for questions belonging to this company
  const filter = {
    $or: [
      { companySlugs: companyDoc.slug },
      { companies: companyDoc._id }
    ]
  };

  // Difficulty filter
  if (difficulty && difficulty.toLowerCase() !== 'all') {
    const formattedDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
    filter.difficulty = formattedDiff;
  }

  // Topic filter
  if (topic && topic.toLowerCase() !== 'all') {
    filter.topic = { $regex: new RegExp(`^${topic.trim()}$`, 'i') };
  }

  // Search filter
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

    filter.$and = [
      { $or: filter.$or },
      searchCondition
    ];
    delete filter.$or;
  }

  const [questions, total] = await Promise.all([
    Question.find(filter)
      .skip(skip)
      .limit(parsedLimit)
      .sort({ createdAt: 1 }),
    Question.countDocuments(filter)
  ]);

  return {
    company: companyDoc,
    questions,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(total / parsedLimit) || 1
    }
  };
};
