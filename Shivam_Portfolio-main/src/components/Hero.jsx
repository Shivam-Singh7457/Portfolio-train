import { useEffect, useState, useRef } from 'react'
import { resume } from '../data/resume.js'
import TrainSVG from './TrainSVG.jsx'

const TITLE_CHARS = resume.title.split('')

// TIMING (ms from mount)
const T_APPROACH_SOUND = 600   // start distant chugging
const T_WHISTLE        = 900   // far-away steam whistle
const T_HEADLIGHT      = 1000  // headlight glow grows from right
const T_TRAIN_MOVE     = 1200  // CSS transition begins (train slides in, 2 s duration)
const T_BRAKE_SOUND    = 3000  // squeal + hiss (200ms before train settles)
const T_TRAIN_ARRIVED  = 3200  // train fully stopped
const T_NAME           = 3600  // name sign illuminates + jingle
const T_TITLE          = 4600  // title flip animation
const T_TAGLINE        = 6000  // tagline + CTAs fade in

function FlipChar({ char, delay }) {
  const [displayed, setDisplayed] = useState(' ')
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 &|/-'
  
  useEffect(() => {
    let iter = 0
    let id
    
    const timeoutId = setTimeout(() => {
      id = setInterval(() => {
        if (iter < 8) {
          setDisplayed(CHARS[Math.floor(Math.random() * CHARS.length)])
          iter++
        } else {
          setDisplayed(char.toUpperCase())
          clearInterval(id)
        }
      }, 100)
    }, delay || 0)
    
    return () => {
      clearTimeout(timeoutId)
      clearInterval(id)
    }
  }, [char, delay])
  
  return <span className="flip-char">{displayed}</span>
}

function StationClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const h = time.getHours(), m = time.getMinutes(), s = time.getSeconds()
  const hDeg = (h % 12) * 30 + m * 0.5
  const mDeg = m * 6 + s * 0.1
  const sDeg = s * 6
  return (
    <svg viewBox="0 0 80 80" width="80" height="80">
      <circle cx="40" cy="40" r="38" fill="#1a1a2e" stroke="#f5a623" strokeWidth="3"/>
      <circle cx="40" cy="40" r="34" fill="none" stroke="#f5a623" strokeWidth="0.5" opacity="0.3"/>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180
        return <line key={i}
          x1={40 + 28 * Math.cos(angle)} y1={40 + 28 * Math.sin(angle)}
          x2={40 + 33 * Math.cos(angle)} y2={40 + 33 * Math.sin(angle)}
          stroke="#f5a623" strokeWidth={i % 3 === 0 ? 2 : 1}/>
      })}
      <line x1="40" y1="40" x2={40 + 16 * Math.cos((hDeg-90)*Math.PI/180)} y2={40 + 16 * Math.sin((hDeg-90)*Math.PI/180)} stroke="#f4e4c1" strokeWidth="3" strokeLinecap="round"/>
      <line x1="40" y1="40" x2={40 + 22 * Math.cos((mDeg-90)*Math.PI/180)} y2={40 + 22 * Math.sin((mDeg-90)*Math.PI/180)} stroke="#f4e4c1" strokeWidth="2" strokeLinecap="round"/>
      <line x1="40" y1="40" x2={40 + 24 * Math.cos((sDeg-90)*Math.PI/180)} y2={40 + 24 * Math.sin((sDeg-90)*Math.PI/180)} stroke="#e74c3c" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="40" cy="40" r="3" fill="#f5a623"/>
    </svg>
  )
}

