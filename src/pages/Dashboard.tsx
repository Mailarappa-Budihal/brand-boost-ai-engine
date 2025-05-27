
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, FileText, Briefcase, MessageSquare, Target, Bell } from 'lucide-react';
import { PortfolioBuilder } from '@/components/PortfolioBuilder';
import { CVGenerator } from '@/components/CVGenerator';
import { CoverLetterWriter } from '@/components/CoverLetterWriter';
import { ResumeOptimizer } from '@/components/ResumeOptimizer';
import { MockInterviewer } from '@/components/MockInterviewer';
import { CareerCoaching } from '@/components/CareerCoaching';
import { JobAlerts } from '@/components/JobAlerts';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [userProfile, setUserProfile] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">PortfolioAI</h1>
              <p className="text-lg text-gray-600 mt-2">Your AI-powered career companion</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">Pro Plan</Badge>
              <Button variant="outline">Profile Settings</Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Portfolio Views</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Applications</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Interviews</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Match Score</p>
                  <p className="text-2xl font-bold">87%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="cv" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              CV Generator
            </TabsTrigger>
            <TabsTrigger value="cover-letter" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Cover Letter
            </TabsTrigger>
            <TabsTrigger value="optimizer" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Optimizer
            </TabsTrigger>
            <TabsTrigger value="interview" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Interview
            </TabsTrigger>
            <TabsTrigger value="coaching" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Coaching
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Job Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio">
            <PortfolioBuilder />
          </TabsContent>

          <TabsContent value="cv">
            <CVGenerator />
          </TabsContent>

          <TabsContent value="cover-letter">
            <CoverLetterWriter />
          </TabsContent>

          <TabsContent value="optimizer">
            <ResumeOptimizer />
          </TabsContent>

          <TabsContent value="interview">
            <MockInterviewer />
          </TabsContent>

          <TabsContent value="coaching">
            <CareerCoaching />
          </TabsContent>

          <TabsContent value="jobs">
            <JobAlerts />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
