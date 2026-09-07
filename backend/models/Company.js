import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    tier: {
      type: String,
      trim: true,
      default: 'Top Tech'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    totalQuestions: {
      type: Number,
      default: 0
    },
    difficultyBreakdown: {
      easy: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      hard: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true
  }
);

const Company = mongoose.model('Company', companySchema);

export default Company;
