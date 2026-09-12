import { useEffect, useRef, useState } from 'react'
import { resume } from '../data/resume.js'

function StopNode({ exp, index, visible }) {
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setRevealed(true), index * 300 + 200)
    return () => clearTimeout(t)
  }, [visible, index])

  return (
    <div className={`timeline-stop ${revealed ? 'revealed' : ''}`} style={{ '--color': exp.color }}>
      {/* Track segment before node */}
      <div className="track-segment">
        <div className="track-rail track-rail-l" />
        <div className="track-rail track-rail-r" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="track-tie" style={{ left: `${10 + i * 14}%` }} />
        ))}
      </div>

      {/* Station node */}
      <div className="stop-node">
        <div className="stop-signal">
          <div className="signal-head" style={{ background: exp.color }}>
            <div className="signal-lens" />
          </div>
          <div className="signal-pole" />
        </div>

        <div className="stop-marker" style={{ borderColor: exp.color }}>
          <div className="stop-marker-inner" style={{ background: exp.color }} />
        </div>

        <div className="stop-label">{exp.stop}</div>
      </div>

      {/* Stop card */}
      <div className="stop-card" style={{ borderColor: exp.color }}>
        <div className="stop-card-header" style={{ background: exp.color }}>
          <div className="stop-company">{exp.company}</div>
          <div className="stop-period">{exp.period}</div>
          <div className="stop-location">📍 {exp.location}</div>
        </div>
        <div className="stop-card-body">
          <div className="stop-role">{exp.role}</div>
          {exp.subtitle && <div className="stop-subtitle">{exp.subtitle}</div>}
          <ul className="stop-achievements">
            {exp.achievements.map((a, i) => (
              <li key={i} className="stop-achievement">
                <span className="ach-bullet" style={{ color: exp.color }}>▶</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function EducationStop({ edu, index, visible }) {
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setRevealed(true), index * 250 + 500)
    return () => clearTimeout(t)
  }, [visible, index])

  return (
    <div className={`edu-stop ${revealed ? 'revealed' : ''}`}>
      <div className="edu-dot" />
      <div className="edu-card">
        <div className="edu-platform">{edu.platform}</div>
        <div className="edu-institution">{edu.institution}</div>
        <div className="edu-degree">{edu.degree}</div>
        <div className="edu-meta">
          <span className="edu-score">{edu.score}</span>
          <span className="edu-sep">·</span>
          <span className="edu-period">{edu.period}</span>
          <span className="edu-sep">·</span>
          <span className="edu-location">📍 {edu.location}</span>
        </div>
      </div>
    </div>
  )
}

export default function Experience() {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.05 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="experience-section" id="experience" ref={ref}>
      <div className="section-header">
        <div className="section-station-sign">
          <span className="section-icon">🛤️</span>
          <h2 className="section-title">JOURNEY SO FAR</h2>
          <span className="section-subtitle">Track record of stops & stations</span>
        </div>
      </div>

      {/* Experience timeline */}
      <div className="timeline-container">
        <div className="timeline-start">
          <div className="terminus-sign">ORIGIN</div>
          <svg viewBox="0 0 60 60" width="60" height="60">
            <circle cx="30" cy="30" r="25" fill="#1a1a2e" stroke="#f5a623" strokeWidth="2"/>
            <text x="30" y="35" textAnchor="middle" fontSize="20" fill="#f5a623">🚀</text>
          </svg>
        </div>

        {resume.experience.map((exp, i) => (
          <StopNode key={exp.id} exp={exp} index={i} visible={visible} />
        ))}

        <div className="timeline-present">
          <div className="track-segment">
            <div className="track-rail track-rail-l" />
            <div className="track-rail track-rail-r" />
          </div>
          <div className="present-sign">PRESENT LOCATION</div>
          <div className="present-pulse" />
        </div>
      </div>

      {/* Education section */}
      <div className="education-section">
        <h3 className="edu-title">📚 ACADEMIC STATIONS</h3>
        <div className="edu-timeline">
          <div className="edu-track" />
          {resume.education.map((edu, i) => (
            <EducationStop key={i} edu={edu} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  )
}
