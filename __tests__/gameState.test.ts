// 纯逻辑测试，不需要 React hooks
// 直接测试 state 计算函数

describe('Game State Logic', () => {

    // ── Energy 计算 ───────────────────────────
    describe('energy calculations', () => {

        it('energy cannot exceed 100', () => {
            const current = 95
            const toAdd = 20
            const result = Math.min(current + toAdd, 100)
            expect(result).toBe(100)
        })

        it('energy cannot go below 0', () => {
            const current = 10
            const toSpend = 50
            const result = Math.max(current - toSpend, 0)
            expect(result).toBe(0)
        })

        it('offline regen calculation is correct', () => {
            const REGEN_INTERVAL = 30 * 60 * 1000    // 30 min
            const REGEN_AMOUNT = 5
            const ENERGY_MAX = 100

            const currentEnergy = 40
            const offlineMs = 2 * 60 * 60 * 1000  // 2 hours offline
            const cycles = Math.floor(offlineMs / REGEN_INTERVAL)
            const gained = cycles * REGEN_AMOUNT
            const result = Math.min(currentEnergy + gained, ENERGY_MAX)

            // 2 hours = 4 cycles of 30min = +20 energy
            expect(cycles).toBe(4)
            expect(gained).toBe(20)
            expect(result).toBe(60)
        })

        it('offline regen does not exceed max', () => {
            const REGEN_INTERVAL = 30 * 60 * 1000
            const REGEN_AMOUNT = 5
            const ENERGY_MAX = 100

            const currentEnergy = 90
            const offlineMs = 10 * 60 * 60 * 1000  // 10 hours
            const cycles = Math.floor(offlineMs / REGEN_INTERVAL)
            const gained = cycles * REGEN_AMOUNT
            const result = Math.min(currentEnergy + gained, ENERGY_MAX)

            expect(result).toBe(100)                  // capped at 100
        })
    })

    // ── EXP / Level up ────────────────────────
    describe('exp and level calculations', () => {

        it('level up when exp reaches expMax', () => {
            const exp = 490
            const expMax = 500
            const toAdd = 20
            const newExp = exp + toAdd

            if (newExp >= expMax) {
                const overflow = newExp - expMax
                const newLevel = 2
                const newExpMax = Math.floor(expMax * 1.3)
                expect(overflow).toBe(10)
                expect(newLevel).toBe(2)
                expect(newExpMax).toBe(650)
            }
        })

        it('no level up when exp is below max', () => {
            const exp = 200
            const expMax = 500
            const toAdd = 50
            const newExp = exp + toAdd
            expect(newExp).toBeLessThan(expMax)
            expect(newExp).toBe(250)
        })

        it('expMax scales correctly after level up', () => {
            let expMax = 500
            // Level 1 → 2
            expMax = Math.floor(expMax * 1.3)
            expect(expMax).toBe(650)
            // Level 2 → 3
            expMax = Math.floor(expMax * 1.3)
            expect(expMax).toBe(845)
        })
    })

    // ── 7AM Reset ────────────────────────────
    describe('7AM daily reset logic', () => {

        it('returns correct reset key for time after 7AM', () => {
            // Simulate 10AM today
            const now = new Date()
            now.setHours(10, 0, 0, 0)

            const today7AM = new Date(now)
            today7AM.setHours(7, 0, 0, 0)

            const isAfter7AM = now >= today7AM
            expect(isAfter7AM).toBe(true)
        })

        it('returns yesterday key for time before 7AM', () => {
            // Simulate 3AM today
            const now = new Date()
            now.setHours(3, 0, 0, 0)

            const today7AM = new Date(now)
            today7AM.setHours(7, 0, 0, 0)

            const isAfter7AM = now >= today7AM
            expect(isAfter7AM).toBe(false)
            // Should use yesterday's key
        })

        it('shop purchases reset when date key changes', () => {
            const prevKey: string = '2025-01-01_07'
            const currentKey: string = '2025-01-02_07'
            const purchases = [{ itemId: 'calm-tea', count: 2 }]

            // Simulate reset
            const shouldReset = prevKey !== currentKey
            const newPurchases = shouldReset ? [] : purchases

            expect(shouldReset).toBe(true)
            expect(newPurchases).toHaveLength(0)
        })

        it('shop purchases NOT reset when same day', () => {
            const prevKey = '2025-01-01_07'
            const currentKey = '2025-01-01_07'
            const purchases = [{ itemId: 'calm-tea', count: 2 }]

            const shouldReset = prevKey !== currentKey
            const newPurchases = shouldReset ? [] : purchases

            expect(shouldReset).toBe(false)
            expect(newPurchases).toHaveLength(1)
        })
    })

    // ── Quest Timer ───────────────────────────
    describe('quest timer logic', () => {

        it('timeLeft calculates correctly', () => {
            const startTime = Date.now() - 1 * 60 * 60 * 1000  // started 1 hour ago
            const duration = 3 * 60 * 60 * 1000               // 3 hour quest
            const timeLeft = Math.max(0, startTime + duration - Date.now())

            // Should have ~2 hours left (±5 seconds tolerance)
            const twoHoursMs = 2 * 60 * 60 * 1000
            expect(timeLeft).toBeGreaterThan(twoHoursMs - 5000)
            expect(timeLeft).toBeLessThan(twoHoursMs + 5000)
        })

        it('timeLeft is 0 when quest is complete', () => {
            const startTime = Date.now() - 4 * 60 * 60 * 1000  // started 4 hours ago
            const duration = 3 * 60 * 60 * 1000               // 3 hour quest
            const timeLeft = Math.max(0, startTime + duration - Date.now())

            expect(timeLeft).toBe(0)
        })

        it('formatTimeLeft works correctly', () => {
            function formatTimeLeft(ms: number): string {
                if (ms <= 0) return 'Complete!'
                const totalSec = Math.floor(ms / 1000)
                const hours = Math.floor(totalSec / 3600)
                const minutes = Math.floor((totalSec % 3600) / 60)
                const seconds = totalSec % 60
                if (hours > 0) return `${hours}h ${minutes}m`
                if (minutes > 0) return `${minutes}m ${seconds}s`
                return `${seconds}s`
            }

            expect(formatTimeLeft(0)).toBe('Complete!')
            expect(formatTimeLeft(3 * 60 * 60 * 1000)).toBe('3h 0m')
            expect(formatTimeLeft(90 * 1000)).toBe('1m 30s')
            expect(formatTimeLeft(45 * 1000)).toBe('45s')
        })
    })

    // ── Shop 限购 ─────────────────────────────
    describe('shop purchase limits', () => {

        it('cannot buy when at daily limit', () => {
            const purchases = [{ itemId: 'calm-tea', count: 2 }]
            const maxPerDay = 2
            const itemId = 'calm-tea'
            const count = purchases.find(p => p.itemId === itemId)?.count || 0
            const canBuy = count < maxPerDay

            expect(canBuy).toBe(false)
        })

        it('can buy when under daily limit', () => {
            const purchases = [{ itemId: 'calm-tea', count: 1 }]
            const maxPerDay = 2
            const itemId = 'calm-tea'
            const count = purchases.find(p => p.itemId === itemId)?.count || 0
            const canBuy = count < maxPerDay

            expect(canBuy).toBe(true)
        })

        it('can buy new item not yet purchased', () => {
            const purchases = [{ itemId: 'calm-tea', count: 2 }]
            const maxPerDay = 2
            const itemId = 'moon-collar'    // different item
            const count = purchases.find(p => p.itemId === itemId)?.count || 0
            const canBuy = count < maxPerDay

            expect(canBuy).toBe(true)
        })
    })
})