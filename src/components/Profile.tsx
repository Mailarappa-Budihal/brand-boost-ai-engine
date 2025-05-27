
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { User, Mail, Briefcase, Save, Plus, X } from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  title: string
  summary: string
  skills: string[]
  avatar_url: string
  email: string
}

export function Profile() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setProfile(data)
      } else {
        // Create default profile
        const newProfile = {
          id: user!.id,
          email: user!.email!,
          name: user!.email!.split('@')[0],
          title: '',
          summary: '',
          skills: [],
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${user!.email}`
        }
        setProfile(newProfile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async () => {
    if (!profile) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          title: profile.title,
          summary: profile.summary,
          skills: profile.skills,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Profile updated successfully! 🎉",
      })
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && profile) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      })
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    if (profile) {
      setProfile({
        ...profile,
        skills: profile.skills.filter(skill => skill !== skillToRemove)
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </CardTitle>
          <CardDescription>
            Manage your personal information and professional details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-lg">
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                {profile.email}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                🎯 Welcome to PortfolioAI! Complete your profile to get started.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Professional Title</label>
              <Input
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                placeholder="e.g., Software Engineer, Data Scientist"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Professional Summary</label>
            <Textarea
              value={profile.summary}
              onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
              placeholder="Write a brief summary about your background and career goals..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Skills</label>
            <div className="flex gap-2 mb-3">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <Button onClick={addSkill} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <Button onClick={saveProfile} disabled={saving} className="w-full">
            {saving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
