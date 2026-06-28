import type { Job, Profile } from '@/types'
import { formatPeriod } from '@/lib/career'

interface TemplateProps {
  jobs: Job[]
  profile: Profile | null
}

function today() {
  const d = new Date()
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

function uniqueSkills(jobs: Job[]) {
  return Array.from(new Set(jobs.flatMap(j => j.skills)))
}

// ── ヘルパー ──
function SectionHeading({ children, color = '#1d4ed8' }: { children: React.ReactNode; color?: string }) {
  return (
    <h2 style={{ fontSize: '12px', fontWeight: 'bold', color, borderLeft: `4px solid ${color}`, paddingLeft: '8px', margin: '20px 0 10px' }}>
      {children}
    </h2>
  )
}

function Tag({ label, bg, border, color }: { label: string; bg: string; border: string; color: string }) {
  return (
    <span style={{ display: 'inline-block', background: bg, border: `1px solid ${border}`, borderRadius: '4px', padding: '1px 8px', marginRight: '4px', marginTop: '3px', fontSize: '10px', color }}>{label}</span>
  )
}

// ────────────────────────────────────────────
// 1. 職務経歴書 ベーシック
// ────────────────────────────────────────────
export function ResumeBasic({ jobs, profile }: TemplateProps) {
  const skills = uniqueSkills(jobs)
  const base: React.CSSProperties = {
    fontFamily: "'Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,sans-serif",
    fontSize: '11px', lineHeight: '1.9', color: '#1a1a1a', background: '#fff',
    width: '793px', minHeight: '1122px', padding: '52px 60px',
  }

  return (
    <div style={base}>
      {/* タイトル */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '0.4em', marginBottom: '6px' }}>職務経歴書</h1>
        <p style={{ fontSize: '10px', color: '#666' }}>作成日：{today()}</p>
        {profile?.name && (
          <p style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #ccc' }}>
            {profile.name}
          </p>
        )}
      </div>

      {/* 学歴 */}
      {profile?.education && (
        <>
          <SectionHeading>学歴</SectionHeading>
          <p style={{ whiteSpace: 'pre-wrap', paddingLeft: '12px' }}>{profile.education}</p>
        </>
      )}

      {/* 職歴 */}
      <SectionHeading>職務経歴</SectionHeading>
      {jobs.length === 0 && <p style={{ color: '#999', paddingLeft: '12px' }}>職歴が登録されていません</p>}
      {jobs.map((job, i) => (
        <div key={job.id} style={{ marginBottom: '20px', paddingBottom: '18px', borderBottom: i < jobs.length - 1 ? '1px dashed #ddd' : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{job.company}</span>
            <span style={{ fontSize: '10px', color: '#555' }}>{formatPeriod(job.start_date, job.end_date)}</span>
          </div>
          <div style={{ color: '#1d4ed8', fontSize: '11px', marginBottom: '6px' }}>{job.title}</div>
          {job.description && (
            <p style={{ marginBottom: '4px' }}><strong style={{ color: '#555', fontSize: '10px' }}>【業務内容】</strong>　{job.description}</p>
          )}
          {job.achievement && (
            <p style={{ marginBottom: '4px' }}><strong style={{ color: '#555', fontSize: '10px' }}>【実績・成果】</strong>　{job.achievement}</p>
          )}
          {job.skills.length > 0 && (
            <div style={{ marginTop: '6px' }}>
              {job.skills.map(s => <Tag key={s} label={s} bg="#eff6ff" border="#bfdbfe" color="#1d4ed8" />)}
            </div>
          )}
        </div>
      ))}

      {/* スキル */}
      {skills.length > 0 && (
        <>
          <SectionHeading>保有スキル</SectionHeading>
          <div style={{ paddingLeft: '12px' }}>
            {skills.map(s => <Tag key={s} label={s} bg="#f8fafc" border="#cbd5e1" color="#334155" />)}
          </div>
        </>
      )}

      {/* 資格 */}
      {profile?.certifications && (
        <>
          <SectionHeading>資格・免許</SectionHeading>
          <p style={{ whiteSpace: 'pre-wrap', paddingLeft: '12px' }}>{profile.certifications}</p>
        </>
      )}
    </div>
  )
}

// ────────────────────────────────────────────
// 2. 職務経歴書 モダン（2カラム）
// ────────────────────────────────────────────
export function ResumeModern({ jobs, profile }: TemplateProps) {
  const skills = uniqueSkills(jobs)
  const ACCENT = '#0f4c81'
  const base: React.CSSProperties = {
    fontFamily: "'Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,sans-serif",
    fontSize: '11px', lineHeight: '1.8', color: '#1a1a1a', background: '#fff',
    width: '793px', minHeight: '1122px',
  }
  const sideH3: React.CSSProperties = {
    fontSize: '10px', fontWeight: 'bold', color: '#fff', letterSpacing: '0.08em',
    borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '4px', marginBottom: '10px', marginTop: '20px',
  }

  return (
    <div style={base}>
      {/* ヘッダー */}
      <div style={{ background: ACCENT, color: '#fff', padding: '36px 48px 28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '0.12em', marginBottom: '4px' }}>
          {profile?.name || '氏名未設定'}
        </h1>
        <p style={{ fontSize: '12px', opacity: 0.75, letterSpacing: '0.2em', marginBottom: '4px' }}>職務経歴書</p>
        <p style={{ fontSize: '10px', opacity: 0.55 }}>作成日：{today()}</p>
      </div>

      <div style={{ display: 'flex' }}>
        {/* サイドバー */}
        <div style={{ width: '210px', background: '#1a3550', color: '#e2e8f0', padding: '16px 20px', minHeight: '900px', flexShrink: 0 }}>
          {profile?.education && (
            <>
              <h3 style={sideH3}>学歴</h3>
              <p style={{ fontSize: '10px', whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>{profile.education}</p>
            </>
          )}
          {skills.length > 0 && (
            <>
              <h3 style={sideH3}>スキル</h3>
              {skills.map(s => (
                <div key={s} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '3px', padding: '2px 8px', marginBottom: '3px', fontSize: '10px' }}>{s}</div>
              ))}
            </>
          )}
          {profile?.certifications && (
            <>
              <h3 style={sideH3}>資格・免許</h3>
              <p style={{ fontSize: '10px', whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>{profile.certifications}</p>
            </>
          )}
        </div>

        {/* メイン */}
        <div style={{ flex: 1, padding: '28px 36px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: ACCENT, borderBottom: `2px solid ${ACCENT}`, paddingBottom: '5px', marginBottom: '16px', letterSpacing: '0.08em' }}>
            職務経歴
          </h2>
          {jobs.length === 0 && <p style={{ color: '#999' }}>職歴が登録されていません</p>}
          {jobs.map((job, i) => (
            <div key={job.id} style={{ marginBottom: '20px', paddingLeft: '12px', borderLeft: `3px solid #93c5fd`, paddingBottom: i < jobs.length - 1 ? '16px' : 0, borderBottom: i < jobs.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
              <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{job.company}</div>
              <div style={{ color: '#3b82f6', fontSize: '11px', marginBottom: '2px' }}>{job.title}</div>
              <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '6px' }}>{formatPeriod(job.start_date, job.end_date)}</div>
              {job.description && <p style={{ marginBottom: '3px' }}>業務：{job.description}</p>}
              {job.achievement && <p style={{ color: '#1d4ed8' }}>実績：{job.achievement}</p>}
              {job.skills.length > 0 && (
                <div style={{ marginTop: '6px' }}>
                  {job.skills.map(s => <Tag key={s} label={s} bg="#eff6ff" border="#bfdbfe" color="#1e40af" />)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────
// 3. 履歴書 スタンダード（表形式）
// ────────────────────────────────────────────
export function CVStandard({ jobs, profile }: TemplateProps) {
  const td: React.CSSProperties = { border: '1px solid #999', padding: '6px 10px', verticalAlign: 'top', lineHeight: '1.8' }
  const th: React.CSSProperties = { ...td, background: '#e8ecf4', fontWeight: 'bold', textAlign: 'center', whiteSpace: 'nowrap', width: '110px' }
  const sectionBar: React.CSSProperties = { fontWeight: 'bold', fontSize: '12px', background: '#e8ecf4', border: '1px solid #999', borderBottom: 'none', padding: '4px 10px', letterSpacing: '0.1em' }

  return (
    <div style={{
      fontFamily: "'Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,sans-serif",
      fontSize: '11px', color: '#1a1a1a', background: '#fff',
      width: '793px', minHeight: '1122px', padding: '36px 44px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '18px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '0.5em' }}>履　歴　書</h1>
        <p style={{ fontSize: '10px' }}>作成日：{today()}</p>
      </div>

      {/* 基本情報 */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px' }}>
        <tbody>
          <tr>
            <th style={th}>氏　名</th>
            <td style={{ ...td, fontSize: '15px', fontWeight: 'bold' }}>{profile?.name || '　'}</td>
          </tr>
          <tr>
            <th style={th}>生年月日</th>
            <td style={td}>{profile?.birth_date ? profile.birth_date.replace(/-/g, '/') : '　'}</td>
          </tr>
        </tbody>
      </table>

      {/* 学歴 */}
      <div style={sectionBar}>学　歴</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px' }}>
        <tbody>
          {(profile?.education ? profile.education.split('\n') : ['　']).map((line, i) => (
            <tr key={i}>
              <td style={{ ...td, width: '110px' }}></td>
              <td style={td}>{line || '　'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 職歴 */}
      <div style={sectionBar}>職　歴</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px' }}>
        <tbody>
          {jobs.length === 0 ? (
            <tr><td style={{ ...td, width: '110px' }}></td><td style={td}>　</td></tr>
          ) : jobs.map(job => (
            <tr key={job.id}>
              <td style={{ ...td, width: '110px', textAlign: 'center' }}>
                {job.start_date ? job.start_date.substring(0, 7).replace(/-/g, '/') : ''}
              </td>
              <td style={td}>{job.company}　入社（{job.title}）</td>
            </tr>
          ))}
          <tr>
            <td style={{ ...td, width: '110px' }}></td>
            <td style={{ ...td, textAlign: 'right', fontWeight: 'bold' }}>以上</td>
          </tr>
        </tbody>
      </table>

      {/* 資格・免許 */}
      <div style={sectionBar}>資格・免許</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px' }}>
        <tbody>
          {(profile?.certifications ? profile.certifications.split('\n') : ['　']).map((line, i) => (
            <tr key={i}>
              <td style={{ ...td, width: '110px' }}></td>
              <td style={td}>{line || '　'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 志望動機 */}
      <div style={sectionBar}>志望動機・自己PR</div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ ...td, minHeight: '120px', height: '120px', whiteSpace: 'pre-wrap', verticalAlign: 'top' }}>
              {profile?.vision || '　'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ────────────────────────────────────────────
// 4. 履歴書 モダン
// ────────────────────────────────────────────
export function CVModern({ jobs, profile }: TemplateProps) {
  const skills = uniqueSkills(jobs)
  const ACCENT = '#0f766e'
  const base: React.CSSProperties = {
    fontFamily: "'Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,sans-serif",
    fontSize: '11px', lineHeight: '1.9', color: '#1a1a1a', background: '#fff',
    width: '793px', minHeight: '1122px', padding: '52px 60px',
  }

  function Sec({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div style={{ marginBottom: '22px' }}>
        <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: ACCENT, borderLeft: `4px solid ${ACCENT}`, paddingLeft: '8px', marginBottom: '10px' }}>{title}</h2>
        {children}
      </div>
    )
  }

  return (
    <div style={base}>
      {/* ヘッダー */}
      <div style={{ borderBottom: `3px solid ${ACCENT}`, paddingBottom: '18px', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '4px' }}>{profile?.name || '氏名未設定'}</h1>
        <p style={{ fontSize: '11px', color: ACCENT, fontWeight: 'bold', letterSpacing: '0.15em', marginBottom: '4px' }}>CURRICULUM VITAE</p>
        <div style={{ fontSize: '10px', color: '#666', display: 'flex', gap: '20px' }}>
          {profile?.birth_date && <span>生年月日：{profile.birth_date.replace(/-/g, '/')}</span>}
          <span>作成日：{today()}</span>
        </div>
      </div>

      {profile?.education && (
        <Sec title="学歴">
          <p style={{ whiteSpace: 'pre-wrap' }}>{profile.education}</p>
        </Sec>
      )}

      <Sec title="職歴">
        {jobs.length === 0 && <p style={{ color: '#999' }}>職歴が登録されていません</p>}
        {jobs.map((job, i) => (
          <div key={job.id} style={{ marginBottom: i < jobs.length - 1 ? '14px' : 0, paddingBottom: i < jobs.length - 1 ? '14px' : 0, borderBottom: i < jobs.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold' }}>{job.company}（{job.title}）</span>
              <span style={{ fontSize: '10px', color: '#666' }}>{formatPeriod(job.start_date, job.end_date)}</span>
            </div>
            {job.description && <p style={{ fontSize: '10px', color: '#444', margin: '3px 0' }}>業務：{job.description}</p>}
            {job.achievement && <p style={{ fontSize: '10px', color: ACCENT }}>実績：{job.achievement}</p>}
            {job.skills.length > 0 && (
              <div style={{ marginTop: '4px' }}>
                {job.skills.map(s => <Tag key={s} label={s} bg="#f0fdf4" border="#86efac" color="#15803d" />)}
              </div>
            )}
          </div>
        ))}
      </Sec>

      {skills.length > 0 && (
        <Sec title="保有スキル・技術">
          <div>{skills.map(s => <Tag key={s} label={s} bg="#f0fdf4" border="#86efac" color="#15803d" />)}</div>
        </Sec>
      )}

      {profile?.certifications && (
        <Sec title="資格・免許">
          <p style={{ whiteSpace: 'pre-wrap' }}>{profile.certifications}</p>
        </Sec>
      )}

      {profile?.vision && (
        <Sec title="志望動機・自己PR">
          <p style={{ whiteSpace: 'pre-wrap' }}>{profile.vision}</p>
        </Sec>
      )}
    </div>
  )
}

// ────────────────────────────────────────────
// 5. 職務経歴書 スタンダード（編年体）
// ────────────────────────────────────────────
export function ResumeStandard({ jobs, profile }: TemplateProps) {
  const skills = uniqueSkills(jobs)
  const NAVY = '#1e3a5f'
  const base: React.CSSProperties = {
    fontFamily: "'Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,sans-serif",
    fontSize: '11px', lineHeight: '2', color: '#1a1a1a', background: '#fff',
    width: '793px', minHeight: '1122px', padding: '40px 52px',
  }
  const secHead: React.CSSProperties = {
    fontSize: '12px', fontWeight: 'bold', background: '#eaf0f8', color: NAVY,
    borderLeft: `4px solid ${NAVY}`, padding: '4px 10px',
    marginBottom: '10px', marginTop: '22px', letterSpacing: '0.05em',
  }
  const tdPeriod: React.CSSProperties = {
    border: '1px solid #bbb', padding: '8px 10px', verticalAlign: 'top',
    width: '130px', textAlign: 'center', whiteSpace: 'pre-wrap', lineHeight: '1.8',
    background: '#fafbfc',
  }
  const tdContent: React.CSSProperties = {
    border: '1px solid #bbb', padding: '8px 12px', verticalAlign: 'top',
    lineHeight: '1.9',
  }
  const thStyle: React.CSSProperties = {
    border: '1px solid #bbb', padding: '5px 10px', textAlign: 'center',
    fontWeight: 'bold', background: NAVY, color: '#fff', fontSize: '11px',
  }

  function periodText(start: string | null, end: string | null) {
    const fmt = (d: string | null) => d ? d.substring(0, 7).replace(/-/g, '/') : ''
    if (!start && !end) return ''
    if (!end) return `${fmt(start)}\n～現在`
    return `${fmt(start)}\n～${fmt(end)}`
  }

  return (
    <div style={base}>
      {/* タイトル行 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: `2px solid ${NAVY}`, paddingBottom: '10px', marginBottom: '4px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '0.4em', color: NAVY }}>職 務 経 歴 書</h1>
        <div style={{ textAlign: 'right', fontSize: '10px', color: '#555' }}>
          <div>{today()}現在</div>
          {profile?.name && <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1a1a1a', marginTop: '4px' }}>氏名　{profile.name}</div>}
        </div>
      </div>

      {/* 職務要約 */}
      {profile?.vision && (
        <>
          <div style={secHead}>■ 職務要約</div>
          <div style={{ background: '#fafbfc', border: '1px solid #dde4ed', borderRadius: '4px', padding: '10px 14px', marginBottom: '4px', whiteSpace: 'pre-wrap' }}>
            {profile.vision}
          </div>
        </>
      )}

      {/* 職務経歴 */}
      <div style={secHead}>■ 職務経歴</div>
      {jobs.length === 0 && <p style={{ color: '#999', paddingLeft: '8px' }}>職歴が登録されていません</p>}
      {jobs.map((job) => (
        <div key={job.id} style={{ marginBottom: '20px' }}>
          {/* 会社ヘッダー */}
          <div style={{ background: '#eaf0f8', border: `1px solid #c5d5e8`, borderBottom: 'none', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontWeight: 'bold', fontSize: '12px', color: NAVY }}>{job.company}</span>
            <span style={{ fontSize: '10px', color: '#555' }}>{formatPeriod(job.start_date, job.end_date)}</span>
          </div>
          {/* 事業内容 */}
          {job.description && (
            <div style={{ border: '1px solid #c5d5e8', borderBottom: 'none', padding: '5px 12px', fontSize: '10px', color: '#444', lineHeight: '1.7', background: '#fff' }}>
              <span style={{ fontWeight: 'bold', color: NAVY }}>事業内容：</span>{job.description}
            </div>
          )}
          {/* 期間 | 職務内容 テーブル */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: '130px' }}>期　間</th>
                <th style={thStyle}>職務内容</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdPeriod}>{periodText(job.start_date, job.end_date)}</td>
                <td style={tdContent}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px', color: NAVY }}>{job.title}</div>
                  {job.achievement && (
                    <div style={{ marginTop: '5px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#555' }}>【実績・成果】</span>
                      <span>{job.achievement}</span>
                    </div>
                  )}
                  {job.skills.length > 0 && (
                    <div style={{ marginTop: '6px' }}>
                      {job.skills.map(s => <Tag key={s} label={s} bg="#eff6ff" border="#bfdbfe" color="#1d4ed8" />)}
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      {/* 保有スキル */}
      {skills.length > 0 && (
        <>
          <div style={secHead}>■ 保有スキル</div>
          <div style={{ paddingLeft: '8px' }}>
            {skills.map(s => <Tag key={s} label={s} bg="#f8fafc" border="#cbd5e1" color="#334155" />)}
          </div>
        </>
      )}

      {/* 学歴・資格 */}
      {(profile?.education || profile?.certifications) && (
        <>
          <div style={secHead}>■ 学歴・資格</div>
          {profile.education && (
            <p style={{ paddingLeft: '8px', whiteSpace: 'pre-wrap', marginBottom: '4px' }}>{profile.education}</p>
          )}
          {profile.certifications && (
            <p style={{ paddingLeft: '8px', whiteSpace: 'pre-wrap' }}>{profile.certifications}</p>
          )}
        </>
      )}

      <div style={{ textAlign: 'right', marginTop: '20px', fontSize: '11px', color: '#555' }}>以上</div>
    </div>
  )
}

// ────────────────────────────────────────────
// 6. 職務経歴書 タイムライン型
// ────────────────────────────────────────────
export function ResumeTimeline({ jobs, profile }: TemplateProps) {
  const skills = uniqueSkills(jobs)
  const ACCENT = '#c2410c'
  const base: React.CSSProperties = {
    fontFamily: "'Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,sans-serif",
    fontSize: '11px', lineHeight: '1.9', color: '#1a1a1a', background: '#fff',
    width: '793px', minHeight: '1122px', padding: '0',
  }

  return (
    <div style={base}>
      {/* ヘッダーバー */}
      <div style={{ background: ACCENT, padding: '32px 52px 24px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 'bold', letterSpacing: '0.08em', marginBottom: '4px' }}>
              {profile?.name || '氏名未設定'}
            </h1>
            <p style={{ fontSize: '11px', opacity: 0.8, letterSpacing: '0.2em' }}>職務経歴書</p>
          </div>
          <p style={{ fontSize: '10px', opacity: 0.65 }}>作成日：{today()}</p>
        </div>
      </div>

      <div style={{ padding: '32px 52px' }}>
        {/* 学歴 */}
        {profile?.education && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '16px', height: '2px', background: ACCENT }} />
              学歴
            </h2>
            <p style={{ whiteSpace: 'pre-wrap', paddingLeft: '24px' }}>{profile.education}</p>
          </div>
        )}

        {/* 職歴タイムライン */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: ACCENT, letterSpacing: '0.1em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '16px', height: '2px', background: ACCENT }} />
            職務経歴
          </h2>
          {jobs.length === 0 && <p style={{ color: '#999', paddingLeft: '24px' }}>職歴が登録されていません</p>}
          <div style={{ position: 'relative', paddingLeft: '24px' }}>
            {/* 縦線 */}
            {jobs.length > 0 && (
              <div style={{ position: 'absolute', left: '6px', top: '8px', bottom: '8px', width: '2px', background: '#fed7aa' }} />
            )}
            {jobs.map((job) => (
              <div key={job.id} style={{ position: 'relative', marginBottom: '22px', paddingLeft: '28px' }}>
                {/* ドット */}
                <div style={{ position: 'absolute', left: '-6px', top: '5px', width: '14px', height: '14px', borderRadius: '50%', background: ACCENT, border: '2px solid #fff', boxShadow: `0 0 0 2px ${ACCENT}` }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{job.company}</span>
                  <span style={{ fontSize: '10px', color: '#777', flexShrink: 0, marginLeft: '8px' }}>{formatPeriod(job.start_date, job.end_date)}</span>
                </div>
                <div style={{ color: ACCENT, fontSize: '11px', marginBottom: '5px', fontWeight: '600' }}>{job.title}</div>
                {job.description && (
                  <div style={{ background: '#fff7ed', borderRadius: '6px', padding: '6px 10px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10px', color: '#9a3412', fontWeight: 'bold' }}>業務内容　</span>
                    <span style={{ fontSize: '11px' }}>{job.description}</span>
                  </div>
                )}
                {job.achievement && (
                  <div style={{ background: '#fef2f2', borderRadius: '6px', padding: '6px 10px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10px', color: '#b91c1c', fontWeight: 'bold' }}>実績・成果　</span>
                    <span style={{ fontSize: '11px' }}>{job.achievement}</span>
                  </div>
                )}
                {job.skills.length > 0 && (
                  <div style={{ marginTop: '5px' }}>
                    {job.skills.map(s => <Tag key={s} label={s} bg="#fff7ed" border="#fed7aa" color="#c2410c" />)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* スキル */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: ACCENT, letterSpacing: '0.1em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '16px', height: '2px', background: ACCENT }} />
              保有スキル
            </h2>
            <div style={{ paddingLeft: '24px' }}>
              {skills.map(s => <Tag key={s} label={s} bg="#f8fafc" border="#e2e8f0" color="#475569" />)}
            </div>
          </div>
        )}

        {/* 資格 */}
        {profile?.certifications && (
          <div>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: ACCENT, letterSpacing: '0.1em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '16px', height: '2px', background: ACCENT }} />
              資格・免許
            </h2>
            <p style={{ whiteSpace: 'pre-wrap', paddingLeft: '24px' }}>{profile.certifications}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────
// 6. 職務経歴書 エグゼクティブ型
// ────────────────────────────────────────────
export function ResumeExecutive({ jobs, profile }: TemplateProps) {
  const skills = uniqueSkills(jobs)
  const NAVY = '#1e3a5f'
  const GOLD = '#b8860b'
  const base: React.CSSProperties = {
    fontFamily: "'Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,sans-serif",
    fontSize: '11px', lineHeight: '1.9', color: '#1a1a1a', background: '#fff',
    width: '793px', minHeight: '1122px', padding: '52px 64px',
  }

  function Sec({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div style={{ marginBottom: '26px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', background: GOLD, borderRadius: '50%' }} />
          <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: NAVY, letterSpacing: '0.15em', flex: 1 }}>{title}</h2>
          <span style={{ display: 'block', flex: 1, height: '1px', background: '#c9b97a' }} />
        </div>
        {children}
      </div>
    )
  }

  return (
    <div style={base}>
      {/* ヘッダー */}
      <div style={{ textAlign: 'center', borderBottom: `2px solid ${GOLD}`, paddingBottom: '22px', marginBottom: '32px' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.5em', color: GOLD, marginBottom: '8px' }}>CURRICULUM VITAE</p>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: NAVY, letterSpacing: '0.25em', marginBottom: '6px' }}>
          {profile?.name || '氏名未設定'}
        </h1>
        <p style={{ fontSize: '10px', color: '#888' }}>
          {profile?.birth_date ? `生年月日：${profile.birth_date.replace(/-/g, '/')}　　` : ''}
          作成日：{today()}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0', marginTop: '12px' }}>
          <span style={{ display: 'inline-block', width: '40px', height: '1px', background: GOLD }} />
          <span style={{ display: 'inline-block', width: '8px', height: '8px', background: GOLD, borderRadius: '50%', margin: '0 6px', marginTop: '-4px' }} />
          <span style={{ display: 'inline-block', width: '40px', height: '1px', background: GOLD }} />
        </div>
      </div>

      {/* 学歴 */}
      {profile?.education && (
        <Sec title="学　歴">
          <p style={{ whiteSpace: 'pre-wrap', paddingLeft: '16px', color: '#333' }}>{profile.education}</p>
        </Sec>
      )}

      {/* 職歴 */}
      <Sec title="職務経歴">
        {jobs.length === 0 && <p style={{ color: '#999', paddingLeft: '16px' }}>職歴が登録されていません</p>}
        {jobs.map((job, i) => (
          <div key={job.id} style={{
            marginBottom: i < jobs.length - 1 ? '18px' : 0,
            paddingBottom: i < jobs.length - 1 ? '18px' : 0,
            borderBottom: i < jobs.length - 1 ? `1px solid #e8ddb5` : 'none',
            paddingLeft: '16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: NAVY }}>{job.company}</span>
              <span style={{ fontSize: '10px', color: GOLD, fontWeight: '600' }}>{formatPeriod(job.start_date, job.end_date)}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#555', marginBottom: '6px', fontStyle: 'italic' }}>{job.title}</div>
            {job.description && (
              <p style={{ marginBottom: '4px' }}>
                <span style={{ fontSize: '10px', color: NAVY, fontWeight: 'bold' }}>【業務内容】</span>　{job.description}
              </p>
            )}
            {job.achievement && (
              <p style={{ marginBottom: '4px' }}>
                <span style={{ fontSize: '10px', color: GOLD, fontWeight: 'bold' }}>【実績・成果】</span>　{job.achievement}
              </p>
            )}
            {job.skills.length > 0 && (
              <div style={{ marginTop: '6px' }}>
                {job.skills.map(s => <Tag key={s} label={s} bg="#fafaf5" border="#c9b97a" color="#7a6510" />)}
              </div>
            )}
          </div>
        ))}
      </Sec>

      {/* スキル */}
      {skills.length > 0 && (
        <Sec title="保有スキル">
          <div style={{ paddingLeft: '16px' }}>
            {skills.map(s => <Tag key={s} label={s} bg="#f0f4f8" border="#b0bec5" color={NAVY} />)}
          </div>
        </Sec>
      )}

      {/* 資格 */}
      {profile?.certifications && (
        <Sec title="資格・免許">
          <p style={{ whiteSpace: 'pre-wrap', paddingLeft: '16px', color: '#333' }}>{profile.certifications}</p>
        </Sec>
      )}
    </div>
  )
}

// ────────────────────────────────────────────
// 7. 履歴書 ミニマル
// ────────────────────────────────────────────
export function CVMinimal({ jobs, profile }: TemplateProps) {
  const td: React.CSSProperties = { border: '1px solid #ddd', padding: '7px 12px', verticalAlign: 'top', lineHeight: '1.8' }
  const th: React.CSSProperties = { ...td, background: '#fafafa', fontWeight: 'bold', textAlign: 'left', width: '110px', color: '#444' }

  function Row({ label, value }: { label: string; value?: string | null }) {
    if (!value) return null
    return (
      <tr>
        <th style={th}>{label}</th>
        <td style={td}>{value}</td>
      </tr>
    )
  }

  return (
    <div style={{
      fontFamily: "'Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,sans-serif",
      fontSize: '11px', color: '#1a1a1a', background: '#fff',
      width: '793px', minHeight: '1122px', padding: '48px 56px', lineHeight: '1.8',
    }}>
      {/* タイトル */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.6em', display: 'inline' }}>履歴書</h1>
        <span style={{ fontSize: '10px', color: '#888', marginLeft: '16px' }}>作成日：{today()}</span>
      </div>

      {/* 基本情報 */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <tbody>
          <Row label="氏　名" value={profile?.name} />
          <Row label="生年月日" value={profile?.birth_date?.replace(/-/g, '/')} />
        </tbody>
      </table>

      {/* 学歴 */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '11px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '8px', letterSpacing: '0.1em' }}>学　歴</p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {(profile?.education ? profile.education.split('\n') : ['　']).map((line, i) => (
              <tr key={i}>
                <td style={{ ...td, width: '110px', textAlign: 'center', color: '#666' }}></td>
                <td style={td}>{line || '　'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 職歴 */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '11px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '8px', letterSpacing: '0.1em' }}>職　歴</p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {jobs.length === 0 ? (
              <tr><td style={{ ...td, width: '110px' }}></td><td style={td}>　</td></tr>
            ) : jobs.map(job => (
              <tr key={job.id}>
                <td style={{ ...td, width: '110px', textAlign: 'center', color: '#666', whiteSpace: 'nowrap' }}>
                  {job.start_date ? job.start_date.substring(0, 7).replace(/-/g, '/') : ''}
                </td>
                <td style={td}>{job.company}　{job.title}として入社</td>
              </tr>
            ))}
            <tr>
              <td style={{ ...td, width: '110px' }}></td>
              <td style={{ ...td, textAlign: 'right', fontWeight: 'bold', color: '#555' }}>以上</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 資格 */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '11px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '8px', letterSpacing: '0.1em' }}>資格・免許</p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {(profile?.certifications ? profile.certifications.split('\n') : ['　']).map((line, i) => (
              <tr key={i}>
                <td style={{ ...td, width: '110px', textAlign: 'center', color: '#666' }}></td>
                <td style={td}>{line || '　'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 自己PR */}
      <div>
        <p style={{ fontSize: '11px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '8px', letterSpacing: '0.1em' }}>志望動機・自己PR</p>
        <div style={{ border: '1px solid #ddd', padding: '10px 12px', minHeight: '110px', lineHeight: '2', whiteSpace: 'pre-wrap' }}>
          {profile?.vision || '　'}
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────
// 8. 履歴書 詳細型（スキル・実績付き）
// ────────────────────────────────────────────
export function CVDetailed({ jobs, profile }: TemplateProps) {
  const skills = uniqueSkills(jobs)
  const ACCENT = '#6d28d9'
  const td: React.CSSProperties = { border: '1px solid #c4b5fd', padding: '6px 10px', verticalAlign: 'top', lineHeight: '1.8' }
  const th: React.CSSProperties = { ...td, background: '#f5f3ff', fontWeight: 'bold', textAlign: 'center', whiteSpace: 'nowrap', width: '100px', color: ACCENT }
  const secBar: React.CSSProperties = {
    background: ACCENT, color: '#fff', fontSize: '11px', fontWeight: 'bold',
    padding: '4px 12px', letterSpacing: '0.12em', marginBottom: '0',
  }

  return (
    <div style={{
      fontFamily: "'Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,sans-serif",
      fontSize: '11px', color: '#1a1a1a', background: '#fff',
      width: '793px', minHeight: '1122px', padding: '36px 44px', lineHeight: '1.8',
    }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: `3px solid ${ACCENT}`, paddingBottom: '14px', marginBottom: '18px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '0.4em', color: ACCENT }}>履　歴　書</h1>
          <p style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '4px' }}>{profile?.name || '氏名未設定'}</p>
        </div>
        <p style={{ fontSize: '10px', color: '#777' }}>作成日：{today()}</p>
      </div>

      {/* 基本情報 */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px' }}>
        <tbody>
          <tr>
            <th style={th}>生年月日</th>
            <td style={td}>{profile?.birth_date ? profile.birth_date.replace(/-/g, '/') : '　'}</td>
          </tr>
        </tbody>
      </table>

      {/* 学歴 */}
      <div style={secBar}>学　歴</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px' }}>
        <tbody>
          {(profile?.education ? profile.education.split('\n') : ['　']).map((line, i) => (
            <tr key={i}>
              <td style={{ ...td, width: '100px', textAlign: 'center' }}></td>
              <td style={td}>{line || '　'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 職歴 */}
      <div style={secBar}>職　歴</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px' }}>
        <tbody>
          {jobs.length === 0 ? (
            <tr><td style={{ ...td, width: '100px' }}></td><td style={td}>　</td></tr>
          ) : jobs.map(job => (
            <tr key={job.id}>
              <td style={{ ...td, width: '100px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                {job.start_date ? job.start_date.substring(0, 7).replace(/-/g, '/') : ''}
              </td>
              <td style={td}>
                <span style={{ fontWeight: 'bold' }}>{job.company}</span>　入社（{job.title}）
                {job.description && <div style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>業務：{job.description}</div>}
                {job.achievement && <div style={{ fontSize: '10px', color: ACCENT, marginTop: '2px' }}>実績：{job.achievement}</div>}
              </td>
            </tr>
          ))}
          <tr>
            <td style={{ ...td, width: '100px' }}></td>
            <td style={{ ...td, textAlign: 'right', fontWeight: 'bold' }}>以上</td>
          </tr>
        </tbody>
      </table>

      {/* スキル */}
      {skills.length > 0 && (
        <>
          <div style={secBar}>保有スキル</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px' }}>
            <tbody>
              <tr>
                <td style={{ ...td, lineHeight: '2' }}>
                  {skills.map(s => <Tag key={s} label={s} bg="#f5f3ff" border="#c4b5fd" color={ACCENT} />)}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}

      {/* 資格 */}
      <div style={secBar}>資格・免許</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px' }}>
        <tbody>
          {(profile?.certifications ? profile.certifications.split('\n') : ['　']).map((line, i) => (
            <tr key={i}>
              <td style={{ ...td, width: '100px', textAlign: 'center' }}></td>
              <td style={td}>{line || '　'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 自己PR */}
      <div style={secBar}>志望動機・自己PR</div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ ...td, minHeight: '100px', height: '100px', whiteSpace: 'pre-wrap', verticalAlign: 'top' }}>
              {profile?.vision || '　'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
