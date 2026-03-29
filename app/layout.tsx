'use client'

import './globals.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import WorldLayer from '@/components/WorldLayer'
import DataLostBanner from '@/components/DataLostBanner'
import { GameProvider, useGame } from '@/lib/gameContext'
import { playNavSound } from '@/lib/soundSystem'
import ErrorBoundary from '@/components/ErrorBoundary'

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { state } = useGame()
  const mainRef = useRef<HTMLElement>(null)
  const coinRef = useRef<HTMLDivElement>(null)
  const prevCoins = useRef(state.coins)
  const prevPath = useRef(pathname)
  const hideNav = pathname === '/welcome'

  useEffect(() => {
    if (pathname === prevPath.current || !mainRef.current) return
    prevPath.current = pathname
    gsap.fromTo(mainRef.current,
      { opacity: 0, y: 10, scale: 0.992 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' }
    )
  }, [pathname])

  useEffect(() => {
    if (state.coins !== prevCoins.current && coinRef.current) {
      gsap.fromTo(coinRef.current,
        { scale: 1.35 },
        { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' }
      )
      prevCoins.current = state.coins
    }
  }, [state.coins])

  function handleTabClick(e: React.MouseEvent<HTMLAnchorElement>) {
    playNavSound()
    gsap.fromTo(e.currentTarget,
      { scale: 0.88 },
      { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.5)' }
    )
  }

  return (
    <div className="app-shell">
      {!hideNav && (
        <nav>
          <div className="nav-logo">MindQuest</div>
          <div className="nav-tabs">
            {[
              { href: '/', label: '🏠 Home' },
              { href: '/pets', label: '🐾 Pets' },
              { href: '/adventure', label: '⚔️ Quest' },
              { href: '/shop', label: '🛍️ Shop' },
            ].map(tab => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`nav-tab ${pathname === tab.href ? 'active' : ''}`}
                onClick={handleTabClick}
              >
                {tab.label}
              </Link>
            ))}
          </div>
          <div className="nav-right">
            <div ref={coinRef} className="coin-display">
              🪙 {state.coins}
            </div>
          </div>
        </nav>
      )}

      {/* 数据丢失 banner — 全局显示 */}
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