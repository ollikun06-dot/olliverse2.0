"use client"

import React from "react"

import { motion, useMotionValue, useTransform } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Search, ArrowRight, Swords, Shield, Zap, Star, Sparkles, Crown } from "lucide-react"
import Link from "next/link"

function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-primary/30"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: `${Math.random() * 20}%`,
            animation: `float-particle ${8 + Math.random() * 12}s linear infinite`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  )
}

export function HeroSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const bgX = useTransform(mouseX, [0, 1], [-15, 15])
  const bgY = useTransform(mouseY, [0, 1], [-15, 15])

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    }
    window.addEventListener("mousemove", handleMouse)
    return () => window.removeEventListener("mousemove", handleMouse)
  }, [mouseX, mouseY])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const stagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4">
      {/* 3D background will be injected here by parent */}

      {/* Animated background layers */}
      <div className="pointer-events-none absolute inset-0">
        {/* Parallax grid pattern */}
        <motion.div
          style={{ x: bgX, y: bgY }}
          className="absolute inset-[-50px] opacity-[0.04]"
          transition={{ type: "spring", stiffness: 50 }}
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `linear-gradient(hsl(185 100% 55% / 0.6) 1px, transparent 1px), linear-gradient(90deg, hsl(185 100% 55% / 0.6) 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
            }}
          />
        </motion.div>

        {/* Scan line effect */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(185 100% 55% / 0.1) 2px, hsl(185 100% 55% / 0.1) 4px)",
          }}
        />

        {/* Main cyan glow - parallax */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.22, 0.1],
          }}
          style={{ x: bgX, y: bgY }}
          transition={{ duration: 8, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
          className="absolute left-1/2 top-1/3 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[150px] gpu-accelerated"
        />
        {/* Pink accent glow - parallax */}
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.06, 0.15, 0.06],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
          className="absolute right-1/4 top-2/3 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[120px] gpu-accelerated"
        />
        {/* Third glow - green accent */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.04, 0.1, 0.04],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: [0.4, 0, 0.6, 1], delay: 3 }}
          className="absolute left-1/4 top-1/2 h-[400px] w-[400px] rounded-full bg-chart-3/10 blur-[100px] gpu-accelerated"
        />

        {/* Floating RPG icons - more of them with more animation */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 8, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
          className="absolute left-[10%] top-[25%] flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 gpu-accelerated"
        >
          <Swords className="h-6 w-6 text-primary/40" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, -5, 0], scale: [1.05, 0.95, 1.05] }}
          transition={{ duration: 8, repeat: Infinity, ease: [0.4, 0, 0.6, 1], delay: 1 }}
          className="absolute right-[12%] top-[30%] flex h-10 w-10 items-center justify-center rounded-2xl border border-accent/10 bg-accent/5 gpu-accelerated"
        >
          <Shield className="h-5 w-5 text-accent/40" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: [0.4, 0, 0.6, 1], delay: 2 }}
          className="absolute left-[20%] bottom-[25%] flex h-10 w-10 items-center justify-center rounded-2xl border border-chart-3/10 bg-chart-3/5 gpu-accelerated"
        >
          <Star className="h-5 w-5 text-chart-3/40" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, -4, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: [0.4, 0, 0.6, 1], delay: 3 }}
          className="absolute right-[8%] bottom-[35%] flex h-11 w-11 items-center justify-center rounded-2xl border border-chart-4/10 bg-chart-4/5 gpu-accelerated"
        >
          <Crown className="h-5 w-5 text-chart-4/40" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: [0.4, 0, 0.6, 1], delay: 4 }}
          className="absolute left-[8%] top-[60%] flex h-9 w-9 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 gpu-accelerated"
        >
          <Sparkles className="h-4 w-4 text-primary/40" />
        </motion.div>
      </div>

      <FloatingParticles />

      {/* Content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        <motion.div variants={fadeUp}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-bold uppercase tracking-wider text-primary neon-text"
          >
            <Zap className="h-4 w-4 animate-glow-pulse" />
            New quest unlocked
          </motion.div>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-balance text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-8xl"
        >
          Enter the{" "}
          <span className="relative inline-block">
            <motion.span
              className="relative z-10 text-primary neon-text"
              animate={{
                textShadow: [
                  "0 0 8px hsl(185 100% 55% / 0.4), 0 0 30px hsl(185 100% 55% / 0.15)",
                  "0 0 16px hsl(185 100% 55% / 0.6), 0 0 60px hsl(185 100% 55% / 0.25)",
                  "0 0 8px hsl(185 100% 55% / 0.4), 0 0 30px hsl(185 100% 55% / 0.15)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              OlliVerse
            </motion.span>
            <motion.span
              animate={{ scaleX: [0.95, 1.05, 0.95], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-primary/40 blur-sm"
            />
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground lg:text-xl"
        >
          Level up your manga game. Explore thousands of titles, track your reading quests, and discover your next obsession.
        </motion.p>

        {/* Search bar */}
        <motion.form
          variants={fadeUp}
          onSubmit={handleSearch}
          className="mx-auto mt-10 flex max-w-lg items-center gap-3"
        >
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for your next quest..."
              className="w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-4 text-foreground shadow-lg placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 neon-box transition-all"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(185 100% 55% / 0.4)" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="flex h-[56px] items-center gap-2 rounded-2xl bg-primary px-6 font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-shadow hover:shadow-primary/50"
          >
            Go
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.form>

        {/* Quick links */}
        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Trending:</span>
          {["One Piece", "Naruto", "Jujutsu Kaisen", "Chainsaw Man", "Solo Leveling"].map(
            (title, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.08, duration: 0.4 }}
              >
                <Link
                  href={`/search?q=${encodeURIComponent(title)}`}
                  className="rounded-xl border border-border bg-card/50 px-3 py-1.5 text-xs font-bold text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary hover:neon-box hover:scale-105"
                >
                  {title}
                </Link>
              </motion.div>
            )
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}
