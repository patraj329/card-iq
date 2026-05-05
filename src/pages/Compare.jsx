import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, X, Check, Minus } from 'lucide-react'
import allCards from '../data/cards.json'
import { formatCurrency, formatPoints, annualFeeLabel } from '../utils/formatters'
import { getCPP } from '../utils/valueCalc'

const SPEND_CATEGORIES = ['flights', 'hotels', 'dining', 'travel', 'all', 'large_purchases', 'shipping', 'advertising', 'telecom', 'drugstore']

function getBestRate(cards, category) {
  const rates = cards.map(c => {
    const match = c.earningRates.find(r => r.category === category)
    if (match) return match.multiplier
    const fallback = c.earningRates.find(r => r.category === 'all' || r.category === 'other')
    return fallback?.multiplier || 1
  })
  return Math.max(...rates)
}

function Row({ label, values, highlight, format = v => v }) {
  const best = highlight ? Math.max(...values.map(v => typeof v === 'number' ? v : 0)) : null
  return (
    <tr style={{ borderBottom: '1px solid #1E1E1E' }}>
      <td className="py-3 pr-4 text-xs font-medium" style={{ color: '#666', width: 140 }}>{label}</td>
      {values.map((val, i) => {
        const isBest = highlight && typeof val === 'number' && val === best && val > 0
        return (
          <td key={i} className="py-3 px-2 text-sm text-center" style={{ color: isBest ? '#C9A84C' : '#F5F5F5', fontWeight: isBest ? 600 : 400 }}>
            {isBest && <span className="inline-block w-1 h-1 rounded-full mr-1.5 align-middle" style={{ background: '#C9A84C' }} />}
            {format(val)}
          </td>
        )
      })}
    </tr>
  )
}

function BoolRow({ label, values }) {
  return (
    <tr style={{ borderBottom: '1px solid #1E1E1E' }}>
      <td className="py-3 pr-4 text-xs font-medium" style={{ color: '#666', width: 140 }}>{label}</td>
      {values.map((val, i) => (
        <td key={i} className="py-3 px-2 text-center">
          {val
            ? <Check size={14} color="#4DB87A" className="inline" />
            : <Minus size={14} color="#444" className="inline" />}
        </td>
      ))}
    </tr>
  )
}

