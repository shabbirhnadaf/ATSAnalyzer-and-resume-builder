import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IResume extends Document {
  user: Types.ObjectId;
  title: string;
  template: string;
  mode: 'student' | 'professional' | 'fresher' | 'experienced' | 'career-switch';
  personalInfo: {
    fullname: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary: string;
  skills: string[];
  experience: {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    score?: string;
  }[];
  projects: {
    title: string;
    description: string[];
    link?: string;
  }[];
  certifications: string[];
  achievements: string[];
  extracurriculars: string[];
  coursework: string[];
}

const resumeSchema = new Schema<IResume>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    template: { type: String, required: true, default: 'modern', trim: true },
    mode: { type: String, required: true, default: 'student', trim: true },
    personalInfo: {
      fullname: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      location: { type: String, required: true, trim: true },
      linkedin: { type: String, trim: true, default: '' },
      github: { type: String, trim: true, default: '' },
      portfolio: { type: String, trim: true, default: '' },
    },
    summary: { type: String, default: '', trim: true },
    skills: { type: [String], default: [] },
    experience: [
      {
        company: { type: String, trim: true, default: '' },
        role: { type: String, trim: true, default: '' },
        startDate: { type: String, trim: true, default: '' },
        endDate: { type: String, trim: true, default: '' },
        description: { type: [String], default: [] },
      },
    ],
    education: [
      {
        institution: { type: String, trim: true, default: '' },
        degree: { type: String, trim: true, default: '' },
        startDate: { type: String, trim: true, default: '' },
        endDate: { type: String, trim: true, default: '' },
        score: { type: String, trim: true, default: '' },
      },
    ],
    projects: [
      {
        title: { type: String, trim: true, default: '' },
        description: { type: [String], default: [] },
        link: { type: String, trim: true, default: '' },
      },
    ],
    certifications: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    extracurriculars: { type: [String], default: [] },
    coursework: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Resume || mongoose.model<IResume>('Resume', resumeSchema);
