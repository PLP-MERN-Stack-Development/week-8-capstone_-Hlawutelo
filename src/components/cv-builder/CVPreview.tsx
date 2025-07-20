import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Calendar } from 'lucide-react';
import { CV } from '../../types';

interface CVPreviewProps {
  cvData: CV;
}

export const CVPreview: React.FC<CVPreviewProps> = ({ cvData }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">CV Preview</h2>
        <p className="text-blue-100">See how your CV will look</p>
      </div>

      <div className="p-8 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {cvData.personalInfo?.name || 'Your Name'}
          </h1>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            {cvData.personalInfo?.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {cvData.personalInfo.email}
              </div>
            )}
            {cvData.personalInfo?.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {cvData.personalInfo.phone}
              </div>
            )}
            {cvData.personalInfo?.address && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {cvData.personalInfo.address}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-gray-600">
            {cvData.personalInfo?.linkedin && (
              <div className="flex items-center gap-1">
                <Linkedin className="w-4 h-4" />
                {cvData.personalInfo.linkedin}
              </div>
            )}
            {cvData.personalInfo?.website && (
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {cvData.personalInfo.website}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {cvData.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{cvData.summary}</p>
          </div>
        )}

        {/* Experience */}
        {cvData.experience && cvData.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-1">
              Work Experience
            </h2>
            <div className="space-y-6">
              {cvData.experience.map((exp) => (
                <div key={exp.id} className="border-l-4 border-blue-200 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                  <div className="text-blue-600 font-medium mb-1">{exp.company}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {cvData.education && cvData.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-1">
              Education
            </h2>
            <div className="space-y-4">
              {cvData.education.map((edu) => (
                <div key={edu.id} className="border-l-4 border-purple-200 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {edu.degree} in {edu.field}
                  </h3>
                  <div className="text-purple-600 font-medium mb-1">{edu.institution}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {cvData.skills && cvData.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-1">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {cvData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!cvData.personalInfo?.name && !cvData.summary && (!cvData.experience || cvData.experience.length === 0) && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">Start filling out your CV to see the preview</p>
            <p className="text-sm">Your professional CV will appear here as you add information</p>
          </div>
        )}
      </div>
    </div>
  );
};