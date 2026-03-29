export interface UnlockCondition {
  type:        'quests' | 'level' | 'trust' | 'coins'
  target:      number
  description: string
}

export const PETS = [
  {
    id: 'mochi',
    name: 'Mochi',
    emoji: '🐱',
    rarity: 'common',
    locked: false,
    trust: 72,
    energy: 60,
    description: 'A gentle soul who feels everything.',
  },
  {
    id: 'shiba',
    name: 'Shiba',
    emoji: '🐕',
    rarity: 'rare',
    locked: false,
    trust: 45,
    energy: 88,
    description: 'Loyal and full of energy.',
  },
  {
    id: 'white-fox',
    name: 'White Fox',
    emoji: '🦊',
    rarity: 'rare',
    locked: false,
    trust: 38,
    energy: 75,
    description: 'Swift and mysterious. Hard to read.',
    color: '#ffffff',
  },
  {
    id: 'owl',
    name: 'Owl',
    emoji: '🦉',
    rarity: 'rare',
    locked: true,
    trust: 0,
    energy: 0,
    unlockHint:  'Complete 5 Night Quests',
    unlockCondition: {
      type:        'quests',
      target:      5,
      description: 'Complete Night Quests',
    } as UnlockCondition,
  },
  {
    id: 'frog',
    name: 'Frog',
    emoji: '🐸',
    rarity: 'common',
    locked: true,
    trust: 0,
    energy: 0,
   description: 'Cheerful and unbothered.',
    unlockHint:  'Reach Level 5',
    unlockCondition: {
      type:        'level',
      target:      5,
      description: 'Reach Level 5',
    } as UnlockCondition,
  },
  {
    id: 'duck',
    name: 'Duck',
    emoji: '🦆',
    rarity: 'common',
    locked: true,
    trust: 0,
    energy: 0,
        description: 'Unbothered by the rain.',
    unlockHint:  'Earn 500 Coins total',
    unlockCondition: {
      type:        'coins',
      target:      500,
      description: 'Earn 500 Coins',
    } as UnlockCondition,
  },
  {
    id: 'turtle',
    name: 'Turtle',
    emoji: '🐢',
    rarity: 'rare',
    locked: true,
    trust: 0,
    energy: 0,
    description: 'Steady and patient.',
    unlockHint:  'Reach Trust 80 with any pet',
    unlockCondition: {
      type:        'trust',
      target:      80,
      description: 'Reach Trust 80',
    } as UnlockCondition,
  },

  {
    id: 'shadow-cat',
    name: 'Shadow Cat',
    emoji: '🐈‍⬛',
    rarity: 'mythic',
    locked: true,
    trust: 0,
    energy: 0,
    description: 'Appears only at midnight.',
    unlockHint:  'Reach Level 10',
    unlockCondition: {
      type:        'level',
      target:      10,
      description: 'Reach Level 10',
    } as UnlockCondition,
  },
]

export const QUESTS = [
  "What drained your energy today?",
  "What's one thing you're grateful for?",
  "Is there something you've been avoiding?",
  "What made you smile today, even slightly?",
  "What do you wish someone understood about you?",
  "Name one thing that felt heavy this week.",
  "Where does your body hold tension today?",
]

export const MOCHI_RESPONSES: Record<string, string[]> = {
  sad: [
    "Mochi felt the weight and leaned closer. 🌧️",
    "Something shifted. Mochi stayed very still.",
    "Mochi's ears drooped, listening to every word.",
  ],
  anxious: [
    "Mochi sensed restlessness and paced alongside you.",
    "Mochi couldn't settle either. But they stayed.",
    "Both unsettled — but together.",
  ],
  angry: [
    "Mochi backed away slightly, then returned. 🔥",
    "Sharp energy today. Mochi kept watch from a distance.",
    "Mochi sat with the feeling, quietly.",
  ],
  happy: [
    "Mochi perked up — ears forward, tail HIGH! 🌟",
    "A warmth reached Mochi. Tiny spin detected! ✨",
    "Mochi made a sound that might have been a purr. 💜",
  ],
  calm: [
    "Mochi exhaled slowly. Matched your energy. 🍃",
    "Still and soft. Mochi settled like still water.",
    "A quiet day. Mochi's world bloomed. 🌸",
  ],
  default: [
    "Mochi listened. Said nothing. Was there. 🐱",
    "Your words reached somewhere. Mochi felt it.",
    "Mochi tilted their head, taking you in. ✨",
  ],
}

export const ADVENTURE_ZONES = [
  {
    id:         'moon-forest',
    name:       'Moon Forest',
    icon:       '🌲',
    desc:       'A quiet grove bathed in silver light.',
    minCoins:   8,
    maxCoins:   20,
    energyCost: 10,
    hours:      3,                           // ← 真实小时数
    duration:   3 * 60 * 60 * 1000,         // ← 毫秒
    locked:     false,
  },
  {
    id:         'crystal-caves',
    name:       'Crystal Caves',
    icon:       '💎',
    desc:       'Echoing tunnels with rare echoes.',
    minCoins:   15,
    maxCoins:   40,
    energyCost: 15,
    hours:      6,
    duration:   6 * 60 * 60 * 1000,
    locked:     false,
  },
  {
    id:         'ember-peaks',
    name:       'Ember Peaks',
    icon:       '🌋',
    desc:       'Reach Level 8 to unlock.',
    minCoins:   30,
    maxCoins:   80,
    energyCost: 20,
    hours:      8,
    duration:   8 * 60 * 60 * 1000,
    locked:     true,
  },
]

export const SHOP_ITEMS = [
  { id: 'moon-collar',    name: 'Moon Collar',    icon: '📿', cost: 30, stat: 'trust',     amount: 8,  desc: 'A gentle weight around the neck. Mochi feels safer.',      maxPerDay: 2 },
  { id: 'warm-wrap',      name: 'Warm Wrap',      icon: '🧣', cost: 20, stat: 'energy',    amount: 15, desc: 'Soft fabric that holds warmth for long adventures.',        maxPerDay: 2 },
  { id: 'adventure-cape', name: 'Adventure Cape', icon: '🎒', cost: 50, stat: 'adventure', amount: 10, desc: 'Wind-resistant. Rewards increase on every expedition.',      maxPerDay: 2 },
  { id: 'calm-tea',       name: 'Calm Tea',       icon: '🍵', cost: 15, stat: 'energy',    amount: 20, desc: 'A ritual of stillness. Affects mood for today.',             maxPerDay: 2 },
]
