import type { Job, Profile } from '@/types'

export function formatPeriod(start: string | null, end: string | null): string {
  const fmt = (d: string | null) => d ? d.substring(0, 7).replace(/-/g, '/') : ''
  if (!start && !end) return ''
  if (!end) return `${fmt(start)} 〜 在職中`
  return `${fmt(start)} 〜 ${fmt(end)}`
}

export function buildCareerContext(profile: Profile | null, jobs: Job[]): string {
  let ctx = `あなたはキャリアコンサルタントAIです。以下のユーザー情報を基に、個人的なアドバイスを日本語で行ってください。具体的で実践的なアドバイスを心がけてください。\n\n`

  if (profile) {
    if (profile.name) ctx += `【名前】${profile.name}\n`
    if (profile.education) ctx += `【学歴】${profile.education}\n`
    if (profile.certifications) ctx += `【資格】${profile.certifications}\n`
    if (profile.vision) ctx += `【キャリアビジョン】${profile.vision}\n`
    if (profile.values) ctx += `【価値観】${profile.values}\n`
    if (profile.priority) ctx += `【転職で重視すること】${profile.priority}\n`
  }

  if (jobs.length > 0) {
    ctx += `\n【職歴】\n`
    jobs.forEach((job, i) => {
      ctx += `${i + 1}. ${job.company}（${job.title}）${formatPeriod(job.start_date, job.end_date)}\n`
      if (job.description) ctx += `   業務：${job.description}\n`
      if (job.achievement) ctx += `   実績：${job.achievement}\n`
      if (job.skills.length) ctx += `   スキル：${job.skills.join('、')}\n`
    })
  } else {
    ctx += `\n※まだ職歴が登録されていません。\n`
  }

  ctx += `\n回答は簡潔で読みやすく、必要に応じてリスト形式を使ってください。`
  return ctx
}

export function buildDocPrompt(
  type: 'resume' | 'cv' | 'pr',
  industry: string,
  focus: string
): string {
  const opts = industry ? `応募先：${industry}` : ''
  const foc = focus ? `、アピールポイント：${focus}` : ''

  const prompts = {
    resume: `以下の情報をもとに、日本語で職務経歴書を作成してください。${opts}${foc}
フォーマット：
- 職務要約（3〜4行）
- 職歴（各社ごとに詳細）
- 保有スキル・資格
- 自己PR

読みやすく、採用担当者に刺さる内容にしてください。`,
    cv: `以下の情報をもとに、日本語で履歴書の各項目をまとめたサマリーを作成してください。志望動機と自己PRを特に丁寧に書いてください。${opts}`,
    pr: `以下の情報をもとに、転職活動で使える自己PR文を400〜600字で書いてください。${opts}${foc}
具体的なエピソードと数字を盛り込み、説得力のある内容にしてください。`,
  }
  return prompts[type]
}
