import { create } from 'zustand'
import allCards from '../data/cards.json'

const STORAGE_KEY = 'cardiq_wallet'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { cardIds: [], entries: {} }
  } catch {
    return { cardIds: [], entries: {} }
  }
}

function saveToStorage(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    cardIds: state.cardIds,
    entries: state.entries,
  }))
}

const useWallet = create((set, get) => {
  const stored = loadFromStorage()
  return {
    cardIds: stored.cardIds,
    entries: stored.entries,

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
        saveToStorage(next)
        return next
      })
    },

    removeCard(id) {
      set(s => {
        const entries = { ...s.entries }
        delete entries[id]
        const next = { cardIds: s.cardIds.filter(c => c !== id), entries }
        saveToStorage(next)
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
        saveToStorage(next)
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
        saveToStorage(next)
        return next
      })
    },

    getEntry(cardId) {
      return get().entries[cardId] || { pointsBalance: 0, usedCredits: {} }
    },
  }
})

export default useWallet
