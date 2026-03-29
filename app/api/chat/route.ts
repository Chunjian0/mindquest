import { NextRequest, NextResponse } from 'next/server'

interface HistoryMessage {
  role: string
  text: string
}

type QueueItem = {
  req: NextRequest
  resolve: (value: NextResponse) => void
}

const queue: QueueItem[] = []
let processing = false

async function processQueue() {
  if (processing || queue.length === 0) return
  processing = true

  const item = queue.shift()!
  const req  = item.req

  try {
    const { text, history = [] } = await req.json()

    const usedResponses = (history as HistoryMessage[])
      .filter(m => m.role === 'mochi')
      .map(m => m.text)
      .slice(-3)
      .join(' | ')

    // ── 新 system prompt：同时返回 emotion + reply ──
    const systemPrompt = `You are Mochi, a mystical cat companion in an emotional support app. 

RESPONSE FORMAT (strict JSON only, no markdown):
{
  "emotion": "happy|sad|anxious|angry|calm|default",
  "reply": "your 1-2 sentence response"
}

EMOTION DETECTION RULES:
- Detect the TRUE emotional state from full context, not just keywords
- "I'm not happy" = sad, NOT happy
- "I used to be fine" = sad/default, NOT fine
- Consider negations, sarcasm, and context
- Emotions: happy (joy/excitement/gratitude), sad (grief/loneliness/loss), anxious (worry/stress/fear), angry (frustration/rage/unfair), calm (peaceful/relaxed/okay), default (neutral/unclear)

REPLY RULES:
- Always third person: "Mochi felt/sensed/noticed..."
- 1-2 sentences only
- Never say "I understand" or "That sounds hard"
- Never ask questions, never give advice
- Be poetic and specific, not generic
- Vary style — avoid repeating: ${usedResponses || 'none'}

Emotion styles:
- sad: quiet presence, heavy air
- anxious: restless but grounding  
- angry: steps back but stays nearby
- happy: physically brightens, tail up
- calm: stillness, soft world
- default: quiet listening presence`

    const contents = [
      ...(history as HistoryMessage[]).map(msg => ({
        role:  msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })),
      { role: 'user', parts: [{ text }] },
    ]

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            maxOutputTokens: 120,
            temperature:     0.88,
            topP:            0.95,
          },
        }),
      }
    )

    const data    = await res.json()
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''

    // 解析 JSON 响应
    let reply:   string = ''
    let emotion: string = 'default'

    try {
      // 去掉可能的 markdown 代码块
      const cleaned = rawText.replace(/```json|```/g, '').trim()
      const parsed  = JSON.parse(cleaned)
      reply   = parsed.reply   || ''
      emotion = parsed.emotion || 'default'
    } catch {
      // 如果 Gemini 没有返回 JSON，fallback 到纯文字
      reply   = rawText
      emotion = 'default'
    }

    item.resolve(NextResponse.json({ reply, emotion }))

  } catch (err) {
    console.error(err)
    item.resolve(NextResponse.json({ reply: null, emotion: 'default' }))
  } finally {
    processing = false
    if (queue.length > 0) processQueue()
  }
}

export async function POST(req: NextRequest) {
  return new Promise<NextResponse>((resolve) => {
    queue.push({ req, resolve })
    processQueue()
  })
}