'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

interface Props {
  sounds:      string[]
  translation: string
  onDone?:     () => void
}

export default function CatSpeechBubble({ sounds, translation, onDone }: Props) {
  const [phase,           setPhase]           = useState<'sounds' | 'translation' | 'done'>('sounds')
  const [displayedSound,  setDisplayedSound]  = useState('')
  const [displayedTrans,  setDisplayedTrans]  = useState('')
  const [showTranslation, setShowTranslation] = useState(false)

  const bubbleRef = useRef<HTMLDivElement>(null)
  const transRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!bubbleRef.current) return
    gsap.fromTo(bubbleRef.current,
      { opacity: 0, scale: 0.8, y: 10 },
      { opacity: 1, scale: 1,   y: 0, duration: 0.4, ease: 'back.out(2)' }
    )

    // 1. 打出猫语声音
    const fullSound = sounds.join('  ')
    let   i         = 0
    const typeInterval = setInterval(() => {
      setDisplayedSound(fullSound.slice(0, i + 1))
      i++
      if (i >= fullSound.length) {
        clearInterval(typeInterval)

        // 2. 停顿 800ms 后淡出猫语，显示翻译
        setTimeout(() => {
          setShowTranslation(true)
          setPhase('translation')

          if (transRef.current) {
            gsap.fromTo(transRef.current,
              { opacity: 0, y: 4 },
              { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
            )
          }

          // 3. 翻译逐字打出
          let j = 0
          const transInterval = setInterval(() => {
            setDisplayedTrans(translation.slice(0, j + 1))
            j++
            if (j >= translation.length) {
              clearInterval(transInterval)
              setPhase('done')
              onDone?.()
            }
          }, 45)
        }, 800)
      }
    }, 60)

    return () => clearInterval(typeInterval)
  }, [])

  return (
    <div
      ref={bubbleRef}
      style={{
        position:      'absolute',
        bottom:        '105%',
        left:          '50%',
        transform:     'translateX(-50%)',
        width:         '160px',
        background:    'rgba(10,8,26,0.92)',
        border:        '1px solid rgba(168,85,247,0.25)',
        borderRadius:  '14px',
        padding:       '10px 12px',
        display:       'flex',
        flexDirection: 'column',
        gap:           '6px',
        backdropFilter:'blur(12px)',
        boxShadow:     '0 4px 20px rgba(0,0,0,0.4)',
        zIndex:        20,
        pointerEvents: 'none',
      }}
    >
      {/* 小三角 */}
      <div style={{
        position:    'absolute',
        bottom:      '-7px',
        left:        '50%',
        transform:   'translateX(-50%)',
        width:       0,
        height:      0,
        borderLeft:  '7px solid transparent',
        borderRight: '7px solid transparent',
        borderTop:   '7px solid rgba(168,85,247,0.25)',
      }} />

      {/* 猫语 */}
      <div style={{
        fontFamily:  "'Fredoka One', cursive",
        fontSize:    '13px',
        color:       'rgba(200,180,255,0.95)',
        letterSpacing: '0.02em',
        minHeight:   '18px',
        opacity:     showTranslation ? 0.5 : 1,
        transition:  'opacity 0.4s ease',
      }}>
        {displayedSound}
        {phase === 'sounds' && (
          <span style={{
            display:  'inline-block',
            width:    '2px',
            height:   '14px',
            background: 'rgba(200,180,255,0.8)',
            marginLeft: '1px',
            animation: 'blink 0.6s step-end infinite',
            verticalAlign: 'middle',
          }} />
        )}
      </div>

      {/* 分隔线 */}
      {showTranslation && (
        <div style={{
          height:     '1px',
          background: 'rgba(168,85,247,0.15)',
          margin:     '0 -2px',
        }} />
      )}

      {/* 翻译 */}
      {showTranslation && (
        <div
          ref={transRef}
          style={{
            fontSize:   '11px',
            fontWeight: 600,
            color:      'rgba(180,160,220,0.8)',
            lineHeight: 1.5,
            fontStyle:  'italic',
            minHeight:  '16px',
          }}
        >
          {displayedTrans}
          {phase === 'translation' && (
            <span style={{
              display:    'inline-block',
              width:      '1px',
              height:     '11px',
              background: 'rgba(180,160,220,0.6)',
              marginLeft: '1px',
              animation:  'blink 0.6s step-end infinite',
              verticalAlign: 'middle',
            }} />
          )}
        </div>
      )}
    </div>
  )
}