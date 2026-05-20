import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Wallet from './pages/Wallet'
import Explorer from './pages/Explorer'
import Compare from './pages/Compare'
import Finder from './pages/Finder'
import CardDetail from './pages/CardDetail'
import Login from './pages/Login'
import useAuth from './hooks/useAuth'
import useWallet from './hooks/useWallet'

function AuthGate() {
  const { user, loading } = useAuth()
  const { init, reset } = useWallet()

  useEffect(() => {
    if (user) {
      init(user.id)
    } else {
      reset()
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D0D0D' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#C9A84C', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!user) return <Login />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Wallet />} />
          <Route path="explorer" element={<Explorer />} />
          <Route path="compare" element={<Compare />} />
          <Route path="finder" element={<Finder />} />
          <Route path="card/:id" element={<CardDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return <AuthGate />
}
