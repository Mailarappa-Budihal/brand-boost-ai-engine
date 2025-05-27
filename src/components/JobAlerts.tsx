
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bell, Plus, Search, ExternalLink, Bookmark, MapPin, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createJobAlert, searchJobs } from '@/services/groqService';

interface JobAlert {
  id: string;
  name: string;
  keywords: string;
  location: string;
  jobTitle: string;
  experienceLevel: string;
  frequency: 'daily' | 'weekly';
  isActive: boolean;
  sources: string[];
  createdAt: Date;
  lastRun?: Date;
  totalJobs: number;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  postedDate: string;
  source: string;
  url: string;
  salary?: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  matchScore: number;
}

export function JobAlerts() {
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [newAlert, setNewAlert] = useState({
    name: '',
    keywords: '',
    location: '',
    jobTitle: '',
    experienceLevel: 'entry',
    frequency: 'daily' as 'daily' | 'weekly',
    sources: ['linkedin', 'indeed']
  });
  const { toast } = useToast();

  const jobSources = [
    { id: 'linkedin', name: 'LinkedIn', enabled: true },
    { id: 'indeed', name: 'Indeed', enabled: true },
    { id: 'glassdoor', name: 'Glassdoor', enabled: false },
    { id: 'remote', name: 'Remote.co', enabled: true },
    { id: 'techcareers', name: 'Tech Careers', enabled: true }
  ];

  const experienceLevels = [
    { id: 'entry', label: 'Entry Level (0-2 years)' },
    { id: 'mid', label: 'Mid Level (3-5 years)' },
    { id: 'senior', label: 'Senior Level (6+ years)' },
    { id: 'any', label: 'Any Experience Level' }
  ];

  useEffect(() => {
    // Load saved alerts
    loadSavedAlerts();
  }, []);

  const loadSavedAlerts = () => {
    // Simulate loading saved alerts
    const sampleAlerts: JobAlert[] = [
      {
        id: '1',
        name: 'Frontend Developer Remote',
        keywords: 'React, JavaScript, Frontend',
        location: 'Remote',
        jobTitle: 'Frontend Developer',
        experienceLevel: 'mid',
        frequency: 'daily',
        isActive: true,
        sources: ['linkedin', 'indeed'],
        createdAt: new Date('2024-01-15'),
        lastRun: new Date('2024-01-20'),
        totalJobs: 47
      },
      {
        id: '2',
        name: 'Data Science SF Bay Area',
        keywords: 'Python, Machine Learning, Data Science',
        location: 'San Francisco, CA',
        jobTitle: 'Data Scientist',
        experienceLevel: 'entry',
        frequency: 'weekly',
        isActive: true,
        sources: ['linkedin', 'glassdoor'],
        createdAt: new Date('2024-01-10'),
        lastRun: new Date('2024-01-17'),
        totalJobs: 23
      }
    ];
    setAlerts(sampleAlerts);
  };

  const handleCreateAlert = async () => {
    if (!newAlert.name || !newAlert.keywords) {
      toast({
        title: "Missing information",
        description: "Please provide alert name and keywords.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const alert = await createJobAlert(newAlert);
      setAlerts(prev => [...prev, alert]);
      setNewAlert({
        name: '',
        keywords: '',
        location: '',
        jobTitle: '',
        experienceLevel: 'entry',
        frequency: 'daily',
        sources: ['linkedin', 'indeed']
      });
      
      toast({
        title: "Job alert created!",
        description: "You'll receive notifications when matching jobs are found.",
      });
    } catch (error) {
      toast({
        title: "Error creating alert",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const toggleAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, isActive: !alert.isActive }
        : alert
    ));
    
    toast({
      title: "Alert updated",
      description: "Your job alert preferences have been saved.",
    });
  };

  const searchJobsForAlert = async (alert: JobAlert) => {
    setIsSearching(true);
    try {
      const foundJobs = await searchJobs({
        keywords: alert.keywords,
        location: alert.location,
        sources: alert.sources
      });
      setJobs(foundJobs);
      
      toast({
        title: "Jobs found!",
        description: `Found ${foundJobs.length} matching jobs.`,
      });
    } catch (error) {
      toast({
        title: "Error searching jobs",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const applyWithProfile = (job: Job) => {
    // Open job application with pre-filled profile data
    window.open(job.url, '_blank');
    toast({
      title: "Application opened",
      description: "Your portfolio and resume are ready to use!",
    });
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'remote': return 'bg-blue-100 text-blue-800';
      case 'full-time': return 'bg-green-100 text-green-800';
      case 'part-time': return 'bg-yellow-100 text-yellow-800';
      case 'contract': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Job Alert Engine
          </CardTitle>
          <CardDescription>
            Get personalized job notifications based on your preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create New Alert */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Create New Job Alert</h3>
              
              <div>
                <Label htmlFor="alertName">Alert Name</Label>
                <Input
                  id="alertName"
                  value={newAlert.name}
                  onChange={(e) => setNewAlert({...newAlert, name: e.target.value})}
                  placeholder="e.g., Frontend Developer Remote Jobs"
                />
              </div>

              <div>
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={newAlert.keywords}
                  onChange={(e) => setNewAlert({...newAlert, keywords: e.target.value})}
                  placeholder="e.g., React, JavaScript, Frontend Developer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobTitle">Job Title (optional)</Label>
                  <Input
                    id="jobTitle"
                    value={newAlert.jobTitle}
                    onChange={(e) => setNewAlert({...newAlert, jobTitle: e.target.value})}
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location (optional)</Label>
                  <Input
                    id="location"
                    value={newAlert.location}
                    onChange={(e) => setNewAlert({...newAlert, location: e.target.value})}
                    placeholder="San Francisco, CA or Remote"
                  />
                </div>
              </div>

              <div>
                <Label>Experience Level</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {experienceLevels.map((level) => (
                    <Button
                      key={level.id}
                      variant={newAlert.experienceLevel === level.id ? 'default' : 'outline'}
                      onClick={() => setNewAlert({...newAlert, experienceLevel: level.id})}
                      className="text-xs h-8"
                    >
                      {level.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Job Sources</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {jobSources.map((source) => (
                    <div key={source.id} className="flex items-center space-x-2">
                      <Switch
                        id={source.id}
                        checked={newAlert.sources.includes(source.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewAlert({
                              ...newAlert,
                              sources: [...newAlert.sources, source.id]
                            });
                          } else {
                            setNewAlert({
                              ...newAlert,
                              sources: newAlert.sources.filter(s => s !== source.id)
                            });
                          }
                        }}
                        disabled={!source.enabled}
                      />
                      <Label htmlFor={source.id} className="text-sm">
                        {source.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Notification Frequency</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={newAlert.frequency === 'daily' ? 'default' : 'outline'}
                    onClick={() => setNewAlert({...newAlert, frequency: 'daily'})}
                    size="sm"
                  >
                    Daily
                  </Button>
                  <Button
                    variant={newAlert.frequency === 'weekly' ? 'default' : 'outline'}
                    onClick={() => setNewAlert({...newAlert, frequency: 'weekly'})}
                    size="sm"
                  >
                    Weekly
                  </Button>
                </div>
              </div>

              <Button onClick={handleCreateAlert} disabled={isCreating} className="w-full">
                {isCreating ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Alert
                  </>
                )}
              </Button>
            </div>

            {/* Alert Tips */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tips for Better Results</h3>
              
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Use specific keywords</p>
                      <p className="text-sm text-gray-600">Include technologies, skills, and job titles</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Set realistic locations</p>
                      <p className="text-sm text-gray-600">Include "Remote" if you're open to remote work</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Choose multiple sources</p>
                      <p className="text-sm text-gray-600">Cast a wider net for better opportunities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Start with daily alerts</p>
                      <p className="text-sm text-gray-600">New jobs get applications quickly</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Job Alerts</CardTitle>
            <CardDescription>
              Manage and monitor your active job searches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Card key={alert.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{alert.name}</h4>
                        <p className="text-sm text-gray-600">{alert.keywords}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={alert.isActive}
                          onCheckedChange={() => toggleAlert(alert.id)}
                        />
                        <Badge variant={alert.isActive ? 'default' : 'secondary'}>
                          {alert.isActive ? 'Active' : 'Paused'}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {alert.location && (
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {alert.location}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {alert.frequency}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {alert.totalJobs} jobs found
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>
                        Last run: {alert.lastRun?.toLocaleDateString() || 'Never'}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => searchJobsForAlert(alert)}
                        disabled={isSearching}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        {isSearching ? 'Searching...' : 'Search Now'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Results */}
      {jobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Job Matches</CardTitle>
            <CardDescription>
              Jobs matching your alert criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{job.title}</h4>
                        <p className="text-gray-600">{job.company}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge className={getMatchColor(job.matchScore)}>
                          {job.matchScore}% match
                        </Badge>
                        <Badge className={getTypeColor(job.type)}>
                          {job.type}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{job.postedDate}</span>
                        <span>{job.source}</span>
                        {job.salary && <span>{job.salary}</span>}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Bookmark className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(job.url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Job
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => applyWithProfile(job)}
                        >
                          Apply with Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {alerts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No job alerts yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first job alert to start receiving personalized job notifications
            </p>
            <Button onClick={() => document.getElementById('alertName')?.focus()}>
              Create Your First Alert
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
