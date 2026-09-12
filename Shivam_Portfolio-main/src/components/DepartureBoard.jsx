import { useState, useEffect } from 'react'

const NAV_ITEMS = [
  { label: 'ABOUT',      href: '#about' },
  { label: 'PROJECTS',   href: '#projects' },
  { label: 'SKILLS',     href: '#skills' },
  { label: 'EXPERIENCE', href: '#experience' },
  { label: 'CONTACT',    href: '#contact' },
]

export default function DepartureBoard({ onNavClick, muted, onToggle }) {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    onNavClick?.()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`site-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="site-nav-inner">
        {/* Brand */}
        <a href="#home" className="nav-brand" onClick={e => go(e, '#home')}>
          <span className="nav-brand-mark">🚂</span>
          <span className="nav-brand-text">SHIVAM SINGH</span>
        </a>

        {/* Desktop links */}
        <nav className="nav-links" aria-label="Main navigation">
          {NAV_ITEMS.map(item => (
            <a
              key={item.label}
              href={item.href}
              className="nav-link"
              onClick={e => go(e, item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Audio toggle */}
        <button
          className="nav-audio"
          onClick={onToggle}
          title={muted ? 'Unmute' : 'Mute'}
          aria-label={muted ? 'Unmute audio' : 'Mute audio'}
        >
          {muted ? '🔇' : '🔊'}
        </button>

        {/* Hamburger */}
        <button
          className={`nav-burger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`nav-drawer ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        {NAV_ITEMS.map(item => (
          <a
            key={item.label}
            href={item.href}
            className="nav-drawer-link"
            onClick={e => go(e, item.href)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </header>
  )
}
