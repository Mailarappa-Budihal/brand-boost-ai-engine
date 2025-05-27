
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Copy, Sparkles, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateCoverLetter } from '@/services/groqService';

export function CoverLetterWriter() {
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [tone, setTone] = useState('professional');
  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const tones = [
    { id: 'professional', label: 'Professional', description: 'Formal and business-like' },
    { id: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and passionate' },
    { id: 'concise', label: 'Concise', description: 'Brief and to the point' },
    { id: 'creative', label: 'Creative', description: 'Unique and innovative' }
  ];

  const handleGenerate = async () => {
    if (!jobDescription && !jobUrl) {
      toast({
        title: "Missing information",
        description: "Please provide either a job description or job URL.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await generateCoverLetter({
        jobDescription,
        jobUrl,
        company,
        position,
        tone
      });
      setCoverLetter(generated);
      setIsEditing(true);
      toast({
        title: "Cover letter generated!",
        description: "Your personalized cover letter is ready.",
      });
    } catch (error) {
      toast({
        title: "Error generating cover letter",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    toast({
      title: "Copied to clipboard!",
      description: "Cover letter copied successfully.",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([coverLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${company || 'job'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Cover letter downloaded!",
      description: "File saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Cover Letter Writer
          </CardTitle>
          <CardDescription>
            Generate tailored cover letters for specific job applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Job Information</h3>
              
              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g., Google, Microsoft, Startup Inc."
                />
              </div>

              <div>
                <Label htmlFor="position">Position Title</Label>
                <Input
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g., Software Engineer, Data Analyst"
                />
              </div>

              <div>
                <Label htmlFor="jobUrl">Job URL (Optional)</Label>
                <Input
                  id="jobUrl"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={8}
                />
              </div>
            </div>

            {/* Tone Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tone & Style</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {tones.map((toneOption) => (
                  <Card
                    key={toneOption.id}
                    className={`cursor-pointer transition-colors ${
                      tone === toneOption.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setTone(toneOption.id)}
                  >
                    <CardContent className="p-4">
                      <h4 className="font-semibold">{toneOption.label}</h4>
                      <p className="text-sm text-gray-600">{toneOption.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Tips for Better Results</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Include specific requirements from the job posting</li>
                  <li>• Mention the company name and position</li>
                  <li>• Highlight relevant keywords</li>
                  <li>• Keep the description detailed but focused</li>
                </ul>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating} 
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Cover Letter
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Cover Letter */}
      {coverLetter && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generated Cover Letter
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-2">
              <Badge variant="secondary">Tone: {tone}</Badge>
              {company && <Badge variant="outline">Company: {company}</Badge>}
              {position && <Badge variant="outline">Position: {position}</Badge>}
            </div>
            
            <Textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={20}
              className="font-mono text-sm"
              placeholder="Your generated cover letter will appear here..."
            />
            
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Review Checklist</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Check that company and position names are correct</li>
                <li>• Ensure your relevant skills are highlighted</li>
                <li>• Verify the tone matches the company culture</li>
                <li>• Add any specific achievements or metrics</li>
                <li>• Proofread for grammar and spelling</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cover Letter Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Templates</CardTitle>
          <CardDescription>
            Use these as starting points for different types of applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Entry Level</h4>
                <p className="text-sm text-gray-600">Perfect for new graduates and career changers</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Technical Role</h4>
                <p className="text-sm text-gray-600">Focuses on technical skills and projects</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Career Change</h4>
                <p className="text-sm text-gray-600">Highlights transferable skills</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
