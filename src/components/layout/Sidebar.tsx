'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const nav = [
  { href: '/dashboard', icon: '📊', label: 'ダッシュボード' },
  { href: '/career',    icon: '💼', label: '職歴登録' },
  { href: '/profile',   icon: '👤', label: 'プロフィール' },
  { href: '/chat',      icon: '🤖', label: 'AIキャリア相談' },
  { href: '/generate',  icon: '📄', label: '書類生成' },
  { href: '/template',  icon: '🗂️', label: 'テンプレート' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-[220px] shrink-0 bg-white border-r border-gray-100 flex flex-col fixed top-0 left-0 bottom-0 z-50">
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="text-accent font-semibold text-lg tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
          CareerVault
        </div>
        <div className="text-[11px] text-ink-3 mt-0.5">職歴を資産に変えるアプリ</div>
      </div>

      <nav className="flex-1 p-2.5">
        {nav.map(({ href, icon, label }) => (
          <Link key={href} href={href}
            className={`nav-item ${pathname.startsWith(href) ? 'active' : ''}`}>
            <span className="w-5 text-center text-base">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-2.5 border-t border-gray-100">
        <button onClick={logout}
          className="nav-item w-full text-left text-red-400 hover:bg-red-50 hover:text-red-500">
          <span className="w-5 text-center text-base">🚪</span>
          ログアウト
        </button>
      </div>
    </aside>
  )
}
