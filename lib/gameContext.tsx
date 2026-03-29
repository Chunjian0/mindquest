'use client'

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import { storage } from '@/lib/storage'

interface ActiveQuest {
  zoneId:    string
  zoneName:  string
  startTime: number
  duration:  number
  coins:     number
}

interface ShopPurchase {
  itemId: string
  count:  number
}

interface GameState {
  coins:         number
  trust:         number
  energy:        number
  exp:           number
  expMax:        number
  level:         number
  activePet:     string
  hasOnboarded:  boolean
  activeQuest:   ActiveQuest | null
  shopPurchases: ShopPurchase[]
  lastResetDate: string
  lastEnergyRegen: number   // 上次能量回复的时间戳
}

interface GameContextType {
  state:                GameState
  addCoins:             (n: number) => void
  spendCoins:           (n: number) => boolean
  addTrust:             (n: number) => void
  addEnergy:            (n: number) => void
  spendEnergy:          (n: number) => void
  addExp:               (n: number) => void
  setActivePet:         (id: string) => void
  completeOnboarding:   () => void
  startQuest:           (q: Omit<ActiveQuest, 'startTime'>) => void
  completeQuest:        () => void
  getQuestTimeLeft:     () => number
  buyShopItem:          (itemId: string, maxPerDay: number) => boolean
  getItemPurchaseCount: (itemId: string) => number
  dataLost:             boolean          // 数据丢失标志
  dismissDataLost:      () => void
}

const GameContext = createContext<GameContextType | null>(null)

const DEFAULT_STATE: GameState = {
  coins:           45,
  trust:           0,
  energy:          60,
  exp:             0,
  expMax:          500,
  level:           1,
  activePet:       'mochi',
  hasOnboarded:    false,
  activeQuest:     null,
  shopPurchases:   [],
  lastResetDate:   '',
  lastEnergyRegen: Date.now(),
}

// 能量回复配置
const ENERGY_REGEN_AMOUNT   = 5     // 每次回复 5 点
const ENERGY_REGEN_INTERVAL = 30 * 60 * 1000  // 每 30 分钟回复一次
const ENERGY_MAX            = 100

function getResetDateKey(): string {
  const now      = new Date()
  const today7AM = new Date(now)
  today7AM.setHours(7, 0, 0, 0)
  const date = now >= today7AM
    ? now
    : new Date(now.getTime() - 24 * 60 * 60 * 1000)
  return date.toISOString().split('T')[0]
}

