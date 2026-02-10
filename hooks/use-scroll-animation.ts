"use client"

import { useRef } from "react"
import { useScroll, useTransform, useSpring, type MotionValue } from "framer-motion"

interface ScrollAnimationConfig {
  offset?: [string, string]
  springConfig?: { stiffness: number; damping: number; mass: number }
}

interface ScrollAnimationResult {
  ref: React.RefObject<HTMLDivElement | null>
  opacity: MotionValue<number>
  y: MotionValue<number>
  scale: MotionValue<number>
  rotateX: MotionValue<number>
}

export function useScrollAnimation(config: ScrollAnimationConfig = {}): ScrollAnimationResult {
  const {
    offset = ["start end", "end start"],
    springConfig = { stiffness: 100, damping: 30, mass: 0.8 },
  } = config

  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as ["start end", "end start"],
  })

  const rawOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.7])
  const rawY = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [80, 0, 0, -30])
  const rawScale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.92, 1, 1, 0.98])
  const rawRotateX = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [8, 0, 0, -3])

  const opacity = useSpring(rawOpacity, springConfig)
  const y = useSpring(rawY, springConfig)
  const scale = useSpring(rawScale, springConfig)
  const rotateX = useSpring(rawRotateX, springConfig)

  return { ref, opacity, y, scale, rotateX }
}

export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed])
  const smoothY = useSpring(y, { stiffness: 100, damping: 30, mass: 0.8 })

  return { ref, y: smoothY }
}
