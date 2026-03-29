import type { Emotion } from './emotionEngine'

export interface Reward {
  exp:        number
  trust:      number
  coins:      number
  energyCost: number
}

export function giveReward(emotion: Emotion): Reward {
  const map: Record<Emotion, Reward> = {
    sad:     { exp: 20, trust: 6, coins: 5, energyCost: 5  },
    anxious: { exp: 18, trust: 5, coins: 4, energyCost: 8  },
    angry:   { exp: 15, trust: 3, coins: 3, energyCost: 10 },
    happy:   { exp: 25, trust: 8, coins: 8, energyCost: 0  },
    calm:    { exp: 22, trust: 9, coins: 6, energyCost: 0  },
    default: { exp: 15, trust: 4, coins: 3, energyCost: 3  },
  }
  return map[emotion] ?? map.default
}
