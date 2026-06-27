import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildCareerContext } from '@/lib/career'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const [{ data: jobs }, { data: profile }] = await Promise.all([
    supabase.from('jobs').select('*').order('start_date', { ascending: false }),
    supabase.from('profiles').select('*').single(),
  ])

  const hasApiKey = !!process.env.ANTHROPIC_API_KEY

  if (!hasApiKey) {
    return NextResponse.json({
      text: '🔧 現在AIキャリア相談は準備中です。\n\nAnthropicのAPIキーを .env.local に設定すると利用できるようになります。\n\nまずは職歴登録とプロフィールの入力を進めておきましょう！'
    })
  }

  const { messages } = await req.json()
  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const systemPrompt = buildCareerContext(profile, jobs || [])

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    system: systemPrompt,
    messages,
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return NextResponse.json({ text })
}