function CardPicker({ slot, selected, onPick, onRemove }) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const results = search.length > 1
    ? allCards.filter(c => !selected.includes(c.id) && (c.name.toLowerCase().includes(search.toLowerCase()) || c.issuer.toLowerCase().includes(search.toLowerCase())))
    : []

  if (slot) {
    return (
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: '#1C1C1C', border: '1px solid #2A2A2A' }}>
          <div className="flex-1 min-w-0">
            <p className="text-xs" style={{ color: '#666' }}>{slot.issuer}</p>
            <p className="text-sm font-semibold truncate" style={{ color: '#F5F5F5' }}>{slot.name}</p>
          </div>
          <button onClick={onRemove} className="shrink-0">
            <X size={14} color="#555" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-w-0 relative">
      <div
        className="p-3 rounded-xl cursor-pointer"
        style={{ background: '#1C1C1C', border: '1px dashed #2A2A2A' }}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <Plus size={14} color="#555" />
          <input
            type="text"
            placeholder="Add a card to compare..."
            value={search}
            onChange={e => { setSearch(e.target.value); setOpen(true) }}
            onClick={e => e.stopPropagation()}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: '#F5F5F5' }}
          />
        </div>
      </div>
      {open && results.length > 0 && (
        <div
          className="absolute top-12 left-0 right-0 rounded-xl overflow-hidden z-10"
          style={{ background: '#1C1C1C', border: '1px solid #2A2A2A', boxShadow: '0 8px 32px #00000088' }}
        >
          {results.slice(0, 6).map(card => (
            <button
              key={card.id}
              onClick={() => { onPick(card.id); setSearch(''); setOpen(false) }}
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
  )
}

export default function Compare() {
  const [searchParams] = useSearchParams()
  const initialCards = (searchParams.get('cards') || '').split(',').filter(Boolean).slice(0, 4)
  const [selectedIds, setSelectedIds] = useState(initialCards)

  const cards = selectedIds.map(id => allCards.find(c => c.id === id)).filter(Boolean)

  const addCard = id => setSelectedIds(prev => [...prev, id].slice(0, 4))
  const removeCard = id => setSelectedIds(prev => prev.filter(x => x !== id))

  const slots = [...cards, null, null].slice(0, Math.max(2, cards.length + 1)).slice(0, 4)

  const allTransferPartners = [...new Set(cards.flatMap(c => c.transferPartners || []))]

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1" style={{ color: '#F5F5F5' }}>Compare Cards</h1>
        <p className="text-sm" style={{ color: '#666' }}>Select up to 4 cards to compare side by side</p>
      </div>

      {/* Card pickers */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {slots.map((card, i) => (
          <CardPicker
            key={card?.id || `empty-${i}`}
            slot={card}
            selected={selectedIds}
            onPick={addCard}
            onRemove={() => removeCard(card?.id)}
          />
        ))}
      </div>

      {cards.length < 2 && (
        <div className="py-20 text-center">
          <p className="text-sm" style={{ color: '#555' }}>Add at least 2 cards to start comparing</p>
        </div>
      )}

      {cards.length >= 2 && (
        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid #2A2A2A' }}>
          <table className="w-full" style={{ background: '#161616' }}>
            <tbody>
              {/* Section: Basics */}
              <tr style={{ background: '#1C1C1C' }}>
                <td colSpan={cards.length + 1} className="px-4 py-2 text-xs font-semibold tracking-wider" style={{ color: '#C9A84C' }}>
                  BASICS
                </td>
              </tr>
              <Row label="Annual Fee" values={cards.map(c => c.annualFee)} highlight format={v => annualFeeLabel(v)} />
              <Row label="Rewards Program" values={cards.map(c => c.rewardsProgram)} />
              <Row label="Est. Annual Value" values={cards.map(c => c.estimatedAnnualValue)} highlight format={v => formatCurrency(v)} />
              <Row label="Credit Score" values={cards.map(c => c.creditScoreRequired?.replace(/_/g, ' '))} />

              {/* Section: Welcome Bonus */}
              <tr style={{ background: '#1C1C1C' }}>
                <td colSpan={cards.length + 1} className="px-4 py-2 text-xs font-semibold tracking-wider" style={{ color: '#C9A84C' }}>
                  WELCOME BONUS
                </td>
              </tr>
              <Row label="Bonus Points" values={cards.map(c => c.signupBonus?.points || 0)} highlight format={v => v ? formatPoints(v) + ' pts' : '—'} />
              <Row label="Min. Spend" values={cards.map(c => c.signupBonus?.minSpend || 0)} format={v => v ? formatCurrency(v) : '—'} />
              <Row label="Est. Value" values={cards.map(c => c.signupBonus?.estimatedValue || 0)} highlight format={v => v ? formatCurrency(v) : '—'} />

              {/* Section: Earning Rates */}
              <tr style={{ background: '#1C1C1C' }}>
                <td colSpan={cards.length + 1} className="px-4 py-2 text-xs font-semibold tracking-wider" style={{ color: '#C9A84C' }}>
                  EARNING RATES
                </td>
              </tr>
              {SPEND_CATEGORIES.map(cat => {
                const rates = cards.map(c => {
                  const match = c.earningRates.find(r => r.category === cat)
                  if (match) return match.multiplier
                  const fallback = c.earningRates.find(r => r.category === 'all' || r.category === 'other')
                  return fallback?.multiplier || 1
                })
                if (rates.every(r => r === 1)) return null
                return (
                  <Row
                    key={cat}
                    label={cat.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    values={rates}
                    highlight
                    format={v => `${v}x`}
                  />
                )
              })}

              {/* Section: Credits */}
              <tr style={{ background: '#1C1C1C' }}>
                <td colSpan={cards.length + 1} className="px-4 py-2 text-xs font-semibold tracking-wider" style={{ color: '#C9A84C' }}>
                  ANNUAL CREDITS
                </td>
              </tr>
              {(() => {
                const allCreditIds = [...new Set(cards.flatMap(c => (c.credits || []).map(cr => cr.id)))]
                if (allCreditIds.length === 0) return (
                  <tr><td colSpan={cards.length + 1} className="px-4 py-3 text-xs" style={{ color: '#555' }}>No annual credits</td></tr>
                )
                return allCreditIds.map(cid => {
                  const label = cards.flatMap(c => c.credits || []).find(cr => cr.id === cid)?.name || cid
                  const values = cards.map(c => {
                    const cr = (c.credits || []).find(x => x.id === cid)
                    return cr ? formatCurrency(cr.amount) + (cr.frequency === 'annual' ? '/yr' : '') : '—'
                  })
                  return <Row key={cid} label={label} values={values} />
                })
              })()}

              {/* Section: Perks */}
              <tr style={{ background: '#1C1C1C' }}>
                <td colSpan={cards.length + 1} className="px-4 py-2 text-xs font-semibold tracking-wider" style={{ color: '#C9A84C' }}>
                  PERKS & PROTECTIONS
                </td>
              </tr>
              <BoolRow label="Priority Pass" values={cards.map(c => c.loungeAccess?.priorityPass)} />
              <BoolRow label="Centurion Lounge" values={cards.map(c => c.loungeAccess?.centurion)} />
              <BoolRow label="Delta Club" values={cards.map(c => c.loungeAccess?.deltaClub)} />
              <BoolRow label="Trip Delay" values={cards.map(c => c.travelProtections?.tripDelay)} />
              <BoolRow label="Baggage Insurance" values={cards.map(c => c.travelProtections?.baggageInsurance)} />
              <BoolRow label="Rental Car" values={cards.map(c => c.travelProtections?.rentalCar)} />
              <BoolRow label="Purchase Protection" values={cards.map(c => c.travelProtections?.purchaseProtection)} />
              <BoolRow label="No FTF" values={cards.map(c => c.foreignTransactionFee === false)} />

              {/* Section: Transfer Partners */}
              <tr style={{ background: '#1C1C1C' }}>
                <td colSpan={cards.length + 1} className="px-4 py-2 text-xs font-semibold tracking-wider" style={{ color: '#C9A84C' }}>
                  TRANSFER PARTNERS
                </td>
              </tr>
              <Row label="# of Partners" values={cards.map(c => c.transferPartners?.length || 0)} highlight format={v => v || '—'} />
              {allTransferPartners.slice(0, 8).map(partner => (
                <BoolRow key={partner} label={partner} values={cards.map(c => c.transferPartners?.includes(partner))} />
              ))}
              {allTransferPartners.length > 8 && (
                <tr>
                  <td colSpan={cards.length + 1} className="px-4 py-2 text-xs" style={{ color: '#555' }}>
                    + {allTransferPartners.length - 8} more partners
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
