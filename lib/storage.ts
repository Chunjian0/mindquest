export const storage = {
  getLastVisit(): number | null {
    if (typeof window === 'undefined') return null
    const v = localStorage.getItem('mochi_last_visit')
    return v ? parseInt(v) : null
  },

  setLastVisit() {
    if (typeof window === 'undefined') return
    localStorage.setItem('mochi_last_visit', Date.now().toString())
  },

  getGameState() {
    if (typeof window === 'undefined') return null
    const s = localStorage.getItem('mochi_state')
    return s ? JSON.parse(s) : null
  },

  saveGameState(state: object) {
    if (typeof window === 'undefined') return
    localStorage.setItem('mochi_state', JSON.stringify(state))
  },
}