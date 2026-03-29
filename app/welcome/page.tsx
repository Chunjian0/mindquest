'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter }                   from 'next/navigation'
import gsap                            from 'gsap'
import { useGame }                     from '@/lib/gameContext'

const STARTER_PETS = [
  {
    id:          'mochi',
    name:        'Mochi',
    emoji:       '🐱',
    trait:       'Empathetic',
    description: 'Feels everything deeply. Stays close when the world gets heavy.',
    color:       '#ff6eb4',
    glow:        'rgba(255,110,180,0.5)',
  },
  {
    id:          'shiba',
    name:        'Shiba',
    emoji:       '🐕',
    trait:       'Loyal',
    description: 'Energetic and steadfast. Always shows up, no matter what.',
    color:       '#ffb347',
    glow:        'rgba(251,191,36,0.5)',
  },
  {
    id:          'white-fox',
    name:        'White Fox',
    emoji:       '🦊',
    trait:       'Mysterious',
    description: 'Quiet and perceptive. Notices what others miss.',
    color:       '#e8e8ff',
    glow:        'rgba(220,220,255,0.6)',
  },
]

const ONBOARDING_PAGES = [
  {
    icon:     '💬',
    title:    'Talk to your companion',
    subtitle: 'Honest conversations build trust over time.',
  },
  {
    icon:     '⭐',
    title:    'Complete gentle quests',
    subtitle: 'Small actions help your companion grow.',
  },
  {
    icon:     '🌱',
    title:    'Small steps still count',
    subtitle: 'Even quiet days are part of the journey.',
    isLast:   true,
  },
]

