import { useState, useRef } from 'react'
import { resume } from '../data/resume.js'

function ProjectCarSVG({ color, accent }) {
  return (
    <svg viewBox="0 0 220 120" width="220" height="120" style={{ position: 'absolute', bottom: 0, left: 0, pointerEvents: 'none', opacity: 0.18 }}>
      <rect x="5" y="10" width="210" height="85" rx="8" fill={color} stroke={accent} strokeWidth="1.5"/>
      {[0,1,2,3].map(i => (
        <rect key={i} x={18 + i*52} y="22" width="36" height="28" rx="4" fill={accent} opacity="0.3"/>
      ))}
      <rect x="5" y="90" width="210" height="8" rx="2" fill={color}/>
      {[25,75,125,185].map(wx => (
        <circle key={wx} cx={wx} cy="110" r="12" fill="#1a1a2e" stroke={accent} strokeWidth="1.5"/>
      ))}
    </svg>
  )
}

function CaseStudyModal({ project, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ borderColor: project.accentColor }}>
          <div className="modal-train-icon">🚃</div>
          <h3 className="modal-title">{project.fullName}</h3>
          <div className="modal-tech-row">
            {project.tech.map(t => (
              <span key={t} className="tech-badge" style={{ borderColor: project.accentColor, color: project.accentColor }}>{t}</span>
            ))}
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="case-section">
            <div className="case-label">🔴 THE PROBLEM</div>
            <p className="case-text">{project.problem}</p>
          </div>
          <div className="case-section">
            <div className="case-label">🔵 THE STACK</div>
            <p className="case-text">{project.stack}</p>
          </div>
          <div className="case-section">
            <div className="case-label">🟢 THE OUTCOME</div>
            <p className="case-text">{project.outcome}</p>
          </div>
          <div className="case-section">
            <div className="case-label">📋 HIGHLIGHTS</div>
            <ul className="case-bullets">
              {project.bullets.map((b, i) => (
                <li key={i} className="case-bullet">{b}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="modal-footer">
          <span className="modal-period">🗓 {project.period}</span>
        </div>
      </div>
    </div>
  )
}

function ProjectCar({ project, onSelect }) {
  return (
    <div
      className="project-car"
      style={{ '--car-color': project.carColor, '--accent-color': project.accentColor }}
      onClick={() => onSelect(project)}
    >
      <ProjectCarSVG color={project.carColor} accent={project.accentColor} />

      {/* Car top strip */}
      <div className="car-top-strip" style={{ background: project.accentColor }} />

      {/* Car content */}
      <div className="car-content">
        <div className="car-windows">
          <div className="car-window" />
          <div className="car-window" />
          <div className="car-window" />
        </div>

        <div className="car-info">
          <h3 className="car-name">{project.name}</h3>
          <div className="car-period">{project.period}</div>
          <div className="car-tech-row">
            {project.tech.slice(0, 3).map(t => (
              <span key={t} className="car-tech-tag" style={{ color: project.accentColor }}>{t}</span>
            ))}
            {project.tech.length > 3 && (
              <span className="car-tech-more" style={{ color: project.accentColor }}>+{project.tech.length - 3}</span>
            )}
          </div>

          <div className="car-outcome-preview">
            <span className="outcome-icon">✅</span>
            <span className="outcome-text">{project.outcome.split(',')[0]}</span>
          </div>

          <button className="car-expand-btn" style={{ borderColor: project.accentColor, color: project.accentColor }}>
            🔍 View Case Study
          </button>
        </div>
      </div>

      {/* Coupling connectors */}
      <div className="coupling-left">
        <div className="coupling-bar" />
        <div className="coupling-circle" />
      </div>
      <div className="coupling-right">
        <div className="coupling-bar" />
        <div className="coupling-circle" />
      </div>

      {/* Wheels */}
      <div className="car-wheels">
        {[0,1,2,3].map(i => (
          <div key={i} className="car-wheel">
            <div className="wheel-inner" />
            <div className="wheel-hub" />
          </div>
        ))}
      </div>
    </div>
  )
}

function LocoIcon() {
  return (
    <div className="loco-icon">
      <svg viewBox="0 0 100 140" width="100" height="140">
        <rect x="5" y="35" width="90" height="70" rx="8" fill="#8b1a1a"/>
        <rect x="30" y="15" width="40" height="55" rx="5" fill="#7b241c"/>
        <rect x="35" y="22" width="28" height="22" rx="3" fill="#1a6b8a" stroke="#f5a623" strokeWidth="1.2"/>
        <rect x="10" y="58" width="16" height="8" rx="3" fill="#1a1a1a" stroke="#f5a623" strokeWidth="1.5"/>
        <circle cx="18" cy="62" r="4" fill="#fff7c0" opacity="0.9"/>
        <rect x="38" y="10" width="12" height="25" rx="3" fill="#7b241c"/>
        <rect x="35" y="8" width="18" height="5" rx="2" fill="#6e1f1a"/>
        {[30,55,75].map(wx => (
          <circle key={wx} cx={wx} cy="118" r="14" fill="#1a1a2e" stroke="#f5a623" strokeWidth="2"/>
        ))}
        <line x1="30" y1="113" x2="75" y2="113" stroke="#c0392b" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

export default function ProjectCars({ onProjectClick }) {
  const [selectedProject, setSelectedProject] = useState(null)
  const scrollRef = useRef(null)

  const handleSelect = (project) => {
    setSelectedProject(project)
    onProjectClick?.()
  }

  return (
    <section className="projects-section" id="projects">
      <div className="section-header">
        <div className="section-station-sign">
          <span className="section-icon">🚃</span>
          <h2 className="section-title">PROJECT CARRIAGES</h2>
          <span className="section-subtitle">Scroll horizontally — each car is a project</span>
        </div>
      </div>

      <div className="train-track-container">
        {/* Track lines */}
        <div className="track-line track-top" />
        <div className="track-sleepers">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="track-sleeper" />
          ))}
        </div>
        <div className="track-line track-bottom" />

        {/* Scrollable train */}
        <div className="train-scroll" ref={scrollRef}>
          <LocoIcon />
          {resume.projects.map((project) => (
            <ProjectCar key={project.id} project={project} onSelect={handleSelect} />
          ))}
          {/* End bumper */}
          <div className="train-bumper">
            <svg viewBox="0 0 60 140" width="60" height="140">
              <rect x="20" y="30" width="20" height="90" fill="#555" rx="3"/>
              <rect x="10" y="115" width="40" height="8" rx="2" fill="#444"/>
              <rect x="5" y="120" width="50" height="5" rx="2" fill="#f5a623" opacity="0.5"/>
              <rect x="15" y="30" width="30" height="6" rx="2" fill="#333"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="projects-scroll-hint">
        <span>← Scroll to explore all carriages →</span>
      </div>

      {selectedProject && (
        <CaseStudyModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  )
}
