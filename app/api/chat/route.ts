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
  const req = item.req

  try {
    const { text, history = [] } = await req.json()

    const usedResponses = (history as HistoryMessage[])
      .filter(m => m.role === 'mochi')
      .map(m => m.text)
      .slice(-3)
      .join(' | ')

    const systemPrompt = `
You are Mochi, a mystical emotional companion cat.

RESPONSE FORMAT (strict JSON only):
{
  "emotion": "happy|sad|anxious|angry|calm|default",
  "reply": "your reply"
}

EMOTION RULES:
- Detect actual emotional meaning, not keyword only
- "I'm not happy" = sad
- "I used to be okay" = sad/default depending context
- Consider negation and emotional tone

REPLY RULES:
- Respond to what the user actually said
- Sound emotionally connected
- 1-2 short sentences only
- Keep Mochi personality: gentle, quiet, observant
- Avoid generic poetic lines
- Avoid repeating previous styles: ${usedResponses || 'none'}
- No long advice
- No robotic comfort phrases
- Third person optional, not required

STYLE:
- sad = soft and nearby
- anxious = grounding but light
- angry = calm distance but staying present
- happy = brighter and warm
- calm = gentle quiet
- default = natural listening
`

    const contents = [
      ...(history as HistoryMessage[]).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })),
      { role: 'user', parts: [{ text }] },
    ]

    const controller = new AbortController()
    setTimeout(() => controller.abort(), 10000)

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents,
          generationConfig: {
            maxOutputTokens: 120,
            temperature: 0.72,
            topP: 0.9,
          },
        }),
      }
    )

    const data = await res.json()
    const rawText =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''

    let reply = ''
    let emotion = 'default'

    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      const cleaned = jsonMatch ? jsonMatch[0] : rawText

      const parsed = JSON.parse(cleaned)

      reply = parsed.reply || ''
      emotion = parsed.emotion || 'default'
    } catch {
      reply = rawText
      emotion = 'default'
    }

    item.resolve(
      NextResponse.json({
        reply,
        emotion,
      })
    )
  } catch (err) {
    console.error(err)

    item.resolve(
      NextResponse.json({
        reply: null,
        emotion: 'default',
      })
    )
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