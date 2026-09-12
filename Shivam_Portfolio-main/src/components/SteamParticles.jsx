import { useEffect, useRef } from 'react'

class Particle {
  constructor(x, y) {
    this.x = x + (Math.random() - 0.5) * 8
    this.y = y
    this.size = Math.random() * 14 + 6
    this.speedY = -(Math.random() * 1.5 + 0.5)
    this.speedX = (Math.random() - 0.5) * 1.2
    this.opacity = Math.random() * 0.5 + 0.3
    this.decay = Math.random() * 0.008 + 0.004
    this.grow = Math.random() * 0.4 + 0.1
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY
    this.opacity -= this.decay
    this.size += this.grow
    this.speedY *= 0.99
  }

  draw(ctx) {
    if (this.opacity <= 0) return
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size)
    grad.addColorStop(0, `rgba(220, 215, 200, ${this.opacity})`)
    grad.addColorStop(1, `rgba(180, 175, 165, 0)`)
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = grad
    ctx.fill()
  }

  isDead() { return this.opacity <= 0 }
}

export default function SteamParticles({ originX, originY, active = true }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const rafRef = useRef(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      const parent = canvas.parentElement
      canvas.width = parent ? parent.offsetWidth : window.innerWidth
      canvas.height = parent ? parent.offsetHeight : window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frameRef.current++

      if (active && frameRef.current % 3 === 0) {
        const chimneyX = originX || canvas.width * 0.35
        const chimneyY = originY || canvas.height * 0.52
        particlesRef.current.push(new Particle(chimneyX, chimneyY))
        if (particlesRef.current.length > 80) {
          particlesRef.current = particlesRef.current.slice(-80)
        }
      }

      particlesRef.current = particlesRef.current.filter(p => {
        p.update()
        p.draw(ctx)
        return !p.isDead()
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [active, originX, originY])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 5
      }}
    />
  )
}
