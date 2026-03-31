export const PET_PERSONALITY = {
  mochi: 'I understand quietly.',
  shiba: 'I stay beside you.',
  'white-fox': 'I noticed what you didn\'t say.',
}

export type PetId = keyof typeof PET_PERSONALITY

export type Mood =
  | 'idle'
  | 'happy'
  | 'sad'
  | 'anxious'
  | 'calm'

export type MoodKey = Mood | 'default'

export type CatCategory =
  | 'greeting'
  | 'comfort'
  | 'anxious'
  | 'happy'
  | 'lonely'
  | 'rare'

export interface CatWord {
  sound: string
  translation: Partial<Record<MoodKey, string>>
  category: CatCategory
  minTrust: number
}

// ══════════════════════════════════════════════
// MOCHI 词库（猫语）
// ══════════════════════════════════════════════
const MOCHI_VOCABULARY: CatWord[] = [
  // Greeting
  {
    sound: 'meow', category: 'greeting', minTrust: 0,
    translation: {
      idle: 'Are you there?',
      happy: 'Want to go on an adventure today?',
      sad: 'It’s okay to just sit for a while.',
      anxious: 'Breathe a little slower.',
      calm: 'Mm, I’m here too.',
      default: 'Are you there?',
    },
  },
  {
    sound: 'meow meow', category: 'greeting', minTrust: 0,
    translation: {
      idle: 'Notice me a little.',
      happy: 'Let’s play!',
      sad: 'I’m here.',
      anxious: 'Look at me, don’t think too much.',
      calm: 'It’s so quiet.',
      default: 'Notice me a little.',
    },
  },
  {
    sound: 'meowww', category: 'greeting', minTrust: 10,
    translation: {
      idle: 'I kind of missed you.',
      happy: 'So happy you’re back!',
      sad: 'You feel a little heavy today.',
      anxious: 'I can feel it too.',
      calm: 'Today feels nice.',
      default: 'I kind of missed you.',
    },
  },
  {
    sound: 'mrrp', category: 'greeting', minTrust: 0,
    translation: {
      idle: 'Got it.',
      happy: 'Mm!',
      sad: 'I understand.',
      anxious: 'Okay, I’m here.',
      calm: 'Mm.',
      default: 'Got it.',
    },
  },
  {
    sound: 'mrrrow?', category: 'greeting', minTrust: 5,
    translation: {
      idle: 'What happened today?',
      happy: 'Anything good today?',
      sad: 'Did something happen?',
      anxious: 'What is making you uneasy?',
      calm: 'How was today?',
      default: 'What happened today?',
    },
  },

  // Comfort
  {
    sound: 'purrr…', category: 'comfort', minTrust: 10,
    translation: {
      idle: 'It’s okay, I’m here.',
      happy: 'Being together is enough.',
      sad: 'It’s okay, I’m here.',
      anxious: 'I’m beside you.',
      calm: 'Good, just like this.',
      default: 'It’s okay, I’m here.',
    },
  },
  {
    sound: 'mmmrr…', category: 'comfort', minTrust: 20,
    translation: {
      idle: 'It’s okay to go slower.',
      happy: 'No need to rush.',
      sad: 'Take your time, it’s okay.',
      anxious: 'One step at a time.',
      calm: 'This pace is good.',
      default: 'It’s okay to go slower.',
    },
  },
  {
    sound: 'mew...', category: 'comfort', minTrust: 5,
    translation: {
      idle: 'Today feels quiet.',
      happy: 'Quiet is nice too.',
      sad: 'Today feels heavy.',
      anxious: 'Too noisy?',
      calm: 'Quiet moments are nice too.',
      default: 'Today feels quiet.',
    },
  },

  // Anxious
  {
    sound: 'meow! meow! meow!', category: 'anxious', minTrust: 0,
    translation: {
      idle: 'Did something happen?',
      happy: 'So lively!',
      sad: 'What’s wrong?',
      anxious: 'I can feel it too!',
      calm: 'Hm? Something happened?',
      default: 'Did something happen?',
    },
  },
  {
    sound: 'tsk-meow', category: 'anxious', minTrust: 25,
    translation: {
      idle: 'Don’t put too much on yourself.',
      happy: 'Relax sometimes too.',
      sad: 'You don’t have to carry everything alone.',
      anxious: 'It’s okay to put some of it down.',
      calm: 'Just like this, it’s enough.',
      default: 'Don’t put too much on yourself.',
    },
  },

  // Happy
  {
    sound: 'prrp!', category: 'happy', minTrust: 0,
    translation: {
      idle: 'Yay!',
      happy: 'Yay!!',
      sad: 'It will get better.',
      anxious: 'You can do it!',
      calm: 'Nice.',
      default: 'Yay!',
    },
  },
  {
    sound: 'mewww~♪', category: 'happy', minTrust: 10,
    translation: {
      idle: 'Today feels nice.',
      happy: 'Today is really good!',
      sad: 'Tomorrow will be better.',
      anxious: 'It’ll be okay.',
      calm: 'Today feels gentle.',
      default: 'Today feels nice.',
    },
  },

  // Lonely
  {
    sound: 'meow...', category: 'lonely', minTrust: 5,
    translation: {
      idle: 'You came back a little late today.',
      happy: 'Finally, I waited for you.',
      sad: 'I’ve been waiting.',
      anxious: 'I was a little worried about you.',
      calm: 'It’s okay, you’re here now.',
      default: 'You came back a little late today.',
    },
  },
  {
    sound: 'mew mew', category: 'lonely', minTrust: 10,
    translation: {
      idle: 'I want to stay with you for a while.',
      happy: 'It’s nice being together.',
      sad: 'I’m here with you.',
      anxious: 'I won’t leave.',
      calm: 'Let’s just stay like this.',
      default: 'I want to stay with you for a while.',
    },
  },

  // Rare
  {
    sound: 'purrrrrr', category: 'rare', minTrust: 60,
    translation: {
      idle: 'I know you’ve held on for a long time.',
      happy: 'You’ve really worked hard.',
      sad: 'I know you’ve held on for a long time.',
      anxious: 'It hasn’t been easy.',
      calm: 'You’ve done a lot.',
      default: 'I know you’ve held on for a long time.',
    },
  },
  {
    sound: 'soft meow...', category: 'rare', minTrust: 80,
    translation: {
      idle: 'You don’t have to explain.',
      happy: 'You don’t need to say anything, I understand.',
      sad: 'No need to explain, I understand.',
      anxious: 'You don’t have to finish saying it, it’s okay.',
      calm: 'Just like this, no need to say more.',
      default: 'You don’t have to explain.',
    },
  },
]

