// ── 猫语词汇库 ────────────────────────────────
export interface CatWord {
  sound:       string
  translation: Record<string, string>   // 不同情绪下的翻译
  category:    'greeting' | 'comfort' | 'anxious' | 'happy' | 'lonely' | 'rare'
  minTrust:    number                   // 需要多少 trust 才会说
}

// ── 猫语词汇库 ────────────────────────────────
export interface CatWord {
  sound:       string
  translation: Record<string, string>   // 不同情绪下的翻译
  category:    'greeting' | 'comfort' | 'anxious' | 'happy' | 'lonely' | 'rare'
  minTrust:    number                   // 需要多少 trust 才会说
}

export const CAT_VOCABULARY: CatWord[] = [
  // ── 基础互动类 ────────────────────────────
  {
    sound:    'meow',
    category: 'greeting',
    minTrust: 0,
    translation: {
      idle:    'Are you there?',
      happy:   'Want to go on an adventure today?',
      sad:     'It is okay to sit for a while first.',
      anxious: 'Breathe a little slower.',
      calm:    'Mm, I am here too.',
      default: 'Are you there?',
    },
  },
  {
    sound:    'meow meow',
    category: 'greeting',
    minTrust: 0,
    translation: {
      idle:    'Pay attention to me.',
      happy:   'Let’s play together!',
      sad:     'I am here.',
      anxious: 'Look at me, don’t think too much.',
      calm:    'It is so quiet.',
      default: 'Pay attention to me.',
    },
  },
  {
    sound:    'meowww',
    category: 'greeting',
    minTrust: 10,
    translation: {
      idle:    'I kind of missed you.',
      happy:   'So happy you came back!',
      sad:     'You feel a little heavy today.',
      anxious: 'I can feel it.',
      calm:    'Today feels nice.',
      default: 'I kind of missed you.',
    },
  },
  {
    sound:    'mrrp',
    category: 'greeting',
    minTrust: 0,
    translation: {
      idle:    'Got it.',
      happy:   'Mm!',
      sad:     'I understand.',
      anxious: 'Okay, I am here.',
      calm:    'Mm.',
      default: 'Got it.',
    },
  },
  {
    sound:    'mrrrow?',
    category: 'greeting',
    minTrust: 5,
    translation: {
      idle:    'What happened today?',
      happy:   'Any good news today?',
      sad:     'Did something happen?',
      anxious: 'What is making you uneasy?',
      calm:    'Are you okay today?',
      default: 'What happened today?',
    },
  },

  // ── 安慰类 ───────────────────────────────
  {
    sound:    'mm…meow',
    category: 'comfort',
    minTrust: 15,
    translation: {
      idle:    'You look tired.',
      happy:   'It is okay to rest a little.',
      sad:     'You look really tired.',
      anxious: 'It is too much, put some of it down first.',
      calm:    'Take it slowly.',
      default: 'You look tired.',
    },
  },
  {
    sound:    'purrr…',
    category: 'comfort',
    minTrust: 10,
    translation: {
      idle:    'It is okay, I am here.',
      happy:   'Being together is enough.',
      sad:     'It is okay, I am here.',
      anxious: 'I am beside you.',
      calm:    'Good, just like this.',
      default: 'It is okay, I am here.',
    },
  },
  {
    sound:    'mmmrr…',
    category: 'comfort',
    minTrust: 20,
    translation: {
      idle:    'It is okay to go slower.',
      happy:   'No need to rush.',
      sad:     'Take it slowly, it is okay.',
      anxious: 'One step at a time.',
      calm:    'This pace is fine.',
      default: 'It is okay to go slower.',
    },
  },
  {
    sound:    'mew...',
    category: 'comfort',
    minTrust: 5,
    translation: {
      idle:    'Today feels quiet.',
      happy:   'Quiet is nice too.',
      sad:     'Today feels heavy.',
      anxious: 'Is it too noisy?',
      calm:    'Quiet moments are good too.',
      default: 'Today feels quiet.',
    },
  },

  // ── 焦虑类 ───────────────────────────────
  {
    sound:    'meow! meow! meow!',
    category: 'anxious',
    minTrust: 0,
    translation: {
      idle:    'Did something happen?',
      happy:   'So lively!',
      sad:     'What is wrong?',
      anxious: 'I feel it too!',
      calm:    'Hm? Something happened?',
      default: 'Did something happen?',
    },
  },
  {
    sound:    'rrroww',
    category: 'anxious',
    minTrust: 15,
    translation: {
      idle:    'Something feels strange here.',
      happy:   'Hm?',
      sad:     'Something feels off.',
      anxious: 'I can feel that pressure too.',
      calm:    'It is okay, it is okay.',
      default: 'Something feels strange here.',
    },
  },
  {
    sound:    'tsk-meow',
    category: 'anxious',
    minTrust: 25,
    translation: {
      idle:    'Don’t put too much on yourself.',
      happy:   'Relax a little sometimes.',
      sad:     'You don’t have to carry everything alone.',
      anxious: 'It is okay to put some down.',
      calm:    'This is enough, just right.',
      default: 'Don’t put too much on yourself.',
    },
  },

  // ── 开心类 ───────────────────────────────
  {
    sound:    'prrp!',
    category: 'happy',
    minTrust: 0,
    translation: {
      idle:    'Yay!',
      happy:   'Yay!!',
      sad:     'It will get better.',
      anxious: 'You can do it!',
      calm:    'Nice.',
      default: 'Yay!',
    },
  },
  {
    sound:    'mewww~♪',
    category: 'happy',
    minTrust: 10,
    translation: {
      idle:    'Today feels nice.',
      happy:   'Today is really good!',
      sad:     'Tomorrow will be better.',
      anxious: 'It will be okay.',
      calm:    'Today feels gentle.',
      default: 'Today feels nice.',
    },
  },
  {
    sound:    'purrr-prrp',
    category: 'happy',
    minTrust: 20,
    translation: {
      idle:    'Keep it up.',
      happy:   'Keep going like this!',
      sad:     'A little at a time is enough.',
      anxious: 'Slowly is fine.',
      calm:    'Good, just like this.',
      default: 'Keep it up.',
    },
  },

  // ── 孤独类 ───────────────────────────────
  {
    sound:    'meow...',
    category: 'lonely',
    minTrust: 5,
    translation: {
      idle:    'You came back a little late today.',
      happy:   'Finally waited for you.',
      sad:     'I have been waiting.',
      anxious: 'I was a little worried about you.',
      calm:    'It is okay, you are here now.',
      default: 'You came back a little late today.',
    },
  },
  {
    sound:    'mrrr...',
    category: 'lonely',
    minTrust: 15,
    translation: {
      idle:    'It feels a little quiet.',
      happy:   'Talk with me a little.',
      sad:     'Today is very quiet.',
      anxious: 'Too quiet makes me uneasy.',
      calm:    'Quiet is okay too.',
      default: 'It feels a little quiet.',
    },
  },
  {
    sound:    'mew mew',
    category: 'lonely',
    minTrust: 10,
    translation: {
      idle:    'Want to stay with you a little.',
      happy:   'It feels nice being together.',
      sad:     'I am here with you.',
      anxious: 'I will not leave.',
      calm:    'Let’s just stay like this.',
      default: 'Want to stay with you a little.',
    },
  },

  // ── 高 trust 解锁 ─────────────────────────
  {
    sound:    'purrrrrr',
    category: 'rare',
    minTrust: 60,
    translation: {
      idle:    'I know you have been holding on for a long time.',
      happy:   'You really worked hard.',
      sad:     'I know you have been holding on for a long time.',
      anxious: 'It has not been easy.',
      calm:    'You have done a lot.',
      default: 'I know you have been holding on for a long time.',
    },
  },
  {
    sound:    'soft meow...',
    category: 'rare',
    minTrust: 80,
    translation: {
      idle:    'You do not need to explain.',
      happy:   'You do not need to say anything, I understand.',
      sad:     'No need to explain, I understand.',
      anxious: 'You do not need to finish saying it, it is okay.',
      calm:    'Just like this, no need to say more.',
      default: 'You do not need to explain.',
    },
  },
]
// ── 情境触发器 ────────────────────────────────
// 根据情境选择合适的猫语
export interface CatMessage {
  sound:       string
  translation: string
  category:    string
}

