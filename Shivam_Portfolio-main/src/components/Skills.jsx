import { useEffect, useRef, useState } from 'react'
import { resume } from '../data/resume.js'
import { FaJava, FaPython, FaNodeJs, FaReact, FaDocker, FaGitAlt, FaCloud } from 'react-icons/fa'
import { SiCplusplus, SiPostgresql, SiMysql, SiJavascript, SiHtml5, SiExpress, SiMongodb, SiApachekafka, SiGooglecloud, SiRedux, SiPytorch, SiScikitlearn, SiPandas, SiNumpy, SiIntellijidea, SiGnubash, SiPostman } from 'react-icons/si'
import { VscVscode } from 'react-icons/vsc'

const skillLogos = {
  Java: <FaJava />, Python: <FaPython />, 'C/C++': <SiCplusplus />, 'SQL (PostgreSQL)': <SiPostgresql />, MySQL: <SiMysql />,
  'JavaScript (ES6+)': <SiJavascript />, 'HTML/CSS': <SiHtml5 />,
  React: <FaReact />, 'Node.js': <FaNodeJs />, Express: <SiExpress />, MongoDB: <SiMongodb />,
  'Apache Kafka': <SiApachekafka />, Docker: <FaDocker />, GCP: <SiGooglecloud />, Redux: <SiRedux />,
  PyTorch: <SiPytorch />, 'Scikit-learn': <SiScikitlearn />, Pandas: <SiPandas />, NumPy: <SiNumpy />,
  XGBoost: <span style={{fontSize:'1.2em'}}>📊</span>, 'Federated Learning': <span style={{fontSize:'1.2em'}}>🔗</span>, 'Meta-Learning': <span style={{fontSize:'1.2em'}}>🧠</span>,
  Git: <FaGitAlt />, 'VS Code': <VscVscode />, IntelliJ: <SiIntellijidea />, 'Linux Shell Scripting': <SiGnubash />,
  'Oracle Cloud AI': <FaCloud />, Postman: <SiPostman />
}

function SkillRow({ skill, category, delay, visible }) {
  const [arrived, setArrived] = useState(false)

  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setArrived(true), delay)
    return () => clearTimeout(t)
  }, [visible, delay])

  const proficiencyMap = {
    Java: 90, Python: 82, 'C/C++': 75, 'SQL (PostgreSQL)': 78, MySQL: 72,
    'JavaScript (ES6+)': 88, 'HTML/CSS': 85,
    React: 88, 'Node.js': 85, Express: 83, MongoDB: 80,
    'Apache Kafka': 65, Docker: 70, GCP: 65, Redux: 78,
    PyTorch: 78, 'Scikit-learn': 80, Pandas: 82, NumPy: 82,
    XGBoost: 70, 'Federated Learning': 75, 'Meta-Learning': 70,
    Git: 90, 'VS Code': 95, IntelliJ: 80, 'Linux Shell Scripting': 75,
    'Oracle Cloud AI': 65, Postman: 85
  }

  const proficiency = proficiencyMap[skill] || 70
  const statusMap = { 90: 'EXPERT', 80: 'PROFICIENT', 70: 'INTERMEDIATE', 60: 'LEARNING' }
  const getStatus = (p) => {
    if (p >= 88) return 'EXPERT'
    if (p >= 78) return 'PROFICIENT'
    if (p >= 68) return 'INTERMEDIATE'
    return 'LEARNING'
  }
  const status = getStatus(proficiency)
  const statusColor = { EXPERT: '#2ecc71', PROFICIENT: '#3498db', INTERMEDIATE: '#f5a623', LEARNING: '#e67e22' }

  return (
    <div className={`skill-row ${arrived ? 'arrived' : ''}`}>
      <div className="skill-time">{String(delay).padStart(4, '0')}</div>
      <div className="skill-name-col" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="skill-logo" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '1.2em' }}>
          {skillLogos[skill] || '🔸'}
        </span>
        {skill}
      </div>
      <div className="skill-category-col">{category}</div>
      <div className="skill-bar-col">
        <div className="skill-bar-track">
          <div
            className="skill-bar-fill"
            style={{
              width: arrived ? `${proficiency}%` : '0%',
              background: statusColor[status],
              transition: `width ${0.8 + Math.random() * 0.4}s ease ${delay * 0.001 + 0.2}s`
            }}
          />
        </div>
        <span className="skill-pct">{proficiency}%</span>
      </div>
      <div className="skill-status-col" style={{ color: statusColor[status] }}>
        <span className="status-dot" style={{ background: statusColor[status] }} />
        {status}
      </div>
    </div>
  )
}

export default function Skills() {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  let delay = 0

  return (
    <section className="skills-section" id="skills" ref={ref}>
      <div className="section-header">
        <div className="section-station-sign">
          <span className="section-icon">📋</span>
          <h2 className="section-title">ARRIVALS BOARD</h2>
          <span className="section-subtitle">Skills & Proficiency Timetable</span>
        </div>
      </div>

      <div className="timetable">
        {/* Header */}
        <div className="timetable-header">
          <div className="th-time">TIME</div>
          <div className="th-name">SKILL</div>
          <div className="th-category">CATEGORY</div>
          <div className="th-bar">PROFICIENCY</div>
          <div className="th-status">STATUS</div>
        </div>

        {/* Skill rows grouped by category */}
        {Object.entries(resume.skills).map(([category, { icon, items }]) => (
          <div key={category} className="skill-group">
            <div className="skill-group-header">
              <span className="skill-group-icon">{icon}</span>
              <span className="skill-group-name">{category}</span>
            </div>
            {items.map((skill) => {
              const d = delay
              delay += 80
              return (
                <SkillRow
                  key={skill}
                  skill={skill}
                  category={category}
                  delay={d}
                  visible={visible}
                />
              )
            })}
          </div>
        ))}
      </div>

      {/* Achievements panel */}
      <div className="achievements-panel">
        <h3 className="ach-title">🏆 STATION HONOURS BOARD</h3>
        <div className="ach-grid">
          {resume.achievements.map((ach, i) => (
            <div key={i} className="ach-card">
              <div className="ach-icon">{ach.icon}</div>
              <div className="ach-content">
                <div className="ach-name">{ach.title}</div>
                <div className="ach-desc">{ach.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
