'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleSubmit() {
    if (!email || !password) { setError('メールアドレスとパスワードを入力してください'); return }
    setLoading(true)
    setError('')
    setMessage('')

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setMessage('確認メールを送信しました。メールのリンクをクリックしてください。')
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      console.log('data:', data)
      console.log('error:', error)
      if (error) {
        setError('エラー: ' + error.message)
      } else {
        console.log('成功！遷移します')
        window.location.href = '/dashboard'
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-accent font-semibold text-2xl tracking-tight mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            CareerVault
          </div>
          <div className="text-sm text-ink-3">職歴を資産に変えるアプリ</div>
        </div>

        <div className="card">
          <h2 className="font-bold text-base text-ink mb-5">
            {mode === 'login' ? 'ログイン' : 'アカウント作成'}
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-ink-2 mb-1">メールアドレス</label>
              <input type="email" className="form-input" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-2 mb-1">パスワード</label>
              <input type="password" className="form-input" placeholder="8文字以上"
                value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-surface-2 border border-red-900/40 rounded-lg text-red-400 text-xs">
              {error}
            </div>
          )}
          {message && (
            <div className="mt-3 p-3 bg-surface-2 border border-success/30 rounded-lg text-success text-xs">
              {message}
            </div>
          )}

          <button type="button" className="btn-primary w-full justify-center mt-4" onClick={handleSubmit} disabled={loading}>
            {loading ? '⏳ 処理中...' : mode === 'login' ? 'ログイン' : 'アカウントを作成'}
          </button>

          <div className="text-center mt-4 text-xs text-ink-3">
            {mode === 'login' ? (
              <>アカウントをお持ちでない方は{' '}
                <button className="text-accent hover:underline" onClick={() => { setMode('signup'); setError(''); setMessage('') }}>
                  新規登録
                </button>
              </>
            ) : (
              <>すでにアカウントをお持ちの方は{' '}
                <button className="text-accent hover:underline" onClick={() => { setMode('login'); setError(''); setMessage('') }}>
                  ログイン
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
