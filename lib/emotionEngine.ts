export type Emotion = 'sad' | 'anxious' | 'angry' | 'happy' | 'calm' | 'default'

export function detectEmotion(text: string): Emotion {
  const t = text.toLowerCase()

  const sad    = ['sad','tired','exhausted','lonely','miss','cry','lost','hopeless','empty','heartbreak','烦','累','难过','伤心']
  const anx    = ['anxious','worry','stress','panic','overwhelm','nervous','scared','fear','uneasy','焦虑','担心','紧张']
  const ang    = ['angry','annoyed','frustrated','hate','rage','unfair','mad','furious','生气','愤怒']
  const hap    = ['happy','good','great','joy','love','excited','grateful','wonderful','amazing','smile','开心','高兴','好棒']
  const calm   = ['calm','peaceful','okay','fine','rest','quiet','still','relax','better','平静','还好','放松']

  const count  = (arr: string[]) => arr.filter(w => t.includes(w)).length
  const scores = {
    sad:     count(sad),
    anxious: count(anx),
    angry:   count(ang),
    happy:   count(hap),
    calm:    count(calm),
  }

  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]
  return top[1] > 0 ? (top[0] as Emotion) : 'default'
}

export function emotionToWorldChange(emotion: Emotion): Record<string, number> {
  const map: Record<Emotion, Record<string, number>> = {
    sad:     { fog: 0.6, rain: 0.5, moon: 0.3, flowers: 0   },
    anxious: { fog: 0.4, rain: 0.3, moon: 0.4, flowers: 0   },
    angry:   { fog: 0.2, rain: 0.7, moon: 0.2, flowers: 0   },
    happy:   { fog: 0,   rain: 0,   moon: 0.7, flowers: 1   },
    calm:    { fog: 0,   rain: 0,   moon: 0.9, flowers: 0.6 },
    default: { fog: 0.1, rain: 0,   moon: 0.6, flowers: 0   },
  }
  return map[emotion]
}

export function emotionToPetMood(emotion: Emotion): string {
  const map: Record<Emotion, string> = {
    sad:     'sad',
    anxious: 'anxious',
    angry:   'anxious',
    happy:   'happy',
    calm:    'calm',
    default: 'idle',
  }
  return map[emotion]
}