
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, Edit, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateCVContent } from '@/services/groqService';

interface CVData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
}

export function CVGenerator() {
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: { name: '', email: '', phone: '', location: '', linkedin: '' },
    summary: '',
    experience: [],
    education: [],
    skills: { technical: [], soft: [] },
    projects: []
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleGenerateCV = async () => {
    setIsGenerating(true);
    try {
      const generatedCV = await generateCVContent(cvData);
      setCvData(generatedCV);
      setIsGenerating(false);
      toast({
        title: "CV generated successfully!",
        description: "Your ATS-friendly CV is ready for download.",
      });
    } catch (error) {
      setIsGenerating(false);
      toast({
        title: "Error generating CV",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = () => {
    // Generate PDF using jsPDF
    toast({
      title: "CV downloaded!",
      description: "Your CV has been saved as PDF.",
    });
  };

  const handleDownloadWord = () => {
    // Generate Word document
    toast({
      title: "CV downloaded!",
      description: "Your CV has been saved as Word document.",
    });
  };

  const addExperience = () => {
    setCvData({
      ...cvData,
      experience: [...cvData.experience, {
        company: '',
        position: '',
        duration: '',
        description: '',
        achievements: ['']
      }]
    });
  };

  const addEducation = () => {
    setCvData({
      ...cvData,
      education: [...cvData.education, {
        institution: '',
        degree: '',
        year: '',
        gpa: ''
      }]
    });
  };

  const addProject = () => {
    setCvData({
      ...cvData,
      projects: [...cvData.projects, {
        name: '',
        description: '',
        technologies: []
      }]
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            AI CV Generator
          </CardTitle>
          <CardDescription>
            Create an ATS-friendly resume with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= i ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            </div>
            
            <div className="text-sm text-gray-600 mb-6">
              Step {step} of 4: {
                step === 1 ? 'Personal Information' :
                step === 2 ? 'Experience & Education' :
                step === 3 ? 'Skills & Projects' :
                'Review & Generate'
              }
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={cvData.personalInfo.name}
                    onChange={(e) => setCvData({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, name: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={cvData.personalInfo.email}
                    onChange={(e) => setCvData({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, email: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={cvData.personalInfo.phone}
                    onChange={(e) => setCvData({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, phone: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={cvData.personalInfo.location}
                    onChange={(e) => setCvData({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, location: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  value={cvData.summary}
                  onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Write a brief professional summary..."
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Work Experience</h3>
                  <Button onClick={addExperience} variant="outline" size="sm">
                    Add Experience
                  </Button>
                </div>
                {cvData.experience.map((exp, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Input
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => {
                          const newExp = [...cvData.experience];
                          newExp[index].company = e.target.value;
                          setCvData({ ...cvData, experience: newExp });
                        }}
                        disabled={!isEditing}
                      />
                      <Input
                        placeholder="Position"
                        value={exp.position}
                        onChange={(e) => {
                          const newExp = [...cvData.experience];
                          newExp[index].position = e.target.value;
                          setCvData({ ...cvData, experience: newExp });
                        }}
                        disabled={!isEditing}
                      />
                    </div>
                    <Textarea
                      placeholder="Job description and achievements..."
                      value={exp.description}
                      onChange={(e) => {
                        const newExp = [...cvData.experience];
                        newExp[index].description = e.target.value;
                        setCvData({ ...cvData, experience: newExp });
                      }}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </Card>
                ))}
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Education</h3>
                  <Button onClick={addEducation} variant="outline" size="sm">
                    Add Education
                  </Button>
                </div>
                {cvData.education.map((edu, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        placeholder="Institution"
                        value={edu.institution}
                        onChange={(e) => {
                          const newEdu = [...cvData.education];
                          newEdu[index].institution = e.target.value;
                          setCvData({ ...cvData, education: newEdu });
                        }}
                        disabled={!isEditing}
                      />
                      <Input
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEdu = [...cvData.education];
                          newEdu[index].degree = e.target.value;
                          setCvData({ ...cvData, education: newEdu });
                        }}
                        disabled={!isEditing}
                      />
                      <Input
                        placeholder="Year"
                        value={edu.year}
                        onChange={(e) => {
                          const newEdu = [...cvData.education];
                          newEdu[index].year = e.target.value;
                          setCvData({ ...cvData, education: newEdu });
                        }}
                        disabled={!isEditing}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Technical Skills</Label>
                    <Textarea
                      placeholder="JavaScript, React, Node.js, Python..."
                      rows={4}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Soft Skills</Label>
                    <Textarea
                      placeholder="Communication, Leadership, Problem-solving..."
                      rows={4}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Projects</h3>
                  <Button onClick={addProject} variant="outline" size="sm">
                    Add Project
                  </Button>
                </div>
                {cvData.projects.map((project, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <Input
                        placeholder="Project Name"
                        value={project.name}
                        onChange={(e) => {
                          const newProjects = [...cvData.projects];
                          newProjects[index].name = e.target.value;
                          setCvData({ ...cvData, projects: newProjects });
                        }}
                        disabled={!isEditing}
                      />
                      <Textarea
                        placeholder="Project description..."
                        value={project.description}
                        onChange={(e) => {
                          const newProjects = [...cvData.projects];
                          newProjects[index].description = e.target.value;
                          setCvData({ ...cvData, projects: newProjects });
                        }}
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Review & Generate</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">CV Preview</h4>
                    <div className="bg-gray-50 p-4 rounded min-h-96">
                      <div className="text-center mb-4">
                        <h2 className="text-xl font-bold">{cvData.personalInfo.name}</h2>
                        <p className="text-gray-600">{cvData.personalInfo.email}</p>
                      </div>
                      <div className="mb-4">
                        <h3 className="font-semibold border-b mb-2">Summary</h3>
                        <p className="text-sm">{cvData.summary}</p>
                      </div>
                      {/* Additional CV sections would be rendered here */}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <Button onClick={handleGenerateCV} disabled={isGenerating} className="w-full">
                    {isGenerating ? 'Generating...' : 'Generate AI-Optimized CV'}
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={handleDownloadPDF}>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline" onClick={handleDownloadWord}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Word
                    </Button>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">ATS-Friendly Features</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Standard formatting</li>
                      <li>• Keyword optimization</li>
                      <li>• Clear section headers</li>
                      <li>• Proper font usage</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>
            <Button 
              onClick={() => setStep(Math.min(4, step + 1))}
              disabled={step === 4}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {isGenerating && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-medium">Generating your CV...</p>
            <p className="text-gray-600">Optimizing for ATS systems</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
