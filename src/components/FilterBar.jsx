import { X } from 'lucide-react'

const FEE_RANGES = [
  { label: 'No Fee', min: 0, max: 0 },
  { label: 'Under $100', min: 1, max: 99 },
  { label: '$100–$300', min: 100, max: 300 },
  { label: '$300–$600', min: 301, max: 600 },
  { label: '$600+', min: 601, max: Infinity },
]

function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap"
      style={
        active
          ? { background: '#C9A84C', color: '#0D0D0D' }
          : { background: '#1C1C1C', color: '#999', border: '1px solid #2A2A2A' }
      }
    >
      {label}
    </button>
  )
}

export default function FilterBar({ filters, onChange }) {
  const toggle = (key, value) => {
    const current = filters[key] || []
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    onChange({ ...filters, [key]: next })
  }

  const isActive = (key, value) => (filters[key] || []).includes(value)

  const activeCount = Object.values(filters).reduce((n, v) => n + (Array.isArray(v) ? v.length : 0), 0)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: '#F5F5F5' }}>Filters</h3>
        {activeCount > 0 && (
          <button
            onClick={() => onChange({})}
            className="flex items-center gap-1 text-xs"
            style={{ color: '#C9A84C' }}
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      <div>
        <p className="text-xs font-medium mb-2" style={{ color: '#666' }}>CARD TYPE</p>
        <div className="flex flex-wrap gap-2">
          {['personal', 'business'].map(v => (
            <Chip key={v} label={v === 'personal' ? 'Personal' : 'Business'} active={isActive('type', v)} onClick={() => toggle('type', v)} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium mb-2" style={{ color: '#666' }}>ANNUAL FEE</p>
        <div className="flex flex-wrap gap-2">
          {FEE_RANGES.map(r => (
            <Chip key={r.label} label={r.label} active={isActive('feeRange', r.label)} onClick={() => toggle('feeRange', r.label)} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium mb-2" style={{ color: '#666' }}>REWARDS PROGRAM</p>
        <div className="flex flex-wrap gap-2">
          {['Chase Ultimate Rewards', 'Amex Membership Rewards', 'Capital One Miles', 'Cash Back'].map(v => (
            <Chip key={v} label={v} active={isActive('program', v)} onClick={() => toggle('program', v)} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium mb-2" style={{ color: '#666' }}>BEST FOR</p>
        <div className="flex flex-wrap gap-2">
          {['travel', 'dining', 'cash_back', 'business', 'luxury'].map(v => (
            <Chip key={v} label={v.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} active={isActive('category', v)} onClick={() => toggle('category', v)} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium mb-2" style={{ color: '#666' }}>LOUNGE ACCESS</p>
        <div className="flex flex-wrap gap-2">
          <Chip label="Has Lounge Access" active={isActive('lounge', 'yes')} onClick={() => toggle('lounge', 'yes')} />
        </div>
      </div>

      <div>
        <p className="text-xs font-medium mb-2" style={{ color: '#666' }}>FOREIGN TRANSACTION FEE</p>
        <div className="flex flex-wrap gap-2">
          <Chip label="No FTF" active={isActive('ftf', 'none')} onClick={() => toggle('ftf', 'none')} />
        </div>
      </div>
    </div>
  )
}

export { FEE_RANGES }
