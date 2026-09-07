import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import Company from '../models/Company.js';
import Question from '../models/Question.js';

// Import frontend static data files
import { DSA_TOPICS } from '../../frontend/src/data/dsaSheetData.js';
import { SQL_TOPICS } from '../../frontend/src/data/sqlSheetData.js';
import { APTITUDE_QUESTIONS } from '../../frontend/src/data/aptitudeQuestions.js';
import { CS_FUNDAMENTALS_CATEGORIES } from '../../frontend/src/data/csFundamentalsData.js';
import { COMPANY_DSA_LIST } from '../../frontend/src/data/companyDsaData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prepforge';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    // CRITICAL SAFETY CHECK: Clear ONLY Question and Company collections
    console.log('Clearing existing learning content collections (Question, Company)...');
    await Question.deleteMany({});
    await Company.deleteMany({});
    console.log('Cleared Question and Company collections. User collection remains untouched.');

    // 1. Seed Companies
    console.log('Seeding Companies from companyDsaData.js...');
    const companyMap = new Map();

    for (const compData of COMPANY_DSA_LIST) {
      const companyDoc = await Company.create({
        slug: compData.id.toLowerCase(),
        name: compData.name,
        tier: compData.tier || 'Top Tech',
        description: compData.description || '',
        totalQuestions: compData.totalQuestions || compData.problems?.length || 0,
        difficultyBreakdown: compData.difficultyBreakdown || { easy: 0, medium: 0, hard: 0 }
      });
      companyMap.set(compData.id.toLowerCase(), companyDoc);
      companyMap.set(compData.name.toLowerCase(), companyDoc);
    }
    console.log(`Successfully seeded ${COMPANY_DSA_LIST.length} companies.`);

    const questionsToInsert = [];
    const customIdMap = new Map();

    // Helper to resolve company objectIds and slugs
    const getCompanyRefs = (companyNamesOrIds = []) => {
      const slugs = new Set();
      const ids = new Set();

      for (const item of companyNamesOrIds) {
        if (!item) continue;
        const normalized = item.toLowerCase().trim();
        slugs.add(normalized);

        const compDoc = companyMap.get(normalized);
        if (compDoc) {
          ids.add(compDoc._id);
          slugs.add(compDoc.slug);
        }
      }

      return {
        companySlugs: Array.from(slugs),
        companies: Array.from(ids)
      };
    };

    // 2. Process DSA Sheet Questions
    console.log('Processing DSA Sheet questions...');
    for (const topic of DSA_TOPICS) {
      const topicName = topic.name;
      for (const prob of topic.problems || []) {
        const { companySlugs, companies } = getCompanyRefs(prob.companies || []);

        const qObj = {
          customId: prob.id,
          title: prob.title,
          topic: topicName,
          category: 'DSA',
          difficulty: prob.difficulty || 'Medium',
          statement: prob.statement || '',
          approach: prob.approach || '',
          complexity: {
            time: prob.complexity?.time || '',
            space: prob.complexity?.space || ''
          },
          code: {
            cpp: prob.code?.cpp || '',
            python: prob.code?.python || ''
          },
          externalLinks: {
            leetcode: prob.leetcodeUrl || '',
            gfg: prob.gfgUrl || ''
          },
          companySlugs,
          companies,
          tags: [topicName, prob.difficulty].filter(Boolean)
        };

        customIdMap.set(prob.id, qObj);
        questionsToInsert.push(qObj);
      }
    }

    // 3. Process SQL Sheet Questions
    console.log('Processing SQL Sheet questions...');
    for (const topic of SQL_TOPICS) {
      const topicName = topic.name;
      for (const prob of topic.problems || []) {
        const { companySlugs, companies } = getCompanyRefs(prob.companies || []);

        const qObj = {
          customId: prob.id,
          title: prob.title,
          topic: topicName,
          category: 'SQL',
          difficulty: prob.difficulty || 'Easy',
          statement: prob.statement || '',
          schemaText: prob.schema || '',
          solutionQuery: prob.solutionQuery || '',
          explanation: prob.explanation || '',
          keyConcept: prob.keyConcept || '',
          externalLinks: {
            leetcode: prob.leetcodeUrl || '',
            gfg: prob.gfgUrl || ''
          },
          companySlugs,
          companies,
          tags: [topicName, prob.keyConcept].filter(Boolean)
        };

        customIdMap.set(prob.id, qObj);
        questionsToInsert.push(qObj);
      }
    }

    // 4. Process Aptitude Questions
    console.log('Processing Aptitude questions...');
    for (const aptQ of APTITUDE_QUESTIONS) {
      const qObj = {
        customId: aptQ.id,
        title: aptQ.question,
        topic: aptQ.topic || 'General Aptitude',
        category: 'APTITUDE',
        difficulty: aptQ.difficulty || 'Medium',
        statement: aptQ.question,
        aptitudeCategory: aptQ.category || 'quantitative',
        options: aptQ.options || [],
        correctAnswer: typeof aptQ.correctAnswer === 'number' ? aptQ.correctAnswer : 0,
        explanation: aptQ.explanation || '',
        tags: [aptQ.topic, aptQ.category].filter(Boolean)
      };

      customIdMap.set(aptQ.id, qObj);
      questionsToInsert.push(qObj);
    }

    // 5. Process CS Fundamentals Questions
    console.log('Processing CS Fundamentals (CORE) questions...');
    for (const cat of CS_FUNDAMENTALS_CATEGORIES) {
      const categoryName = cat.shortName || cat.name;
      for (const topic of cat.topics || []) {
        const qObj = {
          customId: topic.id,
          title: topic.title,
          topic: categoryName,
          category: 'CORE',
          difficulty: 'Medium',
          statement: topic.summary || '',
          shortName: cat.shortName || '',
          summary: topic.summary || '',
          keyConcepts: topic.keyConcepts || [],
          interviewQAs: topic.interviewQAs || [],
          codeSnippet: topic.codeSnippet || '',
          externalLinks: {
            gfg: topic.gfgUrl || cat.gfgHubUrl || ''
          },
          gfgHubUrl: cat.gfgHubUrl || '',
          tags: [categoryName, topic.title].filter(Boolean)
        };

        customIdMap.set(topic.id, qObj);
        questionsToInsert.push(qObj);
      }
    }

    // 6. Process Company-Wise DSA Questions
    console.log('Processing Company-Wise DSA questions...');
    for (const compData of COMPANY_DSA_LIST) {
      const compSlug = compData.id.toLowerCase();
      const compDoc = companyMap.get(compSlug);

      for (const prob of compData.problems || []) {
        if (customIdMap.has(prob.id)) {
          // Update existing question to link this company
          const existing = customIdMap.get(prob.id);
          if (!existing.companySlugs.includes(compSlug)) {
            existing.companySlugs.push(compSlug);
          }
          if (compDoc && !existing.companies.some((id) => id.toString() === compDoc._id.toString())) {
            existing.companies.push(compDoc._id);
          }
          if (prob.frequency) {
            existing.frequency = prob.frequency;
          }
        } else {
          // Create new question entry for company question
          const { companySlugs, companies } = getCompanyRefs([compData.id, compData.name]);

          const qObj = {
            customId: prob.id,
            title: prob.title,
            topic: prob.topic || 'DSA',
            category: 'DSA',
            difficulty: prob.difficulty || 'Medium',
            statement: prob.statement || '',
            approach: prob.approach || '',
            complexity: {
              time: prob.complexity?.time || '',
              space: prob.complexity?.space || ''
            },
            code: {
              cpp: prob.code?.cpp || '',
              python: prob.code?.python || ''
            },
            externalLinks: {
              leetcode: prob.leetcodeUrl || '',
              gfg: prob.gfgUrl || ''
            },
            frequency: prob.frequency || '',
            companySlugs,
            companies,
            tags: [compData.name, prob.topic].filter(Boolean)
          };

          customIdMap.set(prob.id, qObj);
          questionsToInsert.push(qObj);
        }
      }
    }

    console.log(`Inserting ${questionsToInsert.length} total questions into MongoDB...`);
    const insertedQuestions = await Question.insertMany(questionsToInsert);
    console.log(`Successfully seeded ${insertedQuestions.length} questions into Question collection.`);

    // Log breakdown by category
    const categoryCounts = await Question.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    console.log('Questions Seed Summary by Category:', categoryCounts);

    console.log('Database Seeding Complete!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during database seeding:', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedDatabase();
