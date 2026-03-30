'use client'

import { useState, useEffect }            from 'react'
import { useRouter }                      from 'next/navigation'
import PetStage                           from '@/components/PetStage'
import ChatBox                            from '@/components/ChatBox'
import RewardToast                        from '@/components/RewardToast'
import EnergyStatus                       from '@/components/EnergyStatus'
import AppLoader                          from '@/components/AppLoader'
import { emotionToWorldChange, emotionToPetMood } from '@/lib/emotionEngine'
import { storage }                        from '@/lib/storage'
import { useGame }                        from '@/lib/gameContext'
import { PETS }                           from '@/data/pets'
import type { Reward }                    from '@/lib/rewardSystem'

export default function HomePage() {
  const router = useRouter()
  const { state, addCoins, addTrust, addEnergy, spendEnergy, addExp } = useGame()

  const [mood,       setMood]       = useState<'idle'|'happy'|'sad'|'anxious'|'calm'>('idle')
  const [bubble,     setBubble]     = useState<string | undefined>()
  const [returnDays, setReturnDays] = useState(0)
  const [toast,      setToast]      = useState<{ icon: string; label: string; value: string } | null>(null)
  const [ready,      setReady]      = useState(false)
  const [routed,     setRouted]     = useState(false)

  const activePet = PETS.find(p => p.id === state.activePet) || PETS[0]

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!state.hasOnboarded) {
        router.replace('/welcome')
      } else {
        setRouted(true)
        setReady(true)
      }
    }, 120)
    return () => clearTimeout(timer)
  }, [state.hasOnboarded])

  useEffect(() => {
    if (!routed) return
    const last = storage.getLastVisit()
    if (last) {
      const days = Math.floor((Date.now() - last) / 86400000)
      if (days >= 1) setReturnDays(days)
    }
    storage.setLastVisit()
  }, [routed])

  function showToast(label: string, value: string, icon = '🌟') {
    setToast({ icon, label, value })
    setTimeout(() => setToast(null), 3500)
  }

  function handleEmotion(emotion: string) {
    const wc = emotionToWorldChange(emotion as any)
    Object.entries(wc).forEach(([k, v]) =>
      document.documentElement.style.setProperty(`--world-${k}`, String(v))
    )
    setMood(emotionToPetMood(emotion as any) as any)
    if (state.energy < 100) addEnergy(2)
  }

  function handleReward(r: Reward) {
    addExp(r.exp)
    addTrust(r.trust)
    addCoins(r.coins)
    spendEnergy(r.energyCost)
    showToast('Quest Complete! ✨', `+${r.exp} EXP · +${r.trust} Trust · 🪙 ${r.coins}`)
  }

  return (
    <>
      <AppLoader ready={ready} />

      {routed && (
        <div style={{
          display:       'flex',
          flexDirection: 'column',
          height:        '100%',
          padding:       '16px',
          gap:           '12px',
          overflow:      'hidden',
          boxSizing:     'border-box',
        }}>

          {/* 回归 Banner */}
          {returnDays >= 1 && (
            <div className="return-banner" style={{ flexShrink: 0 }}>
              <div className="banner-emoji">{activePet.emoji}</div>
              <div className="banner-text">
                <strong>
                  {returnDays === 1
                    ? `${activePet.name} waited for you yesterday. 🌙`
                    : `${activePet.name} waited for you for ${returnDays} days. 🌙`}
                </strong>
                <br />They kept the moon on so you could find your way back.
              </div>
            </div>
          )}

          <EnergyStatus />

          {/* ── 主体布局 ── */}
          <div
            className="home-layout"
            style={{
              display:   'flex',
              gap:       '14px',
              flex:      1,
              minHeight: 0,
            }}
          >
            {/* 左边 — 宠物 */}
            <div
              className="pet-stage-wrapper"
              style={{
                width:     '300px',
                flexShrink: 0,
                height:    '100%',
              }}
            >
              <PetStage
                name={activePet.name}
                emoji={(activePet as any).emoji || '🐱'}
                petId={activePet.id}
                mood={mood}
                bubbleText={bubble}
                level={state.level}
                exp={state.exp}
                expMax={state.expMax}
                trust={state.trust}
                energy={state.energy}
              />
            </div>

            {/* 右边 — 聊天 */}
            <div
              className="chat-wrapper"
              style={{
                flex:     1,
                height:   '100%',
                minWidth: 0,
              }}
            >
              <ChatBox
                onEmotionDetected={handleEmotion}
                onRewardGiven={handleReward}
                onMochiReply={setBubble}
              />
            </div>
          </div>

          <RewardToast toast={toast} />
        </div>
      )}

      {/* responsive */}
      <style>{`

        /* ── 手机竖屏 ── */
        @media (max-width: 640px) {

          /* Home 布局改竖向堆叠 */
          .home-layout {
            flex-direction: column !important;
            overflow-y:     auto   !important;
            overflow-x:     hidden !important;
            gap:            10px   !important;
          }

          /* PetStage 手机上固定高度，不要占太多 */
          .pet-stage-wrapper {
            width:      100%  !important;
            height:     220px !important;
            flex-shrink: 0    !important;
          }

          /* ChatBox 撑满剩余空间 */
          .chat-wrapper {
            flex:        1      !important;
            height:      auto   !important;
            min-height:  300px  !important;
          }
        }

        /* ── 超小屏（iPhone SE等）── */
        @media (max-width: 375px) {
          .pet-stage-wrapper {
            height: 180px !important;
          }
        }
      `}</style>
    </>
  )
}