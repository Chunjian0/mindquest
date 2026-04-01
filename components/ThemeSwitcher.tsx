'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { THEMES, getTheme, applyTheme, saveTheme, loadTheme } from '@/lib/themeSystem'
import type { ThemeId } from '@/lib/themeSystem'

export default function ThemeSwitcher() {
  const [current,    setCurrent]    = useState<ThemeId>('night')
  const [open,       setOpen]       = useState(false)
  const panelRef   = useRef<HTMLDivElement>(null)
  const btnRef     = useRef<HTMLButtonElement>(null)

  // 初始化
  useEffect(() => {
    const saved = loadTheme()
    setCurrent(saved)
    applyTheme(getTheme(saved))
  }, [])

  // 面板动画
  useEffect(() => {
    if (!panelRef.current) return
    if (open) {
      gsap.fromTo(panelRef.current,
        { opacity: 0, scale: 0.88, y: -8, transformOrigin: 'top right' },
        { opacity: 1, scale: 1,    y: 0,  duration: 0.28, ease: 'back.out(1.6)' }
      )
    } else {
      gsap.to(panelRef.current, {
        opacity: 0, scale: 0.92, y: -6,
        duration: 0.18, ease: 'power2.in',
      })
    }
  }, [open])

  // 按钮 hover
  function handleBtnEnter() {
    if (!btnRef.current) return
    gsap.to(btnRef.current, { scale: 1.12, duration: 0.2, ease: 'back.out(2)' })
  }
  function handleBtnLeave() {
    if (!btnRef.current) return
    gsap.to(btnRef.current, { scale: 1, duration: 0.2 })
  }

  // 点击外部关闭
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!open) return
      const t = e.target as HTMLElement
      if (!t.closest('.theme-switcher-root')) setOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [open])

  function selectTheme(id: ThemeId) {
    setCurrent(id)
    saveTheme(id)

    // 平滑切换：先淡出 overlay，再换主题，再淡入
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position:fixed; inset:0; z-index:9998; pointer-events:none;
      background:rgba(0,0,0,0);
    `
    document.body.appendChild(overlay)

    gsap.to(overlay, {
      background: 'rgba(0,0,0,0.35)',
      duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        applyTheme(getTheme(id))
        gsap.to(overlay, {
          background: 'rgba(0,0,0,0)',
          duration: 0.4, ease: 'power2.out',
          onComplete: () => overlay.remove(),
        })
      },
    })

    setOpen(false)
  }

  const currentTheme = getTheme(current)

  return (
    <div
      className="theme-switcher-root"
      style={{ position: 'relative' }}
    >
      {/* 主题切换按钮 */}
      <button
        ref={btnRef}
        onClick={() => setOpen(o => !o)}
        onMouseEnter={handleBtnEnter}
        onMouseLeave={handleBtnLeave}
        aria-label="Switch theme"
        style={{
          width:          '34px',
          height:         '34px',
          borderRadius:   '50%',
          background:     'rgba(255,255,255,0.06)',
          border:         '1px solid rgba(168,85,247,0.25)',
          backdropFilter: 'blur(12px)',
          cursor:         'pointer',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontSize:       '16px',
          boxShadow:      open
            ? '0 0 14px rgba(168,85,247,0.5), 0 0 28px rgba(168,85,247,0.2)'
            : '0 0 8px rgba(168,85,247,0.2)',
          transition:     'box-shadow 0.25s ease, border-color 0.25s ease',
          borderColor:    open ? 'rgba(168,85,247,0.5)' : 'rgba(168,85,247,0.25)',
        }}
      >
        {currentTheme.icon}
      </button>

      {/* 下拉面板 */}
      <div
        ref={panelRef}
        style={{
          display:        open ? 'flex' : 'none',
          position:       'absolute',
          top:            'calc(100% + 10px)',
          right:          0,
          flexDirection:  'column',
          gap:            '4px',
          background:     'rgba(10,8,26,0.94)',
          border:         '1px solid rgba(168,85,247,0.2)',
          borderRadius:   '16px',
          padding:        '10px',
          minWidth:       '150px',
          backdropFilter: 'blur(20px)',
          boxShadow:      '0 8px 32px rgba(0,0,0,0.5), 0 0 16px rgba(168,85,247,0.1)',
          zIndex:         200,
          opacity:        0,    // GSAP 控制
        }}
      >
        {/* 标题 */}
        <div style={{
          fontSize:      '9px',
          fontWeight:    800,
          color:         'rgba(140,120,180,0.55)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          padding:       '2px 8px 6px',
          borderBottom:  '1px solid rgba(168,85,247,0.1)',
          marginBottom:  '2px',
        }}>
          Theme
        </div>

        {THEMES.map(theme => {
          const isSelected = theme.id === current
          return (
            <button
              key={theme.id}
              onClick={() => selectTheme(theme.id)}
              onMouseEnter={e => gsap.to(e.currentTarget, { x: 3, duration: 0.15 })}
              onMouseLeave={e => gsap.to(e.currentTarget, { x: 0, duration: 0.15 })}
              style={{
                display:        'flex',
                alignItems:     'center',
                gap:            '10px',
                padding:        '8px 10px',
                borderRadius:   '10px',
                border:         isSelected
                  ? '1px solid rgba(168,85,247,0.4)'
                  : '1px solid transparent',
                background:     isSelected
                  ? 'linear-gradient(135deg, rgba(168,85,247,0.18), rgba(96,165,250,0.1))'
                  : 'transparent',
                cursor:         'pointer',
                textAlign:      'left',
                transition:     'background 0.15s, border-color 0.15s',
                width:          '100%',
              }}
            >
              <span style={{ fontSize: '16px', lineHeight: 1 }}>{theme.icon}</span>
              <span style={{
                fontFamily:    "'Nunito', sans-serif",
                fontSize:      '12px',
                fontWeight:    700,
                color:         isSelected
                  ? 'rgba(200,180,255,0.95)'
                  : 'rgba(160,140,200,0.7)',
                flex:          1,
              }}>
                {theme.label}
              </span>
              {isSelected && (
                <span style={{ fontSize: '10px', color: 'rgba(168,85,247,0.7)' }}>✦</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}