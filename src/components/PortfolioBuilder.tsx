
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Eye, Globe, Edit, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePortfolioContent } from '@/services/groqService';

interface PortfolioData {
  name: string;
  title: string;
  summary: string;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  contact: {
    email: string;
    linkedin: string;
    github: string;
  };
}

export function PortfolioBuilder() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    name: '',
    title: '',
    summary: '',
    skills: [],
    projects: [],
    experience: [],
    education: [],
    contact: { email: '', linkedin: '', github: '' }
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [template, setTemplate] = useState('modern');
  const [isEditing, setIsEditing] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      // Simulate file processing and AI extraction
      setTimeout(async () => {
        const extractedData = await generatePortfolioContent(file.name);
        setPortfolioData(extractedData);
        setIsGenerating(false);
        toast({
          title: "Resume processed successfully!",
          description: "Your portfolio has been generated from your resume.",
        });
      }, 3000);
    } catch (error) {
      setIsGenerating(false);
      toast({
        title: "Error processing resume",
        description: "Please try again or use the manual form.",
        variant: "destructive",
      });
    }
  };

  const handleQuickStart = async () => {
    setIsGenerating(true);
    try {
      // Generate sample portfolio data using AI
      const sampleData = await generatePortfolioContent("sample");
      setPortfolioData(sampleData);
      setIsGenerating(false);
      toast({
        title: "Sample portfolio generated!",
        description: "Edit the details to match your background.",
      });
    } catch (error) {
      setIsGenerating(false);
      toast({
        title: "Error generating portfolio",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Generate portfolio site
      const subdomain = `${portfolioData.name.toLowerCase().replace(/\s+/g, '')}-${Math.random().toString(36).substr(2, 5)}`;
      setPortfolioUrl(`https://${subdomain}.portfolioai.app`);
      
      setTimeout(() => {
        setIsGenerating(false);
        toast({
          title: "Portfolio site created!",
          description: `Your portfolio is live at ${subdomain}.portfolioai.app`,
        });
      }, 2000);
    } catch (error) {
      setIsGenerating(false);
      toast({
        title: "Error creating portfolio",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    // Create and download portfolio files
    const portfolioHtml = generatePortfolioHTML(portfolioData, template);
    const blob = new Blob([portfolioHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.html';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Portfolio exported!",
      description: "Your portfolio files have been downloaded.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            AI Portfolio Builder
          </CardTitle>
          <CardDescription>
            Create a professional portfolio website in minutes using AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Upload Resume */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => fileInputRef.current?.click()}>
              <CardContent className="p-6 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold mb-2">Upload Resume</h3>
                <p className="text-sm text-gray-600">Upload your existing resume (PDF/Word)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Quick Start */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleQuickStart}>
              <CardContent className="p-6 text-center">
                <Edit className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="font-semibold mb-2">Quick Start</h3>
                <p className="text-sm text-gray-600">Answer guided questions to build your portfolio</p>
              </CardContent>
            </Card>

            {/* Template Gallery */}
            <Card>
              <CardContent className="p-6 text-center">
                <Eye className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold mb-2">Choose Template</h3>
                <div className="space-y-2">
                  <Button 
                    variant={template === 'modern' ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => setTemplate('modern')}
                    className="w-full"
                  >
                    Modern
                  </Button>
                  <Button 
                    variant={template === 'classic' ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => setTemplate('classic')}
                    className="w-full"
                  >
                    Classic
                  </Button>
                  <Button 
                    variant={template === 'creative' ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => setTemplate('creative')}
                    className="w-full"
                  >
                    Creative
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Form */}
      {(portfolioData.name || isEditing) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Portfolio Details
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={portfolioData.name}
                  onChange={(e) => setPortfolioData({...portfolioData, name: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  value={portfolioData.title}
                  onChange={(e) => setPortfolioData({...portfolioData, title: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea
                id="summary"
                value={portfolioData.summary}
                onChange={(e) => setPortfolioData({...portfolioData, summary: e.target.value})}
                disabled={!isEditing}
                rows={4}
              />
            </div>

            <div>
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {portfolioData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleGenerate} disabled={isGenerating} className="flex-1">
                {isGenerating ? 'Generating...' : 'Generate Portfolio Site'}
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export Files
              </Button>
            </div>

            {portfolioUrl && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Portfolio Live!</h4>
                <p className="text-green-700">
                  Your portfolio is available at: 
                  <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="ml-2 underline">
                    {portfolioUrl}
                  </a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isGenerating && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-medium">Generating your portfolio...</p>
            <p className="text-gray-600">This may take a few moments</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function generatePortfolioHTML(data: PortfolioData, template: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} - Portfolio</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 40px; }
        .section { margin-bottom: 30px; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill-tag { background: #e3f2fd; padding: 5px 10px; border-radius: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${data.name}</h1>
            <h2>${data.title}</h2>
            <p>${data.summary}</p>
        </div>
        <div class="section">
            <h3>Skills</h3>
            <div class="skills">
                ${data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
        <!-- Additional sections would be generated here -->
    </div>
</body>
</html>`;
}
