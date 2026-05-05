const CPP = {
  'Chase Ultimate Rewards': 1.5,
  'Amex Membership Rewards': 2.0,
  'Capital One Miles': 1.7,
  'Citi ThankYou Points': 1.6,
  'default': 1.0,
}

export function getCPP(program) {
  return CPP[program] || CPP.default
}

export function pointsToValue(points, program) {
  return (points * getCPP(program)) / 100
}

export function calcCardValue(card, walletEntry) {
  let value = 0
  if (walletEntry?.pointsBalance) {
    value += pointsToValue(walletEntry.pointsBalance, card.rewardsProgram)
  }
  card.credits?.forEach(credit => {
    const used = walletEntry?.usedCredits?.[credit.id]
    if (!used) value += credit.amount
  })
  return value
}

export function getEarningRate(card, category) {
  const rates = card.earningRates || []
  const match = rates.find(r => r.category === category)
  if (match) return match.multiplier
  const other = rates.find(r => r.category === 'all' || r.category === 'other')
  return other ? other.multiplier : 1
}

export function rankCardsForCategory(cards, category) {
  return [...cards]
    .map(card => ({
      card,
      multiplier: getEarningRate(card, category),
      cpp: getCPP(card.rewardsProgram),
    }))
    .sort((a, b) => (b.multiplier * b.cpp) - (a.multiplier * a.cpp))
}
