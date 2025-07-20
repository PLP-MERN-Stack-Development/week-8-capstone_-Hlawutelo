import React from 'react';
import { MapPin, Clock, Bookmark, Send, TrendingUp, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Job } from '../../types';
import { formatDate } from '../../lib/utils';

interface JobCardProps {
  job: Job;
  isSelected: boolean;
  isSaved: boolean;
  onSelect: () => void;
  onSave: () => void;
  onQuickApply: () => void;
  showMatchScore: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSelected,
  isSaved,
  onSelect,
  onSave,
  onQuickApply,
  showMatchScore
}) => {
  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time': return 'success';
      case 'Part-time': return 'warning';
      case 'Contract': return 'secondary';
      case 'Remote': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div 
      className={`
        bg-white rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg
        ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'}
        ${job.applied ? 'bg-gradient-to-r from-green-50 to-white' : ''}
      `}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {job.title}
            </h3>
            {job.applied && (
              <Badge variant="success" size="sm">
                <Send className="w-3 h-3 mr-1" />
                Applied
              </Badge>
            )}
          </div>
          <p className="text-gray-600 font-medium mb-2">{job.company}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDate(job.posted)}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
            className={`p-2 ${isSaved ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
          
          {showMatchScore && job.matchScore !== undefined && (
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(job.matchScore)}`}>
              {job.matchScore}% match
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Badge variant={getTypeColor(job.type)} size="sm">
          {job.type}
        </Badge>
        <span className="text-sm font-medium text-gray-700">{job.salary}</span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {job.requirements.slice(0, 3).map((req) => (
            <Badge key={req} variant="secondary" size="sm">
              {req}
            </Badge>
          ))}
          {job.requirements.length > 3 && (
            <Badge variant="secondary" size="sm">
              +{job.requirements.length - 3}
            </Badge>
          )}
        </div>

        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onQuickApply();
          }}
          disabled={job.applied}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {job.applied ? (
            <>
              <Send className="w-3 h-3 mr-1" />
              Applied
            </>
          ) : (
            <>
              <Star className="w-3 h-3 mr-1" />
              Quick Apply
            </>
          )}
        </Button>
      </div>
    </div>
  );
};