// Vanishing-point perspective track that fills the viewport before the train arrives
function PerspectiveTracks() {
  return (
    <svg
      className="perspective-tracks"
      viewBox="0 0 1200 500"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      {/* Sky / atmosphere */}
      <defs>
        <radialGradient id="headlightGlow" cx="100%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#fff7c0" stopOpacity="0.18"/>
          <stop offset="40%" stopColor="#f5a623" stopOpacity="0.07"/>
          <stop offset="100%" stopColor="#f5a623" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="trackFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a4a5a" stopOpacity="0.2"/>
          <stop offset="60%" stopColor="#4a4a5a" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#4a4a5a" stopOpacity="1"/>
        </linearGradient>
        <linearGradient id="sleeperFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a3728" stopOpacity="0.15"/>
          <stop offset="50%" stopColor="#4a3728" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#4a3728" stopOpacity="1"/>
        </linearGradient>
      </defs>

      {/* Headlight glow from far right — atmosphere of oncoming train */}
      <rect x="0" y="0" width="1200" height="500" fill="url(#headlightGlow)"/>

      {/* Vanishing-point rails converge at ~(1200, 280) */}
      {/* Left rail */}
      <polygon
        points="0,490 0,480 1200,275 1200,282"
        fill="url(#trackFade)"
      />
      {/* Right rail */}
      <polygon
        points="180,490 180,480 1200,282 1200,289"
        fill="url(#trackFade)"
      />

      {/* Sleepers in perspective — evenly spaced in VP space */}
      {Array.from({ length: 28 }).map((_, i) => {
        const t = i / 27                // 0 = near (bottom), 1 = far (VP)
        const vpX = 1200, vpY = 282
        const nearLeft = 0, nearRight = 180, nearY = 485
        // interpolate toward vanishing point
        const lx = nearLeft + (vpX - nearLeft) * t
        const rx = nearRight + (vpX - nearRight) * t
        const y  = nearY  + (vpY  - nearY) * t
        const h  = Math.max(1, 10 * (1 - t))
        const opacity = 0.15 + t * 0.7
        return (
          <rect
            key={i}
            x={lx - 6} y={y - h/2}
            width={rx - lx + 12} height={h}
            rx={h * 0.2}
            fill={`rgba(74,55,40,${opacity})`}
          />
        )
      })}

      {/* Faint horizon glow */}
      <ellipse cx="1200" cy="282" rx="120" ry="40" fill="#f5a623" opacity="0.06"/>
      <ellipse cx="1200" cy="282" rx="55" ry="18" fill="#fff7c0" opacity="0.1"/>
    </svg>
  )
}

