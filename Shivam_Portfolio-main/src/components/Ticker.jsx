import { useEffect, useRef, useState } from 'react'
import { resume } from '../data/resume.js'

export default function Ticker() {
  const [messages] = useState(resume.tickerMessages)

  return (
    <div className="ticker-bar">
      <div className="ticker-label">📢 ANNOUNCEMENTS</div>
      <div className="ticker-track">
        <div className="ticker-content">
          {[...messages, ...messages].map((msg, i) => (
            <span key={i} className="ticker-item">{msg}<span className="ticker-sep">◆</span></span>
          ))}
        </div>
      </div>
    </div>
  )
}
