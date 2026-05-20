import { useState, useMemo } from 'react'
import { Search, TrendingUp, ArrowRight, Star, Plane, Hotel, Zap } from 'lucide-react'
import useWallet from '../hooks/useWallet'
import allCards from '../data/cards.json'
import { SWEET_SPOTS, TRANSFER_RATIOS } from '../data/sweetSpots.js'
import { formatPoints, formatCurrency } from '../utils/formatters'
import { getCPP } from '../utils/valueCalc'

const DIFFICULTY_COLOR = {
  Easy: { bg: '#1A3A2A', color: '#4DB87A' },
  Medium: { bg: '#2A2A1A', color: '#C9A84C' },
  Hard: { bg: '#2A1A1A', color: '#C97070' },
}

// Aggregate points by rewards program across wallet cards
function useWalletPoints() {
  const { cardIds, entries } = useWallet()
  return useMemo(() => {
    const programMap = {}
    cardIds.forEach(id => {
      const card = allCards.find(c => c.id === id)
      if (!card) return
      const entry = entries[id] || {}
      const pts = entry.pointsBalance || 0
      const prog = card.rewardsProgram
      if (!programMap[prog]) {
        programMap[prog] = { program: prog, points: 0, cards: [], cpp: getCPP(prog) }
      }
      programMap[prog].points += pts
      programMap[prog].cards.push(card.name)
    })
    return Object.values(programMap).sort((a, b) => b.points - a.points)
  }, [cardIds, entries])
}

function PointsSummary({ programs }) {
  const total = programs.reduce((s, p) => s + p.points * p.cpp / 100, 0)

  return (
    <div className="rounded-xl p-5 mb-6" style={{ background: 'linear-gradient(135deg, #1A1508, #161616)', border: '1px solid #2A2010' }}>
      <p className="text-xs font-semibold mb-1" style={{ color: '#C9A84C' }}>YOUR POINTS VALUE</p>
      <p className="text-3xl font-bold mb-1" style={{ color: '#C9A84C' }}>{formatCurrency(total)}</p>
      <p className="text-xs mb-4" style={{ color: '#555' }}>estimated value across {programs.length} rewards program{programs.length !== 1 ? 's' : ''}</p>

      <div className="space-y-2">
        {programs.map(p => (
          <div key={p.program} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: '#1A1A1A' }}>
            <div>
              <p className="text-sm font-medium" style={{ color: '#F5F5F5' }}>{p.program}</p>
              <p className="text-xs" style={{ color: '#555' }}>{p.cards.join(', ')}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold" style={{ color: '#F5F5F5' }}>{formatPoints(p.points)} pts</p>
              <p className="text-xs" style={{ color: '#C9A84C' }}>≈ {formatCurrency(p.points * p.cpp / 100)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SweetSpotCard({ spot }) {
  const diff = DIFFICULTY_COLOR[spot.difficulty] || DIFFICULTY_COLOR.Medium
  return (
    <div className="rounded-xl p-4" style={{ background: '#1C1C1C', border: '1px solid #2A2A2A' }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: '#F5F5F5' }}>{spot.partner}</p>
          <p className="text-xs mt-0.5" style={{ color: '#777' }}>{spot.description}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-base font-bold" style={{ color: '#C9A84C' }}>{spot.cpp}¢</p>
          <p className="text-xs" style={{ color: '#555' }}>per point</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: diff.bg, color: diff.color }}>
          {spot.difficulty}
        </span>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: '#666' }}>
        💡 {spot.tip}
      </p>
    </div>
  )
}

function TransferPartnerRow({ partner }) {
  const typeIcon = partner.type === 'airline' ? <Plane size={11} /> : <Hotel size={11} />
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: '#1A1A1A' }}>
      <div className="flex items-center gap-2">
        <span style={{ color: partner.type === 'airline' ? '#4D7DB8' : '#4DB87A' }}>{typeIcon}</span>
        <span className="text-sm" style={{ color: '#F5F5F5' }}>{partner.partner}</span>
        {partner.note && <span className="text-xs" style={{ color: '#555' }}>({partner.note})</span>}
      </div>
      <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: '#C9A84C22', color: '#C9A84C' }}>
        {partner.ratio}
      </span>
    </div>
  )
}

