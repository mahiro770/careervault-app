'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const nav = [
  { href: '/dashboard', icon: '⊞',  label: 'ダッシュボード' },
  { href: '/career',    icon: '◈',  label: '職歴登録' },
  { href: '/profile',   icon: '○',  label: 'プロフィール' },
  { href: '/chat',      icon: '◇',  label: 'AIキャリア相談' },
  { href: '/generate',  icon: '◻',  label: '書類生成' },
  { href: '/template',  icon: '▦',  label: 'テンプレート' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-[220px] shrink-0 bg-canvas border-r border-hairline flex flex-col fixed top-0 left-0 bottom-0 z-50">
      {/* ロゴ */}
      <div className="px-5 py-5 border-b border-hairline">
        <div className="text-accent font-semibold text-[17px] tracking-tight" style={{ letterSpacing: '-0.03em' }}>
          CareerVault
        </div>
        <div className="text-[11px] text-ink-4 mt-0.5 tracking-wide">職歴を資産に変えるアプリ</div>
      </div>

      {/* ナビ */}
      <nav className="flex-1 p-2.5 pt-3">
        <p className="section-label">メニュー</p>
        {nav.map(({ href, icon, label }) => (
          <Link key={href} href={href}
            className={`nav-item ${pathname.startsWith(href) ? 'active' : ''}`}>
            <span className="w-4 text-center text-[13px] opacity-70">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      {/* ログアウト */}
      <div className="p-2.5 border-t border-hairline">
        <button onClick={logout}
          className="nav-item w-full text-left text-ink-4 hover:bg-surface-2 hover:text-red-400">
          <span className="w-4 text-center text-[13px] opacity-70">→</span>
          ログアウト
        </button>
      </div>
    </aside>
  )
}
