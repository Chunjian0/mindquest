'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGame } from '@/lib/gameContext'

const ENERGY_REGEN_INTERVAL = 30 * 60 * 1000  // 30分钟
const ENERGY_REGEN_AMOUNT   = 5

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'soon'
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

export default function EnergyStatus() {
  const { state } = useGame()
  const [countdown,    setCountdown]    = useState<number>(0)
  const [justRecharged, setJustRecharged] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)
  const prevEnergy = useRef(state.energy)

  // 计算距离下次回复的时间
  useEffect(() => {
    if (state.energy >= 100) return

    function update() {
      const elapsed   = Date.now() - state.lastEnergyRegen
      const remaining = Math.max(0, ENERGY_REGEN_INTERVAL - elapsed)
      setCountdown(remaining)
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [state.lastEnergyRegen, state.energy])

  // 能量回复时的动画提示
  useEffect(() => {
    if (state.energy > prevEnergy.current && prevEnergy.current < 100) {
      setJustRecharged(true)
      if (bannerRef.current) {
        gsap.fromTo(bannerRef.current,
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
        )
      }
      setTimeout(() => setJustRecharged(false), 3000)
    }
    prevEnergy.current = state.energy
  }, [state.energy])

  // 能量充足时不显示
  if (state.energy > 20 && !justRecharged) return null

  // 刚回复了能量
  if (justRecharged) {
    return (
      <div ref={bannerRef} style={{
        background:   'linear-gradient(135deg, rgba(52,211,153,0.12), rgba(96,165,250,0.08))',
        border:       '1.5px solid rgba(52,211,153,0.3)',
        borderRadius: '14px',
        padding:      '10px 16px',
        display:      'flex',
        alignItems:   'center',
        gap:          '10px',
        flexShrink:   0,
      }}>
        <span style={{ fontSize: '18px' }}>⚡</span>
        <div>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: '13px', color: '#34d399' }}>
            Energy recharged! +{ENERGY_REGEN_AMOUNT}
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(100,200,160,0.7)' }}>
            {state.energy} / 100
          </div>
        </div>
      </div>
    )
  }

  // 能量低但不为 0
  if (state.energy > 0 && state.energy <= 20) {
    return (
      <div style={{
        background:   'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(251,146,60,0.06))',
        border:       '1px solid rgba(251,191,36,0.2)',
        borderRadius: '12px',
        padding:      '8px 14px',
        display:      'flex',
        justifyContent: 'space-between',
        alignItems:   'center',
        flexShrink:   0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>⚡</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(251,191,36,0.85)' }}>
            Low energy ({state.energy}/100)
          </span>
        </div>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(200,160,80,0.6)' }}>
          +{ENERGY_REGEN_AMOUNT} in {formatCountdown(countdown)}
        </span>
      </div>
    )
  }

  // 能量为 0
  return (
    <div ref={bannerRef} style={{
      background:    'linear-gradient(135deg, rgba(248,113,113,0.1), rgba(251,146,60,0.08))',
      border:        '1.5px solid rgba(248,113,113,0.25)',
      borderRadius:  '16px',
      padding:       '14px 16px',
      display:       'flex',
      flexDirection: 'column',
      gap:           '10px',
      flexShrink:    0,
    }}>
      {/* 标题 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>😴</span>
        <div>
          <div style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize:   '14px',
            color:      '#f87171',
          }}>
            {state.activePet === 'mochi' ? 'Mochi' : 'Your companion'} needs to rest
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(200,130,130,0.7)' }}>
            Energy is fully depleted
          </div>
        </div>
      </div>

      {/* 回复倒计时 */}
      <div style={{
        background:   'rgba(0,0,0,0.2)',
        borderRadius: '10px',
        padding:      '8px 12px',
        display:      'flex',
        justifyContent: 'space-between',
        alignItems:   'center',
      }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(200,160,160,0.7)' }}>
          ⏱ Next energy recharge
        </span>
        <span style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize:   '14px',
          color:      '#fb923c',
        }}>
          {formatCountdown(countdown)}
        </span>
      </div>

      {/* 怎么补充能量 */}
      <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(180,150,150,0.65)', lineHeight: 1.6 }}>
        Ways to restore energy:
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {[
          { icon: '⏳', text: `Auto-recharge: +${ENERGY_REGEN_AMOUNT} every 30 min`, color: 'rgba(200,160,160,0.6)' },
          { icon: '🛍️', text: 'Shop → Buy "Warm Wrap" or "Calm Tea"', color: '#fbbf24' },
          { icon: '💬', text: 'Chat with Mochi — talking gives small energy',  color: '#a78bfa' },
        ].map((tip, i) => (
          <div key={i} style={{
            display:    'flex',
            gap:        '8px',
            alignItems: 'flex-start',
            fontSize:   '11px',
            fontWeight: 600,
            color:      tip.color,
          }}>
            <span style={{ flexShrink: 0 }}>{tip.icon}</span>
            <span>{tip.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