export default function Redeem() {
  const programs = useWalletPoints()
  const [activeProgram, setActiveProgram] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('sweetspots') // 'sweetspots' | 'partners' | 'calculator' | 'search'

  const selectedProgram = activeProgram || programs[0]?.program

  const sweetSpots = selectedProgram ? (SWEET_SPOTS[selectedProgram] || []) : []
  const transferPartners = selectedProgram ? (TRANSFER_RATIOS[selectedProgram] || []) : []
  const selectedProgramData = programs.find(p => p.program === selectedProgram)

  // Calculator
  const [calcProgram, setCalcProgram] = useState('')
  const [calcPoints, setCalcPoints] = useState('')
  const calcResults = useMemo(() => {
    const prog = calcProgram || selectedProgram
    const pts = Number(calcPoints) || (selectedProgramData?.points || 0)
    if (!pts || !prog) return []
    const spots = SWEET_SPOTS[prog] || []
    return spots.map(s => ({ ...s, value: (pts * s.cpp / 100) })).sort((a, b) => b.value - a.value)
  }, [calcProgram, calcPoints, selectedProgram, selectedProgramData])

  // Search across all partners
  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return []
    const q = searchQuery.toLowerCase()
    const results = []
    programs.forEach(p => {
      const partners = TRANSFER_RATIOS[p.program] || []
      partners.forEach(partner => {
        if (partner.partner.toLowerCase().includes(q)) {
          results.push({ ...partner, fromProgram: p.program, yourPoints: p.points })
        }
      })
      const spots = SWEET_SPOTS[p.program] || []
      spots.forEach(spot => {
        if (spot.partner.toLowerCase().includes(q) || spot.description.toLowerCase().includes(q)) {
          results.push({ ...spot, fromProgram: p.program, isSpot: true, yourPoints: p.points })
        }
      })
    })
    return results
  }, [searchQuery, programs])

  if (programs.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-64 text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#1C1C1C' }}>
          <TrendingUp size={24} color="#C9A84C" />
        </div>
        <h2 className="text-lg font-semibold mb-2" style={{ color: '#F5F5F5' }}>No points to redeem</h2>
        <p className="text-sm max-w-xs" style={{ color: '#666' }}>
          Add cards to your wallet and enter your points balance to get personalized redemption advice.
        </p>
      </div>
    )
  }

  const TABS = [
    { id: 'sweetspots', label: 'Sweet Spots', icon: Star },
    { id: 'partners', label: 'Transfer Partners', icon: ArrowRight },
    { id: 'calculator', label: 'Calculator', icon: Zap },
    { id: 'search', label: 'Search', icon: Search },
  ]

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: '#F5F5F5' }}>Redeem Points</h1>
        <p className="text-sm" style={{ color: '#666' }}>Get the best value from your rewards</p>
      </div>

      <PointsSummary programs={programs} />

      {/* Program Selector */}
      <div className="mb-4">
        <p className="text-xs font-semibold mb-2" style={{ color: '#555' }}>SELECT PROGRAM</p>
        <div className="flex flex-wrap gap-2">
          {programs.map(p => (
            <button
              key={p.program}
              onClick={() => setActiveProgram(p.program)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium"
              style={
                selectedProgram === p.program
                  ? { background: '#C9A84C', color: '#0D0D0D' }
                  : { background: '#1C1C1C', color: '#777', border: '1px solid #2A2A2A' }
              }
            >
              {p.program}
              {p.points > 0 && <span className="ml-1 opacity-70">{formatPoints(p.points)}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-1 rounded-xl" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors"
            style={
              activeTab === id
                ? { background: '#C9A84C', color: '#0D0D0D' }
                : { color: '#666' }
            }
          >
            <Icon size={11} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Sweet Spots Tab */}
      {activeTab === 'sweetspots' && (
        <div>
          {sweetSpots.length > 0 ? (
            <>
              <p className="text-xs font-semibold mb-3" style={{ color: '#C9A84C' }}>
                TOP REDEMPTIONS — {selectedProgram?.toUpperCase()}
              </p>
              <div className="space-y-3">
                {sweetSpots.map((spot, i) => <SweetSpotCard key={i} spot={spot} />)}
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-sm" style={{ color: '#555' }}>No sweet spots data for this program yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Transfer Partners Tab */}
      {activeTab === 'partners' && (
        <div>
          {transferPartners.length > 0 ? (
            <>
              <div className="mb-4">
                <p className="text-xs font-semibold mb-2" style={{ color: '#C9A84C' }}>
                  AIRLINES
                </p>
                <div className="space-y-1">
                  {transferPartners.filter(p => p.type === 'airline').map((p, i) => (
                    <TransferPartnerRow key={i} partner={p} />
                  ))}
                </div>
              </div>
              {transferPartners.some(p => p.type === 'hotel') && (
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#C9A84C' }}>
                    HOTELS
                  </p>
                  <div className="space-y-1">
                    {transferPartners.filter(p => p.type === 'hotel').map((p, i) => (
                      <TransferPartnerRow key={i} partner={p} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-sm" style={{ color: '#555' }}>This program doesn't have transfer partners.</p>
            </div>
          )}
        </div>
      )}

      {/* Calculator Tab */}
      {activeTab === 'calculator' && (
        <div>
          <div className="rounded-xl p-4 mb-4" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
            <p className="text-xs font-semibold mb-3" style={{ color: '#C9A84C' }}>POINTS VALUE CALCULATOR</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#666' }}>Program</label>
                <select
                  value={calcProgram || selectedProgram}
                  onChange={e => setCalcProgram(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ background: '#1C1C1C', color: '#F5F5F5', border: '1px solid #2A2A2A' }}
                >
                  {programs.map(p => (
                    <option key={p.program} value={p.program}>{p.program}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#666' }}>Points to redeem</label>
                <input
                  type="number"
                  value={calcPoints}
                  onChange={e => setCalcPoints(e.target.value)}
                  placeholder={formatPoints(selectedProgramData?.points || 0)}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ background: '#1C1C1C', color: '#F5F5F5', border: '1px solid #2A2A2A' }}
                />
              </div>
            </div>
          </div>

          {calcResults.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold mb-2" style={{ color: '#C9A84C' }}>ESTIMATED VALUE BY REDEMPTION</p>
              {calcResults.map((r, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: '#1C1C1C', border: '1px solid #2A2A2A' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#F5F5F5' }}>{r.partner}</p>
                    <p className="text-xs" style={{ color: '#666' }}>{r.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold" style={{ color: '#C9A84C' }}>{formatCurrency(r.value)}</p>
                    <p className="text-xs" style={{ color: '#555' }}>{r.cpp}¢/pt</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div>
          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-3" color="#555" />
            <input
              type="text"
              placeholder="Search airline, hotel, or destination..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm"
              style={{ background: '#1C1C1C', color: '#F5F5F5', border: '1px solid #2A2A2A' }}
              autoFocus
            />
          </div>

          {searchQuery.length >= 2 && (
            searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((r, i) => (
                  <div key={i} className="rounded-xl p-4" style={{ background: '#1C1C1C', border: '1px solid #2A2A2A' }}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#F5F5F5' }}>
                          {r.isSpot ? r.partner : r.partner}
                        </p>
                        {r.isSpot && <p className="text-xs" style={{ color: '#777' }}>{r.description}</p>}
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded shrink-0" style={{ background: '#C9A84C22', color: '#C9A84C' }}>
                        {r.isSpot ? `${r.cpp}¢/pt` : r.ratio}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: '#555' }}>
                      via <span style={{ color: '#C9A84C' }}>{r.fromProgram}</span>
                      {r.yourPoints > 0 && <span> · You have {formatPoints(r.yourPoints)} pts</span>}
                    </p>
                    {r.isSpot && r.tip && (
                      <p className="text-xs mt-2 leading-relaxed" style={{ color: '#666' }}>💡 {r.tip}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-sm" style={{ color: '#555' }}>No results for "{searchQuery}"</p>
              </div>
            )
          )}

          {searchQuery.length < 2 && (
            <div className="text-center py-10">
              <p className="text-sm" style={{ color: '#444' }}>Type an airline or hotel to find which of your programs can get you there</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
