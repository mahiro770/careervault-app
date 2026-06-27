'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatPeriod } from '@/lib/career'
import type { Job } from '@/types'
import Link from 'next/link'

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [docCount, setDocCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: jobData } = await supabase
        .from('jobs').select('*').order('start_date', { ascending: false })
      const { count } = await supabase
        .from('doc_history').select('*', { count: 'exact', head: true })
      setJobs(jobData || [])
      setDocCount(count || 0)
    }
    load()
  }, [])

  const allSkills = [...new Set(jobs.flatMap(j => j.skills))]

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
          <p className="text-sm text-ink-3 mb-5">職歴を蓄積することで、AIがあなたのことを深く理解し<br />最適な書類と相談ができるようになります</p>
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
                <div>
                  <div className="font-bold text-sm">{job.title}</div>
                  <div className="text-accent text-[13px]">{job.company}</div>
                  <div className="text-ink-3 text-xs mt-0.5">{formatPeriod(job.start_date, job.end_date)}</div>
                  {job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.skills.map(s => <span key={s} className="skill-badge">{s}</span>)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
