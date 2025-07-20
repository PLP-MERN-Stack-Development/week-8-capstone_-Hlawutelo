import { supabase } from '../lib/supabase';
import { Job, JobSearchFilters } from '../types';
import { subWeeks } from 'date-fns';

export class JobService {
  // Fetch jobs with filters
  static async searchJobs(filters: JobSearchFilters): Promise<Job[]> {
    try {
      let query = supabase
        .from('jobs')
        .select('*')
        .order('posted_at', { ascending: false });

      // Apply filters
      if (filters.query) {
        query = query.or(`title.ilike.%${filters.query}%,company.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters.jobType && filters.jobType !== 'all') {
        query = query.eq('type', filters.jobType);
      }

      if (filters.remote) {
        query = query.or('type.eq.Remote,location.ilike.%remote%');
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(job => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type as any,
        salary: job.salary,
        description: job.description,
        requirements: job.requirements || [],
        posted: job.posted_at,
        applyUrl: job.apply_url,
        saved: false,
        applied: false
      })) || [];
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
  }

  // Add a new job (for admin/system use)
  static async addJob(jobData: Omit<Job, 'id' | 'saved' | 'applied'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('jobs')
        .insert({
          title: jobData.title,
          company: jobData.company,
          location: jobData.location,
          type: jobData.type,
          salary: jobData.salary,
          description: jobData.description,
          requirements: jobData.requirements,
          apply_url: jobData.applyUrl,
          posted_at: jobData.posted,
          source: 'api'
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding job:', error);
      return false;
    }
  }

  // Save a job for a user
  static async saveJob(userId: string, jobId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .insert({
          user_id: userId,
          job_id: jobId
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving job:', error);
      return false;
    }
  }

  // Remove saved job
  static async unsaveJob(userId: string, jobId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', userId)
        .eq('job_id', jobId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error unsaving job:', error);
      return false;
    }
  }

  // Apply to a job
  static async applyToJob(userId: string, jobId: string, cvId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          user_id: userId,
          job_id: jobId,
          cv_id: cvId,
          status: 'pending'
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error applying to job:', error);
      return false;
    }
  }

  // Get user's saved jobs
  static async getSavedJobs(userId: string): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select(`
          job_id,
          jobs (*)
        `)
        .eq('user_id', userId);

      if (error) throw error;

      return data?.map(item => ({
        id: item.jobs.id,
        title: item.jobs.title,
        company: item.jobs.company,
        location: item.jobs.location,
        type: item.jobs.type as any,
        salary: item.jobs.salary,
        description: item.jobs.description,
        requirements: item.jobs.requirements || [],
        posted: item.jobs.posted_at,
        applyUrl: item.jobs.apply_url,
        saved: true,
        applied: false
      })) || [];
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      return [];
    }
  }

  // Get user's applications
  static async getUserApplications(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs (*),
          cvs (*)
        `)
        .eq('user_id', userId)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
  }

  // Clean up old jobs (older than 2 weeks)
  static async cleanupOldJobs(): Promise<boolean> {
    try {
      const twoWeeksAgo = subWeeks(new Date(), 2);
      
      const { error } = await supabase
        .from('jobs')
        .delete()
        .lt('posted_at', twoWeeksAgo.toISOString());

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error cleaning up old jobs:', error);
      return false;
    }
  }

  // Seed sample jobs (for development/demo)
  static async seedSampleJobs(): Promise<boolean> {
    const sampleJobs = [
      {
        title: 'Senior Software Engineer',
        company: 'TechCorp Global',
        location: 'San Francisco, CA, USA',
        type: 'Full-time',
        salary: '$120,000 - $180,000',
        description: 'We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing, developing, and maintaining scalable web applications.',
        requirements: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
        apply_url: 'https://example.com/apply/1',
        posted_at: new Date().toISOString(),
        source: 'seed'
      },
      {
        title: 'Frontend Developer',
        company: 'Digital Solutions Ltd',
        location: 'London, UK',
        type: 'Full-time',
        salary: '£50,000 - £75,000',
        description: 'Join our team as a Frontend Developer and help create beautiful, responsive user interfaces for our clients worldwide.',
        requirements: ['React', 'Vue.js', 'CSS', 'JavaScript', 'HTML'],
        apply_url: 'https://example.com/apply/2',
        posted_at: new Date().toISOString(),
        source: 'seed'
      },
      {
        title: 'Data Scientist',
        company: 'AI Innovations GmbH',
        location: 'Berlin, Germany',
        type: 'Full-time',
        salary: '€60,000 - €85,000',
        description: 'We seek a Data Scientist to analyze complex datasets and develop machine learning models to drive business insights.',
        requirements: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics'],
        apply_url: 'https://example.com/apply/3',
        posted_at: new Date().toISOString(),
        source: 'seed'
      }
    ];

    try {
      const { error } = await supabase
        .from('jobs')
        .insert(sampleJobs);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error seeding jobs:', error);
      return false;
    }
  }
}