'use client'

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { giveReward } from '@/lib/rewardSystem'
import { QUESTS, MOCHI_RESPONSES, PETS } from '@/data/pets'
import { useGame } from '@/lib/gameContext'
import type { Reward } from '@/lib/rewardSystem'
import {
  playSendSound,
  playMochiReplySound,
  playHappySound,
  playSadSound,
  playAnxiousSound,
  initAudio,
} from '@/lib/soundSystem'


interface Message {
  id: number
  text: string
  type: 'user' | 'mochi' | 'system'
  timestamp: number
}

interface HistoryEntry { role: 'user' | 'mochi'; text: string }

interface Props {
  onEmotionDetected?: (emotion: string) => void
  onRewardGiven?: (reward: Reward) => void
  onMochiReply?: (text: string) => void
}

const STORAGE_KEY = 'mochi_chat_history'
const MAX_STORED_MSG = 50   // 最多保存 50 条消息

// 读取持久化消息
function loadMessages(petName: string): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [{ id: 0, text: `✨ ${petName} is listening...`, type: 'system', timestamp: Date.now() }]
    const parsed = JSON.parse(raw) as Message[]
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [{ id: 0, text: `✨ ${petName} is listening...`, type: 'system', timestamp: Date.now() }]
    }
    return parsed
  } catch {
    return [{ id: 0, text: `✨ ${petName} is listening...`, type: 'system', timestamp: Date.now() }]
  }
}

