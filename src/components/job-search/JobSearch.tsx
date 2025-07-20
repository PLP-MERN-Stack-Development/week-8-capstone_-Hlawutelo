import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Filter, Bookmark, Send, Zap, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Badge } from '../ui/badge';
import { Job, JobSearchFilters, CV } from '../../types';
import { calculateMatchScore, debounce } from '../../lib/utils';
import { JobService } from '../../services/jobService';
import { JobCard } from './JobCard';
import { JobDetails } from './JobDetails';

interface JobSearchProps {
  userCV: CV | null;
  userId: string | null;
}

// Mock AI-generated jobs from around the world
const generateMockJobs = (filters: JobSearchFilters, userCV: CV | null): Job[] => {
  const jobTemplates = [
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp Global',
      location: 'San Francisco, CA, USA',
      type: 'Full-time' as const,
      salary: '$120,000 - $180,000',
      description: 'We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing, developing, and maintaining scalable web applications.',
      requirements: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
      applyUrl: 'https://example.com/apply/1'
    },
    {
      title: 'Full Stack Developer',
      company: 'Innovation Labs',
      location: 'Austin, TX, USA',
      type: 'Full-time' as const,
      salary: '$90,000 - $130,000',
      description: 'Join our dynamic team to build cutting-edge web applications. Work with modern technologies and contribute to exciting projects.',
      requirements: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Docker'],
      applyUrl: 'https://example.com/apply/9'
    },
    {
      title: 'AI/ML Engineer',
      company: 'DeepTech Solutions',
      location: 'Seattle, WA, USA',
      type: 'Full-time' as const,
      salary: '$140,000 - $200,000',
      description: 'Develop and deploy machine learning models at scale. Work on cutting-edge AI projects with real-world impact.',
      requirements: ['Python', 'TensorFlow', 'PyTorch', 'Kubernetes', 'MLOps'],
      applyUrl: 'https://example.com/apply/10'
    },
    {
      title: 'Cloud Architect',
      company: 'CloudFirst Inc',
      location: 'Remote',
      type: 'Remote' as const,
      salary: '$130,000 - $180,000',
      description: 'Design and implement cloud infrastructure solutions. Lead cloud migration projects and optimize system performance.',
      requirements: ['AWS', 'Azure', 'Terraform', 'Kubernetes', 'DevOps'],
      applyUrl: 'https://example.com/apply/11'
    },
    {
      title: 'Product Designer',
      company: 'Design Studio Pro',
      location: 'Los Angeles, CA, USA',
      type: 'Contract' as const,
      salary: '$80 - $120/hour',
      description: 'Create beautiful and intuitive user experiences. Collaborate with product teams to design innovative solutions.',
      requirements: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'Design Systems'],
      applyUrl: 'https://example.com/apply/12'
    },
    {
      title: 'Frontend Developer',
      company: 'Digital Solutions Ltd',
      location: 'London, UK',
      type: 'Full-time' as const,
      salary: '£50,000 - £75,000',
      description: 'Join our team as a Frontend Developer and help create beautiful, responsive user interfaces for our clients worldwide.',
      requirements: ['React', 'Vue.js', 'CSS', 'JavaScript', 'HTML'],
      applyUrl: 'https://example.com/apply/2'
    },
    {
      title: 'Backend Engineer',
      company: 'ServerTech Ltd',
      location: 'Manchester, UK',
      type: 'Full-time' as const,
      salary: '£60,000 - £85,000',
      description: 'Build robust backend systems and APIs. Work with microservices architecture and cloud technologies.',
      requirements: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'Microservices'],
      applyUrl: 'https://example.com/apply/13'
    },
    {
      title: 'Data Scientist',
      company: 'AI Innovations GmbH',
      location: 'Berlin, Germany',
      type: 'Full-time' as const,
      salary: '€60,000 - €85,000',
      description: 'We seek a Data Scientist to analyze complex datasets and develop machine learning models to drive business insights.',
      requirements: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics'],
      applyUrl: 'https://example.com/apply/3'
    },
    {
      title: 'Cybersecurity Specialist',
      company: 'SecureNet GmbH',
      location: 'Munich, Germany',
      type: 'Full-time' as const,
      salary: '€70,000 - €95,000',
      description: 'Protect our digital infrastructure and implement security best practices. Monitor threats and respond to incidents.',
      requirements: ['Cybersecurity', 'Penetration Testing', 'CISSP', 'Network Security', 'Incident Response'],
      applyUrl: 'https://example.com/apply/14'
    },
    {
      title: 'Product Manager',
      company: 'StartupHub Inc',
      location: 'Toronto, ON, Canada',
      type: 'Full-time' as const,
      salary: 'CAD $90,000 - $120,000',
      description: 'Lead product strategy and development for our suite of SaaS applications. Work closely with engineering and design teams.',
      requirements: ['Product Management', 'Agile', 'Analytics', 'Leadership', 'Strategy'],
      applyUrl: 'https://example.com/apply/4'
    },
    {
      title: 'QA Engineer',
      company: 'QualityFirst Inc',
      location: 'Vancouver, BC, Canada',
      type: 'Full-time' as const,
      salary: 'CAD $70,000 - $95,000',
      description: 'Ensure software quality through comprehensive testing strategies. Develop automated test suites and maintain quality standards.',
      requirements: ['Test Automation', 'Selenium', 'Jest', 'Quality Assurance', 'Agile Testing'],
      applyUrl: 'https://example.com/apply/15'
    },
    {
      title: 'DevOps Engineer',
      company: 'CloudTech Solutions',
      location: 'Sydney, NSW, Australia',
      type: 'Remote' as const,
      salary: 'AUD $100,000 - $140,000',
      description: 'Design and implement CI/CD pipelines, manage cloud infrastructure, and ensure high availability of our platforms.',
      requirements: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform'],
      applyUrl: 'https://example.com/apply/5'
    },
    {
      title: 'Business Analyst',
      company: 'Analytics Pro',
      location: 'Melbourne, VIC, Australia',
      type: 'Full-time' as const,
      salary: 'AUD $80,000 - $110,000',
      description: 'Analyze business processes and requirements. Bridge the gap between business needs and technical solutions.',
      requirements: ['Business Analysis', 'SQL', 'Tableau', 'Process Modeling', 'Requirements Gathering'],
      applyUrl: 'https://example.com/apply/16'
    },
    {
      title: 'UX Designer',
      company: 'Creative Agency Pro',
      location: 'Amsterdam, Netherlands',
      type: 'Contract' as const,
      salary: '€450 - €600/day',
      description: 'Create intuitive and engaging user experiences for web and mobile applications. Collaborate with product teams.',
      requirements: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Adobe Creative Suite'],
      applyUrl: 'https://example.com/apply/6'
    },
    {
      title: 'Blockchain Developer',
      company: 'CryptoTech BV',
      location: 'Amsterdam, Netherlands',
      type: 'Full-time' as const,
      salary: '€80,000 - €120,000',
      description: 'Develop decentralized applications and smart contracts. Work with cutting-edge blockchain technologies.',
      requirements: ['Solidity', 'Web3', 'Ethereum', 'Smart Contracts', 'DeFi'],
      applyUrl: 'https://example.com/apply/17'
    },
    {
      title: 'Mobile App Developer',
      company: 'MobileTech Solutions',
      location: 'Singapore',
      type: 'Full-time' as const,
      salary: 'SGD $70,000 - $95,000',
      description: 'Develop and maintain mobile applications for iOS and Android platforms using React Native and native technologies.',
      requirements: ['React Native', 'Swift', 'Kotlin', 'Mobile Development', 'API Integration'],
      applyUrl: 'https://example.com/apply/7'
    },
    {
      title: 'Data Engineer',
      company: 'BigData Corp',
      location: 'Singapore',
      type: 'Full-time' as const,
      salary: 'SGD $90,000 - $130,000',
      description: 'Build and maintain data pipelines and infrastructure. Work with big data technologies and cloud platforms.',
      requirements: ['Apache Spark', 'Kafka', 'Python', 'AWS', 'Data Warehousing'],
      applyUrl: 'https://example.com/apply/18'
    },
    {
      title: 'Marketing Manager',
      company: 'GrowthCo',
      location: 'New York, NY, USA',
      type: 'Full-time' as const,
      salary: '$75,000 - $110,000',
      description: 'Drive marketing campaigns and growth strategies for our B2B SaaS platform. Lead a team of marketing specialists.',
      requirements: ['Digital Marketing', 'SEO', 'Content Marketing', 'Analytics', 'Leadership'],
      applyUrl: 'https://example.com/apply/8'
    },
    {
      title: 'Sales Engineer',
      company: 'TechSales Pro',
      location: 'Chicago, IL, USA',
      type: 'Full-time' as const,
      salary: '$85,000 - $140,000 + Commission',
      description: 'Combine technical expertise with sales skills to drive revenue growth. Work with enterprise clients on complex solutions.',
      requirements: ['Technical Sales', 'B2B Sales', 'Solution Architecture', 'CRM', 'Presentation Skills'],
      applyUrl: 'https://example.com/apply/19'
    }
  ];

  // Simulate AI filtering and generation
  let filteredJobs = jobTemplates.map((template, index) => ({
    ...template,
    id: `job-${index + 1}`,
    posted: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    saved: false,
    applied: false,
    matchScore: userCV ? calculateMatchScore(template, userCV) : 0
  }));

  // Apply filters
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.requirements.some(req => req.toLowerCase().includes(query))
    );
  }

  if (filters.location) {
    const location = filters.location.toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.location.toLowerCase().includes(location)
    );
  }

  if (filters.jobType && filters.jobType !== 'all') {
    filteredJobs = filteredJobs.filter(job => job.type === filters.jobType);
  }

  if (filters.remote) {
    filteredJobs = filteredJobs.filter(job => 
      job.type === 'Remote' || job.location.toLowerCase().includes('remote')
    );
  }

  // Sort by match score if user has a CV
  if (userCV) {
    filteredJobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }

  return filteredJobs;
};

