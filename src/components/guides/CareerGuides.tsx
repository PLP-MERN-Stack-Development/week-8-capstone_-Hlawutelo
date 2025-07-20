import React, { useState } from 'react';
import { CheckCircle, Circle, Clock, Star, TrendingUp, Users, Target } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CareerGuide, GuideStep } from '../../types';

const mockGuides: CareerGuide[] = [
  {
    id: '1',
    title: 'Complete Job Search Strategy',
    description: 'A comprehensive guide to finding and landing your dream job, from preparation to negotiation.',
    estimatedTime: '2-3 weeks',
    difficulty: 'Beginner',
    steps: [
      {
        id: '1-1',
        title: 'Define Your Career Goals',
        description: 'Identify what you want in your next role and create a clear career vision.',
        completed: false
      },
      {
        id: '1-2',
        title: 'Optimize Your Resume',
        description: 'Create a compelling resume that highlights your achievements and skills.',
        completed: false
      },
      {
        id: '1-3',
        title: 'Build Your Online Presence',
        description: 'Enhance your LinkedIn profile and create a professional online brand.',
        completed: false
      },
      {
        id: '1-4',
        title: 'Research Target Companies',
        description: 'Identify companies that align with your values and career goals.',
        completed: false
      },
      {
        id: '1-5',
        title: 'Apply Strategically',
        description: 'Submit targeted applications and follow up professionally.',
        completed: false
      },
      {
        id: '1-6',
        title: 'Master the Interview Process',
        description: 'Prepare for interviews and negotiate your offer confidently.',
        completed: false
      }
    ]
  },
  {
    id: '2',
    title: 'Career Change Roadmap',
    description: 'Navigate a successful career transition with strategic planning and skill development.',
    estimatedTime: '3-6 months',
    difficulty: 'Intermediate',
    steps: [
      {
        id: '2-1',
        title: 'Assess Your Current Situation',
        description: 'Evaluate your skills, interests, and what you want to change.',
        completed: false
      },
      {
        id: '2-2',
        title: 'Explore New Career Options',
        description: 'Research different industries and roles that interest you.',
        completed: false
      },
      {
        id: '2-3',
        title: 'Identify Skill Gaps',
        description: 'Determine what new skills you need to develop for your target role.',
        completed: false
      },
      {
        id: '2-4',
        title: 'Create a Learning Plan',
        description: 'Develop a strategy to acquire new skills through courses, projects, or experience.',
        completed: false
      },
      {
        id: '2-5',
        title: 'Build Relevant Experience',
        description: 'Gain experience through volunteering, side projects, or transitional roles.',
        completed: false
      },
      {
        id: '2-6',
        title: 'Execute Your Transition',
        description: 'Make the career change with confidence and a solid plan.',
        completed: false
      }
    ]
  },
  {
    id: '3',
    title: 'Professional Networking Mastery',
    description: 'Build meaningful professional relationships that advance your career.',
    estimatedTime: '4-8 weeks',
    difficulty: 'Beginner',
    steps: [
      {
        id: '3-1',
        title: 'Define Your Networking Goals',
        description: 'Clarify what you want to achieve through networking.',
        completed: false
      },
      {
        id: '3-2',
        title: 'Audit Your Current Network',
        description: 'Map out your existing connections and identify gaps.',
        completed: false
      },
      {
        id: '3-3',
        title: 'Craft Your Personal Brand',
        description: 'Develop a clear and compelling professional story.',
        completed: false
      },
      {
        id: '3-4',
        title: 'Choose Your Networking Channels',
        description: 'Select the best platforms and events for your industry.',
        completed: false
      },
      {
        id: '3-5',
        title: 'Engage Authentically',
        description: 'Build genuine relationships through valuable interactions.',
        completed: false
      },
      {
        id: '3-6',
        title: 'Maintain and Nurture Relationships',
        description: 'Keep your network active and provide value to others.',
        completed: false
      }
    ]
  }
];

export const CareerGuides: React.FC = () => {
  const [guides, setGuides] = useState<CareerGuide[]>(mockGuides);
  const [selectedGuide, setSelectedGuide] = useState<CareerGuide | null>(null);

  const toggleStepCompletion = (guideId: string, stepId: string) => {
    setGuides(prev => prev.map(guide => {
      if (guide.id === guideId) {
        const updatedSteps = guide.steps.map(step => 
          step.id === stepId ? { ...step, completed: !step.completed } : step
        );
        const updatedGuide = { ...guide, steps: updatedSteps };
        
        // Update selected guide if it's the current one
        if (selectedGuide?.id === guideId) {
          setSelectedGuide(updatedGuide);
        }
        
        return updatedGuide;
      }
      return guide;
    }));
  };

  const getCompletionPercentage = (guide: CareerGuide) => {
    const completedSteps = guide.steps.filter(step => step.completed).length;
    return Math.round((completedSteps / guide.steps.length) * 100);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'secondary';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return Star;
      case 'Intermediate': return TrendingUp;
      case 'Advanced': return Target;
      default: return Star;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Career Guides
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Step-by-step guides to help you achieve your career goals
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Guides List */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {guides.map((guide) => {
                const DifficultyIcon = getDifficultyIcon(guide.difficulty);
                const completionPercentage = getCompletionPercentage(guide);
                
                return (
                  <div
                    key={guide.id}
                    className={`
                      bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-xl
                      ${selectedGuide?.id === guide.id ? 'ring-2 ring-blue-500' : ''}
                    `}
                    onClick={() => setSelectedGuide(guide)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {guide.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {guide.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <DifficultyIcon className="w-4 h-4" />
                        <Badge variant={getDifficultyColor(guide.difficulty)} size="sm">
                          {guide.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {guide.estimatedTime}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        {guide.steps.length} steps
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{completionPercentage}% complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                    </div>

                    <Button
                      variant={selectedGuide?.id === guide.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGuide(guide);
                      }}
                    >
                      {completionPercentage === 0 ? 'Start Guide' : 'Continue'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guide Details */}
          <div className="lg:col-span-1">
            {selectedGuide ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <h2 className="text-xl font-bold mb-2">{selectedGuide.title}</h2>
                  <p className="text-blue-100 text-sm">{selectedGuide.description}</p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {selectedGuide.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`
                          flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer
                          ${step.completed ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'}
                        `}
                        onClick={() => toggleStepCompletion(selectedGuide.id, step.id)}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {step.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-500">
                              Step {index + 1}
                            </span>
                          </div>
                          <h4 className={`font-medium mb-1 ${
                            step.completed ? 'text-green-700 line-through' : 'text-gray-900'
                          }`}>
                            {step.title}
                          </h4>
                          <p className={`text-sm ${
                            step.completed ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700 mb-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-medium">Your Progress</span>
                    </div>
                    <p className="text-sm text-blue-600">
                      {getCompletionPercentage(selectedGuide)}% complete • 
                      {selectedGuide.steps.filter(s => s.completed).length} of {selectedGuide.steps.length} steps done
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center sticky top-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Select a guide to get started
                </h3>
                <p className="text-gray-500 text-sm">
                  Choose a career guide to see detailed steps and track your progress
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};