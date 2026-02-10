"use client"

import React from "react"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search, ArrowRight, Swords, Shield, Zap, Star } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(hsl(185 100% 55% / 0.6) 1px, transparent 1px), linear-gradient(90deg, hsl(185 100% 55% / 0.6) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
        {/* Main cyan glow */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.18, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
          className="absolute left-1/2 top-1/3 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[150px] gpu-accelerated"
        />
        {/* Pink accent glow */}
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.06, 0.12, 0.06],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
          className="absolute right-1/4 top-2/3 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[120px] gpu-accelerated"
        />

        {/* Floating RPG icons */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
          className="absolute left-[10%] top-[25%] flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 gpu-accelerated"
        >
          <Swords className="h-6 w-6 text-primary/40" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 8, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: [0.4, 0, 0.6, 1], delay: 1 }}
          className="absolute right-[12%] top-[30%] flex h-10 w-10 items-center justify-center rounded-2xl border border-accent/10 bg-accent/5 gpu-accelerated"
        >
          <Shield className="h-5 w-5 text-accent/40" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -7, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: [0.4, 0, 0.6, 1], delay: 2 }}
          className="absolute left-[20%] bottom-[25%] flex h-10 w-10 items-center justify-center rounded-2xl border border-chart-3/10 bg-chart-3/5 gpu-accelerated"
        >
          <Star className="h-5 w-5 text-chart-3/40" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-balance text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-8xl"
        >
          Enter the{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-primary neon-text">
              OlliVerse
            </span>
            <motion.span
              animate={{ scaleX: [0.95, 1.05, 0.95] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-primary/40 blur-sm"
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground lg:text-xl"
        >
          Level up your manga game. Explore thousands of titles, track your reading quests, and discover your next obsession.
        </motion.p>

        {/* Search bar */}
        <motion.form
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSearch}
          className="mx-auto mt-10 flex max-w-lg items-center gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for your next quest..."
              className="w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-4 text-foreground shadow-lg placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 neon-box transition-all"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hot quests:</span>
          {["One Piece", "Naruto", "Jujutsu Kaisen", "Chainsaw Man"].map(
            (title) => (
              <Link
                key={title}
                href={`/search?q=${encodeURIComponent(title)}`}
                className="rounded-xl border border-border bg-card/50 px-3 py-1.5 text-xs font-bold text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary hover:neon-box"
              >
                {title}
              </Link>
            )
          )}
        </motion.div>
      </div>
    </section>
  )
}
