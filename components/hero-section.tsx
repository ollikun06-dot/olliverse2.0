"use client"

import React from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import { Search, ArrowRight, Zap } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  // Parallax depth layers
  const bgY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 200]), {
    stiffness: 100,
    damping: 30,
  })
  const midY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 120]), {
    stiffness: 100,
    damping: 30,
  })
  const fgY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 60]), {
    stiffness: 100,
    damping: 30,
  })
  const textY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -40]), {
    stiffness: 100,
    damping: 30,
  })
  const textScale = useSpring(
    useTransform(scrollYProgress, [0, 0.5], [1, 0.92]),
    { stiffness: 100, damping: 30 }
  )
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  // 3D tilt on scroll
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.3], [0, 6]),
    { stiffness: 100, damping: 30 }
  )

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden px-4"
    >
      {/* Deep background layer - large orbs */}
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0 gpu-accelerated"
      >
        {/* Animated grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(185 100% 55% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(185 100% 55% / 0.5) 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
          }}
        />

        {/* Main energy orb */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.12, 0.2, 0.12],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/3 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(185,100%,55%)]/20 blur-[180px] gpu-accelerated"
        />

        {/* Secondary accent orb */}
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.06, 0.14, 0.06],
            x: [0, 30, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-1/4 top-2/3 h-[600px] w-[600px] rounded-full bg-[hsl(330,90%,65%)]/15 blur-[160px] gpu-accelerated"
        />
      </motion.div>

      {/* Mid layer - anime energy rings */}
      <motion.div
        style={{ y: midY }}
        className="pointer-events-none absolute inset-0 gpu-accelerated"
      >
        {/* Energy ring 1 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[hsl(185,100%,55%)]/[0.06] gpu-accelerated"
        />
        {/* Energy ring 2 */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[hsl(330,90%,65%)]/[0.04] gpu-accelerated"
        />
        {/* Energy ring 3 - dashed */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full gpu-accelerated"
          style={{
            border: "1px dashed hsl(185 100% 55% / 0.04)",
          }}
        />

        {/* Floating manga kanji accents */}
        {["READ", "MANGA", "ANIME"].map((text, i) => (
          <motion.span
            key={text}
            animate={{
              y: [0, -15, 0],
              rotate: [0, i % 2 === 0 ? 3 : -3, 0],
              opacity: [0.04, 0.07, 0.04],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
            className="absolute text-6xl font-extrabold tracking-widest text-[hsl(185,100%,55%)] select-none gpu-accelerated lg:text-8xl"
            style={{
              top: `${20 + i * 25}%`,
              left: i === 1 ? "auto" : `${8 + i * 5}%`,
              right: i === 1 ? "8%" : "auto",
              writingMode: i === 0 ? "vertical-rl" : "horizontal-tb",
            }}
          >
            {text}
          </motion.span>
        ))}
      </motion.div>

      {/* Foreground layer - speed lines */}
      <motion.div
        style={{ y: fgY }}
        className="pointer-events-none absolute inset-0 gpu-accelerated"
      >
        {/* Anime speed lines */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: ["-100%", "200%"],
                opacity: [0, 0.04, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "linear",
              }}
              className="absolute h-px gpu-accelerated"
              style={{
                width: `${60 + Math.random() * 120}px`,
                top: `${5 + i * 8}%`,
                background: `linear-gradient(90deg, transparent, hsl(185 100% 55% / 0.3), transparent)`,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Content - 3D perspective wrapper */}
      <motion.div
        style={{
          y: textY,
          scale: textScale,
          opacity: textOpacity,
          rotateX,
        }}
        className="relative z-10 mx-auto max-w-4xl text-center perspective-2000 preserve-3d"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 24, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[hsl(185,100%,55%)]/20 bg-[hsl(185,100%,55%)]/[0.06] px-5 py-2 text-sm font-bold uppercase tracking-wider text-primary neon-text glass-card"
          >
            <Zap className="h-4 w-4 animate-pulse" />
            New quest unlocked
          </motion.div>
        </motion.div>

        {/* Title with 3D depth */}
        <motion.h1
          initial={{ opacity: 0, y: 30, rotateX: 15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-balance text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-8xl"
        >
          Enter the{" "}
          <motion.span
            className="relative inline-block"
            whileHover={{ scale: 1.05, rotateY: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="relative z-10 bg-gradient-to-r from-primary via-[hsl(200,100%,65%)] to-primary bg-clip-text text-transparent">
              OlliVerse
            </span>
            {/* Animated underline energy bar */}
            <motion.span
              animate={{
                scaleX: [0.8, 1.2, 0.8],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-primary/50 blur-sm"
            />
            <motion.span
              animate={{
                scaleX: [1, 0.8, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-primary"
            />
          </motion.span>
        </motion.h1>

        {/* Subtitle with depth offset */}
        <motion.p
          initial={{ opacity: 0, y: 20, z: -20 }}
          animate={{ opacity: 1, y: 0, z: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground lg:text-xl"
          style={{ transform: "translateZ(-10px)" }}
        >
          Level up your manga game. Explore thousands of titles, track your reading quests, and discover your next obsession.
        </motion.p>

        {/* 3D Search bar */}
        <motion.form
          initial={{ opacity: 0, y: 20, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSearch}
          className="mx-auto mt-10 flex max-w-lg items-center gap-3"
          style={{ transform: "translateZ(30px)" }}
        >
          <motion.div
            whileHover={{ scale: 1.02, rotateY: -2 }}
            className="relative flex-1"
          >
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for your next quest..."
              className="w-full rounded-2xl border border-border bg-[hsl(240,15%,7%)]/80 py-4 pl-12 pr-4 text-foreground shadow-2xl shadow-[hsl(185,100%,55%)]/[0.05] backdrop-blur-xl placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 neon-box transition-all"
            />
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.08, rotateY: 5 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="flex h-[56px] items-center gap-2 rounded-2xl bg-primary px-6 font-bold text-primary-foreground shadow-xl shadow-[hsl(185,100%,55%)]/30 transition-shadow hover:shadow-[hsl(185,100%,55%)]/50 neon-border"
          >
            Go
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.form>

        {/* Quick links with 3D hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
          style={{ transform: "translateZ(15px)" }}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Hot quests:
          </span>
          {["One Piece", "Naruto", "Jujutsu Kaisen", "Chainsaw Man"].map(
            (title) => (
              <motion.div
                key={title}
                whileHover={{ scale: 1.1, rotateY: 8, z: 10 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Link
                  href={`/search?q=${encodeURIComponent(title)}`}
                  className="block rounded-xl border border-border bg-[hsl(240,15%,7%)]/60 px-3 py-1.5 text-xs font-bold text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-primary/[0.08] hover:text-primary hover:neon-box hover:shadow-lg hover:shadow-[hsl(185,100%,55%)]/10"
                >
                  {title}
                </Link>
              </motion.div>
            )
          )}
        </motion.div>
      </motion.div>

      {/* Scroll indicator with 3D bounce */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
            Scroll
          </span>
          <div className="h-8 w-5 rounded-full border border-muted-foreground/20">
            <motion.div
              animate={{ y: [2, 12, 2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto mt-1 h-2 w-1 rounded-full bg-primary/60"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
