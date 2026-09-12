import { useState, useRef, useCallback, useEffect } from 'react'

const JINGLE_NOTES = [
  { freq: 659.25, dur: 0.18 }, { freq: 659.25, dur: 0.18 }, { freq: 659.25, dur: 0.36 },
  { freq: 659.25, dur: 0.18 }, { freq: 659.25, dur: 0.18 }, { freq: 659.25, dur: 0.36 },
  { freq: 659.25, dur: 0.18 }, { freq: 783.99, dur: 0.18 }, { freq: 523.25, dur: 0.18 },
  { freq: 587.33, dur: 0.18 }, { freq: 659.25, dur: 0.54 },
  { freq: 698.46, dur: 0.18 }, { freq: 698.46, dur: 0.18 }, { freq: 698.46, dur: 0.18 }, { freq: 698.46, dur: 0.18 },
  { freq: 698.46, dur: 0.18 }, { freq: 659.25, dur: 0.18 }, { freq: 659.25, dur: 0.18 }, { freq: 659.25, dur: 0.09 },
  { freq: 659.25, dur: 0.09 }, { freq: 587.33, dur: 0.18 }, { freq: 587.33, dur: 0.18 },
  { freq: 659.25, dur: 0.18 }, { freq: 587.33, dur: 0.36 }, { freq: 783.99, dur: 0.36 }
]

