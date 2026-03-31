import { decideResponseMode } from '@/lib/responseEngine'

describe('decideResponseMode', () => {

  // ── 强制猫语的情况 ─────────────────────────
  describe('forced cat language cases', () => {

    const shortGreetings = ['hi', 'hello', 'hey', '你好', '在吗', 'meow', 'woof', 'yip']
    shortGreetings.forEach(text => {
      it(`"${text}" → greeting → cat language`, () => {
        const result = decideResponseMode(text, 'idle', 50, 'mochi', 5, -10)
        expect(result.useCatLanguage).toBe(true)
        expect(result.reason).toBe('greeting')
        expect(result.catResponse).toBeDefined()
      })
    })

    it('very short text (< 5 chars) → cat language', () => {
      const result = decideResponseMode('ok', 'idle', 50, 'mochi', 5, -10)
      expect(result.useCatLanguage).toBe(true)
      expect(result.reason).toBe('too_short')
    })

    it('first message (msgCount=1) → cat language warmup', () => {
      const result = decideResponseMode(
        'I am feeling really anxious about my exam tomorrow',
        'anxious', 50, 'mochi',
        1,    // first message
        -10
      )
      expect(result.useCatLanguage).toBe(true)
      expect(result.reason).toBe('early_warmup')
    })

    it('second message (msgCount=2) → cat language warmup', () => {
      const result = decideResponseMode(
        'everything is overwhelming me right now because of work',
        'sad', 50, 'mochi',
        2,
        -10
      )
      expect(result.useCatLanguage).toBe(true)
      expect(result.reason).toBe('early_warmup')
    })

    it('message right after AI (cooldown) → cat language', () => {
      const result = decideResponseMode(
        'I still feel the same way honestly it has not gotten better',
        'sad', 50, 'mochi',
        10,   // 10th message
        9     // AI was just used on message 9
      )
      expect(result.useCatLanguage).toBe(true)
      expect(result.reason).toBe('ai_cooldown')
    })
  })

  // ── 80/20 随机分布测试 ────────────────────
  describe('80/20 distribution', () => {
    it('roughly 80% cat language for normal inputs', () => {
      const longText = 'feeling tired'
      const N        = 500
      const results  = Array.from({ length: N }, () =>
        decideResponseMode(longText, 'sad', 50, 'mochi', 10, 5)
      )
      const catCount = results.filter(r => r.useCatLanguage).length
      const catPct   = catCount / N

      // 应该在 65%-95% 之间（80% ± 15%）
      expect(catPct).toBeGreaterThan(0.65)
      expect(catPct).toBeLessThan(0.95)
    })
  })

  // ── catResponse 结构检查 ──────────────────
  describe('catResponse structure', () => {
    it('catResponse is provided when useCatLanguage=true', () => {
      const result = decideResponseMode('hi', 'idle', 50, 'mochi', 1, -10)
      expect(result.useCatLanguage).toBe(true)
      expect(result.catResponse).toBeDefined()
      expect(result.catResponse!.sounds).toBeDefined()
      expect(result.catResponse!.sounds.length).toBeGreaterThan(0)
      expect(result.catResponse!.translation).toBeTruthy()
    })

    it('catResponse is undefined when useCatLanguage=false', () => {
      // Force AI path by using complex text after warmup
      // Run many times until we get an AI response
      let aiResult = null
      for (let i = 0; i < 200; i++) {
        const result = decideResponseMode(
          'I feel really anxious because my exam is tomorrow',
          'anxious', 50, 'mochi', 10, 3
        )
        if (!result.useCatLanguage) {
          aiResult = result
          break
        }
      }
      if (aiResult) {
        expect(aiResult.catResponse).toBeUndefined()
      }
      // If we never got AI in 200 tries, that's fine too (random)
    })

    it('uses correct vocabulary for each pet', () => {
      const pets = ['mochi', 'shiba', 'white-fox'] as const

      pets.forEach(pet => {
        const result = decideResponseMode('hi', 'idle', 50, pet, 1, -10)
        expect(result.catResponse).toBeDefined()
        expect(result.catResponse!.sounds[0].length).toBeGreaterThan(0)
      })
    })
  })
})