// ══════════════════════════════════════════════
// SHIBA
// ══════════════════════════════════════════════
const SHIBA_VOCABULARY: CatWord[] = [
  // Greeting
  {
    sound: 'woof', category: 'greeting', minTrust: 0,
    translation: {
      idle: 'You\'re here!', happy: 'Let\'s go somewhere!',
      sad: 'I\'m right here.', anxious: 'Hey, look at me.', calm: 'Good.', default: 'You\'re here!',
    },
  },
  {
    sound: 'woof woof', category: 'greeting', minTrust: 0,
    translation: {
      idle: 'Hey, notice me!', happy: 'Finally, let\'s play!',
      sad: 'I\'m not going anywhere.', anxious: 'Focus on me, not that.', calm: 'Just checking.', default: 'Hey, notice me!',
    },
  },
  {
    sound: 'ruff?', category: 'greeting', minTrust: 5,
    translation: {
      idle: 'How was today?', happy: 'Good day?',
      sad: 'Something happen?', anxious: 'You okay?', calm: 'All good?', default: 'How was today?',
    },
  },
  {
    sound: 'arf', category: 'greeting', minTrust: 10,
    translation: {
      idle: 'I missed you a little.', happy: 'Glad you\'re back.',
      sad: 'I waited.', anxious: 'I noticed you were gone.', calm: 'Welcome back.', default: 'I missed you a little.',
    },
  },
  {
    sound: 'huff', category: 'greeting', minTrust: 0,
    translation: {
      idle: 'Good, you came back.', happy: 'There you are.',
      sad: 'Okay. I\'m here.', anxious: 'Settle down. I\'ve got you.', calm: 'Good.', default: 'Good, you came back.',
    },
  },
  // Comfort
  {
    sound: 'whine...', category: 'comfort', minTrust: 15,
    translation: {
      idle: 'Stay here for a moment.', happy: 'Don\'t rush off yet.',
      sad: 'Stay. Just for now.', anxious: 'Sit with me.', calm: 'Stay a little longer.', default: 'Stay here for a moment.',
    },
  },
  {
    sound: 'soft woof', category: 'comfort', minTrust: 10,
    translation: {
      idle: 'You look tired.', happy: 'You look good today.',
      sad: 'You look really tired.', anxious: 'You\'re tense.', calm: 'You seem okay.', default: 'You look tired.',
    },
  },
  {
    sound: 'hmmm-ruff', category: 'comfort', minTrust: 20,
    translation: {
      idle: 'No rush.', happy: 'Take your time.',
      sad: 'No rush at all.', anxious: 'Slow down.', calm: 'This is a good pace.', default: 'No rush.',
    },
  },
  {
    sound: 'low arf', category: 'comfort', minTrust: 15,
    translation: {
      idle: 'One step is enough.', happy: 'Keep going.',
      sad: 'One step. That\'s all.', anxious: 'Just one thing at a time.', calm: 'Good pace.', default: 'One step is enough.',
    },
  },
  {
    sound: 'warm woof', category: 'comfort', minTrust: 25,
    translation: {
      idle: 'I\'m staying here.', happy: 'I\'m with you.',
      sad: 'I\'m not leaving.', anxious: 'I\'m right here.', calm: 'Still here.', default: 'I\'m staying here.',
    },
  },
  // Anxious
  {
    sound: 'arf! arf!', category: 'anxious', minTrust: 0,
    translation: {
      idle: 'Something feels wrong?', happy: 'Lots of energy!',
      sad: 'What happened?', anxious: 'Something feels wrong?', calm: 'Everything okay?', default: 'Something feels wrong?',
    },
  },
  {
    sound: 'grr... woof', category: 'anxious', minTrust: 15,
    translation: {
      idle: 'Too much at once?', happy: 'Steady.',
      sad: 'That\'s a lot.', anxious: 'Too much at once.', calm: 'Okay.', default: 'Too much at once?',
    },
  },
  {
    sound: 'sniff...', category: 'anxious', minTrust: 10,
    translation: {
      idle: 'I can feel it too.', happy: 'All clear.',
      sad: 'I feel it.', anxious: 'I can feel it too.', calm: 'Seems fine.', default: 'I can feel it too.',
    },
  },
  {
    sound: 'huff-huff', category: 'anxious', minTrust: 0,
    translation: {
      idle: 'Slow down first.', happy: 'Easy!',
      sad: 'Breathe first.', anxious: 'Slow down first.', calm: 'Good breathing.', default: 'Slow down first.',
    },
  },
  // Happy
  {
    sound: 'ruff!', category: 'happy', minTrust: 0,
    translation: {
      idle: 'Nice!', happy: 'Yes! That\'s great!', sad: 'It\'ll be okay.', anxious: 'You\'ve got this!', calm: 'That works.', default: 'Nice!',
    },
  },
  {
    sound: 'woooof~', category: 'happy', minTrust: 10,
    translation: {
      idle: 'Today feels good!', happy: 'Best day!',
      sad: 'Tomorrow will be better.', anxious: 'It\'s going to be fine.', calm: 'Nice and easy.', default: 'Today feels good!',
    },
  },
  {
    sound: 'tail wag wag', category: 'happy', minTrust: 5,
    translation: {
      idle: 'Keep going!', happy: 'Let\'s keep this up!',
      sad: 'Keep going, little by little.', anxious: 'Keep going, one step.', calm: 'Just right.', default: 'Keep going!',
    },
  },
  // Lonely
  {
    sound: 'woof...', category: 'lonely', minTrust: 5,
    translation: {
      idle: 'I waited here.', happy: 'You came!',
      sad: 'I waited a long time.', anxious: 'I was worried.', calm: 'You\'re back. Good.', default: 'I waited here.',
    },
  },
  {
    sound: 'sniff... woof', category: 'lonely', minTrust: 15,
    translation: {
      idle: 'Quiet for too long.', happy: 'Good to have you.',
      sad: 'It was quiet.', anxious: 'Too much silence.', calm: 'Quiet is okay.', default: 'Quiet for too long.',
    },
  },
  {
    sound: 'soft whine', category: 'lonely', minTrust: 20,
    translation: {
      idle: 'Stay a little longer?', happy: 'Don\'t go yet.',
      sad: 'Please stay.', anxious: 'Don\'t go.', calm: 'Stay a while.', default: 'Stay a little longer?',
    },
  },
  // Rare
  {
    sound: 'tail-thump', category: 'rare', minTrust: 60,
    translation: {
      idle: 'You came back. That is enough.', happy: 'You did it.',
      sad: 'You came back. That is enough.', anxious: 'You made it through.', calm: 'That\'s all that matters.', default: 'You came back. That is enough.',
    },
  },
  {
    sound: 'soft ruff...', category: 'rare', minTrust: 80,
    translation: {
      idle: 'You do not need to explain.', happy: 'I already know.',
      sad: 'You do not need to explain.', anxious: 'No need to say it.', calm: 'I understand.', default: 'You do not need to explain.',
    },
  },
  {
    sound: 'long woof', category: 'rare', minTrust: 70,
    translation: {
      idle: 'I know today was heavy.', happy: 'You did well today.',
      sad: 'I know today was heavy.', anxious: 'I know it\'s a lot.', calm: 'Today was something.', default: 'I know today was heavy.',
    },
  },
  {
    sound: 'quiet huff', category: 'rare', minTrust: 65,
    translation: {
      idle: 'We can stay like this.', happy: 'This is good.',
      sad: 'We can stay like this.', anxious: 'Just breathe. Stay.', calm: 'This is enough.', default: 'We can stay like this.',
    },
  },
]

