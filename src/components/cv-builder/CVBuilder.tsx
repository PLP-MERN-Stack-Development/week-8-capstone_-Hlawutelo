import React, { useState, useEffect } from 'react';
import { Download, Save, Eye, User, Briefcase, GraduationCap, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { CV, WorkExperience, Education } from '../../types';
import { CVPreview } from './CVPreview';

interface CVBuilderProps {
  initialCV: CV | null;
  onSave: (cv: Partial<CV>) => void;
}

export const CVBuilder: React.FC<CVBuilderProps> = ({ initialCV, onSave }) => {
  const [cvData, setCVData] = useState<Partial<CV>>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      website: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    template: 'modern'
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialCV) {
      setCVData(initialCV);
    }
  }, [initialCV]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate save delay
    onSave(cvData);
    setIsSaving(false);
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    setCVData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo!,
        [field]: value
      }
    }));
  };

  const addExperience = () => {
    const newExperience: WorkExperience = {
      id: Math.random().toString(36).substr(2, 9),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setCVData(prev => ({
      ...prev,
      experience: [...(prev.experience || []), newExperience]
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setCVData(prev => ({
      ...prev,
      experience: prev.experience?.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ) || []
    }));
  };

  const removeExperience = (id: string) => {
    setCVData(prev => ({
      ...prev,
      experience: prev.experience?.filter(exp => exp.id !== id) || []
    }));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Math.random().toString(36).substr(2, 9),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false
    };
    setCVData(prev => ({
      ...prev,
      education: [...(prev.education || []), newEducation]
    }));
  };

  const updateEducation = (id: string, field: string, value: any) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education?.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ) || []
    }));
  };

  const removeEducation = (id: string) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education?.filter(edu => edu.id !== id) || []
    }));
  };

  const addSkill = () => {
    const skill = prompt('Enter a skill:');
    if (skill && skill.trim()) {
      setCVData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skill.trim()]
      }));
    }
  };

  const removeSkill = (index: number) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills?.filter((_, i) => i !== index) || []
    }));
  };

  const exportToPDF = () => {
    // Simulate PDF export
    alert('PDF export functionality would be implemented here. Your CV would be downloaded as a professional PDF.');
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'summary', label: 'Summary', icon: Star },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            CV Builder
          </h1>
          <p className="text-lg text-gray-600">
            Create a professional CV that stands out to employers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CV Form */}
          <div className="space-y-6">
            {/* Header Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Build Your CV</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                    className="hidden lg:flex"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    {isSaving ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save CV
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={exportToPDF}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'personal' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        value={cvData.personalInfo?.name || ''}
                        onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                        placeholder="John Doe"
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={cvData.personalInfo?.email || ''}
                        onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                        placeholder="john@example.com"
                      />
                      <Input
                        label="Phone"
                        value={cvData.personalInfo?.phone || ''}
                        onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                      <Input
                        label="Address"
                        value={cvData.personalInfo?.address || ''}
                        onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                        placeholder="City, Country"
                      />
                      <Input
                        label="LinkedIn"
                        value={cvData.personalInfo?.linkedin || ''}
                        onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                        placeholder="linkedin.com/in/johndoe"
                      />
                      <Input
                        label="Website"
                        value={cvData.personalInfo?.website || ''}
                        onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                        placeholder="johndoe.com"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'summary' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Professional Summary</h3>
                    <Textarea
                      label="Summary"
                      value={cvData.summary || ''}
                      onChange={(e) => setCVData(prev => ({ ...prev, summary: e.target.value }))}
                      placeholder="Write a brief summary of your professional background, skills, and career objectives..."
                      rows={6}
                    />
                  </div>
                )}

                {activeTab === 'experience' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                      <Button onClick={addExperience} size="sm">
                        Add Experience
                      </Button>
                    </div>
                    
                    {cvData.experience?.map((exp) => (
                      <div key={exp.id} className="bg-gray-50 rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900">Experience Entry</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExperience(exp.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Company"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            placeholder="Company Name"
                          />
                          <Input
                            label="Position"
                            value={exp.position}
                            onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                            placeholder="Job Title"
                          />
                          <Input
                            label="Start Date"
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          />
                          <Input
                            label="End Date"
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            disabled={exp.current}
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`current-${exp.id}`}
                            checked={exp.current}
                            onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor={`current-${exp.id}`} className="text-sm text-gray-700">
                            Currently working here
                          </label>
                        </div>
                        
                        <Textarea
                          label="Job Description"
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                          placeholder="Describe your responsibilities and achievements..."
                          rows={3}
                        />
                      </div>
                    ))}
                    
                    {(!cvData.experience || cvData.experience.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        <Briefcase className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No work experience added yet.</p>
                        <p className="text-sm">Click "Add Experience" to get started.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'education' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                      <Button onClick={addEducation} size="sm">
                        Add Education
                      </Button>
                    </div>
                    
                    {cvData.education?.map((edu) => (
                      <div key={edu.id} className="bg-gray-50 rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900">Education Entry</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEducation(edu.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Institution"
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                            placeholder="University Name"
                          />
                          <Input
                            label="Degree"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            placeholder="Bachelor's, Master's, etc."
                          />
                          <Input
                            label="Field of Study"
                            value={edu.field}
                            onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                            placeholder="Computer Science, Business, etc."
                          />
                          <div></div>
                          <Input
                            label="Start Date"
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                          />
                          <Input
                            label="End Date"
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                            disabled={edu.current}
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`current-edu-${edu.id}`}
                            checked={edu.current}
                            onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor={`current-edu-${edu.id}`} className="text-sm text-gray-700">
                            Currently studying here
                          </label>
                        </div>
                      </div>
                    ))}
                    
                    {(!cvData.education || cvData.education.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        <GraduationCap className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No education added yet.</p>
                        <p className="text-sm">Click "Add Education" to get started.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                      <Button onClick={addSkill} size="sm">
                        Add Skill
                      </Button>
                    </div>
                    
                    {cvData.skills && cvData.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {cvData.skills.map((skill, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(index)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Star className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No skills added yet.</p>
                        <p className="text-sm">Click "Add Skill" to get started.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CV Preview */}
          <div className="lg:block hidden">
            <CVPreview cvData={cvData as CV} />
          </div>
        </div>
      </div>
    </div>
  );
};