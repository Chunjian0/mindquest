'use client'

import { useRef, useEffect }   from 'react'
import gsap                    from 'gsap'
import { useGame }             from '@/lib/gameContext'
import { PETS }                from '@/data/pets'
import type { UnlockCondition } from '@/data/pets'

const RARITY_COLORS: Record<string, { bg: string; border: string; text: string; label: string }> = {
  common: { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.15)', text: '#9d8fc0', label: 'Common'   },
  rare:   { bg: 'rgba(96,165,250,0.1)',   border: 'rgba(96,165,250,0.3)',   text: '#60a5fa', label: 'Rare'     },
  mythic: { bg: 'rgba(168,85,247,0.12)',  border: 'rgba(168,85,247,0.4)',   text: '#c084fc', label: 'Mythic ✦' },
}

const PET_TRAITS: Record<string, { trait: string; color: string }> = {
  'mochi':      { trait: 'Empathetic',  color: '#ff9f7f' },
  'shiba':      { trait: 'Loyal',       color: '#ffb347' },
  'white-fox':  { trait: 'Mysterious',  color: '#e8e8ff' },
  'owl':        { trait: 'Wise',        color: '#b8a0ff' },
  'frog':       { trait: 'Cheerful',    color: '#7dff9f' },
  'duck':       { trait: 'Unbothered',  color: '#ffe07d' },
  'turtle':     { trait: 'Patient',     color: '#7dffd4' },
  'shadow-cat': { trait: 'Enigmatic',   color: '#c084fc' },
}

// 根据解锁条件计算进度
function getUnlockProgress(condition: UnlockCondition, state: any): number {
  switch (condition.type) {
    case 'level':  return Math.min(state.level,           condition.target)
    case 'trust':  return Math.min(state.trust,           condition.target)
    case 'coins':  return Math.min(state.coins,           condition.target)
    case 'quests': return Math.min(state.questsCompleted || 0, condition.target)
    default:       return 0
  }
}

