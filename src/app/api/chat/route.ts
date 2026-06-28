import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildCareerContext } from '@/lib/career'

export async function POST(req: NextRequest) {
  const { messages } = await req.json()
  const supabase = createClient()

  const [{ data: jobs }, { data: profile }] = await Promise.all([
    supabase.from('jobs').select('*').order('start_date', { ascending: false }),
    supabase.from('profiles').select('*').single(),
  ])

  const systemPrompt = buildCareerContext(profile, jobs || [])

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1000,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    }),
  })

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || 'エラーが発生しました。'
  return NextResponse.json({ text })
}
