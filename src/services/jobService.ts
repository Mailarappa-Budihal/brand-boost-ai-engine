
import { supabase } from '@/lib/supabase'

// LinkedIn Jobs API integration
export interface JobListing {
  position: string
  company: string
  companyLogo?: string
  location: string
  date: string
  agoTime: string
  salary: string
  jobUrl: string
  matchScore?: number
}

export interface JobAlert {
  id: string
  title: string
  keywords: string
  location: string
  experience_level: string
  job_type: string
  remote_filter: string
  is_active: boolean
}

export async function searchLinkedInJobs(params: {
  keywords: string
  location: string
  experienceLevel?: string
  jobType?: string
  remoteFilter?: string
  limit?: string
}): Promise<JobListing[]> {
  try {
    // Since we can't directly use the LinkedIn jobs API in the browser,
    // we'll simulate the response with realistic data
    // In production, this would be handled by a backend service
    
    const mockJobs: JobListing[] = [
      {
        position: `Senior ${params.keywords}`,
        company: "TechCorp Solutions",
        companyLogo: "https://via.placeholder.com/50x50",
        location: params.location || "San Francisco, CA",
        date: new Date().toISOString().split('T')[0],
        agoTime: "2 days ago",
        salary: "$80,000 - $120,000",
        jobUrl: "https://linkedin.com/jobs/view/1234567",
        matchScore: 92
      },
      {
        position: `${params.keywords} Developer`,
        company: "Innovation Labs",
        companyLogo: "https://via.placeholder.com/50x50",
        location: params.location || "Remote",
        date: new Date().toISOString().split('T')[0],
        agoTime: "1 day ago",
        salary: "$70,000 - $100,000",
        jobUrl: "https://linkedin.com/jobs/view/1234568",
        matchScore: 87
      },
      {
        position: `Junior ${params.keywords}`,
        company: "StartupXYZ",
        companyLogo: "https://via.placeholder.com/50x50",
        location: params.location || "New York, NY",
        date: new Date().toISOString().split('T')[0],
        agoTime: "3 hours ago",
        salary: "$60,000 - $85,000",
        jobUrl: "https://linkedin.com/jobs/view/1234569",
        matchScore: 78
      }
    ]

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    return mockJobs
  } catch (error) {
    console.error('Error searching LinkedIn jobs:', error)
    throw new Error('Failed to search jobs')
  }
}

export async function createJobAlert(userId: string, alertData: Omit<JobAlert, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('job_alerts')
      .insert([{ ...alertData, user_id: userId }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating job alert:', error)
    throw error
  }
}

export async function getUserJobAlerts(userId: string) {
  try {
    const { data, error } = await supabase
      .from('job_alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching job alerts:', error)
    throw error
  }
}

export async function deleteJobAlert(alertId: string) {
  try {
    const { error } = await supabase
      .from('job_alerts')
      .delete()
      .eq('id', alertId)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting job alert:', error)
    throw error
  }
}

export async function toggleJobAlert(alertId: string, isActive: boolean) {
  try {
    const { error } = await supabase
      .from('job_alerts')
      .update({ is_active: isActive })
      .eq('id', alertId)

    if (error) throw error
  } catch (error) {
    console.error('Error toggling job alert:', error)
    throw error
  }
}
