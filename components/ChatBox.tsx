'use client'

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { giveReward } from '@/lib/rewardSystem'
import { QUESTS, MOCHI_RESPONSES, PETS } from '@/data/pets'
import { useGame } from '@/lib/gameContext'
import { decideResponseMode } from '@/lib/responseEngine'
import { getCombinedCatResponse } from '@/lib/catLanguage'
import {
  playSendSound, playMochiReplySound,
  playHappySound, playSadSound, playAnxiousSound,
} from '@/lib/soundSystem'
import type { Reward } from '@/lib/rewardSystem'

interface Message {
  id: number
  text: string
  type: 'user' | 'mochi' | 'system' | 'cat'
  timestamp: number
  catSounds?: string[]          // 猫语音节
  catTrans?: string            // 猫语翻译
  showTrans?: boolean           // 翻译是否已显示
}

interface HistoryEntry { role: 'user' | 'mochi'; text: string }

interface Props {
  onEmotionDetected?: (emotion: string) => void
  onRewardGiven?: (reward: Reward) => void
  onMochiReply?: (text: string) => void
}

const STORAGE_KEY = 'mochi_chat_history'
const MAX_STORED_MSG = 50

function loadMessages(petName: string): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [{
      id: 0, text: `✨ ${petName} is listening...`,
      type: 'system', timestamp: Date.now(),
    }]
    const parsed = JSON.parse(raw) as Message[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [{
      id: 0, text: `✨ ${petName} is listening...`,
      type: 'system', timestamp: Date.now(),
    }]
  } catch {
    return [{ id: 0, text: `✨ ${petName} is listening...`, type: 'system', timestamp: Date.now() }]
  }
}

