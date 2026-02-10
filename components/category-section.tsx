"use client"

import { useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Globe, Flame, ArrowRight } from "lucide-react"
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
  },
  {
    id: "manhwa" as const,
    label: "Manhwa",
    description: "Korean comics",
    icon: Globe,
    color: "text-accent",
    bg: "bg-accent/10",
    ring: "ring-accent/20",
  },
  {
    id: "nsfw" as const,
    label: "NSFW / Hentai",
    description: "Adult content (18+)",
    icon: Flame,
    color: "text-destructive",
    bg: "bg-destructive/10",
    ring: "ring-destructive/20",
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
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            Browse by Category
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore manga, manhwa, and more by type
          </p>
        </div>
        <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}>
          <Link
            href={`/category/${active}`}
            className="group flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            View all {activeCategory.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Category tabs with 3D transitions */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive = active === cat.id
          return (
            <motion.button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors"
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
                <cat.icon className="h-4 w-4" />
                {cat.label}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Content with 3D flip transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 15, rotateX: 5, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, rotateX: -5, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="perspective-1000"
        >
          {isLoading ? (
            <MangaGridSkeleton count={12} />
          ) : data?.results?.length ? (
            <MangaGrid manga={data.results.slice(0, 12)} />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
              <activeCategory.icon className="mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                No titles found in this category.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
