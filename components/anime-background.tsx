"use client"

import { useEffect, useRef, useCallback } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  hue: number
}

export function AnimeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const { scrollY } = useScroll()

  const initParticles = useCallback((width: number, height: number) => {
    const count = Math.min(Math.floor((width * height) / 18000), 80)
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.4 - 0.1,
      opacity: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.7 ? 330 : 185,
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles(canvas.width, canvas.height)
    }
    resize()
    window.addEventListener("resize", resize)

    function animate() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particlesRef.current) {
        p.x += p.speedX
        p.y += p.speedY

        if (p.y < -10) {
          p.y = canvas.height + 10
          p.x = Math.random() * canvas.width
        }
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 100%, ${p.hue === 185 ? "65%" : "70%"}, ${p.opacity})`
        ctx.fill()

        // Glow effect
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 100%, ${p.hue === 185 ? "65%" : "70%"}, ${p.opacity * 0.15})`
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [initParticles])

  // Parallax layers
  const layer1Y = useTransform(scrollY, [0, 3000], [0, -400])
  const layer2Y = useTransform(scrollY, [0, 3000], [0, -200])
  const layer3Y = useTransform(scrollY, [0, 3000], [0, -100])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Deep space layer */}
      <motion.div
        style={{ y: layer1Y }}
        className="absolute inset-0 gpu-accelerated"
      >
        <div className="absolute left-1/4 top-[10%] h-[600px] w-[600px] rounded-full bg-primary/[0.04] blur-[180px]" />
        <div className="absolute right-1/4 top-[40%] h-[500px] w-[500px] rounded-full bg-accent/[0.03] blur-[160px]" />
        <div className="absolute left-1/2 top-[70%] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-primary/[0.03] blur-[200px]" />
      </motion.div>

      {/* Mid-depth anime speed lines */}
      <motion.div
        style={{ y: layer2Y }}
        className="absolute inset-0 gpu-accelerated"
      >
        {/* Diagonal speed lines - deterministic values to avoid hydration mismatch */}
        <div className="absolute inset-0 opacity-[0.02]">
          {[
            { w: 245, top: 10, left: 12, rot: -11, op: 0.55 },
            { w: 188, top: 22, left: 53, rot: -9, op: 0.68 },
            { w: 297, top: 34, left: 6, rot: -13, op: 0.42 },
            { w: 161, top: 46, left: 61, rot: -7, op: 0.73 },
            { w: 213, top: 58, left: 35, rot: -14, op: 0.51 },
            { w: 270, top: 70, left: 72, rot: -10, op: 0.38 },
            { w: 198, top: 82, left: 26, rot: -12, op: 0.65 },
            { w: 149, top: 94, left: 48, rot: -8, op: 0.45 },
          ].map((line, i) => (
            <div
              key={i}
              className="absolute h-px bg-primary"
              style={{
                width: `${line.w}px`,
                top: `${line.top}%`,
                left: `${line.left}%`,
                transform: `rotate(${line.rot}deg)`,
                opacity: line.op,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Foreground particles canvas */}
      <motion.div
        style={{ y: layer3Y }}
        className="absolute inset-0 gpu-accelerated"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ mixBlendMode: "screen" }}
        />
      </motion.div>

      {/* Scanline overlay for anime CRT feel */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(185 100% 55% / 0.03) 2px, transparent 4px)`,
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(240,15%,5%)_100%)]" />
    </div>
  )
}