export default function Hero({ started, onStart, onJinglePlay, onTrainApproach, onTrainWhistle, onTrainBrake, onTrainSiren }) {
  // ── Phase flags ──
  const [showHeadlight, setShowHeadlight]   = useState(false)  // right-side glow
  const [trainMoving,   setTrainMoving]     = useState(false)  // train sliding in
  const [trainArrived,  setTrainArrived]    = useState(false)  // train at rest
  const [showName,      setShowName]        = useState(false)  // name sign
  const [showTitle,     setShowTitle]       = useState(false)  // flip title
  const [showTagline,   setShowTagline]     = useState(false)  // tagline + CTAs
  const [trainDeparting, setTrainDeparting] = useState(false)  // train moving offscreen on tap

  const handleTrainClick = () => {
    if (!trainArrived || trainDeparting) return
    setTrainDeparting(true)
    onTrainWhistle?.()
    setTimeout(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
    }, 1000)
  }

  const heroRef  = useRef(null)
  const trainRef = useRef(null)
  const [steamOrigin, setSteamOrigin] = useState({ x: null, y: null })

  useEffect(() => {
    if (!started) return
    const timers = [
      setTimeout(() => onTrainApproach?.(), T_APPROACH_SOUND),
      setTimeout(() => onTrainWhistle?.(),  T_WHISTLE),
      setTimeout(() => onTrainSiren?.(),    T_WHISTLE),
      setTimeout(() => setShowHeadlight(true), T_HEADLIGHT),
      setTimeout(() => setTrainMoving(true),   T_TRAIN_MOVE),
      setTimeout(() => onTrainBrake?.(),       T_BRAKE_SOUND),
      setTimeout(() => setTrainArrived(true),  T_TRAIN_ARRIVED),
      setTimeout(() => setShowName(true), T_NAME),
      setTimeout(() => setShowTitle(true),   T_TITLE),
      setTimeout(() => setShowTagline(true), T_TAGLINE),
    ]
    return () => timers.forEach(clearTimeout)
  }, [started])

  // Pin steam origin once train is at rest (coords relative to hero section)
  useEffect(() => {
    if (!trainArrived || !trainRef.current || !heroRef.current) return
    const trainRect = trainRef.current.getBoundingClientRect()
    const heroRect  = heroRef.current.getBoundingClientRect()
    setSteamOrigin({
      x: trainRect.left - heroRect.left + trainRect.width * 0.13,
      y: trainRect.top  - heroRect.top  + trainRect.height * 0.3,
    })
  }, [trainArrived])

  return (
    <section className="hero" id="home" ref={heroRef}>
      {/* ── TRACKS-ONLY INITIAL LAYER ── always visible */}
      <div className={`perspective-track-layer ${trainMoving ? 'fading' : ''}`}>
        <PerspectiveTracks />
      </div>

      {/* Headlight beam growing from right before train arrives */}
      <div className={`headlight-beam ${showHeadlight && !trainArrived ? 'visible' : ''}`} />

      {/* ── STATION ARCHITECTURE ── always visible */}
      <div className="station-arch">
        <div className="arch-center">
          <div className="station-clock"><StationClock /></div>
          <div className="station-name-plaque">
            <span className="station-name-text">{resume.station}</span>
          </div>
        </div>
      </div>

      {/* ── APPROACHING STATUS BOARD — shown before train arrives ── */}
      {!trainArrived && (
        <div className={`approaching-board ${trainMoving ? 'urgent' : ''}`}>
          <div className="apb-lines">
            <div className="apb-top">
              {trainMoving ? 'TRAIN NOW ARRIVING — PLATFORM 1' : 'AWAITING TRAIN ON PLATFORM 1'}
            </div>
            <div className="apb-bottom">
              {trainMoving ? 'SHIVAM SINGH EXPRESS' : 'STAND CLEAR OF THE YELLOW LINE'}
            </div>
          </div>
          {trainMoving && <div className="apb-blink" />}
        </div>
      )}

      {/* ── MAIN HERO CONTENT — revealed after train arrives ── */}
      <div className={`hero-content ${showName ? 'revealed' : 'hidden'}`}>
        {/* Name sign */}
        <div className={`name-sign ${showName ? 'illuminated' : ''}`}>
          <div className="sign-border-top" />
          <h1 className="hero-name">{resume.name}</h1>
          <div className="sign-border-bottom" />
        </div>

        {/* Title flip */}
        {showTitle && (
          <div className="departure-announcement">
            <span className="announce-label">▶ NOW DEPARTING</span>
            <div className="announce-board">
              {TITLE_CHARS.map((char, i) => (
                <FlipChar key={i} char={char} delay={i * 45} />
              ))}
            </div>
          </div>
        )}

        {/* Tagline */}
        <p className={`hero-tagline ${showTagline ? 'visible' : ''}`}>
          {resume.tagline}
        </p>

        {/* CTA buttons */}
        <div className={`hero-ctas ${showTagline ? 'visible' : ''}`}>
          <a href="#projects" className="btn-primary">
            <span>🎫</span> Board the Train
          </a>
          <a href="#contact" className="btn-secondary">
            <span>📬</span> Buy a Ticket
          </a>
          <a href="/resume.pdf" download className="btn-secondary" target="_blank" rel="noopener noreferrer">
            <span>📄</span> Download Resume
          </a>
        </div>
      </div>

      {/* ── TRAIN ── */}
      <div
        ref={trainRef}
        className={`train-container ${trainDeparting ? 'departing' : trainMoving ? 'arrived' : 'offscreen'} ${trainArrived && !trainDeparting ? 'stopped' : ''}`}
        onClick={handleTrainClick}
        style={{ cursor: trainArrived && !trainDeparting ? 'pointer' : 'default' }}
      >
        <TrainSVG className="train-svg" />
      </div>

      {/* Platform surface */}
      <div className="platform-surface">
        <div className="platform-edge" />
        <div className="rail rail-top" />
        <div className="rail rail-bottom" />
        <div className="sleepers">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="sleeper" />
          ))}
        </div>
      </div>


    </section>
  )
}
