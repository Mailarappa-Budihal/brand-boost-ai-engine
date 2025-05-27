
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Play, Square, RotateCcw, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { conductMockInterview, analyzeInterviewPerformance } from '@/services/groqService';

interface InterviewQuestion {
  id: number;
  question: string;
  type: 'behavioral' | 'technical' | 'situational';
  expectedDuration: number;
}

interface InterviewSession {
  role: string;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  responses: Array<{
    question: string;
    response: string;
    duration: number;
  }>;
  isActive: boolean;
  startTime?: Date;
}

interface PerformanceAnalysis {
  overallScore: number;
  communicationScore: number;
  confidenceScore: number;
  contentScore: number;
  feedback: Array<{
    question: string;
    score: number;
    strengths: string[];
    improvements: string[];
  }>;
  tips: string[];
}

export function MockInterviewer() {
  const [selectedRole, setSelectedRole] = useState('');
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');
  const [analysis, setAnalysis] = useState<PerformanceAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const roles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'Product Manager',
    'UX Designer',
    'DevOps Engineer',
    'Machine Learning Engineer'
  ];

  const startInterview = async () => {
    if (!selectedRole) {
      toast({
        title: "Please select a role",
        description: "Choose the position you want to practice for.",
        variant: "destructive",
      });
      return;
    }

    try {
      const questions = await conductMockInterview(selectedRole);
      setSession({
        role: selectedRole,
        questions,
        currentQuestionIndex: 0,
        responses: [],
        isActive: true,
        startTime: new Date()
      });
      
      toast({
        title: "Interview started!",
        description: "Answer each question to the best of your ability.",
      });
    } catch (error) {
      toast({
        title: "Error starting interview",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        // Here you would typically send the audio to a speech-to-text service
        // For now, we'll simulate transcription
        setTimeout(() => {
          const simulatedTranscript = "This is a simulated transcription of your response.";
          setTranscript(prev => prev + simulatedTranscript + " ");
          setCurrentResponse(simulatedTranscript);
        }, 1000);
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak your answer clearly.",
      });
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to record your responses.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      toast({
        title: "Recording stopped",
        description: "Processing your response...",
      });
    }
  };

  const nextQuestion = () => {
    if (!session) return;

    // Save current response
    const updatedResponses = [...session.responses, {
      question: session.questions[session.currentQuestionIndex].question,
      response: currentResponse,
      duration: 120 // Simulated duration
    }];

    if (session.currentQuestionIndex < session.questions.length - 1) {
      setSession({
        ...session,
        currentQuestionIndex: session.currentQuestionIndex + 1,
        responses: updatedResponses
      });
      setCurrentResponse('');
      setTranscript('');
    } else {
      // Interview completed
      setSession({
        ...session,
        responses: updatedResponses,
        isActive: false
      });
      analyzePerformance(updatedResponses);
    }
  };

  const analyzePerformance = async (responses: any[]) => {
    setIsAnalyzing(true);
    try {
      const analysisResult = await analyzeInterviewPerformance(responses, selectedRole);
      setAnalysis(analysisResult);
      
      toast({
        title: "Interview analysis complete!",
        description: `Overall score: ${analysisResult.overallScore}%`,
      });
    } catch (error) {
      toast({
        title: "Error analyzing performance",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetInterview = () => {
    setSession(null);
    setTranscript('');
    setCurrentResponse('');
    setAnalysis(null);
    setIsRecording(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {!session && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              AI Mock Interviewer
            </CardTitle>
            <CardDescription>
              Practice interviews with AI and get personalized feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Target Role</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {roles.map((role) => (
                    <Button
                      key={role}
                      variant={selectedRole === role ? 'default' : 'outline'}
                      onClick={() => setSelectedRole(role)}
                      className="h-auto p-4 text-left"
                    >
                      {role}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h4 className="font-semibold">Behavioral Questions</h4>
                    <p className="text-sm text-gray-600">Tell me about a time when...</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h4 className="font-semibold">Technical Questions</h4>
                    <p className="text-sm text-gray-600">Role-specific technical challenges</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <h4 className="font-semibold">Situational Questions</h4>
                    <p className="text-sm text-gray-600">How would you handle...</p>
                  </CardContent>
                </Card>
              </div>

              <Button onClick={startInterview} size="lg" className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Start Mock Interview
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {session && session.isActive && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Mock Interview - {session.role}
              <Badge variant="secondary">
                Question {session.currentQuestionIndex + 1} of {session.questions.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress 
              value={(session.currentQuestionIndex / session.questions.length) * 100} 
              className="w-full"
            />

            <Card className="bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline">
                    {session.questions[session.currentQuestionIndex].type}
                  </Badge>
                  <Badge variant="secondary">
                    Expected: {session.questions[session.currentQuestionIndex].expectedDuration}s
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-blue-900">
                  {session.questions[session.currentQuestionIndex].question}
                </h3>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  variant={isRecording ? 'destructive' : 'default'}
                  size="lg"
                >
                  {isRecording ? (
                    <>
                      <MicOff className="h-4 w-4 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
                
                {isRecording && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Recording...</span>
                  </div>
                )}
              </div>

              {transcript && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Live Transcript</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{transcript}</p>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-4">
                <Button onClick={nextQuestion} className="flex-1">
                  {session.currentQuestionIndex < session.questions.length - 1 ? 'Next Question' : 'Finish Interview'}
                </Button>
                <Button variant="outline" onClick={resetInterview}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interview Performance Analysis</CardTitle>
              <CardDescription>
                Detailed feedback on your interview performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}%
                  </div>
                  <p className="text-sm text-gray-600">Overall Score</p>
                </div>
                
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(analysis.communicationScore)}`}>
                    {analysis.communicationScore}%
                  </div>
                  <p className="text-sm text-gray-600">Communication</p>
                </div>
                
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(analysis.confidenceScore)}`}>
                    {analysis.confidenceScore}%
                  </div>
                  <p className="text-sm text-gray-600">Confidence</p>
                </div>
                
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(analysis.contentScore)}`}>
                    {analysis.contentScore}%
                  </div>
                  <p className="text-sm text-gray-600">Content Quality</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Key Improvement Tips</h4>
                <ul className="space-y-2">
                  {analysis.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Question-by-Question Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.feedback.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-semibold">Question {index + 1}</h5>
                        <Badge variant={item.score >= 80 ? 'default' : item.score >= 60 ? 'secondary' : 'destructive'}>
                          {item.score}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{item.question}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h6 className="font-medium text-green-600 mb-2">Strengths</h6>
                          <ul className="text-sm space-y-1">
                            {item.strengths.map((strength, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <div className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h6 className="font-medium text-red-600 mb-2">Areas to Improve</h6>
                          <ul className="text-sm space-y-1">
                            {item.improvements.map((improvement, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <div className="w-1 h-1 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={resetInterview} className="flex-1">
              Start New Interview
            </Button>
            <Button variant="outline" onClick={() => setAnalysis(null)}>
              Practice More Questions
            </Button>
          </div>
        </div>
      )}

      {isAnalyzing && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-medium">Analyzing your performance...</p>
            <p className="text-gray-600">This may take a few moments</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
