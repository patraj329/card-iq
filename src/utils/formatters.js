export function formatCurrency(amount, decimals = 0) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)
}

export function formatPoints(points) {
  return new Intl.NumberFormat('en-US').format(points)
}

export function formatMultiplier(x) {
  return `${x}x`
}

export function annualFeeLabel(fee) {
  return fee === 0 ? 'No Annual Fee' : formatCurrency(fee) + '/yr'
}
