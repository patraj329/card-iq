import { create } from 'zustand'
import allCards from '../data/cards.json'

// Debounce helper — waits ms after last call before firing
function debounce(fn, ms) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

async function fetchWallet() {
  const res = await fetch('/api/wallet')
  if (!res.ok) throw new Error('Failed to fetch wallet')
  return res.json()
}

const persistWallet = debounce(async (state) => {
  try {
    await fetch('/api/wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardIds: state.cardIds, entries: state.entries }),
    })
  } catch (err) {
    console.error('Failed to save wallet:', err)
  }
}, 600)

const useWallet = create((set, get) => ({
  cardIds: [],
  entries: {},
  loaded: false,

  // Called once on app mount to hydrate from server
  async init() {
    if (get().loaded) return
    try {
      const data = await fetchWallet()
      set({ cardIds: data.cardIds || [], entries: data.entries || {}, loaded: true })
    } catch (err) {
      console.error('Failed to load wallet:', err)
      set({ loaded: true })
    }
  },

  walletCards() {
    return get().cardIds
      .map(id => allCards.find(c => c.id === id))
      .filter(Boolean)
  },

  hasCard(id) {
    return get().cardIds.includes(id)
  },

  addCard(id) {
    if (get().cardIds.includes(id)) return
    set(s => {
      const next = {
        cardIds: [...s.cardIds, id],
        entries: {
          ...s.entries,
          [id]: s.entries[id] || { pointsBalance: 0, usedCredits: {} },
        },
      }
      persistWallet(next)
      return next
    })
  },

  removeCard(id) {
    set(s => {
      const entries = { ...s.entries }
      delete entries[id]
      const next = { cardIds: s.cardIds.filter(c => c !== id), entries }
      persistWallet(next)
      return next
    })
  },

  setPoints(cardId, points) {
    set(s => {
      const next = {
        ...s,
        entries: {
          ...s.entries,
          [cardId]: { ...s.entries[cardId], pointsBalance: Number(points) },
        },
      }
      persistWallet(next)
      return next
    })
  },

  toggleCredit(cardId, creditId, used) {
    set(s => {
      const entry = s.entries[cardId] || { pointsBalance: 0, usedCredits: {} }
      const next = {
        ...s,
        entries: {
          ...s.entries,
          [cardId]: {
            ...entry,
            usedCredits: { ...entry.usedCredits, [creditId]: used },
          },
        },
      }
      persistWallet(next)
      return next
    })
  },

  getEntry(cardId) {
    return get().entries[cardId] || { pointsBalance: 0, usedCredits: {} }
  },
}))

export default useWallet
