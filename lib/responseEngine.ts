import { getCombinedCatResponse } from './catLanguage'

interface ResponseDecision {
  useCatLanguage: boolean   // true = 猫语（本地），false = AI
  catResponse?:   { sounds: string[]; translation: string }
  reason:         string
}

// 判断是否用猫语还是 AI
export function decideResponseMode(
  text:        string,
  mood:        string,
  trust:       number,
  msgCount:    number,   // 本次会话消息数
  lastAIUsed:  number,   // 上次用 AI 是第几条消息
): ResponseDecision {

  // ── 强制用猫语的情况（本地处理）────────────
  // 1. 打招呼/简短互动
  const isGreeting = /^(hi|hello|hey|哈|你好|在吗|meow|mochi|嗨|晚安|早安|good morning|good night|goodnight|goodmorning)[\s!！?？.。]*$/i.test(text.trim())
  if (isGreeting) {
    return {
      useCatLanguage: true,
      catResponse:    getCombinedCatResponse(mood, trust, 'greeting'),
      reason:         'greeting',
    }
  }

  // 2. 极短输入（少于 5 个字）
  if (text.trim().length < 5) {
    return {
      useCatLanguage: true,
      catResponse:    getCombinedCatResponse(mood, trust, 'tap'),
      reason:         'too_short',
    }
  }

  // 3. 前几条消息用猫语暖场（建立感情再接 AI）
  if (msgCount <= 2) {
    return {
      useCatLanguage: true,
      catResponse:    getCombinedCatResponse(mood, trust, 'chat_reply'),
      reason:         'early_warmup',
    }
  }

  // 4. 刚用过 AI（相邻消息），轮到猫语
  if (msgCount - lastAIUsed <= 1) {
    return {
      useCatLanguage: true,
      catResponse:    getCombinedCatResponse(mood, trust, 'chat_reply'),
      reason:         'ai_cooldown',
    }
  }

  // 5. 简单情绪表达（不需要 AI 回应）
  const simpleEmotions = /^(好累|好烦|开心|好开心|难过|ugh|sigh|hmm|idk|不知道|随便|还好|还行|ok|okay)[\s!！?？.。]*$/i.test(text.trim())
  if (simpleEmotions) {
    return {
      useCatLanguage: true,
      catResponse:    getCombinedCatResponse(mood, trust, 'chat_reply'),
      reason:         'simple_emotion',
    }
  }

  // ── 20% 用 AI 的情况 ─────────────────────
  // 复杂情绪、具体事件、需要回应的内容
  const needsAI = (
    text.length > 20 ||                           // 较长的输入
    text.includes('because') ||
    text.includes('because') ||
    text.includes('因为') ||
    text.includes('所以') ||
    text.includes('但是') ||
    text.includes('我觉得') ||
    text.includes('今天') ||
    text.includes('发生了') ||
    /[.。！!?？]{2,}/.test(text)                  // 强烈情绪标点
  )

  if (needsAI) {
    return { useCatLanguage: false, reason: 'complex_input' }
  }

  // 默认：随机 80/20
  const useLocal = Math.random() < 0.8
  return {
    useCatLanguage: useLocal,
    catResponse:    useLocal
      ? getCombinedCatResponse(mood, trust, 'chat_reply')
      : undefined,
    reason: useLocal ? 'random_local' : 'random_ai',
  }
}