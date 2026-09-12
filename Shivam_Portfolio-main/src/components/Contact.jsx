import { useState } from 'react'
import { resume } from '../data/resume.js'

function TicketStub({ contact }) {
  const [copied, setCopied] = useState(null)

  const copy = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <div className="ticket-stub">
      {/* Left portion */}
      <div className="ticket-main">
        <div className="ticket-header">
          <div className="ticket-railway">SHIVAM SINGH RAILWAY</div>
          <div className="ticket-class">FIRST CLASS · ENGINEER</div>
        </div>

        <div className="ticket-route">
          <div className="ticket-from">
            <div className="route-label">FROM</div>
            <div className="route-station">IIITDM KURNOOL</div>
          </div>
          <div className="route-arrow">
            <svg viewBox="0 0 80 20" width="80" height="20">
              <line x1="5" y1="10" x2="70" y2="10" stroke="#f5a623" strokeWidth="2"/>
              <polygon points="65,5 75,10 65,15" fill="#f5a623"/>
              <circle cx="10" cy="10" r="3" fill="#f5a623"/>
              <circle cx="35" cy="10" r="2" fill="#f5a623" opacity="0.5"/>
            </svg>
          </div>
          <div className="ticket-to">
            <div className="route-label">TO</div>
            <div className="route-station">YOUR TEAM</div>
          </div>
        </div>

        <div className="ticket-details">
          <div className="ticket-detail">
            <span className="td-label">DATE</span>
            <span className="td-value">OPEN RETURN</span>
          </div>
          <div className="ticket-detail">
            <span className="td-label">CLASS</span>
            <span className="td-value">FULL-STACK</span>
          </div>
          <div className="ticket-detail">
            <span className="td-label">SEAT</span>
            <span className="td-value">AI/DS ENG.</span>
          </div>
          <div className="ticket-detail">
            <span className="td-label">VALID</span>
            <span className="td-value">IMMEDIATELY</span>
          </div>
        </div>

        <div className="ticket-barcode">
          <svg viewBox="0 0 200 40" width="200" height="40">
            {Array.from({ length: 60 }).map((_, i) => (
              <rect key={i}
                x={i * 3.3}
                y="0"
                width={Math.random() > 0.5 ? 2 : 1}
                height="40"
                fill="#f5a623"
                opacity={0.4 + Math.random() * 0.6}
              />
            ))}
          </svg>
          <div className="barcode-text">S.SINGH · 7457 · MERN · AI</div>
        </div>
      </div>

      {/* Perforation */}
      <div className="ticket-perforation">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="perf-hole" />
        ))}
      </div>

      {/* Right stub */}
      <div className="ticket-coupon">
        <div className="coupon-title">CONTACT<br/>COUPON</div>
        <div className="coupon-id">#{Math.floor(Math.random() * 9000) + 1000}</div>
        <div className="coupon-stamp">VALID</div>
      </div>
    </div>
  )
}

function ContactLink({ icon, label, value, href, sublabel }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      className={`contact-link ${hovered ? 'hovered' : ''}`}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="cl-icon">{icon}</div>
      <div className="cl-info">
        <div className="cl-label">{label}</div>
        <div className="cl-value">{value}</div>
        {sublabel && <div className="cl-sublabel">{sublabel}</div>}
      </div>
      <div className="cl-arrow">→</div>
    </a>
  )
}

export default function Contact() {
  const { contact } = resume

  return (
    <section className="contact-section" id="contact">
      {/* End of line sign */}
      <div className="end-of-line">
        <div className="eol-track-end">
          <svg viewBox="0 0 300 80" width="300" height="80">
            {/* Track approaching bumper */}
            <line x1="0" y1="30" x2="250" y2="30" stroke="#666" strokeWidth="3"/>
            <line x1="0" y1="45" x2="250" y2="45" stroke="#666" strokeWidth="3"/>
            {Array.from({ length: 12 }).map((_, i) => (
              <rect key={i} x={i * 21} y="26" width="14" height="22" rx="2" fill="#4a3728"/>
            ))}
            {/* Bumper */}
            <rect x="252" y="20" width="12" height="40" rx="3" fill="#555"/>
            <rect x="248" y="55" width="28" height="8" rx="2" fill="#444"/>
            <rect x="245" y="60" width="34" height="5" rx="2" fill="#f5a623" opacity="0.6"/>
          </svg>
        </div>
        <div className="eol-sign">
          <div className="eol-text">END OF LINE</div>
          <div className="eol-subtext">But not the end of the journey</div>
        </div>
      </div>

      <div className="section-header">
        <div className="section-station-sign">
          <span className="section-icon">🎫</span>
          <h2 className="section-title">LAST STOP: CONTACT</h2>
          <span className="section-subtitle">All aboard — let's build something great together</span>
        </div>
      </div>

      <div className="contact-layout">
        {/* Ticket stub */}
        <div className="contact-ticket-area">
          <TicketStub contact={contact} />
        </div>

        {/* Contact links */}
        <div className="contact-links-area">
          <h3 className="links-title">📡 COMMUNICATION LINES</h3>
          <div className="contact-links">
            <ContactLink
              icon="📧"
              label="EMAIL"
              value={contact.email}
              href={`mailto:${contact.email}`}
              sublabel="Best way to reach me"
            />
            <ContactLink
              icon="📞"
              label="PHONE"
              value={contact.phone}
              href={`tel:${contact.phone}`}
              sublabel="Available Mon–Sat, 10am–8pm IST"
            />
            <ContactLink
              icon="💼"
              label="LINKEDIN"
              value={contact.linkedinHandle}
              href={`https://${contact.linkedin}`}
              sublabel="Let's connect professionally"
            />
            <ContactLink
              icon="🐙"
              label="GITHUB"
              value={contact.githubHandle}
              href={contact.github}
              sublabel="Browse my code repositories"
            />
          </div>

          <div className="availability-badge">
            <div className="avail-dot" />
            <span className="avail-text">
              Available for Full-Time, Internships & Freelance Projects
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-track">
          <div className="footer-track-line" />
        </div>
        <div className="footer-content">
          <div className="footer-logo">🚂 SHIVAM SINGH EXPRESS</div>
          <div className="footer-copy">
            Built with React · Designed with love for trains · © {new Date().getFullYear()}
          </div>
          <div className="footer-links">
            <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <span>·</span>
            <a href={contact.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <span>·</span>
            <a href={`mailto:${contact.email}`}>Email</a>
          </div>
        </div>
      </footer>
    </section>
  )
}
