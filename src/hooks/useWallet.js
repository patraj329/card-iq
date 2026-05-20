import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import allCards from '../data/cards.json'

function debounce(fn, ms) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

const useWallet = create((set, get) => {
  const saveToSupabase = debounce(async (userId, cardIds, entries) => {
    await supabase
      .from('wallets')
      .upsert({ user_id: userId, card_ids: cardIds, entries }, { onConflict: 'user_id' })
  }, 600)

  return {
    cardIds: [],
    entries: {},
    loaded: false,

    async init(userId) {
      if (!userId) return
      set({ cardIds: [], entries: {}, loaded: false })

      const { data } = await supabase
        .from('wallets')
        .select('card_ids, entries')
        .eq('user_id', userId)
        .single()

      set({
        cardIds: data?.card_ids || [],
        entries: data?.entries || {},
        loaded: true,
      })
    },

    reset() {
      set({ cardIds: [], entries: {}, loaded: false })
    },

    walletCards() {
      return get().cardIds
        .map(id => allCards.find(c => c.id === id))
        .filter(Boolean)
    },

    hasCard(id) {
      return get().cardIds.includes(id)
    },

    addCard(id, userId) {
      if (get().cardIds.includes(id)) return
      set(s => {
        const cardIds = [...s.cardIds, id]
        const entries = {
          ...s.entries,
          [id]: s.entries[id] || { pointsBalance: 0, usedCredits: {} },
        }
        saveToSupabase(userId, cardIds, entries)
        return { cardIds, entries }
      })
    },

    removeCard(id, userId) {
      set(s => {
        const entries = { ...s.entries }
        delete entries[id]
        const cardIds = s.cardIds.filter(c => c !== id)
        saveToSupabase(userId, cardIds, entries)
        return { cardIds, entries }
      })
    },

    setPoints(cardId, points, userId) {
      set(s => {
        const entries = {
          ...s.entries,
          [cardId]: { ...s.entries[cardId], pointsBalance: Number(points) },
        }
        saveToSupabase(userId, s.cardIds, entries)
        return { entries }
      })
    },

    toggleCredit(cardId, creditId, used, userId) {
      set(s => {
        const entry = s.entries[cardId] || { pointsBalance: 0, usedCredits: {} }
        const entries = {
          ...s.entries,
          [cardId]: {
            ...entry,
            usedCredits: { ...entry.usedCredits, [creditId]: used },
          },
        }
        saveToSupabase(userId, s.cardIds, entries)
        return { entries }
      })
    },

    getEntry(cardId) {
      return get().entries[cardId] || { pointsBalance: 0, usedCredits: {} }
    },
  }
})

export default useWallet
