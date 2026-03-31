'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { animatePetStageEnter, animateStatBar } from '@/lib/gsapAnimations'

type Mood = 'idle' | 'happy' | 'sad' | 'anxious' | 'calm'

interface Props {
  name: string
  emoji: string
  petId: string
  mood: Mood
  level: number
  exp: number
  expMax: number
  trust: number
  energy: number
  bubbleText?: string
}

const PET_GLOW: Record<string, string> = {
  'mochi': 'rgba(200,80,140,0.35)',
  'shiba': 'rgba(200,150,30,0.35)',
  'white-fox': 'rgba(180,180,220,0.35)',
  'owl': 'rgba(130,70,200,0.35)',
  'frog': 'rgba(40,170,100,0.35)',
  'duck': 'rgba(200,150,30,0.35)',
  'turtle': 'rgba(20,170,190,0.35)',
  'shadow-cat': 'rgba(130,70,200,0.45)',
}

const MOOD_GLOW: Record<Mood, string> = {
  happy: 'rgba(200,80,140,0.45)',
  idle: 'rgba(140,90,200,0.3)',
  calm: 'rgba(40,170,100,0.35)',
  sad: 'rgba(100,120,160,0.3)',
  anxious: 'rgba(200,110,40,0.38)',
}

const moodEmoji: Record<string, string> = {
  'shiba': '🐕',
  'white-fox': '🦊',
  'owl': '🦉',
  'frog': '🐸',
  'duck': '🦆',
  'turtle': '🐢',
  'shadow-cat': '🐈‍⬛',
}

const HEAD_OPEN = '/animations/head.svg'
const HEAD_HALF = '/animations/mochi-2.svg'
const HEAD_CLOSED = '/animations/mochi-3.svg'

// GSAP 工具函数 — 安全执行，避免 null 报错
function safeGsapTo(target: HTMLElement | null, vars: gsap.TweenVars) {
  if (!target) return null
  return gsap.to(target, vars)
}

function safeGsapFromTo(target: HTMLElement | null, from: gsap.TweenVars, to: gsap.TweenVars) {
  if (!target) return null
  return gsap.fromTo(target, from, to)
}