function msUntilNext7AM(): number {
  const now     = new Date()
  const next7AM = new Date(now)
  next7AM.setHours(7, 0, 0, 0)
  if (now >= next7AM) next7AM.setDate(next7AM.getDate() + 1)
  return next7AM.getTime() - now.getTime()
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state,      setState]      = useState<GameState>(DEFAULT_STATE)
  const [dataLost,   setDataLost]   = useState(false)
  const [hydrated,   setHydrated]   = useState(false)
  const regenTimerRef = useRef<NodeJS.Timeout | null>(null)

  // ── 读取存档 ─────────────────────────────
  useEffect(() => {
    const saved = storage.getGameState()

    if (saved && Object.keys(saved).length > 0) {
      // 存档存在，正常加载
      const merged = { ...DEFAULT_STATE, ...saved }

      // ── 离线能量补偿 ──────────────────────
      // 计算离线期间应该回复了多少能量
      if (merged.lastEnergyRegen) {
        const offlineMs      = Date.now() - merged.lastEnergyRegen
        const regenCycles    = Math.floor(offlineMs / ENERGY_REGEN_INTERVAL)
        const offlineRegen   = regenCycles * ENERGY_REGEN_AMOUNT
        if (offlineRegen > 0 && merged.energy < ENERGY_MAX) {
          merged.energy = Math.min(ENERGY_MAX, merged.energy + offlineRegen)
          merged.lastEnergyRegen = Date.now()
          console.log(`⚡ Offline energy regen: +${offlineRegen}`)
        }
      }

      setState(merged)
    } else if (saved === null) {
      // localStorage 被清空了，之前有数据
      const hadData = sessionStorage.getItem('mochi_had_data')
      if (hadData === 'true') {
        setDataLost(true)
      }
    }

    setHydrated(true)
    // 标记曾经有数据
    sessionStorage.setItem('mochi_had_data', 'true')
  }, [])

  // ── 保存存档 ─────────────────────────────
  useEffect(() => {
    if (!hydrated) return
    storage.saveGameState(state)
  }, [state, hydrated])

  // ── 7AM 每日重置 ─────────────────────────
  useEffect(() => {
    function checkReset() {
      const key = getResetDateKey()
      setState(s => {
        if (s.lastResetDate === key) return s
        return { ...s, shopPurchases: [], lastResetDate: key }
      })
    }
    checkReset()
    const msUntil       = msUntilNext7AM()
    const preciseTimer  = setTimeout(() => {
      checkReset()
      const dailyInterval = setInterval(checkReset, 24 * 60 * 60 * 1000)
      return () => clearInterval(dailyInterval)
    }, msUntil)
    const fallback = setInterval(checkReset, 60 * 1000)
    return () => { clearTimeout(preciseTimer); clearInterval(fallback) }
  }, [])

  // ── 能量自动回复 ─────────────────────────
  useEffect(() => {
    if (!hydrated) return

    function scheduleRegen() {
      if (regenTimerRef.current) clearTimeout(regenTimerRef.current)

      setState(s => {
        // 如果满能量就不计时
        if (s.energy >= ENERGY_MAX) return s

        // 计算距离下次回复还有多久
        const elapsed     = Date.now() - s.lastEnergyRegen
        const remaining   = Math.max(0, ENERGY_REGEN_INTERVAL - elapsed)

        regenTimerRef.current = setTimeout(() => {
          setState(prev => {
            if (prev.energy >= ENERGY_MAX) return prev
            const newEnergy = Math.min(ENERGY_MAX, prev.energy + ENERGY_REGEN_AMOUNT)
            console.log(`⚡ Energy regen: ${prev.energy} → ${newEnergy}`)
            return { ...prev, energy: newEnergy, lastEnergyRegen: Date.now() }
          })
          // 回复后继续调度
          scheduleRegen()
        }, remaining)

        return s
      })
    }

    scheduleRegen()

    return () => {
      if (regenTimerRef.current) clearTimeout(regenTimerRef.current)
    }
  }, [hydrated, state.energy])

  // ── 任务自动完成 ─────────────────────────
  useEffect(() => {
    if (!state.activeQuest) return
    const left = getQuestTimeLeftFromState(state.activeQuest)
    if (left <= 0) {
      setState(s => {
        if (!s.activeQuest) return s
        return { ...s, coins: s.coins + s.activeQuest.coins, activeQuest: null }
      })
      return
    }
    const timer = setTimeout(() => {
      setState(s => {
        if (!s.activeQuest) return s
        return { ...s, coins: s.coins + s.activeQuest.coins, activeQuest: null }
      })
    }, left)
    return () => clearTimeout(timer)
  }, [state.activeQuest?.zoneId])

  function getQuestTimeLeftFromState(quest: ActiveQuest): number {
    return Math.max(0, quest.startTime + quest.duration - Date.now())
  }

  function addCoins(n: number)  { setState(s => ({ ...s, coins:  s.coins  + n })) }

  function spendCoins(n: number): boolean {
    if (state.coins < n) return false
    setState(s => ({ ...s, coins: s.coins - n }))
    return true
  }

  function addTrust(n: number) {
    setState(s => ({ ...s, trust: Math.min(s.trust + n, 100) }))
  }

  function addEnergy(n: number) {
    setState(s => ({ ...s, energy: Math.min(s.energy + n, ENERGY_MAX) }))
  }

  function spendEnergy(n: number) {
    setState(s => ({ ...s, energy: Math.max(s.energy - n, 0) }))
  }

  function addExp(n: number) {
    setState(s => {
      const newExp = s.exp + n
      if (newExp >= s.expMax) {
        return { ...s, exp: newExp - s.expMax, level: s.level + 1, expMax: Math.floor(s.expMax * 1.3) }
      }
      return { ...s, exp: newExp }
    })
  }

  function setActivePet(id: string)    { setState(s => ({ ...s, activePet: id })) }
  function completeOnboarding()        { setState(s => ({ ...s, hasOnboarded: true })) }

  function startQuest(q: Omit<ActiveQuest, 'startTime'>) {
    setState(s => ({ ...s, activeQuest: { ...q, startTime: Date.now() } }))
  }

  function completeQuest() {
    setState(s => ({ ...s, activeQuest: null }))
  }

  function getQuestTimeLeft(): number {
    if (!state.activeQuest) return 0
    return getQuestTimeLeftFromState(state.activeQuest)
  }

  function buyShopItem(itemId: string, maxPerDay: number): boolean {
    const count = state.shopPurchases.find(p => p.itemId === itemId)?.count || 0
    if (count >= maxPerDay) return false
    setState(s => {
      const list = [...s.shopPurchases]
      const idx  = list.findIndex(p => p.itemId === itemId)
      if (idx >= 0) list[idx] = { ...list[idx], count: list[idx].count + 1 }
      else list.push({ itemId, count: 1 })
      return { ...s, shopPurchases: list }
    })
    return true
  }

  function getItemPurchaseCount(itemId: string): number {
    return state.shopPurchases.find(p => p.itemId === itemId)?.count || 0
  }

  function dismissDataLost() { setDataLost(false) }

  if (!hydrated) return null

  return (
    <GameContext.Provider value={{
      state, addCoins, spendCoins, addTrust, addEnergy,
      spendEnergy, addExp, setActivePet, completeOnboarding,
      startQuest, completeQuest, getQuestTimeLeft,
      buyShopItem, getItemPurchaseCount,
      dataLost, dismissDataLost,
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}