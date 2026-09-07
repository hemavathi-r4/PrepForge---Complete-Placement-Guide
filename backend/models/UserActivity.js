import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: String,
      required: true,
      trim: true
    },
    questionsSolved: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index ensuring one activity record per user per day (YYYY-MM-DD)
userActivitySchema.index({ user: 1, date: 1 }, { unique: true });

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

export default UserActivity;
