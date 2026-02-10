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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            Browse by Category
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore manga, manhwa, and more by type
          </p>
        </div>
        <Link
          href={`/category/${active}`}
          className="group flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          View all {activeCategory.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Category tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive = active === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className="relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="category-tab"
                  className={`absolute inset-0 rounded-xl ${cat.bg} ring-1 ${cat.ring}`}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
            </button>
          )
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
