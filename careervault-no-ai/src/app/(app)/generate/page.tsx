'use client'
import { useState } from 'react'

type DocType = 'resume' | 'cv' | 'pr'

const TABS: { type: DocType; label: string }[] = [
  { type: 'resume', label: '📋 職務経歴書' },
  { type: 'cv',     label: '📄 履歴書サマリー' },
  { type: 'pr',     label: '✍️ 自己PR文' },
]
const DOC_LABELS: Record<DocType, string> = {
  resume: '生成された職務経歴書',
  cv:     '生成された履歴書サマリー',
  pr:     '生成された自己PR文',
}

export default function GeneratePage() {
  const [docType, setDocType] = useState<DocType>('resume')
  const [industry, setIndustry] = useState('')
  const [focus, setFocus] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function generate() {
    setLoading(true)
    setOutput('')
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docType, industry, focus }),
    })
    const { text } = await res.json()
    setOutput(text)
    setLoading(false)
  }

  function copy() {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-ink tracking-tight">書類生成</h1>
        <p className="text-sm text-ink-3 mt-1">登録した職歴から、職務経歴書・履歴書をAIが生成します</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0.5 border-b border-gray-200 mb-5">
        {TABS.map(t => (
          <button key={t.type}
            className={`px-4 py-2 text-[13px] border-b-2 -mb-px transition-colors
              ${docType === t.type
                ? 'border-accent text-accent font-medium'
                : 'border-transparent text-ink-3 hover:text-ink-2'}`}
            onClick={() => setDocType(t.type)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1">応募先の業種・職種</label>
            <input className="form-input" placeholder="例：Web系スタートアップ・エンジニア"
              value={industry} onChange={e => setIndustry(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1">アピールしたいポイント（任意）</label>
            <input className="form-input" placeholder="例：マネジメント経験、技術力"
              value={focus} onChange={e => setFocus(e.target.value)} />
          </div>
        </div>
        <div className="mt-4">
          <button className="btn-primary" onClick={generate} disabled={loading}>
            {loading ? '⏳ 生成中...' : '✨ AIで生成する'}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 font-bold text-[15px] mb-4">
          <span className="w-7 h-7 rounded-[7px] bg-accent-light flex items-center justify-center text-sm">📝</span>
          {DOC_LABELS[docType]}
          {output && (
            <button className="btn-ghost ml-auto" onClick={copy}>
              {copied ? '✅ コピー済み' : '📋 コピー'}
            </button>
          )}
        </div>
        <div className={`bg-surface border border-gray-100 rounded-lg p-5 text-[13.5px] leading-loose whitespace-pre-wrap min-h-[200px] max-h-[600px] overflow-y-auto
          ${loading || !output ? 'text-ink-3 italic' : 'text-ink-2'}`}>
          {loading
            ? 'AIが書類を生成しています...'
            : output || 'まだ生成されていません。上のボタンを押すとAIが生成します。'}
        </div>
      </div>
    </div>
  )
}
