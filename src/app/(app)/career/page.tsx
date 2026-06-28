'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const emptyForm = { company: '', title: '', start_date: '', end_date: '', description: '', achievement: '' }

export default function CareerPage() {
  const [form, setForm] = useState(emptyForm)
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  function addSkill() {
    const v = skillInput.trim()
    if (v && !skills.includes(v)) setSkills(p => [...p, v])
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
    setForm(emptyForm)
    setSkills([])
    setSkillInput('')
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-ink tracking-tight">職歴登録</h1>
        <p className="text-sm text-ink-3 mt-1">転職のたびに追記することで書類が自動的にブラッシュアップされます</p>
      </div>

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
            <input type="date" className="form-input" value={form.start_date}
              onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1">退社日（在職中は空欄）</label>
            <input type="date" className="form-input" value={form.end_date}
              onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-ink-2 mb-1">業務内容・担当プロジェクト</label>
            <textarea className="form-input min-h-[88px] resize-y"
              placeholder="どんな業務を担当しましたか？プロジェクト、チーム規模、使った技術など"
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-ink-2 mb-1">実績・成果（数字があると強い）</label>
            <textarea className="form-input min-h-[72px] resize-y"
              placeholder="例：売上を前年比120%に改善、チーム5人をマネジメント"
              value={form.achievement}
              onChange={e => setForm(p => ({ ...p, achievement: e.target.value }))} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-ink-2 mb-1">スキル・使用技術</label>
            <div className="flex gap-2">
              <input className="form-input" placeholder="スキルを入力してEnter" value={skillInput}
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

        {saved && (
          <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg text-green-700 text-xs">
            職歴を保存しました
          </div>
        )}

        <div className="flex gap-2.5 mt-4">
          <button className="btn-primary" onClick={saveJob} disabled={saving}>
            {saving ? '⏳ 保存中...' : '💾 職歴を保存'}
          </button>
          <button className="btn-outline"
            onClick={() => { setForm(emptyForm); setSkills([]); setSkillInput('') }}>
            クリア
          </button>
        </div>
      </div>
    </div>
  )
}
