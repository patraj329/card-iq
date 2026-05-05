import { Plus, Check } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { formatCurrency, annualFeeLabel } from '../utils/formatters'
import useWallet from '../hooks/useWallet'

const ISSUER_COLORS = {
  'American Express': { bg: '#1A6B5A', accent: '#4DB89E' },
  'Chase': { bg: '#1A3A6B', accent: '#4D7DB8' },
  'Capital One': { bg: '#6B1A1A', accent: '#B84D4D' },
  'Citi': { bg: '#1A1A6B', accent: '#4D4DB8' },
  'Discover': { bg: '#6B4A1A', accent: '#B87E4D' },
  'Wells Fargo': { bg: '#6B3A1A', accent: '#B86A4D' },
  'Bank of America': { bg: '#1A4A3A', accent: '#4D9A80' },
}

function getIssuerStyle(issuer) {
  return ISSUER_COLORS[issuer] || { bg: '#2A2A2A', accent: '#C9A84C' }
}

export default function CardTile({ card, showAdd = true, compact = false }) {
  const { hasCard, addCard } = useWallet()
  const navigate = useNavigate()
  const inWallet = hasCard(card.id)
  const style = getIssuerStyle(card.issuer)

  const topRates = [...card.earningRates]
    .sort((a, b) => b.multiplier - a.multiplier)
    .slice(0, 3)

  return (
    <div
      className="rounded-xl overflow-hidden border flex flex-col cursor-pointer"
      style={{ borderColor: '#2A2A2A', background: '#161616' }}
      onClick={() => navigate(`/card/${card.id}`)}
    >
      {/* Card header */}
      <div
        className="p-4 pb-3 relative"
        style={{ background: `linear-gradient(135deg, ${style.bg}, #161616)` }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium mb-1" style={{ color: style.accent }}>{card.issuer}</p>
            <h3 className="font-semibold text-sm leading-tight" style={{ color: '#F5F5F5' }}>{card.name}</h3>
          </div>
          <span
            className="text-xs px-2 py-0.5 rounded-full shrink-0"
            style={{ background: '#0D0D0D99', color: '#999' }}
          >
            {card.type === 'business' ? 'Biz' : 'Personal'}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div>
            <p className="text-xs" style={{ color: '#666' }}>Annual Fee</p>
            <p className="text-sm font-semibold" style={{ color: card.annualFee === 0 ? '#4DB87A' : '#F5F5F5' }}>
              {annualFeeLabel(card.annualFee)}
            </p>
          </div>
          {card.signupBonus?.points > 0 && (
            <div>
              <p className="text-xs" style={{ color: '#666' }}>Welcome Bonus</p>
              <p className="text-sm font-semibold" style={{ color: '#C9A84C' }}>
                {(card.signupBonus.points / 1000).toFixed(0)}K pts
                <span className="text-xs font-normal ml-1" style={{ color: '#999' }}>
                  ≈{formatCurrency(card.signupBonus.estimatedValue)}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Earning rates */}
      {!compact && (
        <div className="px-4 py-3 flex-1" style={{ borderTop: '1px solid #2A2A2A' }}>
          <p className="text-xs font-medium mb-2" style={{ color: '#666' }}>TOP EARNING RATES</p>
          <div className="space-y-1">
            {topRates.map(rate => (
              <div key={rate.category} className="flex items-center justify-between">
                <span className="text-xs capitalize" style={{ color: '#999' }}>
                  {rate.category.replace(/_/g, ' ')}
                </span>
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded"
                  style={{ background: '#0D0D0D', color: '#C9A84C' }}
                >
                  {rate.multiplier}x
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {showAdd && (
        <div className="px-4 py-3" style={{ borderTop: '1px solid #2A2A2A' }}>
          <button
            onClick={e => { e.stopPropagation(); !inWallet && addCard(card.id) }}
            className="w-full flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-colors"
            style={
              inWallet
                ? { background: '#1A3A2A', color: '#4DB87A' }
                : { background: '#C9A84C22', color: '#C9A84C', border: '1px solid #C9A84C44' }
            }
          >
            {inWallet ? <><Check size={12} /> In Wallet</> : <><Plus size={12} /> Add to Wallet</>}
          </button>
        </div>
      )}
    </div>
  )
}
