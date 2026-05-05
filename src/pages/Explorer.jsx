import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import CardTile from '../components/CardTile'
import FilterBar, { FEE_RANGES } from '../components/FilterBar'
import allCards from '../data/cards.json'

function applyFilters(cards, filters, search) {
  return cards.filter(card => {
    if (search) {
      const q = search.toLowerCase()
      if (!card.name.toLowerCase().includes(q) && !card.issuer.toLowerCase().includes(q) && !card.rewardsProgram.toLowerCase().includes(q)) return false
    }
    if (filters.type?.length) {
      if (!filters.type.includes(card.type)) return false
    }
    if (filters.feeRange?.length) {
      const matchesFee = filters.feeRange.some(label => {
        const range = FEE_RANGES.find(r => r.label === label)
        return range && card.annualFee >= range.min && card.annualFee <= range.max
      })
      if (!matchesFee) return false
    }
    if (filters.program?.length) {
      if (!filters.program.includes(card.rewardsProgram)) return false
    }
    if (filters.category?.length) {
      if (!filters.category.some(cat => card.category?.includes(cat))) return false
    }
    if (filters.lounge?.includes('yes')) {
      const l = card.loungeAccess
      if (!l || !Object.values(l).some(Boolean)) return false
    }
    if (filters.ftf?.includes('none')) {
      if (card.foreignTransactionFee !== false) return false
    }
    return true
  })
}

export default function Explorer() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({})
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => applyFilters(allCards, filters, search), [filters, search])
  const activeFilterCount = Object.values(filters).reduce((n, v) => n + (Array.isArray(v) ? v.length : 0), 0)

  return (
    <div className="flex h-full">
      {/* Filter sidebar — desktop */}
      <aside
        className="hidden lg:block w-64 shrink-0 p-5 overflow-y-auto"
        style={{ borderRight: '1px solid #1E1E1E' }}
      >
        <FilterBar filters={filters} onChange={setFilters} />
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-3" color="#555" />
              <input
                type="text"
                placeholder="Search cards by name, issuer, or program..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm"
                style={{ background: '#1C1C1C', color: '#F5F5F5', border: '1px solid #2A2A2A' }}
              />
              {search && (
                <button className="absolute right-3 top-3" onClick={() => setSearch('')}>
                  <X size={14} color="#555" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
              style={{ background: activeFilterCount > 0 ? '#C9A84C22' : '#1C1C1C', color: activeFilterCount > 0 ? '#C9A84C' : '#999', border: `1px solid ${activeFilterCount > 0 ? '#C9A84C44' : '#2A2A2A'}` }}
            >
              <SlidersHorizontal size={14} />
              {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
            </button>
          </div>

          {/* Mobile filter drawer */}
          {showFilters && (
            <div className="lg:hidden mb-6 p-4 rounded-xl" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
              <FilterBar filters={filters} onChange={setFilters} />
            </div>
          )}

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm" style={{ color: '#666' }}>
              {filtered.length} card{filtered.length !== 1 ? 's' : ''}
              {activeFilterCount > 0 && <span style={{ color: '#C9A84C' }}> (filtered)</span>}
            </p>
            {activeFilterCount > 0 && (
              <button onClick={() => setFilters({})} className="text-xs" style={{ color: '#C9A84C' }}>
                Clear filters
              </button>
            )}
          </div>

          {/* Card grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(card => (
                <CardTile key={card.id} card={card} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg font-medium mb-2" style={{ color: '#555' }}>No cards match your filters</p>
              <button onClick={() => { setFilters({}); setSearch('') }} className="text-sm" style={{ color: '#C9A84C' }}>
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
