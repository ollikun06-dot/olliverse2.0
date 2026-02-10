"use client"

import { use, useState } from "react"
import useSWR from "swr"
import { Navbar } from "@/components/navbar"
import { MangaGrid } from "@/components/manga-grid"
import { MangaGridSkeleton } from "@/components/manga-skeleton"
import { fetcher, getCategoryUrl } from "@/lib/manga-api"
import type { MangaSearchResponse } from "@/lib/manga-api"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Globe, Flame, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const categoryMeta: Record<
  string,
  { label: string; description: string; icon: typeof BookOpen; color: string; bg: string; glow: string }
> = {
  manga: {
    label: "Manga",
    description: "Browse popular Japanese manga titles",
    icon: BookOpen,
    color: "text-primary",
    bg: "bg-primary/10",
    glow: "hsl(185 100% 55% / 0.12)",
  },
  manhwa: {
    label: "Manhwa",
    description: "Browse popular Korean manhwa titles",
    icon: Globe,
    color: "text-accent",
    bg: "bg-accent/10",
    glow: "hsl(330 90% 65% / 0.12)",
  },
  nsfw: {
    label: "NSFW / Hentai",
    description: "Browse adult content (18+)",
    icon: Flame,
    color: "text-destructive",
    bg: "bg-destructive/10",
    glow: "hsl(0 84% 60% / 0.12)",
  },
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [page, setPage] = useState(1)

  const category = (["manga", "manhwa", "nsfw"].includes(slug) ? slug : "manga") as
    | "manga"
    | "manhwa"
    | "nsfw"

  const meta = categoryMeta[category] || categoryMeta.manga
  const Icon = meta.icon

  const { data, isLoading } = useSWR<MangaSearchResponse>(
    getCategoryUrl(category, page),
    fetcher
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header with animated back button */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Link
                href="/"
                className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground group"
              >
                <motion.span whileHover={{ x: -3 }} transition={{ type: "spring", stiffness: 400 }}>
                  <ChevronLeft className="h-4 w-4" />
                </motion.span>
                Back to Home
              </Link>
            </motion.div>

            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${meta.bg} ring-1 ring-border`}
                style={{ boxShadow: `0 0 20px ${meta.glow}` }}
              >
                <Icon className={`h-6 w-6 ${meta.color}`} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                  {meta.label}
                </h1>
                <p className="text-sm text-muted-foreground">{meta.description}</p>
              </motion.div>
            </div>

            {/* Category switcher with animated tab indicator */}
            <motion.div
              className="mt-6 flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              {Object.entries(categoryMeta).map(([key, val]) => {
                const isActive = key === category
                const CatIcon = val.icon
                return (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={`/category/${key}`}
                      className="relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-colors"
                      style={isActive ? { boxShadow: `0 0 25px ${val.glow}` } : {}}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="cat-page-tab"
                          className={`absolute inset-0 rounded-xl ${val.bg} ring-1 ring-border`}
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                      <span
                        className={`relative z-10 flex items-center gap-2 ${
                          isActive ? val.color : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <CatIcon className="h-4 w-4" />
                        {val.label}
                      </span>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>

          {/* Grid with page transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${category}-${page}`}
              initial={{ opacity: 0, rotateX: -5, y: 25, filter: "blur(4px)" }}
              animate={{ opacity: 1, rotateX: 0, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, rotateX: 5, y: -15, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: "1200px" }}
            >
              {isLoading ? (
                <MangaGridSkeleton count={20} />
              ) : data?.results?.length ? (
                <MangaGrid manga={data.results} />
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20"
                >
                  <Icon className="mb-3 h-10 w-10 text-muted-foreground/30" />
                  <p className="text-muted-foreground">No titles found.</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Animated pagination */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.06, x: -3 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-secondary hover:border-primary/20 disabled:cursor-not-allowed disabled:opacity-40 anime-hover"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </motion.button>
            <motion.span
              key={page}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-xl bg-primary/10 px-5 py-2.5 text-sm font-bold text-primary ring-1 ring-primary/20"
              style={{ boxShadow: "0 0 15px hsl(185 100% 55% / 0.1)" }}
            >
              Page {page}
            </motion.span>
            <motion.button
              whileHover={{ scale: 1.06, x: 3 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setPage((p) => p + 1)}
              disabled={!data?.hasNextPage}
              className="flex items-center gap-1 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-secondary hover:border-primary/20 disabled:cursor-not-allowed disabled:opacity-40 anime-hover"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
