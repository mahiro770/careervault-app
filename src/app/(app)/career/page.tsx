'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatPeriod } from '@/lib/career'
import type { Job } from '@/types'

export default function CareerPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [form, setForm] = useState({
    company: '', title: '', start_date: '', end_date: '',
    description: '', achievement: '',
  })
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => { loadJobs() }, [])

  async function loadJobs() {
    const { data } = await supabase.from('jobs').select('*').order('start_date', { ascending: false })
    setJobs(data || [])
  }

  function addSkill() {
    const v = skillInput.trim()
    if (v && !skills.includes(v)) setSkills(prev => [...prev, v])
    setSkillInput('')
  }

  async function saveJob() {
    if (!form.company || !form.title) { alert('会社名と役職は必須です'); return }
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('jobs').insert({
      ...form,
      skills,
      user_id: user?.id,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    })
    setForm({ company: '', title: '', start_date: '', end_date: '', description: '', achievement: '' })
    setSkills([])
    setSaving(false)
    loadJobs()
  }

  async function deleteJob(id: string) {
    if (!confirm('この職歴を削除しますか？')) return
    await supabase.from('jobs').delete().eq('id', id)
    loadJobs()
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-ink tracking-tight">職歴登録</h1>
        <p className="text-sm text-ink-3 mt-1">転職のたびに追記することで書類が自動的にブラッシュアップされます</p>
      </div>

      {/* Form */}
      <div className="card">
        <div className="flex items-center gap-2 font-bold text-[15px] mb-4">
          <span className="w-7 h-7 rounded-[7px] bg-accent-light flex items-center justify-center text-sm">➕</span>
          新しい職歴を追加
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          {[
            { id: 'company', label: '会社名', placeholder: '例：株式会社〇〇' },
            { id: 'title', label: '役職・職種', placeholder: '例：Webエンジニア' },
          ].map(f => (
            <div key={f.id}>
              <label className="block text-xs font-medium text-ink-2 mb-1">{f.label}</label>
              <input className="form-input" placeholder={f.placeholder}
                value={form[f.id as keyof typeof form]}
                onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1">入社日</label>
            <input type="date" className="form-input"
              value={form.start_date} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1">退社日（在職中は空欄）</label>
            <input type="date" className="form-input"
              value={form.end_date} onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-ink-2 mb-1">業務内容・担当プロジェクト</label>
            <textarea className="form-input min-h-[88px] resize-y"
              placeholder="どんな業務を担当しましたか？プロジェクト、チーム規模、使った技術など"
              value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-ink-2 mb-1">実績・成果（数字があると強い）</label>
            <textarea className="form-input min-h-[72px] resize-y"
              placeholder="例：売上を前年比120%に改善、チーム5人をマネジメント"
              value={form.achievement} onChange={e => setForm(p => ({ ...p, achievement: e.target.value }))} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-ink-2 mb-1">スキル・使用技術</label>
            <div className="flex gap-2">
              <input className="form-input" placeholder="スキルを入力してEnter"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
              <button className="btn-outline shrink-0" onClick={addSkill}>追加</button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skills.map(s => (
                  <span key={s} className="tag">
                    {s}
                    <button className="opacity-60 hover:opacity-100 text-sm leading-none"
                      onClick={() => setSkills(p => p.filter(t => t !== s))}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2.5 mt-4">
          <button className="btn-primary" onClick={saveJob} disabled={saving}>
            {saving ? '⏳ 保存中...' : '💾 職歴を保存'}
          </button>
          <button className="btn-outline" onClick={() => {
            setForm({ company: '', title: '', start_date: '', end_date: '', description: '', achievement: '' })
            setSkills([])
          }}>クリア</button>
        </div>
      </div>

      {/* List */}
      <div className="card">
        <div className="flex items-center gap-2 font-bold text-[15px] mb-4">
          <span className="w-7 h-7 rounded-[7px] bg-accent-light flex items-center justify-center text-sm">📋</span>
          登録済みの職歴
        </div>
        {jobs.length === 0 ? (
          <div className="text-center py-10 text-ink-3 text-sm">
            <div className="text-3xl mb-2">📂</div>まだ職歴が登録されていません
          </div>
        ) : (
          <div className="space-y-3.5">
            {jobs.map(job => (
              <div key={job.id} className="flex gap-3.5 bg-surface border border-gray-100 rounded-lg p-4">
                <div className="w-2.5 h-2.5 rounded-full bg-accent mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="font-bold text-sm">{job.title}</div>
                  <div className="text-accent text-[13px]">{job.company}</div>
                  <div className="text-ink-3 text-xs mt-0.5">{formatPeriod(job.start_date, job.end_date)}</div>
                  {job.description && <div className="text-ink-2 text-[13px] mt-1.5">{job.description}</div>}
                  {job.achievement && <div className="text-green-700 text-[12.5px] mt-1">🏆 {job.achievement}</div>}
                  {job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.skills.map(s => <span key={s} className="skill-badge">{s}</span>)}
                    </div>
                  )}
                  <button className="mt-2 text-red-500 border border-red-100 hover:bg-red-50 text-xs px-2.5 py-1 rounded-lg transition-colors"
                    onClick={() => deleteJob(job.id)}>削除</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
