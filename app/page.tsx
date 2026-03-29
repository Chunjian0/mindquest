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
  const [ready,      setReady]      = useState(false)   // AppLoader 控制
  const [routed,     setRouted]     = useState(false)   // 防止内容闪烁

  const activePet = PETS.find(p => p.id === state.activePet) || PETS[0]

  useEffect(() => {
    // gameContext hydrate 完成后才检查
    // GameProvider 里 hydrated 后 state 会有正确值
    const timer = setTimeout(() => {
      if (!state.hasOnboarded) {
        router.replace('/welcome')
        // 不设 ready，让 loader 继续显示直到跳转完成
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
      {/* Loader — ready 前全屏覆盖，防止闪烁 */}
      <AppLoader ready={ready} />

      {/* 主内容 — 只在 routed 后渲染，防止未授权内容闪现 */}
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

          <div style={{ display: 'flex', gap: '14px', flex: 1, minHeight: 0 }}>
            <div style={{ width: '300px', flexShrink: 0, height: '100%' }}>
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
            <div style={{ flex: 1, height: '100%', minWidth: 0 }}>
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
    </>
  )
}