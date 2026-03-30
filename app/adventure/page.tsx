'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGame } from '@/lib/gameContext'
import { ADVENTURE_ZONES, PETS } from '@/data/pets'
import { playQuestStartSound, playQuestCompleteSound } from '@/lib/soundSystem'
import Image from 'next/image'

interface LogEntry { text: string; reward: string; color: string }

function formatTimeLeft(ms: number): string {
  if (ms <= 0) return 'Complete!'
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

export default function AdventurePage() {
  const {
    state, addCoins, spendEnergy,
    startQuest, completeQuest, getQuestTimeLeft,
  } = useGame()
  const activePet = PETS.find(p => p.id === state.activePet) || PETS[0]

  const [log, setLog] = useState<LogEntry[]>([
    { text: `${activePet.name} wandered through Moon Forest`, reward: '+12 🪙', color: '#60a5fa' },
    { text: 'A crystal chimed in the cave silence', reward: '✦ rare item', color: '#c084fc' },
    { text: 'The ember winds carried warmth', reward: '−10 energy', color: '#9d8fc0' },
  ])
  const [toast, setToast] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)

  const mapImgRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const crystalGlowRef = useRef<HTMLDivElement>(null)
  const forestGlowRef = useRef<HTMLDivElement>(null)
  const emberGlowRef = useRef<HTMLDivElement>(null)

  // 进场
  useEffect(() => {
    if (!mapImgRef.current) return
    gsap.fromTo(mapImgRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }
    )
  }, [])

  // 路径动画
  useEffect(() => {
    if (!pathRef.current) return
    gsap.to(pathRef.current, { strokeDashoffset: -300, duration: 8, repeat: -1, ease: 'none' })
  }, [])

  // 区域氛围光
  useEffect(() => {
    if (!crystalGlowRef.current) return
    gsap.to(crystalGlowRef.current, { opacity: 0.18, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  }, [])
  useEffect(() => {
    if (!forestGlowRef.current) return
    gsap.to(forestGlowRef.current, { opacity: 0.14, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  }, [])
  useEffect(() => {
    if (!emberGlowRef.current) return
    gsap.to(emberGlowRef.current, { opacity: 0.12, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  }, [])

  // 倒计时
  useEffect(() => {
    if (!state.activeQuest) { setTimeLeft(0); return }
    setTimeLeft(getQuestTimeLeft())
    const interval = setInterval(() => {
      const left = getQuestTimeLeft()
      setTimeLeft(left)
      if (left <= 0) clearInterval(interval)
    }, 1000)
    return () => clearInterval(interval)
  }, [state.activeQuest])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  function sendAdventure(zone: typeof ADVENTURE_ZONES[0]) {
    if (zone.locked) return
    if (state.activeQuest) {
      showToast(`${activePet.name} is still on a quest!`)
      return
    }
    if (state.energy < zone.energyCost) {
      showToast(`${activePet.name} needs more energy ⚡`)
      return
    }
    const coins = Math.floor(
      Math.random() * (zone.maxCoins - zone.minCoins + 1)
    ) + zone.minCoins

    spendEnergy(zone.energyCost)
    playQuestStartSound()
    startQuest({ zoneId: zone.id, zoneName: zone.name, duration: zone.duration, coins })
    setLog(prev => [
      { text: `${activePet.name} departed for ${zone.name}`, reward: `~${zone.hours}h`, color: '#a78bfa' },
      ...prev.slice(0, 3),
    ])
    showToast(`${activePet.name} set off for ${zone.name} · Returns in ${zone.hours}h`)
  }

  function handleCollect() {
    playQuestCompleteSound()
    if (!state.activeQuest) return
    setLog(prev => [
      {
        text: `${activePet.name} returned from ${state.activeQuest!.zoneName}`,
        reward: `+${state.activeQuest!.coins} 🪙`, color: '#fbbf24'
      },
      ...prev.slice(0, 3),
    ])
    addCoins(state.activeQuest.coins)
    completeQuest()
    showToast(`${activePet.name} is home! +${state.activeQuest.coins} 🪙`)
  }

  const activeZone = state.activeQuest
    ? ADVENTURE_ZONES.find(z => z.id === state.activeQuest!.zoneId)
    : null
  const progressPct = state.activeQuest
    ? Math.max(0, Math.min(100,
      ((state.activeQuest.duration - timeLeft) / state.activeQuest.duration) * 100
    ))
    : 0

  return (
    <div style={{
      padding: '16px', height: '100%', overflowY: 'auto',
      display: 'flex', flexDirection: 'column', gap: '14px', boxSizing: 'border-box',
    }}>

      {/* Toast */}
      {toast && (
        <div style={{
          background: 'rgba(12,10,28,0.85)', border: '1px solid rgba(168,85,247,0.2)',
          borderRadius: '12px', padding: '9px 14px', fontWeight: 600,
          fontSize: '13px', color: 'rgba(200,185,240,0.9)', flexShrink: 0, backdropFilter: 'blur(8px)',
        }}>
          {toast}
        </div>
      )}

      {/* 任务进行中卡片 */}
      {state.activeQuest && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(140,80,220,0.12), rgba(60,100,220,0.08))',
          border: '1.5px solid rgba(140,80,220,0.3)',
          borderRadius: '16px', padding: '14px 16px',
          display: 'flex', flexDirection: 'column', gap: '10px',
          flexShrink: 0, boxShadow: '0 4px 20px rgba(140,80,220,0.1)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '20px' }}>{activeZone?.icon || '🌿'}</span>
              <div>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: '14px', color: 'rgba(200,180,255,0.95)' }}>
                  {activePet.name} is journeying...
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(150,130,200,0.7)' }}>
                  {state.activeQuest.zoneName}
                </div>
              </div>
            </div>
            <div style={{
              fontFamily: "'Fredoka One', cursive", fontSize: '20px',
              color: timeLeft < 60000 ? '#f87171' : '#a78bfa',
              transition: 'color 0.5s',
            }}>
              {formatTimeLeft(timeLeft)}
            </div>
          </div>

          {/* 进度条 */}
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progressPct}%`,
              background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
              borderRadius: '10px', transition: 'width 1s linear',
              boxShadow: '0 0 8px rgba(167,139,250,0.5)',
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(140,120,180,0.6)', fontStyle: 'italic' }}>
              Expected reward
            </span>
            <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: '13px', color: '#fbbf24' }}>
              +{state.activeQuest.coins} 🪙
            </span>
          </div>

          {/* 完成后收取按钮 */}
          {timeLeft <= 0 && (
            <button onClick={handleCollect} style={{
              background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              border: 'none', borderRadius: '10px', padding: '9px 0',
              color: '#fff', fontFamily: "'Fredoka One', cursive",
              fontSize: '14px', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(124,58,237,0.4)',
              animation: 'questGlow 1.5s ease-in-out infinite alternate',
            }}>
              ✦ {activePet.name} has returned! Collect reward
            </button>
          )}
        </div>
      )}

      {/* 标题 */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: '22px', color: 'var(--text)' }}>
          🗺️ The World
        </div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', marginTop: '2px' }}>
          {state.activeQuest
            ? `${activePet.name} is away — return in ${formatTimeLeft(timeLeft)}`
            : `Where will ${activePet.name} wander today?`}
        </div>
      </div>

      {/* ── 世界地图外层容器 ── */}
      {/* 外层 overflow:visible 让 tooltip 可以超出 */}
      <div 
      className="world-map-container"
      style={{
        position: 'relative',
        height: '300px',
        flexShrink: 0,
      }}>

        {/* 图片层 — overflow:hidden 保持圆角，裁切图片 */}
        <div
          ref={mapImgRef}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '18px',
            overflow: 'hidden',
            boxShadow: '0 2px 40px rgba(0,0,0,0.7)',
            filter: state.activeQuest ? 'brightness(0.7)' : 'brightness(1)',
            transition: 'filter 0.5s ease',
          }}
        >
          {/* 三图拼接 */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>

            {/* Moon Forest */}
            <div style={{ flex: 1.1, position: 'relative', overflow: 'hidden' }}>
              <Image
                src="/moonforest.png"
                alt="Moon Forest"
                fill
                sizes="33vw"
                style={{ objectFit: 'cover', objectPosition: 'right center' }}
                priority            
                quality={85}
              />
              <div style={{
                position: 'absolute', top: 0, right: 0, width: '160px', height: '100%',
                background: 'linear-gradient(to right, transparent 0%, rgba(6,4,18,0.5) 40%, rgba(6,4,18,0.92) 100%)',
              }} />
              <div ref={forestGlowRef} style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at 40% 50%, rgba(60,120,220,0.22) 0%, transparent 70%)',
                opacity: 0.08, pointerEvents: 'none',
              }} />
            </div>

            {/* Crystal Caves */}
            <div style={{ flex: 1.3, position: 'relative', overflow: 'hidden', marginLeft: '-70px', marginRight: '-70px' }}>
              <Image
                src="/crystalcaves.png"
                alt="Crystal Caves"
                fill
                sizes="40vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                priority
                quality={85}
              />
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '150px', height: '100%',
                background: 'linear-gradient(to right, rgba(6,4,18,0.92) 0%, transparent 100%)',
              }} />
              <div style={{
                position: 'absolute', top: 0, right: 0, width: '150px', height: '100%',
                background: 'linear-gradient(to left, rgba(10,5,20,0.92) 0%, transparent 100%)',
              }} />
              <div ref={crystalGlowRef} style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at 50% 40%, rgba(140,80,220,0.28) 0%, transparent 65%)',
                opacity: 0.06, pointerEvents: 'none',
              }} />
            </div>

            {/* Ember Peaks */}
            <div style={{ flex: 1.1, position: 'relative', overflow: 'hidden' }}>
              <Image
                src="/emberpeaks.png"
                alt="Ember Peaks"
                fill
                sizes="33vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'left center',
                  filter: 'grayscale(0.82) brightness(0.32) sepia(0.15)',
                }}
                quality={75}           
              />
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '160px', height: '100%',
                background: 'linear-gradient(to left, transparent 0%, rgba(10,5,20,0.92) 100%)',
              }} />
              <div ref={emberGlowRef} style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at 55% 65%, rgba(200,50,10,0.2) 0%, transparent 65%)',
                opacity: 0.06, pointerEvents: 'none',
              }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
            </div>
          </div>

          {/* 底部雾气 */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '90px',
            background: 'linear-gradient(to top, rgba(5,3,16,0.9) 0%, transparent 100%)',
            pointerEvents: 'none', zIndex: 3,
          }} />

          {/* 顶部遮罩 */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '50px',
            background: 'linear-gradient(to bottom, rgba(5,3,16,0.55) 0%, transparent 100%)',
            pointerEvents: 'none', zIndex: 3,
          }} />

          {/* SVG 路径 + 裂缝 */}
          <svg style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            zIndex: 4, pointerEvents: 'none',
          }} viewBox="0 0 900 300" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.45" />
                <stop offset="45%" stopColor="#a78bfa" stopOpacity="0.5" />
                <stop offset="72%" stopColor="#a78bfa" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.1" />
              </linearGradient>
              <filter id="softGlow">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="crackGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <path
              d="M 20 248 C 80 238, 150 222, 230 228 C 290 232, 330 210, 390 200 C 440 192, 490 196, 540 190 C 590 184, 640 192, 700 200 C 750 207, 820 218, 880 224"
              fill="none" stroke="url(#pathGrad)" strokeWidth="1.8" strokeLinecap="round"
              strokeDasharray="6 10" filter="url(#softGlow)" opacity="0.55"
            />
            <path
              ref={pathRef}
              d="M 20 248 C 80 238, 150 222, 230 228 C 290 232, 330 210, 390 200 C 440 192, 490 196, 540 190 C 590 184, 640 192, 700 200 C 750 207, 820 218, 880 224"
              fill="none" stroke="rgba(140,100,220,0.1)" strokeWidth="7"
              strokeLinecap="round" strokeDasharray="20 30"
            />
            {/* 裂缝 1 */}
            <path d="M 308 0 C 306 18, 311 32, 307 55 C 303 78, 314 96, 309 118 C 304 140, 312 158, 306 180 C 300 202, 311 222, 307 248 C 303 268, 309 285, 307 300"
              fill="none" stroke="#818cf8" strokeWidth="0.7" strokeLinecap="round" opacity="0.5" filter="url(#crackGlow)" />
            <path d="M 309 80 C 320 72, 330 68, 338 74" fill="none" stroke="#818cf8" strokeWidth="0.5" strokeLinecap="round" opacity="0.3" />
            <path d="M 306 140 C 295 134, 285 138, 278 148" fill="none" stroke="#818cf8" strokeWidth="0.5" strokeLinecap="round" opacity="0.25" />
            <path d="M 308 0 C 306 18, 311 32, 307 55 C 303 78, 314 96, 309 118 C 304 140, 312 158, 306 180 C 300 202, 311 222, 307 248 C 303 268, 309 285, 307 300"
              fill="none" stroke="rgba(129,140,248,0.15)" strokeWidth="9" strokeLinecap="round" opacity="0.6" />
            {/* 裂缝 2 */}
            <path d="M 601 0 C 604 22, 598 40, 603 62 C 608 84, 599 102, 604 128 C 609 152, 597 168, 602 192 C 607 216, 598 234, 603 258 C 608 276, 600 288, 603 300"
              fill="none" stroke="#f97316" strokeWidth="0.6" strokeLinecap="round" opacity="0.3" filter="url(#crackGlow)" />
            <path d="M 602 70 C 614 62, 624 66, 630 76" fill="none" stroke="#f97316" strokeWidth="0.5" strokeLinecap="round" opacity="0.2" />
            <path d="M 601 0 C 604 22, 598 40, 603 62 C 608 84, 599 102, 604 128 C 609 152, 597 168, 602 192 C 607 216, 598 234, 603 258 C 608 276, 600 288, 603 300"
              fill="none" stroke="rgba(249,115,22,0.1)" strokeWidth="8" strokeLinecap="round" opacity="0.5" />
          </svg>

          {/* 粒子 */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: `${1.5 + (i % 2)}px`, height: `${1.5 + (i % 2)}px`,
              borderRadius: '50%',
              left: `${4 + i * 6.2}%`, top: `${18 + (i % 5) * 12}%`,
              background: i < 5 ? 'rgba(96,165,250,0.7)' : 'rgba(167,139,250,0.7)',
              boxShadow: i < 5 ? '0 0 5px rgba(96,165,250,0.8)' : '0 0 5px rgba(167,139,250,0.8)',
              animation: `particleFloat ${4 + i * 0.5}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.4}s`,
              zIndex: 5, pointerEvents: 'none',
            }} />
          ))}

          {/* 任务中覆盖提示 */}
          {state.activeQuest && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              <div style={{
                background: 'rgba(8,6,22,0.75)', backdropFilter: 'blur(6px)',
                border: '1px solid rgba(167,139,250,0.3)', borderRadius: '14px',
                padding: '12px 20px', textAlign: 'center',
              }}>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: '15px', color: 'rgba(200,180,255,0.9)', marginBottom: '4px' }}>
                  {activePet.name} is on a quest
                </div>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: '22px', color: '#a78bfa' }}>
                  {formatTimeLeft(timeLeft)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── 节点层 — 在图片层外，overflow visible，tooltip 不被截 ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
          {ADVENTURE_ZONES.map((zone, index) => {
            const positions = [
              { x: '17%', y: '62%' },
              { x: '50%', y: '50%' },
              { x: '81%', y: '63%' },
            ]
            const dotColors = ['#60a5fa', '#a78bfa', '#7c2d12']
            const isActive = state.activeQuest?.zoneId === zone.id

            return (
              <ZoneNode
                key={zone.id}
                x={positions[index].x}
                y={positions[index].y}
                zone={zone}
                hovered={hovered}
                isActive={isActive}
                hasActiveQuest={!!state.activeQuest}
                energy={state.energy}
                petName={activePet.name}
                onHover={setHovered}
                onSend={sendAdventure}
                dotColor={dotColors[index]}
              />
            )
          })}
        </div>
      </div>

      {/* 冒险记录 */}
      <div style={{
        background: 'rgba(8,6,20,0.6)', border: '1px solid rgba(80,60,140,0.12)',
        borderRadius: '14px', padding: '12px 14px', flexShrink: 0,
      }}>
        <div style={{
          fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
          color: 'rgba(120,100,160,0.55)', textTransform: 'uppercase', marginBottom: '8px',
        }}>
          Journey Log
        </div>
        {log.map((entry, i) => (
          <div key={i} style={{
            fontSize: '12px', fontWeight: 600, color: 'rgba(160,140,200,0.65)',
            padding: '5px 0',
            borderBottom: i < log.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontStyle: 'italic',
          }}>
            <span>{entry.text}</span>
            <span style={{
              color: entry.color, fontFamily: "'Fredoka One', cursive",
              fontSize: '12px', fontStyle: 'normal', marginLeft: '10px', flexShrink: 0,
            }}>
              {entry.reward}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes particleFloat {
          0%   { transform: translateY(0) scale(1);      opacity: 0.4; }
          100% { transform: translateY(-8px) scale(1.2); opacity: 0.9; }
        }
        @keyframes nodePulse {
          0%   { transform: translate(-50%,-50%) scale(1); opacity: 0.7; }
          100% { transform: translate(-50%,-50%) scale(2); opacity: 0;   }
        }
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateX(-50%) translateY(4px) scale(0.97); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0)   scale(1);    }
        }
        @keyframes tooltipInDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-4px) scale(0.97); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1);    }
        }
        @keyframes questGlow {
          0%   { box-shadow: 0 4px 14px rgba(124,58,237,0.4); }
          100% { box-shadow: 0 4px 22px rgba(124,58,237,0.7); }
        }
      `}</style>
    </div>
  )
}