export default function PetsPage() {
  const { state, setActivePet } = useGame()
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!pageRef.current) return
    const cards = pageRef.current.querySelectorAll('.pet-card-item')
    gsap.fromTo(cards,
      { opacity: 0, y: 24, scale: 0.96 },
      { opacity: 1, y: 0,  scale: 1, duration: 0.45, stagger: 0.07, ease: 'back.out(1.4)' }
    )
  }, [])

  function handleSelectPet(petId: string, locked: boolean) {
    if (locked) return
    setActivePet(petId)
    const card = document.getElementById(`pet-card-${petId}`)
    if (card) {
      gsap.fromTo(card,
        { scale: 0.96 },
        { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' }
      )
    }
  }

  return (
    <div ref={pageRef} style={{
      padding:       '16px',
      overflowY:     'auto',
      height:        '100%',
      display:       'flex',
      flexDirection: 'column',
      gap:           '14px',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: '24px', color: 'var(--text)' }}>
            🐾 My Companions
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', marginTop: '2px' }}>
            Tap to switch active pet ✨
          </div>
        </div>
        <div style={{
          fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)',
          background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)',
          padding: '4px 10px', borderRadius: '12px',
        }}>
          {PETS.filter(p => !p.locked).length}/{PETS.length} unlocked
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {PETS.map(pet => {
          const rarity     = RARITY_COLORS[pet.rarity]
          const trait      = PET_TRAITS[pet.id]
          const isActive   = state.activePet === pet.id
          const isWhiteFox = pet.id === 'white-fox'

          // 实时 trust/energy
          const displayTrust  = isActive ? state.trust  : pet.trust
          const displayEnergy = isActive ? state.energy : pet.energy

          // 解锁进度
          const unlockCond     = (pet as any).unlockCondition as UnlockCondition | undefined
          const unlockProgress = unlockCond ? getUnlockProgress(unlockCond, state) : 0
          const unlockPct      = unlockCond ? (unlockProgress / unlockCond.target) * 100 : 0

          return (
            <PetCard
              key={pet.id}
              pet={pet}
              rarity={rarity}
              trait={trait}
              isActive={isActive}
              isWhiteFox={isWhiteFox}
              displayTrust={displayTrust}
              displayEnergy={displayEnergy}
              unlockCond={unlockCond}
              unlockProgress={unlockProgress}
              unlockPct={unlockPct}
              onSelect={() => handleSelectPet(pet.id, pet.locked)}
            />
          )
        })}
      </div>

      {/* Rarity legend */}
      <div style={{
        background: 'rgba(30,26,58,0.6)', border: '1px solid rgba(168,85,247,0.1)',
        borderRadius: '16px', padding: '12px 16px',
        display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
          RARITY
        </div>
        {Object.entries(RARITY_COLORS).map(([key, val]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: val.text, boxShadow: `0 0 6px ${val.text}`,
            }} />
            <span style={{ fontSize: '11px', fontWeight: 700, color: val.text }}>{val.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── PetCard ────────────────────────────────────
function PetCard({
  pet, rarity, trait, isActive, isWhiteFox,
  displayTrust, displayEnergy,
  unlockCond, unlockProgress, unlockPct,
  onSelect,
}: {
  pet:            any
  rarity:         any
  trait:          any
  isActive:       boolean
  isWhiteFox:     boolean
  displayTrust:   number
  displayEnergy:  number
  unlockCond?:    UnlockCondition
  unlockProgress: number
  unlockPct:      number
  onSelect:       () => void
}) {
  const trustBarRef     = useRef<HTMLDivElement>(null)
  const energyBarRef    = useRef<HTMLDivElement>(null)
  const unlockBarRef    = useRef<HTMLDivElement>(null)
  const prevTrust       = useRef(displayTrust)
  const prevEnergy      = useRef(displayEnergy)
  const prevUnlockPct   = useRef(unlockPct)

  // trust bar 动画
  useEffect(() => {
    if (!trustBarRef.current || displayTrust === prevTrust.current) return
    gsap.to(trustBarRef.current, { width: `${displayTrust}%`, duration: 0.8, ease: 'elastic.out(1, 0.5)' })
    prevTrust.current = displayTrust
  }, [displayTrust])

  // energy bar 动画
  useEffect(() => {
    if (!energyBarRef.current || displayEnergy === prevEnergy.current) return
    gsap.to(energyBarRef.current, { width: `${displayEnergy}%`, duration: 0.8, ease: 'elastic.out(1, 0.5)' })
    prevEnergy.current = displayEnergy
  }, [displayEnergy])

  // unlock progress bar 动画
  useEffect(() => {
    if (!unlockBarRef.current || unlockPct === prevUnlockPct.current) return
    gsap.to(unlockBarRef.current, { width: `${unlockPct}%`, duration: 1, ease: 'power2.out' })
    prevUnlockPct.current = unlockPct
  }, [unlockPct])

  return (
    <div
      id={`pet-card-${pet.id}`}
      className="pet-card-item"
      onClick={onSelect}
      style={{
        background:    pet.locked
          ? 'rgba(16,13,32,0.9)'
          : isActive
            ? 'linear-gradient(150deg, rgba(255,110,180,0.12), rgba(168,85,247,0.15))'
            : 'linear-gradient(150deg, #221f3d, #1a1630)',
        border:        `2px solid ${
          isActive     ? 'rgba(255,110,180,0.6)'
          : pet.locked ? 'rgba(255,255,255,0.05)'
          : rarity.border
        }`,
        borderRadius:  '22px',
        padding:       '16px',
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           '8px',
        cursor:        pet.locked ? 'default' : 'pointer',
        position:      'relative',
        overflow:      'hidden',
        transition:    'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow:     isActive ? '0 0 28px rgba(255,110,180,0.2)' : 'none',
        transform:     isActive ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      {/* Active badge */}
      {isActive && (
        <div style={{
          position: 'absolute', top: '10px', left: '10px',
          background: 'linear-gradient(135deg, #ff6eb4, #a855f7)',
          borderRadius: '8px', padding: '2px 8px',
          fontSize: '10px', fontWeight: 800, color: '#fff',
        }}>
          ACTIVE ✦
        </div>
      )}

      {/* Switch hint */}
      {!pet.locked && !isActive && (
        <div style={{
          position: 'absolute', top: '10px', left: '10px',
          background: 'rgba(168,85,247,0.2)', borderRadius: '8px',
          padding: '2px 8px', fontSize: '10px', fontWeight: 800, color: 'var(--lavender)',
        }}>
          Tap to switch
        </div>
      )}

      {/* Lock icon */}
      {pet.locked && (
        <div style={{ position: 'absolute', top: '10px', right: '12px', fontSize: '16px' }}>🔒</div>
      )}

      {/* Emoji */}
      <div style={{
        fontSize:       '52px',
        width:          '80px', height: '80px',
        display:        'flex', alignItems: 'center', justifyContent: 'center',
        animation:      pet.locked ? 'none' : 'petBreathe 3s ease-in-out infinite',
        filter:         !pet.locked && trait
          ? isWhiteFox
            ? 'brightness(2) saturate(0.1) drop-shadow(0 0 16px rgba(255,255,255,0.7))'
            : `drop-shadow(0 0 12px ${trait.color}88)`
          : 'grayscale(0.6) brightness(0.6)',
        marginTop: '8px',
        opacity:   pet.locked ? 0.7 : 1,
      }}>
        {pet.emoji}
      </div>

      {/* Name */}
      <div style={{
        fontFamily: "'Fredoka One', cursive", fontSize: '17px',
        color: pet.locked ? 'rgba(140,120,170,0.6)' : 'var(--text)',
      }}>
        {pet.name}
      </div>

      {/* Trait */}
      {!pet.locked && trait && (
        <div style={{
          fontSize: '11px', fontWeight: 800, color: trait.color,
          background: `${trait.color}18`, border: `1px solid ${trait.color}44`,
          padding: '2px 10px', borderRadius: '20px',
        }}>
          {trait.trait}
        </div>
      )}

      {/* Rarity */}
      <div style={{
        fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em',
        padding: '2px 10px', borderRadius: '20px',
        background: rarity.bg, border: `1px solid ${rarity.border}`, color: rarity.text,
      }}>
        {rarity.label}
      </div>

      {/* Description */}
      <div style={{
        fontSize: '11px', fontWeight: 600, color: 'var(--text-dim)',
        textAlign: 'center', lineHeight: 1.4, fontStyle: 'italic',
      }}>
        {pet.locked ? (pet as any).unlockHint : (pet as any).description}
      </div>

      {/* 解锁进度条 — 只在锁定且有条件时显示 */}
      {pet.locked && unlockCond && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '2px' }}>
          {/* 进度文字 */}
          <div style={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            fontSize:       '10px',
            fontWeight:     800,
          }}>
            <span style={{ color: 'rgba(140,120,180,0.6)' }}>
              {unlockCond.description}
            </span>
            <span style={{
              color:      unlockProgress >= unlockCond.target ? '#34d399' : 'rgba(168,85,247,0.8)',
              fontFamily: "'Fredoka One', cursive",
            }}>
              {unlockProgress} / {unlockCond.target}
            </span>
          </div>

          {/* 进度条 */}
          <div style={{
            height:       '6px',
            background:   'rgba(255,255,255,0.06)',
            borderRadius: '10px',
            overflow:     'hidden',
            border:       '1px solid rgba(168,85,247,0.1)',
          }}>
            <div
              ref={unlockBarRef}
              style={{
                width:        `${unlockPct}%`,
                height:       '100%',
                background:   unlockPct >= 100
                  ? 'linear-gradient(90deg, #34d399, #22d3ee)'
                  : 'linear-gradient(90deg, #6d28d9, #a855f7)',
                borderRadius: '10px',
                transition:   'width 1s ease',
                boxShadow:    unlockPct >= 100
                  ? '0 0 8px rgba(52,211,153,0.6)'
                  : '0 0 6px rgba(168,85,247,0.4)',
              }}
            />
          </div>

          {/* 完成提示 */}
          {unlockPct >= 100 && (
            <div style={{
              fontSize:  '10px', fontWeight: 700,
              color:     '#34d399', textAlign: 'center',
              animation: 'questGlow 1.5s ease-in-out infinite alternate',
            }}>
              ✦ Ready to unlock!
            </div>
          )}
        </div>
      )}

      {/* 解锁宠物的 Stats */}
      {!pet.locked && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
          <StatBar label="Trust"  value={displayTrust}  color="linear-gradient(90deg, #22d3ee, #34d399)" barRef={trustBarRef}  />
          <StatBar label="Energy" value={displayEnergy} color="linear-gradient(90deg, #fbbf24, #fb923c)" barRef={energyBarRef} />
        </div>
      )}
    </div>
  )
}

function StatBar({ label, value, color, barRef }: {
  label:  string
  value:  number
  color:  string
  barRef: React.RefObject<HTMLDivElement|null>
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: '10px', fontWeight: 800, color: 'var(--text-dim)',
        textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        <span>{label}</span>
        <span style={{ fontFamily: "'Fredoka One', cursive", color: 'var(--text)' }}>{value}</span>
      </div>
      <div style={{
        height: '6px', background: 'rgba(255,255,255,0.07)',
        borderRadius: '10px', overflow: 'hidden',
      }}>
        <div ref={barRef} style={{
          width: `${value}%`, height: '100%',
          background: color, borderRadius: '10px',
          transition: 'width 0.9s cubic-bezier(0.34,1.56,0.64,1)',
        }} />
      </div>
    </div>
  )
}