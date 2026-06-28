'use client'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ChatMessage } from '@/types'

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*\*([^*\n]+)\*\*\*/g, '$1')  // ***bold italic***
    .replace(/\*\*([^*\n]+)\*\*/g, '$1')        // **bold**
    .replace(/\*([^*\n]+)\*/g, '$1')             // *italic*
    .replace(/^#{1,6} */gm, '')                  // ## 見出し（スペースなしも対応）
    .replace(/\*/g, '')                           // 残った * をすべて除去
    .replace(/`([^`\n]+)`/g, '$1')               // `code`
}

const WELCOME: ChatMessage = {
  role: 'assistant',
  content: 'こんにちは！CareerVaultのAIアシスタントです。\nあなたの職歴・プロフィール情報をもとに、キャリア相談に乗ります。\n\n転職の方向性、強みの整理、面接対策など、何でも聞いてください。',
}

const SUGGESTIONS = [
  '私のキャリアの強みを分析してください',
  '転職するならどんな方向性が合っていますか？',
  '今のキャリアで足りていないスキルを教えてください',
  '5年後のキャリアビジョンについてアドバイスください',
  '面接でよく聞かれることを教えてください',
]

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const supabase = createClient()

  useEffect(() => { loadHistory() }, [])

  async function loadHistory() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserId(user.id)

    const { data } = await supabase
      .from('chat_messages')
      .select('role, content')
      .order('created_at', { ascending: true })

    if (data && data.length > 0) {
      setMessages([WELCOME, ...data.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))])
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }

  async function send(text?: string) {
    const msg = (text ?? input).trim()
    if (!msg || loading) return

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: msg }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) }),
    })
    const { text: reply } = await res.json()

    setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    setLoading(false)
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)

    if (userId) {
      await supabase.from('chat_messages').insert([
        { user_id: userId, role: 'user', content: msg },
        { user_id: userId, role: 'assistant', content: reply },
      ])
    }
  }

  async function clearHistory() {
    if (!userId) return
    if (!confirm('会話履歴をすべて削除しますか？')) return
    setClearing(true)
    await supabase.from('chat_messages').delete().eq('user_id', userId)
    setMessages([WELCOME])
    setClearing(false)
  }

  return (
    <div>
      <div className="mb-7 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">AIキャリア相談</h1>
          <p className="text-sm text-ink-3 mt-1">あなたの経歴を把握したAIが、壁打ち相手になります</p>
        </div>
        <button
          onClick={clearHistory}
          disabled={clearing || messages.length <= 1}
          className="text-xs text-ink-3 hover:text-red-500 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-30 mt-1">
          {clearing ? '削除中...' : '履歴をクリア'}
        </button>
      </div>

      <div className="card">
        {/* Quick suggestions */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {SUGGESTIONS.map(s => (
            <button key={s}
              className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-ink-2 hover:bg-accent-light hover:text-accent hover:border-accent transition-colors"
              onClick={() => send(s)}>
              {s}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="min-h-[320px] max-h-[460px] overflow-y-auto flex flex-col gap-4 pb-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2.5 items-start ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full text-[13px] flex items-center justify-center shrink-0 font-semibold
                ${m.role === 'assistant' ? 'bg-accent-light text-accent' : 'bg-ink text-white'}`}>
                {m.role === 'assistant' ? 'CV' : 'あ'}
              </div>
              <div className={`max-w-[78%] px-3.5 py-2.5 rounded-xl text-[13.5px] leading-relaxed whitespace-pre-wrap
                ${m.role === 'assistant'
                  ? 'bg-surface-2 text-ink rounded-tl-sm'
                  : 'bg-accent text-white rounded-tr-sm'}`}>
                {m.role === 'assistant' ? stripMarkdown(m.content) : m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2.5 items-start">
              <div className="w-8 h-8 rounded-full bg-accent-light text-accent flex items-center justify-center text-[13px] font-semibold shrink-0">CV</div>
              <div className="bg-surface-2 px-4 py-3 rounded-xl rounded-tl-sm">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-ink-3 animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2 border-t border-gray-100 pt-3">
          <textarea ref={textareaRef} rows={1}
            className="form-input flex-1 resize-none min-h-[44px] max-h-[120px]"
            placeholder="キャリアについて何でも聞いてください... (Shift+Enterで改行)"
            value={input}
            onChange={e => {
              setInput(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
            }}
          />
          <button
            className="w-11 h-11 rounded-lg bg-accent text-white hover:bg-accent-hover disabled:opacity-40 transition-colors text-lg flex items-center justify-center self-end shrink-0"
            onClick={() => send()} disabled={loading || !input.trim()}>
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}