// ── ZoneNode ──────────────────────────────────
function ZoneNode({
  x, y, zone, hovered, isActive, hasActiveQuest, energy, petName,
  onHover, onSend, dotColor,
}: {
  x: string; y: string; zone: any
  hovered: string | null; isActive: boolean; hasActiveQuest: boolean
  energy: number; petName: string
  onHover: (id: string | null) => void
  onSend: (zone: any) => void
  dotColor: string
}) {
  const isHovered = hovered === zone.id
  const noEnergy = energy < zone.energyCost
  const isLocked = zone.locked || (hasActiveQuest && !isActive)

  // 节点 y 位置决定 tooltip 方向
  const yNum = parseFloat(y)
  const showBelow = yNum < 55   // 节点在上半部 → tooltip 向下

  // tooltip 定位样式
  const tooltipPos: React.CSSProperties = showBelow
    ? { position: 'absolute', top: '26px', left: '50%', transform: 'translateX(-50%)' }
    : { position: 'absolute', bottom: '26px', left: '50%', transform: 'translateX(-50%)' }

  // 连接线样式
  const connectorPos: React.CSSProperties = showBelow
    ? {
      position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)',
      width: '1px', height: '8px', background: `${dotColor}55`
    }
    : {
      position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)',
      width: '1px', height: '8px', background: `${dotColor}55`
    }

  const tooltipAnimation = showBelow ? 'tooltipInDown 0.2s ease-out' : 'tooltipIn 0.2s ease-out'

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        zIndex: 6,
        cursor: isLocked ? 'default' : 'pointer',
        // 上下都留足够热区，让鼠标移到 tooltip 时不会触发 mouseLeave
        padding: '70px 44px',
        margin: '-70px -44px',
      }}
      onMouseEnter={() => !isLocked && onHover(zone.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div style={{ position: 'relative', display: 'inline-block' }}>

        {/* 脉冲圈 */}
        {!isLocked && (
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            width: '14px', height: '14px',
            borderRadius: '50%',
            background: isActive ? '#a78bfa' : dotColor,
            animation: 'nodePulse 2.5s ease-out infinite',
            pointerEvents: 'none',
          }} />
        )}

        {/* 主节点 */}
        <div style={{
          width: '11px',
          height: '11px',
          borderRadius: isLocked ? '50%' : '48% 52% 50% 50% / 50% 48% 52% 50%',
          background: isActive
            ? '#a78bfa'
            : isLocked ? 'rgba(80,50,50,0.35)' : dotColor,
          boxShadow: isActive
            ? '0 0 12px #a78bfa, 0 0 24px #a78bfa66'
            : isLocked ? 'none' : `0 0 8px ${dotColor}, 0 0 16px ${dotColor}44`,
          border: `1.5px solid ${isLocked
            ? 'rgba(80,50,50,0.25)'
            : isActive ? '#a78bfa99' : dotColor + '99'}`,
          position: 'relative',
          zIndex: 1,
          transition: 'transform 0.25s ease',
          transform: isHovered ? 'scale(1.5)' : 'scale(1)',
        }} />

        {/* 常驻区域名标签 — 始终在节点下方 */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          fontFamily: "'Nunito', sans-serif",
          fontSize: '10px',
          fontWeight: 700,
          color: isActive
            ? '#a78bfa'
            : isLocked ? 'rgba(150,100,100,0.4)' : `${dotColor}bb`,
          letterSpacing: '0.04em',
          pointerEvents: 'none',
          textShadow: isLocked ? 'none' : `0 0 8px ${dotColor}55`,
        }}>
          {zone.locked ? '🔒' : isActive ? '✦' : zone.icon} {zone.name}
        </div>

        {/* Tooltip — 解锁且 hover */}
        {isHovered && !isLocked && (
          <div style={{
            ...tooltipPos,
            background: 'rgba(8,6,22,0.92)',
            border: `1px solid ${dotColor}35`,
            borderRadius: '12px',
            padding: '10px 14px',
            width: '168px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            backdropFilter: 'blur(16px)',
            boxShadow: `0 6px 24px rgba(0,0,0,0.6), 0 0 12px ${dotColor}18`,
            zIndex: 20,
            animation: tooltipAnimation,
          }}>
            {/* 连接线 */}
            <div style={connectorPos} />

            {/* 标题 */}
            <div style={{
              fontFamily: "'Fredoka One', cursive", fontSize: '13px',
              color: `${dotColor}ee`, display: 'flex', gap: '5px', alignItems: 'center',
            }}>
              <span>{zone.icon}</span><span>{zone.name}</span>
            </div>

            {/* 时间 */}
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(180,160,255,0.7)' }}>
              ⏱ {zone.hours}h journey
            </div>

            {/* 奖励 + 能量 */}
            <div style={{ display: 'flex', gap: '8px', fontSize: '11px', fontWeight: 700, flexWrap: 'wrap' }}>
              <span style={{ color: '#fbbf24' }}>🪙 {zone.minCoins}–{zone.maxCoins}</span>
              <span style={{ color: 'rgba(200,180,255,0.4)' }}>·</span>
              <span style={{ color: noEnergy ? '#f87171' : 'rgba(200,180,255,0.7)' }}>
                ⚡ {zone.energyCost}
                {noEnergy && <span style={{ fontSize: '10px', marginLeft: '3px', color: '#f87171' }}>low</span>}
              </span>
            </div>

            {/* 发送按钮 */}
            <button
              onClick={e => { e.stopPropagation(); onSend(zone) }}
              disabled={noEnergy}
              style={{
                background: noEnergy
                  ? 'rgba(240,80,80,0.08)'
                  : `linear-gradient(135deg, ${dotColor}28, ${dotColor}18)`,
                border: `1px solid ${noEnergy ? 'rgba(240,80,80,0.2)' : dotColor + '50'}`,
                borderRadius: '8px',
                padding: '7px 0',
                color: noEnergy ? '#f87171' : `${dotColor}ee`,
                fontFamily: "'Nunito', sans-serif",
                fontSize: '12px',
                fontWeight: 800,
                cursor: noEnergy ? 'not-allowed' : 'pointer',
                width: '100%',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {noEnergy ? '⚡ Not enough energy' : `✦ Send ${petName} (${zone.hours}h)`}
            </button>
          </div>
        )}

        {/* 锁定 tooltip */}
        {zone.locked && isHovered && (
          <div style={{
            ...tooltipPos,
            background: 'rgba(8,6,22,0.85)',
            border: '1px solid rgba(100,50,50,0.25)',
            borderRadius: '8px',
            padding: '7px 12px',
            fontSize: '11px',
            fontWeight: 700,
            color: 'rgba(200,130,130,0.6)',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(10px)',
            zIndex: 20,
            animation: tooltipAnimation,
          }}>
            🔒 Reach Level 8 to unlock
          </div>
        )}

        {/* 任务进行中，其他区域 tooltip */}
        {hasActiveQuest && !isActive && !zone.locked && isHovered && (
          <div style={{
            ...tooltipPos,
            background: 'rgba(8,6,22,0.85)',
            border: '1px solid rgba(167,139,250,0.2)',
            borderRadius: '8px',
            padding: '7px 12px',
            fontSize: '11px',
            fontWeight: 700,
            color: 'rgba(167,139,250,0.55)',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(10px)',
            zIndex: 20,
            animation: tooltipAnimation,
          }}>
            {petName} is on another quest
          </div>
        )}

      </div>
    </div>
  )
}