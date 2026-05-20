import { NavLink, Outlet } from 'react-router-dom'
import { Wallet, Search, GitCompare, Zap, CreditCard, LogOut, TrendingUp } from 'lucide-react'
import useWallet from '../hooks/useWallet'
import useAuth from '../hooks/useAuth'

const NAV = [
  { to: '/', icon: Wallet, label: 'My Wallet' },
  { to: '/explorer', icon: Search, label: 'Explorer' },
  { to: '/compare', icon: GitCompare, label: 'Compare' },
  { to: '/finder', icon: Zap, label: 'Card Finder' },
  { to: '/redeem', icon: TrendingUp, label: 'Redeem' },
]

export default function Layout() {
  const { cardIds } = useWallet()
  const { user, signOut } = useAuth()

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0D0D0D' }}>
      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col w-56 shrink-0 py-6 px-4"
        style={{ background: '#111111', borderRight: '1px solid #1E1E1E' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 mb-8">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: '#C9A84C' }}
          >
            <CreditCard size={15} color="#0D0D0D" />
          </div>
          <div>
            <span className="text-sm font-bold" style={{ color: '#F5F5F5' }}>Card</span>
            <span className="text-sm font-bold" style={{ color: '#C9A84C' }}>IQ</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? 'active-nav' : ''}`
              }
              style={({ isActive }) => ({
                background: isActive ? '#C9A84C18' : 'transparent',
                color: isActive ? '#C9A84C' : '#777',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={16} color={isActive ? '#C9A84C' : '#555'} />
                  <span className="font-medium">{label}</span>
                  {label === 'My Wallet' && cardIds.length > 0 && (
                    <span
                      className="ml-auto text-xs px-1.5 py-0.5 rounded-full"
                      style={{ background: '#C9A84C22', color: '#C9A84C' }}
                    >
                      {cardIds.length}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-2 space-y-2">
          <p className="text-xs truncate" style={{ color: '#444' }}>{user?.email}</p>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-xs w-full px-2 py-1.5 rounded-lg"
            style={{ color: '#666', background: '#1A1A1A' }}
          >
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header
          className="md:hidden flex items-center justify-between px-4 py-3"
          style={{ background: '#111111', borderBottom: '1px solid #1E1E1E' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: '#C9A84C' }}>
              <CreditCard size={12} color="#0D0D0D" />
            </div>
            <span className="text-sm font-bold" style={{ color: '#F5F5F5' }}>Card<span style={{ color: '#C9A84C' }}>IQ</span></span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav
          className="md:hidden flex border-t"
          style={{ background: '#111111', borderColor: '#1E1E1E' }}
        >
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className="flex-1 flex flex-col items-center py-3 gap-1"
              style={({ isActive }) => ({ color: isActive ? '#C9A84C' : '#555' })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} color={isActive ? '#C9A84C' : '#555'} />
                  <span className="text-xs">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
