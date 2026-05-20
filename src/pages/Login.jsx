import { useState } from 'react'
import { CreditCard, Loader } from 'lucide-react'
import useAuth from '../hooks/useAuth'

export default function Login() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else {
        await signUp(email, password)
        setMessage('Check your email to confirm your account, then log in.')
        setMode('login')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0D0D0D' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: '#C9A84C' }}
          >
            <CreditCard size={20} color="#0D0D0D" />
          </div>
          <span className="text-2xl font-bold" style={{ color: '#F5F5F5' }}>
            Card<span style={{ color: '#C9A84C' }}>IQ</span>
          </span>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6"
          style={{ background: '#161616', border: '1px solid #2A2A2A' }}
        >
          <h2 className="text-lg font-semibold mb-1" style={{ color: '#F5F5F5' }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-sm mb-6" style={{ color: '#666' }}>
            {mode === 'login'
              ? 'Sign in to access your wallet'
              : 'Sign up to start tracking your cards'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: '#999' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full rounded-xl px-4 py-2.5 text-sm"
                style={{ background: '#1C1C1C', color: '#F5F5F5', border: '1px solid #2A2A2A' }}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: '#999' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl px-4 py-2.5 text-sm"
                style={{ background: '#1C1C1C', color: '#F5F5F5', border: '1px solid #2A2A2A' }}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ background: '#2A1A1A', color: '#C97070' }}>
                {error}
              </p>
            )}
            {message && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ background: '#1A2A1A', color: '#4DB87A' }}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold mt-2"
              style={{ background: '#C9A84C', color: '#0D0D0D', opacity: loading ? 0.7 : 1 }}
            >
              {loading && <Loader size={14} className="animate-spin" />}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Toggle */}
        <p className="text-center text-sm mt-4" style={{ color: '#555' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setMessage('') }}
            className="font-medium"
            style={{ color: '#C9A84C' }}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
