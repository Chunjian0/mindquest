'use client'

import { useState, useRef } from 'react'
import gsap                 from 'gsap'
import { useGame }          from '@/lib/gameContext'
import { SHOP_ITEMS }       from '@/data/pets'
import { playPurchaseSound, playErrorSound } from '@/lib/soundSystem'

// 计算下次7AM重置时间
function getNextResetTime(): Date {
  const now   = new Date()
  const reset = new Date(now)
  reset.setHours(7, 0, 0, 0)
  if (now >= reset) reset.setDate(reset.getDate() + 1)
  return reset
}

function formatNextReset(): string {
  const next     = getNextResetTime()
  const now      = new Date()
  const diffMs   = next.getTime() - now.getTime()
  const hours    = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes  = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${minutes}m`
}

export default function ShopPage() {
  const { state, spendCoins, addTrust, addEnergy, buyShopItem, getItemPurchaseCount } = useGame()
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  function handleBuy(item: typeof SHOP_ITEMS[0]) {
    const count = getItemPurchaseCount(item.id)
    if (count >= item.maxPerDay) {
      playErrorSound()
      showToast(`Daily limit reached. Resets in ${formatNextReset()}`, false)
      return
    }

    const success = spendCoins(item.cost)
    if (!success) {
      playErrorSound() 
      showToast(`Not enough coins! Need ${item.cost} 🪙`, false)
      return
    }
    playPurchaseSound()

    buyShopItem(item.id, item.maxPerDay)
    if (item.stat === 'trust')  addTrust(item.amount)
    if (item.stat === 'energy') addEnergy(item.amount)
    showToast(`${item.name} purchased! ${item.stat} +${item.amount}`)
  }

  return (
    <div style={{
      padding: '16px', height: '100%', overflowY: 'auto',
      display: 'flex', flexDirection: 'column', gap: '14px', boxSizing: 'border-box',
    }}>

      {toast && (
        <div style={{
          background:   toast.ok ? 'rgba(20,40,35,0.85)' : 'rgba(40,20,20,0.85)',
          border:       `1px solid ${toast.ok ? 'rgba(52,211,153,0.25)' : 'rgba(248,113,113,0.25)'}`,
          borderRadius: '12px', padding: '9px 14px', fontWeight: 600, fontSize: '13px',
          color:        toast.ok ? 'rgba(100,220,170,0.9)' : 'rgba(240,120,120,0.9)',
          flexShrink:   0, backdropFilter: 'blur(8px)',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: '22px', color: 'var(--text)' }}>
            🛍️ Shop
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', marginTop: '2px' }}>
            Spend coins, strengthen bonds
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{
            fontFamily: "'Fredoka One', cursive", color: '#fbbf24',
            background: 'rgba(40,30,10,0.6)', border: '1px solid rgba(180,140,40,0.2)',
            padding: '5px 12px', borderRadius: '12px', fontSize: '14px',
          }}>
            🪙 {state.coins}
          </div>
        </div>
      </div>

      {/* 重置时间提示 */}
      <div style={{
        background:   'rgba(10,8,24,0.6)',
        border:       '1px solid rgba(100,80,160,0.15)',
        borderRadius: '10px',
        padding:      '8px 14px',
        fontSize:     '11px',
        fontWeight:   600,
        color:        'rgba(140,120,180,0.6)',
        flexShrink:   0,
        display:      'flex',
        justifyContent: 'space-between',
        alignItems:   'center',
      }}>
        <span>🔄 Daily limit: 2 per item</span>
        <span>Resets in {formatNextReset()} (7:00 AM)</span>
      </div>

      {/* Shop grid */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap:                 '10px',
        flexShrink:          0,
      }}>
        {SHOP_ITEMS.map(item => (
          <ShopItem
            key={item.id}
            item={item}
            canAfford={state.coins >= item.cost}
            purchaseCount={getItemPurchaseCount(item.id)}
            maxPerDay={item.maxPerDay}
            onBuy={() => handleBuy(item)}
          />
        ))}
      </div>
    </div>
  )
}

function ShopItem({ item, canAfford, purchaseCount, maxPerDay, onBuy }: {
  item:          any
  canAfford:     boolean
  purchaseCount: number
  maxPerDay:     number
  onBuy:         () => void
}) {
  const btnRef  = useRef<HTMLButtonElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const isMaxed   = purchaseCount >= maxPerDay
  const canBuy    = canAfford && !isMaxed

  function handleMouseEnter() {
    if (!canBuy || !cardRef.current) return
    gsap.to(cardRef.current, { borderColor: 'rgba(180,140,50,0.35)', duration: 0.3 })
  }

  function handleMouseLeave() {
    if (!cardRef.current) return
    gsap.to(cardRef.current, { borderColor: 'rgba(80,60,120,0.18)', duration: 0.3 })
    if (glowRef.current) gsap.to(glowRef.current, { opacity: 0, scale: 1, duration: 0.4 })
  }

  function handleBtnEnter() {
    if (!canBuy || !glowRef.current || !btnRef.current) return
    gsap.to(glowRef.current, { opacity: 1, scale: 1.05, duration: 0.35 })
    gsap.to(btnRef.current,  { scale: 1.03, duration: 0.2, ease: 'back.out(2)' })
  }

  function handleBtnLeave() {
    if (!glowRef.current || !btnRef.current) return
    gsap.to(glowRef.current, { opacity: 0, scale: 1, duration: 0.3 })
    gsap.to(btnRef.current,  { scale: 1, duration: 0.2 })
  }

  function handleBtnClick() {
    if (!canBuy || !btnRef.current || !glowRef.current) return
    gsap.timeline()
      .to(btnRef.current,  { scale: 0.94, duration: 0.08 })
      .to(glowRef.current, { opacity: 1, scale: 1.15, duration: 0.12 }, '<')
      .to(btnRef.current,  { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.4)' })
      .to(glowRef.current, { opacity: 0, scale: 1, duration: 0.4 }, '-=0.2')
    onBuy()
  }

  return (
    <div ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background:    'linear-gradient(150deg, #0e0c1e, #0a0818)',
        border:        '1px solid rgba(80,60,120,0.18)',
        borderRadius:  '16px', padding: '14px',
        display:       'flex', flexDirection: 'column', gap: '6px',
        position:      'relative', overflow: 'hidden', transition: 'border-color 0.3s',
        opacity:       isMaxed ? 0.6 : 1,
      }}
    >
      {/* 限购徽章 */}
      <div style={{
        position:     'absolute', top: '8px', right: '8px',
        fontFamily:   "'Fredoka One', cursive", fontSize: '10px',
        color:        isMaxed ? '#f87171' : 'rgba(140,120,180,0.6)',
        background:   isMaxed ? 'rgba(240,80,80,0.12)' : 'rgba(80,60,120,0.15)',
        border:       `1px solid ${isMaxed ? 'rgba(240,80,80,0.25)' : 'rgba(80,60,120,0.2)'}`,
        borderRadius: '6px', padding: '1px 6px',
      }}>
        {purchaseCount}/{maxPerDay}
      </div>

      <div style={{ fontSize: '26px', lineHeight: 1, marginBottom: '2px' }}>{item.icon}</div>

      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: '14px', color: 'rgba(210,200,240,0.9)' }}>
        {item.name}
      </div>

      <div style={{ fontSize: '11px', fontWeight: 800, color: '#34d399' }}>
        {item.stat === 'adventure' ? `✦ Adventure +${item.amount}%` : `+${item.amount} ${item.stat}`}
      </div>

      <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(120,105,155,0.7)', lineHeight: 1.4, flexGrow: 1 }}>
        {item.desc}
      </div>

      {isMaxed && (
        <div style={{
          fontSize: '10px', fontWeight: 700,
          color:    'rgba(248,113,113,0.6)',
          textAlign:'center', marginTop: '2px',
        }}>
          Resets in {formatNextReset()}
        </div>
      )}

      {/* 按钮发光层 */}
      <div ref={glowRef} style={{
        position:     'absolute', bottom: '10px', left: '10px', right: '10px', height: '36px',
        borderRadius: '10px',
        background:   'radial-gradient(ellipse at center, rgba(200,160,50,0.35) 0%, transparent 70%)',
        opacity: 0, pointerEvents: 'none', zIndex: 0,
      }} />

      <button
        ref={btnRef}
        onMouseEnter={handleBtnEnter}
        onMouseLeave={handleBtnLeave}
        onClick={handleBtnClick}
        disabled={!canBuy}
        style={{
          marginTop:    '4px',
          background:   canBuy
            ? 'linear-gradient(135deg, rgba(160,110,30,0.18), rgba(180,90,20,0.12))'
            : 'rgba(255,255,255,0.04)',
          border:       `1px solid ${canBuy ? 'rgba(180,140,40,0.28)' : 'rgba(255,255,255,0.05)'}`,
          borderRadius: '10px', padding: '7px 0',
          color:        canBuy ? '#fbbf24' : 'rgba(255,255,255,0.18)',
          fontFamily:   "'Fredoka One', cursive", fontSize: '13px',
          cursor:       canBuy ? 'pointer' : 'not-allowed',
          width:        '100%', position: 'relative', zIndex: 1,
          transition:   'background 0.2s, border-color 0.2s',
        }}
      >
        {isMaxed ? '✦ Daily limit reached' : `🪙 ${item.cost}`}
        {!canAfford && !isMaxed && <span style={{ fontSize: '10px', opacity: 0.5, marginLeft: '4px' }}>· not enough</span>}
      </button>
    </div>
  )
}