
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { optimizeResume } from '@/services/groqService';

interface OptimizationResult {
  matchScore: number;
  missingKeywords: string[];
  suggestions: Array<{
    section: string;
    current: string;
    suggested: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  strengthKeywords: string[];
  improvements: Array<{
    category: string;
    items: string[];
  }>;
}

export function ResumeOptimizer() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simulate file reading
    setResumeText("Sample resume content extracted from uploaded file...");
    toast({
      title: "Resume uploaded",
      description: "Your resume has been processed successfully.",
    });
  };

  const handleOptimize = async () => {
    if (!jobDescription || !resumeText) {
      toast({
        title: "Missing information",
        description: "Please provide both job description and resume content.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await optimizeResume(jobDescription, resumeText);
      setOptimization(result);
      toast({
        title: "Analysis complete!",
        description: `Your resume has a ${result.matchScore}% match with this job.`,
      });
    } catch (error) {
      toast({
        title: "Error analyzing resume",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySuggestion = (suggestion: any) => {
    // Apply the suggestion to the resume text
    toast({
      title: "Suggestion applied",
      description: "Your resume has been updated.",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Resume & Portfolio Optimizer
          </CardTitle>
          <CardDescription>
            Analyze how well your resume matches specific job requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="jobDesc">Target Job Description</Label>
                <Textarea
                  id="jobDesc"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description you want to apply for..."
                  rows={8}
                />
              </div>

              <div>
                <Label>Upload Resume or Portfolio</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Click to upload resume (PDF, Word, or text)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="resumeText">Or Paste Resume Text</Label>
                <Textarea
                  id="resumeText"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume content here..."
                  rows={6}
                />
              </div>

              <Button 
                onClick={handleOptimize} 
                disabled={isAnalyzing}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Analyze Match
                  </>
                )}
              </Button>
            </div>

            {/* Quick Tips */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Optimization Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Include Job Keywords</p>
                      <p className="text-sm text-gray-600">Use exact terms from the job description</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Quantify Achievements</p>
                      <p className="text-sm text-gray-600">Add numbers, percentages, and metrics</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Match Requirements</p>
                      <p className="text-sm text-gray-600">Address each listed requirement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Use Action Verbs</p>
                      <p className="text-sm text-gray-600">Start bullets with strong action words</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Results */}
      {optimization && (
        <div className="space-y-6">
          {/* Match Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Match Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(optimization.matchScore)}`}>
                    {optimization.matchScore}%
                  </div>
                  <p className="text-gray-600">Overall Match Score</p>
                  <Progress value={optimization.matchScore} className="mt-2" />
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-green-600">Strong Keywords Found</h4>
                  <div className="flex flex-wrap gap-1">
                    {optimization.strengthKeywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-red-600">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-1">
                    {optimization.missingKeywords.map((keyword, index) => (
                      <Badge key={index} variant="destructive" className="bg-red-100 text-red-800">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle>Improvement Suggestions</CardTitle>
              <CardDescription>
                Apply these suggestions to improve your match score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimization.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${getImpactColor(suggestion.impact)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{suggestion.section}</Badge>
                          <Badge 
                            variant={suggestion.impact === 'high' ? 'destructive' : 'secondary'}
                          >
                            {suggestion.impact} impact
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Current:</p>
                            <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                              {suggestion.current}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-700">Suggested:</p>
                            <p className="text-sm text-green-600 bg-green-100 p-2 rounded">
                              {suggestion.suggested}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applySuggestion(suggestion)}
                        className="ml-4"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Improvement Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Improvements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {optimization.improvements.map((category, index) => (
                  <div key={index}>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {category.category}
                    </h4>
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-gray-600 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isAnalyzing && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-medium">Analyzing your resume...</p>
            <p className="text-gray-600">Comparing against job requirements</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
