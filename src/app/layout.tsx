import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CareerVault — 職歴を資産に',
  description: '職歴を蓄積して、AIが履歴書・職務経歴書を自動生成するキャリア管理アプリ',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
