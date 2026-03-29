'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface ToastData { icon: string; label: string; value: string }
interface Props     { toast: ToastData | null }

export default function RewardToast({ toast }: Props) {
  const toastRef = useRef<HTMLDivElement>(null)
  const prevToast = useRef<ToastData | null>(null)

  useEffect(() => {
    if (!toastRef.current) return

    if (toast && !prevToast.current) {
      // 进场
      gsap.fromTo(toastRef.current,
        { opacity: 0, x: 80, scale: 0.8, rotation: 5 },
        {
          opacity:  1,
          x:        0,
          scale:    1,
          rotation: 0,
          duration: 0.5,
          ease:     'back.out(2)',
        }
      )
    } else if (!toast && prevToast.current) {
      // 退场
      gsap.to(toastRef.current, {
        opacity:  0,
        x:        80,
        scale:    0.85,
        duration: 0.3,
        ease:     'power2.in',
      })
    }

    prevToast.current = toast
  }, [toast])

  if (!toast && !prevToast.current) return null

  const data = toast || prevToast.current!

  return (
    <div
      ref={toastRef}
      style={{
        position:     'fixed',
        bottom:       '90px',
        right:        '16px',
        background:   'linear-gradient(135deg, #1e1a3a, #251e44)',
        border:       '2px solid rgba(168,85,247,0.4)',
        borderRadius: '20px',
        padding:      '12px 16px',
        display:      'flex',
        gap:          '10px',
        alignItems:   'center',
        zIndex:       100,
        minWidth:     '200px',
        boxShadow:    '0 8px 32px rgba(168,85,247,0.3)',
      }}
    >
      <div style={{ fontSize: '24px' }}>{data.icon}</div>
      <div style={{ fontSize: '13px', lineHeight: 1.4 }}>
        <div style={{ color: 'var(--text-dim)', fontSize: '11px', fontWeight: 700 }}>
          {data.label}
        </div>
        <div style={{ color: 'var(--yellow)', fontFamily: "'Fredoka One', cursive", fontSize: '14px' }}>
          {data.value}
        </div>
      </div>
    </div>
  )
}