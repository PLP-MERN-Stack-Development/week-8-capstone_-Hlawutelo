import React from 'react';
import { MapPin, Clock, DollarSign, Users, Star, Send, Bookmark, ExternalLink, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Job, CV } from '../../types';
import { formatDate } from '../../lib/utils';

interface JobDetailsProps {
  job: Job;
  isSaved: boolean;
  onSave: () => void;
  onApply: () => void;
  userCV: CV | null;
}

export const JobDetails: React.FC<JobDetailsProps> = ({
  job,
  isSaved,
  onSave,
  onApply,
  userCV
}) => {
  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMatchingSkills = () => {
    if (!userCV || !userCV.skills) return [];
    return job.requirements.filter(req => 
      userCV.skills.some(skill => 
        skill.toLowerCase().includes(req.toLowerCase()) ||
        req.toLowerCase().includes(skill.toLowerCase())
      )
    );
  };

  const matchingSkills = getMatchingSkills();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h2>
              <p className="text-lg text-gray-600 font-medium">{job.company}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSave}
              className={`p-2 ${isSaved ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {job.applied && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-green-700">
                <Send className="w-4 h-4" />
                <span className="font-medium">Application Submitted</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Your CV has been automatically sent to the employer
              </p>
            </div>
          )}

          {userCV && job.matchScore !== undefined && (
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${getMatchScoreColor(job.matchScore)}`}>
              <Star className="w-4 h-4" />
              {job.matchScore}% Match Score
            </div>
          )}
        </div>

        {/* Job Info */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Posted {formatDate(job.posted)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success">{job.type}</Badge>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
          <p className="text-gray-700 leading-relaxed">{job.description}</p>
        </div>

        {/* Requirements */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
          <div className="space-y-2">
            {job.requirements.map((req) => {
              const isMatching = matchingSkills.includes(req);
              return (
                <div
                  key={req}
                  className={`flex items-center gap-2 p-2 rounded-lg ${
                    isMatching ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                  }`}
                >
                  {isMatching && <Star className="w-4 h-4 text-green-600" />}
                  <Badge 
                    variant={isMatching ? 'success' : 'secondary'} 
                    size="sm"
                  >
                    {req}
                  </Badge>
                  {isMatching && (
                    <span className="text-xs text-green-600 font-medium">Matched!</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {userCV && matchingSkills.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <Zap className="w-4 h-4" />
              <span className="font-medium">AI Recommendation</span>
            </div>
            <p className="text-sm text-blue-600">
              You match {matchingSkills.length} out of {job.requirements.length} requirements. 
              This position aligns well with your CV profile!
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
            onClick={onApply}
            disabled={job.applied || !userCV}
          >
            {job.applied ? (
              <>
                <Send className="w-4 h-4 mr-2" />
                Applied
              </>
            ) : !userCV ? (
              'Create CV to Apply'
            ) : (
              <>
                <Star className="w-4 h-4 mr-2" />
                Quick Apply with CV
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(job.applyUrl, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Original Posting
          </Button>
        </div>

        {!userCV && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">
              <strong>Tip:</strong> Create your CV to enable one-click applications and see your match scores!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};