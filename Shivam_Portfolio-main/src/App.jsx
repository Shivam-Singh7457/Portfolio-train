import { useCallback, useState, useRef, useEffect } from 'react'
import Hero from './components/Hero.jsx'
import DepartureBoard from './components/DepartureBoard.jsx'
import ProjectCars from './components/ProjectCars.jsx'
import Skills from './components/Skills.jsx'
import Experience from './components/Experience.jsx'
import Contact from './components/Contact.jsx'
import Ticker from './components/Ticker.jsx'
import { useAudio } from './components/AudioManager.jsx'

export default function App() {
  const audio = useAudio()
  const [started, setStarted] = useState(true)

  useEffect(() => {
    if (!started) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => { document.body.style.overflow = 'auto' }
  }, [started])

  const handleStart = useCallback(async () => {
    await audio.unlock()
    setStarted(true)
  }, [audio])

  const handleJingle = useCallback(() => audio.playJingle(), [audio])
  const handleNav = useCallback(() => audio.playChime(), [audio])
  const handleProject = useCallback(() => audio.playWhistle(), [audio])
  const handleTrainApproach = useCallback(() => audio.playTrainApproach(2.0), [audio])
  const handleTrainWhistle = useCallback(() => audio.playTrainWhistle(), [audio])
  const handleTrainBrake = useCallback(() => audio.playTrainBrake(), [audio])
  const handleTrainSiren = useCallback(() => audio.playTrainSiren(), [audio])

  return (
    <div className="app">
      <Ticker />
      <DepartureBoard onNavClick={handleNav} muted={audio.muted} onToggle={audio.toggle} />
      <main>
        <Hero
          started={started}
          onStart={handleStart}
          onJinglePlay={handleJingle}
          onTrainApproach={handleTrainApproach}
          onTrainWhistle={handleTrainWhistle}
          onTrainBrake={handleTrainBrake}
          onTrainSiren={handleTrainSiren}
        />
        {/* About is inline in hero + first scroll, but add anchor */}
        <section id="about" className="about-section">
          <div className="section-header">
            <div className="section-station-sign">
              <span className="section-icon">🏛️</span>
              <h2 className="section-title">ABOUT THE PASSENGER</h2>
              <span className="section-subtitle">Who's on this train?</span>
            </div>
          </div>
          <div className="about-content">
            <div className="about-card">
              <div className="about-avatar">
                <img
                  src="/profile.png"
                  alt="Shivam Singh"
                  style={{
                    width: '100%',
                    maxWidth: '400px',
                    aspectRatio: '1 / 1',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    border: '3px solid #f5a623'
                  }}
                />
              </div>
              <div className="about-text">
                <h3 className="about-name">Shivam Singh</h3>
                <p className="about-bio">
                  I'm a B.Tech student in AI & Data Science at IIITDM Kurnool,
                  passionate about building intelligent full-stack systems. From architecting
                  federated learning frameworks to crafting pixel-perfect UIs, I thrive at the
                  intersection of Machine Learning and Web Engineering.
                </p>
                <p className="about-bio">
                  When I'm not committing code, I'm solving competitive programming challenges,
                  volunteering with NSS, or chasing hackathon wins — like the 1st place finish
                  at SOLASTA 2026's DataWorks Club Hackathon.
                </p>
                <div className="about-stats">
                  {[
                    { val: '8.11', label: 'CGPA' },
                    { val: '600+', label: 'LeetCode' },
                    { val: '2', label: 'Projects' },
                    { val: '2', label: 'Internship' }
                  ].map(s => (
                    <div key={s.label} className="about-stat">
                      <div className="stat-val">{s.val}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <ProjectCars onProjectClick={handleProject} />
        <Skills />
        <Experience />
        <Contact />
      </main>
    </div>
  )
}
