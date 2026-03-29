import gsap from 'gsap'

// ── 页面进场动画 ──────────────────────────────
export function animatePageEnter(container: HTMLElement) {
  const children = container.children

  gsap.fromTo(children,
    { opacity: 0, y: 30, scale: 0.95 },
    {
      opacity:  1,
      y:        0,
      scale:    1,
      duration: 0.6,
      stagger:  0.1,
      ease:     'back.out(1.4)',
    }
  )
}

// ── 宠物舞台进场 ──────────────────────────────
export function animatePetStageEnter(el: HTMLElement) {
  gsap.fromTo(el,
    { opacity: 0, scale: 0.8, y: 20 },
    {
      opacity:  1,
      scale:    1,
      y:        0,
      duration: 0.8,
      ease:     'elastic.out(1, 0.5)',
    }
  )
}

// ── 宠物心情切换 ──────────────────────────────
export function animateMoodChange(
  el: HTMLElement,
  mood: string,
  onMidpoint: () => void
) {
  const tl = gsap.timeline()

  if (mood === 'happy') {
    tl.to(el, { scale: 1.3, rotation: -10, duration: 0.15, ease: 'power2.out' })
      .to(el, { scale: 0.9, rotation:  10, duration: 0.12, ease: 'power2.in'  })
      .call(onMidpoint)
      .to(el, { scale: 1.1, rotation:  -5, duration: 0.15, ease: 'power2.out' })
      .to(el, { scale: 1,   rotation:   0, duration: 0.2,  ease: 'elastic.out(1, 0.4)' })

  } else if (mood === 'sad') {
    tl.to(el, { scale: 0.9, y: 8,  rotation: -3, duration: 0.4, ease: 'power2.out' })
      .call(onMidpoint)
      .to(el, { scale: 1,   y: 0,  rotation:  0, duration: 0.5, ease: 'power2.inOut' })

  } else if (mood === 'anxious') {
    tl.to(el, { x: -6, rotation: -3, duration: 0.07, ease: 'power1.inOut' })
      .to(el, { x:  6, rotation:  3, duration: 0.07, ease: 'power1.inOut' })
      .to(el, { x: -4, rotation: -2, duration: 0.07, ease: 'power1.inOut' })
      .to(el, { x:  4, rotation:  2, duration: 0.07, ease: 'power1.inOut' })
      .call(onMidpoint)
      .to(el, { x:  0, rotation:  0, duration: 0.3,  ease: 'elastic.out(1, 0.3)' })

  } else if (mood === 'calm') {
    tl.to(el, { scale: 0.95, duration: 0.3, ease: 'power1.out' })
      .call(onMidpoint)
      .to(el, { scale: 1,    duration: 0.8, ease: 'elastic.out(1, 0.3)' })

  } else {
    tl.to(el, { opacity: 0, scale: 0.9, duration: 0.2, ease: 'power2.in' })
      .call(onMidpoint)
      .to(el, { opacity: 1, scale: 1,   duration: 0.3, ease: 'back.out(1.7)' })
  }

  return tl
}

// ── 消息进场 ──────────────────────────────────
export function animateMessageIn(el: HTMLElement, type: 'user' | 'mochi' | 'system') {
  const fromX = type === 'user' ? 30 : type === 'mochi' ? -30 : 0

  gsap.fromTo(el,
    { opacity: 0, x: fromX, scale: 0.92, y: 10 },
    {
      opacity:  1,
      x:        0,
      scale:    1,
      y:        0,
      duration: 0.45,
      ease:     'back.out(1.7)',
    }
  )
}

// ── Stat bar 动画 ─────────────────────────────
export function animateStatBar(el: HTMLElement, targetWidth: number) {
  gsap.to(el, {
    width:    `${targetWidth}%`,
    duration: 1.2,
    ease:     'elastic.out(1, 0.5)',
  })
}

// ── 奖励 Toast 进场 ───────────────────────────
export function animateToastIn(el: HTMLElement) {
  gsap.fromTo(el,
    { opacity: 0, x: 60, scale: 0.8, rotation: 5 },
    {
      opacity:  1,
      x:        0,
      scale:    1,
      rotation: 0,
      duration: 0.5,
      ease:     'back.out(2)',
    }
  )
}

export function animateToastOut(el: HTMLElement) {
  gsap.to(el, {
    opacity:  0,
    x:        60,
    scale:    0.85,
    duration: 0.3,
    ease:     'power2.in',
  })
}

// ── Coin 数字跳动 ─────────────────────────────
export function animateCoinChange(el: HTMLElement) {
  gsap.fromTo(el,
    { scale: 1.5, color: '#fbbf24' },
    {
      scale:    1,
      color:    '#fbbf24',
      duration: 0.5,
      ease:     'elastic.out(1, 0.4)',
    }
  )
}

// ── Nav tab 点击 ──────────────────────────────
export function animateNavTab(el: HTMLElement) {
  gsap.fromTo(el,
    { scale: 0.9 },
    {
      scale:    1,
      duration: 0.4,
      ease:     'elastic.out(1, 0.5)',
    }
  )
}

// ── 宠物卡片 hover ────────────────────────────
export function animatePetCardHover(el: HTMLElement, entering: boolean) {
  gsap.to(el, {
    y:        entering ? -6 : 0,
    scale:    entering ? 1.03 : 1,
    duration: entering ? 0.3 : 0.2,
    ease:     entering ? 'back.out(2)' : 'power2.out',
  })
}

// ── Quest 卡片切换 ────────────────────────────
export function animateQuestChange(el: HTMLElement, onMidpoint: () => void) {
  const tl = gsap.timeline()

  tl.to(el, { opacity: 0, y: -10, scale: 0.95, duration: 0.25, ease: 'power2.in' })
    .call(onMidpoint)
    .to(el, { opacity: 1, y:   0, scale: 1,    duration: 0.35, ease: 'back.out(1.7)' })

  return tl
}

// ── Level up 特效 ─────────────────────────────
export function animateLevelUp(el: HTMLElement) {
  const tl = gsap.timeline()

  tl.to(el, { scale: 1.5, rotation: 360, duration: 0.4, ease: 'power2.out' })
    .to(el, { scale: 1.2,              duration: 0.2, ease: 'power1.in'  })
    .to(el, { scale: 1,   rotation: 0, duration: 0.3, ease: 'elastic.out(1, 0.4)' })

  return tl
}

// ── 世界背景切换涟漪 ──────────────────────────
export function animateWorldTransition() {
  const overlay = document.createElement('div')
  overlay.style.cssText = `
    position: fixed; inset: 0; pointer-events: none; z-index: 999;
    background: radial-gradient(circle at center, rgba(168,85,247,0.15), transparent 70%);
  `
  document.body.appendChild(overlay)

  gsap.fromTo(overlay,
    { opacity: 0, scale: 0.5 },
    {
      opacity:  1,
      scale:    2,
      duration: 0.6,
      ease:     'power2.out',
      onComplete: () => {
        gsap.to(overlay, {
          opacity:    0,
          duration:   0.4,
          ease:       'power2.in',
          onComplete: () => overlay.remove(),
        })
      },
    }
  )
}