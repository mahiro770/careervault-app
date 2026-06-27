import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildCareerContext, buildDocPrompt } from '@/lib/career'

export async function POST(req: NextRequest) {
  const { docType, industry, focus } = await req.json()
  const supabase = createClient()
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY

  if (!hasApiKey) {
    return NextResponse.json({
      text: '🔧 現在AI書類生成は準備中です。\n\nAnthropicのAPIキーを .env.local に設定すると利用できるようになります。\n\nその間に職歴とプロフィールを充実させておきましょう！'
    })
  }

  const [{ data: jobs }, { data: profile }, { data: { user } }] = await Promise.all([
    supabase.from('jobs').select('*').order('start_date', { ascending: false }),
    supabase.from('profiles').select('*').single(),
    supabase.auth.getUser(),
  ])

  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const systemPrompt = buildCareerContext(profile, jobs || [])
  const userPrompt = buildDocPrompt(docType, industry, focus)

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  await supabase.from('doc_history').insert({
    user_id: user?.id,
    doc_type: docType,
    content: text,
    industry: industry || null,
  })

  return NextResponse.json({ text })
}