export const JobSearch: React.FC<JobSearchProps> = ({
  userCV,
  userId,
}) => {
  const [filters, setFilters] = useState<JobSearchFilters>({
    query: '',
    location: '',
    jobType: 'all',
    remote: false,
    salaryMin: 0,
    experienceLevel: 'all'
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce(async (searchFilters: JobSearchFilters) => {
      setIsLoading(true);
      try {
        const newJobs = await JobService.searchJobs(searchFilters);
        
        const jobsWithMatchScore = newJobs.map(job => ({
          ...job,
          matchScore: userCV ? calculateMatchScore(job, userCV) : 0
        }));
        
        // Sort by match score if user has a CV
        if (userCV) {
          jobsWithMatchScore.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        }
        
        setJobs(jobsWithMatchScore);
      } catch (error) {
        console.error('Error searching jobs:', error);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [userCV]
  );

  // Initialize with mock data for faster loading
  useEffect(() => {
    const mockJobs = generateMockJobs(filters, userCV);
    setJobs(mockJobs);
  }, []);

  // Debounced search when filters change
  useEffect(() => {
    if (filters.query || filters.location || filters.jobType !== 'all') {
    debouncedSearch(filters);
    }
  }, [filters, debouncedSearch]);

  const handleFilterChange = (key: keyof JobSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveJob = async (job: Job) => {
    if (!userId) return;
    
    setSavedJobs(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(job.id)) {
        newSaved.delete(job.id);
        JobService.unsaveJob(userId, job.id);
      } else {
        newSaved.add(job.id);
        JobService.saveJob(userId, job.id);
      }
      return newSaved;
    });
  };

  const handleQuickApply = async (job: Job) => {
    if (!userCV || !userId) {
      alert('Please create a CV first to apply for jobs!');
      return;
    }

    try {
      const success = await JobService.applyToJob(userId, job.id, userCV.id);
      
      if (success) {
        setAppliedJobs(prev => new Set([...prev, job.id]));
        alert(`Successfully applied to ${job.title} at ${job.company}! Your CV has been automatically submitted.`);
      } else {
        alert('Failed to apply to job. Please try again.');
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      setAppliedJobs(prev => new Set([...prev, job.id]));
    }
  };

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'usa', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'germany', label: 'Germany' },
    { value: 'canada', label: 'Canada' },
    { value: 'australia', label: 'Australia' },
    { value: 'netherlands', label: 'Netherlands' },
    { value: 'singapore', label: 'Singapore' },
    { value: 'remote', label: 'Remote Only' }
  ];

  const jobTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Remote', label: 'Remote' },
    { value: 'Internship', label: 'Internship' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI-Powered Job Search
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover opportunities worldwide with intelligent matching and one-click applications
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Job title, company, or skills..."
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Select
                value={filters.location}
                onValueChange={(value) => handleFilterChange('location', value)}
                options={locationOptions}
                placeholder="Location"
                className="pl-10 h-12"
              />
            </div>

            <Select
              value={filters.jobType}
              onValueChange={(value) => handleFilterChange('jobType', value)}
              options={jobTypeOptions}
              className="h-12"
            />

            <Button 
              className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching...
                </div>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  AI Search
                </>
              )}
            </Button>
          </div>

          {userCV && (
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-700 font-medium">
                AI matching enabled - Jobs are ranked by compatibility with your CV
              </span>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {jobs.length} Jobs Found
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                Powered by AI
              </div>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))
              ) : jobs.length > 0 ? (
                jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={{...job, applied: appliedJobs.has(job.id)}}
                    isSelected={selectedJob?.id === job.id}
                    isSaved={savedJobs.has(job.id)}
                    onSelect={() => setSelectedJob(job)}
                    onSave={() => handleSaveJob(job)}
                    onQuickApply={() => handleQuickApply(job)}
                    showMatchScore={!!userCV}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search criteria or location
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Job Details */}
          <div className="lg:col-span-1">
            {selectedJob ? (
              <JobDetails
                job={{...selectedJob, applied: appliedJobs.has(selectedJob.id)}}
                isSaved={savedJobs.has(selectedJob.id)}
                onSave={() => handleSaveJob(selectedJob)}
                onApply={() => handleQuickApply(selectedJob)}
                userCV={userCV}
              />
            ) : (
              <div className="bg-white rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Select a job to view details
                </h3>
                <p className="text-gray-500 text-sm">
                  Click on any job card to see full details and apply
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};