import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function calculateMatchScore(job: any, cv: any): number {
  if (!cv || !cv.skills) return 0;
  
  const jobRequirements = job.requirements?.join(' ').toLowerCase() || '';
  const userSkills = cv.skills.map((skill: string) => skill.toLowerCase());
  
  let matches = 0;
  userSkills.forEach((skill: string) => {
    if (jobRequirements.includes(skill)) {
      matches++;
    }
  });
  
  return Math.min(Math.round((matches / userSkills.length) * 100), 100);
}

export function generateJobId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}