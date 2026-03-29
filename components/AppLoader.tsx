'use client'

import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'

export default function AppLoader({ ready }: { ready: boolean }) {
  const [visible, setVisible]   = useState(true)
  const loaderRef = useRef<HTMLDivElement>(null)
  const dotsRef   = useRef<HTMLDivElement[]>([])

  // 点点动画
  useEffect(() => {
    dotsRef.current.forEach((dot, i) => {
      if (!dot) return
      gsap.to(dot, {
        y:        -6,
        duration: 0.4,
        repeat:   -1,
        yoyo:     true,
        ease:     'power1.inOut',
        delay:    i * 0.12,
      })
    })
  }, [])

  // ready 时淡出
  useEffect(() => {
    if (!ready || !loaderRef.current) return
    gsap.to(loaderRef.current, {
      opacity:  0,
      scale:    1.04,
      duration: 0.4,
      ease:     'power2.in',
      onComplete: () => setVisible(false),
    })
  }, [ready])

  if (!visible) return null

  return (
    <div
      ref={loaderRef}
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         9999,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '20px',
        background:     'linear-gradient(160deg, #0a0816 0%, #110d24 50%, #0e0a1e 100%)',
      }}
    >
      {/* Logo */}
      <div style={{ fontSize: '48px', animation: 'moonBob 2s ease-in-out infinite alternate' }}>
        🌙
      </div>

      <div style={{
        fontFamily:  "'Fredoka One', cursive",
        fontSize:    '24px',
        background:  'linear-gradient(135deg, #ff6eb4, #c084fc, #60a5fa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor:  'transparent',
        backgroundClip:       'text',
      }}>
        MindQuest
      </div>

      {/* 加载点点 */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            ref={el => { if (el) dotsRef.current[i] = el }}
            style={{
              width:        '6px',
              height:       '6px',
              borderRadius: '50%',
              background:   i === 0 ? '#ff6eb4' : i === 1 ? '#c084fc' : '#60a5fa',
              boxShadow:    `0 0 8px ${i === 0 ? '#ff6eb4' : i === 1 ? '#c084fc' : '#60a5fa'}`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes moonBob {
          from { transform: translateY(0) rotate(-5deg); }
          to   { transform: translateY(-6px) rotate(5deg); }
        }
      `}</style>
    </div>
  )
}