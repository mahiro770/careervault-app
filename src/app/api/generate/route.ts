import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildCareerContext, buildDocPrompt } from '@/lib/career'

export async function POST(req: NextRequest) {
  const { docType, industry, focus } = await req.json()
  const supabase = createClient()

  const [{ data: jobs }, { data: profile }, { data: { user } }] = await Promise.all([
    supabase.from('jobs').select('*').order('start_date', { ascending: false }),
    supabase.from('profiles').select('*').single(),
    supabase.auth.getUser(),
  ])

  const systemPrompt = buildCareerContext(profile, jobs || [])
  const userPrompt = buildDocPrompt(docType, industry, focus)

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
        { role: 'user', content: userPrompt },
      ],
    }),
  })

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || 'エラーが発生しました。'

  await supabase.from('doc_history').insert({
    user_id: user?.id,
    doc_type: docType,
    content: text,
    industry: industry || null,
  })

  return NextResponse.json({ text })
}