"use client"

import { useRef, type ReactNode } from "react"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"

interface ScrollSectionProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function ScrollSection({ children, className = "", delay = 0 }: ScrollSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Parallax vertical offset
  const rawY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -20])
  const y = useSpring(rawY, { stiffness: 80, damping: 25, mass: 0.8 })

  // 3D rotation based on scroll
  const rawRotateX = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [4, 0, 0, -2])
  const rotateX = useSpring(rawRotateX, { stiffness: 80, damping: 25, mass: 0.8 })

  // Scale on enter/exit
  const rawScale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.97, 1, 1, 0.99])
  const scale = useSpring(rawScale, { stiffness: 80, damping: 25, mass: 0.8 })

  return (
    <div ref={ref} className="perspective-2000">
      <motion.div
        style={{ y, rotateX, scale }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  )
}
