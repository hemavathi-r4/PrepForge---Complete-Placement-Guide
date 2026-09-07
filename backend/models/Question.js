import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    topic: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    category: {
      type: String,
      required: true,
      enum: ['DSA', 'SQL', 'APTITUDE', 'CORE'],
      index: true
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
      index: true
    },
    statement: {
      type: String,
      default: ''
    },
    approach: {
      type: String,
      default: ''
    },
    complexity: {
      time: { type: String, default: '' },
      space: { type: String, default: '' }
    },
    code: {
      cpp: { type: String, default: '' },
      python: { type: String, default: '' }
    },
    externalLinks: {
      leetcode: { type: String, default: '' },
      gfg: { type: String, default: '' }
    },
    companies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
      }
    ],
    companySlugs: [
      {
        type: String,
        lowercase: true,
        trim: true,
        index: true
      }
    ],
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    // SQL Specific Fields
    schemaText: {
      type: String,
      default: ''
    },
    solutionQuery: {
      type: String,
      default: ''
    },
    explanation: {
      type: String,
      default: ''
    },
    keyConcept: {
      type: String,
      default: ''
    },
    // Aptitude Specific Fields
    aptitudeCategory: {
      type: String,
      default: ''
    },
    options: [
      {
        type: String
      }
    ],
    correctAnswer: {
      type: Number,
      default: 0
    },
    // Core Subject (CS Fundamentals) Specific Fields
    shortName: {
      type: String,
      default: ''
    },
    summary: {
      type: String,
      default: ''
    },
    keyConcepts: [
      {
        type: String
      }
    ],
    interviewQAs: [
      {
        q: { type: String, default: '' },
        a: { type: String, default: '' }
      }
    ],
    codeSnippet: {
      type: String,
      default: ''
    },
    gfgHubUrl: {
      type: String,
      default: ''
    },
    // Company-specific extra field
    frequency: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Compound text index for search functionality across title, topic, tags, statement
questionSchema.index(
  {
    title: 'text',
    topic: 'text',
    tags: 'text',
    statement: 'text'
  },
  {
    weights: {
      title: 10,
      topic: 5,
      tags: 5,
      statement: 1
    },
    name: 'question_text_index'
  }
);

const Question = mongoose.model('Question', questionSchema);

export default Question;
