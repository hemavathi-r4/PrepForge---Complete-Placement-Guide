import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
      index: true
    },
    customId: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    solved: {
      type: Boolean,
      required: true,
      default: false
    },
    solvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index ensuring a user cannot have duplicate records for the same question
userProgressSchema.index({ user: 1, question: 1 }, { unique: true });
userProgressSchema.index({ user: 1, customId: 1 });
userProgressSchema.index({ user: 1, solved: 1 });

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

export default UserProgress;