export default function PetStage({
  name, emoji, petId, mood, level, exp, expMax, trust, energy,
}: Props) {
  const isMochi = petId === 'mochi'
  const isWhiteFox = petId === 'white-fox'
  const glow = isMochi ? MOOD_GLOW[mood] : (PET_GLOW[petId] || 'rgba(140,90,200,0.3)')
  const displayEmoji = moodEmoji[petId] || emoji

  const [headSrc, setHeadSrc] = useState(HEAD_OPEN)
  const [displayMood, setDisplayMood] = useState<Mood>(mood)

  const stageRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLImageElement>(null)
  const headRef = useRef<HTMLImageElement>(null)
  const leftEarRef = useRef<HTMLImageElement>(null)
  const rightEarRef = useRef<HTMLImageElement>(null)
  const tailRef = useRef<HTMLImageElement>(null)
  const expRef = useRef<HTMLDivElement>(null)
  const trustRef = useRef<HTMLDivElement>(null)
  const energyRef = useRef<HTMLDivElement>(null)
  const levelRef = useRef<HTMLSpanElement>(null)

  const prevLevel = useRef(level)
  const prevExp = useRef(exp)
  const prevTrust = useRef(trust)
  const prevEnergy = useRef(energy)

  // ── 进场动画 ─────────────────────────────
  useEffect(() => {
    if (stageRef.current) animatePetStageEnter(stageRef.current)
  }, [])

  // ── Mochi GSAP 动画（修复：等 DOM 挂载后再执行）──
  useEffect(() => {
    if (!isMochi) return

    // 用 requestAnimationFrame 确保 img 已挂载
    const raf = requestAnimationFrame(() => {
      if (!bodyRef.current || !headRef.current) return

      safeGsapTo(bodyRef.current, {
        scaleY: 1.006, scaleX: 0.9985, y: 1.2, x: 0.5, rotation: 0.18,
        duration: 4.2, repeat: -1, yoyo: true, ease: 'sine.inOut',
      })
      safeGsapTo(headRef.current, {
        rotation: 0.25, duration: 4.8, repeat: -1, yoyo: true,
        transformOrigin: 'bottom center', ease: 'sine.inOut',
      })
      safeGsapTo(leftEarRef.current, {
        rotation: -0.18, duration: 5.1, repeat: -1, yoyo: true,
        transformOrigin: 'bottom center', ease: 'sine.inOut',
      })
      safeGsapTo(rightEarRef.current, {
        rotation: 0.16, duration: 5.4, repeat: -1, yoyo: true,
        transformOrigin: 'bottom center', ease: 'sine.inOut',
      })
      safeGsapTo(tailRef.current, {
        rotation: 1.5, duration: 3.8, repeat: -1, yoyo: true,
        transformOrigin: 'bottom left', ease: 'sine.inOut',
      })
    })

    // 眨眼
    let blinkTimeout: NodeJS.Timeout
    const blink = () => {
      setHeadSrc(HEAD_HALF)
      setTimeout(() => setHeadSrc(HEAD_CLOSED), 70)
      setTimeout(() => setHeadSrc(HEAD_HALF), 140)
      setTimeout(() => setHeadSrc(HEAD_OPEN), 210)
      if (Math.random() > 0.75) {
        setTimeout(() => {
          setHeadSrc(HEAD_HALF)
          setTimeout(() => setHeadSrc(HEAD_CLOSED), 70)
          setTimeout(() => setHeadSrc(HEAD_HALF), 140)
          setTimeout(() => setHeadSrc(HEAD_OPEN), 210)
        }, 320)
      }
    }
    const scheduleBlink = () => {
      blink()
      blinkTimeout = setTimeout(scheduleBlink, 3000 + Math.random() * 5000)
    }
    const initBlink = setTimeout(scheduleBlink, 3000)

    // Rare idle
    let rareTimeout: NodeJS.Timeout
    const rareIdle = () => {
      const r = Math.random()
      if (r < 0.35) {
        safeGsapTo(leftEarRef.current, { rotation: -1, duration: 0.18, yoyo: true, repeat: 1 })
        safeGsapTo(rightEarRef.current, { rotation: 0.8, duration: 0.18, yoyo: true, repeat: 1 })
      } else if (r < 0.65) {
        safeGsapTo(headRef.current, { rotation: 0.8, duration: 0.4, yoyo: true, repeat: 1 })
      } else {
        safeGsapTo(tailRef.current, { rotation: 3, duration: 0.5, yoyo: true, repeat: 1 })
      }
      rareTimeout = setTimeout(rareIdle, 6000 + Math.random() * 8000)
    }
    const initRare = setTimeout(rareIdle, 5000)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(initBlink)
      clearTimeout(blinkTimeout)
      clearTimeout(initRare)
      clearTimeout(rareTimeout)
      gsap.killTweensOf([
        bodyRef.current, headRef.current,
        leftEarRef.current, rightEarRef.current, tailRef.current,
      ].filter(Boolean))
    }
  }, [isMochi])

  // ── 心情变化动画 ─────────────────────────
  useEffect(() => {
    if (!isMochi || mood === displayMood) return
    setDisplayMood(mood)

    if (containerRef.current) {
      safeGsapFromTo(containerRef.current,
        { scale: 0.95, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
      )
    }

    switch (mood) {
      case 'happy':
        safeGsapTo(tailRef.current, {
          rotation: 4, duration: 0.2, repeat: 4, yoyo: true,
          ease: 'power1.inOut', transformOrigin: 'bottom left',
        })
        safeGsapTo(leftEarRef.current, { rotation: -1.5, duration: 0.15, repeat: 3, yoyo: true })
        safeGsapTo(rightEarRef.current, { rotation: 1.5, duration: 0.15, repeat: 3, yoyo: true, delay: 0.05 })
        break
      case 'sad':
        safeGsapTo(headRef.current, {
          rotation: -0.5, y: 2, duration: 0.8, ease: 'power2.out',
          transformOrigin: 'bottom center',
        })
        break
      case 'anxious':
        safeGsapTo(containerRef.current, {
          x: -3, duration: 0.06, repeat: 6, yoyo: true, ease: 'power1.inOut',
          onComplete: () => {
            if (containerRef.current) {
              gsap.set(containerRef.current, { x: 0 })
            }
          },
        })
        break
      case 'calm':
        safeGsapTo(headRef.current, { rotation: 0, y: 0, duration: 1, ease: 'power2.out' })
        break
    }
  }, [mood])

  // ── Stat bars ────────────────────────────
  useEffect(() => {
    if (expRef.current && exp !== prevExp.current) {
      animateStatBar(expRef.current, (exp / expMax) * 100)
      prevExp.current = exp
    }
  }, [exp, expMax])

  useEffect(() => {
    if (trustRef.current && trust !== prevTrust.current) {
      animateStatBar(trustRef.current, trust)
      prevTrust.current = trust
    }
  }, [trust])

  useEffect(() => {
    if (energyRef.current && energy !== prevEnergy.current) {
      animateStatBar(energyRef.current, energy)
      prevEnergy.current = energy
    }
  }, [energy])

  // ── Level up ─────────────────────────────
  useEffect(() => {
    if (level > prevLevel.current) {
      if (levelRef.current) {
        safeGsapFromTo(levelRef.current,
          { scale: 1.8, color: '#fbbf24' },
          { scale: 1, color: '#fff', duration: 0.7, ease: 'elastic.out(1, 0.4)' }
        )
      }
      spawnParticles()
    }
    prevLevel.current = level
  }, [level])

  return (
<div
      ref={stageRef}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 14px',
        background: 'linear-gradient(180deg, #15122c 0%, #100d24 55%, #0a0818 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(140,100,220,0.18)',
        boxShadow: 'inset 0 0 30px rgba(140,90,255,0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 背景光晕 */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 40%, ${glow} 0%, transparent 65%)`,
        transition: 'background 1s ease', pointerEvents: 'none',
      }} />

      {/* Level */}
      <span ref={levelRef} style={{
        position: 'absolute', top: '10px', right: '10px',
        background: 'rgba(100,70,180,0.25)', border: '1px solid rgba(140,100,220,0.3)',
        borderRadius: '10px', padding: '2px 8px',
        fontFamily: "'Fredoka One', cursive", fontSize: '11px',
        color: 'rgba(200,170,255,0.9)', zIndex: 2,
      }}>
        ✦ Lv.{level}
      </span>

      {/* Name */}
      <p style={{
        fontFamily: "'Fredoka One', cursive",
        fontSize: '13px',
        background: 'linear-gradient(90deg, rgba(200,140,255,0.8), rgba(140,180,255,0.8))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        backgroundClip: 'text', letterSpacing: '0.1em',
        marginBottom: '2px', zIndex: 2,
      }}>
        ✧ {name.toUpperCase()} ✧
      </p>

      {/* 宠物动画 — 响应式容器 */}
      {isMochi ? (
        <div
          ref={containerRef}
          className="mochi-container"
          style={{
            // 桌面用固定大小，手机用 CSS 缩小
            width: '160px',
            height: '160px',
            position: 'relative',
            zIndex: 2,
            filter: `drop-shadow(0 6px 18px ${glow})`,
            flexShrink: 0,
          }}
        >
          <img ref={tailRef} src="/animations/tail.svg" alt="" style={{ position: 'absolute', width: '100%', top: 0, left: 0 }} />
          <img ref={bodyRef} src="/animations/catBody.svg" alt="" style={{ position: 'absolute', width: '100%', top: 0, left: 0 }} />
          <img ref={headRef} src={headSrc} alt="mochi" style={{ position: 'absolute', width: '100%', top: '-2px', left: 0 }} />
          <img ref={leftEarRef} src="/animations/leftear.svg" alt="" style={{ position: 'absolute', width: '100%', top: 0, left: 0 }} />
          <img ref={rightEarRef} src="/animations/rightear.svg" alt="" style={{ position: 'absolute', width: '100%', top: 0, left: 0 }} />
        </div>
      ) : (
        <div style={{
          width: '130px', height: '130px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 2,
          fontSize: '64px', flexShrink: 0,
          filter: isWhiteFox
            ? 'brightness(2) saturate(0.1) drop-shadow(0 0 14px rgba(200,200,255,0.5))'
            : `drop-shadow(0 0 14px ${glow})`,
          animation: 'petBreathe 3s ease-in-out infinite',
        }}>
          {displayEmoji}
        </div>
      )}

      {/* Stat bars */}
      <div
        className="stat-panel"
        style={{
          width: '100%',
          marginTop: '12px',
          padding: '10px 8px',
          borderRadius: '14px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(140,100,220,0.12)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 2,
        }}
      >
        <GameStatBar label="EXP" value={exp} max={expMax} type="exp" barRef={expRef} />
        <GameStatBar label="TRUST" value={trust} max={100} type="trust" barRef={trustRef} />
        <GameStatBar label="ENERGY" value={energy} max={100} type="energy" barRef={energyRef} />
      </div>

      {/* 手机尺寸调整 */}
      <style>{`
        @media (max-width: 640px) {
          .mochi-container {
            width:  110px !important;
            height: 110px !important;
          }
        }
        @media (max-width: 375px) {
          .mochi-container {
            width:  90px !important;
            height: 90px !important;
          }
        }
      `}</style>
    </div>
  )
}

