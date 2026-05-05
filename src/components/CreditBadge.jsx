import { Check, Circle } from 'lucide-react'
import { formatCurrency } from '../utils/formatters'

export default function CreditBadge({ credit, used, onToggle }) {
  return (
    <button
      onClick={() => onToggle(!used)}
      className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left transition-colors"
      style={{
        background: used ? '#1A2A1A' : '#1C1C1C',
        border: `1px solid ${used ? '#2A4A2A' : '#2A2A2A'}`,
      }}
    >
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
        style={{ background: used ? '#2A6A2A' : '#2A2A2A' }}
      >
        {used ? <Check size={11} color="#4DB87A" /> : <Circle size={11} color="#555" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight" style={{ color: used ? '#999' : '#F5F5F5', textDecoration: used ? 'line-through' : 'none' }}>
          {credit.name}
        </p>
        {credit.merchant && (
          <p className="text-xs mt-0.5" style={{ color: '#555' }}>{credit.merchant}</p>
        )}
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold" style={{ color: used ? '#555' : '#C9A84C' }}>
          {formatCurrency(credit.amount)}
        </p>
        <p className="text-xs" style={{ color: '#555' }}>
          {credit.frequency === 'annual' ? '/yr' : credit.frequency === '4_years' ? '/4yr' : ''}
        </p>
      </div>
    </button>
  )
}
