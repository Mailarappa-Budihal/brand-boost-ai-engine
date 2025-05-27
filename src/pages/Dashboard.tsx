
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, FileText, Briefcase, MessageSquare, Target, Bell, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/components/Profile';
import { PortfolioBuilder } from '@/components/PortfolioBuilder';
import { CVGenerator } from '@/components/CVGenerator';
import { CoverLetterWriter } from '@/components/CoverLetterWriter';
import { ResumeOptimizer } from '@/components/ResumeOptimizer';
import { MockInterviewer } from '@/components/MockInterviewer';
import { CareerCoaching } from '@/components/CareerCoaching';
import { EnhancedJobAlerts } from '@/components/EnhancedJobAlerts';
import { ChatBot } from '@/components/ChatBot';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserProfile {
  name: string;
  email: string;
  avatar_url: string;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('name, email, avatar_url')
        .eq('id', user!.id)
        .single();

      if (data) {
        setUserProfile(data);
      } else {
        // Fallback to user data
        setUserProfile({
          name: user!.email!.split('@')[0],
          email: user!.email!,
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${user!.email}`
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                PortfolioAI
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                🚀 Your AI-powered career companion
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                ✨ Pro Plan
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-white/50">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userProfile?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {userProfile?.name?.charAt(0).toUpperCase() || '👤'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block">{userProfile?.name || 'User'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{userProfile?.name}</p>
                      <p className="text-xs text-gray-500">{userProfile?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setActiveTab('profile')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <div>
                  <p className="text-sm opacity-90">Portfolio Views</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                <div>
                  <p className="text-sm opacity-90">Applications</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <div>
                  <p className="text-sm opacity-90">Interviews</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <div>
                  <p className="text-sm opacity-90">Match Score</p>
                  <p className="text-2xl font-bold">87%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <User className="h-4 w-4" />
              <span className="hidden md:block">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <User className="h-4 w-4" />
              <span className="hidden md:block">Portfolio</span>
            </TabsTrigger>
            <TabsTrigger value="cv" className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <FileText className="h-4 w-4" />
              <span className="hidden md:block">CV</span>
            </TabsTrigger>
            <TabsTrigger value="cover-letter" className="flex items-center gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden md:block">Cover</span>
            </TabsTrigger>
            <TabsTrigger value="optimizer" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Target className="h-4 w-4" />
              <span className="hidden md:block">Optimizer</span>
            </TabsTrigger>
            <TabsTrigger value="interview" className="flex items-center gap-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden md:block">Interview</span>
            </TabsTrigger>
            <TabsTrigger value="coaching" className="flex items-center gap-2 data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Target className="h-4 w-4" />
              <span className="hidden md:block">Coaching</span>
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <Bell className="h-4 w-4" />
              <span className="hidden md:block">Jobs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Profile />
          </TabsContent>

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MockInterviewer />
              <ChatBot />
            </div>
          </TabsContent>

          <TabsContent value="coaching">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CareerCoaching />
              <ChatBot />
            </div>
          </TabsContent>

          <TabsContent value="jobs">
            <EnhancedJobAlerts />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
