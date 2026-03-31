import { getCombinedCatResponse, type Mood, PetId } from './catLanguage'

interface ResponseDecision {
  useCatLanguage: boolean
  catResponse?:   { sounds: string[]; translation: string }
  reason:         string
}

// 判断文字是否包含真实情绪内容
function hasEmotionalContent(text: string): boolean {
  const emotionKeywords = [
    // 中文
    '因为','所以','但是','不过','觉得','感觉','今天','昨天','最近','一直',
    '好累','好烦','开心','难过','害怕','担心','生气','伤心','孤独','失落',
    '压力','焦虑','紧张','兴奋','期待','失望','后悔','想念','无聊','烦恼',
    '发生了','遇到','碰到','经历','没想到','没想到','真的','其实','一直都',
    // 英文
    'because','since','although','but','however','feel','feeling','felt',
    'today','yesterday','lately','recently','always','never','sometimes',
    'really','actually','honestly','I\'m','I am','I was','I\'ve',
    'happy','sad','angry','tired','anxious','worried','scared','excited',
    'stressed','overwhelmed','lonely','confused','lost','hurt','upset',
    'happened','going through','dealing with','struggling','can\'t stop',
    'I think','I believe','I wish','I hope','I hate','I love','I miss',
  ]

  const lower = text.toLowerCase()
  return emotionKeywords.some(kw => lower.includes(kw))
}

// 判断是否是简短的情绪词（不需要 AI 回应）
function isSimpleEmotionWord(text: string): boolean {
  const simple = /^(好累|好烦|开心|好开心|难过|ugh|sigh|hmm|idk|不知道|随便|还好|还行|ok|okay|tired|sad|happy|fine|meh|whatever|sure)[\s!！?？.。~]*$/i
  return simple.test(text.trim())
}

// 判断是否是打招呼
function isGreeting(text: string): boolean {
  const greeting = /^(hi|hello|hey|哈|你好|在吗|meow|woof|yip|mochi|shiba|嗨|晚安|早安|good morning|good night|goodnight|goodmorning|sup|yo|hiya)[\s!！?？.。~]*$/i
  return greeting.test(text.trim())
}

export function decideResponseMode(
  text:       string,
  mood:       Mood,
  trust:      number,
  petId:      PetId,
  msgCount:   number,
  lastAIUsed: number,
): ResponseDecision {

  const trimmed = text.trim()

  // ── 1. 打招呼 → 永远猫语 ─────────────────
  if (isGreeting(trimmed)) {
    return {
      useCatLanguage: true,
      catResponse:    getCombinedCatResponse(petId, mood, trust, 'greeting'),
      reason:         'greeting',
    }
  }

  // ── 2. 极短（< 4字）→ 猫语 ───────────────
  if (trimmed.length < 4 && !hasEmotionalContent(trimmed)) {
    return {
      useCatLanguage: true,
      catResponse:    getCombinedCatResponse(petId, mood, trust, 'tap'),
      reason:         'too_short',
    }
  }

  // ── 3. 简单情绪词 → 猫语 ─────────────────
  if (isSimpleEmotionWord(trimmed)) {
    return {
      useCatLanguage: true,
      catResponse:    getCombinedCatResponse(petId, mood, trust, 'chat_reply'),
      reason:         'simple_emotion',
    }
  }

  // ── 4. 有真实情绪内容 → AI ───────────────
  // 这是关键改动：只要有情绪内容，优先给 AI 回应
  if (hasEmotionalContent(trimmed)) {
    return { useCatLanguage: false, reason: 'emotional_content' }
  }

  // ── 5. 长文字（> 15字）→ AI ──────────────
  if (trimmed.length > 15) {
    return { useCatLanguage: false, reason: 'long_input' }
  }

  // ── 6. 前两条消息 → 猫语暖场 ─────────────
  if (msgCount <= 2) {
    return {
      useCatLanguage: true,
      catResponse:    getCombinedCatResponse(petId, mood, trust, 'chat_reply'),
      reason:         'early_warmup',
    }
  }

  // ── 7. AI 刚用过（冷却）→ 猫语 ───────────
  if (msgCount - lastAIUsed <= 1) {
    return {
      useCatLanguage: true,
      catResponse:    getCombinedCatResponse(petId, mood, trust, 'chat_reply'),
      reason:         'ai_cooldown',
    }
  }

  // ── 8. 其余情况：70% 猫语 / 30% AI ───────
  // 比原来 80/20 更倾向 AI
  const useLocal = Math.random() < 0.7
  return {
    useCatLanguage: useLocal,
    catResponse:    useLocal
      ? getCombinedCatResponse(petId, mood, trust, 'chat_reply')
      : undefined,
    reason: useLocal ? 'random_local' : 'random_ai',
  }
}