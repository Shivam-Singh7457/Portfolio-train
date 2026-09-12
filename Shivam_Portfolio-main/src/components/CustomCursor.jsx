import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const trailRef = useRef(null)
  const posRef = useRef({ x: -100, y: -100 })
  const trailPosRef = useRef({ x: -100, y: -100 })
  const rafRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const trail = trailRef.current

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      const { x, y } = posRef.current
      const { x: tx, y: ty } = trailPosRef.current
      trailPosRef.current = { x: tx + (x - tx) * 0.12, y: ty + (y - ty) * 0.12 }

      if (cursor) {
        cursor.style.transform = `translate(${x - 16}px, ${y - 16}px)`
      }
      if (trail) {
        trail.style.transform = `translate(${trailPosRef.current.x - 6}px, ${trailPosRef.current.y - 6}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(animate)

    const onDown = () => cursor && cursor.classList.add('pressed')
    const onUp = () => cursor && cursor.classList.remove('pressed')
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="custom-cursor">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" fill="#f5a623" opacity="0.15" stroke="#f5a623" strokeWidth="1.5" />
          <text x="16" y="21" textAnchor="middle" fontSize="14" fill="#f5a623">🚂</text>
        </svg>
      </div>
      <div ref={trailRef} className="cursor-trail" />
    </>
  )
}
