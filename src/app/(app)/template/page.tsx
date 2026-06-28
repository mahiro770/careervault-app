'use client'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ResumeBasic, ResumeModern, ResumeStandard, ResumeTimeline, ResumeExecutive, CVStandard, CVModern, CVMinimal, CVDetailed } from '@/components/templates'
import type { Job, Profile } from '@/types'

type DocType = 'resume' | 'cv'
type TemplateId = 'resume-basic' | 'resume-modern' | 'resume-standard' | 'resume-timeline' | 'resume-executive' | 'cv-standard' | 'cv-modern' | 'cv-minimal' | 'cv-detailed'

const TEMPLATES: Record<DocType, { id: TemplateId; name: string; desc: string }[]> = {
  resume: [
    { id: 'resume-basic',      name: 'ベーシック',         desc: 'シンプルな縦型・左アクセント' },
    { id: 'resume-modern',     name: 'モダン',             desc: 'ダーク見出し＋スキルサイドバー' },
    { id: 'resume-standard',   name: 'スタンダード（編年体）', desc: '職務要約＋期間テーブル形式・定番レイアウト' },
    { id: 'resume-timeline',   name: 'タイムライン',       desc: 'オレンジ縦線で時系列を可視化' },
    { id: 'resume-executive',  name: 'エグゼクティブ',     desc: 'ネイビー×ゴールドの格調あるデザイン' },
  ],
  cv: [
    { id: 'cv-standard', name: 'スタンダード', desc: '表形式・一般的な履歴書' },
    { id: 'cv-modern',   name: 'モダン',       desc: 'グリーンアクセントのすっきり型' },
    { id: 'cv-minimal',  name: 'ミニマル',     desc: '余白重視の白黒シンプル型' },
    { id: 'cv-detailed', name: '詳細型',       desc: 'スキル・実績も記載できる紫アクセント' },
  ],
}

export default function TemplatePage() {
  const [docType, setDocType]         = useState<DocType>('resume')
  const [selected, setSelected]       = useState<TemplateId>('resume-basic')
  const [jobs, setJobs]               = useState<Job[]>([])
  const [profile, setProfile]         = useState<Profile | null>(null)
  const [loading, setLoading]         = useState(true)
  const previewRef                    = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => { load() }, [])

  async function load() {
    const [{ data: jobData }, { data: prof }] = await Promise.all([
      supabase.from('jobs').select('*').order('start_date', { ascending: false }),
      supabase.from('profiles').select('*').single(),
    ])
    setJobs(jobData || [])
    setProfile(prof || null)
    setLoading(false)
  }

  function changeDocType(type: DocType) {
    setDocType(type)
    setSelected(TEMPLATES[type][0].id)
  }

  function handlePrint() {
    const html = previewRef.current?.innerHTML
    if (!html) return
    const title = docType === 'resume' ? '職務経歴書' : '履歴書'
    const win = window.open('', '_blank', 'width=860,height=1050')
    if (!win) return
    win.document.write(`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #fff; }
    @page { size: A4; margin: 0; }
  </style>
</head>
<body>${html}</body>
</html>`)
    win.document.close()
    setTimeout(() => { win.focus(); win.print() }, 400)
  }

  const templateProps = { jobs, profile }

  function renderTemplate() {
    if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>読み込み中...</div>
    switch (selected) {
      case 'resume-basic':     return <ResumeBasic     {...templateProps} />
      case 'resume-modern':    return <ResumeModern    {...templateProps} />
      case 'resume-standard':  return <ResumeStandard  {...templateProps} />
      case 'resume-timeline':  return <ResumeTimeline  {...templateProps} />
      case 'resume-executive': return <ResumeExecutive {...templateProps} />
      case 'cv-standard':      return <CVStandard      {...templateProps} />
      case 'cv-modern':        return <CVModern        {...templateProps} />
      case 'cv-minimal':       return <CVMinimal       {...templateProps} />
      case 'cv-detailed':      return <CVDetailed      {...templateProps} />
    }
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-ink tracking-tight">テンプレート書類</h1>
        <p className="text-sm text-ink-3 mt-1">登録した職歴・プロフィールを書類テンプレートに自動反映して印刷できます</p>
      </div>

      {/* 書類タブ */}
      <div className="flex gap-0.5 border-b border-gray-200 mb-5">
        {([
          { type: 'resume' as DocType, label: '📋 職務経歴書' },
          { type: 'cv'     as DocType, label: '📄 履歴書' },
        ]).map(t => (
          <button key={t.type}
            className={`px-4 py-2 text-[13px] border-b-2 -mb-px transition-colors
              ${docType === t.type ? 'border-accent text-accent font-medium' : 'border-transparent text-ink-3 hover:text-ink-2'}`}
            onClick={() => changeDocType(t.type)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* テンプレート選択 */}
      <div className="card mb-5">
        <p className="text-xs font-medium text-ink-2 mb-3">テンプレートを選択</p>
        <div className="flex gap-3">
          {TEMPLATES[docType].map(t => (
            <button key={t.id} onClick={() => setSelected(t.id)}
              className={`flex-1 p-4 rounded-xl border-2 text-left transition-all
                ${selected === t.id ? 'border-accent bg-accent-light' : 'border-gray-200 hover:border-gray-300'}`}>
              <div className={`font-semibold text-sm mb-1 ${selected === t.id ? 'text-accent' : 'text-ink'}`}>{t.name}</div>
              <div className="text-xs text-ink-3">{t.desc}</div>
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-ink-3">※ プロフィール・職歴ページに登録した情報が自動で反映されます</p>
          <button className="btn-primary shrink-0" onClick={handlePrint}>
            🖨️ 印刷 / PDFで保存
          </button>
        </div>
      </div>

      {/* プレビュー */}
      <div className="card overflow-hidden">
        <p className="text-xs font-medium text-ink-2 mb-4">プレビュー</p>
        <div className="bg-gray-100 rounded-xl p-4 overflow-x-auto">
          <div
            ref={previewRef}
            style={{ transform: 'scale(0.78)', transformOrigin: 'top left', width: '793px', marginBottom: `calc((1122px * 0.78) - 1122px)` }}
          >
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  )
}
