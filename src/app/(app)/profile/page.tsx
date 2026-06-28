'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const fields = [
  { id: 'name',           label: '氏名',                         type: 'text',     placeholder: '山田 太郎',                                  col: 1 },
  { id: 'birth_date',     label: '生年月日',                     type: 'date',     placeholder: '',                                           col: 1 },
  { id: 'education',      label: '最終学歴',                     type: 'text',     placeholder: '例：〇〇大学 経営学部 2018年卒',             col: 2 },
  { id: 'certifications', label: '資格・免許',                   type: 'textarea', placeholder: '例：基本情報技術者、TOEIC 800点',            col: 2 },
  { id: 'vision',         label: '将来なりたい姿・目指すキャリア', type: 'textarea', placeholder: '例：5年後はプロダクトマネージャーとして...', col: 2 },
  { id: 'values',         label: '仕事で大切にしていること・価値観', type: 'textarea', placeholder: '例：ユーザーに寄り添った開発、チームで成果を出すこと', col: 2 },
  { id: 'priority',       label: '次の転職で重視すること',       type: 'textarea', placeholder: '例：リモートワーク可能、成長環境、年収アップ', col: 2 },
]

function mask(value: string) {
  return '●'.repeat(Math.min(value.length, 16)) || '（未入力）'
}

export default function ProfilePage() {
  const [form, setForm]         = useState<Record<string, string>>({})
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('profiles').select('*').single()
      if (data) {
        setForm(data)
        setIsVisible(false) // 既存データがあれば最初は非表示
      } else {
        setIsVisible(true)  // 新規ユーザーは入力できる状態で開始
      }
    }
    load()
  }, [])

  async function save() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('profiles').upsert({ ...form, user_id: user?.id, updated_at: new Date().toISOString() })
    setSaving(false)
    setSaved(true)
    setIsVisible(false) // 保存後は非表示に
    setTimeout(() => setSaved(false), 2000)
  }

  const hasData = fields.some(f => form[f.id])

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-ink tracking-tight">プロフィール</h1>
        <p className="text-sm text-ink-3 mt-1">学歴・資格・将来の目標を記録します</p>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 font-bold text-[15px]">
            <span className="w-7 h-7 rounded-[7px] bg-accent-light flex items-center justify-center text-sm">👤</span>
            基本情報 ＆ キャリアビジョン
          </div>
          {hasData && (
            <button
              className="flex items-center gap-1.5 text-xs font-medium text-accent border border-accent rounded-lg px-3 py-1.5 hover:bg-accent-light transition-colors"
              onClick={() => setIsVisible(v => !v)}
            >
              {isVisible ? '🙈 非表示' : '👁 表示する'}
            </button>
          )}
        </div>

        {/* 非表示状態：マスク表示 */}
        {!isVisible && hasData && (
          <div className="grid grid-cols-2 gap-3.5">
            {fields.map(f => (
              <div key={f.id} className={f.col === 2 ? 'col-span-2' : ''}>
                <label className="block text-xs font-medium text-ink-2 mb-1">{f.label}</label>
                <div className="form-input text-ink-3 tracking-widest select-none cursor-default">
                  {form[f.id] ? mask(form[f.id]) : <span className="text-ink-4 text-xs">（未入力）</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 表示状態：編集フォーム */}
        {isVisible && (
          <>
            <div className="grid grid-cols-2 gap-3.5">
              {fields.map(f => (
                <div key={f.id} className={f.col === 2 ? 'col-span-2' : ''}>
                  <label className="block text-xs font-medium text-ink-2 mb-1">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea className="form-input min-h-[80px] resize-y"
                      placeholder={f.placeholder}
                      value={form[f.id] || ''}
                      onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))} />
                  ) : (
                    <input type={f.type} className="form-input"
                      placeholder={f.placeholder}
                      value={form[f.id] || ''}
                      onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-4">
              <button className="btn-primary" onClick={save} disabled={saving}>
                {saving ? '⏳ 保存中...' : '💾 プロフィールを保存'}
              </button>
              {saved && <span className="text-green-600 text-sm">✅ 保存しました</span>}
            </div>
          </>
        )}

        {/* データなし・非表示の場合 */}
        {!isVisible && !hasData && (
          <div className="text-center py-8 text-ink-3">
            <p className="text-sm mb-3">まだプロフィールが登録されていません</p>
            <button className="btn-primary text-sm" onClick={() => setIsVisible(true)}>
              ✏️ 入力する
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
