import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Plus, Trash2, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react'
import useWallet from '../hooks/useWallet'
import CreditBadge from '../components/CreditBadge'
import { calcCardValue, pointsToValue } from '../utils/valueCalc'
import { formatCurrency, formatPoints, annualFeeLabel } from '../utils/formatters'
import allCards from '../data/cards.json'

function WalletSummary({ cards }) {
  const { entries } = useWallet()

  const totalRemainingValue = cards.reduce((sum, card) => {
    const entry = entries[card.id] || { pointsBalance: 0, usedCredits: {} }
    return sum + calcCardValue(card, entry)
  }, 0)

  const totalAnnualFees = cards.reduce((sum, c) => sum + c.annualFee, 0)

  const expiringCredits = cards.flatMap(card =>
    (card.credits || []).filter(cr => {
      const entry = entries[card.id] || {}
      return !entry.usedCredits?.[cr.id] && cr.frequency === 'annual'
    }).map(cr => ({ ...cr, cardName: card.name }))
  )

  return (
    <div
      className="rounded-xl p-5 mb-6"
      style={{ background: 'linear-gradient(135deg, #1A1508, #161616)', border: '1px solid #2A2010' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: '#999' }}>ESTIMATED REMAINING VALUE</p>
          <p className="text-3xl font-bold" style={{ color: '#C9A84C' }}>{formatCurrency(totalRemainingValue)}</p>
          <p className="text-xs mt-1" style={{ color: '#555' }}>from {cards.length} card{cards.length !== 1 ? 's' : ''} in wallet</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium mb-1" style={{ color: '#999' }}>ANNUAL FEES</p>
          <p className="text-lg font-semibold" style={{ color: '#F5F5F5' }}>{formatCurrency(totalAnnualFees)}</p>
        </div>
      </div>

      {expiringCredits.length > 0 && (
        <div
          className="rounded-lg px-3 py-2.5 flex items-start gap-2"
          style={{ background: '#2A1A0822', border: '1px solid #C9A84C33' }}
        >
          <TrendingUp size={14} color="#C9A84C" className="mt-0.5 shrink-0" />
          <p className="text-xs" style={{ color: '#C9A84C' }}>
            You have {expiringCredits.length} unused credit{expiringCredits.length !== 1 ? 's' : ''} — track them below to make sure you use them before year end.
          </p>
        </div>
      )}
    </div>
  )
}

