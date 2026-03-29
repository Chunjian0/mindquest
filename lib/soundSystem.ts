// 完全用 Web Audio API 合成音效，不需要 mp3 文件

let audioCtx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  // 恢复被暂停的 context（浏览器自动暂停策略）
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

// 通用音符播放
function playTone(
  freq:      number,
  duration:  number,
  type:      OscillatorType = 'sine',
  volume:    number         = 0.15,
  attack:    number         = 0.01,
  decay:     number         = 0.1,
) {
  try {
    const ctx  = getCtx()
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type      = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)

    // Envelope
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch { /* 静默失败 */ }
}

// ── 各种音效 ──────────────────────────────────

// 发送消息 — 轻柔的上升音
export function playSendSound() {
  playTone(440, 0.12, 'sine',     0.1)
  setTimeout(() => playTone(550, 0.1, 'sine', 0.08), 60)
}

// Mochi 回复 — 温柔的两音
export function playMochiReplySound() {
  playTone(660, 0.15, 'sine',     0.12)
  setTimeout(() => playTone(880, 0.2, 'sine', 0.1), 100)
}

// 开心情绪 — 明亮三音上升
export function playHappySound() {
  playTone(523, 0.1, 'sine',      0.1)
  setTimeout(() => playTone(659, 0.1, 'sine', 0.1), 80)
  setTimeout(() => playTone(784, 0.2, 'sine', 0.12), 160)
}

// 悲伤情绪 — 低沉下降
export function playSadSound() {
  playTone(392, 0.2, 'sine',      0.08)
  setTimeout(() => playTone(330, 0.3, 'sine', 0.06), 150)
}

// 焦虑情绪 — 快速不稳定
export function playAnxiousSound() {
  playTone(440, 0.05, 'square',   0.06)
  setTimeout(() => playTone(466, 0.05, 'square', 0.05), 80)
  setTimeout(() => playTone(440, 0.05, 'square', 0.06), 160)
}

// 导航点击 — 轻弹
export function playNavSound() {
  playTone(600, 0.08, 'sine',     0.08)
}

// 购买成功 — 硬币音
export function playPurchaseSound() {
  playTone(800, 0.08, 'sine',     0.1)
  setTimeout(() => playTone(1000, 0.06, 'sine', 0.12), 60)
  setTimeout(() => playTone(1200, 0.1,  'sine', 0.08), 110)
}

// 任务出发 — 冒险感
export function playQuestStartSound() {
  playTone(392, 0.1,  'sine',     0.1)
  setTimeout(() => playTone(494, 0.1, 'sine', 0.1),  80)
  setTimeout(() => playTone(587, 0.15, 'sine', 0.12), 160)
  setTimeout(() => playTone(784, 0.2,  'sine', 0.1),  280)
}

// 任务完成 — 胜利小音乐
export function playQuestCompleteSound() {
  playTone(523, 0.1,  'sine',     0.12)
  setTimeout(() => playTone(659, 0.1,  'sine', 0.12), 100)
  setTimeout(() => playTone(784, 0.1,  'sine', 0.12), 200)
  setTimeout(() => playTone(1047, 0.25, 'sine', 0.15), 320)
}

// Level up — 欢快上升
export function playLevelUpSound() {
  const notes = [523, 659, 784, 1047, 1319]
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15, 'sine', 0.12), i * 80)
  })
}

// 能量回复提示
export function playEnergyRegenSound() {
  playTone(880, 0.15, 'sine',     0.08)
  setTimeout(() => playTone(1100, 0.2, 'sine', 0.06), 100)
}

// Mochi 眨眼 — 极轻微
export function playBlinkSound() {
  playTone(2000, 0.03, 'sine',    0.02)
}

// 错误/不够能量
export function playErrorSound() {
  playTone(200, 0.1,  'sawtooth', 0.08)
  setTimeout(() => playTone(150, 0.15, 'sawtooth', 0.06), 80)
}

// 初始化（需要用户交互后才能播放）
export function initAudio() {
  try {
    getCtx()
  } catch { /* 不支持 */ }
}