function spawnParticles() {
  const colors = ['#c084fc', '#fbbf24', '#60a5fa', '#34d399', '#f472b6']
  for (let i = 0; i < 10; i++) {
    const p = document.createElement('div')
    p.style.cssText = `
      position:fixed; width:7px; height:7px; border-radius:50%;
      background:${colors[i % colors.length]}; pointer-events:none; z-index:9999;
      left:50%; top:40%;
    `
    document.body.appendChild(p)
    const angle = (i / 10) * Math.PI * 2
    gsap.fromTo(p,
      { x: 0, y: 0, scale: 1, opacity: 1 },
      {
        x: Math.cos(angle) * 80, y: Math.sin(angle) * 80,
        scale: 0, opacity: 0,
        duration: 0.8 + Math.random() * 0.3, ease: 'power2.out',
        onComplete: () => p.remove(),
      }
    )
  }
}

// ──StatBar ──────────────────────
function GameStatBar({
  label,
  value,
  max,
  type,
  barRef,
}: {
  label:  string
  value:  number
  max:    number
  type:   string
  barRef: React.RefObject<HTMLDivElement | null>
}) {
  const TOTAL_CELLS = 14
  const filledCount = Math.round((value / max) * TOTAL_CELLS)
  const pct         = Math.round((value / max) * 100)

  // 颜色配置
  const config: Record<string, {
    icon:        string
    labelColor:  string
    fillGrad:    string
    glowColor:   string
    shimmer:     string
    isLow?:      boolean
  }> = {
    exp: {
      icon:       '⚡',
      labelColor: 'rgba(192,132,252,0.85)',
      fillGrad:   'linear-gradient(180deg, #c084fc 0%, #7c3aed 100%)',
      glowColor:  'rgba(168,85,247,0.6)',
      shimmer:    'rgba(255,255,255,0.22)',
    },
    trust: {
      icon:       '💙',
      labelColor: 'rgba(34,211,238,0.85)',
      fillGrad:   'linear-gradient(180deg, #22d3ee 0%, #0891b2 100%)',
      glowColor:  'rgba(34,211,238,0.6)',
      shimmer:    'rgba(255,255,255,0.2)',
    },
    energy: {
      icon:       '🔥',
      labelColor: value > 20
        ? 'rgba(251,191,36,0.85)'
        : 'rgba(239,68,68,0.95)',
      fillGrad:   value > 50
        ? 'linear-gradient(180deg, #fbbf24 0%, #d97706 100%)'
        : value > 20
          ? 'linear-gradient(180deg, #f59e0b 0%, #b45309 100%)'
          : 'linear-gradient(180deg, #ef4444 0%, #991b1b 100%)',
      glowColor:  value > 20
        ? 'rgba(251,191,36,0.6)'
        : 'rgba(239,68,68,0.7)',
      shimmer:    'rgba(255,255,255,0.2)',
      isLow:      value <= 20,
    },
  }

  const cfg = config[type] || config.exp

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

      {/* 标签行 */}
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
      }}>
        <div style={{
          display:       'flex',
          alignItems:    'center',
          gap:           '4px',
          fontSize:      '10px',
          fontWeight:    800,
          color:         cfg.labelColor,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          fontFamily:    "'Courier New', monospace",
        }}>
          <span style={{ fontSize: '11px' }}>{cfg.icon}</span>
          {label}
          {/* 低能量警告标签 */}
          {cfg.isLow && (
            <span style={{
              fontSize:     '8px',
              color:        'rgba(239,68,68,0.8)',
              background:   'rgba(239,68,68,0.1)',
              border:       '1px solid rgba(239,68,68,0.25)',
              borderRadius: '4px',
              padding:      '0px 4px',
              letterSpacing:'0.08em',
              animation:    'lowPulse 1.2s ease-in-out infinite alternate',
            }}>
              LOW
            </span>
          )}
        </div>

        {/* 数值 */}
        <div style={{
          fontFamily: "'Courier New', monospace",
          fontSize:   '11px',
          fontWeight: 700,
          color:      cfg.isLow
            ? 'rgba(239,68,68,0.85)'
            : 'rgba(200,185,240,0.7)',
        }}>
          {value}
          <span style={{ fontSize: '9px', opacity: 0.45, marginLeft: '1px' }}>
            /{max}
          </span>
        </div>
      </div>

      {/* 像素格进度条 */}
      <div style={{
        display:    'flex',
        gap:        '2.5px',
        alignItems: 'center',
        height:     '12px',
      }}>
        {Array.from({ length: TOTAL_CELLS }, (_, i) => {
          const isFilled = i < filledCount

          return (
            <div
              key={i}
              style={{
                flex:         1,
                height:       '12px',
                borderRadius: '2px',
                position:     'relative',
                overflow:     'hidden',
                background:   isFilled
                  ? cfg.fillGrad
                  : 'rgba(255,255,255,0.05)',
                border:       isFilled
                  ? 'none'
                  : '1px solid rgba(255,255,255,0.04)',
                boxShadow:    isFilled
                  ? `0 0 4px ${cfg.glowColor}, inset 0 -2px 0 rgba(0,0,0,0.3)`
                  : 'none',
                // 轻微交错动画延迟，有填满感
                transition:   `background 0.3s ease ${i * 0.015}s, box-shadow 0.3s ease`,
              }}
            >
              {/* 顶部高光（像素感）*/}
              {isFilled && (
                <div style={{
                  position:     'absolute',
                  top:          0,
                  left:         0,
                  right:        0,
                  height:       '3px',
                  background:   cfg.shimmer,
                  borderRadius: '2px 2px 0 0',
                }} />
              )}
            </div>
          )
        })}
      </div>

      {/* 隐藏的 div 给 GSAP 用 */}
      <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0 }}>
        <div ref={barRef} style={{ width: `${pct}%` }} />
      </div>

      <style>{`
        @keyframes lowPulse {
          from { opacity: 0.6; }
          to   { opacity: 1;   }
        }
      `}</style>
    </div>
  )
}