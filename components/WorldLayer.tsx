'use client'

import { useEffect, useState } from 'react'
import { loadTheme } from '@/lib/themeSystem'

export default function WorldLayer() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  // 生成雨滴
  const rainDrops = Array.from({ length: 40 }, (_, i) => ({
    left:     `${Math.random() * 100}%`,
    height:   `${60 + Math.random() * 80}px`,
    duration: `${0.6 + Math.random() * 0.8}s`,
    delay:    `${Math.random() * 2}s`,
    opacity:  0.3 + Math.random() * 0.4,
  }))

  // Dream 粒子
  const dreamParticles = Array.from({ length: 15 }, (_, i) => ({
    left:     `${5 + i * 6.5}%`,
    top:      `${10 + (i % 5) * 18}%`,
    size:     `${4 + Math.random() * 6}px`,
    duration: `${3 + Math.random() * 4}s`,
    delay:    `${Math.random() * 3}s`,
  }))

  return (
    <>
      {/* 主背景层 */}
      <div
        className="world-bg"
        style={{
          position:   'fixed',
          inset:      0,
          background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-tertiary) 100%)',
          zIndex:     0,
          transition: 'background 0.8s ease',
          pointerEvents: 'none',
        }}
      />

      {/* 星星层 */}
      <div style={{
        position:   'fixed',
        inset:      0,
        zIndex:     0,
        opacity:    'var(--star-opacity, 0.8)',
        transition: 'opacity 0.8s ease',
        pointerEvents: 'none',
      }}>
        {Array.from({ length: 60 }, (_, i) => (
          <div
            key={i}
            style={{
              position:     'absolute',
              width:        `${1 + Math.random() * 2}px`,
              height:       `${1 + Math.random() * 2}px`,
              borderRadius: '50%',
              background:   'rgba(255,255,255,0.8)',
              left:         `${Math.random() * 100}%`,
              top:          `${Math.random() * 60}%`,
              animation:    `starTwinkle ${2 + Math.random() * 3}s ease-in-out infinite alternate`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* 月亮 */}
      <div style={{
        position:     'fixed',
        top:          '60px',
        right:        '80px',
        width:        '70px',
        height:       '70px',
        borderRadius: '50%',
        background:   'radial-gradient(circle at 40% 40%, #ffe8a0, #f5c842)',
        boxShadow:    '0 0 30px rgba(245,200,66,0.4), 0 0 60px rgba(245,200,66,0.15)',
        zIndex:       0,
        opacity:      'var(--moon-opacity, 1)' as any,
        transition:   'opacity 0.8s ease',
        animation:    'moonFloat 6s ease-in-out infinite alternate',
        pointerEvents:'none',
      }} />

      {/* Sunny 光晕 */}
      <div className="sunny-layer" />

      {/* Rain 雨滴 */}
      <div className="rain-layer">
        {rainDrops.map((drop, i) => (
          <div
            key={i}
            className="rain-drop"
            style={{
              left:              drop.left,
              height:            drop.height,
              animationDuration: drop.duration,
              animationDelay:    drop.delay,
              opacity:           drop.opacity,
            }}
          />
        ))}
      </div>

      {/* Storm 闪电 */}
      <div className="lightning-layer" />

      {/* Dream 粒子 */}
      <div className="dream-particles">
        {dreamParticles.map((p, i) => (
          <div
            key={i}
            className="dream-particle"
            style={{
              left:              p.left,
              top:               p.top,
              width:             p.size,
              height:            p.size,
              animationDuration: p.duration,
              animationDelay:    p.delay,
            }}
          />
        ))}
      </div>

      {/* World 浮动粒子（通用）*/}
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={`particle-${i}`}
          style={{
            position:     'fixed',
            width:        `${2 + (i % 3)}px`,
            height:       `${2 + (i % 3)}px`,
            borderRadius: '50%',
            left:         `${5 + i * 8}%`,
            top:          `${20 + (i % 5) * 12}%`,
            background:   i % 2 === 0
              ? 'var(--particle-color1, rgba(140,100,255,0.6))'
              : 'var(--particle-color2, rgba(96,165,250,0.5))',
            animation:    `particleFloat ${4 + i * 0.4}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.3}s`,
            zIndex:       0,
            pointerEvents:'none',
            transition:   'background 0.8s ease',
          }}
        />
      ))}

      <style>{`
        @keyframes starTwinkle {
          from { opacity: 0.3; transform: scale(1); }
          to   { opacity: 1;   transform: scale(1.4); }
        }
        @keyframes moonFloat {
          from { transform: translateY(0) rotate(-3deg); }
          to   { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes particleFloat {
          from { transform: translateY(0) scale(1);    opacity: 0.4; }
          to   { transform: translateY(-12px) scale(1.3); opacity: 0.9; }
        }
      `}</style>
    </>
  )
}