function saveMessages(messages: Message[]) {
  try {
    const toSave = messages.filter(m => m.type !== 'system').slice(-MAX_STORED_MSG)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch { }
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000)
  if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (diffDays === 1) return `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export default function ChatBox({ onEmotionDetected, onRewardGiven, onMochiReply }: Props) {
  const { state } = useGame()
  const activePet = PETS.find(p => p.id === state.activePet) || PETS[0]

  const [messages, setMessages] = useState<Message[]>(() => loadMessages(activePet.name))
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [quest, setQuest] = useState(QUESTS[0])
  const [showDate, setShowDate] = useState<number | null>(null)
  const [revealedTrans, setRevealedTrans] = useState<Set<number>>(new Set())

  const idRef = useRef(Date.now())
  const bottomRef = useRef<HTMLDivElement>(null)
  const sendTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const questRef = useRef<HTMLDivElement>(null)
  const msgListRef = useRef<HTMLDivElement>(null)
  const msgCountRef = useRef(0)
  const lastAIRef = useRef(-10)

  useEffect(() => { saveMessages(messages) }, [messages])
  useEffect(() => {
    const stored = messages
      .filter(m => m.type === 'user' || m.type === 'mochi')
      .slice(-6)
      .map(m => ({ role: m.type as 'user' | 'mochi', text: m.text }))
    setHistory(stored)
  }, [])

  useEffect(() => {
    if (questRef.current) {
      gsap.fromTo(questRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)', delay: 0.2 }
      )
    }
  }, [])

  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }, [messages])

  function addMsg(msg: Omit<Message, 'id' | 'timestamp'>) {
    const newMsg: Message = { ...msg, id: idRef.current++, timestamp: Date.now() }
    setMessages(prev => {
      const filtered = msg.type === 'user' ? prev.filter(m => m.type !== 'system') : prev
      const next = [...filtered, newMsg]
      setTimeout(() => {
        const msgs = msgListRef.current?.querySelectorAll('.msg-item')
        if (msgs && msgs.length > 0) {
          const last = msgs[msgs.length - 1] as HTMLElement
          const fromX = msg.type === 'user' ? 30 : msg.type === 'mochi' ? -30 : 0
          gsap.fromTo(last,
            { opacity: 0, x: fromX, scale: 0.92, y: 8 },
            { opacity: 1, x: 0, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
          )
        }
      }, 20)
      return next
    })
  }

  function rotateQuest() {
    if (!questRef.current) return
    gsap.to(questRef.current, {
      opacity: 0, y: -8, duration: 0.22, ease: 'power2.in',
      onComplete: () => {
        setQuest(QUESTS[Math.floor(Math.random() * QUESTS.length)])
        gsap.to(questRef.current, { opacity: 1, y: 0, duration: 0.3, ease: 'back.out(1.7)' })
      },
    })
  }

  // 点击猫语气泡揭示翻译
  function revealTranslation(msgId: number) {
    setRevealedTrans(prev => {
      const next = new Set(prev)
      next.add(msgId)
      return next
    })
    // 找到对应气泡做动画
    const el = document.getElementById(`cat-msg-${msgId}`)
    if (el) {
      gsap.fromTo(el, { scale: 0.97 }, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' })
    }
  }

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    playSendSound()
    setInput('')
    setLoading(true)

    addMsg({ text, type: 'user' })
    msgCountRef.current++

    // ── 决定用猫语还是 AI ──────────────────
    const currentMood = 'idle'  // 从父组件获取，这里用默认值
    const decision = decideResponseMode(
      text,
      currentMood,
      state.trust,
      activePet.id,          // ← 加这个
      msgCountRef.current,
      lastAIRef.current,
    )

    if (decision.useCatLanguage && decision.catResponse) {
      // ── 猫语回应（本地，80%）────────────
      setTimeout(() => {
        addMsg({
          type: 'cat',
          text: decision.catResponse!.sounds.join('  '),
          catSounds: decision.catResponse!.sounds,
          catTrans: decision.catResponse!.translation,
          showTrans: false,
        })
        playMochiReplySound()
        onMochiReply?.(decision.catResponse!.translation)
        setLoading(false)
        rotateQuest()
      }, 600 + Math.random() * 400)  // 轻微延迟，像真的在思考

    } else {
      // ── AI 回应（Gemini，20%）────────────
      lastAIRef.current = msgCountRef.current
      const newHistory = [...history, { role: 'user' as const, text }]

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, history: newHistory.slice(-6) }),
        })
        const data = await res.json()

        if (data.rateLimited) {
          // 限流时用猫语兜底
          const fallback = getCombinedCatResponse(activePet.id, 'idle', state.trust, 'chat_reply')
          addMsg({ type: 'cat', text: fallback.sounds.join('  '), catSounds: fallback.sounds, catTrans: fallback.translation })
        } else {
          const emotion = data.emotion || 'default'
          const reply = data.reply
            || MOCHI_RESPONSES[emotion]?.[Math.floor(Math.random() * (MOCHI_RESPONSES[emotion]?.length || 1))]
            || MOCHI_RESPONSES.default[0]

          setHistory([...newHistory, { role: 'mochi', text: reply }])
          addMsg({ text: reply, type: 'mochi' })
          onMochiReply?.(reply)

          if (emotion === 'happy') playHappySound()
          else if (emotion === 'sad') playSadSound()
          else if (emotion === 'anxious') playAnxiousSound()
          else playMochiReplySound()

          onEmotionDetected?.(emotion)
          onRewardGiven?.(giveReward(emotion as any))
        }
      } catch {
        const { detectEmotion } = await import('@/lib/emotionEngine')
        const emotion = detectEmotion(text)
        const list = MOCHI_RESPONSES[emotion] ?? MOCHI_RESPONSES.default
        const reply = list[Math.floor(Math.random() * list.length)]
        setHistory([...newHistory, { role: 'mochi', text: reply }])
        addMsg({ text: reply, type: 'mochi' })
        onMochiReply?.(reply)
        onEmotionDetected?.(emotion)
        onRewardGiven?.(giveReward(emotion as any))
      }

      setLoading(false)
      rotateQuest()
    }
  }

  function handleSendDebounced() {
    if (sendTimeoutRef.current) clearTimeout(sendTimeoutRef.current)
    sendTimeoutRef.current = setTimeout(sendMessage, 300)
  }

  function handleSendClick(e: React.MouseEvent<HTMLButtonElement>) {
    gsap.fromTo(e.currentTarget,
      { scale: 0.85, rotation: -10 },
      { scale: 1, rotation: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' }
    )
    handleSendDebounced()
  }

  function clearHistory() {
    localStorage.removeItem(STORAGE_KEY)
    setMessages([{ id: idRef.current++, text: `✨ ${activePet.name} is listening...`, type: 'system', timestamp: Date.now() }])
    setHistory([])
  }

  function shouldShowDateSep(curr: Message, prev?: Message): boolean {
    if (!prev) return true
    return new Date(curr.timestamp).toDateString() !== new Date(prev.timestamp).toDateString()
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', gap: '12px', boxSizing: 'border-box',
    }}>

      {/* Quest 卡片 */}
      <div ref={questRef} className="quest-card" style={{ flexShrink: 0 }}>
        <div className="quest-icon">🌙</div>
        <div className="quest-body">
          <div className="quest-label">✦ Today's Quest</div>
          <div className="quest-text">{quest}</div>
          <div className="quest-reward">
            <span className="reward-chip">⚡ +25 EXP</span>
            <span className="reward-chip" style={{
              color: 'var(--cyan)', borderColor: 'rgba(96,165,250,0.35)',
              background: 'rgba(96,165,250,0.12)',
            }}>
              💙 +8 Trust
            </span>
          </div>
        </div>
      </div>

      {/* 聊天区 */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0,
        background: 'linear-gradient(135deg, rgba(168,85,247,0.06), rgba(96,165,250,0.04))',
        border: '1.5px solid rgba(168,85,247,0.15)',
        borderRadius: '20px', padding: '14px', gap: '10px', boxSizing: 'border-box',
      }}>

        {/* 顶部栏 */}
        {messages.filter(m => m.type !== 'system').length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(140,120,180,0.5)', letterSpacing: '0.06em' }}>
              {messages.filter(m => m.type !== 'system').length} messages saved
            </span>
            <button onClick={clearHistory} style={{
              background: 'none', border: '1px solid rgba(168,85,247,0.15)',
              borderRadius: '8px', padding: '2px 8px', fontSize: '10px',
              fontWeight: 700, color: 'rgba(140,120,180,0.5)', cursor: 'pointer',
            }}>
              Clear
            </button>
          </div>
        )}

        {/* 消息列表 */}
        <div ref={msgListRef} style={{
          flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
          gap: '6px', minHeight: 0, paddingRight: '4px',
        }}>
          {messages.map((m, i) => {
            const prev = messages[i - 1]
            const showDateSep = shouldShowDateSep(m, prev)
            const transShown = revealedTrans.has(m.id)

            return (
              <div key={m.id} className="msg-item">
                {/* 日期分隔 */}
                {showDateSep && m.type !== 'system' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0 4px' }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(168,85,247,0.1)' }} />
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(140,120,180,0.45)', whiteSpace: 'nowrap' }}>
                      {new Date(m.timestamp).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(168,85,247,0.1)' }} />
                  </div>
                )}

                {/* 猫语消息 */}
                {m.type === 'cat' ? (
                  <div
                    id={`cat-msg-${m.id}`}
                    onClick={() => !transShown && revealTranslation(m.id)}
                    style={{
                      alignSelf: 'flex-start',
                      maxWidth: '80%',
                      cursor: transShown ? 'default' : 'pointer',
                    }}
                  >
                    {/* 猫语气泡 */}
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(96,165,250,0.08))',
                      border: '1px solid rgba(168,85,247,0.2)',
                      borderRadius: '16px 16px 16px 4px',
                      padding: '8px 12px',
                      display: 'inline-flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}>
                      {/* 猫语文字 */}
                      <div style={{
                        fontFamily: "'Fredoka One', cursive",
                        fontSize: '14px',
                        color: 'rgba(200,180,255,0.95)',
                        letterSpacing: '0.02em',
                      }}>
                        {m.catSounds?.join('  ') || m.text}
                      </div>

                      {/* 翻译 — 点击后显示 */}
                      {transShown && m.catTrans ? (
                        <div style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: 'rgba(180,160,220,0.75)',
                          fontStyle: 'italic',
                          borderTop: '1px solid rgba(168,85,247,0.15)',
                          paddingTop: '4px',
                          animation: 'fadeIn 0.3s ease',
                        }}>
                          {m.catTrans}
                        </div>
                      ) : (
                        <div style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          color: 'rgba(168,85,247,0.4)',
                          fontStyle: 'italic',
                        }}>
                          tap to translate ✦
                        </div>
                      )}
                    </div>
                  </div>

                ) : (
                  /* 普通消息 */
                  <div
                    className={`msg ${m.type}`}
                    onClick={() => setShowDate(showDate === m.id ? null : m.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {m.type === 'mochi' ? m.text.replace('🐱', activePet.emoji) : m.text}
                  </div>
                )}

                {/* 时间戳 */}
                {showDate === m.id && m.type !== 'system' && (
                  <div style={{
                    fontSize: '10px', fontWeight: 600, color: 'rgba(140,120,180,0.45)',
                    textAlign: m.type === 'user' ? 'right' : 'left', padding: '0 4px', marginTop: '-2px',
                  }}>
                    {formatTime(m.timestamp)}
                  </div>
                )}
              </div>
            )
          })}

          {loading && (
            <div className="msg mochi">
              <div className="loading-dots"><span /><span /><span /></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* 输入框 */}
        <div className="chat-input-row" style={{ flexShrink: 0 }}>
          <textarea
            className="chat-input"
            value={input}
            placeholder={`Tell ${activePet.name} how you're feeling... 🌸`}
            rows={1}
            onChange={e => setInput(e.currentTarget.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendDebounced() }
            }}
            onInput={e => {
              const el = e.currentTarget
              el.style.height = 'auto'
              el.style.height = Math.min(el.scrollHeight, 120) + 'px'
            }}
          />
          <button className="send-btn" onClick={handleSendClick} disabled={loading || !input.trim()}>
            ↑
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(3px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0; }
        }
      `}</style>
    </div>
  )
}