// ══════════════════════════════════════════════
// WHITE FOX 词库（狐狸语 — 英文，更内敛）
// ══════════════════════════════════════════════
const WHITE_FOX_VOCABULARY: CatWord[] = [
  // Greeting
  {
    sound: 'yip', category: 'greeting', minTrust: 0,
    translation: {
      idle: 'You came.', happy: 'Here again.',
      sad: 'You\'re here.', anxious: 'I see you.', calm: 'Good.', default: 'You came.',
    },
  },
  {
    sound: 'yip-yip', category: 'greeting', minTrust: 0,
    translation: {
      idle: 'Still awake?', happy: 'Lively today.',
      sad: 'Still here.', anxious: 'Restless?', calm: 'Quiet one.', default: 'Still awake?',
    },
  },
  {
    sound: 'hrrm?', category: 'greeting', minTrust: 5,
    translation: {
      idle: 'Thinking again?', happy: 'Something good?',
      sad: 'Heavy thoughts?', anxious: 'Too many things?', calm: 'Clear head today.', default: 'Thinking again?',
    },
  },
  {
    sound: 'tsk-yip', category: 'greeting', minTrust: 10,
    translation: {
      idle: 'You look distracted.', happy: 'Focused today.',
      sad: 'Something\'s off.', anxious: 'Scattered today.', calm: 'Grounded.', default: 'You look distracted.',
    },
  },
  // Comfort
  {
    sound: 'mmm... yip', category: 'comfort', minTrust: 15,
    translation: {
      idle: 'No need to force it.', happy: 'It comes naturally.',
      sad: 'No need to force anything.', anxious: 'Don\'t push.', calm: 'Let it be.', default: 'No need to force it.',
    },
  },
  {
    sound: 'soft hrrm', category: 'comfort', minTrust: 10,
    translation: {
      idle: 'Sit a while first.', happy: 'Settle in.',
      sad: 'Sit. Don\'t move yet.', anxious: 'Sit. Just sit.', calm: 'Good. Just be here.', default: 'Sit a while first.',
    },
  },
  {
    sound: 'low yip', category: 'comfort', minTrust: 5,
    translation: {
      idle: 'Quiet is allowed.', happy: 'This kind of quiet is good.',
      sad: 'Silence is fine.', anxious: 'You don\'t have to fill the silence.', calm: 'Exactly this.', default: 'Quiet is allowed.',
    },
  },
  {
    sound: 'huff...', category: 'comfort', minTrust: 20,
    translation: {
      idle: 'Let the noise pass.', happy: 'The noise will fade.',
      sad: 'It will pass.', anxious: 'Let it pass. Don\'t hold it.', calm: 'It passed.', default: 'Let the noise pass.',
    },
  },
  // Anxious
  {
    sound: 'tsk...', category: 'anxious', minTrust: 0,
    translation: {
      idle: 'Too many thoughts.', happy: 'Even now?',
      sad: 'Still those thoughts.', anxious: 'Too many thoughts.', calm: 'Clearing.', default: 'Too many thoughts.',
    },
  },
  {
    sound: 'sharp yip', category: 'anxious', minTrust: 10,
    translation: {
      idle: 'Something is pulling at you.', happy: 'Pulled in many directions.',
      sad: 'Something is pulling hard.', anxious: 'Something is pulling at you.', calm: 'You let go.', default: 'Something is pulling at you.',
    },
  },
  {
    sound: 'hrrm...', category: 'anxious', minTrust: 15,
    translation: {
      idle: 'Your mind is loud today.', happy: 'Loud, but good.',
      sad: 'Very loud today.', anxious: 'Your mind is loud today.', calm: 'Quieter now.', default: 'Your mind is loud today.',
    },
  },
  {
    sound: 'short huff', category: 'anxious', minTrust: 0,
    translation: {
      idle: 'Stay here first.', happy: 'Stay with this.',
      sad: 'Just stay here.', anxious: 'Stay here first.', calm: 'Good.', default: 'Stay here first.',
    },
  },
  // Happy
  {
    sound: 'yip!', category: 'happy', minTrust: 0,
    translation: {
      idle: 'Better.', happy: 'Yes. Better.',
      sad: 'It will get better.', anxious: 'Slightly better.', calm: 'Settled.', default: 'Better.',
    },
  },
  {
    sound: 'light huff', category: 'happy', minTrust: 5,
    translation: {
      idle: 'That suits today.', happy: 'This fits.',
      sad: 'Something small still fits.', anxious: 'A small fit.', calm: 'Fits perfectly.', default: 'That suits today.',
    },
  },
  {
    sound: 'quick yip-yip', category: 'happy', minTrust: 10,
    translation: {
      idle: 'A small win still counts.', happy: 'That counts.',
      sad: 'Small wins exist.', anxious: 'Something worked.', calm: 'A good small thing.', default: 'A small win still counts.',
    },
  },
  {
    sound: 'tail flick', category: 'happy', minTrust: 15,
    translation: {
      idle: 'Good enough.', happy: 'More than good.',
      sad: 'Enough for today.', anxious: 'Enough.', calm: 'More than enough.', default: 'Good enough.',
    },
  },
  // Lonely
  {
    sound: 'soft yip...', category: 'lonely', minTrust: 10,
    translation: {
      idle: 'It was quiet.', happy: 'A welcome quiet.',
      sad: 'Too quiet.', anxious: 'Unsettled quiet.', calm: 'A natural quiet.', default: 'It was quiet.',
    },
  },
  {
    sound: 'mmm...', category: 'lonely', minTrust: 5,
    translation: {
      idle: 'You took your time.', happy: 'Worth the wait.',
      sad: 'You took a long time.', anxious: 'I wondered.', calm: 'You arrived when you were ready.', default: 'You took your time.',
    },
  },
  {
    sound: 'low hrrm', category: 'lonely', minTrust: 15,
    translation: {
      idle: 'Still, you came back.', happy: 'You always come back.',
      sad: 'You still came back.', anxious: 'You found your way.', calm: 'And here you are.', default: 'Still, you came back.',
    },
  },
  // Rare
  {
    sound: 'slow huff', category: 'rare', minTrust: 60,
    translation: {
      idle: 'You do not always need an answer.', happy: 'Some things just are.',
      sad: 'You do not need an answer today.', anxious: 'Not every question needs answering.', calm: 'Some things are just known.', default: 'You do not always need an answer.',
    },
  },
  {
    sound: 'soft yip...', category: 'rare', minTrust: 75,
    translation: {
      idle: 'Some feelings do not need names.', happy: 'This one is nameless. That\'s fine.',
      sad: 'You don\'t have to name it.', anxious: 'Unnamed feelings are still real.', calm: 'No name needed.', default: 'Some feelings do not need names.',
    },
  },
  {
    sound: 'tail curl', category: 'rare', minTrust: 65,
    translation: {
      idle: 'You survived another day.', happy: 'More than survived.',
      sad: 'You survived. That is real.', anxious: 'Still here. That counts.', calm: 'Another day done.', default: 'You survived another day.',
    },
  },
  {
    sound: 'quiet gaze', category: 'rare', minTrust: 80,
    translation: {
      idle: 'I noticed more than you said.', happy: 'I saw the good in it.',
      sad: 'I noticed. You don\'t have to say more.', anxious: 'I noticed what you didn\'t say.', calm: 'I see it all.', default: 'I noticed more than you said.',
    },
  },
]

