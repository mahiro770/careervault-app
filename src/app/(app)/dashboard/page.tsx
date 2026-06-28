'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatPeriod } from '@/lib/career'
import type { Job } from '@/types'
import Link from 'next/link'

const emptyEdit = { company: '', title: '', start_date: '', end_date: '', description: '', achievement: '' }

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [docCount, setDocCount] = useState(0)

  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [editForm, setEditForm] = useState(emptyEdit)
  const [editSkills, setEditSkills] = useState<string[]>([])
  const [editSkillInput, setEditSkillInput] = useState('')
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  useEffect(() => { load() }, [])

  async function load() {
    const { data: jobData } = await supabase
      .from('jobs').select('*').order('start_date', { ascending: false })
    const { count } = await supabase
      .from('doc_history').select('*', { count: 'exact', head: true })
    setJobs(jobData || [])
    setDocCount(count || 0)
  }

  function openEdit(job: Job) {
    setEditingJob(job)
    setEditForm({
      company: job.company,
      title: job.title,
      start_date: job.start_date ?? '',
      end_date: job.end_date ?? '',
      description: job.description ?? '',
      achievement: job.achievement ?? '',
    })
    setEditSkills(job.skills)
    setEditSkillInput('')
  }

  function closeEdit() {
    setEditingJob(null)
    setEditForm(emptyEdit)
    setEditSkills([])
    setEditSkillInput('')
  }

  function addEditSkill() {
    const v = editSkillInput.trim()
    if (v && !editSkills.includes(v)) setEditSkills(p => [...p, v])
    setEditSkillInput('')
  }

  async function updateJob() {
    if (!editingJob) return
    if (!editForm.company || !editForm.title) { alert('会社名と役職は必須です'); return }
    setSaving(true)
    await supabase.from('jobs').update({
      ...editForm,
      skills: editSkills,
      start_date: editForm.start_date || null,
      end_date: editForm.end_date || null,
    }).eq('id', editingJob.id)
    setSaving(false)
    closeEdit()
    load()
  }

  const allSkills = Array.from(new Set(jobs.flatMap(j => j.skills)))

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-ink tracking-tight">ダッシュボード</h1>
        <p className="text-sm text-ink-3 mt-1">あなたのキャリアの全体像</p>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-2.5 mb-7">
        {[
          { label: '職歴', value: `${jobs.length}件`, icon: '💼' },
          { label: 'スキル', value: `${allSkills.length}個`, icon: '🛠' },
          { label: '生成書類', value: `${docCount}件`, icon: '📄' },
        ].map(s => (
          <div key={s.label}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-full text-[12.5px] text-ink-2 shadow-sm">
            {s.icon} {s.label} <strong className="text-accent">{s.value}</strong>
          </div>
        ))}
      </div>

      {jobs.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-3">🚀</div>
          <div className="font-bold text-base mb-2">まずは職歴を登録しましょう</div>
          <p className="text-sm text-ink-3 mb-5">
            職歴を蓄積することで、AIがあなたのことを深く理解し<br />最適な書類と相談ができるようになります
          </p>
          <Link href="/career" className="btn-primary inline-flex">職歴を追加 →</Link>
        </div>
      ) : (
        <div className="card">
          <div className="flex items-center gap-2 font-bold text-[15px] mb-4">
            <span className="w-7 h-7 rounded-[7px] bg-accent-light flex items-center justify-center text-sm">⏱</span>
            職歴タイムライン
          </div>
          <div className="space-y-3.5">
            {jobs.map(job => (
              <div key={job.id} className="flex gap-3.5 bg-surface border border-gray-100 rounded-lg p-4">
                <div className="w-2.5 h-2.5 rounded-full bg-accent mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="font-bold text-sm">{job.title}</div>
                  <div className="text-accent text-[13px]">{job.company}</div>
                  <div className="text-ink-3 text-xs mt-0.5">{formatPeriod(job.start_date, job.end_date)}</div>
                  {job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.skills.map(s => <span key={s} className="skill-badge">{s}</span>)}
                    </div>
                  )}
                  <button
                    onClick={() => openEdit(job)}
                    className="inline-block mt-2 text-accent border border-accent/30 hover:bg-accent-light text-xs px-2.5 py-1 rounded-lg transition-colors">
                    編集
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 全画面編集ビュー ── */}
      {editingJob && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto">

          {/* ヘッダー */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div>
              <h2 className="font-bold text-xl text-ink">職歴を編集</h2>
              <p className="text-sm text-ink-3 mt-0.5">{editingJob.company} — {editingJob.title}</p>
            </div>
            <button
              onClick={closeEdit}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-ink-3 transition-colors text-xl">
              ×
            </button>
          </div>

          {/* フォーム */}
          <div className="flex-1 px-8 py-8 w-full max-w-2xl mx-auto space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'company', label: '会社名' },
                { id: 'title', label: '役職・職種' },
              ].map(f => (
                <div key={f.id}>
                  <label className="block text-xs font-medium text-ink-2 mb-1">{f.label}</label>
                  <input className="form-input" value={editForm[f.id as keyof typeof editForm]}
                    onChange={e => setEditForm(p => ({ ...p, [f.id]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-ink-2 mb-1">入社日</label>
                <input type="date" className="form-input" value={editForm.start_date}
                  onChange={e => setEditForm(p => ({ ...p, start_date: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-2 mb-1">退社日（在職中は空欄）</label>
                <input type="date" className="form-input" value={editForm.end_date}
                  onChange={e => setEditForm(p => ({ ...p, end_date: e.target.value }))} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-2 mb-1">業務内容・担当プロジェクト</label>
              <textarea className="form-input min-h-[140px] resize-y" value={editForm.description}
                onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-2 mb-1">実績・成果</label>
              <textarea className="form-input min-h-[100px] resize-y" value={editForm.achievement}
                onChange={e => setEditForm(p => ({ ...p, achievement: e.target.value }))} />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-2 mb-1">スキル・使用技術</label>
              <div className="flex gap-2">
                <input className="form-input" placeholder="スキルを入力してEnter" value={editSkillInput}
                  onChange={e => setEditSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addEditSkill())} />
                <button className="btn-outline shrink-0" onClick={addEditSkill}>追加</button>
              </div>
              {editSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {editSkills.map(s => (
                    <span key={s} className="tag">
                      {s}
                      <button className="opacity-60 hover:opacity-100 text-sm leading-none"
                        onClick={() => setEditSkills(p => p.filter(t => t !== s))}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button className="btn-primary flex-1 justify-center" onClick={updateJob} disabled={saving}>
                {saving ? '⏳ 更新中...' : '✏️ 更新する'}
              </button>
              <button className="btn-outline px-6" onClick={closeEdit}>キャンセル</button>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
