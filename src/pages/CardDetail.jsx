import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Check, Minus, Plus, GitCompare } from 'lucide-react'
import allCards from '../data/cards.json'
import useWallet from '../hooks/useWallet'
import { formatCurrency, formatPoints, annualFeeLabel } from '../utils/formatters'
import { getCPP } from '../utils/valueCalc'

const RATE_LABEL = {
  flights: 'Flights',
  hotels: 'Hotels',
  dining: 'Dining',
  travel: 'Travel',
  all: 'All Purchases',
  other: 'Other',
  large_purchases: 'Large Purchases',
  shipping: 'Shipping',
  advertising: 'Advertising',
  telecom: 'Telecom / Internet',
  drugstore: 'Drugstore',
}

export default function CardDetail() {
  const { id } = useParams()
  const card = allCards.find(c => c.id === id)
  const { hasCard, addCard } = useWallet()
  const inWallet = hasCard(id)
  const cpp = card ? getCPP(card.rewardsProgram) : 1

  if (!card) {
    return (
      <div className="p-6 text-center">
        <p style={{ color: '#666' }}>Card not found.</p>
        <Link to="/explorer" style={{ color: '#C9A84C' }}>← Back to Explorer</Link>
      </div>
    )
  }

  const hasLounge = Object.values(card.loungeAccess || {}).some(Boolean)

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      {/* Back */}
      <Link to="/explorer" className="inline-flex items-center gap-1 text-sm mb-5" style={{ color: '#666' }}>
        <ArrowLeft size={14} /> Explorer
      </Link>

      {/* Header */}
      <div
        className="rounded-xl p-5 mb-5"
        style={{ background: 'linear-gradient(135deg, #1A1A2A, #161616)', border: '1px solid #2A2A2A' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs mb-1" style={{ color: '#C9A84C' }}>{card.issuer}</p>
            <h1 className="text-xl font-bold mb-2" style={{ color: '#F5F5F5' }}>{card.name}</h1>
            <p className="text-sm" style={{ color: '#777' }}>{card.bestFor}</p>
          </div>
          <span className="px-2 py-1 rounded-lg text-xs" style={{ background: '#2A2A2A', color: '#999' }}>
            {card.type === 'business' ? 'Business' : 'Personal'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <div>
            <p className="text-xs mb-1" style={{ color: '#555' }}>Annual Fee</p>
            <p className="text-base font-bold" style={{ color: card.annualFee === 0 ? '#4DB87A' : '#F5F5F5' }}>
              {annualFeeLabel(card.annualFee)}
            </p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: '#555' }}>Rewards</p>
            <p className="text-base font-bold" style={{ color: '#F5F5F5' }}>{card.rewardsProgram}</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: '#555' }}>CPP</p>
            <p className="text-base font-bold" style={{ color: '#C9A84C' }}>{cpp}¢</p>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={() => !inWallet && addCard(card.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
            style={
              inWallet
                ? { background: '#1A3A2A', color: '#4DB87A' }
                : { background: '#C9A84C', color: '#0D0D0D' }
            }
          >
            {inWallet ? <><Check size={14} /> In Your Wallet</> : <><Plus size={14} /> Add to Wallet</>}
          </button>
          <Link
            to={`/compare?cards=${card.id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: '#2A2A2A', color: '#999' }}
          >
            <GitCompare size={14} /> Compare
          </Link>
        </div>
      </div>

      {/* Sign-up Bonus */}
      {card.signupBonus?.points > 0 && (
        <div className="rounded-xl p-4 mb-4" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: '#C9A84C' }}>WELCOME BONUS</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold" style={{ color: '#F5F5F5' }}>{formatPoints(card.signupBonus.points)} pts</p>
              <p className="text-sm" style={{ color: '#666' }}>
                Spend {formatCurrency(card.signupBonus.minSpend)} in {card.signupBonus.timeframeDays} days
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: '#555' }}>Est. Value</p>
              <p className="text-xl font-bold" style={{ color: '#C9A84C' }}>
                {formatCurrency(card.signupBonus.estimatedValue)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Earning Rates */}
      <div className="rounded-xl p-4 mb-4" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
        <p className="text-xs font-semibold mb-3" style={{ color: '#C9A84C' }}>EARNING RATES</p>
        <div className="space-y-2">
          {card.earningRates.map(rate => (
            <div key={rate.category} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium" style={{ color: '#F5F5F5' }}>
                  {RATE_LABEL[rate.category] || rate.category}
                </p>
                {rate.notes && <p className="text-xs" style={{ color: '#555' }}>{rate.notes}</p>}
              </div>
              <div className="text-right">
                <span
                  className="text-sm font-bold px-2 py-1 rounded-lg"
                  style={{ background: '#C9A84C22', color: '#C9A84C' }}
                >
                  {rate.multiplier}x
                </span>
                <p className="text-xs mt-0.5" style={{ color: '#555' }}>
                  {(rate.multiplier * cpp).toFixed(1)}% back
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Credits */}
      {card.credits?.length > 0 && (
        <div className="rounded-xl p-4 mb-4" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: '#C9A84C' }}>ANNUAL CREDITS</p>
          <div className="space-y-3">
            {card.credits.map(cr => (
              <div key={cr.id} className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: '#F5F5F5' }}>{cr.name}</p>
                  <p className="text-xs" style={{ color: '#555' }}>{cr.merchant}</p>
                  {cr.splits && (
                    <div className="flex gap-2 mt-1">
                      {cr.splits.map((s, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded" style={{ background: '#2A2A2A', color: '#777' }}>
                          {s.period}: {formatCurrency(s.amount)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-base font-bold shrink-0" style={{ color: '#C9A84C' }}>{formatCurrency(cr.amount)}</p>
              </div>
            ))}
            <div className="pt-2 flex justify-between" style={{ borderTop: '1px solid #2A2A2A' }}>
              <p className="text-xs font-medium" style={{ color: '#666' }}>Total Annual Credits</p>
              <p className="text-sm font-bold" style={{ color: '#C9A84C' }}>
                {formatCurrency(card.credits.reduce((s, c) => s + c.amount, 0))}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lounge Access */}
      {hasLounge && (
        <div className="rounded-xl p-4 mb-4" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: '#C9A84C' }}>LOUNGE ACCESS</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(card.loungeAccess).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2">
                {v ? <Check size={13} color="#4DB87A" /> : <Minus size={13} color="#444" />}
                <span className="text-xs capitalize" style={{ color: v ? '#F5F5F5' : '#444' }}>
                  {k.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transfer Partners */}
      {card.transferPartners?.length > 0 && (
        <div className="rounded-xl p-4 mb-4" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: '#C9A84C' }}>
            TRANSFER PARTNERS ({card.transferPartners.length})
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
            {card.transferPartners.map((p, i) => (
              <div key={p} className="flex items-center gap-2">
                <span className="text-xs font-bold w-5 text-right shrink-0" style={{ color: '#C9A84C' }}>{i + 1}</span>
                <span className="text-sm" style={{ color: '#F5F5F5' }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Protections */}
      <div className="rounded-xl p-4" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
        <p className="text-xs font-semibold mb-3" style={{ color: '#C9A84C' }}>TRAVEL & PURCHASE PROTECTIONS</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(card.travelProtections || {}).map(([k, v]) => (
            <div key={k} className="flex items-center gap-2">
              {v ? <Check size={13} color="#4DB87A" /> : <Minus size={13} color="#444" />}
              <span className="text-xs" style={{ color: v ? '#F5F5F5' : '#444' }}>
                {k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Check size={13} color={card.foreignTransactionFee === false ? '#4DB87A' : '#8A3A3A'} />
            <span className="text-xs" style={{ color: card.foreignTransactionFee === false ? '#F5F5F5' : '#8A3A3A' }}>
              {card.foreignTransactionFee === false ? 'No Foreign Transaction Fee' : 'Has FTF'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
