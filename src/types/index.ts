export type Job = {
  id: string
  user_id: string
  company: string
  title: string
  start_date: string | null
  end_date: string | null
  description: string | null
  achievement: string | null
  skills: string[]
  created_at: string
}

export type Profile = {
  id: string
  user_id: string
  name: string | null
  birth_date: string | null
  education: string | null
  certifications: string | null
  vision: string | null
  values: string | null
  priority: string | null
  updated_at: string
}

export type DocHistory = {
  id: string
  user_id: string
  doc_type: 'resume' | 'cv' | 'pr'
  content: string
  industry: string | null
  created_at: string
}

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}
