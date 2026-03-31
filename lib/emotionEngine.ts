export type Emotion = 'sad' | 'anxious' | 'angry' | 'happy' | 'calm' | 'default'

export function detectEmotion(text: string): Emotion {
  const t = text.toLowerCase()

  // ── negation first (highest priority) ──
  if (
    t.includes('not happy') ||
    t.includes("don't feel good") ||
    t.includes('not okay') ||
    t.includes('not fine') ||
    t.includes('not good') ||
    t.includes('不好') ||
    t.includes('不开心')
  ) {
    return 'sad'
  }

  // ── emotion keyword groups ──
  const sad = [
    'sad','tired','exhausted','lonely','miss','cry','lost',
    'hopeless','empty','heartbreak','depressed','hurt',
    '烦','累','难过','伤心','失望','空虚','无助'
  ]

  const anxious = [
    'anxious','worry','stress','panic','overwhelm','nervous',
    'scared','fear','uneasy','afraid','pressure',
    '焦虑','担心','紧张','害怕','压力'
  ]

  const angry = [
    'angry','annoyed','frustrated','hate','rage','unfair',
    'mad','furious','irritated',
    '生气','愤怒','烦死了','不爽'
  ]

  const happy = [
    'happy','great','joy','love','excited','grateful',
    'wonderful','amazing','smile','proud',
    '开心','高兴','好棒','幸福'
  ]

  const calm = [
    'calm','peaceful','rest','quiet','still','relax',
    'better','stable',
    '平静','还好','放松','舒服'
  ]

  // ── count keyword matches ──
  const count = (arr: string[]) => arr.filter(w => t.includes(w)).length

  const scores = {
    sad: count(sad),
    anxious: count(anxious),
    angry: count(angry),
    happy: count(happy),
    calm: count(calm),
  }

  // ── avoid "good/fine/okay" stealing meaning ──
  if (t === 'fine' || t === 'okay' || t === 'ok') {
    return 'calm'
  }

  // ── sort top score ──
  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]

  return top[1] > 0 ? (top[0] as Emotion) : 'default'
}

export function emotionToWorldChange(emotion: Emotion): Record<string, number> {
  const map: Record<Emotion, Record<string, number>> = {
    sad:     { fog: 0.6, rain: 0.5, moon: 0.3, flowers: 0 },
    anxious: { fog: 0.4, rain: 0.3, moon: 0.4, flowers: 0 },
    angry:   { fog: 0.2, rain: 0.7, moon: 0.2, flowers: 0 },
    happy:   { fog: 0, rain: 0, moon: 0.7, flowers: 1 },
    calm:    { fog: 0, rain: 0, moon: 0.9, flowers: 0.6 },
    default: { fog: 0.1, rain: 0, moon: 0.6, flowers: 0 },
  }

  return map[emotion]
}

export function emotionToPetMood(
  emotion: Emotion
): 'sad' | 'anxious' | 'happy' | 'calm' | 'idle' {
  const map: Record<Emotion, 'sad' | 'anxious' | 'happy' | 'calm' | 'idle'> = {
    sad: 'sad',
    anxious: 'anxious',
    angry: 'anxious',
    happy: 'happy',
    calm: 'calm',
    default: 'idle',
  }

  return map[emotion]
}