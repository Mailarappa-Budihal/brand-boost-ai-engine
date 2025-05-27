
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, BookOpen, MessageCircle, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeSkillGaps, generateCareerAdvice, generateLearningPath } from '@/services/groqService';

interface SkillGapAnalysis {
  currentSkills: string[];
  targetRole: string;
  missingSkills: Array<{
    skill: string;
    importance: 'critical' | 'important' | 'nice-to-have';
    timeToLearn: string;
    resources: string[];
  }>;
  strengthAreas: string[];
  recommendations: string[];
  learningPath: Array<{
    phase: string;
    duration: string;
    skills: string[];
    projects: string[];
  }>;
}

export function CareerCoaching() {
  const [currentRole, setCurrentRole] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [goals, setGoals] = useState('');
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!targetRole || !skills) {
      toast({
        title: "Missing information",
        description: "Please provide target role and current skills.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeSkillGaps({
        currentRole,
        targetRole,
        experience,
        skills: skills.split(',').map(s => s.trim()),
        goals
      });
      setAnalysis(result);
      
      toast({
        title: "Analysis complete!",
        description: "Your personalized career roadmap is ready.",
      });
    } catch (error) {
      toast({
        title: "Error analyzing skills",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsChatting(true);

    try {
      const aiResponse = await generateCareerAdvice(userMessage, analysis);
      setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        content: "I'm sorry, I encountered an error. Please try asking your question again." 
      }]);
    } finally {
      setIsChatting(false);
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-500';
      case 'important': return 'bg-yellow-100 text-yellow-800 border-yellow-500';
      case 'nice-to-have': return 'bg-green-100 text-green-800 border-green-500';
      default: return 'bg-gray-100 text-gray-800 border-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            AI Career Coaching & Skill Gap Analysis
          </CardTitle>
          <CardDescription>
            Get personalized career guidance and identify skills to develop
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentRole">Current Role/Background</Label>
                <Input
                  id="currentRole"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="e.g., Marketing Coordinator, Student, Accountant"
                />
              </div>

              <div>
                <Label htmlFor="targetRole">Target Role/Career Goal</Label>
                <Input
                  id="targetRole"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g., Software Engineer, Data Scientist, Product Manager"
                />
              </div>

              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g., 2 years, Entry level, 5+ years"
                />
              </div>

              <div>
                <Label htmlFor="skills">Current Skills (comma-separated)</Label>
                <Textarea
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g., JavaScript, Excel, Project Management, Communication"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="goals">Career Goals & Timeline</Label>
                <Textarea
                  id="goals"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="e.g., Land a job at a tech company within 6 months, Transition to remote work"
                  rows={3}
                />
              </div>

              <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full" size="lg">
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Analyze Career Path
                  </>
                )}
              </Button>
            </div>

            {/* Quick Start Templates */}
            <div className="space-y-4">
              <h3 className="font-semibold">Quick Start Templates</h3>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                setCurrentRole('Marketing Coordinator');
                setTargetRole('Product Manager');
                setExperience('2 years');
                setSkills('Marketing, Analytics, Communication, Project Management');
                setGoals('Transition to product management within 12 months');
              }}>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Marketing → Product Manager</h4>
                  <p className="text-sm text-gray-600">Transition from marketing to product management</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                setCurrentRole('Recent Graduate');
                setTargetRole('Software Engineer');
                setExperience('Entry level');
                setSkills('JavaScript, Python, HTML/CSS, Git');
                setGoals('Land first software engineering job within 6 months');
              }}>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Graduate → Software Engineer</h4>
                  <p className="text-sm text-gray-600">Entry-level software engineering career path</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                setCurrentRole('Business Analyst');
                setTargetRole('Data Scientist');
                setExperience('3 years');
                setSkills('Excel, SQL, Business Analysis, Statistics');
                setGoals('Become a data scientist at a tech company');
              }}>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Analyst → Data Scientist</h4>
                  <p className="text-sm text-gray-600">Leverage analytical skills for data science</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Career Path Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">Your Strengths</h4>
                  <div className="space-y-2">
                    {analysis.strengthAreas.map((strength, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-blue-600">Skills to Develop</h4>
                  <div className="space-y-2">
                    {analysis.missingSkills.slice(0, 5).map((skill, index) => (
                      <Badge
                        key={index}
                        className={getImportanceColor(skill.importance)}
                      >
                        {skill.skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-purple-600">Key Recommendations</h4>
                  <ul className="space-y-2 text-sm">
                    {analysis.recommendations.slice(0, 3).map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skill Gap Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Skill Gap Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.missingSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold">{skill.skill}</h5>
                      <div className="flex gap-2">
                        <Badge className={getImportanceColor(skill.importance)}>
                          {skill.importance}
                        </Badge>
                        <Badge variant="outline">
                          {skill.timeToLearn}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Recommended Learning Resources:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {skill.resources.map((resource, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <BookOpen className="h-3 w-3 mt-1 flex-shrink-0" />
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Learning Path */}
          <Card>
            <CardHeader>
              <CardTitle>Personalized Learning Path</CardTitle>
              <CardDescription>
                A step-by-step roadmap to reach your career goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analysis.learningPath.map((phase, index) => (
                  <div key={index} className="relative">
                    {index < analysis.learningPath.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-300"></div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h4 className="font-semibold">{phase.phase}</h4>
                          <Badge variant="outline">{phase.duration}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium mb-2">Skills to Learn:</p>
                            <div className="flex flex-wrap gap-1">
                              {phase.skills.map((skill, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-2">Projects to Build:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {phase.projects.map((project, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <div className="w-1 h-1 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                                  {project}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Career Chat */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            AI Career Coach Chat
          </CardTitle>
          <CardDescription>
            Ask questions about your career path, industry trends, or job search strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chatMessages.length > 0 && (
              <div className="max-h-80 overflow-y-auto space-y-3 p-4 border rounded-lg bg-gray-50">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-800 border'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isChatting && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 border px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about career advice, skill development, industry trends..."
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                className="flex-1"
              />
              <Button onClick={handleChatSubmit} disabled={isChatting || !chatInput.trim()}>
                Send
              </Button>
            </div>

            {chatMessages.length === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setChatInput("What skills are most in-demand for my target role?");
                    handleChatSubmit();
                  }}
                  className="text-left h-auto p-3"
                >
                  <div>
                    <p className="font-medium">Skills in Demand</p>
                    <p className="text-xs text-gray-600">What skills are most valuable?</p>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setChatInput("How can I make my career transition faster?");
                    handleChatSubmit();
                  }}
                  className="text-left h-auto p-3"
                >
                  <div>
                    <p className="font-medium">Career Transition</p>
                    <p className="text-xs text-gray-600">Speed up your career change</p>
                  </div>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isAnalyzing && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-medium">Analyzing your career path...</p>
            <p className="text-gray-600">Creating personalized recommendations</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