export default function WelcomePage() {
  const router               = useRouter()
  const { setActivePet, completeOnboarding } = useGame()
  const [page,        setPage]        = useState(0) // 0=welcome, 1=choose pet, 2-4=onboarding
  const [selected,    setSelected]    = useState<string | null>(null)
  const [blinking,    setBlinking]    = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef   = useRef<HTMLDivElement>(null)

  // 每次切换页面做进场动画
  useEffect(() => {
    if (!contentRef.current) return
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0,  scale: 1,
        duration: 0.7, ease: 'back.out(1.4)' }
    )
  }, [page])

  function goNext() {
    if (!contentRef.current) return
    gsap.to(contentRef.current, {
      opacity: 0, y: -30, scale: 0.96,
      duration: 0.3, ease: 'power2.in',
      onComplete: () => setPage(p => p + 1),
    })
  }

  function handleSelectPet(id: string) {
    setSelected(id)
    setBlinking(id)

    // Blink 动画
    const card = document.getElementById(`pet-card-${id}`)
    if (card) {
      gsap.timeline()
        .to(card, { opacity: 0.3, duration: 0.08 })
        .to(card, { opacity: 1,   duration: 0.08 })
        .to(card, { opacity: 0.3, duration: 0.08 })
        .to(card, { opacity: 1,   duration: 0.08 })
        .to(card, { scale: 1.04,  duration: 0.3, ease: 'back.out(2)' })
    }

    setTimeout(() => setBlinking(null), 400)
  }

  function handleContinue() {
    if (!selected) return
    setActivePet(selected)
    goNext()
  }

  function handleBegin() {
    completeOnboarding()
    gsap.to(containerRef.current, {
      opacity: 0, scale: 1.05, duration: 0.5, ease: 'power2.in',
      onComplete: () => router.replace('/'),
    })
  }

  const onboardingIndex = page - 2 // page 2,3,4 → index 0,1,2

  return (
    <div
      ref={containerRef}
      style={{
        position:       'fixed',
        inset:          0,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        zIndex:         50,
        padding:        '20px',
      }}
    >
      <div ref={contentRef} style={{ width: '100%', maxWidth: '480px' }}>

        {/* ── Page 0: Welcome ── */}
        {page === 0 && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>

            {/* 月亮图标 */}
            <div style={{
              fontSize:   '64px',
              animation:  'moonBob 4s ease-in-out infinite alternate',
              filter:     'drop-shadow(0 0 30px rgba(251,191,36,0.6))',
            }}>
              🌙
            </div>

            {/* 标题 */}
            <div>
              <h1 style={{
                fontFamily:  "'Fredoka One', cursive",
                fontSize:    'clamp(28px, 5vw, 42px)',
                background:  'linear-gradient(135deg, #ff6eb4, #c084fc, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:      'text',
                marginBottom:        '12px',
                lineHeight:          1.2,
              }}>
                Welcome to MindQuest
              </h1>
              <p style={{
                fontSize:   '15px',
                fontWeight: 600,
                color:      'var(--text-dim)',
                lineHeight: 1.7,
                maxWidth:   '340px',
                margin:     '0 auto',
              }}>
                Your emotions are not enemies.
                <br />
                Some simply need time, space, and kindness.
              </p>
            </div>

            {/* Start button */}
            <StartButton onClick={goNext} label="Start Journey ✦" />

          </div>
        )}

        {/* ── Page 1: Choose Pet ── */}
        {page === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>

            <div style={{ textAlign: 'center' }}>
              <h2 style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize:   'clamp(22px, 4vw, 32px)',
                background: 'linear-gradient(135deg, #c084fc, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:      'text',
                marginBottom:        '8px',
              }}>
                Choose Your Companion
              </h2>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dim)' }}>
                Each companion responds differently, but all grow with trust.
              </p>
            </div>

            {/* Pet cards */}
            <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
              {STARTER_PETS.map(pet => {
                const isSelected = selected === pet.id
                return (
                  <div
                    id={`pet-card-${pet.id}`}
                    key={pet.id}
                    onClick={() => handleSelectPet(pet.id)}
                    style={{
                      flex:          1,
                      maxWidth:      '140px',
                      background:    isSelected
                        ? `linear-gradient(150deg, ${pet.color}22, ${pet.color}11)`
                        : 'linear-gradient(150deg, #221f3d, #1a1630)',
                      border:        `2px solid ${isSelected ? pet.color : 'rgba(168,85,247,0.2)'}`,
                      borderRadius:  '20px',
                      padding:       '16px 12px',
                      display:       'flex',
                      flexDirection: 'column',
                      alignItems:    'center',
                      gap:           '8px',
                      cursor:        'pointer',
                      transition:    'border-color 0.3s, background 0.3s',
                      boxShadow:     isSelected ? `0 0 24px ${pet.glow}` : 'none',
                      transform:     isSelected ? 'scale(1.04)' : 'scale(1)',
                      position:      'relative',
                      overflow:      'hidden',
                    }}
                  >
                    {/* Selected ring */}
                    {isSelected && (
                      <div style={{
                        position:   'absolute',
                        inset:      '-2px',
                        borderRadius: '22px',
                        border:     `2px solid ${pet.color}`,
                        animation:  'questGlow 1.5s ease-in-out infinite alternate',
                        pointerEvents: 'none',
                      }} />
                    )}

                    {/* Emoji */}
                    <div style={{
                      fontSize:   '42px',
                      filter:     isSelected
                        ? `drop-shadow(0 0 16px ${pet.glow})`
                        : 'none',
                      animation:  'petBreathe 3s ease-in-out infinite',
                      transition: 'filter 0.3s',
                      ...(pet.id === 'white-fox' ? {
                        filter: isSelected
                          ? 'brightness(2) saturate(0.1) drop-shadow(0 0 16px rgba(255,255,255,0.8))'
                          : 'brightness(1.8) saturate(0.2)',
                      } : {}),
                    }}>
                      {pet.emoji}
                    </div>

                    {/* Name */}
                    <div style={{
                      fontFamily: "'Fredoka One', cursive",
                      fontSize:   '15px',
                      color:      isSelected ? pet.color : 'var(--text)',
                      transition: 'color 0.3s',
                    }}>
                      {pet.name}
                    </div>

                    {/* Trait */}
                    <div style={{
                      fontSize:     '10px',
                      fontWeight:   800,
                      color:        pet.color,
                      background:   `${pet.color}18`,
                      border:       `1px solid ${pet.color}44`,
                      padding:      '2px 8px',
                      borderRadius: '20px',
                    }}>
                      {pet.trait}
                    </div>

                    {/* Description */}
                    <p style={{
                      fontSize:   '10px',
                      fontWeight: 600,
                      color:      'var(--text-dim)',
                      textAlign:  'center',
                      lineHeight: 1.4,
                      fontStyle:  'italic',
                    }}>
                      {pet.description}
                    </p>

                    {/* Selected checkmark */}
                    {isSelected && (
                      <div style={{
                        position:     'absolute',
                        top:          '8px',
                        right:        '8px',
                        width:        '18px',
                        height:       '18px',
                        borderRadius: '50%',
                        background:   pet.color,
                        display:      'flex',
                        alignItems:   'center',
                        justifyContent: 'center',
                        fontSize:     '10px',
                        color:        '#fff',
                        fontWeight:   900,
                      }}>
                        ✓
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Continue button */}
            <StartButton
              onClick={handleContinue}
              label="Continue ✦"
              disabled={!selected}
              color={selected ? STARTER_PETS.find(p => p.id === selected)?.color : undefined}
            />

          </div>
        )}

        {/* ── Page 2-4: Onboarding ── */}
        {page >= 2 && page <= 4 && (
          <OnboardingCard
            data={ONBOARDING_PAGES[onboardingIndex]}
            page={page}
            total={4}
            onNext={page < 4 ? goNext : handleBegin}
            onSkip={() => handleBegin()}
          />
        )}

      </div>
    </div>
  )
}

// ── Start Button ──────────────────────────────
function StartButton({
  onClick, label, disabled, color,
}: {
  onClick: () => void
  label:   string
  disabled?: boolean
  color?:  string
}) {
  const btnRef = useRef<HTMLButtonElement>(null)

  function handleClick() {
    if (disabled || !btnRef.current) return
    gsap.fromTo(btnRef.current,
      { scale: 0.92 },
      { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' }
    )
    onClick()
  }

  function handleHover(entering: boolean) {
    if (!btnRef.current || disabled) return
    gsap.to(btnRef.current, {
      scale:    entering ? 1.05 : 1,
      duration: 0.3,
      ease:     entering ? 'back.out(2)' : 'power2.out',
    })
  }

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      disabled={disabled}
      style={{
        background:    disabled
          ? 'rgba(168,85,247,0.2)'
          : color
            ? `linear-gradient(135deg, ${color}, ${color}99)`
            : 'linear-gradient(135deg, #ff6eb4, #a855f7)',
        border:        'none',
        borderRadius:  '16px',
        padding:       '14px 40px',
        color:         disabled ? 'var(--text-faint)' : '#fff',
        fontFamily:    "'Fredoka One', cursive",
        fontSize:      '17px',
        cursor:        disabled ? 'not-allowed' : 'pointer',
        boxShadow:     disabled ? 'none' : '0 4px 20px rgba(168,85,247,0.4)',
        transition:    'box-shadow 0.3s, background 0.3s',
        minWidth:      '200px',
      }}
    >
      {label}
    </button>
  )
}

// ── Onboarding Card ───────────────────────────
function OnboardingCard({
  data, page, total, onNext, onSkip,
}: {
  data:   typeof ONBOARDING_PAGES[0]
  page:   number
  total:  number
  onNext: () => void
  onSkip: () => void
}) {
  const iconRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!iconRef.current) return
    gsap.fromTo(iconRef.current,
      { scale: 0.5, rotation: -20, opacity: 0 },
      { scale: 1,   rotation:   0, opacity: 1,
        duration: 0.6, ease: 'back.out(2)', delay: 0.2 }
    )
  }, [data])

  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      gap:            '28px',
      textAlign:      'center',
      position:       'relative',
    }}>

      {/* Skip button */}
      {!data.isLast && (
        <button
          onClick={onSkip}
          style={{
            position:   'absolute',
            top:        '-10px',
            right:      '0',
            background: 'none',
            border:     'none',
            color:      'var(--text-faint)',
            fontSize:   '13px',
            fontWeight: 700,
            cursor:     'pointer',
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          Skip →
        </button>
      )}

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        {ONBOARDING_PAGES.map((_, i) => (
          <div
            key={i}
            style={{
              width:        i === page - 2 ? '20px' : '8px',
              height:       '8px',
              borderRadius: '4px',
              background:   i === page - 2
                ? 'linear-gradient(90deg, #ff6eb4, #a855f7)'
                : 'rgba(168,85,247,0.2)',
              transition:   'all 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Icon */}
      <div
        ref={iconRef}
        style={{
          width:          '100px',
          height:         '100px',
          borderRadius:   '50%',
          background:     'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(96,165,250,0.15))',
          border:         '2px solid rgba(168,85,247,0.3)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontSize:       '44px',
          boxShadow:      '0 0 30px rgba(168,85,247,0.2)',
        }}
      >
        {data.icon}
      </div>

      {/* Text */}
      <div>
        <h2 style={{
          fontFamily:  "'Fredoka One', cursive",
          fontSize:    'clamp(22px, 4vw, 30px)',
          background:  'linear-gradient(135deg, #c084fc, #60a5fa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor:  'transparent',
          backgroundClip:      'text',
          marginBottom:        '12px',
        }}>
          {data.title}
        </h2>
        <p style={{
          fontSize:   '15px',
          fontWeight: 600,
          color:      'var(--text-dim)',
          lineHeight: 1.7,
          maxWidth:   '320px',
          margin:     '0 auto',
        }}>
          {data.subtitle}
        </p>
      </div>

      {/* Button */}
      <StartButton
        onClick={onNext}
        label={data.isLast ? 'Begin ✦' : 'Next →'}
        color={data.isLast ? '#34d399' : undefined}
      />

    </div>
  )
}