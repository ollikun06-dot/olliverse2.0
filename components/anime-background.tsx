"use client"

import { motion } from "framer-motion"
import { useMouseParallax } from "@/hooks/use-parallax"

export function AnimeBackground() {
  const mouse = useMouseParallax(0.015)

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
      {/* Base anime BG image with parallax */}
      <motion.div
        animate={{ x: mouse.x * 0.5, y: mouse.y * 0.5 }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
        className="absolute inset-[-20px]"
      >
        <img
          src="/anime-bg.jpg"
          alt=""
          className="h-full w-full object-cover opacity-[0.12]"
          loading="eager"
          decoding="async"
        />
      </motion.div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 anime-gradient opacity-80" />

      {/* Large cyan energy orb */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.06, 0.12, 0.06],
          x: mouse.x * 1.5,
          y: mouse.y * 1.5,
        }}
        transition={{
          scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          x: { type: "spring", stiffness: 30, damping: 30 },
          y: { type: "spring", stiffness: 30, damping: 30 },
        }}
        className="absolute left-1/3 top-1/4 h-[600px] w-[600px] rounded-full bg-primary/20 blur-[180px]"
      />

      {/* Pink accent orb */}
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.04, 0.08, 0.04],
          x: mouse.x * -1,
          y: mouse.y * -1,
        }}
        transition={{
          scale: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          x: { type: "spring", stiffness: 25, damping: 30 },
          y: { type: "spring", stiffness: 25, damping: 30 },
        }}
        className="absolute right-1/4 bottom-1/3 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[150px]"
      />

      {/* Floating manga speed lines */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: ["-100%", "200%"],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut",
            }}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"
            style={{
              top: `${15 + i * 18}%`,
              width: "40%",
            }}
          />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(hsl(185 100% 55% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(185 100% 55% / 0.5) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(228_20%_5%)_100%)]" />
    </div>
  )
}
