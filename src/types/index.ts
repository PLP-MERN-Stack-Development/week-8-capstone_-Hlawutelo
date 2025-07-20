export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface CV {
  id: string;
  userId: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  template: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship';
  salary: string;
  description: string;
  requirements: string[];
  posted: string;
  applyUrl: string;
  saved: boolean;
  applied: boolean;
  matchScore?: number;
}

export interface JobSearchFilters {
  query: string;
  location: string;
  jobType: string;
  remote: boolean;
  salaryMin: number;
  experienceLevel: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  publishedAt: string;
  readTime: string;
  featured: boolean;
}

export interface CareerGuide {
  id: string;
  title: string;
  description: string;
  steps: GuideStep[];
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface GuideStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}