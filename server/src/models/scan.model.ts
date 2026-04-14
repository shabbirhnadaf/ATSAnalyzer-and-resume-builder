import { Schema, model, Types } from 'mongoose';

const scanSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resume: {
      type: Types.ObjectId,
      ref: 'Resume',
      required: true,
      index: true,
    },
    jobTitle: {
      type: String,
      default: '',
      trim: true,
    },
    company: {
      type: String,
      default: '',
      trim: true,
    },
    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    matchedKeywords: {
      type: [String],
      default: [],
    },
    missingKeywords: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const Scan = model('Scan', scanSchema);