// ══════════════════════════════════════════════
// 词库路由器
// ══════════════════════════════════════════════
function getVocabulary(petId: PetId): CatWord[] {
  switch (petId) {
    case 'shiba': return SHIBA_VOCABULARY
    case 'white-fox': return WHITE_FOX_VOCABULARY
    default: return MOCHI_VOCABULARY
  }
}

// ── 上下文 → 类别映射 ─────────────────────────
function getMoodCategory(mood: Mood): CatCategory[] {
  switch (mood) {
    case 'happy': return ['happy', 'greeting']
    case 'sad': return ['comfort', 'lonely']
    case 'anxious': return ['anxious', 'comfort']
    case 'calm': return ['comfort', 'greeting']
    default: return ['greeting', 'comfort']
  }
}

export interface CatMessage {
  sound: string
  translation: string
  category: CatCategory
}

// ── 主函数：获取回应 ──────────────────────────
export function getCatResponse(
  petId: PetId,
  mood: Mood,
  trust: number,
  context: 'chat_reply' | 'greeting' | 'long_absence' | 'quest_complete' | 'level_up' | 'low_energy' | 'tap',
): CatMessage {
  const vocab = getVocabulary(petId)
  const available = vocab.filter(w => w.minTrust <= trust)

  const contextMap: Record<string, CatCategory[]> = {
    chat_reply: getMoodCategory(mood),
    greeting: ['greeting'],
    long_absence: ['lonely'],
    quest_complete: ['happy'],
    level_up: ['happy', 'rare'],
    low_energy: ['comfort'],
    tap: ['greeting', 'happy'],
  }

  const preferredCats = contextMap[context] || ['greeting']
let pool = available.filter(w => preferredCats.includes(w.category))

if (trust >= 60) {
  const rareWords = available.filter(w => w.category === 'rare')
  pool = [...pool, ...rareWords]
}

if (pool.length === 0) pool = available
if (pool.length === 0) pool = vocab
  //avoid for similiar error
  const chosen = pool[Math.floor(Math.random() * pool.length)]

  return {
    sound: chosen.sound,
    translation: chosen.translation[mood] || chosen.translation['default'] || '',
    category: chosen.category,
  }
}

// ── 获取组合回应（偶尔两个词）────────────────
export function getCombinedCatResponse(
  petId: PetId,
  mood: Mood,
  trust: number,
  context: 'chat_reply' | 'greeting' | 'long_absence' | 'quest_complete' | 'level_up' | 'low_energy' | 'tap',
): { sounds: string[]; translation: string } {
  const main = getCatResponse(petId, mood, trust, context)

  // 25% 概率加第二个短词
  if (Math.random() > 0.25) {
    return { sounds: [main.sound], translation: main.translation }
  }

  const vocab = getVocabulary(petId)
  const shorts = vocab.filter(
    w => w.minTrust <= trust && w.category === 'greeting' && w.sound.length < 8
  )

  if (shorts.length === 0) return { sounds: [main.sound], translation: main.translation }

  const second = shorts[Math.floor(Math.random() * shorts.length)]
  // 不重复同一个词
  if (second.sound === main.sound) return { sounds: [main.sound], translation: main.translation }

  return {
    sounds: [main.sound, second.sound],
    translation: main.translation,
  }
}
