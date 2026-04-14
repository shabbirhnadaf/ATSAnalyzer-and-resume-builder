export type ResumeFormValues = {
  title: string;
  template: string;
  mode: 'student' | 'fresher' | 'experienced' | 'career-switch';
  personalInfo: {
    fullname: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
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
    score: string;
  }[];
  projects: {
    title: string;
    description: string[];
    link: string;
  }[];
  certifications: string[];
  achievements: string[];
  extracurriculars: string[];
  coursework: string[];
};

export type ResumeTemplateId = 'modern' | 'minimal' | 'executive' | 'graduate';