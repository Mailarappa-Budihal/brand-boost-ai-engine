
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { 
  Bell, 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  ExternalLink, 
  Plus,
  Trash2,
  Briefcase
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  searchLinkedInJobs, 
  createJobAlert, 
  getUserJobAlerts, 
  deleteJobAlert, 
  toggleJobAlert,
  type JobListing,
  type JobAlert 
} from '@/services/jobService'

export function EnhancedJobAlerts() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [alerts, setAlerts] = useState<JobAlert[]>([])
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  // Alert form state
  const [alertForm, setAlertForm] = useState({
    title: '',
    keywords: '',
    location: '',
    experience_level: '',
    job_type: '',
    remote_filter: ''
  })

  // Search form state
  const [searchForm, setSearchForm] = useState({
    keywords: 'Software Engineer',
    location: 'Remote',
    experience_level: 'entry level',
    job_type: 'full time',
    remote_filter: 'remote'
  })

  useEffect(() => {
    if (user) {
      fetchUserAlerts()
      handleSearch() // Auto-search on load
    }
  }, [user])

  const fetchUserAlerts = async () => {
    try {
      const userAlerts = await getUserJobAlerts(user!.id)
      setAlerts(userAlerts)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load job alerts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    setSearching(true)
    try {
      const results = await searchLinkedInJobs(searchForm)
      setJobs(results)
      toast({
        title: "Search Complete! 🎯",
        description: `Found ${results.length} job opportunities`,
      })
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Unable to search jobs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSearching(false)
    }
  }

  const handleCreateAlert = async () => {
    if (!alertForm.title || !alertForm.keywords) {
      toast({
        title: "Missing Information",
        description: "Please fill in the required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const newAlert = await createJobAlert(user!.id, {
        ...alertForm,
        is_active: true
      })
      setAlerts([newAlert, ...alerts])
      setAlertForm({
        title: '',
        keywords: '',
        location: '',
        experience_level: '',
        job_type: '',
        remote_filter: ''
      })
      setShowCreateDialog(false)
      toast({
        title: "Alert Created! 🔔",
        description: "You'll receive notifications for matching jobs",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job alert",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAlert = async (alertId: string) => {
    try {
      await deleteJobAlert(alertId)
      setAlerts(alerts.filter(alert => alert.id !== alertId))
      toast({
        title: "Alert Deleted",
        description: "Job alert has been removed",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete alert",
        variant: "destructive",
      })
    }
  }

  const handleToggleAlert = async (alertId: string, isActive: boolean) => {
    try {
      await toggleJobAlert(alertId, isActive)
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, is_active: isActive } : alert
      ))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update alert",
        variant: "destructive",
      })
    }
  }

  const getMatchScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500'
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Job Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Job Search
          </CardTitle>
          <CardDescription>
            Search for jobs based on your profile and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Keywords (e.g., React Developer)"
              value={searchForm.keywords}
              onChange={(e) => setSearchForm({ ...searchForm, keywords: e.target.value })}
            />
            <Input
              placeholder="Location (e.g., San Francisco, Remote)"
              value={searchForm.location}
              onChange={(e) => setSearchForm({ ...searchForm, location: e.target.value })}
            />
            <Select value={searchForm.experience_level} onValueChange={(value) => setSearchForm({ ...searchForm, experience_level: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Experience Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="entry level">Entry Level</SelectItem>
                <SelectItem value="associate">Associate</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
                <SelectItem value="director">Director</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={searchForm.job_type} onValueChange={(value) => setSearchForm({ ...searchForm, job_type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full time">Full Time</SelectItem>
                <SelectItem value="part time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="temporary">Temporary</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={searchForm.remote_filter} onValueChange={(value) => setSearchForm({ ...searchForm, remote_filter: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Work Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on site">On Site</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSearch} disabled={searching} className="w-full">
            {searching ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Jobs
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Job Results */}
      {jobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results ({jobs.length} jobs found)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{job.position}</h3>
                          {job.matchScore && (
                            <Badge variant="secondary" className={getMatchScoreColor(job.matchScore)}>
                              {job.matchScore}% match
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.agoTime}
                          </span>
                        </div>
                        
                        {job.salary && (
                          <div className="flex items-center gap-1 text-sm text-green-600 mb-3">
                            <DollarSign className="h-4 w-4" />
                            {job.salary}
                          </div>
                        )}
                      </div>
                      
                      <Button variant="outline" size="sm" asChild>
                        <a href={job.jobUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Job
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Alerts Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Job Alerts
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Alert
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Job Alert</DialogTitle>
                  <DialogDescription>
                    Set up a job alert to get notified about relevant opportunities
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Alert title"
                    value={alertForm.title}
                    onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
                  />
                  <Input
                    placeholder="Keywords"
                    value={alertForm.keywords}
                    onChange={(e) => setAlertForm({ ...alertForm, keywords: e.target.value })}
                  />
                  <Input
                    placeholder="Location"
                    value={alertForm.location}
                    onChange={(e) => setAlertForm({ ...alertForm, location: e.target.value })}
                  />
                  <Button onClick={handleCreateAlert} className="w-full">
                    Create Alert
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>
            Manage your job alerts and get notified about new opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading alerts...</div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No job alerts yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <Card key={alert.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{alert.title}</h4>
                      <p className="text-sm text-gray-600">
                        {alert.keywords} • {alert.location || 'Any location'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={alert.is_active}
                        onCheckedChange={(checked) => handleToggleAlert(alert.id, checked)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAlert(alert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
