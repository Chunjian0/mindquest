'use client'

import './globals.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import WorldLayer from '@/components/WorldLayer'
import DataLostBanner from '@/components/DataLostBanner'
import ErrorBoundary from '@/components/ErrorBoundary'
import { GameProvider, useGame } from '@/lib/gameContext'
import ThemeSwitcher from '@/components/ThemeSwitcher'

const NAV_TABS = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/pets', label: 'Pets', icon: '🐾' },
  { href: '/adventure', label: 'Quest', icon: '⚔️' },
  { href: '/shop', label: 'Shop', icon: '🛍️' },
]

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { state } = useGame()
  const mainRef = useRef<HTMLElement>(null)
  const coinRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const prevCoins = useRef(state.coins)
  const prevPath = useRef(pathname)

  const [menuOpen, setMenuOpen] = useState(false)
  const hideNav = pathname === '/welcome'

  // ── 路由切换动画 ─────────────────────────
  useEffect(() => {
    if (pathname === prevPath.current) return
    prevPath.current = pathname
    setMenuOpen(false)   // 路由切换时关闭菜单

    // 用 requestAnimationFrame 确保 DOM 已更新
    requestAnimationFrame(() => {
      if (!mainRef.current) return
      gsap.fromTo(mainRef.current,
        { opacity: 0, y: 10, scale: 0.992 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' }
      )
    })
  }, [pathname])

  // ── Coin 变化动画 ─────────────────────────
  useEffect(() => {
    if (state.coins === prevCoins.current) return
    prevCoins.current = state.coins
    // 确保 ref 存在再动画
    if (!coinRef.current) return
    gsap.fromTo(coinRef.current,
      { scale: 1.35 },
      { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' }
    )
  }, [state.coins])

  // ── 菜单开关动画 ──────────────────────────
  useEffect(() => {
    if (!menuRef.current) return
    if (menuOpen) {
      gsap.fromTo(menuRef.current,
        { opacity: 0, y: -12, scaleY: 0.92 },
        {
          opacity: 1, y: 0, scaleY: 1,
          duration: 0.3, ease: 'back.out(1.4)',
          transformOrigin: 'top center',
        }
      )
      // 汉堡变 X
      if (hamburgerRef.current) {
        const lines = hamburgerRef.current.querySelectorAll('.hb-line')
        if (lines[0] && lines[1] && lines[2]) {
          gsap.to(lines[0], { rotation: 45, y: 6, duration: 0.25 })
          gsap.to(lines[1], { opacity: 0, duration: 0.15 })
          gsap.to(lines[2], { rotation: -45, y: -6, duration: 0.25 })
        }
      }
    } else {
      if (!menuRef.current) return
      gsap.to(menuRef.current,
        {
          opacity: 0, y: -8, scaleY: 0.95,
          duration: 0.2, ease: 'power2.in',
          transformOrigin: 'top center',
        }
      )
      // X 变回汉堡
      if (hamburgerRef.current) {
        const lines = hamburgerRef.current.querySelectorAll('.hb-line')
        if (lines[0] && lines[1] && lines[2]) {
          gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.25 })
          gsap.to(lines[1], { opacity: 1, duration: 0.15 })
          gsap.to(lines[2], { rotation: 0, y: 0, duration: 0.25 })
        }
      }
    }
  }, [menuOpen])

  // 点击外部关闭菜单
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (!menuOpen) return
      const target = e.target as HTMLElement
      if (!target.closest('.mobile-menu') && !target.closest('.hamburger-btn')) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('click', handleOutside)
    return () => document.removeEventListener('click', handleOutside)
  }, [menuOpen])

  function handleTabClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = e.currentTarget
    gsap.fromTo(el,
      { scale: 0.88 },
      { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.5)' }
    )
  }

  if (hideNav) {
    return (
      <div className="app-shell">
        <main ref={mainRef}>{children}</main>
      </div>
    )
  }

  return (
    <div className="app-shell">

      {/* ── Nav ── */}
      <nav style={{ position: 'relative', zIndex: 100 }}>
        <div className="nav-logo">MindQuest</div>

        {/* 桌面 tabs */}
        <div className="nav-tabs desktop-tabs">
          {NAV_TABS.map(tab => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`nav-tab ${pathname === tab.href ? 'active' : ''}`}
              onClick={handleTabClick}
            >
              {tab.icon} {tab.label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div ref={coinRef} className="coin-display">
            🪙 {state.coins}
          </div>

          {/* 主题切换 — 和硬币之间 16px 间距 */}
          <div style={{ marginLeft: '8px' }}>
            <ThemeSwitcher />
          </div>

          {/* 汉堡按钮 — 只在手机显示 */}
          <button
            ref={hamburgerRef}
            className="hamburger-btn"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
            style={{
              display: 'none',   // 桌面隐藏，CSS 在 mobile 打开
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '5px',
              width: '36px',
              height: '36px',
              background: 'rgba(168,85,247,0.12)',
              border: '1px solid rgba(168,85,247,0.25)',
              borderRadius: '10px',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="hb-line"
                style={{
                  display: 'block',
                  width: '18px',
                  height: '2px',
                  background: 'rgba(200,180,255,0.85)',
                  borderRadius: '2px',
                  transformOrigin: 'center',
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* ── 手机下拉菜单 ── */}
      <div
        ref={menuRef}
        className="mobile-menu"
        style={{
          display: 'none',    // CSS 在 mobile 打开
          position: 'absolute',
          top: '68px',
          left: 0,
          right: 0,
          zIndex: 99,
          background: 'rgba(10,8,26,0.97)',
          borderBottom: '1px solid rgba(168,85,247,0.15)',
          backdropFilter: 'blur(16px)',
          padding: '8px 16px 16px',
          flexDirection: 'column',
          gap: '4px',
          opacity: 0,           // 初始隐藏
          pointerEvents: menuOpen ? 'all' : 'none',
        }}
      >
        {NAV_TABS.map((tab, i) => (
          <Link
            key={tab.href}
            href={tab.href}
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              background: pathname === tab.href
                ? 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(96,165,250,0.12))'
                : 'transparent',
              border: pathname === tab.href
                ? '1px solid rgba(168,85,247,0.3)'
                : '1px solid transparent',
              color: pathname === tab.href
                ? 'rgba(200,180,255,0.95)'
                : 'rgba(160,140,200,0.7)',
              fontFamily: "'Nunito', sans-serif",
              fontSize: '15px',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.15s',
              animationDelay: `${i * 0.05}s`,
            }}
          >
            <span style={{ fontSize: '18px' }}>{tab.icon}</span>
            {tab.label}
            {pathname === tab.href && (
              <span style={{ marginLeft: 'auto', color: 'rgba(168,85,247,0.8)', fontSize: '12px' }}>
                ✦
              </span>
            )}
          </Link>
        ))}
      </div>

      <DataLostBanner />

      <main ref={mainRef}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </div>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#0a0816" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MindQuest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <GameProvider>
          <WorldLayer />
          <AppShell>{children}</AppShell>
        </GameProvider>
      </body>
    </html>
  )
}