export function useAudio() {
  const [muted, setMuted] = useState(false)
  const ctxRef = useRef(null)
  const gainRef = useRef(null)
  const hasPlayedJingleRef = useRef(false)
  const mutedRef = useRef(false)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      gainRef.current = ctxRef.current.createGain()
      gainRef.current.connect(ctxRef.current.destination)
      gainRef.current.gain.value = 0.28
    }
    return ctxRef.current
  }, [])

  // Ensures the AudioContext is running; must be called (or chained from) a user gesture
  const ensureRunning = useCallback(async () => {
    const ctx = getCtx()
    if (ctx.state === 'suspended') await ctx.resume()
    return ctx
  }, [getCtx])

  // Unlock AudioContext on the first user interaction (needed for browser autoplay policy)
  useEffect(() => {
    const unlock = () => {
      if (!ctxRef.current) return
      if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    }
    document.addEventListener('pointerdown', unlock, { once: true, capture: true })
    document.addEventListener('keydown', unlock, { once: true, capture: true })
    return () => {
      document.removeEventListener('pointerdown', unlock, true)
      document.removeEventListener('keydown', unlock, true)
    }
  }, [])

  const playNote = useCallback((freq, startTime, duration, type = 'triangle', vol = 0.3) => {
    if (mutedRef.current) return
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const env = ctx.createGain()
    osc.connect(env)
    env.connect(gainRef.current)
    osc.type = type
    osc.frequency.value = freq
    env.gain.setValueAtTime(0, startTime)
    env.gain.linearRampToValueAtTime(vol, startTime + 0.02)
    env.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
    osc.start(startTime)
    osc.stop(startTime + duration + 0.05)
  }, [getCtx])

  // ── Train approach: rhythmic chugging that grows louder as train nears ──
  const playTrainApproach = useCallback(async (durationSec = 2.0) => {
    if (mutedRef.current) return
    const ctx = await ensureRunning()
    const now = ctx.currentTime

    // Underlying low-frequency rumble that swells
    const rumble = ctx.createOscillator()
    const rumbleGain = ctx.createGain()
    rumble.type = 'sawtooth'
    rumble.frequency.setValueAtTime(38, now)
    rumble.frequency.linearRampToValueAtTime(62, now + durationSec)
    rumbleGain.gain.setValueAtTime(0, now)
    rumbleGain.gain.linearRampToValueAtTime(0.06, now + durationSec * 0.25)
    rumbleGain.gain.linearRampToValueAtTime(0.18, now + durationSec * 0.85)
    rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec + 0.4)
    const rumbleLPF = ctx.createBiquadFilter()
    rumbleLPF.type = 'lowpass'
    rumbleLPF.frequency.value = 180
    rumble.connect(rumbleLPF)
    rumbleLPF.connect(rumbleGain)
    rumbleGain.connect(gainRef.current)
    rumble.start(now)
    rumble.stop(now + durationSec + 0.5)

    // Rhythmic chug-chug bursts (speed increases as train approaches)
    let t = now
    let chugInterval = 0.22
    let chugIdx = 0
    const scheduleChug = () => {
      if (t > now + durationSec + 0.1) return
      const progress = Math.min((t - now) / durationSec, 1)
      const vol = 0.04 + progress * 0.28
      const sampleLen = Math.floor(ctx.sampleRate * 0.055)
      const buf = ctx.createBuffer(1, sampleLen, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < sampleLen; i++) {
        // Sharp attack, fast exponential decay — classic steam chug
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleLen * 0.18))
      }
      const src = ctx.createBufferSource()
      src.buffer = buf
      const g = ctx.createGain()
      g.gain.value = vol
      // Mild HP filter so it doesn't muddy the rumble
      const hpf = ctx.createBiquadFilter()
      hpf.type = 'highpass'
      hpf.frequency.value = 120
      src.connect(hpf)
      hpf.connect(g)
      g.connect(gainRef.current)
      src.start(t)

      // Double-stroke clickety-clack
      const t2 = t + chugInterval * 0.52
      if (t2 < now + durationSec) {
        const src2 = ctx.createBufferSource()
        src2.buffer = buf
        const g2 = ctx.createGain()
        g2.gain.value = vol * 0.65
        src2.connect(hpf.constructor ? ctx.createBiquadFilter() : hpf)
        src2.connect(g2)
        g2.connect(gainRef.current)
        src2.start(t2)
      }

      chugIdx++
      const progress2 = Math.min(chugIdx / (durationSec / chugInterval), 1)
      chugInterval = Math.max(0.08, 0.22 - progress2 * 0.14) // speeds up from 220ms → 80ms
      t += chugInterval
      scheduleChug()
    }
    scheduleChug()
  }, [ensureRunning])

  // ── Steam whistle: two-tone "woo-WOO" ──
  const playTrainWhistle = useCallback(async () => {
    if (mutedRef.current) return
    const ctx = await ensureRunning()
    const now = ctx.currentTime

    const whistle = (freq, start, dur, vol) => {
      const osc = ctx.createOscillator()
      const env = ctx.createGain()
      // Add slight harmonics for a realistic steam whistle timbre
      const osc2 = ctx.createOscillator()
      const env2 = ctx.createGain()
      osc.type = 'sine'
      osc2.type = 'sine'
      osc.frequency.value = freq
      osc2.frequency.value = freq * 2.01   // slightly detuned octave
      env.gain.setValueAtTime(0, start)
      env.gain.linearRampToValueAtTime(vol, start + 0.04)
      env.gain.setValueAtTime(vol, start + dur - 0.06)
      env.gain.exponentialRampToValueAtTime(0.001, start + dur)
      env2.gain.setValueAtTime(0, start)
      env2.gain.linearRampToValueAtTime(vol * 0.35, start + 0.05)
      env2.gain.exponentialRampToValueAtTime(0.001, start + dur)
      osc.connect(env);  env.connect(gainRef.current)
      osc2.connect(env2); env2.connect(gainRef.current)
      osc.start(start); osc.stop(start + dur + 0.05)
      osc2.start(start); osc2.stop(start + dur + 0.05)
    }

    // "woo" short, then "WOO" longer and slightly higher
    whistle(880,  now,        0.18, 0.18)
    whistle(1046.5, now + 0.22, 0.42, 0.22)
  }, [ensureRunning])

  // ── Brake squeal + steam hiss as train stops ──
  const playTrainBrake = useCallback(async () => {
    if (mutedRef.current) return
    const ctx = await ensureRunning()
    const now = ctx.currentTime

    // Metallic brake squeal descending in pitch
    const squeal = ctx.createOscillator()
    const squealGain = ctx.createGain()
    squeal.type = 'sawtooth'
    squeal.frequency.setValueAtTime(2600, now)
    squeal.frequency.exponentialRampToValueAtTime(620, now + 0.65)
    squealGain.gain.setValueAtTime(0, now)
    squealGain.gain.linearRampToValueAtTime(0.13, now + 0.04)
    squealGain.gain.setValueAtTime(0.13, now + 0.4)
    squealGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7)
    // Notch filter so it doesn't hurt ears
    const notch = ctx.createBiquadFilter()
    notch.type = 'peaking'
    notch.frequency.value = 3200
    notch.gain.value = -8
    squeal.connect(notch)
    notch.connect(squealGain)
    squealGain.connect(gainRef.current)
    squeal.start(now)
    squeal.stop(now + 0.8)

    // Steam pressure release hiss
    const hissLen = Math.floor(ctx.sampleRate * 0.9)
    const hissBuf = ctx.createBuffer(1, hissLen, ctx.sampleRate)
    const hissData = hissBuf.getChannelData(0)
    for (let i = 0; i < hissLen; i++) hissData[i] = Math.random() * 2 - 1
    const hissSrc = ctx.createBufferSource()
    hissSrc.buffer = hissBuf
    const hissBPF = ctx.createBiquadFilter()
    hissBPF.type = 'bandpass'
    hissBPF.frequency.value = 3500
    hissBPF.Q.value = 0.7
    const hissGain = ctx.createGain()
    hissGain.gain.setValueAtTime(0, now + 0.5)
    hissGain.gain.linearRampToValueAtTime(0.12, now + 0.62)
    hissGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3)
    hissSrc.connect(hissBPF)
    hissBPF.connect(hissGain)
    hissGain.connect(gainRef.current)
    hissSrc.start(now + 0.5)
  }, [ensureRunning])

  // ── Loud air-horn siren: two blasts (short + long) ──
  const playTrainSiren = useCallback(async () => {
    if (mutedRef.current) return
    const ctx = await ensureRunning()
    const now = ctx.currentTime

    const playBlast = (startT, dur) => {
      // 3-chime chord: Bb3 / D4 / F4
      const freqs = [233.1, 293.7, 349.2]
      freqs.forEach(freq => {
        // Two slightly detuned oscillators per chime for thickness
        ;[freq, freq * 1.004].forEach(f => {
          const osc = ctx.createOscillator()
          const env = ctx.createGain()
          const lpf = ctx.createBiquadFilter()
          osc.type = 'sawtooth'
          osc.frequency.value = f
          lpf.type = 'lowpass'
          lpf.frequency.value = 1400
          lpf.Q.value = 0.6
          // Sharp attack like pressurized air horn, sustain, fast cut
          env.gain.setValueAtTime(0, startT)
          env.gain.linearRampToValueAtTime(0.45, startT + 0.06)
          env.gain.setValueAtTime(0.45, startT + dur - 0.07)
          env.gain.exponentialRampToValueAtTime(0.001, startT + dur)
          osc.connect(lpf)
          lpf.connect(env)
          env.connect(gainRef.current)
          osc.start(startT)
          osc.stop(startT + dur + 0.05)
        })
      })
    }

    // Short blast then long blast — classic two-tone train horn signal
    playBlast(now, 0.38)
    playBlast(now + 0.55, 1.15)
  }, [ensureRunning])

  const playJingle = useCallback(async () => {
    if (mutedRef.current || hasPlayedJingleRef.current) return
    hasPlayedJingleRef.current = true
    const ctx = await ensureRunning()
    let time = ctx.currentTime + 0.3
    JINGLE_NOTES.forEach(({ freq, dur }) => {
      playNote(freq, time, dur, 'triangle', 0.22)
      time += dur + 0.02
    })
  }, [ensureRunning, playNote])

  const playWhistle = useCallback(async () => {
    if (mutedRef.current) return
    const ctx = await ensureRunning()
    const now = ctx.currentTime
    ;[880, 1174.66, 880].forEach((freq, i) => {
      playNote(freq, now + i * 0.15, 0.12, 'sine', 0.15)
    })
  }, [ensureRunning, playNote])

  const playChime = useCallback(async () => {
    if (mutedRef.current) return
    const ctx = await ensureRunning()
    const now = ctx.currentTime
    ;[523.25, 659.25, 783.99].forEach((freq, i) => {
      playNote(freq, now + i * 0.1, 0.4, 'sine', 0.2)
    })
  }, [ensureRunning, playNote])

  const unlock = useCallback(async () => {
    const ctx = getCtx()
    if (ctx.state === 'suspended') await ctx.resume()
  }, [getCtx])

  const toggle = useCallback(() => {
    setMuted(m => {
      const next = !m
      mutedRef.current = next
      if (gainRef.current) gainRef.current.gain.value = next ? 0 : 0.28
      return next
    })
  }, [])

  return { muted, toggle, unlock, playJingle, playWhistle, playChime, playTrainApproach, playTrainWhistle, playTrainBrake, playTrainSiren }
}

export default function AudioManager({ muted, onToggle }) {
  return (
    <button
      className="audio-toggle"
      onClick={onToggle}
      title={muted ? 'Unmute' : 'Mute'}
      aria-label={muted ? 'Unmute audio' : 'Mute audio'}
    >
      <span className="audio-icon">{muted ? '🔇' : '🔊'}</span>
      <span className="audio-label">{muted ? 'MUTED' : 'SOUND'}</span>
    </button>
  )
}