export function getCatResponse(
  mood:        string,
  trust:       number,
  context:     'chat_reply' | 'greeting' | 'long_absence' | 'quest_complete' | 'level_up' | 'low_energy' | 'tap'
): CatMessage {
  // 过滤出当前 trust 等级可用的词汇
  const available = CAT_VOCABULARY.filter(w => w.minTrust <= trust)

  // 根据情境选择类别权重
  const weights: Record<string, string[]> = {
    chat_reply:     getMoodCategory(mood),
    greeting:       ['greeting'],
    long_absence:   ['lonely'],
    quest_complete: ['happy'],
    level_up:       ['happy', 'rare'],
    low_energy:     ['comfort'],
    tap:            ['greeting', 'happy'],
  }

  const preferredCategories = weights[context] || ['greeting']

  // 先从偏好类别里找
  let pool = available.filter(w => preferredCategories.includes(w.category))

  // 如果没有，用全部
  if (pool.length === 0) pool = available

  // 随机选一个
  const chosen = pool[Math.floor(Math.random() * pool.length)]

  return {
    sound:       chosen.sound,
    translation: chosen.translation[mood] || chosen.translation['default'],
    category:    chosen.category,
  }
}

function getMoodCategory(mood: string): string[] {
  switch (mood) {
    case 'happy':   return ['happy', 'greeting']
    case 'sad':     return ['comfort', 'lonely']
    case 'anxious': return ['anxious', 'comfort']
    case 'calm':    return ['comfort', 'greeting']
    default:        return ['greeting', 'comfort']
  }
}

// ── 组合多个猫语 ──────────────────────────────
// 有时候猫会说多个词
export function getCombinedCatResponse(
  mood:    string,
  trust:   number,
  context: 'chat_reply' | 'greeting' | 'long_absence' | 'quest_complete' | 'level_up' | 'low_energy' | 'tap'
): { sounds: string[]; translation: string } {
  const main = getCatResponse(mood, trust, context)

  // 30% 概率加第二个词
  const addSecond = Math.random() < 0.3

  if (!addSecond) {
    return { sounds: [main.sound], translation: main.translation }
  }

  // 第二个词从 greeting 类里选一个短的
  const shortWords = CAT_VOCABULARY.filter(
    w => w.minTrust <= trust && w.category === 'greeting' && w.sound.length < 6
  )

  if (shortWords.length === 0) {
    return { sounds: [main.sound], translation: main.translation }
  }

  const second = shortWords[Math.floor(Math.random() * shortWords.length)]

  return {
    sounds:      [main.sound, second.sound],
    translation: main.translation,
  }
}