// 保存消息到 localStorage
function saveMessages(messages: Message[]) {
  try {
    // 只保留最新的 MAX_STORED_MSG 条，去掉 system 消息
    const toSave = messages
      .filter(m => m.type !== 'system')
      .slice(-MAX_STORED_MSG)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch { /* storage full */ }
}

// 格式化时间显示
function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000)

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    return `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
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

  const idRef = useRef(Date.now())
  const bottomRef = useRef<HTMLDivElement>(null)
  const sendTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const questRef = useRef<HTMLDivElement>(null)
  const msgListRef = useRef<HTMLDivElement>(null)

  // 消息变化时保存
  useEffect(() => {
    saveMessages(messages)
  }, [messages])

  // 从历史恢复 history array（用于 API 上下文）
  useEffect(() => {
    const stored = messages
      .filter(m => m.type === 'user' || m.type === 'mochi')
      .slice(-6)
      .map(m => ({ role: m.type as 'user' | 'mochi', text: m.text }))
    setHistory(stored)
  }, [])

  // quest 进场
  useEffect(() => {
    if (questRef.current) {
      gsap.fromTo(questRef.current,
        { opacity: 0, y: -16, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 0.2 }
      )
    }
  }, [])

  // 滚到底部
  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }, [messages])

  function addMsg(text: string, type: Message['type']) {
    const newMsg: Message = {
      id: idRef.current++,
      text,
      type,
      timestamp: Date.now(),
    }

    setMessages(prev => {
      const filtered = type === 'user'
        ? prev.filter(m => m.type !== 'system')
        : prev
      const next = [...filtered, newMsg]

      // 新消息进场动画
      setTimeout(() => {
        const msgs = msgListRef.current?.querySelectorAll('.msg')
        if (msgs && msgs.length > 0) {
          const last = msgs[msgs.length - 1] as HTMLElement
          const fromX = type === 'user' ? 30 : type === 'mochi' ? -30 : 0
          gsap.fromTo(last,
            { opacity: 0, x: fromX, scale: 0.92, y: 8 },
            {
              opacity: 1, x: 0, scale: 1, y: 0,
              duration: 0.4, ease: 'back.out(1.7)'
            }
          )
        }
      }, 20)

      return next
    })
  }

  function rotateQuest() {
    if (!questRef.current) return
    gsap.to(questRef.current, {
      opacity: 0, y: -8, scale: 0.96, duration: 0.22, ease: 'power2.in',
      onComplete: () => {
        setQuest(QUESTS[Math.floor(Math.random() * QUESTS.length)])
        gsap.to(questRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.7)' })
      },
    })
  }

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    playSendSound()

    setInput('')
    setLoading(true)
    addMsg(text, 'user')

    const newHistory = [...history, { role: 'user' as const, text }]

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 不再从前端传 emotion，让 Gemini 自己检测
        body: JSON.stringify({ text, history: newHistory.slice(-6) }),
      })
      const data = await res.json()

      if (data.rateLimited) {
        addMsg(`${activePet.name} needs a moment to rest... try again in a minute 🌙`, 'system')
      } else {
        // ── 使用 Gemini 返回的 emotion ──────────
        const emotion = data.emotion || 'default'
        const reply = data.reply
          || MOCHI_RESPONSES[emotion]?.[Math.floor(Math.random() * (MOCHI_RESPONSES[emotion]?.length || 1))]
          || MOCHI_RESPONSES.default[0]

        const updatedHistory = [...newHistory, { role: 'mochi' as const, text: reply }]
        setHistory(updatedHistory)
        addMsg(reply, 'mochi')
        onMochiReply?.(reply)
        if (emotion === 'happy') playHappySound()
        else if (emotion === 'sad') playSadSound()
        else if (emotion === 'anxious') playAnxiousSound()
        else playMochiReplySound()

        onEmotionDetected?.(emotion)
        onRewardGiven?.(giveReward(emotion as any))
      }
    } catch {
      // fallback 本地检测
      const { detectEmotion } = await import('@/lib/emotionEngine')
      const emotion = detectEmotion(text)
      const list = MOCHI_RESPONSES[emotion] ?? MOCHI_RESPONSES.default
      const reply = list[Math.floor(Math.random() * list.length)]
      setHistory([...newHistory, { role: 'mochi', text: reply }])
      addMsg(reply, 'mochi')
      onMochiReply?.(reply)
      onEmotionDetected?.(emotion)
      onRewardGiven?.(giveReward(emotion as any))
    }

    rotateQuest()
    setLoading(false)
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

  // 清空历史
  function clearHistory() {
    localStorage.removeItem(STORAGE_KEY)
    setMessages([{ id: idRef.current++, text: `✨ ${activePet.name} is listening...`, type: 'system', timestamp: Date.now() }])
    setHistory([])
  }

  // 判断是否显示日期分隔线
  function shouldShowDateSep(curr: Message, prev?: Message): boolean {
    if (!prev) return true
    const d1 = new Date(curr.timestamp).toDateString()
    const d2 = new Date(prev.timestamp).toDateString()
    return d1 !== d2
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      gap: '12px',
      boxSizing: 'border-box',
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
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        background: 'linear-gradient(135deg, rgba(168,85,247,0.06), rgba(96,165,250,0.04))',
        border: '1.5px solid rgba(168,85,247,0.15)',
        borderRadius: '20px',
        padding: '14px',
        gap: '10px',
        boxSizing: 'border-box',
      }}>

        {/* 顶部：历史记录提示 + 清空按钮 */}
        {messages.filter(m => m.type !== 'system').length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              color: 'rgba(140,120,180,0.5)',
              letterSpacing: '0.06em',
            }}>
              {messages.filter(m => m.type !== 'system').length} messages saved
            </span>
            <button
              onClick={clearHistory}
              style={{
                background: 'none',
                border: '1px solid rgba(168,85,247,0.15)',
                borderRadius: '8px',
                padding: '2px 8px',
                fontSize: '10px',
                fontWeight: 700,
                color: 'rgba(140,120,180,0.5)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.15 })}
              onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.15 })}
            >
              Clear history
            </button>
          </div>
        )}

        {/* 消息列表 */}
        <div
          ref={msgListRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            minHeight: 0,
            paddingRight: '4px',
          }}
        >
          {messages.map((m, i) => {
            const prev = messages[i - 1]
            const showDateSep = shouldShowDateSep(m, prev)

            return (
              <div key={m.id}>
                {/* 日期分隔线 */}
                {showDateSep && m.type !== 'system' && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    margin: '8px 0 4px',
                  }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(168,85,247,0.1)' }} />
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      color: 'rgba(140,120,180,0.45)',
                      whiteSpace: 'nowrap',
                    }}>
                      {new Date(m.timestamp).toLocaleDateString([], {
                        weekday: 'short', month: 'short', day: 'numeric'
                      })}
                    </span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(168,85,247,0.1)' }} />
                  </div>
                )}

                {/* 消息气泡 */}
                <div
                  className={`msg ${m.type}`}
                  onClick={() => setShowDate(showDate === m.id ? null : m.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {m.type === 'mochi'
                    ? m.text.replace('🐱', activePet.emoji)
                    : m.text}
                </div>

                {/* 点击消息显示时间 */}
                {showDate === m.id && m.type !== 'system' && (
                  <div style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: 'rgba(140,120,180,0.45)',
                    textAlign: m.type === 'user' ? 'right' : 'left',
                    padding: '0 4px',
                    marginTop: '-2px',
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
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendDebounced()
              }
            }}
            onInput={e => {
              const el = e.currentTarget
              el.style.height = 'auto'
              el.style.height = Math.min(el.scrollHeight, 120) + 'px'
            }}
          />
          <button
            className="send-btn"
            onClick={handleSendClick}
            disabled={loading || !input.trim()}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}