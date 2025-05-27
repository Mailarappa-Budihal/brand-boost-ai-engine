
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://uqaizinmxieqpgdmstow.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxYWl6aW5teGllcXBnZG1zdG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5ODQwNjIsImV4cCI6MjA2MzU2MDA2Mn0.G3c7j2m4evENil34B0BG47wVtzgxWdWUmGe0WGNBYJM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          title: string
          summary: string
          skills: string[]
          avatar_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          title?: string
          summary?: string
          skills?: string[]
          avatar_url?: string
        }
        Update: {
          name?: string
          title?: string
          summary?: string
          skills?: string[]
          avatar_url?: string
          updated_at?: string
        }
      }
      job_alerts: {
        Row: {
          id: string
          user_id: string
          title: string
          keywords: string
          location: string
          experience_level: string
          job_type: string
          remote_filter: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          user_id: string
          title: string
          keywords: string
          location: string
          experience_level: string
          job_type: string
          remote_filter: string
          is_active?: boolean
        }
        Update: {
          title?: string
          keywords?: string
          location?: string
          experience_level?: string
          job_type?: string
          remote_filter?: string
          is_active?: boolean
        }
      }
      portfolios: {
        Row: {
          id: string
          user_id: string
          content: any
          template: string
          subdomain: string
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          content: any
          template: string
          subdomain: string
          is_published?: boolean
        }
        Update: {
          content?: any
          template?: string
          is_published?: boolean
          updated_at?: string
        }
      }
    }
  }
}
