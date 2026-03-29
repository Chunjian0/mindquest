'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGame } from '@/lib/gameContext'

export default function DataLostBanner() {
  const { dataLost, dismissDataLost } = useGame()
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (dataLost && bannerRef.current) {
      gsap.fromTo(bannerRef.current,
        { opacity: 0, y: -20, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
      )
    }
  }, [dataLost])

  if (!dataLost) return null

  function handleDismiss() {
    if (!bannerRef.current) { dismissDataLost(); return }
    gsap.to(bannerRef.current, {
      opacity: 0, y: -10, scale: 0.96, duration: 0.3, ease: 'power2.in',
      onComplete: dismissDataLost,
    })
  }

  return (
    <div
      ref={bannerRef}
      style={{
        position:      'fixed',
        top:           '80px',
        left:          '50%',
        transform:     'translateX(-50%)',
        zIndex:        1000,
        width:         'calc(100% - 32px)',
        maxWidth:      '500px',
        background:    'linear-gradient(135deg, rgba(30,20,50,0.97), rgba(20,15,40,0.97))',
        border:        '1.5px solid rgba(248,113,113,0.35)',
        borderRadius:  '18px',
        padding:       '16px 18px',
        boxShadow:     '0 8px 32px rgba(0,0,0,0.6)',
        backdropFilter:'blur(16px)',
        display:       'flex',
        flexDirection: 'column',
        gap:           '10px',
      }}
    >
      {/* 标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '22px' }}>🌙</span>
          <div>
            <div style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize:   '15px',
              color:      '#f87171',
              marginBottom: '2px',
            }}>
              Your journey data was lost
            </div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(200,150,150,0.7)' }}>
              Browser storage was cleared
            </div>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          style={{
            background:   'none',
            border:       'none',
            color:        'rgba(200,150,150,0.5)',
            fontSize:     '18px',
            cursor:       'pointer',
            padding:      '0 4px',
            lineHeight:   1,
            flexShrink:   0,
          }}
        >
          ×
        </button>
      </div>

      {/* 说明 */}
      <p style={{
        fontSize:   '12px',
        fontWeight: 600,
        color:      'rgba(180,150,180,0.75)',
        lineHeight: 1.6,
        margin:     0,
      }}>
        Mochi remembers you, even if the data doesn't.
        Your progress will rebuild — conversations, trust, and all.
      </p>

      {/* 提示如何防止 */}
      <div style={{
        background:   'rgba(0,0,0,0.2)',
        borderRadius: '10px',
        padding:      '8px 12px',
        fontSize:     '11px',
        fontWeight:   600,
        color:        'rgba(160,140,200,0.65)',
        lineHeight:   1.5,
      }}>
        💡 To keep your progress, avoid clearing browser data or use a signed-in account in a future update.
      </div>

      {/* 按钮 */}
      <button
        onClick={handleDismiss}
        style={{
          background:   'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(96,165,250,0.15))',
          border:       '1px solid rgba(168,85,247,0.3)',
          borderRadius: '10px',
          padding:      '9px 0',
          color:        'rgba(200,180,255,0.9)',
          fontFamily:   "'Fredoka One', cursive",
          fontSize:     '13px',
          cursor:       'pointer',
          width:        '100%',
          transition:   'background 0.2s',
        }}
      >
        Start fresh with Mochi ✦
      </button>
    </div>
  )
}