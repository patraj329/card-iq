import { useState } from 'react'
import { Zap, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import allCards from '../data/cards.json'
import useWallet from '../hooks/useWallet'
import { rankCardsForCategory, getCPP } from '../utils/valueCalc'
import { formatCurrency, formatPoints } from '../utils/formatters'

const CATEGORIES = [
  { id: 'flights', label: 'Flights', icon: '✈️' },
  { id: 'hotels', label: 'Hotels', icon: '🏨' },
  { id: 'dining', label: 'Dining', icon: '🍽️' },
  { id: 'travel', label: 'Travel', icon: '🗺️' },
  { id: 'large_purchases', label: 'Large Purchases ($5K+)', icon: '💳' },
  { id: 'shipping', label: 'Shipping', icon: '📦' },
  { id: 'advertising', label: 'Advertising', icon: '📢' },
  { id: 'telecom', label: 'Telecom / Internet', icon: '📡' },
  { id: 'drugstore', label: 'Drugstore', icon: '💊' },
  { id: 'all', label: 'Everything Else', icon: '🛒' },
]

export default function Finder() {
  const { cardIds } = useWallet()
  const walletCards = cardIds.map(id => allCards.find(c => c.id === id)).filter(Boolean)

  const [selectedCategory, setSelectedCategory] = useState('')
  const [spendAmount, setSpendAmount] = useState('')

  const category = CATEGORIES.find(c => c.id === selectedCategory)

  const walletRanked = selectedCategory ? rankCardsForCategory(walletCards, selectedCategory) : []
  const nonWalletRanked = selectedCategory
    ? rankCardsForCategory(allCards.filter(c => !cardIds.includes(c.id)), selectedCategory).slice(0, 3)
    : []

  const spend = parseFloat(spendAmount) || null

  function calcPoints(card, multiplier) {
    return spend ? Math.round(spend * multiplier) : null
  }
  function calcValue(card, multiplier) {
    const cpp = getCPP(card.rewardsProgram)
    return spend ? (spend * multiplier * cpp) / 100 : null
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1" style={{ color: '#F5F5F5' }}>Best Card Finder</h1>
        <p className="text-sm" style={{ color: '#666' }}>Find the best card in your wallet for any purchase category</p>
      </div>

      {walletCards.length === 0 && (
        <div className="rounded-xl p-6 text-center mb-6" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
          <p className="text-sm mb-3" style={{ color: '#666' }}>Add cards to your wallet to see personalized recommendations</p>
          <Link to="/" className="text-sm font-medium" style={{ color: '#C9A84C' }}>Go to My Wallet →</Link>
        </div>
      )}

      {/* Category selector */}
      <div className="mb-6">
        <p className="text-xs font-medium mb-3" style={{ color: '#666' }}>SELECT SPEND CATEGORY</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-sm transition-colors"
              style={{
                background: selectedCategory === cat.id ? '#C9A84C18' : '#161616',
                border: `1px solid ${selectedCategory === cat.id ? '#C9A84C44' : '#2A2A2A'}`,
                color: selectedCategory === cat.id ? '#C9A84C' : '#999',
              }}
            >
              <span>{cat.icon}</span>
              <span className="font-medium text-xs">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Optional spend amount */}
      {selectedCategory && (
        <div className="mb-6">
          <p className="text-xs font-medium mb-2" style={{ color: '#666' }}>SPEND AMOUNT (OPTIONAL)</p>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-sm" style={{ color: '#555' }}>$</span>
            <input
              type="number"
              placeholder="0.00"
              value={spendAmount}
              onChange={e => setSpendAmount(e.target.value)}
              className="w-full rounded-xl pl-7 pr-4 py-2.5 text-sm"
              style={{ background: '#1C1C1C', color: '#F5F5F5', border: '1px solid #2A2A2A' }}
            />
          </div>
        </div>
      )}

      {/* Results: Wallet cards */}
      {selectedCategory && walletCards.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} color="#C9A84C" />
            <p className="text-sm font-semibold" style={{ color: '#F5F5F5' }}>Your Wallet — Ranked</p>
          </div>
          <div className="space-y-2">
            {walletRanked.map(({ card, multiplier, cpp }, i) => {
              const pts = calcPoints(card, multiplier)
              const val = calcValue(card, multiplier)
              return (
                <div
                  key={card.id}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: i === 0 ? '#1A1508' : '#161616',
                    border: `1px solid ${i === 0 ? '#C9A84C33' : '#2A2A2A'}`,
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                    style={{
                      background: i === 0 ? '#C9A84C' : '#2A2A2A',
                      color: i === 0 ? '#0D0D0D' : '#666',
                    }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#F5F5F5' }}>{card.name}</p>
                    <p className="text-xs" style={{ color: '#666' }}>{card.rewardsProgram}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: i === 0 ? '#C9A84C' : '#F5F5F5' }}>
                      {multiplier}x
                    </p>
                    {pts && (
                      <p className="text-xs" style={{ color: '#666' }}>
                        {formatPoints(pts)} pts ≈ {formatCurrency(val)}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Results: Non-wallet cards */}
      {selectedCategory && nonWalletRanked.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} color="#4D8AB8" />
            <p className="text-sm font-semibold" style={{ color: '#F5F5F5' }}>Cards You Don't Have</p>
          </div>
          <div className="space-y-2">
            {nonWalletRanked.map(({ card, multiplier }) => (
              <div
                key={card.id}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: '#161616', border: '1px solid #1E2A3A' }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#F5F5F5' }}>{card.name}</p>
                  <p className="text-xs" style={{ color: '#666' }}>{card.issuer} · ${card.annualFee}/yr</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold" style={{ color: '#4D8AB8' }}>{multiplier}x</p>
                  <Link to={`/card/${card.id}`} className="text-xs px-2 py-1 rounded-lg" style={{ background: '#1A2A3A', color: '#4D8AB8' }}>
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
