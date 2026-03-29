export default function WorldLayer() {
  return (
    <div className="world-layer">
      <div className="world-stars" />
      <div className="world-sparkles">
        <span className="sparkle">✦</span>
        <span className="sparkle">⭐</span>
        <span className="sparkle">✨</span>
        <span className="sparkle">💫</span>
        <span className="sparkle">✦</span>
        <span className="sparkle">⭐</span>
      </div>
      <div className="world-moon" />
      <div className="world-fog" />

      {/* 加 id 方便 JS 控制 */}
      <div className="world-rain" id="world-rain" />

      <div className="world-hearts">
        <span className="heart-particle">💜</span>
        <span className="heart-particle">🩷</span>
        <span className="heart-particle">💙</span>
      </div>
      <div className="world-flowers">
        <span className="flower">🌸</span>
        <span className="flower">🌼</span>
        <span className="flower">🌺</span>
        <span className="flower">🌸</span>
        <span className="flower">🌼</span>
        <span className="flower">🌺</span>
      </div>
    </div>
  )
}