"use client"

import { useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Globe, Flame, ArrowRight, Sparkles } from "lucide-react"
import { MangaGrid } from "./manga-grid"
import { MangaGridSkeleton } from "./manga-skeleton"
import { fetcher, getCategoryUrl } from "@/lib/manga-api"
import type { MangaSearchResponse } from "@/lib/manga-api"

const categories = [
  {
    id: "manga" as const,
    label: "Manga",
    description: "Japanese comics",
    icon: BookOpen,
    color: "text-primary",
    bg: "bg-primary/10",
    ring: "ring-primary/20",
    glow: "hsl(185 100% 55% / 0.15)",
  },
  {
    id: "manhwa" as const,
    label: "Manhwa",
    description: "Korean comics",
    icon: Globe,
    color: "text-accent",
    bg: "bg-accent/10",
    ring: "ring-accent/20",
    glow: "hsl(330 90% 65% / 0.15)",
  },
  {
    id: "nsfw" as const,
    label: "NSFW / Hentai",
    description: "Adult content (18+)",
    icon: Flame,
    color: "text-destructive",
    bg: "bg-destructive/10",
    ring: "ring-destructive/20",
    glow: "hsl(0 84% 60% / 0.15)",
  },
]

export function CategorySection() {
  const [active, setActive] = useState<"manga" | "manhwa" | "nsfw">("manga")

  const { data, isLoading } = useSWR<MangaSearchResponse>(
    getCategoryUrl(active),
    fetcher
  )

  const activeCategory = categories.find((c) => c.id === active)!

  return (
    <section>
      {/* Header with scroll reveal */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <motion.div
            className="mb-2 flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Sparkles className="h-4 w-4 text-primary animate-glow-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Categories
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl"
          >
            Browse by Category
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-1 text-sm text-muted-foreground"
          >
            Explore manga, manhwa, and more by type
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link
            href={`/category/${active}`}
            className="group flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            View all {activeCategory.label}
            <motion.span
              className="inline-block"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.span>
          </Link>
        </motion.div>
      </div>

      {/* Animated category tabs */}
      <motion.div
        className="mb-8 flex flex-wrap gap-2"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {categories.map((cat, i) => {
          const isActive = active === cat.id
          return (
            <motion.button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.25 + i * 0.08,
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
                layout: { type: "spring", stiffness: 350, damping: 30 },
              }}
              className="relative flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-colors"
              style={isActive ? { boxShadow: `0 0 25px ${cat.glow}` } : {}}
            >
              {isActive && (
                <motion.div
                  layoutId="category-tab"
                  className={`absolute inset-0 rounded-xl ${cat.bg} ring-1 ${cat.ring}`}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 flex items-center gap-2 ${
                  isActive ? cat.color : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <cat.icon className={`h-4 w-4 ${isActive ? "animate-bounce-subtle" : ""}`} />
                {cat.label}
              </span>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Content with 3D-style page flip animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, rotateX: -8, y: 30, filter: "blur(6px)" }}
          animate={{ opacity: 1, rotateX: 0, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, rotateX: 8, y: -20, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
        >
          {isLoading ? (
            <MangaGridSkeleton count={12} />
          ) : data?.results?.length ? (
            <MangaGrid manga={data.results.slice(0, 12)} />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16"
            >
              <activeCategory.icon className="mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                No titles found in this category.
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
