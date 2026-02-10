"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import { Search, ArrowRight, Zap, BookOpen, Sparkles } from "lucide-react"
import Link from "next/link"
import { useMouseParallax } from "@/hooks/use-parallax"

export function HeroSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const mouse = useMouseParallax(0.02)
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[95vh] flex-col items-center justify-center overflow-hidden px-4"
      style={{ position: "relative" }}
    >
      {/* Hero anime BG with parallax */}
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-[-40px]"
      >
        <motion.div
          animate={{ x: mouse.x * 0.8, y: mouse.y * 0.8 }}
          transition={{ type: "spring", stiffness: 40, damping: 30 }}
        >
          <img
            src="/hero-anime-bg.jpg"
            alt=""
            className="h-full w-full object-cover opacity-20"
            loading="eager"
            decoding="async"
          />
        </motion.div>
      </motion.div>

      {/* Animated overlays */}
      <div className="pointer-events-none absolute inset-0">
        {/* Gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />

        {/* Grid pattern - anime style */}
        <motion.div
          animate={{ x: mouse.x * 0.3, y: mouse.y * 0.3 }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(hsl(185 100% 55% / 0.6) 1px, transparent 1px), linear-gradient(90deg, hsl(185 100% 55% / 0.6) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Main cyan glow with mouse follow */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.12, 0.2, 0.12],
            x: mouse.x * 2,
            y: mouse.y * 2,
          }}
          transition={{
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            x: { type: "spring", stiffness: 30, damping: 25 },
            y: { type: "spring", stiffness: 30, damping: 25 },
          }}
          className="absolute left-1/2 top-1/3 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[150px] gpu-accelerated"
        />

        {/* Pink accent glow */}
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.06, 0.14, 0.06],
            x: mouse.x * -1.5,
            y: mouse.y * -1.5,
          }}
          transition={{
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 10, repeat: Infinity, ease: "easeInOut" },
            x: { type: "spring", stiffness: 25, damping: 25 },
            y: { type: "spring", stiffness: 25, damping: 25 },
          }}
          className="absolute right-1/4 top-2/3 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[130px] gpu-accelerated"
        />

        {/* Floating anime elements - parallax layers */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0], x: mouse.x * 0.6 }}
          transition={{
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            x: { type: "spring", stiffness: 40, damping: 20 },
          }}
          className="absolute left-[8%] top-[22%] flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 backdrop-blur-sm gpu-accelerated"
        >
          <BookOpen className="h-7 w-7 text-primary/50" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, -4, 0], x: mouse.x * -0.4 }}
          transition={{
            y: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 },
            rotate: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 },
            x: { type: "spring", stiffness: 35, damping: 20 },
          }}
          className="absolute right-[10%] top-[28%] flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/15 bg-accent/5 backdrop-blur-sm gpu-accelerated"
        >
          <Sparkles className="h-6 w-6 text-accent/50" />
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 6, 0], x: mouse.x * 0.5 }}
          transition={{
            y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 },
            rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 },
            x: { type: "spring", stiffness: 35, damping: 20 },
          }}
          className="absolute left-[18%] bottom-[22%] flex h-10 w-10 items-center justify-center rounded-2xl border border-chart-3/15 bg-chart-3/5 backdrop-blur-sm gpu-accelerated"
        >
          <Zap className="h-5 w-5 text-chart-3/50" />
        </motion.div>

        {/* Speed lines - manga aesthetic */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: ["-100%", "250%"],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 2 + i * 0.8,
              repeat: Infinity,
              delay: i * 3,
              ease: "easeInOut",
            }}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            style={{
              top: `${30 + i * 15}%`,
              width: "30%",
            }}
          />
        ))}
      </div>

      {/* Content with parallax scroll and 3D */}
      <motion.div
        style={{ y: textY, opacity, scale }}
        className="relative z-10 mx-auto max-w-4xl text-center perspective-2000"
      >
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="preserve-3d"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-5 py-2 text-sm font-bold uppercase tracking-wider text-primary neon-text animate-energy-pulse"
          >
            <Zap className="h-4 w-4 animate-glow-pulse" />
            Your manga adventure awaits
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-balance text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-8xl preserve-3d"
        >
          <motion.span
            animate={{ x: mouse.x * 0.3, y: mouse.y * 0.3 }}
            transition={{ type: "spring", stiffness: 100, damping: 30 }}
            className="inline-block"
          >
            Enter the{" "}
          </motion.span>
          <span className="relative inline-block">
            <motion.span
              animate={{ x: mouse.x * 0.5, y: mouse.y * 0.5 }}
              transition={{ type: "spring", stiffness: 80, damping: 25 }}
              className="relative z-10 inline-block text-primary neon-text"
            >
              OlliVerse
            </motion.span>
            <motion.span
              animate={{ scaleX: [0.9, 1.1, 0.9], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-2 left-0 right-0 h-1.5 rounded-full bg-primary/50 blur-sm"
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground lg:text-xl"
        >
          Level up your manga game. Explore thousands of titles, track your reading progress, and discover your next obsession.
        </motion.p>

        {/* Search bar with 3D hover */}
        <motion.form
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSearch}
          className="mx-auto mt-10 flex max-w-lg items-center gap-3"
        >
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search manga, manhwa..."
              className="w-full rounded-2xl border border-border bg-card/80 py-4 pl-12 pr-4 text-foreground shadow-lg backdrop-blur-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 neon-box transition-all"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.06, rotateZ: 1 }}
            whileTap={{ scale: 0.94 }}
            type="submit"
            className="flex h-[56px] items-center gap-2 rounded-2xl bg-primary px-6 font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-shadow hover:shadow-primary/50"
          >
            Go
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.form>

        {/* Quick links with stagger animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Trending:
          </span>
          {["One Piece", "Solo Leveling", "Jujutsu Kaisen", "Chainsaw Man"].map(
            (title, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={`/search?q=${encodeURIComponent(title)}`}
                  className="block rounded-xl border border-border bg-card/60 px-3.5 py-2 text-xs font-bold text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary hover:neon-box"
                >
                  {title}
                </Link>
              </motion.div>
            )
          )}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            Scroll
          </span>
          <div className="h-6 w-4 rounded-full border border-muted-foreground/20">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto mt-1 h-1.5 w-1.5 rounded-full bg-primary/60"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
