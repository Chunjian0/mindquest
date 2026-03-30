import { getCombinedCatResponse, PetId } from './catLanguage'

interface ResponseDecision {
  useCatLanguage: boolean
  catResponse?:   { sounds: string[]; translation: string }
  reason:         string
}

export function decideResponseMode(
  text:       string,
  mood:       string,
  trust:      number,
  petId:      PetId,
  msgCount:   number,
  lastAIUsed: number,
): ResponseDecision {

  // 强制猫语：打招呼
  const isGreeting = /^(hi|hello|hey|哈|你好|在吗|meow|woof|yip|mochi|shiba|nala|嗨|晚安|早安|good morning|good night|goodnight|goodmorning)[\s!！?？.。]*$/i.test(text.trim())
  if (isGreeting) {
    return {
      useCatLanguage: true,
      catResponse:    getCombinedCatResponse(petId, mood, trust, 'greeting'),
      reason:         'greeting',
    }
  }

  // 强制猫语：极短输入
  if (text.trim().length < 5) {
    return {
      useCatLanguage: true,
      catResponse:    getCombinedCatResponse(petId, mood, trust, 'tap'),
      reason:         'too_short',
    }
  }

  // 强制猫语：前两条消息暖场
  if (msgCount <= 2) {
    return {
      useCatLanguage: true,
      catResponse:    getCombinedCatResponse(petId, mood, trust, 'chat_reply'),
      reason:         'early_warmup',
    }
  }

  // 强制猫语：AI 刚用过
  if (msgCount - lastAIUsed <= 1) {
    return {
      useCatLanguage: true,
      catResponse:    getCombinedCatResponse(petId, mood, trust, 'chat_reply'),
      reason:         'ai_cooldown',
    }
  }

  // 强制猫语：简单情绪词
  const simpleEmotions = /^(好累|好烦|开心|好开心|难过|ugh|sigh|hmm|idk|不知道|随便|还好|还行|ok|okay|tired|sad|happy|fine|idk)[\s!！?？.。]*$/i.test(text.trim())
  if (simpleEmotions) {
    return {
      useCatLanguage: true,
      catResponse:    getCombinedCatResponse(petId, mood, trust, 'chat_reply'),
      reason:         'simple_emotion',
    }
  }

  // 需要 AI：复杂输入
  const needsAI = (
    text.length > 20 ||
    text.includes('because') || text.includes('因为') ||
    text.includes('所以')     || text.includes('但是') ||
    text.includes('我觉得')   || text.includes('今天') ||
    text.includes('发生了')   || text.includes('想说') ||
    /[.。！!?？]{2,}/.test(text)
  )

  if (needsAI) return { useCatLanguage: false, reason: 'complex_input' }

  // 随机 80/20
  const useLocal = Math.random() < 0.8
  return {
    useCatLanguage: useLocal,
    catResponse:    useLocal
      ? getCombinedCatResponse(petId, mood, trust, 'chat_reply')
      : undefined,
    reason: useLocal ? 'random_local' : 'random_ai',
  }
}