function WalletCard({ card }) {
  const { getEntry, setPoints, toggleCredit, removeCard } = useWallet()
  const navigate = useNavigate()
  const entry = getEntry(card.id)
  const [expanded, setExpanded] = useState(false)
  const [editingPoints, setEditingPoints] = useState(false)
  const [pointsInput, setPointsInput] = useState(entry.pointsBalance || '')

  const remainingValue = calcCardValue(card, entry)
  const pointsValue = pointsToValue(entry.pointsBalance || 0, card.rewardsProgram)
  const unusedCreditsValue = (card.credits || []).reduce((sum, cr) => {
    return sum + (entry.usedCredits?.[cr.id] ? 0 : cr.amount)
  }, 0)

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
      <div className="p-4 cursor-pointer" onClick={() => navigate(`/card/${card.id}`)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs mb-0.5" style={{ color: '#666' }}>{card.issuer}</p>
            <h3 className="font-semibold text-sm" style={{ color: '#F5F5F5' }}>{card.name}</h3>
            <p className="text-xs mt-0.5" style={{ color: '#555' }}>{annualFeeLabel(card.annualFee)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: '#666' }}>Remaining Value</p>
            <p className="text-lg font-bold" style={{ color: '#C9A84C' }}>{formatCurrency(remainingValue)}</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {/* Points balance */}
          <div className="rounded-lg p-3" style={{ background: '#1C1C1C' }}>
            <p className="text-xs mb-1" style={{ color: '#666' }}>Points Balance</p>
            {editingPoints ? (
              <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                <input
                  type="number"
                  value={pointsInput}
                  onChange={e => setPointsInput(e.target.value)}
                  className="flex-1 rounded px-2 py-1 text-sm w-0"
                  style={{ background: '#2A2A2A', color: '#F5F5F5', border: '1px solid #3A3A3A' }}
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter') { setPoints(card.id, pointsInput); setEditingPoints(false) }
                    if (e.key === 'Escape') setEditingPoints(false)
                  }}
                />
                <button
                  onClick={() => { setPoints(card.id, pointsInput); setEditingPoints(false) }}
                  className="text-xs px-2 rounded"
                  style={{ background: '#C9A84C', color: '#0D0D0D' }}
                >Save</button>
              </div>
            ) : (
              <button onClick={e => { e.stopPropagation(); setEditingPoints(true) }} className="text-left w-full">
                <p className="text-sm font-semibold" style={{ color: '#F5F5F5' }}>
                  {entry.pointsBalance ? formatPoints(entry.pointsBalance) : <span style={{ color: '#444' }}>Tap to enter</span>}
                </p>
                {entry.pointsBalance > 0 && (
                  <p className="text-xs" style={{ color: '#666' }}>≈ {formatCurrency(pointsValue)}</p>
                )}
              </button>
            )}
          </div>

          {/* Credits summary */}
          <div className="rounded-lg p-3" style={{ background: '#1C1C1C' }}>
            <p className="text-xs mb-1" style={{ color: '#666' }}>Unused Credits</p>
            <p className="text-sm font-semibold" style={{ color: unusedCreditsValue > 0 ? '#C9A84C' : '#4DB87A' }}>
              {formatCurrency(unusedCreditsValue)}
            </p>
            <p className="text-xs" style={{ color: '#555' }}>
              {card.credits?.length || 0} credit{(card.credits?.length || 0) !== 1 ? 's' : ''} total
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={e => { e.stopPropagation(); setExpanded(!expanded) }}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium"
            style={{ background: '#2A2A2A', color: '#999' }}
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? 'Hide' : 'Track'} Credits
          </button>
          <button
            onClick={e => { e.stopPropagation(); removeCard(card.id) }}
            className="px-3 py-2 rounded-lg"
            style={{ background: '#2A1A1A', color: '#8A3A3A' }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {expanded && card.credits?.length > 0 && (
        <div className="px-4 pb-4 space-y-2" style={{ borderTop: '1px solid #2A2A2A', paddingTop: 12 }} onClick={e => e.stopPropagation()}>
          {card.credits.map(credit => (
            <CreditBadge
              key={credit.id}
              credit={credit}
              used={!!entry.usedCredits?.[credit.id]}
              onToggle={used => toggleCredit(card.id, credit.id, used)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyWallet({ onSearch, query, setQuery }) {
  const results = query.length > 1
    ? allCards.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.issuer.toLowerCase().includes(query.toLowerCase()))
    : []
  const { addCard } = useWallet()

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#1C1C1C' }}>
        <Plus size={24} color="#C9A84C" />
      </div>
      <h2 className="text-lg font-semibold mb-2" style={{ color: '#F5F5F5' }}>Add your first card</h2>
      <p className="text-sm mb-6 max-w-xs" style={{ color: '#666' }}>
        Search for a card to add to your wallet and start tracking benefits and credits.
      </p>
      <div className="w-full max-w-sm">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-3" color="#555" />
          <input
            type="text"
            placeholder="Search cards..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm"
            style={{ background: '#1C1C1C', color: '#F5F5F5', border: '1px solid #2A2A2A' }}
          />
        </div>
        {results.length > 0 && (
          <div className="mt-2 rounded-xl overflow-hidden" style={{ border: '1px solid #2A2A2A', background: '#161616' }}>
            {results.map(card => (
              <button
                key={card.id}
                onClick={() => { addCard(card.id); setQuery('') }}
                className="flex items-center justify-between w-full px-4 py-3 text-left transition-colors"
                style={{ borderBottom: '1px solid #1E1E1E', color: '#F5F5F5' }}
              >
                <div>
                  <p className="text-sm font-medium">{card.name}</p>
                  <p className="text-xs" style={{ color: '#666' }}>{card.issuer} · {annualFeeLabel(card.annualFee)}</p>
                </div>
                <Plus size={14} color="#C9A84C" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Wallet() {
  const { cardIds } = useWallet()
  const walletCards = cardIds.map(id => allCards.find(c => c.id === id)).filter(Boolean)
  const [searchQuery, setSearchQuery] = useState('')
  const [addQuery, setAddQuery] = useState('')

  const addResults = addQuery.length > 1
    ? allCards.filter(c =>
        !cardIds.includes(c.id) &&
        (c.name.toLowerCase().includes(addQuery.toLowerCase()) || c.issuer.toLowerCase().includes(addQuery.toLowerCase()))
      )
    : []
  const { addCard } = useWallet()

  if (walletCards.length === 0) {
    return (
      <div className="p-6">
        <EmptyWallet query={searchQuery} setQuery={setSearchQuery} />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#F5F5F5' }}>My Wallet</h1>
          <p className="text-sm" style={{ color: '#666' }}>{walletCards.length} card{walletCards.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-2.5" color="#555" />
          <input
            type="text"
            placeholder="Add a card..."
            value={addQuery}
            onChange={e => setAddQuery(e.target.value)}
            className="rounded-xl pl-8 pr-4 py-2 text-sm w-48"
            style={{ background: '#1C1C1C', color: '#F5F5F5', border: '1px solid #2A2A2A' }}
          />
          {addResults.length > 0 && (
            <div
              className="absolute right-0 top-10 w-72 rounded-xl overflow-hidden z-10"
              style={{ background: '#1C1C1C', border: '1px solid #2A2A2A', boxShadow: '0 8px 32px #00000088' }}
            >
              {addResults.map(card => (
                <button
                  key={card.id}
                  onClick={() => { addCard(card.id); setAddQuery('') }}
                  className="flex items-center justify-between w-full px-4 py-3 text-left"
                  style={{ borderBottom: '1px solid #222', color: '#F5F5F5' }}
                >
                  <div>
                    <p className="text-sm font-medium">{card.name}</p>
                    <p className="text-xs" style={{ color: '#666' }}>{card.issuer} · {annualFeeLabel(card.annualFee)}</p>
                  </div>
                  <Plus size={13} color="#C9A84C" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <WalletSummary cards={walletCards} />

      <div className="space-y-4">
        {walletCards.map(card => (
          <WalletCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}
