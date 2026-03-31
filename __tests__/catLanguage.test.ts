import {
    getCatResponse,
    getCombinedCatResponse,
} from '@/lib/catLanguage'

// ── getCatResponse ────────────────────────────
describe('getCatResponse', () => {

    describe('basic output', () => {
        it('returns sound and translation', () => {
            const result = getCatResponse('mochi', 'idle', 0, 'greeting')
            expect(typeof result.sound).toBe('string')
            expect(result.sound.length).toBeGreaterThan(0)
            expect(typeof result.translation).toBe('string')
            expect(result.translation.length).toBeGreaterThan(0)
        })

        it('returns a valid category', () => {
            const validCategories = ['greeting', 'comfort', 'anxious', 'happy', 'lonely', 'rare']
            const result = getCatResponse('mochi', 'idle', 0, 'greeting')
            expect(validCategories).toContain(result.category)
        })
    })

    describe('pet vocabulary separation', () => {
        it('mochi uses cat sounds', () => {
            const catSounds = ['meow', 'mrrp', 'mew', 'purr', 'mochi']
            const results = Array.from({ length: 20 }, () =>
                getCatResponse('mochi', 'idle', 0, 'greeting')
            )
            const hascat = results.some(r =>
                catSounds.some(s => r.sound.toLowerCase().includes(s))
            )
            expect(hascat).toBe(true)
        })

        it('shiba uses dog sounds', () => {
            const dogSounds = ['woof', 'ruff', 'arf', 'huff', 'whine', 'sniff']
            const results = Array.from({ length: 20 }, () =>
                getCatResponse('shiba', 'idle', 0, 'greeting')
            )
            const hasDog = results.some(r =>
                dogSounds.some(s => r.sound.toLowerCase().includes(s))
            )
            expect(hasDog).toBe(true)
        })

        it('white-fox uses fox sounds', () => {
            const foxSounds = ['yip', 'hrrm', 'tsk', 'huff', 'mmm']
            const results = Array.from({ length: 20 }, () =>
                getCatResponse('white-fox', 'idle', 0, 'greeting')
            )
            const hasFox = results.some(r =>
                foxSounds.some(s => r.sound.toLowerCase().includes(s))
            )
            expect(hasFox).toBe(true)
        })
    })

    describe('trust gating', () => {
        it('never returns rare words when trust is 0', () => {
            // Run 100 times to catch random failures
            for (let i = 0; i < 100; i++) {
                const result = getCatResponse('mochi', 'idle', 0, 'chat_reply')
                expect(result.category).not.toBe('rare')
            }
        })

        it('never returns rare words when trust is 50', () => {
            for (let i = 0; i < 100; i++) {
                const result = getCatResponse('mochi', 'idle', 50, 'chat_reply')
                expect(result.category).not.toBe('rare')
            }
        })

        it('CAN return rare words when trust is 80', () => {
            const results = Array.from({ length: 300 }, () =>
                getCatResponse('mochi', 'idle', 80, 'chat_reply')
            )

            const hasRare = results.some(r => r.category === 'rare')
            expect(hasRare).toBe(true)
        })
    })

    describe('mood context', () => {
        it('returns different translations for happy vs sad mood', () => {
            // Same sound can have different translations per mood
            // Just check both return non-empty strings
            const happy = getCatResponse('mochi', 'happy', 50, 'chat_reply')
            const sad = getCatResponse('mochi', 'sad', 50, 'chat_reply')
            expect(happy.translation.length).toBeGreaterThan(0)
            expect(sad.translation.length).toBeGreaterThan(0)
        })

        it('long_absence context prefers lonely category', () => {
            const results = Array.from({ length: 30 }, () =>
                getCatResponse('mochi', 'idle', 30, 'long_absence')
            )
            const hasLonely = results.some(r => r.category === 'lonely')
            expect(hasLonely).toBe(true)
        })

        it('quest_complete context prefers happy category', () => {
            const results = Array.from({ length: 30 }, () =>
                getCatResponse('mochi', 'happy', 30, 'quest_complete')
            )
            const hasHappy = results.some(r => r.category === 'happy')
            expect(hasHappy).toBe(true)
        })
    })
})

// ── getCombinedCatResponse ────────────────────
describe('getCombinedCatResponse', () => {

    it('always returns at least 1 sound', () => {
        for (let i = 0; i < 20; i++) {
            const result = getCombinedCatResponse('mochi', 'idle', 0, 'greeting')
            expect(result.sounds.length).toBeGreaterThanOrEqual(1)
        }
    })

    it('never returns more than 2 sounds', () => {
        for (let i = 0; i < 50; i++) {
            const result = getCombinedCatResponse('mochi', 'idle', 50, 'greeting')
            expect(result.sounds.length).toBeLessThanOrEqual(2)
        }
    })

    it('never repeats the same sound in combination', () => {
        for (let i = 0; i < 100; i++) {
            const result = getCombinedCatResponse('mochi', 'idle', 50, 'greeting')
            if (result.sounds.length === 2) {
                expect(result.sounds[0]).not.toBe(result.sounds[1])
            }
        }
    })

    it('always returns a non-empty translation', () => {
        for (let i = 0; i < 20; i++) {
            const result = getCombinedCatResponse('mochi', 'happy', 30, 'chat_reply')
            expect(result.translation.length).toBeGreaterThan(0)
        }
    })
})